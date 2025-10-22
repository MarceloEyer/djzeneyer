// src/hooks/useGamiPress.ts
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { gamipress } from '../services/GamiPress';

export interface GamiPressData {
  points: number;
  rank: string;
  rankId: number;
  achievements: Achievement[];
  level: number;
  streakDays: number;
  totalTracks: number;
  eventsAttended: number;
  tribeFriends: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  earnedDate?: string;
  points: number;
}

export const useGamiPress = (): GamiPressData => {
  const { user } = useUser();
  const [data, setData] = useState<GamiPressData>({
    points: 0,
    rank: 'Newbie',
    rankId: 0,
    achievements: [],
    level: 1,
    streakDays: 0,
    totalTracks: 0,
    eventsAttended: 0,
    tribeFriends: 0,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchGamiPressData = async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID, skipping GamiPress fetch');
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('🎮 useGamiPress: Fetching data for user', user.id);
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Buscar todos os dados do GamiPress
      const userData = await gamipress.getUserData(user.id);

      console.log('✅ useGamiPress: Data received', userData);

      setData({
        points: userData.total_points,
        rank: userData.currentRank,
        rankId: userData.ranks[0]?.id || 0,
        achievements: userData.achievements.map(ach => ({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          image: ach.image,
          earned: ach.earned,
          earnedDate: ach.earnedDate,
          points: ach.points,
        })),
        level: userData.level,
        streakDays: userData.streakDays,
        totalTracks: userData.totalTracks,
        eventsAttended: userData.eventsAttended,
        tribeFriends: userData.tribeFriends,
        loading: false,
        error: null,
        refetch: fetchGamiPressData,
      });

      console.log('🎉 useGamiPress: State updated successfully');

    } catch (error) {
      console.error('❌ useGamiPress: Error loading data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load gamification data',
      }));
    }
  };

  useEffect(() => {
    fetchGamiPressData();
  }, [user?.id]);

  return data;
};
