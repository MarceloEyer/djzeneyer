// src/hooks/useRecentActivity.ts
// v5.0 - Headless Facade Aligned (No Nonce / No Credentials)

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

export interface ZenActivity {
  id: string;
  type: 'loot' | 'achievement';
  description: string;
  xp: number;
  timestamp: number;
}

interface ActivityResponse {
  success: boolean;
  activities: ZenActivity[];
}

interface UseRecentActivityResponse {
  data: ZenActivity[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useRecentActivity = (): UseRecentActivityResponse => {
  const { user } = useUser();

  const [data, setData] = useState<ZenActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';

      const endpoint = `${wpRestUrl}/djzeneyer/v1/activity/${user.id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json: ActivityResponse = await response.json();

      if (!json?.success || !Array.isArray(json.activities)) {
        throw new Error('Invalid activity payload');
      }

      setData(json.activities);

    } catch (err) {
      console.error('[useRecentActivity]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load on mount / user change
  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  // Polling alinhado com cache do backend (10min → frontend 60s ok)
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchActivity]);

  return { data, loading, error, refresh: fetchActivity };
};
