const Appointment = require('../models/appointmentModel');
const Service = require('../models/Service');
const TeamMember = require('../models/teamMember');

// Utility
const parseTime = (str) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
};

const toTimeString = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, '0');
    const m = String(mins % 60).padStart(2, '0');
    return `${h}:${m}`;
};

// GET /detail/:salonId/booking-data
exports.getSalonBookingData = async (req, res) => {
    try {
        const { salonId } = req.params;
        console.log('Fetching booking data for salon:', salonId);
        const services = await Service.find({ salonId });
        const staff = await TeamMember.find({ salonId }).populate('services');

        const formattedServices = services.map(service => {
            const relatedStaff = staff.filter(member =>
                member.services.some(s => s._id.toString() === service._id.toString())
            ).map(member => ({
                _id: member._id,
                name: member.name,
                image: member.image
            }));

            return {
                _id: service._id,
                name: service.name,
                priceRange: service.priceRange,
                staff: relatedStaff
            };
        });

        res.json({ success: true, services: formattedServices });
    } catch (error) {
        console.error("Booking data error:", error);
        res.status(500).json({ success: false, message: "Failed to load booking data" });
    }
};

// ✅ Create Appointment
exports.createAppointment = async (req, res) => {
    try {
        const { salonId, serviceId, staffId, date, time, customerName, customerPhone, userId } = req.body;

        if (!salonId || !serviceId || !staffId || !date || !time || !customerName || !customerPhone) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const alreadyBooked = await Appointment.findOne({ staffId, date, time });
        if (alreadyBooked) {
            return res.status(400).json({ success: false, message: 'Time slot already booked' });
        }

        const appointment = await Appointment.create({
            salonId,
            serviceId,
            staffId,
            date,
            time,
            customerName,
            customerPhone,
            userId // Store the user ID who made the appointment
        });

        res.status(201).json({ success: true, appointment });
    } catch (err) {
        console.error('Create Appointment Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ✅ Get Available Time Slots
exports.getAvailableTimeSlots = async (req, res) => {
    try {
        const { staffId, serviceId, date } = req.query;

        const staff = await TeamMember.findById(staffId);
        const service = await Service.findById(serviceId);
        if (!staff || !service) return res.status(404).json({ success: false, message: 'Staff or service not found' });

        const dayKey = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
        const workingDay = staff.workingHours.find(d => d.key === dayKey);
        if (!workingDay || workingDay.closed) {
            return res.json({ success: true, slots: [] });
        }

        const duration = parseInt(service.duration); // in minutes
        const start = parseTime(workingDay.open);
        const end = parseTime(workingDay.close);

        const booked = await Appointment.find({ staffId, date });
        const bookedSet = new Set(booked.map(a => a.time));

        const slots = [];
        for (let t = start; t + duration <= end; t += duration) {
            const slot = toTimeString(t);
            if (!bookedSet.has(slot)) slots.push(slot);
        }

        res.json({ success: true, slots });
    } catch (err) {
        console.error('Get Time Slots Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getMyAppointments = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Fetching appointments for user:", userId);
        const appointments = await Appointment.find({ userId }) // 🔁 match by token user ID
            .populate("serviceId")
            .populate("staffId")
            .populate("salonId");

        const formatted = appointments.map(a => ({
            _id: a._id,
            salon: a.salonId?.name || "Salon",
            service: a.serviceId?.name || "Service",
            staff: a.staffId?.name || "Staff",
            date: a.date,
            time: a.time,
            status: a.status,
            price: a.serviceId?.priceRange.from || 0,
            priceto: a.serviceId?.priceRange.to || 0,
        }));

        res.json({ success: true, appointments: formatted });
    } catch (err) {
        console.error("Error fetching user appointments:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Optional: Ensure user owns this appointment
        // if (appointment.customerPhone !== req.user.phone) {
        //     return res.status(403).json({ success: false, message: "Unauthorized to cancel this appointment" });
        // }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ success: true, message: "Appointment cancelled" });
    } catch (err) {
        console.error("Cancel Appointment Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


exports.getSalonAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ salonId: req.user._id })
            .populate('serviceId staffId userId')
            .sort({ date: 1, time: 1 });

        res.status(200).json({ success: true, appointments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createManualAppointment = async (req, res) => {
    try {
        const {
            serviceId,
            staffId,
            customerName,
            customerPhone,
            date,
            time
        } = req.body;

        const appointment = await Appointment.create({
            salonId: req.user._id,
            serviceId,
            staffId,
            customerName,
            customerPhone,
            userId: req.user._id, // system-logged salon user
            date,
            time,
            status: 'booked'
        });

        res.status(201).json({ success: true, appointment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};