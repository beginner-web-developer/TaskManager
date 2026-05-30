import { Router } from "express";
import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.route("/register").post(createAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").post(logoutAdmin);

export default adminRouter;