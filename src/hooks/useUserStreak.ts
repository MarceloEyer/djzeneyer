// src/hooks/useUserStreak.ts
// v5.1 - Dashboard Compatible (No Nonce / No Credentials)

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

interface StreakPayload {
  streak: number;
  fire: boolean;
}

interface StreakResponse {
  success?: boolean;
  streak?: number;
}

export const useUserStreak = () => {
  const { user } = useUser();

  const [data, setData] = useState<StreakPayload>({ streak: 0, fire: false });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setData({ streak: 0, fire: false });
      return;
    }

    const fetchStreak = async () => {
      try {
        setLoading(true);

        const wpData = (window as any).wpData || {};
        const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';
        const endpoint = `${wpRestUrl}/djzeneyer/v1/streak/${user.id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: StreakResponse = await res.json();
        const streakValue = Number(json.streak) || 0;

        setData({ streak: streakValue, fire: streakValue >= 3 });
      } catch (err) {
        console.error('[useUserStreak]', err);
        setData({ streak: 0, fire: false });
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();

    const interval = setInterval(fetchStreak, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return { data, loading };
};
