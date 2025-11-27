// src/hooks/useUserTracks.ts

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

interface Track {
  id: number;
  title: string;
  artist: string;
  image: string;
  date: string;
  order_id: number;
}

interface UserTracksData {
  total: number;
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

export const useUserTracks = (): UserTracksData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<UserTracksData>({
    total: 0,
    tracks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log('[useUserTracks] Usuário não autenticado');
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    const fetchTracks = async () => {
      try {
        console.log('[useUserTracks] 🎵 Buscando tracks para user_id:', user.id);
        
        const endpoint = `/wp-json/djzeneyer/v1/tracks/${user.id}`;
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
        console.log('[useUserTracks] ✅ Dados recebidos:', result);

        setData({
          total: result.total || 0,
          tracks: result.tracks || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('[useUserTracks] ❌ Erro:', error);
        setData({
          total: 0,
          tracks: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    fetchTracks();

    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchTracks, 60000);

    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  return data;
};
