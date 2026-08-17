/**
 * StatusBadge.js
 * Small pill badge that reflects server/deployment status.
 */

import React from 'react';

const configs = {
  online:   { label: '● Online',   bg: '#d1fae5', color: '#065f46' },
  offline:  { label: '● Offline',  bg: '#fee2e2', color: '#991b1b' },
  checking: { label: '◌ Checking…', bg: '#fef9c3', color: '#854d0e' },
  idle:     { label: '○ Idle',     bg: '#f3f4f6', color: '#4b5563' },
};

const StatusBadge = ({ status = 'idle' }) => {
  const { label, bg, color } = configs[status] || configs.idle;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 12px',
      borderRadius: '9999px',
      fontSize: '0.78rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      backgroundColor: bg,
      color,
    }}>
      {label}
    </span>
  );
};

export default StatusBadge;
