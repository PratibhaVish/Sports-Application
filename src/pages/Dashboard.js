/**
 * Dashboard.js
 * Home page — server health, version info, and quick actions.
 */

import React from 'react';
import useServerInfo from '../hooks/useServerInfo';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';

const Card = ({ title, children, accent = '#6366f1' }) => (
  <div style={{
    background: '#fff',
    borderRadius: 12,
    padding: '22px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    borderTop: `4px solid ${accent}`,
  }}>
    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#374151', fontWeight: 700 }}>
      {title}
    </h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #f3f4f6',
  }}>
    <span style={{ color: '#6b7280', fontSize: '0.88rem' }}>{label}</span>
    <span style={{ color: '#111827', fontWeight: 600, fontSize: '0.88rem' }}>{value ?? '—'}</span>
  </div>
);

const Dashboard = ({ onNavigate }) => {
  const { info, latency, status, error, checkServer } = useServerInfo();

  return (
    <div style={{ padding: '32px 28px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', color: '#1e1b4b', fontWeight: 800 }}>
            Deployment Dashboard
          </h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.92rem' }}>
            Odoo.sh environment health & quick actions
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {error && <Alert type="error" message={`Server unreachable: ${error}`} />}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Server Info */}
        <Card title="🖥️ Server Info" accent="#6366f1">
          <InfoRow label="Server Version" value={info?.server_version} />
          <InfoRow label="Protocol Version" value={info?.protocol_version} />
          <InfoRow label="Server Serie" value={info?.server_serie} />
          <InfoRow label="Response Latency" value={latency != null ? `${latency} ms` : null} />
          <InfoRow label="Base URL" value={process.env.REACT_APP_ODOO_BASE_URL || 'http://localhost:8069'} />
        </Card>

        {/* Environment */}
        <Card title="🌍 Environment" accent="#10b981">
          <InfoRow label="App Name" value={process.env.REACT_APP_APP_NAME || 'Odoo Deploy Test'} />
          <InfoRow label="Node Env" value={process.env.NODE_ENV} />
          <InfoRow label="React Version" value={React.version} />
          <InfoRow label="Build Time" value={new Date().toLocaleDateString()} />
          <InfoRow label="App Version" value="1.0.0" />
        </Card>

      </div>

      {/* Quick Actions */}
      <Card title="⚡ Quick Actions" accent="#f59e0b">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
          {[
            { label: '🔄 Re-check Server', action: checkServer, bg: '#ede9fe', color: '#5b21b6' },
            { label: '🗄️ Manage Databases', action: () => onNavigate('database'), bg: '#d1fae5', color: '#065f46' },
            { label: '🔐 Test Auth', action: () => onNavigate('login'), bg: '#dbeafe', color: '#1e40af' },
          ].map(({ label, action, bg, color }) => (
            <button
              key={label}
              onClick={action}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: bg,
                color,
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Deployment checklist */}
      <div style={{ marginTop: 24 }}>
        <Card title="✅ Odoo.sh Deployment Checklist" accent="#ec4899">
          {[
            ['Set REACT_APP_ODOO_BASE_URL in .env', status === 'online'],
            ['Server responding (ping test)', status === 'online'],
            ['Version info returned', !!info],
            ['React build ready', true],
          ].map(([item, done]) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 0', borderBottom: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: '1rem' }}>{done ? '✅' : '⬜'}</span>
              <span style={{ fontSize: '0.88rem', color: done ? '#111827' : '#9ca3af' }}>{item}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
