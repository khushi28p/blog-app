import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/appError.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req, file) => {
        return {
            folder: 'images',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: `blog-image-${Date.now()}-${file.originalname.split('.')[0]}`,
            transformation: [{width: 500, height: 500, crop: 'limit'}]
        }
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true); 
        } else {
            cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.', 400), false);
        }
    }
});

export { upload };