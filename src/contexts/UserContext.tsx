// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { SimpleJwtLogin, AuthenticateInterface } from 'simple-jwt-login';

// --- Interfaces ---
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
  // Adicionando campos GamiPress
  gamipress_points?: { [key: string]: number };
  gamipress_achievements?: any[];
  gamipress_ranks?: any[];
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

const getWpConfig = () => {
  if (window.wpData && window.wpData.restUrl) {
    return { siteUrl: window.wpData.siteUrl, restUrl: window.wpData.restUrl, nonce: window.wpData.nonce };
  }
  if (import.meta.env.VITE_WP_REST_URL) {
    return { siteUrl: import.meta.env.VITE_WP_SITE_URL || '', restUrl: import.meta.env.VITE_WP_REST_URL || '', nonce: 'dev-nonce' };
  }
  return { siteUrl: '', restUrl: '', nonce: '' };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<SimpleJwtLogin | null>(null);
  const [config] = useState(getWpConfig());

  useEffect(() => {
    if (config.siteUrl) setSdk(new SimpleJwtLogin(config.siteUrl));
  }, [config.siteUrl]);

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
  };
  
  const fetchUserDetails = async (token: string) => {
    // Tenta buscar dados completos do /users/me
    try {
      const userResponse = await fetch(`${config.restUrl}wp/v2/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (!userResponse.ok) throw new Error('Falha ao buscar /users/me');
      
      const userData = await userResponse.json();
      
      // Aqui, no futuro, faremos as chamadas para o GamiPress
      // const gamipressData = await fetchGamipressData(token, userData.id);

      const loggedInUser: WordPressUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name || 'Usuário',
        isLoggedIn: true,
        token: token,
        roles: userData.roles || [],
        avatar: userData.avatar_urls?.['96'] || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
        // ...gamipressData
      };
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));

    } catch (err) {
      // FALLBACK: Se o /users/me falhar (comum para não-admins), usa os dados do token
      console.warn("/users/me falhou. Usando dados do payload do JWT como fallback.");
      const decoded: DecodedJwt = jwtDecode(token);
      const basicUser: WordPressUser = {
        id: parseInt(decoded.id, 10),
        email: decoded.email,
        name: decoded.display_name || decoded.email.split('@')[0],
        isLoggedIn: true,
        token: token,
        roles: decoded.roles || ['subscriber'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || 'User')}`
      };
      setUser(basicUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(basicUser));
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const jwtFromUrl = urlParams.get('jwt');
      if (jwtFromUrl) {
        await fetchUserDetails(jwtFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
           await fetchUserDetails(storedToken);
        }
      }
      setLoading(false);
    };
    if (config.siteUrl) initializeAuth();
    else setLoading(false);
  }, [config.siteUrl]);

  const login = async (email: string, password: string) => {
    if (!sdk) throw new Error('SDK não inicializado.');
    setLoading(true);
    setError(null);
    try {
      const data = await sdk.authenticate({ email, password });
      if (data && data.success && data.data?.jwt) {
        await fetchUserDetails(data.data.jwt);
      } else {
        throw new Error(data?.message || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
     if (!sdk) throw new Error('SDK não inicializado.');
     setLoading(true);
     setError(null);
     try {
        const data = await sdk.registerUser({ email, password, display_name: name });
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
  
  // CORRIGIDO: Usando a nossa versão correta para o Google Login
  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    try {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!GOOGLE_CLIENT_ID) throw new Error("Client ID do Google não configurado.");
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
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar login com Google.');
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = { user, loading, error, login, logout, register, loginWithGoogle, clearError, setUserFromToken: fetchUserDetails };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};