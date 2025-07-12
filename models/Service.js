const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    duration: String,
    priceRange: {
        from: { type: Number, required: true },
        to: { type: Number, required: true },
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema) // ✅
