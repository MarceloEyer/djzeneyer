// src/hooks/useGamiPress.ts
// v4.2 - FIX: Added X-WP-Nonce & Credentials to prevent 401 Unauthorized

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

export interface RankData {
  current: string;
  icon: string;
  next_milestone: number;
  progress_percent: number;
}

export interface PlayerStats {
  xp: number;
  level: number;
  rank: RankData;
}

export interface GamiPressData {
  stats: PlayerStats;
  points?: number; 
  level?: number;
}

interface GamiPressHookResponse {
  data: GamiPressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();
  
  const [data, setData] = useState<GamiPressData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGamiPressData = useCallback(async () => {
    // 1. Validação de Segurança
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 2. URL e Auth
      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json';
      const nonce = wpData.nonce || ''; // <--- Pega o Nonce
      
      const endpoint = `${wpRestUrl}/zen-ra/v1/gamipress/${user.id}`;
      
      // Corrigindo URL duplicada se houver (ex: wp-json//zen-ra)
      const cleanEndpoint = endpoint.replace('wp-json//', 'wp-json/');

      const response = await fetch(cleanEndpoint, {
        credentials: 'include', // Necessário para cookies de sessão
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce // <--- AQUI ESTÁ A CORREÇÃO DO 401
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        // Se a API retornar sucesso false mas HTTP 200 (comum em WP)
        console.warn('[Zen-RA] API retornou false:', result);
      }

      // 3. Normalização dos Dados
      const rawStats = result.stats || {};
      
      const safeData: GamiPressData = {
        stats: {
          xp: Number(rawStats.xp) || 0,
          level: Number(rawStats.level) || 1,
          rank: {
            current: rawStats.rank?.current || 'Novice',
            icon: rawStats.rank?.icon || '',
            next_milestone: Number(rawStats.rank?.next_milestone) || 100,
            progress_percent: Number(rawStats.rank?.progress_percent) || 0,
          }
        },
        points: Number(rawStats.xp) || 0,
        level: Number(rawStats.level) || 1,
      };

      setData(safeData);
    } catch (err) {
      console.error('[useGamiPress] Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Carrega ao montar
  useEffect(() => {
    fetchGamiPressData();
  }, [fetchGamiPressData]);

  // Polling: Atualiza a cada 60s
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchGamiPressData, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchGamiPressData]);

  return { data, loading, error, refresh: fetchGamiPressData };
};