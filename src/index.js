/**
 * index.js
 * Application entry point — mounts React tree to #root.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ── Global resets (minimal) ──────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f8f9fc; }
  input:focus { outline: 2px solid #6366f1; outline-offset: 1px; }
  button:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
`;
document.head.appendChild(style);

// ── Mount ─────────────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
