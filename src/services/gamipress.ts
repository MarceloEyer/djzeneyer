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

  private getAuthToken(): string | null {
    // Tentar múltiplas fontes de token
    if (this.token) return this.token;
    
    const possibleKeys = [
      'jwt_token',
      'authToken', 
      'token',
      'wp_token',
      'simple_jwt_login_token'
    ];
    
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log(`🔑 Found token in localStorage.${key}`);
        return token;
      }
    }
    
    console.warn('⚠️ No JWT token found in localStorage');
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Using token:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ Making request without authentication token');
    }

    console.log(`📡 Requesting: ${REST_BASE}${endpoint}`);

    try {
      const response = await fetch(`${REST_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      console.log(`📊 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error [${response.status}]:`, errorText);
        
        if (response.status === 401) {
          console.error('🚨 AUTHENTICATION FAILED - Token may be invalid or expired');
          console.log('Current token:', token?.substring(0, 30) + '...');
        }
        
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Response data received:`, data);
      return data;
    } catch (error) {
      console.error('❌ Request Failed:', error);
      throw error;
    }
  }

  async getUserData(userId: number): Promise<GamiPressUserData> {
    try {
      console.log('🎮 Fetching GamiPress data for user:', userId);

      // Verificar se temos token antes de fazer requisições
