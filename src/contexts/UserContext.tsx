// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { clearAllCache, queryClient, QUERY_KEYS } from '../config/queryClient';
import { logger } from '../lib/logger';
import { fetchAuthSessionFn } from '../hooks/useQueries';
import {
  authLogin,
  authRegister,
  isRegisterPending,
  authGoogleLogin,
  authRequestPasswordReset,
  authResetPassword,
  type WordPressUser,
} from '../services/authService';
import { TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT } from '../lib/tokenRefresh';

interface UserContextType {
  user: WordPressUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  /** Resolves 'pending' when the server only sent a verification e-mail (no session created). */
  register: (name: string, email: string, password: string, turnstileToken?: string) => Promise<'authenticated' | 'pending'>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (key: string, login: string, password: string) => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('zen_jwt');
    localStorage.removeItem('zen_refresh_token');
    localStorage.removeItem('zen_user');
    clearAllCache();
  }, []);

  const saveSession = useCallback(
    (
      userData: Omit<WordPressUser, 'isLoggedIn'> & { isLoggedIn?: boolean },
      token: string,
      refreshToken?: string
    ) => {
      const userWithStatus = { ...userData, isLoggedIn: true, token };
      setUser(userWithStatus);
      localStorage.setItem('zen_jwt', token);
      localStorage.setItem('zen_user', JSON.stringify(userWithStatus));
      if (refreshToken) {
        localStorage.setItem('zen_refresh_token', refreshToken);
      }
    },
    []
  );

  // Keep context state in sync with the silent token renewal in
  // src/lib/tokenRefresh.ts: it writes localStorage directly (it runs from
  // plain fetch wrappers, outside React), so this just mirrors the new token
  // into state, or ends the session with a clear message if renewal failed.
  useEffect(() => {
    const onTokenRefreshed = (event: Event) => {
      const detail = (event as CustomEvent<{ token: string }>).detail;
      if (!detail?.token) return;
      setUser((prev) => (prev ? { ...prev, token: detail.token } : prev));
    };

    const onSessionExpired = () => {
      logout();
      setError('Sua sessão expirou. Entre novamente.');
    };

    window.addEventListener(TOKEN_REFRESHED_EVENT, onTokenRefreshed);
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, onTokenRefreshed);
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('zen_jwt');
        const savedUser = localStorage.getItem('zen_user');
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser({ ...parsedUser, token, isLoggedIn: true });

          try {
            const data = await queryClient.fetchQuery({
              queryKey: QUERY_KEYS.user.session(Boolean(token)),
              queryFn: () => fetchAuthSessionFn(token),
              staleTime: 0,
            });
            if (!data.authenticated) {
              logout();
            } else if (data.user) {
              // Merge top-level roles from session response into the user object
              // so that roles are preserved in localStorage and UserContext state.
              saveSession({ ...data.user, roles: data.roles ?? [] }, token);
            }
          } catch (err) {
            logger.error('USER_CONTEXT', 'Session validation error', { error: String(err) });
            logout(); // clear stale token on validation failure
          }
        }
      } catch (err) {
        logger.error('USER_CONTEXT', 'Initialization failure', { error: String(err) });
        setError('Erro ao conectar com o servidor de autenticação');
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, [logout, saveSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const { user: u, token, refreshToken } = await authLogin(email, password);
        saveSession(u, token, refreshToken);
      } catch (err) {
        const e = err as Error;
        logger.error('USER_CONTEXT', 'Login error', { error: String(e) });
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, turnstileToken?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await authRegister(name, email, password, turnstileToken);
        if (isRegisterPending(result)) {
          return 'pending' as const;
        }
        saveSession(result.user, result.token, result.refreshToken);
        return 'authenticated' as const;
      } catch (err) {
        const e = err as Error;
        logger.error('USER_CONTEXT', 'Register error', { error: String(e) });
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  const googleLogin = useCallback(
    async (idToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const { user: u, token, refreshToken } = await authGoogleLogin(idToken);
        saveSession(u, token, refreshToken);
      } catch (err) {
        const e = err as Error;
        logger.error('USER_CONTEXT', 'Google login failed', { error: String(e) });
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authRequestPasswordReset(email);
    } catch (err) {
      const e = err as Error;
      logger.error('USER_CONTEXT', 'Password reset request error', { error: String(e) });
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (key: string, login: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authResetPassword(key, login, password);
    } catch (err) {
      const e = err as Error;
      logger.error('USER_CONTEXT', 'Password reset error', { error: String(e) });
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      loadingInitial,
      error,
      login,
      register,
      googleLogin,
      logout,
      requestPasswordReset,
      resetPassword,
      clearError,
    }),
    [user, loading, loadingInitial, error, login, register, googleLogin, logout, requestPasswordReset, resetPassword, clearError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const useAuth = useUser;
