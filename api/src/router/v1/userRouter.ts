import { Router } from "express";
import { UserController } from "../../controllers/userController";

const userRouter = Router();

// Available ingredients endpoint
userRouter.get("/ingredients", UserController.getAvailableIngredients);

// User favorites endpoints
userRouter.get("/:userId/favorites", UserController.getUserFavorites);
userRouter.post("/:userId/favorites/:recipeId", UserController.addToFavorites);
userRouter.delete("/:userId/favorites/:recipeId", UserController.removeFromFavorites);

export default userRouter;
