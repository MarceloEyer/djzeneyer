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

export interface PointType {
  name: string;
  amount: number;
  image: string;
}

export interface LogEntry {
  id: number;
  type: string;
  description: string;
  date: string;
  points: number;
}

export interface GamiPressData {
  points: Record<string, PointType>;
  rank: {
    current: { id: number; title: string; image: string };
    next: { id: number; title: string; image: string } | null;
    progress: number;
  };
  achievements: Achievement[];
  logs: LogEntry[];
  stats: {
    totalTracks: number;
    eventsAttended: number;
    streak: number;
    streakFire: boolean;
  };
  lastUpdate: string;
}

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
  points: {
    points: { name: 'XP', amount: 0, image: '' }
  },
  rank: {
    current: { id: 0, title: 'Zen Novice', image: '' },
    next: null,
    progress: 0
  },
  achievements: [],
  logs: [],
  stats: {
    totalTracks: 0,
    eventsAttended: 0,
    streak: 0,
    streakFire: false,
  },
  lastUpdate: '',
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
    // Legacy mapping
    mainPoints: resolved.points.points?.amount ?? 0,
    currentRank: resolved.rank.current.title,
  };
};
