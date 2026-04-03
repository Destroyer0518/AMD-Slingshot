import React, { useState, useEffect } from 'react';
import { fetchPatientHistory, submitConsultation } from '../services/api';
import HistoryTimelineItem from '../components/HistoryTimelineItem';
import Input from '../components/Input';
import Button from '../components/Button';

// TODO: AUTH INTEGRATION
// Mapped tracking UUIDs required for network compilation simulating logged-in state maps.
const MOCK_PATIENT_ID = 'p91k1z99-1234-4567-8910-a1b2c3d4e5f6';
const MOCK_DOCTOR_ID = 'd03b0d24-3453-4876-b337-b4dabc123456';
const MOCK_APPT_ID = 'a1111111-2222-3333-4444-555555555555';

const ActiveConsultation = () => {
    // ---- LEFT COLUMN STATE (Timeline) ----
    const [historyLogs, setHistoryLogs] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // ---- RIGHT COLUMN STATE (Active Entry) ----
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState([{ medicationName: '', dosage: '', frequency: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Fetch left column constraints
    useEffect(() => {
        const loadContext = async () => {
            try {
                const logs = await fetchPatientHistory(MOCK_PATIENT_ID);
                setHistoryLogs(logs);
            } catch (err) {
                console.error("Context tracking failed:", err);
            } finally {
                setLoadingHistory(false);
            }
        };
        loadContext();
    }, []);

    // Prescriptions Array Logic
    const handlePrescriptionChange = (index, field, value) => {
        setPrescriptions(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addPrescriptionRow = () => {
        setPrescriptions(prev => [...prev, { medicationName: '', dosage: '', frequency: '' }]);
    };

    const removePrescriptionRow = (indexToRemove) => {
        setPrescriptions(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // Submission Logic
    const handleConsultationEnd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Sanitize out totally blank rows safely bypassing tracking bugs
        const cleanedPrescriptions = prescriptions.filter(p => p.medicationName.trim() !== '');

        const payload = {
            patient_id: MOCK_PATIENT_ID,
            doctor_id: MOCK_DOCTOR_ID,
            appointment_id: MOCK_APPT_ID,
            clinical_notes: clinicalNotes,
            prescriptions: cleanedPrescriptions
        };

        try {
            await submitConsultation(payload);
            setSubmitStatus({ type: 'success', msg: 'Consultation successfully recorded.' });
            setClinicalNotes('');
            setPrescriptions([{ medicationName: '', dosage: '', frequency: '' }]);
        } catch (error) {
            setSubmitStatus({ type: 'error', msg: error.message || 'Transmission failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', minHeight: '100vh', padding: '48px' }}>
            
            {/* LEFT COLUMN: CONTEXTUAL TIMELINE */}
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '32px', borderRadius: '24px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Patient History Context</h2>
                <p style={{ color: 'var(--color-outline-variant)', marginBottom: '32px' }}>Review historical constraints and interactions.</p>
                
                {loadingHistory ? (
                    <p>Decrypting historical timeline...</p>
                ) : historyLogs.length === 0 ? (
                    <p style={{ color: 'var(--color-on-surface-variant)' }}>No historical logs detected for this tracker.</p>
                ) : (
                    <div>
                        {historyLogs.map(log => (
                            <HistoryTimelineItem key={log.history_id} record={log} />
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: ACTIVE CONSULTATION INPUT */}
            <div className="clinical-card" style={{ alignSelf: 'start' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Active Assessment</h2>
                <p style={{ color: 'var(--color-outline-variant)', marginBottom: '32px' }}>Formulate real-time analytics.</p>

                {submitStatus?.type === 'success' && <div className="clinical-banner-success">{submitStatus.msg}</div>}
                {submitStatus?.type === 'error' && <div className="clinical-banner-error">{submitStatus.msg}</div>}

                <form onSubmit={handleConsultationEnd}>
                    {/* Clinical Notes TextBox Base Styling override aligning with Native input layout */}
                    <div className="clinical-input-wrapper">
                        <label className="clinical-label">Clinical Observations & Diagnostics</label>
                        <textarea 
                            value={clinicalNotes}
                            onChange={(e) => setClinicalNotes(e.target.value)}
                            className="clinical-input"
                            style={{ minHeight: '200px', resize: 'vertical' }}
                            required
                        />
                    </div>

                    <div style={{ marginTop: '32px', marginBottom: '24px', borderTop: '2px solid var(--color-surface-container-low)', paddingTop: '24px' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Digital Prescriptions</h3>
                        
                        {prescriptions.map((rx, idx) => (
                            <div key={idx} style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto', 
                                gap: '12px', 
                                alignItems: 'end',
                                marginBottom: '16px',
                                backgroundColor: 'var(--color-surface-container-lowest)',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-medical-mist)'
                            }}>
                                <Input 
                                    label="Medication" 
                                    value={rx.medicationName} 
                                    onChange={(e) => handlePrescriptionChange(idx, 'medicationName', e.target.value)} 
                                    placeholder="e.g. Amoxicillin"
                                />
                                <Input 
                                    label="Dosage" 
                                    value={rx.dosage} 
                                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)} 
                                    placeholder="e.g. 500mg"
                                />
                                <Input 
                                    label="Freq" 
                                    value={rx.frequency} 
                                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)} 
                                    placeholder="e.g. 2x Daily"
                                />
                                
                                <button type="button" onClick={() => removePrescriptionRow(idx)} style={{
                                    background: 'var(--color-error-container)',
                                    color: 'var(--color-on-error-container)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '24px',
                                    cursor: 'pointer'
                                }}>
                                    X
                                </button>
                            </div>
                        ))}
                        
                        <Button type="button" variant="secondary" onClick={addPrescriptionRow}>
                            + Add Medication
                        </Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
                        <Button type="submit" isLoading={isSubmitting}>
                            🔐 End & Save Consultation
                        </Button>
                    </div>
                </form>
            </div>
            
        </div>
    );
};

export default ActiveConsultation;
