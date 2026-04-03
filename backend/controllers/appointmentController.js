const db = require('../models/db');

/**
 * Books a new appointment with strict constraint handling
 * Handles overlapping double-bookings if database constraints trigger an error
 */
const bookAppointment = async (req, res) => {
    const { 
        patient_id, 
        doctor_id, 
        appointment_date, 
        start_time, 
        end_time, 
        reason_for_visit 
    } = req.body;

    // First principles validation
    if (!patient_id || !doctor_id || !appointment_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Missing required tracking fields for scheduling.' });
    }

    try {
        const queryText = `
            INSERT INTO Appointments 
                (patient_id, doctor_id, appointment_date, start_time, end_time, status, reason_for_visit)
            VALUES 
                ($1, $2, $3, $4, $5, 'Scheduled', $6)
            RETURNING *;
        `;
        
        const params = [
            patient_id, 
            doctor_id, 
            appointment_date, 
            start_time, 
            end_time, 
            reason_for_visit
        ];
        
        const result = await db.query(queryText, params);
        
        return res.status(201).json({
            message: 'Appointment optimally scheduled.',
            appointment: result.rows[0]
        });

    } catch (error) {
        // Postgres Exclusion Violation (overlapping timerange)
        if (error.code === '23P01') {
            return res.status(400).json({ 
                error: 'Scheduling Conflict: Doctor is already booked during this time window.' 
            });
        }
        
        // Foreign Key Violation
        if (error.code === '23503') {
             return res.status(400).json({ 
                 error: 'Database Integrity Issue: The provided Doctor or Patient invalidly references a non-existent UUID.' 
             });
        }

        console.error('[Appointment Controller Error]:', error);
        return res.status(500).json({ 
            error: 'Internal processing failure while attempting appointment scheduling.' 
        });
    }
};

/**
 * Fetches all appointments for a specific doctor for the current day.
 * Joins the Patients table to return the patient's full name.
 */
const getDoctorSchedule = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const queryText = `
            SELECT 
                a.id, 
                a.appointment_date, 
                a.start_time, 
                a.end_time, 
                a.status, 
                a.reason_for_visit,
                p.first_name, 
                p.last_name
            FROM Appointments a
            INNER JOIN Patients p ON a.patient_id = p.id
            WHERE a.doctor_id = $1 AND a.appointment_date = CURRENT_DATE
            ORDER BY a.start_time ASC;
        `;
        
        const params = [doctorId];
        const result = await db.query(queryText, params);
        
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('[Appointment Controller Error]: Failed to fetch schedule:', error);
        return res.status(500).json({ 
            error: 'Failed to retrieve doctor schedule.' 
        });
    }
};

module.exports = {
    bookAppointment,
    getDoctorSchedule
};
