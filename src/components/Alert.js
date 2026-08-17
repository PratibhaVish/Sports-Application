/**
 * Alert.js
 * Dismissable alert banner — success | error | info.
 */

import React from 'react';

const styles = {
  success: { bg: '#d1fae5', border: '#6ee7b7', color: '#065f46' },
  error:   { bg: '#fee2e2', border: '#fca5a5', color: '#991b1b' },
  info:    { bg: '#dbeafe', border: '#93c5fd', color: '#1e40af' },
};

const Alert = ({ type = 'info', message, onDismiss }) => {
  if (!message) return null;
  const { bg, border, color } = styles[type] || styles.info;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '12px 16px',
      borderRadius: 8,
      border: `1px solid ${border}`,
      backgroundColor: bg,
      color,
      fontSize: '0.9rem',
      marginBottom: 16,
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color, fontSize: '1.1rem', marginLeft: 12, lineHeight: 1,
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
