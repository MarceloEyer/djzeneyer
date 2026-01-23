// src/hooks/useGamiPress.ts
// v7.1 - NATIVE GAMIPRESS REST API + JWT AUTH

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

// Slugs padrão do GamiPress (ajustar depois de verificar no WP-CLI)
const POINTS_TYPE_SLUG = 'points'; // Padrão: 'points'
const RANK_TYPE_SLUG = 'rank'; // Padrão: 'rank'
const ACHIEVEMENT_TYPE_SLUG = 'achievement'; // Padrão: 'achievement'

/* =========================
 * HOOK
 * ========================= */

export const useGamiPress = (): GamiPressHookResponse => {
  const { user } = useUser();

  const [data, setData] = useState<GamiPressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamiPressData = useCallback(async () => {
    if (!user?.id || !user?.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wpData = (window as any).wpData || {};
      const wpRestUrl = wpData.restUrl || 'https://djzeneyer.com/wp-json/';

      // ✅ HEADERS COM AUTENTICAÇÃO JWT
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`, // 🔑 JWT Token do ZenEyer Auth
      };

      // Se tiver nonce do WordPress, adicionar também (fallback)
      if (wpData.nonce) {
        headers['X-WP-Nonce'] = wpData.nonce;
      }

      // ✅ BUSCAR DADOS DO USUÁRIO (com autenticação)
      const userEndpoint = `${wpRestUrl}wp/v2/users/me`;

      const response = await fetch(userEndpoint, {
        headers,
        credentials: 'include', // Incluir cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
          const rankResponse = await fetch(
            `${wpRestUrl}wp/v2/${RANK_TYPE_SLUG}/${rankId}`,
            { headers, credentials: 'include' }
          );
          
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
        // Buscar user earnings (conquistas desbloqueadas)
        const earningsResponse = await fetch(
          `${wpRestUrl}wp/v2/gamipress-user-earnings?user_id=${user.id}&post_type=${ACHIEVEMENT_TYPE_SLUG}&per_page=100`,
          { headers, credentials: 'include' }
        );

        if (earningsResponse.ok) {
          const earnings = await earningsResponse.json();
          
          // Buscar detalhes de cada achievement
          const achievementIds = earnings.map((e: any) => e.post_id).filter(Boolean);
          
          if (achievementIds.length > 0) {
            const achievementsResponse = await fetch(
              `${wpRestUrl}wp/v2/${ACHIEVEMENT_TYPE_SLUG}?include=${achievementIds.join(',')}&per_page=100`,
              { headers, credentials: 'include' }
            );
            
            if (achievementsResponse.ok) {
              const achievementsData = await achievementsResponse.json();
              
              achievements = achievementsData.map((ach: any) => ({
                id: ach.id,
                title: ach.title?.rendered || 'Achievement',
                description: ach.content?.rendered?.replace(/<[^>]*>/g, '') || '',
                image: ach.featured_media 
                  ? `${wpRestUrl}wp/v2/media/${ach.featured_media}` 
                  : '',
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
  }, [user?.id, user?.token]);

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