// src/hooks/useRecentActivity.ts

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  points: number;
  date: string;
  icon: string;
}

export interface RecentActivityData {
  total: number;
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const useRecentActivity = (): RecentActivityData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<RecentActivityData>({
    total: 0,
    activities: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log('[useRecentActivity] Usuário não autenticado');
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    const fetchActivity = async () => {
      try {
        console.log('[useRecentActivity] 📊 Buscando activity para user_id:', user.id);
        
        const endpoint = `/wp-json/djzeneyer/v1/activity/${user.id}`;
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
        console.log('[useRecentActivity] ✅ Dados recebidos:', result);

        setData({
          total: result.total || 0,
          activities: result.activities || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('[useRecentActivity] ❌ Erro:', error);
        setData({
          total: 0,
          activities: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    fetchActivity();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchActivity, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  return data;
};
