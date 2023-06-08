import React from 'react';

export function ColorInput({ name,value, onChange, label, disabled }) {
    return (
        <div>
            {label && <label className="mb-1 d-inline-block">{label}</label>}
            <div className="color_picker">
                <input type="color" name={name} id={name} value={value} onChange={onChange}
                       disabled={disabled && disabled} />
                <label htmlFor={name}>{value}</label>
            </div>
        </div>
    );
};
