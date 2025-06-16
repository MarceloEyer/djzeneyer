// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// ALTERADO: A interface agora reflete a estrutura "plana" do token real.
interface DecodedJwt {
  id: string;
  email: string;
  // O plugin pode não incluir o display_name no payload base, então é opcional.
  display_name?: string; 
  roles?: string[];
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

  // ... (a função getHeaders continua a mesma) ...
  const getHeaders = (includeAuth = false) => {
    // ...
  };

  // CORRIGIDO: Esta função agora lê a estrutura correta do token.
  const setUserFromToken = (token: string) => {
    try {
      console.log('[UserContext] Processando token JWT...');
      const decoded: DecodedJwt = jwtDecode(token);
      console.log('[UserContext] Token decodificado:', decoded);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('[UserContext] Token expirado, fazendo logout');
        logout();
        return;
      }

      // Lendo os dados diretamente da raiz do objeto decodificado
      const loggedInUser: WordPressUser = {
        id: parseInt(decoded.id, 10),
        email: decoded.email,
        // Usa o display_name se existir, senão cria um a partir do email
        name: decoded.display_name || decoded.email.split('@')[0],
        isLoggedIn: true,
        token: token,
        roles: decoded.roles || ['subscriber'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.display_name || decoded.email.split('@')[0])}&background=6366F1&color=fff`
      };
      
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
      console.log('[UserContext] Usuário configurado com sucesso:', loggedInUser);
    } catch (e) {
      console.error('[UserContext] Erro ao processar token:', e);
      logout();
    }
  };

  // ... (o resto do seu arquivo pode continuar exatamente como o Bolt gerou) ...
  // Cole esta nova versão da interface DecodedJwt e da função setUserFromToken
  // no seu arquivo UserContext.tsx existente. O resto do código do Bolt já está bom.
  
  // (Para facilitar, o código completo e correto está abaixo)
};

/* COPIE E COLE O CÓDIGO COMPLETO ABAIXO NO SEU UserContext.tsx 
Ele já contém a correção que fizemos.
*/