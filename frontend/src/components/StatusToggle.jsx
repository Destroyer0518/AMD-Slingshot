import React from 'react';

const StatusToggle = ({ currentStatus, onStatusChange }) => {
    return (
        <select 
            value={currentStatus} 
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
                backgroundColor: 'var(--color-surface-container-highest)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'var(--font-headlines)',
                fontWeight: '600',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                outline: 'none'
            }}
        >
            <option value="Available">Available</option>
            <option value="In Surgery">In Surgery</option>
            <option value="Off Duty">Off Duty</option>
        </select>
    );
};

export default StatusToggle;
