// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import SimpleJwtLogin from 'simple-jwt-login';

// --- Interfaces ---
interface DecodedJwt { id?: string | number; email?: string; display_name?: string; roles?: string[]; exp?: number; }
export interface WordPressUser { id: number; email: string; name: string; isLoggedIn: boolean; token?: string; roles?: string[]; avatar?: string; }
interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGoogleToken: (googleToken: string) => Promise<void>;
  clearError: () => void;
  setUserFromToken: (token: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

declare global { interface Window { wpData?: { siteUrl?: string; restUrl?: string; nonce?: string; }; } }

const safeWindow = typeof window !== 'undefined';

const getWpConfig = () => {
  if (safeWindow && window.wpData?.restUrl) return { siteUrl: window.wpData.siteUrl || '', restUrl: window.wpData.restUrl || '', nonce: window.wpData.nonce || '' };
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WP_REST_URL) {
    return { siteUrl: import.meta.env.VITE_WP_SITE_URL || '', restUrl: import.meta.env.VITE_WP_REST_URL || '', nonce: import.meta.env.VITE_WP_NONCE || '' };
  }
  console.error('[Config] Nenhuma configuração de URL encontrada!');
  return { siteUrl: '', restUrl: '', nonce: '' };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<SimpleJwtLogin | null>(null);
  const [config] = useState(getWpConfig());

  useEffect(() => {
    if (config.restUrl) {
      try {
        setSdk(new SimpleJwtLogin(config.restUrl));
      } catch (e) {
        console.warn('[UserContext] SimpleJwtLogin init failed', e);
      }
    }
  }, [config.restUrl]);

  const logout = () => {
    setUser(null);
    setError(null);
    if (safeWindow) localStorage.removeItem('jwt_token');
  };

  const buildAvatarUrl = (displayName?: string) => {
    const name = displayName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
  };

  const fetchUserDetails = async (token: string) => {
    try {
      const decoded = jwtDecode<DecodedJwt>(token);
      // exp check
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      const id = decoded.id ? Number(decoded.id) : Date.now();
      const finalUserData: WordPressUser = {
        id,
        email: decoded.email || '',
        name: decoded.display_name || decoded.email?.split('@')[0] || 'User',
        isLoggedIn: true,
        token,
        roles: decoded.roles || ['subscriber'],
        avatar: buildAvatarUrl(decoded.display_name || decoded.email)
      };
      setUser(finalUserData);
      if (safeWindow) localStorage.setItem('jwt_token', token);
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!safeWindow) return setLoading(false);
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        if (jwtFromUrl) {
          await fetchUserDetails(jwtFromUrl);
          // remove param from url
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } else {
          const storedToken = localStorage.getItem('jwt_token');
          if (storedToken) await fetchUserDetails(storedToken);
        }
      } catch (e) {
        console.error('Erro na inicialização do Auth', e);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    if (!sdk) throw new Error('SDK não inicializado.');
    setLoading(true); setError(null);
    try {
      const data = await sdk.authenticate({ email, password } as AuthenticateInterface);
      if (data?.success && data.data?.jwt) {
        await fetchUserDetails(data.data.jwt);
      } else {
        throw new Error(data?.message || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro no login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!config.restUrl) throw new Error('Configuração REST ausente.');
    setLoading(true); setError(null);
    try {
      const response = await fetch(`${config.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro no registro.');
      // Auto-login after register
      await login(email, password);
    } catch (err: any) {
      const msg = err?.message || 'Erro no registro';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Método que inicia fluxo OAuth tradicional (redirect). Mantive, mas
   * prefira o uso de loginWithGoogleToken quando usar Google Identity (credential).
   */
  const loginWithGoogle = () => {
    setLoading(true); setError(null);
    try {
      const GOOGLE_CLIENT_ID = typeof import.meta !== 'undefined' ? import.meta.env.VITE_GOOGLE_CLIENT_ID : undefined;
      if (!GOOGLE_CLIENT_ID) throw new Error('Client ID do Google não configurado.');
      // se usar redirect flow, o endpoint do plugin pode ser algo como:
      const REDIRECT_URI = `${config.siteUrl || window.location.origin}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
      const finalRedirectUrl = window.location.origin;
      const state = btoa(`redirect_uri=${finalRedirectUrl}`);
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
        state
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar login com Google.');
      setLoading(false);
    }
  };

  /**
   * Método recomendado para integração com Google Identity Services.
   * Recebe o ID token/credential retornado pelo frontend e troca no backend
   * pelo JWT do WordPress via endpoint simples do plugin.
   */
  const loginWithGoogleToken = async (googleToken: string) => {
    if (!config.restUrl) throw new Error('Configuração REST ausente.');
    setLoading(true); setError(null);
    try {
      const endpoint = `${config.restUrl}simple-jwt-login/v1/auth/google`;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.error('[UserContext] Erro auth/google:', txt);
        throw new Error(`Falha ao autenticar: ${resp.status}`);
      }
      const data = await resp.json();
      if (!data?.jwt) throw new Error('JWT não retornado pelo backend.');
      await fetchUserDetails(data.jwt);
    } catch (err: any) {
      const msg = err?.message || 'Erro no login via Google';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: UserContextType = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    loginWithGoogle,
    loginWithGoogleToken,
    clearError,
    setUserFromToken: fetchUserDetails
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};
