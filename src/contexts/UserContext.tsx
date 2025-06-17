// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { SimpleJwtLogin, AuthenticateInterface } from 'simple-jwt-login';

// Interface para o token decodificado
interface DecodedJwt {
  id: string;
  email: string;
  display_name?: string;
  roles?: string[];
  exp?: number;
}

// Interface para o objeto do usuário no app
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  avatar?: string;
}

// Interface para o tipo do Contexto
interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  clearError: () => void;
  setUserFromToken: (token: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Declaração global para o objeto wpData
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Função para obter configurações do WordPress com fallbacks
const getWpConfig = () => {
  // Verifica se wpData existe, senão usa valores padrão ou variáveis de ambiente
  const siteUrl = window.wpData?.siteUrl || 
                  import.meta.env.VITE_WP_SITE_URL || 
                  window.location.origin;
  
  const restUrl = window.wpData?.restUrl || 
                  `${siteUrl}/wp-json/`;

  return { siteUrl, restUrl };
};

// --- O Componente Provedor ---
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simpleJwtLogin, setSimpleJwtLogin] = useState<SimpleJwtLogin | null>(null);

  // Inicializa o SDK quando o componente monta
  useEffect(() => {
    const config = getWpConfig();
    try {
      const sdk = new SimpleJwtLogin(config.siteUrl);
      setSimpleJwtLogin(sdk);
    } catch (error) {
      console.error('[UserContext] Erro ao inicializar SDK:', error);
      setError('Erro na configuração do sistema de autenticação');
    }
  }, []);

  const logout = () => {
    setUser(null);
    setError(null);
    // Usar try/catch para localStorage em caso de problemas de permissão
    try {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('wp_user_data');
    } catch (e) {
      console.warn('[UserContext] Erro ao limpar localStorage:', e);
    }
  };

  const setUserFromToken = (token: string) => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      
      // Verifica se o token não expirou
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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          decoded.display_name || decoded.email.split('@')[0]
        )}&background=6366F1&color=fff`
      };

      setUser(loggedInUser);
      
      // Salvar no localStorage com tratamento de erro
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
  
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      
      // Verificação básica de expiração
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return false;
      }

      const config = getWpConfig();
      const response = await fetch(`${config.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ JWT: token })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success === true;
    } catch (e) {
      console.error('[UserContext] Erro ao validar token:', e);
      return false;
    }
  };

  // Inicialização da autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Verifica se há JWT na URL (redirect do Google)
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        
        if (jwtFromUrl) {
          setUserFromToken(jwtFromUrl);
          // Remove o JWT da URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('jwt');
          window.history.replaceState({}, document.title, newUrl.pathname + newUrl.search);
        } else {
          // Verifica token armazenado
          let storedToken: string | null = null;
          try {
            storedToken = localStorage.getItem('jwt_token');
          } catch (e) {
            console.warn('[UserContext] Erro ao acessar localStorage:', e);
          }

          if (storedToken) {
            const isValid = await validateToken(storedToken);
            if (isValid) {
              setUserFromToken(storedToken);
            } else {
              console.log('[UserContext] Token inválido, fazendo logout');
              logout();
            }
          }
        }
      } catch (error) {
        console.error('[UserContext] Erro na inicialização:', error);
        setError('Erro ao inicializar autenticação');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    if (!simpleJwtLogin) {
      throw new Error('Sistema de autenticação não inicializado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const params: AuthenticateInterface = { email, password };
      const data = await simpleJwtLogin.authenticate(params);
      
      if (data && data.success && data.data?.jwt) {
        setUserFromToken(data.data.jwt);
      } else {
        throw new Error(data?.message || 'Credenciais inválidas ou erro na resposta do servidor.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const config = getWpConfig();
      const response = await fetch(`${config.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          user_login: email, 
          display_name: name 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data.success) {
        // Após registro bem-sucedido, faz login automaticamente
        await login(email, password);
      } else {
        throw new Error(data.message || 'Falha no registro.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao registrar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    
    try {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!GOOGLE_CLIENT_ID) {
        throw new Error("Client ID do Google não configurado nas variáveis de ambiente.");
      }

      const config = getWpConfig();
      const REDIRECT_URI = `${config.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
      const finalRedirectUrl = window.location.origin;
      const state = btoa(`redirect_uri=${finalRedirectUrl}`);
      
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
        state: state
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      window.location.href = authUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao iniciar login com Google.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = { 
    user, 
    loading, 
    error, 
    login, 
    logout, 
    register, 
    loginWithGoogle, 
    clearError, 
    setUserFromToken 
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// --- O HOOK DE EXPORTAÇÃO ---
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};