import { Request, Response } from "express";
import { client } from "../db";

export class RecipeController {
    // Get all recipes with optional filters
    static async getAllRecipes(req: Request, res: Response) {
        try {
            const { 
                search, 
                difficulty, 
                maxCookingTime,
                cuisineType, 
                dietaryTags,
                page = 1, 
                limit = 20 
            } = req.query;

            let query = "SELECT * FROM recipes WHERE 1=1";
            const queryParams: any[] = [];
            let paramIndex = 1;

            // Simple text search
            if (search) {
                query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR ingredients ILIKE $${paramIndex})`;
                queryParams.push(`%${search}%`);
                paramIndex++;
            }

            // Difficulty filter
            if (difficulty) {
                query += ` AND difficulty = $${paramIndex}`;
                queryParams.push(difficulty);
                paramIndex++;
            }

            // Cooking time filter
            if (maxCookingTime) {
                query += ` AND cooking_time <= $${paramIndex}`;
                queryParams.push(parseInt(maxCookingTime as string));
                paramIndex++;
            }

            // Cuisine type filter
            if (cuisineType) {
                query += ` AND cuisine_type = $${paramIndex}`;
                queryParams.push(cuisineType);
                paramIndex++;
            }

            // Dietary tags filter
            if (dietaryTags) {
                query += ` AND dietary_tags ILIKE $${paramIndex}`;
                queryParams.push(`%${dietaryTags}%`);
                paramIndex++;
            }

            query += " ORDER BY created_at DESC";

            // Pagination
            const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
            query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            queryParams.push(parseInt(limit as string), offset);

            const result = await client.query(query, queryParams);

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    total: result.rows.length
                }
            });
        } catch (error: any) {
            console.log("Error fetching recipes:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch recipes"
            });
        }
    }

    // Get single recipe
    static async getRecipeById(req: Request, res: Response) {
        try {
            const { recipeId } = req.params;
            
            const result = await client.query(`
                SELECT * FROM recipes WHERE id = $1
            `, [recipeId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Recipe not found"
                });
            }

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error: any) {
            console.log("Error fetching recipe:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch recipe"
            });
        }
    }

    // Get recipe suggestions based on provided ingredients and preferences
    static async getRecipeSuggestions(req: Request, res: Response) {
        try {
            const { ingredients, dietaryRestrictions = [], maxCookingTime, difficulty, servingSize } = req.body;

            if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Ingredients array is required"
                });
            }

            // Convert ingredient IDs to names for matching
            const ingredientNames = await client.query(`
                SELECT name FROM ingredients WHERE id = ANY($1::int[])
            `, [ingredients]);

            if (ingredientNames.rows.length === 0) {
                return res.json({
                    success: true,
                    data: [],
                    message: "No valid ingredients provided"
                });
            }

            const userIngredientNames = ingredientNames.rows.map(row => row.name.toLowerCase());
            
            // Build recipe matching query
            let query = `
                SELECT *, 
                (
                    SELECT COUNT(*) 
                    FROM unnest(string_to_array(LOWER(ingredients), ',')) AS recipe_ingredient
                    WHERE TRIM(recipe_ingredient) = ANY($1::text[])
                ) as matching_ingredients_count,
                array_length(string_to_array(ingredients, ','), 1) as total_ingredients_count
                FROM recipes WHERE 1=1
            `;
            
            const queryParams: any[] = [userIngredientNames];
            let paramIndex = 2;

            // Filter by dietary restrictions
            if (dietaryRestrictions.length > 0) {
                const conditions = dietaryRestrictions.map((tag: string) => `dietary_tags ILIKE $${paramIndex++}`);
                query += ` AND (dietary_tags = '' OR ${conditions.join(' OR ')})`;
                dietaryRestrictions.forEach((tag: string) => {
                    queryParams.push(`%${tag}%`);
                });
            }

            // Add cooking time filter
            if (maxCookingTime) {
                query += ` AND cooking_time <= $${paramIndex}`;
                queryParams.push(maxCookingTime);
                paramIndex++;
            }

            // Add difficulty filter
            if (difficulty) {
                query += ` AND difficulty = $${paramIndex}`;
                queryParams.push(difficulty);
                paramIndex++;
            }

            // Calculate match percentage and order by it
            query += `
                ORDER BY 
                    CASE 
                        WHEN total_ingredients_count > 0 THEN 
                            (matching_ingredients_count::decimal / total_ingredients_count::decimal) * 100 
                        ELSE 0 
                    END DESC,
                    cooking_time ASC
                LIMIT 20
            `;

            const result = await client.query(query, queryParams);

            // Add match percentage to results
            const recipesWithMatchPercentage = result.rows.map(recipe => ({
                ...recipe,
                match_percentage: recipe.total_ingredients_count > 0 
                    ? Math.round((recipe.matching_ingredients_count / recipe.total_ingredients_count) * 100)
                    : 0,
                // Adjust serving size if requested
                adjusted_serving_size: servingSize || recipe.serving_size || 4
            }));

            res.json({
                success: true,
                data: recipesWithMatchPercentage,
                message: `Found ${recipesWithMatchPercentage.length} recipe suggestions`
            });
        } catch (error: any) {
            console.log("Error generating recipe suggestions:", error);
            res.status(500).json({
                success: false,
                message: "Failed to generate recipe suggestions"
            });
        }
    }

    // Get available cuisine types
    static async getCuisineTypes(req: Request, res: Response) {
        try {
            const result = await client.query(`
                SELECT DISTINCT cuisine_type 
                FROM recipes 
                WHERE cuisine_type IS NOT NULL 
                ORDER BY cuisine_type
            `);

            res.json({
                success: true,
                data: result.rows.map(row => row.cuisine_type)
            });
        } catch (error: any) {
            console.log("Error fetching cuisine types:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch cuisine types"
            });
        }
    }

    // Get available dietary tags
    static async getDietaryTags(req: Request, res: Response) {
        try {
            const result = await client.query(`
                SELECT DISTINCT dietary_tags 
                FROM recipes 
                WHERE dietary_tags IS NOT NULL AND dietary_tags != ''
                ORDER BY dietary_tags
            `);

            // Split comma-separated tags and flatten
            const allTags = new Set();
            result.rows.forEach(row => {
                if (row.dietary_tags) {
                    row.dietary_tags.split(',').forEach((tag: string) => {
                        allTags.add(tag.trim());
                    });
                }
            });

            res.json({
                success: true,
                data: Array.from(allTags).sort()
            });
        } catch (error: any) {
            console.log("Error fetching dietary tags:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch dietary tags"
            });
        }
    }
}
