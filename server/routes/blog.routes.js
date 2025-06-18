import { Router } from "express";
import { getAllPosts, publishBlog, saveDraft } from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const blogRouter = Router();

blogRouter.post('/publish-blog', auth, publishBlog);
blogRouter.post('/save-draft', auth, saveDraft);
blogRouter.get('/posts', getAllPosts);

export default blogRouter;