// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true,
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // or your user model name
        required: true
    },
    date: { type: String, required: true }, // e.g., '2025-07-12'
    time: { type: String, required: true }, // e.g., '14:30'
    status: {
        type: String,
        enum: ['booked', 'completed', 'cancelled'],
        default: 'booked',
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
