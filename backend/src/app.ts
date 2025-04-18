import express from "express";
import cors from "cors";

import { FRONTEND_URLS } from "./config/env.config.js";

import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";
import userRouter from "./routes/user.route.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({ origin: FRONTEND_URLS.split(",") }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);
app.use("/user", userRouter);

app.use(errorHandler);

export default app;
