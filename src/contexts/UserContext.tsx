// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { SimpleJwtLogin, AuthenticateInterface } from 'simple-jwt-login';

// --- Interfaces (nenhuma mudança aqui) ---
interface DecodedJwt { id: string; email: string; display_name?: string; roles?: string[]; exp?: number; }
export interface WordPressUser { id: number; email: string; name: string; isLoggedIn: boolean; token?: string; roles?: string[]; avatar?: string; }
interface UserContextType { /* ... */ }

const UserContext = createContext<UserContextType | undefined>(undefined);

// --- NOVA FUNÇÃO HELPER DE CONFIGURAÇÃO ---
const getWpConfig = () => {
  // Prioridade 1: Usar os dados injetados pelo WordPress (para produção)
  if (window.wpData && window.wpData.restUrl) {
    console.log('[Config] Usando wpData injetado pelo WordPress (Modo de Produção).');
    return {
      siteUrl: window.wpData.siteUrl,
      restUrl: window.wpData.restUrl,
      nonce: window.wpData.nonce,
    };
  }

  // Prioridade 2: Usar as variáveis de ambiente (para desenvolvimento)
  if (import.meta.env.VITE_WP_REST_URL) {
    console.log('[Config] Usando variáveis de ambiente .env (Modo de Desenvolvimento).');
    return {
      siteUrl: import.meta.env.VITE_WP_SITE_URL,
      restUrl: import.meta.env.VITE_WP_REST_URL,
      nonce: 'dev-nonce', // Nonce não é crítico no dev para a maioria das ações
    };
  }

  // Fallback final se nada for encontrado
  console.error('[Config] Nenhuma configuração de URL encontrada! Verifique seu functions.php e seu arquivo .env');
  return { siteUrl: '', restUrl: '', nonce: '' };
};


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simpleJwtLogin, setSimpleJwtLogin] = useState<SimpleJwtLogin | null>(null);
  const [config, setConfig] = useState(getWpConfig());

  // Inicializa o SDK quando o componente monta
  useEffect(() => {
    // A configuração já é pega no estado inicial, mas podemos garantir aqui
    const currentConfig = getWpConfig();
    if (currentConfig.siteUrl) {
      try {
        const sdk = new SimpleJwtLogin(currentConfig.siteUrl);
        setSimpleJwtLogin(sdk);
      } catch (error) {
        console.error('[UserContext] Erro ao inicializar SDK:', error);
      }
    }
  }, []);

  const logout = () => { /* ... (sem alterações) ... */ };
  const setUserFromToken = (token: string) => { /* ... (sem alterações) ... */ };
  const validateToken = async (token: string): Promise<boolean> => { /* ... (sem alterações, já usa a config) ... */ };

  // Inicialização da autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      // ... (a lógica aqui dentro continua a mesma, pois ela já usará as funções atualizadas) ...
    };
    initializeAuth();
  }, []);

  // Login agora usa a config do estado
  const login = async (email: string, password: string) => {
    if (!simpleJwtLogin) throw new Error('Sistema de autenticação não inicializado');
    // ... (o resto da lógica de login continua a mesma) ...
  };
  
  // Register agora usa a config do estado
  const register = async (name: string, email: string, password: string) => {
    // ...
    const response = await fetch(`${config.restUrl}simple-jwt-login/v1/register`, { /* ... */ });
    // ...
  };

  // Google Login agora usa a config do estado
  const loginWithGoogle = () => {
    try {
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!GOOGLE_CLIENT_ID) throw new Error("...");
      
      // Usa a config do estado para a URL de redirect
      const REDIRECT_URI = `${config.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
      // ... (o resto da lógica do Google login continua a mesma) ...
    } catch (err: any) {
      //...
    }
  };

  // ... (o resto do seu UserContext)
};

export const useUser = () => { /* ... (sem alterações) ... */ };