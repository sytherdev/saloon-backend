const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            minlength: [3, 'Full name must be at least 3 characters'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        address: {
            type: String,
            trim: true,
            maxlength: [100, 'Address can be at most 100 characters'],
        },
        phone: {
            type: String,
            trim: true,
            maxlength: [20, 'Phone number too long'],
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, 'Bio too long'],
        },
        image: {
            type: String, // Can be URL or base64
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: ['user', 'salon'],
        },

        // ✅ Salon-specific fields
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        priceRange: {
            type: String,
            enum: ['$', '$$', '$$$'],
            default: '$$',
        },
        timing: {
            type: String,
            default: "9:00 AM - 6:00 PM"
        },
        services: {
            type: [String], // ["Haircut", "Beard Trim"]
            default: [],
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
