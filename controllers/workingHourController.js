const workingHourService = require('../services/workingHourService');

const saveWorkingHours = async (req, res) => {
    try {
        const { hours } = req.body;
        const userId = req.user.id; // assuming auth middleware sets req.user

        const result = await workingHourService.createOrUpdateWorkingHours(userId, hours);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save working hours' });
    }
};

const getWorkingHours = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await workingHourService.getWorkingHours(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch working hours' });
    }
};

module.exports = {
    saveWorkingHours,
    getWorkingHours
};
