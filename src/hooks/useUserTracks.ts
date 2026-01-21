// src/hooks/useUserTracks.ts
// v5.1 - Dashboard Compatible (No Nonce / No Credentials)

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export interface Track {
  id: number;
  title: string;
  image?: string;
  date?: string;
}

interface TracksPayload {
  total: number;
  tracks: Track[];
}

interface TracksResponse {
  success?: boolean;
  total?: number;
  tracks?: Track[];
}

export const useUserTracks = () => {
  const { user } = useUser();

  const [data, setData] = useState<TracksPayload>({ total: 0, tracks: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setData({ total: 0, tracks: [] });
      return;
    }

    const fetchTracks = async () => {
      try {
        setLoading(true);

        const wpData = (window as any).wpData || {};
        const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';
        const endpoint = `${wpRestUrl}/djzeneyer/v1/tracks/${user.id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: TracksResponse = await res.json();

        const tracks = Array.isArray(json.tracks) ? json.tracks : [];
        const total = Number(json.total) || tracks.length;

        setData({ total, tracks });
      } catch (err) {
        console.error('[useUserTracks]', err);
        setData({ total: 0, tracks: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    const interval = setInterval(fetchTracks, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return { data, loading };
};
