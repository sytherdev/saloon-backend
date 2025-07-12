const mongoose = require('mongoose')

const WorkingDaySchema = new mongoose.Schema({
    day: { type: String, required: true },
    key: { type: String, required: true },
    open: { type: String, default: "09:00" },
    close: { type: String, default: "18:00" },
    closed: { type: Boolean, default: false },
})

const TeamMemberSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    profession: { type: String, required: true },
    image: { type: String, default: '' },
    bio: { type: String, default: '' },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    }],
    workingHours: [WorkingDaySchema]
}, { timestamps: true })

module.exports = mongoose.model('TeamMember', TeamMemberSchema)
