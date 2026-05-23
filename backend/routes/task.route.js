import { Router } from "express";
import { createTask, deleteTask, readTasks, updateTask } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/createTask/:userId").post(createTask);
taskRouter.route("/readTasks/:userId").get(readTasks);
taskRouter.route("/updateTask/:taskId").patch(updateTask);
taskRouter.route("/deleteTask/:taskId").delete(deleteTask);

export default taskRouter;