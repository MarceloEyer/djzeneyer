// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Removendo a dependência do SDK Simple JWT Login para usar fetch direto
// que oferece mais controle sobre os headers e integração com CoCart

interface DecodedJwt {
  data: { 
    user: { 
      id: string; 
      user_email: string; 
      display_name: string; 
    } 
  };
  exp?: number; // Timestamp de expiração
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

// Garantir que window.wpData está disponível
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para configurar headers comuns para requisições
  const getHeaders = (includeAuth = false) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-WP-Nonce': window.wpData?.nonce || '',
    };

    // Adicionar header de autenticação se houver token válido
    if (includeAuth && user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    return headers;
  };

  // Função melhorada para configurar usuário a partir do token
  const setUserFromToken = (token: string) => {
    try {
      console.log('[UserContext] Processando token JWT...');
      
      const decoded: DecodedJwt = jwtDecode(token);
      console.log('[UserContext] Token decodificado:', decoded);
      
      // Verificar se o token está expirado
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('[UserContext] Token expirado, fazendo logout');
        logout();
        return;
      }

      const userData = decoded.data.user;
      const loggedInUser: WordPressUser = {
        id: parseInt(userData.id, 10), 
        email: userData.user_email, 
        name: userData.display_name,
        isLoggedIn: true, 
        token: token, 
        roles: ['subscriber'], // Default role, pode ser expandido
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.display_name)}&background=6366F1&color=fff`
      };
      
      setUser(loggedInUser);
      
      // Armazenar dados de forma segura
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
      
      console.log('[UserContext] Usuário configurado com sucesso:', loggedInUser);
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      logout();
    }
  };

  // Função melhorada para validação de token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      console.log('[UserContext] Validando token...');
      
      // Primeiro, verificar se o token não está expirado localmente
      const decoded: DecodedJwt = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('[UserContext] Token expirado localmente');
        return false;
      }

      // Validar com o servidor usando o endpoint do Simple JWT Login
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ JWT: token })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[UserContext] Validação de token bem-sucedida:', data);
        return data.success === true;
      }
      
      console.warn('[UserContext] Falha na validação do token:', response.status);
      return false;
    } catch (e) {
      console.error('[UserContext] Erro na validação do token:', e);
      return false;
    }
  };

  // Inicialização melhorada
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[UserContext] Inicializando autenticação...');
        
        // Verificar se há JWT na URL (retorno do Google OAuth)
        const urlParams = new URLSearchParams(window.location.search);
        const jwtFromUrl = urlParams.get('jwt');
        
        if (jwtFromUrl) {
          console.log('[UserContext] JWT encontrado na URL');
          setUserFromToken(jwtFromUrl);
          // Limpar a URL sem recarregar a página
          window.history.replaceState({}, document.title, window.location.pathname);
          setLoading(false);
          return;
        }

        // Verificar token armazenado
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
          console.log('[UserContext] Token encontrado no localStorage');
          const isValid = await validateToken(storedToken);
          if (isValid) {
            setUserFromToken(storedToken);
          } else {
            console.log('[UserContext] Token inválido, fazendo logout');
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

  // Login tradicional melhorado
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[UserContext] Iniciando login tradicional...');
      
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          email, 
          password 
        })
      });

      const data = await response.json();
      console.log('[UserContext] Resposta do login:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data.success && data.data?.jwt) {
        console.log('[UserContext] Login bem-sucedido');
        setUserFromToken(data.data.jwt);
      } else {
        throw new Error(data.message || 'Token JWT não foi retornado pelo servidor');
      }
    } catch (err: any) {
      console.error('[UserContext] Erro no login:', err);
      const errorMessage = err.message || 'Erro desconhecido no login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Registro melhorado
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[UserContext] Iniciando registro...');
      
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email,
          password,
          user_login: email, // Simple JWT Login geralmente usa email como login
          display_name: name,
        })
      });

      const data = await response.json();
      console.log('[UserContext] Resposta do registro:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      if (data.success) {
        console.log('[UserContext] Registro bem-sucedido, fazendo login automático...');
        // Tentar fazer login automaticamente após registro
        await login(email, password);
      } else {
        throw new Error(data.message || 'Falha no registro');
      }
    } catch (err: any) {
      console.error('[UserContext] Erro no registro:', err);
      const errorMessage = err.message || 'Erro desconhecido no registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth melhorado
  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[UserContext] Iniciando login com Google...');
      
      // Configurações do Google OAuth
      const GOOGLE_CLIENT_ID = '960427404700-2a7p5kcgj3dgiabora5hn7rafdc73n7v.apps.googleusercontent.com';
      const BASE_URL = window.wpData?.siteUrl || window.location.origin;
      
      // URL de redirect configurada no Simple JWT Login
      const REDIRECT_URI = `${BASE_URL}/wp-json/simple-jwt-login/v1/auth/google`;
      
      // Parâmetros do OAuth
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      
      console.log('[UserContext] Redirecionando para:', authUrl);
      window.location.href = authUrl;
      
    } catch (err: any) {
      console.error('[UserContext] Erro no login Google:', err);
      setError('Erro ao iniciar login com Google');
      setLoading(false);
    }
  };

  // Logout melhorado
  const logout = () => {
    console.log('[UserContext] Fazendo logout...');
    
    setUser(null);
    setError(null);
    
    // Limpar armazenamento local
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    
    // Opcional: Invalidar token no servidor
    // (pode ser implementado se necessário)
    
    console.log('[UserContext] Logout concluído');
  };

  const clearError = () => {
    setError(null);
  };

  const value = { 
    user, 
    loading, 
    error, 
    login, 
    logout, 
    register, 
    loginWithGoogle, 
    clearError, 
    setUserFromToken 
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