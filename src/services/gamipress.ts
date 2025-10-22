// src/services/gamipress.ts
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://djzeneyer.com';
const REST_BASE = `${WORDPRESS_URL}/wp-json`;

interface GamiPressPoints {
  [pointType: string]: number;
}

interface GamiPressAchievement {
  id: number;
  title: string;
  description: string;
  image: string;
  earned: boolean;
  earnedDate?: string;
  points: number;
}

interface UserEarning {
  id: number;
  user_id: number;
  post_id: number;
  post_type: string;
  title: string;
  points: number;
  date: string;
  date_earned?: string;
}

interface GamiPressRank {
  id: number;
  title: string;
  slug: string;
  image: string;
}

interface GamiPressUserData {
  points: GamiPressPoints;
  achievements: GamiPressAchievement[];
  ranks: GamiPressRank[];
  total_achievements: number;
  total_points: number;
  level: number;
  currentRank: string;
  streakDays: number;
  totalTracks: number;
  eventsAttended: number;
  tribeFriends: number;
  userEarnings: UserEarning[];
}

export class GamiPressService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.token || localStorage.getItem('jwt_token') || localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${REST_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`❌ GamiPress API Error [${response.status}]:`, await response.text());
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ GamiPress Request Failed:', error);
      throw error;
    }
  }

  async getUserData(userId: number): Promise<GamiPressUserData> {
    try {
      console.log('🎮 Fetching GamiPress data for user:', userId);

      const userData = await this.request<any>(`/wp/v2/users/${userId}?context=edit`);
      console.log('✅ User data fetched:', userData);

      let userEarnings: UserEarning[] = [];
      try {
        userEarnings = await this.request<any[]>(
          `/wp/v2/gamipress-user-earnings?user=${userId}&per_page=100`
        );
        console.log('✅ User earnings fetched:', userEarnings.length);
      } catch (error) {
        console.warn('⚠️ Could not fetch user earnings:', error);
      }

      const points: GamiPressPoints = {};
      let totalPoints = 0;

      Object.keys(userData.meta || {}).forEach(key => {
        if (key.includes('_gamipress_') && key.includes('_points')) {
          const pointType = key.replace('_gamipress_', '').replace('_points', '');
          const value = parseInt(userData.meta[key]) || 0;
          points[pointType] = value;
          totalPoints += value;
        }
      });

      console.log('💰 Total points:', totalPoints, points);

      const level = Math.floor(totalPoints / 100) + 1;

      let currentRank = 'Newbie';
      let ranks: GamiPressRank[] = [];
      
      try {
        const rankId = userData.meta._gamipress_rank_rank || userData.meta._gamipress_ranks_rank;
        
        if (rankId) {
          const rankData = await this.request<any>(`/wp/v2/rank/${rankId}`);
          currentRank = rankData.title.rendered;
          ranks.push({
            id: rankData.id,
            title: rankData.title.rendered,
            slug: rankData.slug,
            image: rankData.featured_media || '',
          });
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch rank data:', error);
      }

      let achievements: GamiPressAchievement[] = [];
      
      try {
        const achievementTypes = ['badges', 'achievements', 'achievement'];
        
        for (const type of achievementTypes) {
          try {
            const items = await this.request<any[]>(`/wp/v2/${type}?per_page=100`);
            
            if (items && items.length > 0) {
              console.log(`✅ Found ${items.length} ${type}`);
              
              const earnedIds = userEarnings
                .filter(e => e.post_type === type || e.post_type.includes('achievement'))
                .map(e => e.post_id);

              achievements = items.map((item: any) => {
                const earned = earnedIds.includes(item.id);
                const earning = userEarnings.find(e => e.post_id === item.id);
                
                return {
                  id: item.id,
                  title: item.title?.rendered || item.post_title || 'Achievement',
                  description: item.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 
                               item.content?.rendered?.replace(/<[^>]*>/g, '').substring(0, 100) || '',
                  image: item.featured_media || '',
                  earned,
                  earnedDate: earning?.date || earning?.date_earned,
                  points: parseInt(item.meta?._gamipress_points) || 0,
                };
              });
              
              break;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch achievements:', error);
      }

      const streakDays = parseInt(userData.meta._gamipress_daily_login_streak) || 
                         parseInt(userData.meta._gamipress_streak) || 0;

      const totalTracks = userEarnings.filter(e => 
        e.title?.toLowerCase().includes('download') || 
        e.title?.toLowerCase().includes('track') ||
        e.post_type.includes('download')
      ).length;

      const eventsAttended = userEarnings.filter(e => 
        e.title?.toLowerCase().includes('event') || 
        e.title?.toLowerCase().includes('rsvp') ||
        e.post_type.includes('event')
      ).length;

      const tribeFriends = parseInt(userData.meta._gamipress_tribe_friends) || 
                           parseInt(userData.meta._gamipress_friends) || 0;

      const result: GamiPressUserData = {
        points,
        achievements,
        ranks,
        total_achievements: achievements.length,
        total_points: totalPoints,
        level,
        currentRank,
        streakDays,
        totalTracks,
        eventsAttended,
        tribeFriends,
        userEarnings,
      };

      console.log('🎉 GamiPress data compiled:', result);
      return result;

    } catch (error) {
      console.error('❌ Error fetching GamiPress user data:', error);
      return this.getEmptyUserData();
    }
  }

  async getUserPoints(userId: number): Promise<GamiPressPoints> {
    try {
      const userData = await this.getUserData(userId);
      return userData.points;
    } catch (error) {
      console.error('❌ Error fetching points:', error);
      return {};
    }
  }

  async getUserAchievements(userId: number): Promise<GamiPressAchievement[]> {
    try {
      const userData = await this.getUserData(userId);
      return userData.achievements;
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      return [];
    }
  }

  async getUserRanks(userId: number): Promise<GamiPressRank[]> {
    try {
      const userData = await this.getUserData(userId);
      return userData.ranks;
    } catch (error) {
      console.error('❌ Error fetching ranks:', error);
      return [];
    }
  }

  async awardPoints(userId: number, points: number, pointType: string = 'points'): Promise<void> {
    console.warn('⚠️ awardPoints requires admin permissions or custom endpoint');
  }

  async checkAchievementProgress(userId: number, achievementId: number): Promise<number> {
    console.warn('⚠️ checkAchievementProgress requires REST API Extended add-on');
    return 0;
  }

  private getEmptyUserData(): GamiPressUserData {
    return {
      points: {},
      achievements: [],
      ranks: [],
      total_achievements: 0,
      total_points: 0,
      level: 1,
      currentRank: 'Newbie',
      streakDays: 0,
      totalTracks: 0,
      eventsAttended: 0,
      tribeFriends: 0,
      userEarnings: [],
    };
  }
}

export const gamipress = new GamiPressService();
