/**
 * DatabaseManager.js
 * Full CRUD page for Odoo databases — list, create, drop, duplicate.
 */

import React, { useState, useEffect } from 'react';
import useDatabase from '../hooks/useDatabase';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { validateCreateDBForm, isValid } from '../utils/validators';

// ─── Sub-component: Create DB Form ───────────────────────────────────────────

const INITIAL_FORM = {
  name: '',
  masterPassword: '',
  lang: 'en_US',
  password: '',
  login: 'admin',
  countryCode: '',
  demo: false,
};

const CreateDBForm = ({ onSubmit, loading }) => {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const set = (field) => (value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    const errs = validateCreateDBForm(form);
    setErrors(errs);
    if (!isValid(errs)) return;
    onSubmit(form);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '24px 28px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderTop: '4px solid #6366f1',
    }}>
      <h3 style={{ margin: '0 0 20px', color: '#1e1b4b', fontWeight: 800, fontSize: '1.05rem' }}>
        🗄️ Create New Database
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <FormField id="db-name"     label="Database Name"   value={form.name}           onChange={set('name')}           error={errors.name}          required hint="Letters, numbers, hyphens, underscores only" />
        <FormField id="master-pwd"  label="Master Password" value={form.masterPassword}  onChange={set('masterPassword')}  error={errors.masterPassword} required type="password" hint="Odoo instance master password" />
        <FormField id="admin-login" label="Admin Login"     value={form.login}           onChange={set('login')}           />
        <FormField id="admin-pwd"   label="Admin Password"  value={form.password}        onChange={set('password')}        error={errors.password}      required type="password" />
        <FormField id="lang"        label="Language Code"   value={form.lang}            onChange={set('lang')}            hint="e.g. en_US, fr_FR" />
        <FormField id="country"     label="Country Code"    value={form.countryCode}     onChange={set('countryCode')}     hint="ISO 2-letter code e.g. US, FR" />
      </div>

      {/* Demo data toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <input
          id="demo-data"
          type="checkbox"
          checked={form.demo}
          onChange={(e) => set('demo')(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: '#6366f1' }}
        />
        <label htmlFor="demo-data" style={{ fontSize: '0.88rem', color: '#374151', cursor: 'pointer' }}>
          Load demo data (useful for testing)
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '11px 28px',
          background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '0.93rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
        }}
      >
        {loading ? '⏳ Creating…' : '✚ Create Database'}
      </button>
    </div>
  );
};

// ─── Sub-component: DB List ───────────────────────────────────────────────────

const DBList = ({ databases, onDrop, onDuplicate, loading }) => {
  const [masterPwd, setMasterPwd]   = useState('');
  const [dupTarget, setDupTarget]   = useState(null);
  const [dupName, setDupName]       = useState('');

  if (databases.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 0',
        color: '#9ca3af', fontSize: '0.95rem',
      }}>
        No databases found. Create one above or click Refresh.
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <FormField
          id="master-pwd-list"
          label="Master Password (required for drop / duplicate)"
          value={masterPwd}
          onChange={setMasterPwd}
          type="password"
          hint="Enter before clicking Drop or Duplicate"
        />
      </div>

      {databases.map(db => (
        <div key={db} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '13px 16px',
          borderRadius: 8,
          border: '1.5px solid #e5e7eb',
          marginBottom: 10,
          backgroundColor: '#fafafa',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.2rem' }}>🗃️</span>
            <span style={{ fontWeight: 600, color: '#111827' }}>{db}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {dupTarget === db ? (
              <>
                <input
                  value={dupName}
                  onChange={e => setDupName(e.target.value)}
                  placeholder="New DB name"
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: '0.85rem' }}
                />
                <button
                  onClick={() => { onDuplicate({ masterPassword: masterPwd, name: db, newName: dupName }); setDupTarget(null); setDupName(''); }}
                  disabled={loading || !dupName}
                  style={{ ...btnStyle('#10b981') }}
                >✓ Confirm</button>
                <button onClick={() => { setDupTarget(null); setDupName(''); }} style={btnStyle('#6b7280')}>✕</button>
              </>
            ) : (
              <>
                <button onClick={() => setDupTarget(db)} style={btnStyle('#6366f1')}>⎘ Duplicate</button>
                <button
                  onClick={() => { if (window.confirm(`Drop "${db}"? This is irreversible.`)) onDrop({ masterPassword: masterPwd, name: db }); }}
                  disabled={loading}
                  style={btnStyle('#ef4444')}
                >🗑 Drop</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const btnStyle = (bg) => ({
  padding: '6px 14px',
  borderRadius: 7,
  border: 'none',
  backgroundColor: bg + '18',
  color: bg,
  fontWeight: 700,
  fontSize: '0.82rem',
  cursor: 'pointer',
});

// ─── Main Page ────────────────────────────────────────────────────────────────

const DatabaseManager = () => {
  const {
    databases, loading, error, successMsg,
    fetchDatabases, createDB, dropDB, duplicateDB,
  } = useDatabase();

  const [dismissedError, setDismissedError]     = useState(false);
  const [dismissedSuccess, setDismissedSuccess] = useState(false);

  useEffect(() => { fetchDatabases(); }, [fetchDatabases]);
  useEffect(() => { setDismissedError(false); }, [error]);
  useEffect(() => { setDismissedSuccess(false); }, [successMsg]);

  return (
    <div style={{ padding: '32px 28px', maxWidth: 920, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', color: '#1e1b4b', fontWeight: 800 }}>
            Database Manager
          </h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.92rem' }}>
            Create, list, duplicate, or drop Odoo databases
          </p>
        </div>
        <button
          onClick={fetchDatabases}
          disabled={loading}
          style={{
            padding: '9px 20px',
            background: '#f3f4f6',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            color: '#374151',
          }}
        >
          {loading ? '⏳ Loading…' : '🔄 Refresh'}
        </button>
      </div>

      {!dismissedError   && <Alert type="error"   message={error}      onDismiss={() => setDismissedError(true)} />}
      {!dismissedSuccess && <Alert type="success" message={successMsg}  onDismiss={() => setDismissedSuccess(true)} />}

      <CreateDBForm onSubmit={createDB} loading={loading} />

      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '24px 28px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        borderTop: '4px solid #10b981',
        marginTop: 24,
      }}>
        <h3 style={{ margin: '0 0 20px', color: '#065f46', fontWeight: 800, fontSize: '1.05rem' }}>
          📋 Existing Databases ({databases.length})
        </h3>
        <DBList
          databases={databases}
          onDrop={dropDB}
          onDuplicate={duplicateDB}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DatabaseManager;
