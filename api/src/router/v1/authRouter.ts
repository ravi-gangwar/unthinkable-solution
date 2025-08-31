import { Router } from "express";
import { AuthController } from "../../controllers/authController";

const authRouter = Router();

// Authentication endpoints
authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);

// User profile endpoint
authRouter.get("/users/:userId", AuthController.getUserProfile);

export default authRouter;
