// src/hooks/useUserStreak.ts
// v4.3 - FIX: Added X-WP-Nonce for Authentication

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext'; 

interface StreakData {
  streak: number;
  lastLogin: string | null;
  fire: boolean;
}

export const useUserStreak = () => {
  const { user } = useUser();
  
  const [data, setData] = useState<StreakData>({ 
    streak: 0, 
    lastLogin: null,
    fire: false 
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchStreak = async () => {
      setLoading(true);
      try {
        console.log('[useUserStreak] 🔥 Buscando streak para user_id:', user.id);
        
        // 1. Pega o Nonce
        const nonce = (window as any).wpData?.nonce || '';
        const endpoint = `/wp-json/djzeneyer/v1/streak/${user.id}`;
        
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce // <--- A CORREÇÃO
          },
        });

        if (!response.ok) {
          console.warn(`[useUserStreak] API retornou ${response.status}. Usando fallback.`);
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const streakValue = result.streak || 0;

        setData({
          streak: streakValue,
          lastLogin: result.last_login || null,
          fire: streakValue >= 3 
        });

      } catch (error) {
        console.error('[useUserStreak] Erro (usando dados seguros):', error);
        setData({ streak: 0, lastLogin: null, fire: false });
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();

    const interval = setInterval(fetchStreak, 300000);
    return () => clearInterval(interval);

  }, [user?.id]);

  return { data, loading };
};