import React from 'react';
import './SelectField.css';

const SelectField = ({ label, name, options, value, onChange }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} value={value} onChange={onChange}>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
