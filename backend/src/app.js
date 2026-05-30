import express from "express";
import cors from "cors";
import userRouter from "../routes/user.route.js";
import taskRouter from "../routes/task.route.js";
import adminRouter from "../routes/admin.route.js";

const app = express();
app.use(express.json());
app.use(cors());

// set up routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/admin", adminRouter);

export default app;