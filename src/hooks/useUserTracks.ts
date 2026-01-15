// src/hooks/useUserTracks.ts
// v5.0 - Headless Facade Aligned (No Nonce / No Credentials)

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * TYPES
 * ========================= */

export interface Track {
  id: number;
  title: string;
  image?: string;
  date?: string;
}

interface TracksResponse {
  success?: boolean;
  tracks?: Track[];
  total?: number;
}

interface UseUserTracksResponse {
  data: { total: number; tracks: Track[] };
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useUserTracks = (): UseUserTracksResponse => {
  const { user } = useUser();

  const [data, setData] = useState<{ total: number; tracks: Track[] }>({
    total: 0,
    tracks: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';

      const endpoint = `${wpRestUrl}/djzeneyer/v1/tracks/${user.id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: TracksResponse = await response.json();

      // Compatível com múltiplos formatos (antigo e novo)
      const tracks = Array.isArray(result.tracks) ? result.tracks : [];
      const total =
        Number(result.total) ||
        (Array.isArray(result.tracks) ? result.tracks.length : 0);

      setData({ total, tracks });

    } catch (err) {
      console.error('[useUserTracks]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData({ total: 0, tracks: [] });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Polling padrão do dashboard
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchTracks, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchTracks]);

  return { data, loading, error, refresh: fetchTracks };
};
