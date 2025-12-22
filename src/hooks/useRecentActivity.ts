// src/hooks/useRecentActivity.ts
// Hook para conectar com o plugin Zen-RA (WordPress)

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

// Interface baseada na documentação do seu plugin Zen-RA
export interface ZenActivity {
  id: string;
  type: 'loot' | 'achievement';
  title: string;
  description: string;
  xp: number;
  date: string;
  timestamp: number;
  meta: any;
}

interface ActivityResponse {
  success: boolean;
  activities: ZenActivity[];
}

export const useRecentActivity = () => {
  const { user } = useUser();
  const [data, setData] = useState<ZenActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Só busca se tiver usuário logado e ID válido
    if (!user?.id) return;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        // Usa o endpoint REST API do seu plugin
        const response = await fetch(`https://djzeneyer.com/wp-json/zen-ra/v1/activity/${user.id}`);
        
        if (!response.ok) throw new Error('Falha ao buscar atividades');
        
        const json: ActivityResponse = await response.json();
        
        if (json.success && Array.isArray(json.activities)) {
          setData(json.activities);
        }
      } catch (error) {
        console.error('Erro ao carregar atividades Zen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [user?.id]);

  return { data, loading };
};