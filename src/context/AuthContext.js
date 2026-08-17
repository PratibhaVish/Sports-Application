/**
 * AuthContext.js
 * Global authentication state — session uid, db, and user info.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { authenticate as apiAuthenticate, logout as apiLogout } from '../services/odooService';

// ─── State Shape ──────────────────────────────────────────────────────────────

const initialState = {
  isAuthenticated: false,
  uid: null,
  db: null,
  username: null,
  loading: false,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        uid: action.payload.uid,
        db: action.payload.db,
        username: action.payload.username,
      };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async ({ db, login, password }) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const result = await apiAuthenticate({ db, login, password });
      if (!result?.uid) throw new Error('Invalid credentials');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { uid: result.uid, db, username: login },
      });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.message });
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch (_) { /* ignore */ }
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
