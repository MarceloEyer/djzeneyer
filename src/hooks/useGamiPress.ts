// src/hooks/useGamiPress.ts
// v7.2 - OPTIMIZED GAMIPRESS API AGGREGATION

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { buildApiUrl } from '../config/api';

/* =========================
 * INTERFACES
 * ========================= */

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  date_earned: string;
}

export interface GamiPressData {
  points: number;
  level: number;
  rank: string;
  rankId: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  achievements: Achievement[];
}

interface GamiPressHookResponse extends GamiPressData {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamiPressData = useCallback(async () => {
    if (!user?.id || !user?.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const endpoint = buildApiUrl('djzeneyer/v1/gamipress/user-data');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      };

      if (wpData.nonce) {
        headers['X-WP-Nonce'] = wpData.nonce;
      }

      const response = await fetch(endpoint, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
            console.error('[useGamiPress] ❌ 401 Unauthorized');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newData = await response.json();
      setData(newData);

    } catch (err) {
      console.error('[useGamiPress]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Set fallback data on error
      setData({
        points: 0,
        level: 1,
        rank: 'Zen Novice',
        rankId: 0,
        nextLevelPoints: 100,
        progressToNextLevel: 0,
        achievements: [],
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.token]);

  useEffect(() => {
    fetchGamiPressData();
  }, [fetchGamiPressData]);

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchGamiPressData, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchGamiPressData]);

  const fallback: GamiPressData = {
    points: 0,
    level: 1,
    rank: 'Zen Novice',
    rankId: 0,
    nextLevelPoints: 100,
    progressToNextLevel: 0,
    achievements: [],
  };

  return {
    points: data?.points ?? fallback.points,
    level: data?.level ?? fallback.level,
    rank: data?.rank ?? fallback.rank,
    rankId: data?.rankId ?? fallback.rankId,
    nextLevelPoints: data?.nextLevelPoints ?? fallback.nextLevelPoints,
    progressToNextLevel: data?.progressToNextLevel ?? fallback.progressToNextLevel,
    achievements: data?.achievements ?? fallback.achievements,
    data,
    loading,
    error,
    refresh: fetchGamiPressData,
  };
};
