import AppError from '../utils/appError.js';

export const uploadImage = (req, res, next) =>{
    if(!req.file){
        return next(new AppError('No image file uploaded or an error occurred during upload processing.', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Image Uploaded successfully',
        url: req.file.path,
        public_id: req.file.filename
    })
}
