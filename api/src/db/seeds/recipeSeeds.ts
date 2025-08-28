import { client } from "..";

export const seedRecipes = async () => {
    try {
        const recipes = [
            {
                name: "Chicken Fried Rice",
                description: "Quick and delicious fried rice with chicken",
                ingredients: "chicken breast, rice, eggs, onion, garlic, soy sauce, oil",
                instructions: "1. Cook rice. 2. Cook chicken. 3. Scramble eggs. 4. Stir-fry everything together.",
                difficulty: "easy",
                cooking_time: 25,
                cuisine_type: "Asian",
                dietary_tags: ""
            },
            {
                name: "Pasta with Tomato Sauce",
                description: "Simple pasta with fresh tomato sauce",
                ingredients: "pasta, tomatoes, garlic, onion, olive oil, basil",
                instructions: "1. Cook pasta. 2. Make tomato sauce. 3. Combine and serve.",
                difficulty: "easy",
                cooking_time: 20,
                cuisine_type: "Italian",
                dietary_tags: "vegetarian"
            },
            {
                name: "Scrambled Eggs",
                description: "Quick breakfast scrambled eggs",
                ingredients: "eggs, butter, milk, salt, pepper",
                instructions: "1. Beat eggs. 2. Cook in pan with butter. 3. Scramble until fluffy.",
                difficulty: "easy",
                cooking_time: 5,
                cuisine_type: "American",
                dietary_tags: "vegetarian"
            },
            {
                name: "Grilled Chicken Salad",
                description: "Healthy grilled chicken with mixed greens",
                ingredients: "chicken breast, lettuce, tomatoes, cucumber, olive oil, lemon",
                instructions: "1. Grill chicken. 2. Prepare salad. 3. Add dressing and serve.",
                difficulty: "easy",
                cooking_time: 15,
                cuisine_type: "American",
                dietary_tags: "gluten-free"
            },
            {
                name: "Beef Tacos",
                description: "Traditional ground beef tacos",
                ingredients: "ground beef, tortillas, onion, tomatoes, cheese, lettuce",
                instructions: "1. Cook beef. 2. Warm tortillas. 3. Assemble tacos with toppings.",
                difficulty: "easy",
                cooking_time: 20,
                cuisine_type: "Mexican",
                dietary_tags: ""
            },
            {
                name: "Vegetable Stir Fry",
                description: "Quick and healthy vegetable stir fry",
                ingredients: "mixed vegetables, garlic, ginger, soy sauce, oil, rice",
                instructions: "1. Heat oil. 2. Stir fry vegetables. 3. Add sauce. 4. Serve over rice.",
                difficulty: "easy",
                cooking_time: 15,
                cuisine_type: "Asian",
                dietary_tags: "vegetarian,vegan"
            },
            {
                name: "Pancakes",
                description: "Fluffy breakfast pancakes",
                ingredients: "flour, eggs, milk, sugar, baking powder, butter",
                instructions: "1. Mix dry ingredients. 2. Add wet ingredients. 3. Cook on griddle.",
                difficulty: "medium",
                cooking_time: 20,
                cuisine_type: "American",
                dietary_tags: "vegetarian"
            },
            {
                name: "Fish and Chips",
                description: "Classic fish and chips",
                ingredients: "white fish, potatoes, flour, oil, salt, vinegar",
                instructions: "1. Cut and fry potatoes. 2. Batter and fry fish. 3. Serve together.",
                difficulty: "medium",
                cooking_time: 30,
                cuisine_type: "British",
                dietary_tags: ""
            },
            {
                name: "Caesar Salad",
                description: "Classic caesar salad with croutons",
                ingredients: "romaine lettuce, parmesan cheese, croutons, caesar dressing",
                instructions: "1. Chop lettuce. 2. Add dressing. 3. Top with cheese and croutons.",
                difficulty: "easy",
                cooking_time: 10,
                cuisine_type: "Italian",
                dietary_tags: "vegetarian"
            },
            {
                name: "Chicken Curry",
                description: "Mild chicken curry with rice",
                ingredients: "chicken, curry powder, onion, garlic, coconut milk, rice",
                instructions: "1. Cook chicken. 2. Add spices and coconut milk. 3. Simmer and serve with rice.",
                difficulty: "medium",
                cooking_time: 35,
                cuisine_type: "Indian",
                dietary_tags: "gluten-free"
            },
            {
                name: "Grilled Cheese Sandwich",
                description: "Classic grilled cheese sandwich",
                ingredients: "bread, cheese, butter",
                instructions: "1. Butter bread. 2. Add cheese. 3. Grill until golden.",
                difficulty: "easy",
                cooking_time: 8,
                cuisine_type: "American",
                dietary_tags: "vegetarian"
            },
            {
                name: "Chicken Soup",
                description: "Comforting chicken soup",
                ingredients: "chicken, carrots, celery, onion, noodles, broth",
                instructions: "1. Cook chicken. 2. Add vegetables. 3. Add noodles and simmer.",
                difficulty: "medium",
                cooking_time: 45,
                cuisine_type: "American",
                dietary_tags: ""
            },
            {
                name: "Spaghetti Bolognese",
                description: "Classic meat sauce pasta",
                ingredients: "spaghetti, ground beef, tomatoes, onion, garlic, herbs",
                instructions: "1. Cook pasta. 2. Make meat sauce. 3. Combine and serve.",
                difficulty: "medium",
                cooking_time: 40,
                cuisine_type: "Italian",
                dietary_tags: ""
            },
            {
                name: "Vegetable Soup",
                description: "Healthy mixed vegetable soup",
                ingredients: "mixed vegetables, vegetable broth, onion, garlic, herbs",
                instructions: "1. Sauté onion. 2. Add vegetables and broth. 3. Simmer until tender.",
                difficulty: "easy",
                cooking_time: 25,
                cuisine_type: "American",
                dietary_tags: "vegetarian,vegan"
            },
            {
                name: "Fried Rice",
                description: "Simple vegetable fried rice",
                ingredients: "rice, mixed vegetables, eggs, soy sauce, oil",
                instructions: "1. Cook rice. 2. Stir fry vegetables. 3. Add rice and eggs.",
                difficulty: "easy",
                cooking_time: 15,
                cuisine_type: "Asian",
                dietary_tags: "vegetarian"
            },
            {
                name: "Chicken Sandwich",
                description: "Grilled chicken sandwich",
                ingredients: "chicken breast, bread, lettuce, tomato, mayo",
                instructions: "1. Grill chicken. 2. Toast bread. 3. Assemble sandwich.",
                difficulty: "easy",
                cooking_time: 15,
                cuisine_type: "American",
                dietary_tags: ""
            },
            {
                name: "Mushroom Risotto",
                description: "Creamy mushroom risotto",
                ingredients: "rice, mushrooms, onion, broth, white wine, parmesan",
                instructions: "1. Sauté mushrooms. 2. Cook rice slowly with broth. 3. Add cheese.",
                difficulty: "hard",
                cooking_time: 45,
                cuisine_type: "Italian",
                dietary_tags: "vegetarian"
            },
            {
                name: "BBQ Chicken",
                description: "Grilled BBQ chicken",
                ingredients: "chicken, BBQ sauce, onion powder, garlic powder",
                instructions: "1. Season chicken. 2. Grill chicken. 3. Brush with BBQ sauce.",
                difficulty: "medium",
                cooking_time: 30,
                cuisine_type: "American",
                dietary_tags: "gluten-free"
            },
            {
                name: "Greek Salad",
                description: "Fresh Greek salad with feta",
                ingredients: "tomatoes, cucumber, olives, feta cheese, olive oil, lemon",
                instructions: "1. Chop vegetables. 2. Add feta and olives. 3. Dress with oil and lemon.",
                difficulty: "easy",
                cooking_time: 10,
                cuisine_type: "Greek",
                dietary_tags: "vegetarian,gluten-free"
            },
            {
                name: "Chicken Parmesan",
                description: "Breaded chicken with marinara and cheese",
                ingredients: "chicken breast, breadcrumbs, marinara sauce, mozzarella, parmesan",
                instructions: "1. Bread chicken. 2. Fry until golden. 3. Top with sauce and cheese. 4. Bake.",
                difficulty: "medium",
                cooking_time: 35,
                cuisine_type: "Italian",
                dietary_tags: ""
            }
        ];

        console.log("Starting simple recipe seeding...");
        
        for (const recipe of recipes) {
            await client.query(`
                INSERT INTO recipes (name, description, ingredients, instructions, difficulty, cooking_time, cuisine_type, dietary_tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT DO NOTHING
            `, [
                recipe.name,
                recipe.description,
                recipe.ingredients,
                recipe.instructions,
                recipe.difficulty,
                recipe.cooking_time,
                recipe.cuisine_type,
                recipe.dietary_tags
            ]);
        }

        console.log(`Successfully seeded ${recipes.length} recipes!`);
    } catch (error) {
        console.log("Error seeding recipes:", error);
    }
};