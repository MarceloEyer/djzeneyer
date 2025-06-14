// src/contexts/UserContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
// SDK: Importando o SDK
import { SimpleJwtLogin, AuthenticateInterface, RegisterUserInterface, ValidateTokenInterface } from 'simple-jwt-login';

// --- As interfaces para WordPressUser e DecodedJwt continuam as mesmas ---
interface DecodedJwt {
  data: { user: { id: string; user_email: string; display_name: string; } }
}
export interface WordPressUser {
  id: number; email: string; name: string; isLoggedIn: boolean;
  token?: string; roles?: string[]; avatar?: string;
}
interface UserContextType {
  user: WordPressUser | null; loading: boolean; error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; 
  loginWithGoogle: () => void;
  clearError: () => void;
  setUserFromToken: (token: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// SDK: Inicializamos o SDK uma vez fora do componente.
// Usamos window.wpData.siteUrl que você já tem disponível globalmente.
const simpleJwtLogin = new SimpleJwtLogin(window.wpData?.siteUrl || '');

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setUserFromToken = (token: string) => {
    // ... (Esta função continua a mesma, está perfeita)
    try {
      const decoded: DecodedJwt = jwtDecode(token);
      const userData = decoded.data.user;
      const loggedInUser: WordPressUser = {
        id: parseInt(userData.id, 10), email: userData.user_email, name: userData.display_name,
        isLoggedIn: true, token: token, roles: ['subscriber'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.display_name)}&background=6366F1&color=fff`
      };
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify(loggedInUser));
    } catch (e) { console.error("Token inválido:", e); logout(); }
  };

  // SDK: Refatorado para usar o SDK
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const params: ValidateTokenInterface = { JWT: token };
      const response = await simpleJwtLogin.validateToken(params);
      // O SDK já retorna um booleano de sucesso ou lança um erro
      return response.success;
    } catch (e) {
      console.error('Falha na validação do token (SDK):', e);
      return false;
    }
  };

  // O useEffect principal para inicialização continua o mesmo.
  // Ele depende da `validateToken`, que agora usa o SDK.
  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const jwtFromUrl = urlParams.get('jwt');
      if (jwtFromUrl) {
        setUserFromToken(jwtFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      }
      const storedToken = localStorage.getItem('jwt_token');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (isValid) setUserFromToken(storedToken);
        else logout();
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);


  // --- FUNÇÕES DE AUTENTICAÇÃO ---

  // SDK: Refatorado para usar o SDK
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const params: AuthenticateInterface = { email, password };
      // A chamada ao SDK substitui o `fetch`
      const data = await simpleJwtLogin.authenticate(params);
      // O SDK lança um erro em caso de falha, então podemos assumir sucesso aqui
      if (data.jwt) {
        setUserFromToken(data.jwt);
      } else {
        throw new Error("Token JWT não foi retornado pelo SDK.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Credenciais inválidas.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // SDK: Refatorado para usar o SDK
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const params: RegisterUserInterface = {
        email,
        password,
        user_login: email,
        display_name: name,
      };
      // A chamada ao SDK substitui o `fetch`
      const data = await simpleJwtLogin.registerUser(params);
      if (data.success) {
        // Tenta fazer login automaticamente após o registo
        await login(email, password);
      } else {
        throw new Error(data.message || "Falha no registo.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Falha ao registrar.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ❗️ NENHUMA MUDANÇA AQUI: O SDK não tem um método para o login com Google.
  // Esta implementação continua sendo a correta.
  const loginWithGoogle = () => {
    setLoading(true);
    setError(null);
    const GOOGLE_CLIENT_ID = '960427404700-2a7p5kcgj3dgiabora5hn7rafdc73n7v.apps.googleusercontent.com';
    const REDIRECT_URI = `${window.wpData?.siteUrl}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
    const scope = 'openid profile email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  const logout = () => { /* ...sem alterações... */ };
  const clearError = () => { /* ...sem alterações... */ };

  const value = { user, loading, error, login, logout, register, loginWithGoogle, clearError, setUserFromToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};