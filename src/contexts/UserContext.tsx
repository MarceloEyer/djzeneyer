// src/contexts/UserContext.tsx - VERSÃO ATUALIZADA COM TURNSTILE
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface WordPressUser {
  id: number;
  email: string;
  name?: string;
  display_name?: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
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
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${window.location.origin}/wp-json/zeneyer-auth/v1`;

  // ========================================================================
  // INICIALIZAÇÃO
  // ========================================================================
  useEffect(() => {
    const init = async () => {
      try {
        console.log('[UserContext] 🚀 Inicializando...');
        console.log('[UserContext] 📍 API URL:', API_URL);

        // 1. Busca Google Client ID
        console.log('[UserContext] 📡 Buscando settings...');
        const settingsRes = await fetch(`${API_URL}/settings`);
        const settingsText = await settingsRes.text();
        
        // DEBUG: Ver resposta crua
        console.log('[UserContext] 📄 Settings response (primeiros 200 chars):', settingsText.substring(0, 200));
        
        if (settingsText.trim().startsWith('<!DOCTYPE') || settingsText.trim().startsWith('<html')) {
          console.error('[UserContext] ❌ ERRO: Backend retornou HTML ao invés de JSON!');
          console.error('[UserContext] 💡 Possíveis causas:');
          console.error('  1. Plugin ZenEyer Auth não está ativo');
          console.error('  2. Rewrite rules não foram flushed (wp rewrite flush)');
          console.error('  3. .htaccess bloqueando o endpoint');
          setError('Plugin de autenticação não está configurado. Contate o administrador.');
          setLoadingInitial(false);
          return;
        }

        const settingsData = JSON.parse(settingsText);
        console.log('[UserContext] ✅ Settings carregados:', settingsData);
        
        if (settingsData.success && settingsData.data.google_client_id) {
          setGoogleClientId(settingsData.data.google_client_id);
          console.log('[UserContext] ✅ Google Client ID encontrado:', settingsData.data.google_client_id);
        } else {
          console.warn('[UserContext] ⚠️ Google Client ID não configurado');
        }

        // 2. Restaura Sessão
        const token = localStorage.getItem('zen_jwt');
        const savedUser = localStorage.getItem('zen_user');

        if (token && savedUser) {
          console.log('[UserContext] 🔐 Token encontrado, validando...');
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Validação silenciosa
          fetch(`${API_URL}/auth/validate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log('[UserContext] ⚠️ Token inválido, fazendo logout');
              logout();
            } else {
              console.log('[UserContext] ✅ Token válido');
            }
          })
          .catch(err => {
            console.error('[UserContext] ❌ Erro na validação:', err);
          });
        } else {
          console.log('[UserContext] 👤 Nenhum usuário logado');
        }
      } catch (err) {
        console.error('[UserContext] ❌ Falha na inicialização:', err);
        setError('Erro ao conectar com o servidor de autenticação');
      } finally {
        setLoadingInitial(false);
      }
    };

    init();
  }, []);

  // ========================================================================
  // HELPERS
  // ========================================================================
  const saveSession = (userData: WordPressUser, token: string) => {
    const userWithStatus = { ...userData, isLoggedIn: true, token };
    setUser(userWithStatus);
    localStorage.setItem('zen_jwt', token);
    localStorage.setItem('zen_user', JSON.stringify(userWithStatus));
    console.log('[UserContext] ✅ Sessão salva:', userWithStatus);
  };

  // ========================================================================
  // LOGIN COM EMAIL/SENHA
  // ========================================================================
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[UserContext] 🔐 Tentando login com email:', email);
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const responseText = await res.text();
      console.log('[UserContext] 📄 Login response:', responseText.substring(0, 200));

      if (responseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('Servidor retornou HTML. Verifique se o plugin está ativo.');
      }

      const json = JSON.parse(responseText);

      if (!json.success) {
        throw new Error(json.message || 'Credenciais inválidas');
      }
      
      console.log('[UserContext] ✅ Login bem-sucedido');
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      console.error('[UserContext] ❌ Erro no login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // REGISTRO (ATUALIZADO)
  // ========================================================================
  const register = async (name: string, email: string, password: string, turnstileToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[UserContext] 📝 Tentando registro:', { name, email, hasToken: !!turnstileToken });
      
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
      console.log('[UserContext] 📄 Register response:', responseText.substring(0, 200));

      if (responseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('Servidor retornou HTML. Verifique se o plugin está ativo.');
      }

      const json = JSON.parse(responseText);

      if (!json.success) {
        throw new Error(json.message || 'Falha no registro');
      }
      
      console.log('[UserContext] ✅ Registro bem-sucedido');
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      console.error('[UserContext] ❌ Erro no registro:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // GOOGLE LOGIN (CRÍTICO)
  // ========================================================================
  const googleLogin = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[UserContext] 🔵 Iniciando Google Login');
      console.log('[UserContext] 📍 Endpoint:', `${API_URL}/auth/google`);
      console.log('[UserContext] 🎫 Token length:', idToken.length);
      
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });

      console.log('[UserContext] 📊 Response status:', res.status);
      console.log('[UserContext] 📊 Response headers:', Object.fromEntries(res.headers.entries()));

      const responseText = await res.text();
      console.log('[UserContext] 📄 Response (primeiros 500 chars):', responseText.substring(0, 500));

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
      console.log('[UserContext] 📦 JSON parsed:', json);

      if (!json.success) {
        throw new Error(json.message || 'Falha no Google Login');
      }
      
      console.log('[UserContext] ✅ Google Login bem-sucedido!');
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      console.error('[UserContext] ❌ Google Login falhou:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // LOGOUT
  // ========================================================================
  const logout = () => {
    console.log('[UserContext] 👋 Fazendo logout');
    setUser(null);
    localStorage.removeItem('zen_jwt');
    localStorage.removeItem('zen_user');
  };

  const clearError = () => setError(null);

  // ========================================================================
  // PROVIDER
  // ========================================================================
  return (
    <UserContext.Provider value={{
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
      clearError
    }}>
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