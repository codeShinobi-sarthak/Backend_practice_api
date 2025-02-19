import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";

// import controllers (handlers)
import {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", createUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
