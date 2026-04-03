import React, { useState, useEffect } from 'react';
import { fetchDoctorSchedule } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import StatusToggle from '../components/StatusToggle';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctorStatus, setDoctorStatus] = useState('Available');

    // TODO: AUTH INTEGRATION
    // This UUID is temporarily hardcoded to verify the scheduling flow and DB relations.
    // Replace this with the dynamically injected context variable (e.g. from JWT decoding) once Auth is complete.
    const mockDoctorId = 'd03b0d24-3453-4876-b337-b4dabc123456';

    useEffect(() => {
        const loadSchedule = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDoctorSchedule(mockDoctorId);
                setAppointments(data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load schedule from the database.');
            } finally {
                setIsLoading(false);
            }
        };

        loadSchedule();
    }, [mockDoctorId]);

    const handleStatusChange = (newStatus) => {
        // In a real flow, this triggers a PUT /api/doctors/:id/status
        setDoctorStatus(newStatus);
    };

    return (
        <div className="clinical-section" style={{ minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Dashboard Header */}
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '48px'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.75rem' }}>Dr. Jenkins's Schedule</h1>
                        <p style={{ margin: '8px 0 0 0', color: 'var(--color-outline-variant)' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <StatusToggle 
                        currentStatus={doctorStatus} 
                        onStatusChange={handleStatusChange} 
                    />
                </header>

                {/* Dashboard Body */}
                <main>
                    {isLoading ? (
                        <p>Syncing secure schedule...</p>
                    ) : error ? (
                        <div className="clinical-banner-error">{error}</div>
                    ) : appointments.length === 0 ? (
                        <div className="clinical-card" style={{ textAlign: 'center', padding: '64px 32px' }}>
                            <p style={{ color: 'var(--color-outline-variant)', fontSize: '1.2rem', margin: 0 }}>
                                No appointments scheduled for today. You have breathing room.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {appointments.map((appt) => (
                                <AppointmentCard key={appt.id} appointment={appt} />
                            ))}
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default DoctorDashboard;
