// src/hooks/useUserEvents.ts
// v5.0 - Headless Facade Aligned (No Nonce / No Credentials)

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * TYPES
 * ========================= */

export interface Event {
  id: number;
  title: string;
  image?: string;
  date?: string;
  location?: string;
  url?: string;
}

interface EventsResponse {
  success?: boolean;
  events?: Event[];
  total?: number;
}

interface UseUserEventsResponse {
  data: { total: number; events: Event[] };
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useUserEvents = (): UseUserEventsResponse => {
  const { user } = useUser();

  const [data, setData] = useState<{ total: number; events: Event[] }>({
    total: 0,
    events: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';

      const endpoint = `${wpRestUrl}/djzeneyer/v1/events/${user.id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: EventsResponse = await response.json();

      // Compatível com múltiplos formatos (antigo e novo)
      const events = Array.isArray(result.events) ? result.events : [];
      const total =
        Number(result.total) ||
        (Array.isArray(result.events) ? result.events.length : 0);

      setData({ total, events });

    } catch (err) {
      console.error('[useUserEvents]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData({ total: 0, events: [] });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling padrão do dashboard
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchEvents]);

  return { data, loading, error, refresh: fetchEvents };
};
