// src/contexts/UserContext.tsx - ARQUIVO COMPLETO

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
  loadingInitial: boolean;
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
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<SimpleJwtLogin | null>(null);
  const [config] = useState(getWpConfig());

  console.log('[UserContext] 🎯 Config:', config);

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

  const logout = () => {
    console.log('[UserContext] 🚪 Logout executado');
    setUser(null);
    setError(null);
    if (safeWindow) {
      localStorage.removeItem('jwt_token');
      console.log('[UserContext] 🗑️ Token removido do localStorage');
    }
  };

  const buildAvatarUrl = (displayName?: string) => {
    const name = displayName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&bold=true`;
  };

  const fetchUserDetails = async (token: string) => {
    try {
      console.log('[UserContext] 🔍 Decodificando JWT...');
      const decoded = jwtDecode<DecodedJwt>(token);
      console.log('[UserContext] 📊 JWT decodificado:', decoded);
      
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[UserContext] 🚀 Inicializando autenticação...');
        
        if (!safeWindow) {
          console.log('[UserContext] ⚠️ Não está no browser');
          return setLoadingInitial(false);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        
        if (jwtFromUrl) {
          console.log('[UserContext] 🔗 JWT encontrado na URL');
          await fetchUserDetails(jwtFromUrl);
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } else {
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
  }, []);

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
      // TENTATIVA 1: Simple JWT Login
      let endpoint = `${config.restUrl}simple-jwt-login/v1/register`;
      console.log('[UserContext] 📡 Tentando Simple JWT Login:', endpoint);
      
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          display_name: name 
        })
      });
      
      console.log('[UserContext] 📥 Status Simple JWT:', response.status);
      
      // MUDANÇA: Se retornar 400 mas usuário foi criado, tentar login
      if (response.status === 400) {
        console.log('[UserContext] ⚠️ 400 retornado, mas pode ter criado usuário. Tentando login...');
        
        // Espera 2 segundos para garantir que usuário foi criado
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          await login(email, password);
          console.log('[UserContext] ✅ Usuário já existia! Login bem-sucedido');
          return; // Sucesso!
        } catch (loginError) {
          console.log('[UserContext] ❌ Login falhou, usuário realmente não existe');
        }
      }
      
      // TENTATIVA 2: Se 404, usa WP REST API
      if (response.status === 404) {
        console.log('[UserContext] ⚠️ Simple JWT não disponível, usando WP Users API...');
        
        endpoint = `${config.restUrl}wp/v2/users`;
        console.log('[UserContext] 📡 POST para:', endpoint);
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: email.split('@')[0],
            email, 
            password,
            name,
            roles: ['subscriber']
          })
        });
        
        console.log('[UserContext] 📥 Status WP Users:', response.status);
      }
      
      const data = await response.json();
      console.log('[UserContext] 📊 Resposta:', data);
      
      if (!response.ok && response.status !== 400) {
        let errorMsg = data.message || data.error || data.code || 'Erro no registro.';
        
        if (errorMsg.includes('already exists') || errorMsg.includes('username_exists') || errorMsg.includes('email_exists')) {
          errorMsg = 'Este email já está cadastrado. Tente fazer login.';
        } else if (errorMsg.includes('invalid_email')) {
          errorMsg = 'Email inválido.';
        } else if (errorMsg.includes('weak_password')) {
          errorMsg = 'Senha muito fraca. Use pelo menos 8 caracteres.';
        } else if (response.status === 403) {
          errorMsg = 'Registro desabilitado. Contate o administrador.';
        }
        
        console.log('[UserContext] ❌ Registro falhou:', errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('[UserContext] ✅ Registro bem-sucedido!');
      
      // Se retornar JWT direto
      if (data.jwt) {
        console.log('[UserContext] 🎫 JWT recebido diretamente');
        await fetchUserDetails(data.jwt);
      } else {
        // Auto-login após registro
        console.log('[UserContext] 🔐 Fazendo auto-login...');
        await login(email, password);
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro no registro';
      console.error('[UserContext] ❌ Erro capturado:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    loadingInitial,
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
