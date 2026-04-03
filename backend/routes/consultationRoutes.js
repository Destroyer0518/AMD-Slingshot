const express = require('express');
const router = express.Router();
const { completeConsultation } = require('../controllers/consultationController');

/**
 * Route: POST /
 * Submits transactional consultation notes updating backend timeline schemas arrays.
 */
router.post('/', completeConsultation);

module.exports = router;
