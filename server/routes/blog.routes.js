import { Router } from "express";
import { getAllBlogs,  getBlog, getTrendingBlogs,  getTrendingTags, likeBlog, publishBlog, saveDraft } from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const blogRouter = Router();

blogRouter.post('/publish-blog', auth, publishBlog);
blogRouter.post('/save-draft', auth, saveDraft);
blogRouter.get('/blogs', getAllBlogs);
blogRouter.get('/trending', getTrendingBlogs);
blogRouter.get('/trending-tags', auth, getTrendingTags);
blogRouter.get('/:id', getBlog);
blogRouter.post('/:id/like', auth, likeBlog);

export default blogRouter;