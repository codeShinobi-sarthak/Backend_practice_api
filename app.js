import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import arcjetMIddleware from "./middleware/arcjet.middleware.js";

// import routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import workflowRouter from "./routes/workflow.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMIddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.json("server listening to backend-practice");
});

// listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    connectToDatabase();
});
