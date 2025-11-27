// src/hooks/useUserStreak.ts

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

interface UserStreakData {
  streak: number;
  lastLogin: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserStreak = (): UserStreakData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<UserStreakData>({
    streak: 0,
    lastLogin: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log('[useUserStreak] Usuário não autenticado');
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    const fetchStreak = async () => {
      try {
        console.log('[useUserStreak] 🔥 Buscando streak para user_id:', user.id);
        
        const endpoint = `/wp-json/djzeneyer/v1/streak/${user.id}`;
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
        console.log('[useUserStreak] ✅ Dados recebidos:', result);

        setData({
          streak: result.streak || 0,
          lastLogin: result.last_login || null,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('[useUserStreak] ❌ Erro:', error);
        setData({
          streak: 0,
          lastLogin: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    fetchStreak();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchStreak, 300000);

    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  return data;
};
