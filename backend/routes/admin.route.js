import { Router } from "express";
import { addUsers, createAdmin, deleteUser, loginAdmin, logoutAdmin, updateUser, viewUsers } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.route("/register").post(createAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").post(logoutAdmin);
adminRouter.route("/getUsers/:adminId").get(viewUsers);
adminRouter.route("/addUsers").post(addUsers);
adminRouter.route("/updateUser/:userId").patch(updateUser);
adminRouter.route("/deleteUser/:userId").delete(deleteUser);

export default adminRouter;