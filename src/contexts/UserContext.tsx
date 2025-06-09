import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { SimpleJwtLogin, RegisterUserInterface, AuthenticateInterface } from 'simple-jwt-login';

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
      // Adicionando propriedades específicas do Simple JWT Login
      jwtAuthKey?: string; // Chave de autenticação do plugin
      jwtSettings?: {
        allowRegister: boolean;
        requireNonce: boolean;
        endpoint: string;
      };
    };
  }
}

// User type definition for WordPress User
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  avatar_urls?: { [size: string]: string };
  avatar?: string;
}

interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; 
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuração com fallback mais robusto
  const wpData = window.wpData || {
    siteUrl: 'http://localhost:8000',
    restUrl: 'http://localhost:8000/wp-json/',
    nonce: '',
    jwtAuthKey: 'your-jwt-auth-key', // Você precisa configurar isso no plugin
    jwtSettings: {
      allowRegister: true,
      requireNonce: false,
      endpoint: '/simple-jwt-login/v1'
    }
  };

  // Initialize SimpleJwtLogin SDK - Configuração corrigida
  const simpleJwtLogin = new SimpleJwtLogin(
    wpData.siteUrl,
    wpData.jwtSettings?.endpoint || '/simple-jwt-login/v1',
    wpData.jwtAuthKey || 'AUTH_KEY'
  );

  // Função para validar token JWT
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ JWT: token })
      });
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Function to fetch full user details after successful authentication
  const fetchUserDetails = async (token: string, email: string) => {
    try {
      console.log('Fetching user details with token:', token.substring(0, 20) + '...');
      
      // Primeiro tenta validar o token
      const isValidToken = await validateToken(token);
      console.log('Token validation result:', isValidToken);
      
      if (!isValidToken) {
        console.warn('Token validation failed, but proceeding with user creation...');
      }

      // Cria um usuário básico com os dados que temos
      // Já que o Simple JWT Login não tem um endpoint específico para buscar dados do usuário
      const basicUser: WordPressUser = {
        id: Date.now(), // ID temporário
        email: email,
        name: email.split('@')[0], // Nome baseado no email
        isLoggedIn: true,
        token: token,
        roles: ['subscriber'],
        avatar_urls: {},
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=0d96ff&color=fff`
      };

      console.log('Created basic user:', basicUser);
      
      setUser(basicUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify({
        id: basicUser.id,
        email: basicUser.email,
        name: basicUser.name,
        roles: basicUser.roles,
        avatar_urls: basicUser.avatar_urls,
        avatar: basicUser.avatar
      }));
      
      console.log('User login successful!', basicUser);
      return basicUser;

    } catch (err: any) {
      console.error("[UserContext] Error in fetchUserDetails:", err);
      throw err;
    }
  };

  // Load user from localStorage on initial load and validate session
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        console.log('Loading stored user:', parsedUser);
        
        // Valida o token armazenado
        validateToken(storedToken).then(isValid => {
          console.log('Stored token validation:', isValid);
          if (isValid) {
            setUser({
              ...parsedUser,
              isLoggedIn: true,
              token: storedToken
            });
          } else {
            console.warn('Stored token invalid, logging out');
            logout();
          }
        }).catch((err) => {
          console.warn('Token validation error:', err);
          logout();
        });
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        logout();
      }
    }
  }, []);

  // Login function with improved error handling
  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login for:', emailParam);
      
      // Chamada direta para a API do Simple JWT Login
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailParam,
          password: passwordParam
        })
      });
      
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success && data.data?.jwt) {
        const token = data.data.jwt;
        console.log('JWT token received:', token.substring(0, 20) + '...');
        await fetchUserDetails(token, emailParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Credenciais inválidas.";
        console.error('Login failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Login error:", err);
      const cleanErrorMessage = err.message 
        ? err.message.replace(/<[^>]*>?/gm, '') 
        : 'Falha no login. Verifique suas credenciais.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function with improved error handling
  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration for:', emailParam);
      
      // Chamada direta para a API do Simple JWT Login usando /register
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailParam,
          password: passwordParam,
          user_login: emailParam,
          display_name: nameParam,
          first_name: nameParam.split(' ')[0] || nameParam,
          last_name: nameParam.split(' ').slice(1).join(' ') || ''
        })
      });
      
      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response data:', data);

      if (data.success) {
        console.log('Registration successful!', data);
        // Aguarda um pouco antes de tentar fazer login
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Tenta fazer login automaticamente após o registro
        await login(emailParam, passwordParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Falha no cadastro.";
        console.error('Registration failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Registration error:", err);
      const cleanErrorMessage = err.message 
        ? err.message.replace(/<[^>]*>?/gm, '') 
        : 'Falha ao criar conta. Tente novamente.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('User logged out.');
    
    // Opcional: Invalidar o token no servidor
    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetch(`${wpData.restUrl}simple-jwt-login/v1/auth/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ JWT: token })
      }).catch(err => console.warn('Failed to revoke token:', err));
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Redireciona para o login social do plugin
      const googleLoginUrl = `${wpData.siteUrl}/wp-login.php?loginSocial=google&redirect_to=${encodeURIComponent(window.location.href)}`;
      window.location.href = googleLoginUrl;
    } catch (err: any) {
      console.error("[UserContext] Google login error:", err);
      const cleanErrorMessage = err.message 
        ? err.message.replace(/<[^>]*>?/gm, '') 
        : 'Falha ao iniciar login com Google.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
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