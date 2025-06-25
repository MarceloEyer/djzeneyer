import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { SimpleJwtLogin, RegisterUserInterface, AuthenticateInterface } from 'simple-jwt-login';

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
      jwtAuthKey?: string;
      jwtSettings?: {
        allowRegister: boolean;
        requireNonce: boolean;
        endpoint: string;
      };
    };
  }
}

// Interface para o token decodificado
interface DecodedJwt {
  id: string;
  email: string;
  display_name?: string;
  roles?: string[];
  exp?: number;
}

// Interface unificada para earnings do GamiPress
interface GamiPressEarning {
  id: number;
  title: { rendered: string };
  status: string;
  post_type: 'points_award' | 'achievement' | 'rank'; // Tipo de earning
  points?: number; // Para pontos
  points_type?: string; // Para tipo de ponto
  content?: { rendered: string }; // Conteúdo da conquista/rank
  user_id?: number; // ID do usuário associado
  date?: string; // Data de criação
}

// User type definition for WordPress User, updated to match WP API response
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  avatar_urls?: { [size: string]: string };
  avatar?: string;
  
  // GamiPress specific data
  gamipress_points?: { [key: string]: number };
  gamipress_achievements?: GamiPressEarning[];
  gamipress_ranks?: GamiPressEarning[];
  gamipress_level?: number;
  gamipress_xp?: number;
  gamipress_rank_name?: string;
  gamipress_xp_to_next_level?: number;
  gamipress_xp_progress?: number;
}

interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
  setUserFromToken: (token: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to safely get wpData
const getWpData = () => {
  if (!window.wpData || !window.wpData.siteUrl) {
    throw new Error("Authentication service not ready. (wpData missing or incomplete)");
  }
  return window.wpData;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true); // Start as true for initial auth check
  const [error, setError] = useState<string | null>(null);
  
  const simpleJwtLoginRef = useRef<SimpleJwtLogin | null>(null);

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    try {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('wp_user_data');
    } catch (e) {
      console.warn('[UserContext] Error clearing localStorage:', e);
    }
    // Attempt to redirect, fallback to reload
    try {
      const wpConfig = getWpData();
      window.location.href = wpConfig.siteUrl;
    } catch (e) {
      console.warn('[UserContext] wpData not available for redirect, reloading:', e);
      window.location.reload();
    }
  };

  // Function to validate JWT token (backend validation)
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const wpConfig = getWpData(); // Use helper
      const response = await fetch(`${wpConfig.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ JWT: token })
      });

      const data = await response.json();
      return data.success === true;
    } catch (e) {
      console.error('[UserContext] Error validating token (backend call):', e);
      return false;
    }
  };

  // Function to fetch GamiPress data for a user
  const fetchGamipressData = async (token: string, userId: number) => {
    try {
      const wpConfig = getWpData(); // Use helper
      const response = await fetch(
        `${wpConfig.restUrl}wp/v2/gamipress-user-earnings?user_id=${userId}&per_page=100&context=view`, // per_page to ensure all are fetched, context=view
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        console.warn("[UserContext] Failed to fetch GamiPress earnings (response not ok):", response.status);
        return null;
      }

      const allEarnings: GamiPressEarning[] = await response.json();
      
      // Process GamiPress data
      const points = allEarnings.filter(e => e.post_type === 'points_award').reduce((acc, curr) => {
        const type = curr.points_type || 'points'; // Default to 'points' if not specified
        acc[type] = (acc[type] || 0) + (curr.points || 0);
        return acc;
      }, {} as { [key: string]: number });

      const achievements = allEarnings.filter(e => e.post_type === 'achievement' && e.status === 'publish');
      const ranks = allEarnings.filter(e => e.post_type === 'rank' && e.status === 'publish');

      const gamipressXP = points.points || 0;
      const gamipressLevel = ranks.length; // Simple level calculation based on number of ranks
      const gamipressRankName = ranks.length > 0
        ? ranks.sort((a, b) => b.id - a.id)[0].title.rendered // Get title of highest rank
        : 'N/A';

      // XP to next level and progress are complex without specific GamiPress API endpoints
      // Keep as 0 or 'N/A' unless custom endpoints provide this.
      const gamipressXPToNextLevel = 0; // Requires more complex API/logic
      const gamipressXPProgress = 0; // Requires gamipressXPToNextLevel

      return {
        gamipress_points: points,
        gamipress_achievements: achievements,
        gamipress_ranks: ranks,
        gamipress_level: gamipressLevel,
        gamipress_xp: gamipressXP,
        gamipress_rank_name: gamipressRankName,
        gamipress_xp_to_next_level: gamipressXPToNextLevel,
        gamipress_xp_progress: gamipressXPProgress,
      };
    } catch (error) {
      console.warn("[UserContext] Failed to fetch GamiPress data (catch block):", error);
      return null;
    }
  };

  // Function to fetch full user details AND GamiPress data after successful authentication or on page load
  const fetchUserDetails = async (token: string, email: string) => {
    try {
      const wpConfig = getWpData(); // Use helper

      // Tenta buscar dados do utilizador do WordPress (ideal)
      const userResponse = await fetch(`${wpConfig.restUrl}wp/v2/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`, 
            'X-WP-Nonce': wpConfig.nonce 
        },
        credentials: 'include' 
      });
      const userData = await userResponse.json();

      let finalUserData = userData;

      if (!userResponse.ok || userData.code) { 
          console.warn("[UserContext] /wp/v2/users/me falhou. Tentando obter dados do utilizador do payload JWT em vez disso.");
          // Fallback: Se /users/me falha (e.g., 403 para non-admins), popula o utilizador do payload do JWT diretamente
          const decoded: DecodedJwt = jwtDecode(token);
          if (!decoded || !decoded.id || !decoded.email) {
            throw new Error("Não foi possível descodificar dados válidos do utilizador do payload JWT para fallback.");
          }
          // Use data from decoded JWT as base
          finalUserData = {
            id: parseInt(decoded.id, 10),
            email: decoded.email,
            name: decoded.display_name || decoded.email.split('@')[0],
            roles: decoded.roles || ['subscriber'],
          };
      }

      // Se /users/me funcionar (ou o fallback do JWT), usa esses dados
      const defaultUiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(finalUserData.name || finalUserData.slug || 'User')}&background=0d96ff&color=fff`;
      const finalAvatar = finalUserData.avatar_urls?.['96'] || defaultUiAvatar;

      const gamipressData = await fetchGamipressData(token, finalUserData.id);

      const loggedInUser: WordPressUser = {
        id: finalUserData.id,
        email: finalUserData.email,
        name: finalUserData.name || finalUserData.display_name || finalUserData.slug || 'Utilizador', 
        isLoggedIn: true,
        token: token,
        roles: finalUserData.roles || [], 
        avatar_urls: finalUserData.avatar_urls || {}, 
        avatar: finalAvatar, 
        
        // Assign GamiPress data to user object
        gamipress_points: gamipressData?.gamipress_points,
        gamipress_achievements: gamipressData?.gamipress_achievements,
        gamipress_ranks: gamipressData?.gamipress_ranks,
        gamipress_level: gamipressData?.gamipress_level,
        gamipress_xp: gamipressData?.gamipress_xp,
        gamipress_rank_name: gamipressData?.gamipress_rank_name,
        gamipress_xp_to_next_level: gamipressData?.gamipress_xp_to_next_level,
        gamipress_xp_progress: gamipressData?.gamipress_xp_progress,
      };
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify({
          id: loggedInUser.id,
          email: loggedInUser.email,
          name: loggedInUser.name,
          roles: loggedInUser.roles,
          avatar_urls: loggedInUser.avatar_urls, 
          avatar: loggedInUser.avatar, 
          gamipress_points: loggedInUser.gamipress_points, 
          gamipress_achievements: loggedInUser.gamipress_achievements,
          gamipress_ranks: loggedInUser.gamipress_ranks,
          gamipress_level: loggedInUser.gamipress_level,
          gamipress_xp: loggedInUser.gamipress_xp,
          gamipress_rank_name: loggedInUser.gamipress_rank_name,
          gamipress_xp_to_next_level: loggedInUser.gamipress_xp_to_next_level,
          gamipress_xp_progress: loggedInUser.gamipress_xp_progress,
      }));
      console.log('Login bem-sucedido e detalhes do utilizador buscados!', loggedInUser);
    } catch (err: any) {
      console.error("[UserContext] Erro ao buscar detalhes do utilizador:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Falha ao obter detalhes do utilizador após o login.';
      setError(cleanErrorMessage);
      throw err; 
    } finally {
        setLoading(false); // Only set loading to false AFTER fetchUserDetails completes or fails
    }
  };


  // Load user from localStorage on initial load and validate session
  useEffect(() => {
    // Check if window.wpData is available
    if (!window.wpData || !window.wpData.siteUrl) {
      setError("Serviço de autenticação não pronto. Por favor, recarregue a página.");
      console.error("[UserContext] window.wpData não está disponível. Os serviços de autenticação não funcionarão.");
      setLoading(false); // Stop loading if wpData is not available
      return;
    }

    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        console.log('Carregando utilizador armazenado:', parsedUser);
        
        // Validate stored token and then fetch user details
        validateToken(storedToken).then(isValid => {
          console.log('Validação do token armazenado:', isValid);
          if (isValid) {
            // If token is valid, try to fetch fresh user details (including GamiPress)
            fetchUserDetails(storedToken, parsedUser.email).catch((err) => {
              console.warn("Token JWT armazenado ou sessão inválida, limpando dados do utilizador após inicialização:", err);
              logout(); 
            });
          } else {
            console.warn('Token armazenado inválido, terminando sessão');
            logout();
          }
        }).catch((err) => {
          console.error('Erro na validação do token ao inicializar:', err);
          logout();
        });
      } catch (e) {
        console.error("Falha ao analisar dados do utilizador armazenados", e);
        logout();
      }
    } else {
      setLoading(false); // Stop loading if no token is stored
    }
  }, []); // Empty dependency array to run only once on mount

  // --- Funções de Autenticação com Simple JWT Login (chamadas fetch diretas) ---

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null); // Limpar erros anteriores
    
    // Usar wpData diretamente aqui, pois está definido no escopo do componente
    if (!window.wpData || !window.wpData.siteUrl) { // Fallback para se wpData não estiver disponível
        setLoading(false);
        setError("Serviço de autenticação não pronto. Por favor, recarregue a página.");
        throw new Error("wpData não está disponível.");
    }

    try {
      // Chamada direta para a API do Simple JWT Login (endpoint /auth)
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/auth`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailParam, password: passwordParam }), 
        credentials: 'include' 
      });

      const data = await response.json();
      if (response.ok && data.success && data.data?.jwt) {
        const token = data.data.jwt;
        await fetchUserDetails(token, emailParam); 
      } else {
        const errorMessage = data.data?.message || data.message || "Credenciais inválidas.";
        setError(errorMessage);
        throw new Error(errorMessage); 
      }
    } catch (err: any) {
      console.error("[UserContext] Erro de login:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Falha ao iniciar sessão. Por favor, verifique as suas credenciais.';
      setError(cleanErrorMessage);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null); // Limpar erros anteriores
    // Usar wpData diretamente aqui
    if (!window.wpData || !window.wpData.siteUrl) { // Fallback para se wpData não estiver disponível
        setLoading(false);
        setError("Serviço de autenticação não pronto. Por favor, recarregue a página.");
        throw new Error("wpData não está disponível.");
    }

    try {
      const registerParams: RegisterUserInterface = {
        email: emailParam,
        password: passwordParam,
        user_login: emailParam, 
        display_name: nameParam,
        first_name: nameParam 
      };
      // Endpoint CORRIGIDO para /users (conforme a lista de rotas do plugin)
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/users`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpData.nonce, 
        },
        body: JSON.stringify({
            email: emailParam,
            password: passwordParam,
            user_login: emailParam, 
            display_name: nameParam,
            first_name: nameParam 
        }),
        credentials: 'include' 
      });

      const data = await response.json();
      if (response.ok && data.success) { 
        console.log('Registo bem-sucedido!', data);
        await login(emailParam, passwordParam); 
      } else {
        const errorMessage = data.data?.message || data.message || "Registo falhou.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Erro de registo:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Falha ao criar conta. Por favor, tente novamente.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null); // Limpar quaisquer erros persistentes ao terminar sessão
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('Utilizador terminou sessão.');
    window.location.href = wpData.siteUrl; 
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null); // Limpar erros anteriores
    // Usar wpData directamente aqui
    if (!window.wpData || !window.wpData.siteUrl) { // Fallback para se wpData não estiver disponível
        setLoading(false);
        setError("Serviço de autenticação não pronto. Por favor, recarregue a página.");
        throw new Error("wpData não está disponível.");
    }
    
    try {
      window.location.href = `${wpData.siteUrl}/wp-login.php?loginSocial=google`; 
    } catch (err: any) {
      console.error("[UserContext] Erro de login Google:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Falha ao iniciar sessão com Google.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    loginWithGoogle,
    clearError, 
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
