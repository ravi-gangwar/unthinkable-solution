import { client } from "..";

export const seedIngredients = async () => {
    try {
        const ingredients = [
            // Proteins
            { name: "chicken breast", category: "protein" },
            { name: "ground beef", category: "protein" },
            { name: "salmon", category: "protein" },
            { name: "eggs", category: "protein" },
            { name: "tofu", category: "protein" },
            { name: "shrimp", category: "protein" },
            
            // Vegetables
            { name: "onion", category: "vegetable" },
            { name: "garlic", category: "vegetable" },
            { name: "tomato", category: "vegetable" },
            { name: "bell pepper", category: "vegetable" },
            { name: "carrot", category: "vegetable" },
            { name: "broccoli", category: "vegetable" },
            { name: "spinach", category: "vegetable" },
            { name: "mushroom", category: "vegetable" },
            { name: "cucumber", category: "vegetable" },
            { name: "lettuce", category: "vegetable" },
            
            // Grains & Starches
            { name: "rice", category: "grain" },
            { name: "pasta", category: "grain" },
            { name: "bread", category: "grain" },
            { name: "quinoa", category: "grain" },
            { name: "potato", category: "grain" },
            { name: "flour", category: "grain" },
            
            // Dairy
            { name: "milk", category: "dairy" },
            { name: "cheese", category: "dairy" },
            { name: "butter", category: "dairy" },
            { name: "yogurt", category: "dairy" },
            
            // Pantry Items
            { name: "olive oil", category: "pantry" },
            { name: "salt", category: "pantry" },
            { name: "pepper", category: "pantry" },
            { name: "soy sauce", category: "pantry" },
            { name: "vinegar", category: "pantry" },
            { name: "sugar", category: "pantry" },
            { name: "baking powder", category: "pantry" },
            
            // Herbs & Spices
            { name: "basil", category: "herb" },
            { name: "oregano", category: "herb" },
            { name: "thyme", category: "herb" },
            { name: "rosemary", category: "herb" },
            { name: "parsley", category: "herb" },
            { name: "cilantro", category: "herb" },
        ];

        console.log("Starting ingredient seeding...");
        
        for (const ingredient of ingredients) {
            await client.query(`
                INSERT INTO ingredients (name, category)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING
            `, [ingredient.name, ingredient.category]);
        }

        console.log(`Successfully seeded ${ingredients.length} ingredients!`);
    } catch (error) {
        console.log("Error seeding ingredients:", error);
    }
};
