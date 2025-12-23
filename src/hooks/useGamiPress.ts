// src/hooks/useGamiPress.ts
// v4.0 - PLATINUM MASTER: Integrated with Zen-RA v2.0 Unified API

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth'; // Ajuste o import conforme seu projeto (useAuth ou useUser)

/* =========================
 * INTERFACES (Alinhadas com o Dashboard)
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
  // Campos de compatibilidade para não quebrar componentes antigos, se houver
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
  const { user } = useAuth(); // Ou useUser() dependendo do seu contexto
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

      // 2. URL da API Unificada (Zen-RA)
      // Tenta pegar do ambiente ou usa fallback seguro
      const wpRestUrl = (window as any).wpData?.restUrl || 'https://djzeneyer.com/wp-json';
      const endpoint = `${wpRestUrl}/zen-ra/v1/gamipress/${user.id}`;
      
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        console.warn('[Zen-RA] API retornou false:', result);
      }

      // 3. Normalização dos Dados
      // A API retorna { stats: { xp, level, rank: {...} } }
      // Mapeamos direto para o formato esperado pelo Dashboard
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
        // Compatibilidade retroativa (atalhos)
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

  // Polling: Atualiza a cada 60s para manter o XP vivo
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchGamiPressData, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchGamiPressData]);

  return { data, loading, error, refresh: fetchGamiPressData };
};