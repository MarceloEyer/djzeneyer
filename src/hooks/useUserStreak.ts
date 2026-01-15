// src/hooks/useUserStreak.ts
// v5.0 - Headless Facade Aligned (No Nonce / No Credentials)

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

interface StreakData {
  streak: number;
  fire: boolean;
}

interface UseUserStreakResponse {
  data: StreakData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useUserStreak = (): UseUserStreakResponse => {
  const { user } = useUser();

  const [data, setData] = useState<StreakData>({
    streak: 0,
    fire: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';

      const endpoint = `${wpRestUrl}/djzeneyer/v1/streak/${user.id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error('API returned success=false');
      }

      const streakValue = Number(result.streak) || 0;

      setData({
        streak: streakValue,
        fire: streakValue >= 3,
      });

    } catch (err) {
      console.error('[useUserStreak]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData({ streak: 0, fire: false });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load on mount / user change
  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  // Polling alinhado com os outros hooks
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchStreak, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchStreak]);

  return { data, loading, error, refresh: fetchStreak };
};
