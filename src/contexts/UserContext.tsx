// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import SimpleJwtLogin from 'simple-jwt-login';

// --- Interfaces ---
interface DecodedJwt { 
  id?: string | number; 
  email?: string; 
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

interface AuthenticateInterface { 
  email: string; 
  password: string; 
}

interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  loadingInitial: boolean; // <-- ADICIONAR para diferenciar loading inicial
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

declare global { 
  interface Window { 
    wpData?: { 
      siteUrl?: string; 
      restUrl?: string; 
      nonce?: string; 
    }; 
  } 
}

const safeWindow = typeof window !== 'undefined';

// Pega configuração do WordPress
const getWpConfig = () => {
  console.log('[UserContext] 🔧 Obtendo configuração...');
  
  if (safeWindow && window.wpData?.restUrl) {
    console.log('[UserContext] ✅ Usando window.wpData');
    return { 
      siteUrl: window.wpData.siteUrl || '', 
      restUrl: window.wpData.restUrl || '', 
      nonce: window.wpData.nonce || '' 
    };
  }
  
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WP_REST_URL) {
    console.log('[UserContext] ✅ Usando variáveis de ambiente');
    return { 
      siteUrl: import.meta.env.VITE_WP_SITE_URL || '', 
      restUrl: import.meta.env.VITE_WP_REST_URL || '', 
      nonce: import.meta.env.VITE_WP_NONCE || '' 
    };
  }
  
  console.error('[UserContext] ❌ Nenhuma configuração encontrada!');
  return { siteUrl: '', restUrl: '', nonce: '' };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true); // <-- ADICIONAR
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<SimpleJwtLogin | null>(null);
  const [config] = useState(getWpConfig());

  console.log('[UserContext] 🎯 Config:', config);

  // Inicializa SDK
  useEffect(() => {
    if (config.restUrl) {
      try {
        console.log('[UserContext] 📦 Inicializando SimpleJwtLogin SDK...');
        setSdk(new SimpleJwtLogin(config.restUrl));
        console.log('[UserContext] ✅ SDK inicializado');
      } catch (e) {
        console.warn('[UserContext] ⚠️ Falha ao inicializar SDK:', e);
      }
    } else {
      console.error('[UserContext] ❌ restUrl não configurado!');
    }
  }, [config.restUrl]);

  // Logout
  const logout = () => {
    console.log('[UserContext] 🚪 Logout executado');
    setUser(null);
    setError(null);
    if (safeWindow) {
      localStorage.removeItem('jwt_token');
      console.log('[UserContext] 🗑️ Token removido do localStorage');
    }
  };

  // Constrói URL de avatar
  const buildAvatarUrl = (displayName?: string) => {
    const name = displayName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
  };

  // Busca detalhes do usuário a partir do token
  const fetchUserDetails = async (token: string) => {
    try {
      console.log('[UserContext] 🔍 Decodificando JWT...');
      const decoded = jwtDecode<DecodedJwt>(token);
      console.log('[UserContext] 📊 JWT decodificado:', decoded);
      
      // Verifica expiração
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        console.log('[UserContext] ⏰ Token expirado');
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
      
      console.log('[UserContext] 👤 Usuário configurado:', {
        id: finalUserData.id,
        email: finalUserData.email,
        name: finalUserData.name,
        roles: finalUserData.roles
      });
      
      setUser(finalUserData);
      
      if (safeWindow) {
        localStorage.setItem('jwt_token', token);
        console.log('[UserContext] 💾 Token salvo no localStorage');
      }
    } catch (e) {
      console.error('[UserContext] ❌ Erro ao processar token:', e);
      logout();
    }
  };

  // Inicializa autenticação ao carregar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[UserContext] 🚀 Inicializando autenticação...');
        
        if (!safeWindow) {
          console.log('[UserContext] ⚠️ Não está no browser');
          return setLoadingInitial(false);
        }
        
        // Verifica se tem JWT na URL
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        
        if (jwtFromUrl) {
          console.log('[UserContext] 🔗 JWT encontrado na URL');
          await fetchUserDetails(jwtFromUrl);
          // Remove da URL
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } else {
          // Verifica localStorage
          const storedToken = localStorage.getItem('jwt_token');
          if (storedToken) {
            console.log('[UserContext] 💾 Token encontrado no localStorage');
            await fetchUserDetails(storedToken);
          } else {
            console.log('[UserContext] ℹ️ Nenhum token encontrado');
          }
        }
      } catch (e) {
        console.error('[UserContext] ❌ Erro na inicialização:', e);
        logout();
      } finally {
        setLoadingInitial(false);
        console.log('[UserContext] ✅ Inicialização completa');
      }
    };
    
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login com email/senha
  const login = async (email: string, password: string) => {
    console.log('[UserContext] 🔐 Tentando login...', { email });
    
    if (!sdk) {
      const error = 'SDK não inicializado.';
      console.error('[UserContext] ❌', error);
      throw new Error(error);
    }
    
    setLoading(true); 
    setError(null);
    
    try {
      console.log('[UserContext] 📡 Chamando SDK.authenticate...');
      const data = await sdk.authenticate({ email, password } as AuthenticateInterface);
      console.log('[UserContext] 📥 Resposta do SDK:', data);
      
      if (data?.success && data.data?.jwt) {
        console.log('[UserContext] ✅ Autenticação bem-sucedida');
        await fetchUserDetails(data.data.jwt);
      } else {
        const errorMsg = data?.message || 'Credenciais inválidas.';
        console.log('[UserContext] ❌ Falha na autenticação:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro no login';
      console.error('[UserContext] ❌ Erro capturado:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registro de novo usuário
  const register = async (name: string, email: string, password: string) => {
    console.log('[UserContext] 📝 Tentando registro...', { name, email });
    
    if (!config.restUrl) {
      const error = 'Configuração REST ausente.';
      console.error('[UserContext] ❌', error);
      throw new Error(error);
    }
    
    setLoading(true); 
    setError(null);
    
    try {
      const endpoint = `${config.restUrl}simple-jwt-login/v1/register`;
      console.log('[UserContext] 📡 POST para:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: name })
      });
      
      const data = await response.json();
      console.log('[UserContext] 📥 Resposta do registro:', data);
      
      if (!response.ok) {
        const errorMsg = data.message || 'Erro no registro.';
        console.log('[UserContext] ❌ Registro falhou:', errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('[UserContext] ✅ Registro bem-sucedido, fazendo auto-login...');
      // Auto-login após registro
      await login(email, password);
    } catch (err: any) {
      const msg = err?.message || 'Erro no registro';
      console.error('[UserContext] ❌ Erro capturado:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login com Google (redirect flow - legado)
  const loginWithGoogle = () => {
    console.log('[UserContext] 🔵 Iniciando login com Google (redirect)...');
    setLoading(true); 
    setError(null);
    
    try {
      const GOOGLE_CLIENT_ID = typeof import.meta !== 'undefined' ? import.meta.env.VITE_GOOGLE_CLIENT_ID : undefined;
      
      if (!GOOGLE_CLIENT_ID) {
        throw new Error('Client ID do Google não configurado.');
      }
      
      console.log('[UserContext] 🔑 Google Client ID:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
      
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
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      console.log('[UserContext] 🔗 Redirecionando para:', authUrl);
      
      window.location.href = authUrl;
    } catch (err: any) {
      const msg = err.message || 'Erro ao iniciar login com Google.';
      console.error('[UserContext] ❌', msg);
      setError(msg);
      setLoading(false);
    }
  };

  // Login com Google Token (Google Identity Services - RECOMENDADO)
  const loginWithGoogleToken = async (googleToken: string) => {
    console.log('[UserContext] 🔵 Login com Google Token...');
    
    if (!config.restUrl) {
      const error = 'Configuração REST ausente.';
      console.error('[UserContext] ❌', error);
      throw new Error(error);
    }
    
    setLoading(true); 
    setError(null);
    
    try {
      const endpoint = `${config.restUrl}simple-jwt-login/v1/auth/google`;
      console.log('[UserContext] 📡 POST para:', endpoint);
      console.log('[UserContext] 🎫 Token recebido (primeiros 50 chars):', googleToken.substring(0, 50) + '...');
      
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });
      
      console.log('[UserContext] 📥 Status da resposta:', resp.status);
      
      if (!resp.ok) {
        const txt = await resp.text();
        console.error('[UserContext] ❌ Erro do servidor:', txt);
        throw new Error(`Falha ao autenticar: ${resp.status}`);
      }
      
      const data = await resp.json();
      console.log('[UserContext] 📊 Resposta do Google auth:', data);
      
      if (!data?.jwt) {
        throw new Error('JWT não retornado pelo backend.');
      }
      
      console.log('[UserContext] ✅ JWT recebido, configurando usuário...');
      await fetchUserDetails(data.jwt);
    } catch (err: any) {
      const msg = err?.message || 'Erro no login via Google';
      console.error('[UserContext] ❌ Erro capturado:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    console.log('[UserContext] 🧹 Limpando erro');
    setError(null);
  };

  const value: UserContextType = {
    user,
    loading,
    loadingInitial, // <-- ADICIONAR
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
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
