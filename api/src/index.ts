import 'dotenv/config'; // Load environment variables
import express from 'express';
import v1Router from './router/v1/router';
import { connectionToDB } from './db';
import { initializeDatabase } from './db/helper/helpers';
import { seedRecipes } from './db/seeds/recipeSeeds';
import { seedIngredients } from './db/seeds/ingredientSeeds';
import cors from 'cors';

const app = express();

const initApp = async () => {
    try {
        await connectionToDB();
        await initializeDatabase();
        await seedIngredients();
        await seedRecipes();
        console.log("Application initialized successfully!");
    } catch (error) {
        console.log("Failed to initialize application:", error);
    }
};

initApp();

app.use(express.json());
app.use(cors());

app.get("/", ((req, res) => {
    res.send("Hello World")
}));

app.use("/api/v1", v1Router)

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});