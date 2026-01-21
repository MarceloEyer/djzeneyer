// src/hooks/useGamiPress.ts
// v7.0 - NATIVE GAMIPRESS REST API

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';

/* =========================
 * INTERFACES
 * ========================= */

export interface Achievement {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  earned: boolean;
  date_earned?: string;
}

export interface GamiPressData {
  points: number;
  level: number;
  rank: string;
  rankId: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  achievements: Achievement[];
}

interface GamiPressHookResponse extends GamiPressData {
  data: GamiPressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/* =========================
 * CONFIGURAÇÃO
 * ========================= */

// TODO: Descobrir o slug real do seu points type
const POINTS_TYPE_SLUG = 'zen-points'; // Verificar no admin: GamiPress > Points Types

// TODO: Descobrir o slug real do seu rank type
const RANK_TYPE_SLUG = 'zen-rank'; // Verificar no admin: GamiPress > Rank Types

// TODO: Descobrir o slug real do seu achievement type
const ACHIEVEMENT_TYPE_SLUG = 'badges'; // Verificar no admin: GamiPress > Achievement Types

/* =========================
 * HELPER: Buscar Achievement Type Real
 * ========================= */

async function discoverAchievementType(restUrl: string): Promise<string> {
  try {
    const response = await fetch(`${restUrl}wp/v2/achievement-type`);
    if (!response.ok) return ACHIEVEMENT_TYPE_SLUG;
    
    const types = await response.json();
    // Retorna o primeiro achievement type encontrado
    return types[0]?.slug || ACHIEVEMENT_TYPE_SLUG;
  } catch {
    return ACHIEVEMENT_TYPE_SLUG;
  }
}

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();

  const [data, setData] = useState<GamiPressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamiPressData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json/';

      // ✅ USAR API NATIVA DO WORDPRESS
      const userEndpoint = `${wpRestUrl}wp/v2/users/${user.id}`;

      const response = await fetch(userEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const userData = await response.json();

      // ✅ EXTRAIR DADOS DO GAMIPRESS QUE JÁ ESTÃO NO USER.META
      const meta = userData.meta || {};

      // Points
      const pointsKey = `_gamipress_${POINTS_TYPE_SLUG}_points`;
      const points = Number(meta[pointsKey]) || 0;

      // Rank
      const rankKey = `_gamipress_${RANK_TYPE_SLUG}_rank`;
      const rankId = Number(meta[rankKey]) || 0;

      // Buscar informações do rank
      let rankName = 'Zen Novice';
      if (rankId > 0) {
        try {
          const rankResponse = await fetch(`${wpRestUrl}wp/v2/${RANK_TYPE_SLUG}/${rankId}`);
          if (rankResponse.ok) {
            const rankData = await rankResponse.json();
            rankName = rankData.title?.rendered || rankName;
          }
        } catch (err) {
          console.warn('[useGamiPress] Failed to fetch rank details:', err);
        }
      }

      // Calcular level (100 points = 1 level)
      const level = Math.floor(points / 100) + 1;
      const nextLevelPoints = level * 100;
      const progressToNextLevel = Math.min(100, ((points % 100) / 100) * 100);

      // ✅ BUSCAR ACHIEVEMENTS DO ENDPOINT NATIVO
      let achievements: Achievement[] = [];
      
      try {
        // Descobrir o achievement type real
        const achievementType = await discoverAchievementType(wpRestUrl);
        
        // Buscar user earnings (conquistas desbloqueadas)
        const earningsResponse = await fetch(
          `${wpRestUrl}wp/v2/gamipress-user-earnings?user_id=${user.id}&post_type=${achievementType}&per_page=100`
        );

        if (earningsResponse.ok) {
          const earnings = await earningsResponse.json();
          
          // Buscar detalhes de cada achievement
          const achievementIds = earnings.map((e: any) => e.post_id);
          
          if (achievementIds.length > 0) {
            const achievementsResponse = await fetch(
              `${wpRestUrl}wp/v2/${achievementType}?include=${achievementIds.join(',')}&per_page=100`
            );
            
            if (achievementsResponse.ok) {
              const achievementsData = await achievementsResponse.json();
              
              achievements = achievementsData.map((ach: any) => ({
                id: ach.id,
                title: ach.title?.rendered || 'Achievement',
                description: ach.content?.rendered || '',
                image: ach.featured_media ? `${wpRestUrl}wp/v2/media/${ach.featured_media}` : '',
                earned: true,
                date_earned: earnings.find((e: any) => e.post_id === ach.id)?.date || ''
              }));
            }
          }
        }
      } catch (err) {
        console.warn('[useGamiPress] Failed to fetch achievements:', err);
      }

      const parsedData: GamiPressData = {
        points,
        level,
        rank: rankName,
        rankId,
        nextLevelPoints,
        progressToNextLevel,
        achievements,
      };

      setData(parsedData);

    } catch (err) {
      console.error('[useGamiPress]', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Set fallback data on error
      setData({
        points: 0,
        level: 1,
        rank: 'Zen Novice',
        rankId: 0,
        nextLevelPoints: 100,
        progressToNextLevel: 0,
        achievements: [],
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGamiPressData();
  }, [fetchGamiPressData]);

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(fetchGamiPressData, 60000);
    return () => clearInterval(interval);
  }, [user?.id, fetchGamiPressData]);

  const fallback: GamiPressData = {
    points: 0,
    level: 1,
    rank: 'Zen Novice',
    rankId: 0,
    nextLevelPoints: 100,
    progressToNextLevel: 0,
    achievements: [],
  };

  return {
    points: data?.points ?? fallback.points,
    level: data?.level ?? fallback.level,
    rank: data?.rank ?? fallback.rank,
    rankId: data?.rankId ?? fallback.rankId,
    nextLevelPoints: data?.nextLevelPoints ?? fallback.nextLevelPoints,
    progressToNextLevel: data?.progressToNextLevel ?? fallback.progressToNextLevel,
    achievements: data?.achievements ?? fallback.achievements,
    data,
    loading,
    error,
    refresh: fetchGamiPressData,
  };
};