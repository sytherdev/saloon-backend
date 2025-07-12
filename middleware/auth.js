import jwt from 'jsonwebtoken';
import Salon from '../models/User.js'; // or your user model

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const salon = await Salon.findById(decoded._id).select('-password');
        if (!salon) throw new Error("Salon not found");
        req.user = salon;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
