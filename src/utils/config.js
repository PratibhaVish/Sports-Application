/**
 * config.js
 * ─────────
 * Auto-detects whether the React app is running:
 *   a) Standalone dev   → http://localhost:3000  (CRA dev server)
 *   b) Odoo local dev   → http://localhost:8069/deploy-test
 *   c) Odoo.sh          → https://<instance>.odoo.com/deploy-test
 *
 * The BASE_URL drives all JSON-RPC calls in odooService.js.
 *
 * Resolution order:
 *   1. REACT_APP_ODOO_BASE_URL env var  (explicit override)
 *   2. Same origin as the page          (works for (b) and (c) automatically)
 *   3. Empty string fallback            (same-origin relative URLs)
 */

const resolveBaseUrl = () => {
  // Explicit env var — highest priority (set in Odoo.sh environment variables)
  if (process.env.REACT_APP_ODOO_BASE_URL) {
    return process.env.REACT_APP_ODOO_BASE_URL.replace(/\/$/, '');
  }

  // Running inside an Odoo page (local or Odoo.sh)?
  // window.location.origin gives us the correct host automatically.
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;

    // CRA standalone dev server on port 3000 — proxy to Odoo on 8069
    if (hostname === 'localhost' && port === '3000') {
      return 'http://localhost:8069';
    }

    // Everything else (8069 local, Odoo.sh, custom domain) — same origin
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  return '';
};

const config = {
  BASE_URL:   resolveBaseUrl(),
  APP_NAME:   process.env.REACT_APP_APP_NAME   || 'Odoo Deploy Test',
  ENV:        process.env.NODE_ENV,
  IS_PROD:    process.env.NODE_ENV === 'production',
  APP_PATH:   '/deploy-test',   // Must match the Odoo controller route
};

export default config;
