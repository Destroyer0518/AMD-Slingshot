const db = require('../models/db');

/**
 * Executes a manual 3-table join to construct a historical consultation timeline.
 * 
 * Maps:
 * Medical_History (Central data repository)
 * Appointments (Temporal sorting coordinates)
 * Doctors (Originating medical authorities)
 */
const getPatientHistory = async (req, res) => {
    const { patientId } = req.params;

    try {
        const queryText = `
            SELECT 
                mh.id as history_id,
                mh.clinical_notes,
                mh.prescriptions,
                a.appointment_date,
                a.reason_for_visit,
                d.first_name as doctor_first_name,
                d.last_name as doctor_last_name,
                d.specialty
            FROM Medical_History mh
            INNER JOIN Appointments a ON mh.appointment_id = a.id
            INNER JOIN Doctors d ON mh.doctor_id = d.id
            WHERE mh.patient_id = $1
            ORDER BY a.appointment_date DESC;
        `;
        
        const params = [patientId];
        const result = await db.query(queryText, params);
        
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('[History Controller Error]: Failed resolving medical history schema map:', error);
        return res.status(500).json({ 
            error: 'Failed to access isolated history components. Please retry connection later.' 
        });
    }
};

module.exports = {
    getPatientHistory
};
