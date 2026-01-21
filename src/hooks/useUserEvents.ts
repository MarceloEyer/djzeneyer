// src/hooks/useUserEvents.ts
// v5.1 - Dashboard Compatible (No Nonce / No Credentials)

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export interface Event {
  id: number;
  title: string;
  image?: string;
  date?: string;
  location?: string;
  url?: string;
}

interface EventsPayload {
  total: number;
  events: Event[];
}

interface EventsResponse {
  success?: boolean;
  total?: number;
  events?: Event[];
}

export const useUserEvents = () => {
  const { user } = useUser();

  const [data, setData] = useState<EventsPayload>({ total: 0, events: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setData({ total: 0, events: [] });
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);

        const wpData = (window as any).wpData || {};
        const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';
        const endpoint = `${wpRestUrl}/djzeneyer/v1/events/${user.id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: EventsResponse = await res.json();

        const events = Array.isArray(json.events) ? json.events : [];
        const total = Number(json.total) || events.length;

        setData({ total, events });
      } catch (err) {
        console.error('[useUserEvents]', err);
        setData({ total: 0, events: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return { data, loading };
};
