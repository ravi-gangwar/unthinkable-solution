import { Router } from "express";
import userRouter from "./userRouter";
import recipeRouter from "./recipeRouter";
import authRouter from "./authRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);

export default router;