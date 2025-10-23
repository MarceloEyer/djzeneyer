// src/hooks/useGamiPress.ts
import { useState, useEffect } from 'react';
import { gamipress } from '../services/gamipress';
import { useAuth } from '../contexts/UserContext';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  earnedDate?: string;
  points: number;
}

export interface GamiPressData {
  points: number;
  rank: string;
  level: number;
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
}

const defaultState: GamiPressData = {
  points: 0,
  rank: 'Zen Novice',
  level: 1,
  achievements: [],
  loading: false,
  error: null,
};

export const useGamiPress = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<GamiPressData>(defaultState);

  useEffect(() => {
    const fetchGamiPressData = async () => {
      if (!isAuthenticated || !user?.id) {
        console.log('[useGamiPress] User not authenticated');
        setData(defaultState);
        return;
      }

      console.log('[useGamiPress] 🎮 Fetching data for user:', user.id);
      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Set token no service
        if (user.token) {
          gamipress.setToken(user.token);
        }

        // Buscar dados do GamiPress
        const gamipressData = await gamipress.getUserData(user.id);

        // Extrair total de pontos
        const totalPoints = gamipressData.total_points || 0;

        // Calcular level (cada 100 pontos = 1 level)
        const level = Math.floor(totalPoints / 100) + 1;

        // Extrair rank atual
        const rank = gamipressData.currentRank || 'Zen Novice';

        // Mapear achievements
        const achievements: Achievement[] = gamipressData.achievements.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          image: a.image,
          earned: a.earned,
          earnedDate: a.earnedDate,
          points: a.points,
        }));

        console.log('[useGamiPress] ✅ Data loaded:', {
          points: totalPoints,
          level,
          rank,
          achievements: achievements.length,
        });

        setData({
          points: totalPoints,
          rank,
          level,
          achievements,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('[useGamiPress] ❌ Error:', error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error?.message || 'Failed to load GamiPress data',
        }));
      }
    };

    fetchGamiPressData();
  }, [user?.id, user?.token, isAuthenticated]);

  return data;
};
