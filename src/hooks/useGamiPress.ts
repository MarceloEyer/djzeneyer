// src/hooks/useGamiPress.ts
// v6.0 - Unified API Response Handler

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image?: string;
  earned: boolean;
}

export interface GamiPressData {
  points: number;
  level: number;
  rank: string;
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
    if (!user?.id) {
      setLoading(false);
      return;
    }

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

      // Handle both API response formats
      let parsedData: GamiPressData;

      if (result?.data) {
        // Format from inc/api.php: { success, data: { points, level, rank, ... } }
        const d = result.data;
        parsedData = {
          points: Number(d.points) || 0,
          level: Number(d.level) || 1,
          rank: d.rank || 'Zen Novice',
          nextLevelPoints: Number(d.nextLevelPoints) || 100,
          progressToNextLevel: Number(d.progressToNextLevel) || 0,
          achievements: Array.isArray(d.achievements) ? d.achievements : [],
        };
      } else if (result?.stats) {
        // Format from inc/api-dashboard.php: { success, stats: { xp, level, rank: {...} } }
        const s = result.stats;
        parsedData = {
          points: Number(s.xp) || 0,
          level: Number(s.level) || 1,
          rank: s.rank?.current || 'Zen Novice',
          nextLevelPoints: Number(s.rank?.next_milestone) || 100,
          progressToNextLevel: Number(s.rank?.progress_percent) || 0,
          achievements: [],
        };
      } else {
        // Fallback for unexpected format
        parsedData = {
          points: 0,
          level: 1,
          rank: 'Zen Novice',
          nextLevelPoints: 100,
          progressToNextLevel: 0,
          achievements: [],
        };
      }

      setData(parsedData);

    } catch (err) {
      console.error('[useGamiPress]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set fallback data on error
      setData({
        points: 0,
        level: 1,
        rank: 'Zen Novice',
        nextLevelPoints: 100,
        progressToNextLevel: 0,
        achievements: [],
      });
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

  // Return both flat properties (for GamificationWidget) and nested data (for DashboardPage)
  const fallback: GamiPressData = {
    points: 0,
    level: 1,
    rank: 'Zen Novice',
    nextLevelPoints: 100,
    progressToNextLevel: 0,
    achievements: [],
  };

  return {
    // Flat properties for direct destructuring
    points: data?.points ?? fallback.points,
    level: data?.level ?? fallback.level,
    rank: data?.rank ?? fallback.rank,
    nextLevelPoints: data?.nextLevelPoints ?? fallback.nextLevelPoints,
    progressToNextLevel: data?.progressToNextLevel ?? fallback.progressToNextLevel,
    achievements: data?.achievements ?? fallback.achievements,
    // Nested data object
    data,
    loading,
    error,
    refresh: fetchGamiPressData,
  };
};
