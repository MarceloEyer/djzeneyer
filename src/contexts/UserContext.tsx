import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { SimpleJwtLogin, RegisterUserInterface, AuthenticateInterface } from 'simple-jwt-login'; // Import the SDK

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string; // e.g., https://djzeneyer.com/wp-json/
      nonce: string; // Nonce for WP REST API requests
    };
  }
}

// User type definition for WordPress User, updated to match WP API response
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string; // JWT token for API authentication
  roles?: string[]; // WordPress user roles (array of strings)
  avatar_urls?: { [size: string]: string }; // WordPress avatar URLs (object with sizes like '24', '48', '96')
  avatar?: string; // Simplified avatar URL for display (can be ui-avatars or WP avatar)
}

interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; 
  loginWithGoogle: () => Promise<void>;
  clearError: () => void; // Added by user, good for clearing errors
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safely access wpData with fallback for development environment
  const wpData = window.wpData || {
    siteUrl: 'http://localhost:8000',
    restUrl: 'http://localhost:8000/wp-json/',
    nonce: ''
  };

  // Initialize SimpleJwtLogin SDK instance
  // The SDK will handle API_BASE_URL (wpData.restUrl) internally
  const simpleJwtLogin = new SimpleJwtLogin(wpData.siteUrl, '/simple-jwt-login/v1', 'AUTH_KEY'); 
  // 'AUTH_KEY' is passed as a placeholder for authCodeKey, but it's often not needed 
  // if you're not using auth codes in the URL. Your current setup doesn't use it.

  // Function to fetch full user details after successful authentication or on page load
  const fetchUserDetails = async (token: string, email: string) => {
    try {
      // Use the SDK's validateToken method to get user info if needed,
      // or directly fetch from /wp/v2/users/me with the token.
      // We will stick to fetching /wp/v2/users/me as it gives more comprehensive data.
      const userResponse = await fetch(`${wpData.restUrl}wp/v2/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Authenticate with JWT
            'X-WP-Nonce': wpData.nonce // Nonce can be useful even with JWT
        },
        credentials: 'include' // CRITICAL: This sends session cookies which are needed for /users/me
      });
      const userData = await userResponse.json();

      if (!userResponse.ok || userData.code) { 
          throw new Error(userData.message || "Failed to retrieve logged-in user data from /wp/v2/users/me.");
      }

      // Determine the best avatar URL to use
      const defaultUiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.slug || 'User')}&background=0d96ff&color=fff`;
      const finalAvatar = userData.avatar_urls?.['96'] || defaultUiAvatar;

      const loggedInUser: WordPressUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.display_name || userData.slug || 'User', // Robust name fallback
        isLoggedIn: true,
        token: token,
        roles: userData.roles || [], // User roles array
        avatar_urls: userData.avatar_urls || {}, // Store all avatar URLs if available
        avatar: finalAvatar // Simplified avatar URL for direct use
      };
      setUser(loggedInUser);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('wp_user_data', JSON.stringify({
          id: loggedInUser.id,
          email: loggedInUser.email,
          name: loggedInUser.name,
          roles: loggedInUser.roles,
          avatar_urls: loggedInUser.avatar_urls, // Store full avatar_urls object
          avatar: loggedInUser.avatar // Store simplified avatar
      }));
      console.log('Login successful and user details fetched!', loggedInUser);
    } catch (err: any) {
      console.error("[UserContext] Error fetching user details:", err);
      // Clean up error message for display
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Failed to get user details after login.';
      setError(cleanErrorMessage);
      throw err; // Re-throw to propagate error
    }
  };


  // Load user from localStorage on initial load and validate session
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        // Attempt to fetch fresh user details with existing token
        // This validates the token and session on page load
        fetchUserDetails(storedToken, parsedUser.email).catch((err) => {
          console.warn("Stored JWT token or session invalid, clearing user data:", err);
          logout(); // Log out if token/session is invalid
        });
      } catch (e) {
        console.error("Failed to parse stored user data or invalid token", e);
        logout(); // Clear invalid data
      }
    }
  }, []); // Empty dependency array to run only once on mount

  // --- Authentication Functions with Simple JWT Login SDK ---

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const loginParams: AuthenticateInterface = {
        email: emailParam,
        password: passwordParam
      };
      // Use SDK's authenticate method
      const data = await simpleJwtLogin.authenticate(loginParams); 

      if (data.success && data.data?.jwt) {
        const token = data.data.jwt;
        await fetchUserDetails(token, emailParam); // Fetch full user details with the new token
        // AuthModal's useEffect watching 'user' state will handle modal closing
      } else {
        const errorMessage = data.data?.message || data.message || "Invalid credentials.";
        setError(errorMessage);
        throw new Error(errorMessage); // Re-throw to be caught by AuthModal
      }
    } catch (err: any) {
      console.error("[UserContext] Login error:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Failed to log in. Please check your credentials.';
      setError(cleanErrorMessage);
      throw err; // Re-throw to propagate error
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const registerParams: RegisterUserInterface = {
        email: emailParam,
        password: passwordParam,
        user_login: emailParam, // SDK uses user_login for username
        display_name: nameParam,
        first_name: nameParam 
      };
      // Use SDK's registerUser method
      const data = await simpleJwtLogin.registerUser(registerParams); 

      if (data.success) { 
        console.log('Registration successful!', data);
        // If "Initialize force login after register" is active in the plugin,
        // the user will be logged in automatically by WP. UserContext's useEffect will catch this.
        // If not, we might try login(emailParam, passwordParam) here manually.
        await login(emailParam, passwordParam); // Attempt to log in user automatically after successful registration
      } else {
        const errorMessage = data.data?.message || data.message || "Registration failed.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Registration error:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Failed to create account. Please try again.';
      setError(cleanErrorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null); // Clear any lingering errors on logout
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('User logged out.');
    // Optional: Redirect to home or login page after logout
    window.location.href = wpData.siteUrl; 
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Redirects user to the WP login page where the Google button from Simple JWT Login is available.
      // The plugin handles the OAuth flow and user creation/authentication in WordPress.
      // UserContext detects the login via its initial useEffect logic.
      window.location.href = `${wpData.siteUrl}/wp-login.php?loginSocial=google`; 
    } catch (err: any) {
      console.error("[UserContext] Google login error:", err);
      const cleanErrorMessage = err.message ? err.message.replace(/<[^>]*>?/gm, '') : 'Failed to initiate Google login.';
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
    clearError, // Make clearError available in context
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