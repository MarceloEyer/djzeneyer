// src/hooks/useRecentActivity.ts
// v4.0 - FIX: Added X-WP-Nonce for Dashboard Auth

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
    if (!user?.id) {
        setLoading(false);
        return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        
        // 1. Pega o Nonce e URL base do ambiente
        const wpData = (window as any).wpData || {};
        const restUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json/';
        const nonce = wpData.nonce || '';

        // Limpa URL duplicada se houver
        const baseUrl = restUrl.replace(/\/$/, '');
        const endpoint = `${baseUrl}/zen-ra/v1/activity/${user.id}`;

        const response = await fetch(endpoint, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce // <--- A CORREÇÃO CRÍTICA DO 401
            }
        });
        
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