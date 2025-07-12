const mongoose = require('mongoose');

const BreakSchema = new mongoose.Schema({
    start: { type: String, required: true }, // format HH:mm
    end: { type: String, required: true }
});

const DaySchema = new mongoose.Schema({
    day: { type: String, required: true },
    key: { type: String, required: true },
    open: { type: String, default: "09:00" },
    close: { type: String, default: "18:00" },
    closed: { type: Boolean, default: false },
    breaks: [BreakSchema]
});

const WorkingHourSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hours: [DaySchema]
}, { timestamps: true });

module.exports = mongoose.model('WorkingHour', WorkingHourSchema);
