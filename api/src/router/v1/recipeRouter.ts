import { Router } from "express";
import { RecipeController } from "../../controllers/recipeController";

const recipeRouter = Router();

// Recipe endpoints
recipeRouter.get("/", RecipeController.getAllRecipes);
recipeRouter.get("/:recipeId", RecipeController.getRecipeById);
recipeRouter.post("/suggestions", RecipeController.getRecipeSuggestions);

// Utility endpoints
recipeRouter.get("/data/cuisine-types", RecipeController.getCuisineTypes);
recipeRouter.get("/data/dietary-tags", RecipeController.getDietaryTags);

export default recipeRouter;
