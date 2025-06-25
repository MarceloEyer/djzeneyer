import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { SimpleJwtLogin } from '../utils/SimpleJwtLogin';

// Interfaces
interface User {
  id: number;
  email: string;
  display_name: string;
  roles: string[];
  avatar_url?: string;
  gamipress_points?: { [key: string]: number };
  gamipress_achievements?: GamiPressEarning[];
  gamipress_ranks?: GamiPressEarning[];
  gamipress_level?: number;
  gamipress_xp?: number;
  gamipress_rank_name?: string;
}

interface GamiPressEarning {
  id: number;
  title: { rendered: string };
  status: string;
  post_type: 'points_award' | 'achievement' | 'rank';
  points?: number;
  points_type?: string;
  content?: { rendered: string };
  points_required?: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

// Função helper para acessar wpData de forma consistente
const getWpData = () => {
  if (!window.wpData) {
    throw new Error("Serviço de autenticação não pronto. Por favor, recarregue a página.");
  }
  return window.wpData;
};

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const simpleJwtLoginRef = useRef<SimpleJwtLogin | null>(null);

  // Função de fetch GamiPress separada para melhor organização
  const fetchGamipressData = async (token: string, userId: number) => {
    try {
      const wpData = getWpData();
      const response = await fetch(
        `${wpData.restUrl}wp/v2/gamipress-user-earnings?user_id=${userId}&per_page=100`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (!response.ok) {
        console.warn("[UserContext] Failed to fetch GamiPress earnings:", response.status);
        return null;
      }
      
      const earnings: GamiPressEarning[] = await response.json();
      
      // Processar dados do GamiPress
      const points = earnings
        .filter(e => e.post_type === 'points_award')
        .reduce((acc, curr) => {
          const type = curr.points_type || 'points';
          acc[type] = (acc[type] || 0) + (curr.points || 0);
          return acc;
        }, {} as { [key: string]: number });
      
      const achievements = earnings.filter(
        e => e.post_type === 'achievement' && e.status === 'publish'
      );
      
      const ranks = earnings.filter(
        e => e.post_type === 'rank' && e.status === 'publish'
      );
      
      return {
        gamipress_points: points,
        gamipress_achievements: achievements,
        gamipress_ranks: ranks,
        gamipress_level: ranks.length,
        gamipress_xp: points.points || 0,
        gamipress_rank_name: ranks.length > 0 
          ? ranks.sort((a, b) => b.id - a.id)[0].title.rendered 
          : 'N/A'
      };
    } catch (error) {
      console.warn("[UserContext] Failed to fetch GamiPress data:", error);
      return null;
    }
  };

  // Validar token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const wpData = getWpData();
      const response = await fetch(`${wpData.restUrl}wp/v2/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      console.error('[UserContext] Token validation failed:', error);
      return false;
    }
  };

  // Buscar detalhes do usuário
  const fetchUserDetails = async (token: string, email: string) => {
    try {
      const wpData = getWpData();
      const response = await fetch(`${wpData.restUrl}wp/v2/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      
      // Buscar dados do GamiPress
      const gamipressData = await fetchGamipressData(token, userData.id);
      
      const user: User = {
        id: userData.id,
        email: userData.email || email,
        display_name: userData.display_name || userData.name,
        roles: userData.roles || [],
        avatar_url: userData.avatar_urls?.['96'] || userData.avatar_urls?.['48'],
        ...gamipressData
      };

      setUser(user);
      setError(null);
      
      // Armazenar dados do usuário
      localStorage.setItem('wp_user_data', JSON.stringify(user));
      
      console.log('[UserContext] User data loaded:', user);
    } catch (error) {
      console.error('[UserContext] Failed to fetch user details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load user data');
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!simpleJwtLoginRef.current) {
        throw new Error('Authentication service not ready');
      }

      console.log('[UserContext] Attempting login...');
      const result = await simpleJwtLoginRef.current.authenticate(email, password);
      
      if (!result.success || !result.jwt) {
        throw new Error(result.message || 'Login failed');
      }

      // Armazenar token
      localStorage.setItem('jwt_token', result.jwt);
      
      // Buscar dados do usuário
      await fetchUserDetails(result.jwt, email);
      
      console.log('[UserContext] Login successful');
    } catch (error) {
      console.error('[UserContext] Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout melhorado
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('Utilizador terminou sessão.');
    
    try {
      const wpData = getWpData();
      window.location.href = wpData.siteUrl;
    } catch (error) {
      // Fallback se wpData não estiver disponível
      window.location.reload();
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    const token = localStorage.getItem('jwt_token');
    if (token && user) {
      try {
        await fetchUserDetails(token, user.email);
      } catch (error) {
        console.error('[UserContext] Failed to refresh user data:', error);
      }
    }
  };

  // useEffect consolidado para inicialização
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const wpData = getWpData();
        
        // Inicializar SDK apenas uma vez
        if (!simpleJwtLoginRef.current) {
          simpleJwtLoginRef.current = new SimpleJwtLogin(
            wpData.siteUrl,
            wpData.jwtSettings?.endpoint || '/simple-jwt-login/v1',
            wpData.jwtAuthKey || 'AUTH_KEY'
          );
          console.log("[UserContext] SimpleJwtLogin SDK initialized.");
        }
        
        // Verificar token armazenado
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserData = localStorage.getItem('wp_user_data');
        
        if (storedToken && storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            await fetchUserDetails(storedToken, parsedUser.email);
          } else {
            console.warn('Token armazenado inválido, terminando sessão');
            logout();
          }
        }
      } catch (error) {
        console.error('[UserContext] Erro na inicialização:', error);
        setError(error instanceof Error ? error.message : 'Initialization failed');
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook customizado - AGORA EXPORTADO!
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};