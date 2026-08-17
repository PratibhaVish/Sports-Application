/**
 * App.js
 * Root component — manages page routing via simple state switch
 * and wraps the tree with AuthProvider.
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DatabaseManager from './pages/DatabaseManager';
import LoginPage from './pages/LoginPage';

// ─── Simple client-side "router" ─────────────────────────────────────────────

const PAGES = {
  dashboard: Dashboard,
  database:  DatabaseManager,
  login:     LoginPage,
};

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        <main>
          <PageComponent onNavigate={setActivePage} />
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '20px',
          color: '#9ca3af',
          fontSize: '0.8rem',
          borderTop: '1px solid #e5e7eb',
          marginTop: 40,
        }}>
          Odoo.sh Deploy Test App · React {React.version} · Built for deployment testing
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
