// src/hooks/useGamiPress.ts
// v5.0 - Headless API Facade Aligned (No Auth / No Nonce)

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

export interface RankData {
  current: string;
  icon: string;
  next_milestone: number;
  progress_percent: number;
}

export interface PlayerStats {
  xp: number;
  level: number;
  rank: RankData;
}

export interface GamiPressData {
  stats: PlayerStats;
}

interface GamiPressHookResponse {
  data: GamiPressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();

  const [data, setData] = useState<GamiPressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGamiPressData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';

      const endpoint = `${wpRestUrl}/djzeneyer/v1/gamipress/${user.id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error('API returned success=false');
      }

      const raw = result.stats || {};

      setData({
        stats: {
          xp: Number(raw.xp) || 0,
          level: Number(raw.level) || 1,
          rank: {
            current: raw.rank?.current || 'Zen Novice',
            icon: raw.rank?.icon || '',
            next_milestone: Number(raw.rank?.next_milestone) || 100,
            progress_percent: Number(raw.rank?.progress_percent) || 0,
          }
        }
      });

    } catch (err) {
      console.error('[useGamiPress]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGamiPressData();
  }, [fetchGamiPressData]);

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchGamiPressData, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchGamiPressData]);

  return { data, loading, error, refresh: fetchGamiPressData };
};
