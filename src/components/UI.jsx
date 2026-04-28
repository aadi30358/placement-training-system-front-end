import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const variants = {
        primary: 'submit-btn', // Reuse submit-btn for now as it's professional
        secondary: 'background: #fff; border: 1.5px solid #e2e8f0; color: #475569;',
        danger: 'background: #fef2f2; color: #dc2626; border: 1.5px solid #fecaca;',
        success: 'background: #ecfdf5; color: #059669; border: 1.5px solid #a7f3d0;',
    };

    // Note: In a real app, I'd define .btn-secondary etc in index.css
    // For now, I'll use the existing .submit-btn and some inline and class combinations
    const btnClass = variant === 'primary' ? 'submit-btn' : 'form-input'; // fallback

    return (
        <button
            className={`${btnClass} ${className}`}
            style={variant !== 'primary' ? { padding: '10px 20px', width: 'auto', display: 'inline-flex' } : {}}
            {...props}
        >
            {children}
        </button>
    );
};

export const Input = ({ label, error, className = '', ...props }) => (
    <div className={`form-group ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <div className="input-wrapper">
            <input
                className={`form-input ${error ? 'border-red-500' : ''}`}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export const Card = ({ children, title, subtitle, className = '', headerAction }) => (
    <div className={`card ${className}`}>
        {(title || subtitle || headerAction) && (
            <div className="flex items-center justify-between mb-6">
                <div>
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
                {headerAction}
            </div>
        )}
        {children}
    </div>
);
