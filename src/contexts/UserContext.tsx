// src/contexts/UserContext.tsx - VERSÃO ATUALIZADA COM TURNSTILE
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { clearAllCache, queryClient, QUERY_KEYS } from '../config/queryClient';
import { buildApiUrl } from '../config/api';
import { fetchAuthSessionFn } from '../hooks/useQueries';

interface WordPressUser {
  id: number;
  email: string;
  name?: string;
  display_name?: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
  user_registered_year?: number;
  roles?: string[];
}

interface UserContextType {
  user: WordPressUser | null;
  googleClientId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  // ATUALIZADO: Agora aceita o token do Cloudflare (opcional)
  register: (name: string, email: string, password: string, turnstileToken?: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (key: string, login: string, password: string) => Promise<void>;
  clearError: () => void;
  // Opção D: busca o Google Client ID sob demanda (chamado pelo AuthModal ao abrir)
  loadGoogleClientId: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = useMemo(() => buildApiUrl('zeneyer-auth/v1'), []);

  // ========================================================================
  // HELPERS & LOGOUT (HOISTED FOR INITIALIZATION)
  // ========================================================================
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('zen_jwt');
    localStorage.removeItem('zen_user');
    clearAllCache();
  }, []);

  const saveSession = useCallback((userData: Omit<WordPressUser, 'isLoggedIn'> & { isLoggedIn?: boolean }, token: string) => {
    const userWithStatus = { ...userData, isLoggedIn: true, token };
    setUser(userWithStatus);
    localStorage.setItem('zen_jwt', token);
    localStorage.setItem('zen_user', JSON.stringify(userWithStatus));
  }, []);

  // ========================================================================
  // INICIALIZAÇÃO — Opção D: sem fetch de /settings no mount
  // Sessão restaurada imediatamente do localStorage; /settings só é buscado
  // quando AuthModal abre (via loadGoogleClientId).
  // ========================================================================
  useEffect(() => {
    const token = localStorage.getItem('zen_jwt');
    const savedUser = localStorage.getItem('zen_user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({ ...parsedUser, token, isLoggedIn: true });

        // Valida token em background sem bloquear a UI
        queryClient.fetchQuery({
          queryKey: QUERY_KEYS.user.session(Boolean(token)),
          queryFn: () => fetchAuthSessionFn(token),
          staleTime: 0,
        })
          .then(data => {
            if (!data.authenticated) {
              logout();
              return;
            }
            if (data.user) {
              saveSession(data.user, token);
            }
          })
          .catch(err => {
            console.error('[UserContext] ❌ Erro na validação:', err);
          });
      } catch (err) {
        console.error('[UserContext] ❌ Erro ao restaurar sessão:', err);
        logout();
      }
    }

    setLoadingInitial(false);
  }, [logout, saveSession]);

  // ========================================================================
  // LOAD GOOGLE CLIENT ID — chamado pelo AuthModal ao abrir
  // Falha isolada: apenas oculta botão Google, email login continua
  // ========================================================================
  const loadGoogleClientId = useCallback(async () => {
    if (googleClientId !== null) return;
    try {
      const res = await fetch(`${API_URL}/settings`);
      const text = await res.text();
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.warn('[UserContext] ⚠️ /settings retornou HTML — Google OAuth indisponível');
        return;
      }
      const data = JSON.parse(text);
      if (data.success && data.data?.google_client_id) {
        setGoogleClientId(data.data.google_client_id);
      } else {
        console.warn('[UserContext] ⚠️ Google Client ID não configurado no backend');
      }
    } catch (err) {
      console.warn('[UserContext] ⚠️ Falha ao carregar /settings — Google OAuth indisponível:', err);
      // Não propaga: email login continua funcionando normalmente
    }
  }, [API_URL, googleClientId]);



  // ========================================================================
  // LOGIN COM EMAIL/SENHA
  // ========================================================================
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const responseText = await res.text();

      if (responseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('Servidor retornou HTML. Verifique se o plugin está ativo.');
      }

      const json = JSON.parse(responseText);

      if (!json.success) {
        throw new Error(json.message || 'Credenciais inválidas');
      }

      saveSession(json.data.user, json.data.token);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[UserContext] ❌ Erro no login:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, saveSession]);

  // ========================================================================
  // REGISTRO (ATUALIZADO)
  // ========================================================================
  const register = useCallback(async (name: string, email: string, password: string, turnstileToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviando o token junto com os dados
        body: JSON.stringify({
          email,
          password,
          name,
          turnstileToken: turnstileToken || '' // Garante que envia string vazia se undefined
        })
      });

      const responseText = await res.text();

      if (responseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('Servidor retornou HTML. Verifique se o plugin está ativo.');
      }

      const json = JSON.parse(responseText);

      if (!json.success) {
        throw new Error(json.message || 'Falha no registro');
      }

      saveSession(json.data.user, json.data.token);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[UserContext] ❌ Erro no registro:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, saveSession]);

  // ========================================================================
  // GOOGLE LOGIN (CRÍTICO)
  // ========================================================================
  const googleLogin = useCallback(async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });

      const responseText = await res.text();

      // Detecta HTML
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        console.error('[UserContext] ❌ ERRO CRÍTICO: Backend retornou HTML!');
        console.error('[UserContext] 💡 Diagnóstico:');
        console.error('  Status:', res.status);
        console.error('  Content-Type:', res.headers.get('content-type'));
        console.error('  URL chamada:', `${API_URL}/auth/google`);

        throw new Error(
          'Servidor retornou HTML ao invés de JSON. ' +
          'Possíveis causas: ' +
          '(1) Plugin ZenEyer Auth não está ativo, ' +
          '(2) Rewrite rules não foram atualizadas (rode: wp rewrite flush), ' +
          '(3) .htaccess bloqueando requisições REST.'
        );
      }

      const json = JSON.parse(responseText);

      if (!json.success) {
        throw new Error(json.message || 'Falha no Google Login');
      }

      saveSession(json.data.user, json.data.token);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[UserContext] ❌ Google Login falhou:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, saveSession]);



  // ========================================================================
  // PASSWORD RESET
  // ========================================================================
  const requestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Erro ao solicitar reset de senha');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[UserContext] ❌ Erro ao solicitar reset:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const resetPassword = useCallback(async (key: string, login: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/password/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Erro ao definir nova senha');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[UserContext] ❌ Erro ao resetar senha:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user,
    googleClientId,
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
    loadGoogleClientId,
  }), [
    user,
    googleClientId,
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
    loadGoogleClientId,
  ]);

  // ========================================================================
  // PROVIDER
  // ========================================================================
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const useAuth = useUser;
