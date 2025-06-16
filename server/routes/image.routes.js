import {Router} from 'express';
import { upload } from '../middlewares/image.middleware.js';
import { uploadImage } from '../controllers/image.controller.js';

const imageRouter = Router();

imageRouter.post('/', upload.single('image'), uploadImage);

export default imageRouter;