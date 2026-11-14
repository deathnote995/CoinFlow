import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'
import User from '../models/User.model.js'

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify signature and expiration using JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Fetch user from DB (excluding password) and attach to req.user
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            // 4. Pass control to the next middleware or controller
            return next();
        } catch (error) {
            logger.warn(`JWT verification failed: ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
} 