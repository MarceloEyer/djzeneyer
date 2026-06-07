// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { clearAllCache, queryClient, QUERY_KEYS } from '../config/queryClient';
import { fetchAuthSessionFn } from '../hooks/useQueries';
import {
  authLogin,
  authRegister,
  authGoogleLogin,
  authRequestPasswordReset,
  authResetPassword,
  type WordPressUser,
} from '../services/authService';

interface UserContextType {
  user: WordPressUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, turnstileToken?: string) => Promise<void>;
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
    localStorage.removeItem('zen_user');
    clearAllCache();
  }, []);

  const saveSession = useCallback(
    (userData: Omit<WordPressUser, 'isLoggedIn'> & { isLoggedIn?: boolean }, token: string) => {
      const userWithStatus = { ...userData, isLoggedIn: true, token };
      setUser(userWithStatus);
      localStorage.setItem('zen_jwt', token);
      localStorage.setItem('zen_user', JSON.stringify(userWithStatus));
    },
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('zen_jwt');
        const savedUser = localStorage.getItem('zen_user');
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser({ ...parsedUser, token, isLoggedIn: true });

          queryClient
            .fetchQuery({
              queryKey: QUERY_KEYS.user.session(Boolean(token)),
              queryFn: () => fetchAuthSessionFn(token),
              staleTime: 0,
            })
            .then((data) => {
              if (!data.authenticated) { logout(); return; }
              if (data.user) saveSession(data.user, token);
            })
            .catch((err) => {
              console.error('[UserContext] Erro na validação de sessão:', err);
            });
        }
      } catch (err) {
        console.error('[UserContext] Falha na inicialização:', err);
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
        const { user: u, token } = await authLogin(email, password);
        saveSession(u, token);
      } catch (err) {
        const e = err as Error;
        console.error('[UserContext] Erro no login:', e);
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
        const { user: u, token } = await authRegister(name, email, password, turnstileToken);
        saveSession(u, token);
      } catch (err) {
        const e = err as Error;
        console.error('[UserContext] Erro no registro:', e);
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
        const { user: u, token } = await authGoogleLogin(idToken);
        saveSession(u, token);
      } catch (err) {
        const e = err as Error;
        console.error('[UserContext] Google Login falhou:', e);
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
      console.error('[UserContext] Erro ao solicitar reset:', e);
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
      console.error('[UserContext] Erro ao resetar senha:', e);
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
