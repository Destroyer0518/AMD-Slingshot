import React from 'react';

const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    isLoading = false, 
    disabled = false, 
    type = 'button',
    className = ''
}) => {
    const baseClass = variant === 'secondary' ? 'clinical-btn-secondary' : 'clinical-btn-primary';
    const isDisabled = isLoading || disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseClass} ${className}`}
            style={{ position: 'relative' }}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
};

export default Button;
