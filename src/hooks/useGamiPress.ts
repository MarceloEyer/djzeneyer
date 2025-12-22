// src/hooks/useGamiPress.ts
// v3.0 - GOLD MASTER: Standardized Data Structure for Dashboard Compatibility

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

interface PointsBreakdown {
  slug: string;
  name: string;
  singular: string;
  points: number;
}

interface Requirement {
  id: number;
  title: string;
  type: string;
  count: number;
}

interface Rank {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  image: string;
  current: boolean;
  requirements: Requirement[];
}

interface Achievement {
  id: number;
  type: string;
  typeName?: string;
  title: string;
  description: string;
  excerpt: string;
  image: string;
  earned: boolean;
  earnedDate: string | null;
  points: number;
  requirements: Requirement[];
}

interface GamiPressStats {
  totalAchievements: number;
  earnedAchievements: number;
  totalRanks: number;
  currentRankIndex: number;
}

export interface GamiPressData {
  // Basic info
  points: number;
  level: number;
  rank: string;
  rankId: number;
  
  // Progress info (Adicionado para compatibilidade)
  nextLevelPoints: number;
  progressToNextLevel: number;

  // Detailed data
  pointsBreakdown: PointsBreakdown[];
  earnedAchievements: Achievement[];
  allRanks: Rank[];
  allAchievements: Achievement[]; // Alterado de achievements para allAchievements para clareza
  achievements?: Achievement[]; // Alias para compatibilidade
  stats: GamiPressStats;
}

interface GamiPressHookResponse {
    data: GamiPressData | null;
    loading: boolean;
    error: string | null;
}

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();
  const [data, setData] = useState<GamiPressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Validação de Segurança
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchGamiPressData = async () => {
      try {
        setLoading(true);
        // Endpoint que busca os dados do GamiPress no WordPress
        const endpoint = `https://djzeneyer.com/wp-json/djzeneyer/v1/gamipress/${user.id}`;
        
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            // Se falhar mas não for erro HTTP (ex: usuário não encontrado no gamipress)
            console.warn('[GamiPress] API retornou false:', result);
        }

        const rawData = result.data || {};

        // 2. Normalização dos Dados (Garante que nada quebre o Dashboard)
        const safeData: GamiPressData = {
          points: Number(rawData.points) || 0,
          level: Number(rawData.level) || 1,
          rank: rawData.rank || 'Zen Novice',
          rankId: Number(rawData.rankId) || 0,
          
          // Lógica de Progresso (Se o backend não mandar, calculamos fake ou 0)
          nextLevelPoints: Number(rawData.next_level_points) || 100, 
          progressToNextLevel: Number(rawData.progress) || 0,

          pointsBreakdown: rawData.pointsBreakdown || [],
          earnedAchievements: rawData.earnedAchievements || [],
          allRanks: rawData.allRanks || [],
          allAchievements: rawData.allAchievements || [],
          achievements: rawData.allAchievements || [], // Alias importante
          
          stats: rawData.stats || {
            totalAchievements: 0,
            earnedAchievements: 0,
            totalRanks: 0,
            currentRankIndex: 0,
          },
        };

        setData(safeData);
      } catch (err) {
        console.error('[useGamiPress] Erro:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchGamiPressData();
  }, [user?.id]);

  // Retorna no formato { data, loading, error }
  return { data, loading, error };
};