// src/hooks/useGamiPress.ts
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export interface GamiPressUserData {
  points: number;
  rank: string;
  achievements: any[];
  level: number;
}

export const useGamiPress = () => {
  const { user } = useUser();
  const [data, setData] = useState<GamiPressUserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGamiPressData = async () => {
      setLoading(true);
      try {
        // GamiPress tem REST API nativa
        const response = await fetch(
          `${window.location.origin}/wp-json/gamipress/v1/users/${user.id}/points`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        const points = await response.json();
        
        setData({
          points: points.total || 0,
          rank: 'Member', // Buscar do GamiPress
          achievements: [],
          level: Math.floor(points.total / 100) + 1 // Cálculo simples
        });
      } catch (error) {
        console.error('Error loading GamiPress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamiPressData();
  }, [user?.id]);

  return { data, loading };
};
