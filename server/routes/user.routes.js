import { Router } from "express";
import { getBlogs, getUserDetails, updateUserDetails } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", auth, getUserDetails);
userRouter.put("/update-user", auth, updateUserDetails);
userRouter.get('/blogs', auth, getBlogs);

export default userRouter