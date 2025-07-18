import Router from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { createComment, deleteComment, getCommentByBlog, updateComment } from '../controllers/comment.controller.js';

const commentRouter = Router();

commentRouter.post('/:blogId', auth, createComment);
commentRouter.get('/:blogId', getCommentByBlog);
commentRouter.put('/:commentId', auth, updateComment);
commentRouter.delete('/:commentId', auth, deleteComment);

export default commentRouter;