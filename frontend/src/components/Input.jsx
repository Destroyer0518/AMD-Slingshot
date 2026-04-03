import React from 'react';

const Input = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = 'text', 
    placeholder = '', 
    error = null,
    required = false 
}) => {
    return (
        <div className="clinical-input-wrapper">
            {label && (
                <label htmlFor={name} className="clinical-label">
                    {label} {required && <span style={{color: 'var(--color-error)'}}>*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`clinical-input ${error ? 'error' : ''}`}
                required={required}
            />
            {error && <span className="clinical-error-text">{error}</span>}
        </div>
    );
};

export default Input;
