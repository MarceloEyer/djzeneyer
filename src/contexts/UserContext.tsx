// src/contexts/UserContext.tsx - VERSÃO CORRIGIDA (SEM SDK)

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

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

interface UserContextType {
  user: WordPressUser | null;
  isAuthenticated: boolean; // ✅ ADICIONADO
  loading: boolean;
  loadingInitial: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const safeWindow = typeof window !== 'undefined';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Calcular isAuthenticated
  const isAuthenticated = user !== null && user.isLoggedIn;

  const logout = () => {
    console.log('[UserContext] 🚪 Logout executado');
    setUser(null);
    setError(null);
    if (safeWindow) {
      localStorage.removeItem('jwt_token');
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
      
      console.log('[UserContext] ✅ User data:', { id: finalUserData.id, email: finalUserData.email });
      setUser(finalUserData);
      
      if (safeWindow) {
        localStorage.setItem('jwt_token', token);
      }
    } catch (e) {
      console.error('[UserContext] ❌ Erro ao processar token:', e);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!safeWindow) {
          return setLoadingInitial(false);
        }
        
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
      } catch (e) {
        console.error('[UserContext] ❌ Erro na inicialização:', e);
        logout();
      } finally {
        setLoadingInitial(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('[UserContext] 🔐 Tentando login...', { email });
    setLoading(true); 
    setError(null);
    
    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data?.success && data.data?.jwt) {
        console.log('[UserContext] ✅ Autenticação bem-sucedida');
        await fetchUserDetails(data.data.jwt);
      } else {
        throw new Error(data?.data?.message || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro no login';
      console.error('[UserContext] ❌ Erro:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('[UserContext] 📝 Tentando registro...', { name, email });
    setLoading(true); 
    setError(null);
    
    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          display_name: name 
        })
      });
      
      if (response.status === 400) {
        await login(email, password);
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        let errorMsg = data.message || 'Erro no registro.';
        if (errorMsg.includes('already exists')) {
          errorMsg = 'Este email já está cadastrado. Tente fazer login.';
        }
        throw new Error(errorMsg);
      }
      
      await login(email, password);
    } catch (err: any) {
      const msg = err?.message || 'Erro no registro';
      console.error('[UserContext] ❌ Erro:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    console.log('[UserContext] 🔵 Iniciando login com Google...');
    const GOOGLE_CLIENT_ID = '960427404700-2a7p5kcgj3dgiabora5hn7rafdc73n7v.apps.googleusercontent.com';
    const REDIRECT_URI = `${window.location.origin}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'select_account'
    });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  };

  const clearError = () => setError(null);

  const value: UserContextType = {
    user,
    isAuthenticated, // ✅ ADICIONADO
    loading,
    loadingInitial,
    error,
    login,
    logout,
    register,
    loginWithGoogle,
    clearError
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ✅ EXPORTAR useUser (mantém compatibilidade)
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// ✅ EXPORTAR useAuth (para compatibilidade com useGamiPress)
export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

// ✅ EXPORTAR contexto também
export { UserContext };
