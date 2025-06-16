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
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Inicializa o SDK fora do componente
const simpleJwtLogin = new SimpleJwtLogin(window.wpData?.siteUrl || '');

// --- O Componente Provedor ---
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const params: AuthenticateInterface = { email, password };
      const data = await simpleJwtLogin.authenticate(params);
      if (data && data.success && data.data?.jwt) {
        setUserFromToken(data.data.jwt);
      } else {
        throw new Error(data.message || 'Credenciais inválidas ou erro na resposta do servidor.');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
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
        headers: { 'Content-Type': 'application/json' },
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

  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    try {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!GOOGLE_CLIENT_ID) throw new Error("Client ID do Google não configurado.");
      
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
      setError(err.message || 'Erro ao iniciar login com Google.');
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = { user, loading, error, login, logout, register, loginWithGoogle, clearError, setUserFromToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// --- O HOOK DE EXPORTAÇÃO ---
// Esta é a parte que o erro diz que está faltando.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};