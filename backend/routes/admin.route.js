import { Router } from "express";
import { addUsers, createAdmin, loginAdmin, logoutAdmin, viewUsers } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.route("/register").post(createAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").post(logoutAdmin);
adminRouter.route("/getUsers/:adminId").get(viewUsers);
adminRouter.route("/addUsers").post(addUsers);

export default adminRouter;