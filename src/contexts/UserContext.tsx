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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      // Primeiro tenta validar o token
      const isValidToken = await validateToken(token);
      if (!isValidToken) {
        throw new Error('Invalid or expired token');
      }

      // Busca dados do usuário usando o endpoint do WordPress
      const userResponse = await fetch(`${wpData.restUrl}wp/v2/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        // Se falhar, tenta buscar usando email como fallback
        const usersResponse = await fetch(`${wpData.restUrl}wp/v2/users?search=${encodeURIComponent(email)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const usersData = await usersResponse.json();
        if (!usersData || usersData.length === 0) {
          throw new Error('User not found');
        }
        
        const userData = usersData[0];
        return this.processUserData(userData, token);
      }

      const userData = await userResponse.json();
      return this.processUserData(userData, token);

    } catch (err: any) {
      console.error("[UserContext] Error fetching user details:", err);
      throw err;
    }
  };

  // Função auxiliar para processar dados do usuário
  const processUserData = (userData: any, token: string) => {
    const defaultUiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.display_name || userData.slug || 'User')}&background=0d96ff&color=fff`;
    const finalAvatar = userData.avatar_urls?.['96'] || defaultUiAvatar;

    const loggedInUser: WordPressUser = {
      id: userData.id,
      email: userData.email || userData.user_email,
      name: userData.name || userData.display_name || userData.user_nicename || 'User',
      isLoggedIn: true,
      token: token,
      roles: userData.roles || [],
      avatar_urls: userData.avatar_urls || {},
      avatar: finalAvatar
    };

    setUser(loggedInUser);
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('wp_user_data', JSON.stringify({
      id: loggedInUser.id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      roles: loggedInUser.roles,
      avatar_urls: loggedInUser.avatar_urls,
      avatar: loggedInUser.avatar
    }));
    
    console.log('Login successful and user details fetched!', loggedInUser);
    return loggedInUser;
  };

  // Load user from localStorage on initial load and validate session
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        validateToken(storedToken).then(isValid => {
          if (isValid) {
            setUser({
              ...parsedUser,
              isLoggedIn: true,
              token: storedToken
            });
          } else {
            logout();
          }
        }).catch(() => {
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
      // Método 1: Usar o SDK
      const loginParams: AuthenticateInterface = {
        email: emailParam,
        password: passwordParam
      };
      
      let data;
      try {
        data = await simpleJwtLogin.authenticate(loginParams);
      } catch (sdkError) {
        console.warn('SDK authentication failed, trying direct API call:', sdkError);
        
        // Método 2: Chamada direta para a API (fallback)
        const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(wpData.nonce && { 'X-WP-Nonce': wpData.nonce })
          },
          body: JSON.stringify({
            email: emailParam,
            password: passwordParam
          })
        });
        
        data = await response.json();
      }

      if (data.success && data.data?.jwt) {
        const token = data.data.jwt;
        await fetchUserDetails(token, emailParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Credenciais inválidas.";
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
      // Método 1: Usar o SDK
      const registerParams: RegisterUserInterface = {
        email: emailParam,
        password: passwordParam,
        user_login: emailParam,
        display_name: nameParam,
        first_name: nameParam.split(' ')[0] || nameParam,
        last_name: nameParam.split(' ').slice(1).join(' ') || ''
      };
      
      let data;
      try {
        data = await simpleJwtLogin.registerUser(registerParams);
      } catch (sdkError) {
        console.warn('SDK registration failed, trying direct API call:', sdkError);
        
        // Método 2: Chamada direta para a API (fallback)
        const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(wpData.nonce && { 'X-WP-Nonce': wpData.nonce })
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
        
        data = await response.json();
      }

      if (data.success) {
        console.log('Registration successful!', data);
        // Tenta fazer login automaticamente após o registro
        await login(emailParam, passwordParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Falha no cadastro.";
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