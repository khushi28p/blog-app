import { Router } from "express";
import { getUserDetails, updateUserDetails } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", auth, getUserDetails);
userRouter.put("/update-user", auth, updateUserDetails);

export default userRouter