/**
 * Navbar.js
 * Top navigation bar with active-tab highlighting.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'database',  label: 'Database Manager' },
  { id: 'login',     label: 'Auth Test' },
];

const Navbar = ({ activePage, onNavigate }) => {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1c2e 0%, #2d3561 100%)',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      height: 58,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.5rem' }}>🐙</span>
        <span style={{
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.05rem',
          letterSpacing: '-0.01em',
        }}>
          Odoo<span style={{ color: '#7c87ff' }}>.sh</span> Deploy Test
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              background: activePage === tab.id ? 'rgba(124,135,255,0.22)' : 'transparent',
              border: 'none',
              color: activePage === tab.id ? '#a5b4fc' : '#cbd5e1',
              padding: '8px 16px',
              borderRadius: 7,
              cursor: 'pointer',
              fontWeight: activePage === tab.id ? 700 : 500,
              fontSize: '0.88rem',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auth info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#94a3b8', fontSize: '0.83rem' }}>
              Signed in as <strong style={{ color: '#c7d2fe' }}>{username}</strong>
            </span>
            <button
              onClick={logout}
              style={{
                background: '#ef444420',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '5px 14px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <span style={{ color: '#64748b', fontSize: '0.83rem' }}>Not authenticated</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
