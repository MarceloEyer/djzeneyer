import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  earnedDate: string | null;
}

export interface GamiPressData {
  points: number;
  level: number;
  rank: string;
  rankId: number;
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
}

export const useGamiPress = (): GamiPressData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<GamiPressData>({
    points: 0,
    level: 1,
    rank: 'Newbie',
    rankId: 0,
    achievements: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log('[useGamiPress] Usuário não autenticado');
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    const fetchGamiPressData = async () => {
      try {
        console.log('[useGamiPress] Buscando dados para user_id:', user.id);
        
        // ENDPOINT CORRETO DO PLUGIN
        const endpoint = `/wp-json/djzeneyer/v1/gamipress/${user.id}`;
        console.log('[useGamiPress] Endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('[useGamiPress] Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[useGamiPress] Erro na resposta:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('[useGamiPress] ✅ Dados recebidos:', result);

        // Verificar se é mock
        if (result.mock_data) {
          console.warn('[useGamiPress] ⚠️ GamiPress não está ativo, usando dados mock');
        }

        setData({
          points: result.points || 0,
          level: result.level || 1,
          rank: result.rank || 'Newbie',
          rankId: result.rankId || 0,
          achievements: result.achievements || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('[useGamiPress] ❌ Erro ao buscar dados:', error);
        
        // Fallback para dados mock em caso de erro
        setData({
          points: 0,
          level: 1,
          rank: 'Newbie',
          rankId: 0,
          achievements: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    fetchGamiPressData();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchGamiPressData, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isAuthenticated]);

  return data;
};
