/**
 * useDatabase.js
 * Custom hook — wraps DB list, create, drop, duplicate operations
 * and keeps local UI state (loading, error, list).
 */

import { useState, useCallback } from 'react';
import {
  listDatabases,
  createDatabase,
  dropDatabase,
  duplicateDatabase,
} from '../services/odooService';

const useDatabase = () => {
  const [databases, setDatabases]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const clearMessages = () => { setError(null); setSuccessMsg(null); };

  // ── List ──────────────────────────────────────────────────────────────────

  const fetchDatabases = useCallback(async () => {
    setLoading(true);
    clearMessages();
    try {
      const list = await listDatabases();
      setDatabases(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────

  const createDB = useCallback(async (formData) => {
    setLoading(true);
    clearMessages();
    try {
      await createDatabase(formData);
      setSuccessMsg(`Database "${formData.name}" created successfully!`);
      await fetchDatabases();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchDatabases]);

  // ── Drop ──────────────────────────────────────────────────────────────────

  const dropDB = useCallback(async ({ masterPassword, name }) => {
    setLoading(true);
    clearMessages();
    try {
      await dropDatabase({ masterPassword, name });
      setSuccessMsg(`Database "${name}" dropped.`);
      await fetchDatabases();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchDatabases]);

  // ── Duplicate ─────────────────────────────────────────────────────────────

  const duplicateDB = useCallback(async ({ masterPassword, name, newName }) => {
    setLoading(true);
    clearMessages();
    try {
      await duplicateDatabase({ masterPassword, name, newName });
      setSuccessMsg(`Database "${name}" duplicated as "${newName}".`);
      await fetchDatabases();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchDatabases]);

  return {
    databases,
    loading,
    error,
    successMsg,
    fetchDatabases,
    createDB,
    dropDB,
    duplicateDB,
  };
};

export default useDatabase;
