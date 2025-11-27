// src/hooks/useGamiPress.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

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

interface GamiPressData {
  // Basic info
  points: number;
  level: number;
  rank: string;
  rankId: number;
  
  // Detailed data
  pointsBreakdown: PointsBreakdown[];
  earnedAchievements: Achievement[];
  allRanks: Rank[];
  allAchievements: Achievement[];
  stats: GamiPressStats;
  
  // Loading states
  loading: boolean;
  error: string | null;
  success: boolean;
}

/* =========================
 * DEFAULT STATE
 * ========================= */

const defaultState: GamiPressData = {
  points: 0,
  level: 1,
  rank: 'Novice',
  rankId: 0,
  pointsBreakdown: [],
  earnedAchievements: [],
  allRanks: [],
  allAchievements: [],
  stats: {
    totalAchievements: 0,
    earnedAchievements: 0,
    totalRanks: 0,
    currentRankIndex: 0,
  },
  loading: false,
  error: null,
  success: false,
};

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressData => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<GamiPressData>({
    ...defaultState,
    loading: true,
  });

  useEffect(() => {
    // Reset se não estiver autenticado
    if (!isAuthenticated || !user?.id) {
      console.log('[useGamiPress] ⚠️ Usuário não autenticado');
      setData({
        ...defaultState,
        loading: false,
        error: 'Usuário não autenticado',
      });
      return;
    }

    const fetchGamiPressData = async () => {
      try {
        console.log('[useGamiPress] 🎮 Buscando dados para user_id:', user.id);
        
        const endpoint = `/wp-json/djzeneyer/v1/gamipress/${user.id}`;
        console.log('[useGamiPress] 📡 Endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
          },
        });

        console.log('[useGamiPress] 📊 Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[useGamiPress] ❌ Erro na resposta:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('[useGamiPress] ✅ Dados recebidos:', result);

        if (!result.success) {
          console.warn('[useGamiPress] ⚠️ GamiPress não está ativo:', result.message);
        }

        // Extrair dados da resposta
        const gamificationData = result.data || {};

        setData({
          points: gamificationData.points || 0,
          level: gamificationData.level || 1,
          rank: gamificationData.rank || 'Novice',
          rankId: gamificationData.rankId || 0,
          pointsBreakdown: gamificationData.pointsBreakdown || [],
          earnedAchievements: gamificationData.earnedAchievements || [],
          allRanks: gamificationData.allRanks || [],
          allAchievements: gamificationData.allAchievements || [],
          stats: gamificationData.stats || defaultState.stats,
          loading: false,
          error: null,
          success: result.success || false,
        });

      } catch (error) {
        console.error('[useGamiPress] ❌ Erro ao buscar dados:', error);
        
        setData({
          ...defaultState,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    // Buscar dados imediatamente
    fetchGamiPressData();

    // Opcional: Atualizar a cada 30 segundos
    // const interval = setInterval(fetchGamiPressData, 30000);
    // return () => clearInterval(interval);

  }, [user?.id, user?.token, isAuthenticated]);

  return data;
};

/* =========================
 * HELPER FUNCTIONS
 * ========================= */

// Calcular progresso até próximo rank
const getNextRankProgress = (data: GamiPressData): {
  current: Rank | null;
  next: Rank | null;
  progress: number;
} => {
  const currentIndex = data.stats.currentRankIndex;
  const current = data.allRanks[currentIndex] || null;
  const next = data.allRanks[currentIndex + 1] || null;
  
  if (!next) {
    return { current, next: null, progress: 100 };
  }
  
  // Calcular progresso baseado em requisitos
  // Isso pode ser customizado baseado nos seus requisitos
  const progress = Math.min(100, (data.points / 1000) * 100);
  
  return { current, next, progress };
};

// Filtrar achievements por tipo
const filterAchievementsByType = (
  achievements: Achievement[],
  type: string
): Achievement[] => {
  return achievements.filter(ach => ach.type === type);
};

// Pegar achievements pendentes
const getPendingAchievements = (data: GamiPressData): Achievement[] => {
  return data.allAchievements.filter(ach => !ach.earned);
};

// Calcular completion percentage
const getCompletionPercentage = (data: GamiPressData): number => {
  if (data.stats.totalAchievements === 0) return 0;
  return Math.round(
    (data.stats.earnedAchievements / data.stats.totalAchievements) * 100
  );
};
