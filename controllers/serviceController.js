const Service = require('../models/Service');

// @desc Create a new service
const createService = async (req, res) => {
    try {
        const { name, description, duration, priceRange } = req.body;

        const newService = new Service({
            salonId: req.user._id,
            name,
            description,
            duration,
            priceRange,
        });

        await newService.save();
        res.status(201).json({ success: true, data: newService });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc Get all services for the logged-in salon
const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ salonId: req.user._id });
        res.status(200).json({ success: true, data: services });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc Update a service
const updateService = async (req, res) => {
    try {
        const updated = await Service.findOneAndUpdate(
            { _id: req.params.id, salonId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Service not found or unauthorized" });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc Delete a service
const deleteService = async (req, res) => {
    try {
        const deleted = await Service.findOneAndDelete({ _id: req.params.id, salonId: req.user._id });
        if (!deleted) return res.status(404).json({ success: false, message: "Service not found or unauthorized" });
        res.status(200).json({ success: true, message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createService,
    getMyServices,
    updateService,
    deleteService
};
