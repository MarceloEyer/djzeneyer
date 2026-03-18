// src/hooks/useGamiPress.ts
// v8.0 - REACT QUERY MIGRATION (replaces manual fetch + useState + setInterval)

import { useMemo, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useGamipressQuery } from './useQueries';
import type { ZenGameUserData, ZenGameAchievement } from '../types/gamification';

export type GamiPressData = ZenGameUserData;

interface GamiPressHookResponse {
  data: GamiPressData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  // Convenience helpers
  mainPoints: number;
  points: number; // alias for mainPoints
  currentRank: string;
  rank: string; // alias for currentRank
  level: number;
  progressToNextLevel: number;
  nextLevelPoints: number;
  achievements: ZenGameAchievement[];
}

/* =========================
 * DEFAULTS
 * ========================= */

const FALLBACK: GamiPressData = {
  user_id: 0,
  points: {
    points: { name: 'XP', amount: 0, image: '' }
  },
  rank: {
    current: {
      id: 0,
      title: 'Zen Novice',
      image: '',
    },
    progress: 0,
    requirements: [],
    next: null
  },
  achievements_earned: [],
  achievements_locked: [],
  recent_achievements: [],
  logs: [],
  stats: {
    totalTracks: 0,
    eventsAttended: 0,
    streak: 0,
    streakFire: false,
  },
  main_points_slug: 'points',
  lastUpdate: '',
  version: '1.1.0'
};

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();
  const { data, isLoading, error, refetch } = useGamipressQuery(user?.id, user?.token);

  const resolved: GamiPressData = (data as GamiPressData) ?? FALLBACK;

  // ⚡ Bolt: Wrapped refresh function with useCallback to keep the reference stable.
  const refresh = useCallback(() => { refetch(); }, [refetch]);

  // ⚡ Bolt: Wrapped return value with useMemo to prevent unnecessary re-renders of consuming components (like GamiPressContext Provider).
  return useMemo(() => {
    // NEW: Rely on the backend's main_points_slug for truth.
    const main_slug = resolved.main_points_slug || 'points';
    const mainPoints = resolved.points[main_slug]?.amount ?? 0;

    return {
      data: resolved,
      loading: isLoading,
      error: error ? (error as Error).message : null,
      refresh,
      // --- SMART DISCOVERY ---
      mainPoints,
      points: mainPoints,
      currentRank: resolved.rank?.current?.title ?? FALLBACK.rank.current.title,
      rank: resolved.rank?.current?.title ?? FALLBACK.rank.current.title,
      level: resolved.rank?.current?.id || 1, // Using ID as level if level prop is missing
      progressToNextLevel: resolved.rank?.progress || 0,
      nextLevelPoints: resolved.rank?.requirements?.[0]?.required || 0,
      achievements: [
        ...(resolved.achievements_earned || []),
        ...(resolved.achievements_locked || [])
      ],
    };
  }, [resolved, isLoading, error, refresh]);
};
