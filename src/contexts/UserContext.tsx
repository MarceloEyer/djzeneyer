// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// ALTERADO: A interface agora reflete a estrutura "plana" do token.
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

  // CORRIGIDO: Esta função agora lê a estrutura "plana" correta do token.
  const setUserFromToken = (token: string) => {
    try {
      console.log('[UserContext] Processando token JWT...');
      const decoded: DecodedJwt = jwtDecode(token);
      console.log('[UserContext] Token decodificado:', decoded);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('[UserContext] Token expirado, fazendo logout');
        logout();
        return;
      }
      
      const loggedInUser: WordPressUser = {
        id: parseInt(decoded.id, 10),
        email: decoded.email,
        name: decoded.display_name || decoded.email.split('@')[0],
        isLoggedIn: true,
        token: token,
        roles: decoded.roles || ['subscriber'], // Ainda precisamos adicionar as roles no backend
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || decoded.email.split('@')[0])}&background=6366F1&color=fff`
      };
      
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
      console.log('[UserContext] Usuário configurado com sucesso:', loggedInUser);
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      logout();
    }
  };
  
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return false;
      }
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
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        if (jwtFromUrl) {
          setUserFromToken(jwtFromUrl);
          window.history.replaceState({}, document.title, window.location.pathname);
          setLoading(false);
          return;
        }

        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
          if (await validateToken(storedToken)) {
            setUserFromToken(storedToken);
          } else {
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Erro HTTP: ${response.status}`);
      if (data.success && data.jwt) { // O token vem em data.jwt no sucesso
        setUserFromToken(data.jwt);
      } else {
        throw new Error(data.data?.message || 'Token JWT não foi retornado pelo servidor');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido no login';
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
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email, password,
          user_login: email, display_name: name,
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Erro HTTP: ${response.status}`);
      if (data.success) {
        await login(email, password);
      } else {
        throw new Error(data.message || 'Falha no registro');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido no registro';
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
      setError('Erro ao iniciar login com Google');
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
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