const { register, login } = require('../services/authService');
const User = require('../models/User');
exports.registerUser = async (req, res) => {
    try {
        const result = await register(req.body);
        res.status(201).json({ success: true, user: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


// Update salon profile
exports.updateSalonProfile = async (req, res) => {
    try {
        const { fullName, email, phone, address, bio, image } = req.body;

        // Only allow salons to update their profile
        if (req.user.role !== 'salon') {
            return res.status(403).json({ message: 'Only salons can update profile' });
        }

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { fullName, email, phone, address, bio, image },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        res.json({
            success: true,
            salon: {
                id: updated._id,
                fullName: updated.fullName,
                email: updated.email,
                phone: updated.phone,
                address: updated.address,
                bio: updated.bio,
                image: updated.image,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || 'Failed to update profile' });
    }
};


exports.getSalonProfile = async (req, res) => {
    try {
        res.status(200).json({ success: true, salon: req.user }) // `req.user` is from middleware
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch profile' })
    }
}