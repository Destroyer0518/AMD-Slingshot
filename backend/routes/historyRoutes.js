const express = require('express');
const router = express.Router();
const { getPatientHistory } = require('../controllers/historyController');

/**
 * Route: GET /patient/:patientId
 * Aggregates legacy consultations securely from associated tables.
 */
router.get('/patient/:patientId', getPatientHistory);

module.exports = router;
