// src/hooks/useGamiPress.ts
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export interface GamiPressData {
  points: number;
  rank: string;
  rankId: number;
  achievements: Achievement[];
  level: number;
  loading: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  earnedDate?: string;
}

export const useGamiPress = () => {
  const { user } = useUser();
  const [data, setData] = useState<GamiPressData>({
    points: 0,
    rank: 'Newbie',
    rankId: 0,
    achievements: [],
    level: 1,
    loading: true
  });

  useEffect(() => {
    if (!user?.id) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchGamiPressData = async () => {
      try {
        const baseUrl = `${window.location.origin}/wp-json/gamipress/v1`;
        
        // Buscar pontos
        const pointsRes = await fetch(`${baseUrl}/users/${user.id}/points`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const pointsData = await pointsRes.json();
        
        // Buscar achievements
        const achievementsRes = await fetch(`${baseUrl}/users/${user.id}/achievements`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const achievementsData = await achievementsRes.json();
        
        // Buscar rank
        const rankRes = await fetch(`${baseUrl}/users/${user.id}/ranks`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const rankData = await rankRes.json();
        
        const totalPoints = pointsData[0]?.points || 0;
        const currentRank = rankData[0] || { title: 'Member', id: 0 };
        
        setData({
          points: totalPoints,
          rank: currentRank.title,
          rankId: currentRank.id,
          achievements: achievementsData.map((a: any) => ({
            id: a.ID,
            title: a.post_title,
            description: a.post_content,
            image: a.thumbnail || '',
            earned: a.earned || false,
            earnedDate: a.earned_date
          })),
          level: Math.floor(totalPoints / 100) + 1,
          loading: false
        });
        
      } catch (error) {
        console.error('❌ Error loading GamiPress data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchGamiPressData();
  }, [user?.id, user?.token]);

  return data;
};
