const WorkingHour = require('../models/Workinghour');

const createOrUpdateWorkingHours = async (userId, hours) => {
    const existing = await WorkingHour.findOne({ userId });

    if (existing) {
        existing.hours = hours;
        return await existing.save();
    }

    return await WorkingHour.create({ userId, hours });
};

const getWorkingHours = async (userId) => {
    return await WorkingHour.findOne({ userId });
};

module.exports = {
    createOrUpdateWorkingHours,
    getWorkingHours
};
