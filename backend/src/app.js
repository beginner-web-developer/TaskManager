import express from "express";
import userRouter from "../routes/user.route.js";

const app = express();
app.use(express.json());

// set up routes
app.use("/api/v1/users", userRouter);

export default app;