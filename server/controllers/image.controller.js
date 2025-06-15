import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => `blog-image-${Date.now()}-${file.originalname.split('.')[0]}`,
    }
})

const upload = multer({storage:storage});

export const uploadImage = (req, res) =>{
    if(!req.file){
        return res.status(400).json({
            message: 'Np image uploaded'
        })
    }

    res.status(200).json({
        message: 'Image Uploaded successfully',
        url: req.file.path,
        public_id: req.file.filename
    })
}

export {upload};
