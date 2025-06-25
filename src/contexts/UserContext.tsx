import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react'; // Added useRef
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed: npm install jwt-decode
import { SimpleJwtLogin, RegisterUserInterface, AuthenticateInterface } from 'simple-jwt-login'; // Import the SDK

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData?: { // wpData is optional, as it might not be immediately available
      siteUrl: string;
      restUrl: string; // e.g., https://djzeneyer.com/wp-json/
      nonce: string; // Nonce for WP REST API requests
      jwtAuthKey?: string; // Auth key from plugin settings, if available
      jwtSettings?: { // JWT plugin settings, if available
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

// User type definition for WordPress User, updated to match WP API response
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string; // JWT token for API authentication
  roles?: string[]; // WordPress user roles (array of strings)
  avatar_urls?: { [size: string]: string }; // WordPress avatar URLs (object with sizes like '24', '48', '96')
  avatar?: string; // Simplified avatar URL for display (can be ui-avatars or WP avatar)
  
  // NEW: GamiPress specific data
  gamipress_points?: { [key: string]: number }; // e.g., { 'points': 1250 }
  gamipress_achievements?: GamiPressAchievement[];
  gamipress_ranks?: GamiPressRank[];
  gamipress_level?: number; 
  gamipress_xp?: number; 
  gamipress_rank_name?: string; 
  gamipress_xp_to_next_level?: number; 
  gamipress_xp_progress?: number; 
}

// Interfaces for GamiPress API data (simplified)
interface GamiPressAchievement {
  id: number;
  title: { rendered: string };
  status: string; 
  content?: { rendered: string };
}

interface GamiPressRank {
  id: number;
  title: { rendered: string };
  status: string; 
  points_required?: number;
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
  setUserFromToken: (token: string) => void; // Made available in context
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use useRef to store the SimpleJwtLogin instance
  const simpleJwtLoginRef = useRef<SimpleJwtLogin | null>(null);

  // Function to set user state from a JWT token
  const setUserFromToken = (token: string) => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      
      // Check if the token has expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('[UserContext] Token expirado');
        logout();
        return;
      }

      const loggedInUser: WordPressUser = {
        id: parseInt(decoded.id, 10),
        email: decoded.email,
        name: decoded.display_name || decoded.email.split('@')[0],
        isLoggedIn: true,
        token: token,
        roles: decoded.roles || ['subscriber'], 
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || decoded.email.split('@')[0] || 'User')}&background=0d96ff&color=fff`
      };

      setUser(loggedInUser);
      // Save to localStorage with error handling
      try {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
      } catch (e) {
        console.warn('[UserContext] Erro ao salvar no localStorage:', e);
      }
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      setError('Token inválido');
      logout();
    }
  };


  // Initialize SimpleJwtLogin SDK instance safely within useEffect
  // and handle initial authentication check
  useEffect(() => {
    // Definir wpData com fallbacks robustos
    // Acessa window.wpData diretamente aqui para a inicialização
    const initialWpData = window.wpData || {
      siteUrl: 'http://localhost:8000',
      restUrl: 'http://localhost:8000/wp-json/',
      nonce: '',
      jwtAuthKey: 'YOUR_AUTH_KEY_FALLBACK', // Ensure a fallback is here
      jwtSettings: {
        allowRegister: true,
        requireNonce: false,
        endpoint: '/simple-jwt-login/v1'
      }
    };

    // Only initialize if wpData is available and the ref hasn't been set yet
    if (initialWpData.siteUrl && !simpleJwtLoginRef.current) { 
        simpleJwtLoginRef.current = new SimpleJwtLogin(
          initialWpData.siteUrl, 
          initialWpData.jwtSettings?.endpoint || '/simple-jwt-login/v1', 
          initialWpData.jwtAuthKey || 'AUTH_KEY' 
        ); 
        console.log("[UserContext] SimpleJwtLogin SDK initialized.");

        // After SDK is initialized, try to fetch user details if a token is stored
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserData = localStorage.getItem('wp_user_data');
        if (storedToken && storedUserData) {
          try {
            const parsedUser = JSON.parse(storedUserData);
            // Validate stored token and then fetch user details
            validateToken(storedToken).then(isValid => {
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
            setLoading(false); // Stop loading if no token is stored on initial load
        }
    } else if (!initialWpData.siteUrl) { 
      // If wpData is not present, set an error to indicate authentication service is not ready
      setError("Serviço de autenticação não pronto. Por favor, recarregue a página.");
      console.error("[UserContext] window.wpData não está disponível. Os serviços de autenticação não funcionarão.");
      setLoading(false); // Stop loading if wpData is not available
    }
  }, []); // Run once on mount to initialize SDK

  // Function to validate JWT token (backend validation)
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Usar window.wpData diretamente
      if (!window.wpData || !window.wpData.siteUrl) {
          throw new Error("Authentication service not ready for token validation (wpData missing).");
      }
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/auth/validate`, { 
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
      console.error('[UserContext] Erro ao validar token (backend call):', e);
      return false;
    }
  };

  // Function to fetch full user details AND GamiPress data after successful authentication or on page load
  const fetchUserDetails = async (token: string, email: string) => {
    // Usar window.wpData diretamente
    if (!window.wpData || !window.wpData.siteUrl) { 
        throw new Error("Authentication service not ready for user details (wpData missing).");
    }

    try {
      // Tenta buscar dados do utilizador do WordPress (ideal)
      const userResponse = await fetch(`${window.wpData.restUrl}wp/v2/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`, 
            'X-WP-Nonce': window.wpData.nonce 
        },
        credentials: 'include' 
      });
      const userData = await userResponse.json();

      if (!userResponse.ok || userData.code) { 
          console.warn("[UserContext] /wp/v2/users/me failed. Attempting to get user data from JWT payload instead.");
          // Fallback: Se /users/me falha (e.g., 403 para non-admins), popula o utilizador do payload do JWT diretamente
          const decoded: DecodedJwt = jwtDecode(token);
          if (!decoded || !decoded.id || !decoded.email) {
            throw new Error("Could not decode valid user data from JWT payload for fallback.");
          }

          const basicUserFromJwt: WordPressUser = {
            id: parseInt(decoded.id, 10),
            email: decoded.email,
            name: decoded.display_name || decoded.email.split('@')[0] || 'User',
            isLoggedIn: true,
            token: token,
            roles: decoded.roles || ['subscriber'], 
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || decoded.email.split('@')[0] || 'User')}&background=0d96ff&color=fff`
          };
          setUser(basicUserFromJwt);
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('wp_user_data', JSON.stringify(basicUserFromJwt));
          console.log('Login bem-sucedido e detalhes do utilizador buscados do JWT (fallback)!', basicUserFromJwt);
          return basicUserFromJwt; 
      }

      // Se /users/me funcionar, usa esses dados
      const defaultUiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.slug || 'User')}&background=0d96ff&color=fff`;
      const finalAvatar = userData.avatar_urls?.['96'] || defaultUiAvatar;

      // --- Fetch GamiPress data ---
      let gamipressPoints: { [key: string]: number } = {};
      let gamipressAchievements: GamiPressAchievement[] = [];
      let gamipressRanks: GamiPressRank[] = [];
      let gamipressLevel: number = 0;
      let gamipressXP: number = 0;
      let gamipressRankName: string = 'N/A';
      let gamipressXPToNextLevel: number = 0;
      let gamipressXPProgress: number = 0;

      try {
        // Fetch User Points 
        const pointsResponse = await fetch(`${window.wpData.restUrl}gamipress/v1/users/${userData.id}/points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pointsResponse.ok) {
          gamipressPoints = await pointsResponse.json(); 
          gamipressXP = gamipressPoints.points || 0; 
        }

        // Fetch User Achievements
        const achievementsResponse = await fetch(`${window.wpData.restUrl}gamipress/v1/users/${userData.id}/achievements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (achievementsResponse.ok) {
          gamipressAchievements = (await achievementsResponse.json()).map((ach: any) => ({
            id: ach.id,
            title: ach.title,
            status: ach.status,
            content: ach.content,
            unlocked: ach.status === 'publish' 
          }));
        }

        // Fetch User Ranks 
        const ranksResponse = await fetch(`${window.wpData.restUrl}gamipress/v1/users/${userData.id}/ranks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ranksResponse.ok) {
          const ranksData = await ranksResponse.json();
          if (ranksData.length > 0) {
            const activeRank = ranksData.find((rank: any) => rank.status === 'publish');
            if (activeRank) {
              gamipressRanks = ranksData; 
              gamipressRankName = activeRank.title.rendered; 
              gamipressLevel = ranksData.indexOf(activeRank) + 1; 
            }
          }
        }
        console.log("[UserContext] GamiPress data fetched:", { gamipressPoints, gamipressAchievements, gamipressRanks });

      } catch (gamipressErr) {
        console.warn("[UserContext] Failed to fetch GamiPress data:", gamipressErr);
      }

      const loggedInUser: WordPressUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.display_name || userData.slug || 'Utilizador', 
        isLoggedIn: true,
        token: token,
        roles: userData.roles || [], 
        avatar_urls: userData.avatar_urls || {}, 
        avatar: finalAvatar, 
        
        // Assign GamiPress data to user object
        gamipress_points: gamipressPoints,
        gamipress_achievements: gamipressAchievements,
        gamipress_ranks: gamipressRanks,
        gamipress_level: gamipressLevel,
        gamipress_xp: gamipressXP,
        gamipress_rank_name: gamipressRankName,
        gamipress_xp_to_next_level: gamipressXPToNextLevel,
        gamipress_xp_progress: gamipressXPProgress,
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
    }
  };


  // Load user from localStorage on initial load and validate session
  useEffect(() => {
    // Only initialize if window.wpData is available
    if (!window.wpData) {
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
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/auth`, { 
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
    // Usar wpData diretamente aqui
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
