/**
 * useServerInfo.js
 * Fetches Odoo server version + ping latency.
 */

import { useState, useEffect } from 'react';
import { getServerInfo, pingServer } from '../services/odooService';

const useServerInfo = () => {
  const [info, setInfo]         = useState(null);
  const [latency, setLatency]   = useState(null);
  const [status, setStatus]     = useState('idle'); // idle | checking | online | offline
  const [error, setError]       = useState(null);

  const checkServer = async () => {
    setStatus('checking');
    setError(null);
    try {
      const [serverInfo, pingResult] = await Promise.all([
        getServerInfo(),
        pingServer(),
      ]);
      setInfo(serverInfo);
      setLatency(pingResult.latencyMs);
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      setError(err.message);
    }
  };

  useEffect(() => { checkServer(); }, []);

  return { info, latency, status, error, checkServer };
};

export default useServerInfo;
