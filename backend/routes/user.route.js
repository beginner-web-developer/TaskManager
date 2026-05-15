import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(createUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);

export default userRouter;