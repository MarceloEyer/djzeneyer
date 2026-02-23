// src/hooks/useGamiPress.ts
// v8.0 - REACT QUERY MIGRATION (replaces manual fetch + useState + setInterval)

import { useUser } from '../contexts/UserContext';
import { useGamipressQuery } from './useQueries';

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
  totalTracks: number;
  eventsAttended: number;
  streak: number;
  streakFire: boolean;
}

interface GamiPressHookResponse extends GamiPressData {
  data: GamiPressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * DEFAULTS
 * ========================= */

const FALLBACK: GamiPressData = {
  points: 0,
  level: 1,
  rank: 'Zen Novice',
  rankId: 0,
  nextLevelPoints: 100,
  progressToNextLevel: 0,
  achievements: [],
  totalTracks: 0,
  eventsAttended: 0,
  streak: 0,
  streakFire: false,
};

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();
  const { data, isLoading, error, refetch } = useGamipressQuery(user?.id, user?.token);

  const resolved: GamiPressData = data ?? FALLBACK;

  return {
    // Spread all fields for backward-compatible destructuring
    points: resolved.points,
    level: resolved.level,
    rank: resolved.rank,
    rankId: resolved.rankId,
    nextLevelPoints: resolved.nextLevelPoints,
    progressToNextLevel: resolved.progressToNextLevel,
    achievements: resolved.achievements,
    totalTracks: resolved.totalTracks,
    eventsAttended: resolved.eventsAttended,
    streak: resolved.streak,
    streakFire: resolved.streakFire,
    // Hook meta
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: () => { refetch(); },
  };
};
