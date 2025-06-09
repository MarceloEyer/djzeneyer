import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
  role?: string;
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

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUser({ 
          ...parsedUser, 
          isLoggedIn: true, 
          token: storedToken,
          avatar: parsedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name)}&background=0d96ff&color=fff`
        });
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.clear();
      }
    }
  }, []);

  const clearError = () => setError(null);

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailParam, 
          password: passwordParam 
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.data?.jwt) {
        const token = data.data.jwt;
        
        // Get user data with the JWT token
        const userResponse = await fetch(`${window.wpData.restUrl}wp/v2/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-WP-Nonce': window.wpData.nonce
          }
        });
        
        const userData = await userResponse.json();

        if (!userResponse.ok || userData.code) {
          throw new Error(userData.message || "Failed to get user data.");
        }

        const loggedInUser: WordPressUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.display_name || userData.slug,
          isLoggedIn: true,
          token: token,
          avatar: userData.avatar_urls?.['96'] || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.display_name)}&background=0d96ff&color=fff`,
          role: userData.roles?.[0] || 'subscriber'
        };
        
        setUser(loggedInUser);
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('wp_user_data', JSON.stringify({
          id: loggedInUser.id,
          email: loggedInUser.email,
          name: loggedInUser.name,
          avatar: loggedInUser.avatar,
          role: loggedInUser.role
        }));
        
        console.log('Login successful!', loggedInUser);
      } else {
        const errorMessage = data.data?.message || data.message || "Invalid credentials.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Login error:", err);
      const errorMessage = err.message || 'Failed to login. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          email: emailParam,
          password: passwordParam,
          user_login: emailParam,
          display_name: nameParam,
          first_name: nameParam
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Registration successful!', data);
        // Auto-login after successful registration
        await login(emailParam, passwordParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Registration failed.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Registration error:", err);
      const errorMessage = err.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
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
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      window.location.href = `${window.wpData.siteUrl}/wp-login.php?loginSocial=google`;
    } catch (err: any) {
      console.error("[UserContext] Google login error:", err);
      setError(err.message || 'Failed to initiate Google login.');
      throw err;
    } finally {
      setLoading(false);
    }
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