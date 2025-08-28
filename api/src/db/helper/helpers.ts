import { client } from "..";

// Users table
const createUserTable = async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log("Users table created successfully");
    } catch (error) {
        console.log("Error creating user table:", error);
    }
}

// Recipes table
const createRecipesTable = async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS recipes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            difficulty VARCHAR(20) DEFAULT 'medium',
            cooking_time INTEGER NOT NULL,
            cuisine_type VARCHAR(100),
            dietary_tags VARCHAR(255),
            image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log("Recipes table created successfully");
    } catch (error) {
        console.log("Error creating recipes table:", error);
    }
}

// User Favorites table
const createUserFavoritesTable = async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS user_favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            recipe_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, recipe_id)
        )`);
        console.log("User favorites table created successfully");
    } catch (error) {
        console.log("Error creating user favorites table:", error);
    }
}

// Available Ingredients table
const createIngredientsTable = async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS ingredients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            category VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log("Ingredients table created successfully");
    } catch (error) {
        console.log("Error creating ingredients table:", error);
    }
}

// Initialize database
const initializeDatabase = async () => {
    console.log("Initializing database schema...");
    await createUserTable();
    await createRecipesTable();
    await createUserFavoritesTable();
    await createIngredientsTable();
    console.log("Database initialization complete!");
}

export { 
    initializeDatabase,
    createUserTable,
    createRecipesTable,
    createUserFavoritesTable,
    createIngredientsTable
};








