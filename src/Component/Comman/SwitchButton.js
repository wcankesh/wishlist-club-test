import React from 'react';

const SwitchButton = ({value, name, onChange, checked}) => {
    return (
        <div className='switch-button'>
            <input type="checkbox"
                   className="switch-btn-input"
                   id={name}
                   value={value}
                   name={name}
                   onChange={(e) => onChange({
                       target: {
                           name: name,
                           value: e.target.checked ? "1" : "0"
                       }
                   })}
                   checked={checked}
            />
            <label className="witch-button-label" htmlFor={name}/>
        </div>
    );
};

export default SwitchButton;