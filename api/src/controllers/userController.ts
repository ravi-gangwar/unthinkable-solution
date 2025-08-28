import { Request, Response } from "express";
import { client } from "../db";

export class UserController {
    // Get all available ingredients for user selection
    static async getAvailableIngredients(req: Request, res: Response) {
        try {
            const result = await client.query(`
                SELECT id, name, category
                FROM ingredients 
                ORDER BY category, name
            `);

            // Group ingredients by category
            const groupedIngredients: { [key: string]: any[] } = {};
            result.rows.forEach(ingredient => {
                const category = ingredient.category || 'other';
                if (!groupedIngredients[category]) {
                    groupedIngredients[category] = [];
                }
                groupedIngredients[category].push({
                    id: ingredient.id,
                    name: ingredient.name
                });
            });

            res.json({
                success: true,
                data: groupedIngredients
            });
        } catch (error: any) {
            console.log("Error fetching available ingredients:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch available ingredients"
            });
        }
    }

    // Get user's favorite recipes
    static async getUserFavorites(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            
            const result = await client.query(`
                SELECT r.*, uf.created_at as favorited_at
                FROM recipes r
                JOIN user_favorites uf ON r.id = uf.recipe_id
                WHERE uf.user_id = $1
                ORDER BY uf.created_at DESC
            `, [userId]);

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error: any) {
            console.log("Error fetching favorites:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch favorites"
            });
        }
    }

    // Add recipe to favorites
    static async addToFavorites(req: Request, res: Response) {
        try {
            const { userId, recipeId } = req.params;

            await client.query(`
                INSERT INTO user_favorites (user_id, recipe_id)
                VALUES ($1, $2)
                ON CONFLICT (user_id, recipe_id) DO NOTHING
            `, [userId, recipeId]);

            res.json({
                success: true,
                message: "Recipe added to favorites"
            });
        } catch (error: any) {
            console.log("Error adding favorite:", error);
            res.status(500).json({
                success: false,
                message: "Failed to add favorite"
            });
        }
    }

    // Remove recipe from favorites
    static async removeFromFavorites(req: Request, res: Response) {
        try {
            const { userId, recipeId } = req.params;

            await client.query(`
                DELETE FROM user_favorites 
                WHERE user_id = $1 AND recipe_id = $2
            `, [userId, recipeId]);

            res.json({
                success: true,
                message: "Recipe removed from favorites"
            });
        } catch (error: any) {
            console.log("Error removing favorite:", error);
            res.status(500).json({
                success: false,
                message: "Failed to remove favorite"
            });
        }
    }
}
