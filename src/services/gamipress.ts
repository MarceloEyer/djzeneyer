// src/services/GamiPress.ts
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

    // Usar token do localStorage se disponível
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

      // 1. Buscar dados completos do usuário (com metadata do GamiPress)
      const userData = await this.request<any>(`/wp/v2/users/${userId}?context=edit`);
      console.log('✅ User data fetched:', userData);

      // 2. Buscar histórico de conquistas (user earnings)
      let userEarnings: UserEarning[] = [];
      try {
        userEarnings = await this.request<any[]>(
          `/wp/v2/gamipress-user-earnings?user=${userId}&per_page=100`
        );
        console.log('✅ User earnings fetched:', userEarnings.length);
      } catch (error) {
        console.warn('⚠️ Could not fetch user earnings (may not exist yet):', error);
      }

      // 3. Extrair pontos do meta
      const points: GamiPressPoints = {};
      let totalPoints = 0;

      // Buscar todos os campos meta que começam com _gamipress_ e terminam com _points
      Object.keys(userData.meta || {}).forEach(key => {
        if (key.includes('_gamipress_') && key.includes('_points')) {
          const pointType = key.replace('_gamipress_', '').replace('_points', '');
          const value = parseInt(userData.meta[key]) || 0;
          points[pointType] = value;
          totalPoints += value;
        }
      });

      console.log('💰 Total points:', totalPoints, points);

      // 4. Calcular level baseado nos pontos (ajuste a fórmula conforme sua necessidade)
      const level = Math.floor(totalPoints / 100) + 1;

      // 5. Buscar rank atual
      let currentRank = 'Newbie';
      let ranks: GamiPressRank[] = [];
      
      try {
        // Tentar buscar o rank atual do usuário
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

      // 6. Buscar achievements disponíveis e marcar os ganhos
      let achievements: GamiPressAchievement[] = [];
      
      try {
        // Tentar buscar badges/achievements (ajuste o tipo conforme sua configuração)
        const achievementTypes = ['badges', 'achievements', 'achievement'];
        
        for (const type of achievementTypes) {
          try {
            const items = await this.request<any[]>(`/wp/v2/${type}?per_page=100`);
            
            if (items && items.length > 0) {
              console.log(`✅ Found ${items.length} ${type}`);
              
              // IDs dos achievements ganhos pelo usuário
              const earnedIds = userEarnings
                .filter(e => e.post_type === type || e.post_type.includes('achievement'))
                .map(e => e.post_id);

              achievements = items.map((item: any) => {
                const earned = earnedIds.includes(item.id);
                const earning = userEarnings.find(e => e.post_id === item.id);
                
                return {
                  id: item.id,
                  title: item.title?.
