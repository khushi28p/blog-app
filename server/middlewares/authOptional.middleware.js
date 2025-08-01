// src/middlewares/authOptional.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
// No dotenv.config() here, as it's done in index.js

export const authOptional = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        // No token provided, proceed to next middleware/route handler
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Only select essential user info for the public context
        const user = await User.findById(decoded.userId).select('_id personal_info.username personal_info.profile_img');

        if (user) {
            req.user = user; // Attach user if found
        }
        next(); // Proceed regardless
    } catch (error) {
        // Log error but proceed. This means an invalid/expired token
        // will not block access to the public route, but req.user won't be set.
        console.warn('Optional authentication failed (token invalid/expired):', error.message);
        next(); // Proceed even if token is invalid/expired
    }
};