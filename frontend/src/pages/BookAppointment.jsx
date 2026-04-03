import React, { useState } from 'react';
import { bookAppointment } from '../services/api';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

const BookAppointment = () => {
    // We mock the patient_id and standard doctor options since DB lookup isn't wired to state yet.
    // In production, patient_id is derived from Auth context, and Doctors are fetched via GET /api/doctors.
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        start_time: '',
        end_time: '',
        reason_for_visit: ''
    });

    const [status, setStatus] = useState({ type: null, message: '' }); // type: 'success' | 'error'
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hardcoded mock values for Doctors so we can test the Select component visually
    const doctorOptions = [
        { value: 'd03b0d24-3453-4876-b337-b4dabc123456', label: 'Dr. Sarah Jenkins (Cardiology)' },
        { value: 'e12c1e35-4564-5987-c448-c5ebcd234567', label: 'Dr. Marcus Webb (Neurology)' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await bookAppointment(formData);
            setStatus({ 
                type: 'success', 
                message: 'Appointment successfully scheduled! Check your dashboard for details.' 
            });
            // Reset form on success
            setFormData({
                patient_id: '',
                doctor_id: '',
                appointment_date: '',
                start_time: '',
                end_time: '',
                reason_for_visit: ''
            });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.message || 'Failed to schedule appointment. Please try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="clinical-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="clinical-card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '8px' }}>Schedule Appointment</h2>
                <p style={{ color: 'var(--color-outline-variant)', marginBottom: '32px' }}>
                    Select an available time slot with your preferred specialist.
                </p>

                {status.type === 'error' && (
                    <div className="clinical-banner-error">
                        {status.message}
                    </div>
                )}

                {status.type === 'success' && (
                    <div className="clinical-banner-success">
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Patient ID (Temporary Manual Entry)" 
                        name="patient_id" 
                        value={formData.patient_id} 
                        onChange={handleChange} 
                        placeholder="Enter your UUID"
                        required 
                    />
                    
                    <Select 
                        label="Select Provider" 
                        name="doctor_id" 
                        value={formData.doctor_id} 
                        onChange={handleChange} 
                        options={doctorOptions}
                        placeholder="Choose a Doctor..."
                        required 
                    />

                    <Input 
                        label="Appointment Date" 
                        type="date"
                        name="appointment_date" 
                        value={formData.appointment_date} 
                        onChange={handleChange} 
                        required 
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Input 
                            label="Start Time" 
                            type="time"
                            name="start_time" 
                            value={formData.start_time} 
                            onChange={handleChange} 
                            required 
                        />
                        <Input 
                            label="End Time" 
                            type="time"
                            name="end_time" 
                            value={formData.end_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <Input 
                        label="Reason for Visit" 
                        name="reason_for_visit" 
                        value={formData.reason_for_visit} 
                        onChange={handleChange} 
                        placeholder="Briefly describe your symptoms or reason for consulting"
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                        <Button variant="secondary" type="button" onClick={() => setFormData({ patient_id: '', doctor_id: '', appointment_date: '', start_time: '', end_time: '', reason_for_visit: ''})}>
                            Clear
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            Confirm Booking
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
