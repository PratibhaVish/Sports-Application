/**
 * odooService.js
 * ──────────────
 * All Odoo JSON-RPC API calls.
 * Uses config.BASE_URL so the same code works on:
 *   • localhost:3000  (CRA proxy → 8069)
 *   • localhost:8069  (Odoo local)
 *   • *.odoo.com      (Odoo.sh)
 */

import config from '../utils/config';

const BASE_URL = config.BASE_URL;

// ─── JSON-RPC Helper ─────────────────────────────────────────────────────────

const rpc = async (endpoint, params = {}) => {
  const payload = {
    jsonrpc: '2.0',
    method:  'call',
    id:      Date.now(),
    params,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:      'POST',
    credentials: 'include',   // send Odoo session cookie
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.data?.message || json.error.message || 'Unknown RPC error');
  }
  return json.result;
};

// ─── Authentication ───────────────────────────────────────────────────────────

export const authenticate = ({ db, login, password }) =>
  rpc('/web/session/authenticate', { db, login, password });

export const logout = () =>
  rpc('/web/session/destroy', {});

// ─── Database Management ─────────────────────────────────────────────────────

export const listDatabases = () =>
  rpc('/web/database/list', {});

export const createDatabase = ({
  masterPassword, name,
  lang = 'en_US', password,
  login = 'admin', countryCode = '', demo = false,
}) =>
  rpc('/web/database/create', {
    master_pwd:   masterPassword,
    name, lang, password, login,
    country_code: countryCode,
    demo,
  });

export const dropDatabase = ({ masterPassword, name }) =>
  rpc('/web/database/drop', { master_pwd: masterPassword, name });

export const duplicateDatabase = ({ masterPassword, name, newName }) =>
  rpc('/web/database/duplicate', {
    master_pwd: masterPassword,
    name,
    new_name: newName,
  });

// ─── Generic CRUD (requires auth session) ────────────────────────────────────

export const searchRead = ({ model, domain = [], fields = [], limit = 20 }) =>
  rpc('/web/dataset/call_kw', {
    model,
    method: 'search_read',
    args:   [domain],
    kwargs: { fields, limit },
  });

export const createRecord = ({ model, values }) =>
  rpc('/web/dataset/call_kw', {
    model,
    method: 'create',
    args:   [values],
    kwargs: {},
  });

// ─── Health / Version ─────────────────────────────────────────────────────────

export const pingServer = async () => {
  const start = Date.now();
  await rpc('/web/webclient/version_info', {});
  return { latencyMs: Date.now() - start };
};

export const getServerInfo = () =>
  rpc('/web/webclient/version_info', {});
