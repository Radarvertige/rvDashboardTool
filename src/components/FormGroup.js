import React from 'react';

function FormGroup({ label, id, value, onChange, placeholder, type = 'text', options = [] }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === 'text' ? (
        <input
          type="text"
          id={id}
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <select id={id} className="form-control" value={value} onChange={onChange}>
          <option value="">-- Kies een dashboard uit de lijst. --</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default FormGroup;
