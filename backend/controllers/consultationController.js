const db = require('../models/db');

/**
 * Saves a completed consultation utilizing a strict PostgreSQL Transaction.
 * Atomically inserts the Medical_History node alongside updating the Appointment status.
 */
const completeConsultation = async (req, res) => {
    const { 
        patient_id, 
        doctor_id, 
        appointment_id, 
        clinical_notes, 
        prescriptions 
    } = req.body;

    // Strict validation
    if (!patient_id || !doctor_id || !appointment_id || !clinical_notes) {
        return res.status(400).json({ error: 'Missing critical consultation indexing data.' });
    }

    // Checking out a native client from our 'db.js' pool specifically to handle transactions
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Step 1: Insert into Medical_History
        // Safely stringifying the prescriptions object array to map directly to PostgreSQL JSONB
        const formattedPrescriptions = JSON.stringify(prescriptions || []);
        
        const historyQueryText = `
            INSERT INTO Medical_History 
                (patient_id, doctor_id, appointment_id, clinical_notes, prescriptions)
            VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const historyParams = [patient_id, doctor_id, appointment_id, clinical_notes, formattedPrescriptions];
        const historyResult = await client.query(historyQueryText, historyParams);
        const newHistoryRecord = historyResult.rows[0];

        // Step 2: Update Appointments status
        const appointmentQueryText = `
            UPDATE Appointments 
            SET status = 'Completed' 
            WHERE id = $1;
        `;
        await client.query(appointmentQueryText, [appointment_id]);

        // Commit transaction atomic block
        await client.query('COMMIT');

        return res.status(201).json({
            message: 'Consultation securely completed and logged.',
            history: newHistoryRecord
        });

    } catch (error) {
        // Intercept logic on failure ensuring no orphan mutations persist in the DB
        await client.query('ROLLBACK');
        
        // Code 23505 indicates the database rejected the insert due to our UNIQUE(appointment_id) constraint
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Data Conflict: This appointment has already been historically logged.' });
        }
        
        console.error('[Consultation Controller Error]:', error);
        return res.status(500).json({ error: 'Transaction layer failed while saving the consultation.' });
    } finally {
        // Release client back to the connection pool mapping
        client.release();
    }
};

module.exports = {
    completeConsultation
};
