const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController'); // ✅ Import controller

const {
    createAppointment,
    getAvailableTimeSlots,
    getSalonBookingData,
    getMyAppointments,
    cancelAppointment,
    getSalonAppointments,
    createManualAppointment

} = appointmentController;

// ✅ Public routes
router.post('/', createAppointment);
router.get('/available', getAvailableTimeSlots);
router.get('/:salonId/booking-data', getSalonBookingData);

// ✅ Authenticated routes
router.get('/me', protect, appointmentController.getMyAppointments);
router.post('/:id/cancel', protect, appointmentController.cancelAppointment);


router.get('/', protect, getSalonAppointments);
router.post('/manual', protect, createManualAppointment);

module.exports = router;
