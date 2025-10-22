// src/hooks/useUserEvents.ts

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  url: string;
}

export interface UserEventsData {
  total: number;
  events: Event[];
  loading: boolean;
  error: string | null;
}

export const useUserEvents = (): UserEventsData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<UserEventsData>({
    total: 0,
    events: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log('[useUserEvents] Usuário não autenticado');
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log('[useUserEvents] 📅 Buscando events para user_id:', user.id);
        
        const endpoint = `/wp-json/djzeneyer/v1/events/${user.id}`;
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('[useUserEvents] ✅ Dados recebidos:', result);

        setData({
          total: result.total || 0,
          events: result.events || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('[useUserEvents] ❌ Erro:', error);
        setData({
          total: 0,
          events: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  return data;
};
