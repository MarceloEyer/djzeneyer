// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// NOTA: As interfaces do simple-jwt-login não são necessárias aqui,
// uma vez que estamos a fazer chamadas diretas à API com fetch.

// Tipagem para o utilizador do WordPress
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  avatar?: string;
}

// Tipagem para o contexto
interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; 
  loginWithGoogle: () => void; // Não precisa ser async se apenas redireciona
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true); // Começa true para validar o token inicial
  const [error, setError] = useState<string | null>(null);

  // Função para validar um token JWT no backend
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JWT: token })
      });
      const data = await response.json();
      return data.success === true;
    } catch (e) {
      console.error('Token validation failed:', e);
      return false;
    }
  };

  // Função para obter os detalhes do utilizador e definir o estado de login
  const fetchUserDetailsAndLogin = async (token: string, email: string) => {
    // Para o Simple JWT Login, não há um endpoint /me.
    // Criamos um utilizador básico no frontend.
    const basicUser: WordPressUser = {
      id: Date.now(), // ID temporário
      email: email,
      name: email.split('@')[0],
      isLoggedIn: true,
      token: token,
      roles: ['subscriber'],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366F1&color=fff`
    };

    setUser(basicUser);
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('wp_user_data', JSON.stringify(basicUser));
  };

  // Efeito para verificar o token no arranque da aplicação
  useEffect(() => {
    const checkStoredToken = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      const storedUserData = localStorage.getItem('wp_user_data');
      
      if (storedToken && storedUserData) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setUser({ ...JSON.parse(storedUserData), isLoggedIn: true, token: storedToken });
        } else {
          logout(); // Limpa se o token for inválido
        }
      }
      setLoading(false);
    };

    checkStoredToken();
  }, []);


  // --- FUNÇÕES DE AUTENTICAÇÃO ---

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.data?.jwt) {
        await fetchUserDetailsAndLogin(data.data.jwt, email);
      } else {
        throw new Error(data.data?.message || "Credenciais inválidas.");
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpData?.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          user_login: email,
          display_name: name,
        })
      });
      const data = await response.json();
      if (data.success) {
        // Tenta fazer login automaticamente após o registo
        await login(email, password);
      } else {
        throw new Error(data.data?.message || "Falha no registo.");
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    
    // --- CORREÇÃO PRINCIPAL (80/20) ---
    // Este é o URL correto que o seu plugin Simple-JWT-Login espera.
    // O frontend redireciona o utilizador para o backend, que trata da autenticação
    // com o Google e depois redireciona de volta para o frontend com o token JWT.
    const googleLoginUrl = `${window.wpData?.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
    
    // Redireciona o browser do utilizador
    window.location.href = googleLoginUrl;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
  };

  const clearError = () => {
    setError(null);
  };

  const value = { user, loading, error, login, logout, register, loginWithGoogle, clearError };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
