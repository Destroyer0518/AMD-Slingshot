import React from 'react';

const Select = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options = [], 
    error = null,
    required = false,
    placeholder = 'Select an option'
}) => {
    return (
        <div className="clinical-input-wrapper">
            {label && (
                <label htmlFor={name} className="clinical-label">
                    {label} {required && <span style={{color: 'var(--color-error)'}}>*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`clinical-input ${error ? 'error' : ''}`}
                required={required}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="clinical-error-text">{error}</span>}
        </div>
    );
};

export default Select;
