/**
 * LoginPage.js
 * Test Odoo session authentication — shows uid & session info on success.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { validateLoginForm, isValid } from '../utils/validators';

const LoginPage = () => {
  const { login, logout, isAuthenticated, uid, db, username, loading, error } = useAuth();

  const [form, setForm]   = useState({ db: '', login: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (field) => (value) => setForm(f => ({ ...f, [field]: value }));

  const handleLogin = async () => {
    const errs = validateLoginForm(form);
    setErrors(errs);
    if (!isValid(errs)) return;
    await login(form);
  };

  // ── Authenticated view ────────────────────────────────────────────────────

  if (isAuthenticated) {
    return (
      <div style={{ padding: '32px 28px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '1.65rem', color: '#1e1b4b', fontWeight: 800 }}>
          Auth Test
        </h1>
        <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '0.92rem' }}>
          Session active
        </p>

        <div style={{
          background: '#d1fae5',
          border: '1.5px solid #6ee7b7',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 24,
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#065f46', fontWeight: 800 }}>
            ✅ Authentication Successful
          </h3>
          {[
            ['Username', username],
            ['Database', db],
            ['User ID (uid)', uid],
            ['Session', 'Active'],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid #a7f3d0',
            }}>
              <span style={{ color: '#047857', fontSize: '0.88rem' }}>{label}</span>
              <span style={{ fontWeight: 700, color: '#065f46', fontSize: '0.88rem' }}>{String(val)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          style={{
            padding: '11px 28px',
            background: '#fee2e2',
            color: '#991b1b',
            border: '1.5px solid #fca5a5',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.93rem',
            cursor: 'pointer',
          }}
        >
          🔓 End Session
        </button>
      </div>
    );
  }

  // ── Login form ────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '32px 28px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '1.65rem', color: '#1e1b4b', fontWeight: 800 }}>
        Auth Test
      </h1>
      <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '0.92rem' }}>
        Test Odoo JSON-RPC session authentication
      </p>

      {error && <Alert type="error" message={error} />}

      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '28px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        borderTop: '4px solid #6366f1',
      }}>
        <FormField id="db"       label="Database"  value={form.db}       onChange={set('db')}       error={errors.db}       required placeholder="my_odoo_db" />
        <FormField id="login"    label="Username"  value={form.login}    onChange={set('login')}    error={errors.login}    required placeholder="admin" />
        <FormField id="password" label="Password"  value={form.password} onChange={set('password')} error={errors.password} required type="password" />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
          }}
        >
          {loading ? '⏳ Authenticating…' : '🔐 Sign In'}
        </button>
      </div>

      <p style={{ marginTop: 16, color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>
        Uses Odoo JSON-RPC <code>/web/session/authenticate</code>
      </p>
    </div>
  );
};

export default LoginPage;
