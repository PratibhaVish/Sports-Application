/**
 * FormField.js
 * Labeled input with inline error — keeps form pages DRY.
 */

import React from 'react';

const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  hint = '',
}) => (
  <div style={{ marginBottom: 18 }}>
    <label htmlFor={id} style={{
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: 5,
    }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </label>

    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 7,
        border: `1.5px solid ${error ? '#f87171' : '#d1d5db'}`,
        fontSize: '0.93rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        backgroundColor: error ? '#fff5f5' : '#fff',
      }}
    />

    {hint && !error && (
      <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>{hint}</p>
    )}
    {error && (
      <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#dc2626' }}>{error}</p>
    )}
  </div>
);

export default FormField;
