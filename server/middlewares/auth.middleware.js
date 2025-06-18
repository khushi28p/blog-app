import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { config } from 'dotenv';

config();

export const auth = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-personal_info.password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
}