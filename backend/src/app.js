import express from "express";
import userRouter from "../routes/user.route.js";
import taskRouter from "../routes/task.route.js";

const app = express();
app.use(express.json());

// set up routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

export default app;