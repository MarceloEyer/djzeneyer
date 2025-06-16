// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
// Adicionando os imports do SDK novamente
import { SimpleJwtLogin, AuthenticateInterface } from 'simple-jwt-login';

// Interface para o token decodificado (formato "plano")
interface DecodedJwt {
  id: string;
  email: string;
  display_name?: string;
  roles?: string[];
  exp?: number;
}

export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  avatar?: string;
}

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

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Inicializamos o SDK para usá-lo na função de login
const simpleJwtLogin = new SimpleJwtLogin(window.wpData?.siteUrl || '');

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = (includeAuth = false) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (window.wpData?.nonce) {
      headers['X-WP-Nonce'] = window.wpData.nonce;
    }
    if (includeAuth && user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    return headers;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
  };

  const setUserFromToken = (token: string) => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || decoded.email.split('@')[0])}&background=6366F1&color=fff`
      };
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      logout();
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ JWT: token })
      });
      return response.ok && (await response.json()).success === true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        if (jwtFromUrl) {
          setUserFromToken(jwtFromUrl);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          const storedToken = localStorage.getItem('jwt_token');
          if (storedToken && await validateToken(storedToken)) {
            setUserFromToken(storedToken);
          } else if (storedToken) {
            logout();
          }
        }
      } catch (error) {
        console.error('[UserContext] Erro na inicialização:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // ATUALIZADO: Voltamos a usar o SDK para o login tradicional, com logs detalhados
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log('[UserContext] Tentando login com o SDK...');
    
    try {
      const params: AuthenticateInterface = { email, password };
      const data = await simpleJwtLogin.authenticate(params);

      console.log('[UserContext] Resposta do SDK:', data);

      if (data && data.jwt) {
        console.log('[UserContext] SUCESSO: Token JWT encontrado diretamente na resposta.');
        setUserFromToken(data.jwt);
      } else if (data && data.success && data.data?.jwt) {
        console.log('[UserContext] SUCESSO: Token JWT encontrado dentro de data.data.jwt.');
        setUserFromToken(data.data.jwt);
      }
      else {
        console.error('[UserContext] FALHA: A resposta do SDK não continha um JWT.', data);
        throw new Error(data.message || 'Credenciais inválidas ou erro no SDK.');
      }
    } catch (err: any) {
      console.error('[UserContext] Erro pego no bloco catch do login:', err);
      const errorMessage = err.message || 'Erro desconhecido ao tentar fazer login.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função de registro usa fetch direto, pois já estava correta.
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, user_login: email, display_name: name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Erro HTTP: ${response.status}`);
      if (data.success) {
        await login(email, password);
      } else {
        throw new Error(data.message || 'Falha no registro.');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de login com Google usa fetch direto, pois já estava correta.
  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    try {
      const GOOGLE_CLIENT_ID = '960427404700-2a7p5kcgj3dgiabora5hn7rafdc73n7v.apps.googleusercontent.com';
      const REDIRECT_URI = `${window.wpData?.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
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
      setError('Erro ao iniciar login com Google.');
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = { user, loading, error, login, logout, register, loginWithGoogle, clearError, setUserFromToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};