import { Router } from "express";
import getEmployees from "../controllers/manager.controller.js";

const managerRouter = Router();

managerRouter.route("/getEmployees/:managerId").get(getEmployees);

export default managerRouter;