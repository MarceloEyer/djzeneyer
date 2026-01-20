// src/hooks/useRecentActivity.ts
// v5.1 - Dashboard Compatible (No Nonce / No Credentials)

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export interface ZenActivity {
  id: string;
  type: 'loot' | 'achievement';
  description: string;
  xp: number;
  timestamp: number;
}

interface ActivityResponse {
  success?: boolean;
  activities?: ZenActivity[];
}

export const useRecentActivity = () => {
  const { user } = useUser();

  const [data, setData] = useState<ZenActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setData([]);
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);

        const wpData = (window as any).wpData || {};
        const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';
        const endpoint = `${wpRestUrl}/zen-ra/v1/activity/${user.id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: ActivityResponse = await res.json();
        const activities = Array.isArray(json.activities) ? json.activities : [];

        setData(activities);
      } catch (err) {
        console.error('[useRecentActivity]', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();

    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return { data, loading };
};
