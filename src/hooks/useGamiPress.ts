// src/hooks/useGamiPress.ts
// v8.0 - REACT QUERY MIGRATION (replaces manual fetch + useState + setInterval)

import { useUser } from '../contexts/UserContext';
import { useGamipressQuery } from './useQueries';
import type { ZenGameUserData } from '../types/gamification';

export type GamiPressData = ZenGameUserData;

interface GamiPressHookResponse {
  data: GamiPressData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  // Legacy helpers for easier migration
  mainPoints: number;
  currentRank: string;
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
  achievements: [],
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

  return {
    data: resolved,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: () => { refetch(); },
    // Legacy mapping (uses dynamic slug from backend)
    mainPoints: resolved.points[resolved.main_points_slug]?.amount ?? 0,
    currentRank: resolved.rank.current.title,
  };
};
