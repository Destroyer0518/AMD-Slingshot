import React from 'react';

const AppointmentCard = ({ appointment }) => {
    // Determine strict color mapping based on status
    let chipClass = 'clinical-chip-scheduled';
    if (appointment.status === 'Cancelled') chipClass = 'clinical-chip-cancelled';
    if (appointment.status === 'Completed') chipClass = 'clinical-chip-completed';

    // Format times explicitly to strip seconds if native Postgres time includes them
    const formatTime = (timeStr) => {
        return timeStr ? timeStr.slice(0, 5) : '';
    };

    return (
        <div className="clinical-card" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ margin: 0 }}>
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </h3>
                <p style={{ margin: '8px 0 4px 0', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                    {appointment.first_name} {appointment.last_name}
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-outline-variant)' }}>
                    {appointment.reason_for_visit || 'No specific reason provided.'}
                </p>
            </div>
            <div>
                <span className={`clinical-chip ${chipClass}`}>
                    {appointment.status}
                </span>
            </div>
        </div>
    );
};

export default AppointmentCard;
