interface GamiPressPoints {
  [pointType: string]: number;
}

interface GamiPressAchievement {
  ID: number;
  post_title: string;
  post_excerpt: string;
  thumbnail: string;
  date_earned: string;
}

interface GamiPressRank {
  ID: number;
  post_title: string;
  rank_type: string;
  thumbnail: string;
}

interface GamiPressUserData {
  points: GamiPressPoints;
  achievements: GamiPressAchievement[];
  ranks: GamiPressRank[];
  total_achievements: number;
  total_points: number;
}

export class GamiPressService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_WP_REST_URL || 'https://djzeneyer.com/wp-json/';
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`GamiPress API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserData(userId: number): Promise<GamiPressUserData> {
    try {
      const [points, achievements, ranks] = await Promise.all([
        this.getUserPoints(userId),
        this.getUserAchievements(userId),
        this.getUserRanks(userId),
      ]);

      const totalPoints = Object.values(points).reduce((sum, val) => sum + val, 0);

      return {
        points,
        achievements,
        ranks,
        total_achievements: achievements.length,
        total_points: totalPoints,
      };
    } catch (error) {
      console.error('[GamiPress] Error fetching user data:', error);
      return {
        points: {},
        achievements: [],
        ranks: [],
        total_achievements: 0,
        total_points: 0,
      };
    }
  }

  async getUserPoints(userId: number): Promise<GamiPressPoints> {
    try {
      return await this.request<GamiPressPoints>(`gamipress/v1/users/${userId}/points`);
    } catch (error) {
      console.error('[GamiPress] Error fetching points:', error);
      return {};
    }
  }

  async getUserAchievements(userId: number): Promise<GamiPressAchievement[]> {
    try {
      return await this.request<GamiPressAchievement[]>(`gamipress/v1/users/${userId}/achievements`);
    } catch (error) {
      console.error('[GamiPress] Error fetching achievements:', error);
      return [];
    }
  }

  async getUserRanks(userId: number): Promise<GamiPressRank[]> {
    try {
      return await this.request<GamiPressRank[]>(`gamipress/v1/users/${userId}/ranks`);
    } catch (error) {
      console.error('[GamiPress] Error fetching ranks:', error);
      return [];
    }
  }

  async awardPoints(userId: number, points: number, pointType: string = 'zen-points'): Promise<void> {
    try {
      await fetch(`${this.baseUrl}gamipress/v1/users/${userId}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ points, point_type: pointType }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('[GamiPress] Error awarding points:', error);
    }
  }

  async checkAchievementProgress(userId: number, achievementId: number): Promise<number> {
    try {
      const data = await this.request<{ progress: number }>(
        `gamipress/v1/users/${userId}/achievements/${achievementId}/progress`
      );
      return data.progress;
    } catch (error) {
      console.error('[GamiPress] Error checking achievement progress:', error);
      return 0;
    }
  }
}

export const gamipress = new GamiPressService();
