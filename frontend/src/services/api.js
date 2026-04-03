// API wrapper initialized with first-principles approach
const BASE_URL = 'http://localhost:8080/api';

/**
 * Books an appointment by sending a POST request to the backend.
 * Explicitly traps HTTP status codes (like our 400 DB constraints) and throws clean errors.
 * 
 * @param {Object} data The appointment payload
 */
export const bookAppointment = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // If backend catches a DB constraint overlapping timerange, it returns a 400.
        // We explicitly throw this so our UI can catch and display it.
        if (!response.ok) {
            throw new Error(result.error || 'Failed to book appointment');
        }

        return result;
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};

/**
 * Fetches today's appointments for a specific doctor.
 * 
 * @param {string} doctorId 
 * @returns {Array} List of appointment objects
 */
export const fetchDoctorSchedule = async (doctorId) => {
    try {
        const response = await fetch(`${BASE_URL}/appointments/doctor/${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch schedule');
        }

        return result;
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};

/**
 * Fetches the descending timeline of patient historical records spanning 3 domains.
 * @param {string} patientId 
 * @returns {Array} Array of historical nodes
 */
export const fetchPatientHistory = async (patientId) => {
    try {
        const response = await fetch(`${BASE_URL}/history/patient/${patientId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to initialize patient context data.');
        return result;
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};

/**
 * Dispatches active consultation payload safely tracking against DB exclusion constraints automatically.
 * @param {Object} data Core submission parameters
 */
export const submitConsultation = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/consultations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to commit consultation to server mapping.');
        return result;
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};
