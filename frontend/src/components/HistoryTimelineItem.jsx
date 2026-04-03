import React, { useState } from 'react';

const HistoryTimelineItem = ({ record }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Assuming SQL outputs the JSON string directly depending on driver. Parse if necessary.
    let prescriptionsArray = [];
    if (record.prescriptions) {
        try {
            prescriptionsArray = typeof record.prescriptions === 'string' 
                ? JSON.parse(record.prescriptions) 
                : record.prescriptions;
        } catch (e) {
            console.error('Failed to parse prescriptions JSON:', e);
        }
    }

    // Isolate formatting logic
    const displayDate = new Date(record.appointment_date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px',
            borderLeft: '4px solid var(--color-primary-container)', // Replaces thin lines with bold color blocks per aesthetic
            boxShadow: 'var(--shadow-medical-mist)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                    <h4 style={{ margin: 0, color: 'var(--color-on-surface)', fontSize: '1.25rem' }}>
                        {displayDate}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--color-outline-variant)', fontSize: '0.875rem' }}>
                        {record.reason_for_visit}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-on-surface)' }}>
                        Dr. {record.doctor_last_name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                        {record.specialty}
                    </p>
                </div>
            </div>

            {isExpanded && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid var(--color-surface-container-low)'}}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--color-on-surface)' }}>Clinical Notes</h5>
                    <p style={{ margin: '0 0 24px 0', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                        {record.clinical_notes}
                    </p>

                    {prescriptionsArray.length > 0 && (
                        <>
                            <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-on-surface)' }}>Prescribed Logic</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {prescriptionsArray.map((rx, idx) => (
                                    <div key={idx} style={{ 
                                        backgroundColor: 'var(--color-surface-container-low)', 
                                        padding: '12px', 
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>{rx.medicationName}</span>
                                        <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
                                            {rx.dosage} / {rx.frequency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-headlines)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '8px 0 0 0',
                    marginTop: isExpanded ? '16px' : '0',
                    textDecoration: 'underline',
                    textDecorationColor: 'var(--color-primary-container)',
                    textUnderlineOffset: '4px'
                }}
            >
                {isExpanded ? 'Collapse Details' : 'Read Full Log'}
            </button>
        </div>
    );
};

export default HistoryTimelineItem;
