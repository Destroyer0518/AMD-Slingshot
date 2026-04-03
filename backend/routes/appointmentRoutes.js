const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorSchedule } = require('../controllers/appointmentController');

/**
 * Route: POST /
 * Books a new appointment with strict double-booking constraints handled dynamically in DB layer.
 */
router.post('/', bookAppointment);

/**
 * Route: GET /doctor/:doctorId
 * Fetches today's appointment schedule joined with Patient data.
 */
router.get('/doctor/:doctorId', getDoctorSchedule);

module.exports = router;
