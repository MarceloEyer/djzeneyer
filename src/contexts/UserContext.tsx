import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react'; // Added useRef
import { SimpleJwtLogin, RegisterUserInterface, AuthenticateInterface } from 'simple-jwt-login'; // Import the SDK

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData?: { // wpData is optional, as it might not be immediately available
      siteUrl: string;
      restUrl: string; // e.g., https://djzeneyer.com/wp-json/
      nonce: string; // Nonce for WP REST API requests
      jwtAuthKey?: string; // Auth key from plugin settings, if available
      jwtSettings?: { // JWT plugin settings, if available
        allowRegister: boolean;
        requireNonce: boolean;
        endpoint: string;
      };
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
  
  // Use useRef to store the SimpleJwtLogin instance
  const simpleJwtLoginRef = useRef<SimpleJwtLogin | null>(null);

  // Initialize SimpleJwtLogin SDK instance safely within useEffect
  useEffect(() => {
    // Define wpData with robust fallbacks
    const wpData = window.wpData || {
      siteUrl: 'http://localhost:8000',
      restUrl: 'http://localhost:8000/wp-json/',
      nonce: '',
      jwtAuthKey: 'YOUR_AUTH_KEY_FALLBACK', // Ensure a fallback is here
      jwtSettings: {
        allowRegister: true,
        requireNonce: false,
        endpoint: '/simple-jwt-login/v1'
      }
    };

    // Only initialize if wpData is available and the ref hasn't been set yet
    if (wpData.siteUrl && !simpleJwtLoginRef.current) { // Use wpData from the local constant
        // Use the actual wpData if available, otherwise fallback to development defaults
        simpleJwtLoginRef.current = new SimpleJwtLogin(
          wpData.siteUrl, 
          wpData.jwtSettings?.endpoint || '/simple-jwt-login/v1', // Use endpoint from jwtSettings or fallback
          wpData.jwtAuthKey || 'AUTH_KEY' // Use authKey from wpData or fallback
        ); 
        console.log("[UserContext] SimpleJwtLogin SDK initialized.");

        // After SDK is initialized, try to fetch user details if a token is stored
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserData = localStorage.getItem('wp_user_data');
        if (storedToken && storedUserData) {
          try {
            const parsedUser = JSON.parse(storedUserData);
            fetchUserDetails(storedToken, parsedUser.email).catch((err) => {
              console.warn("Stored JWT token or session invalid, clearing user data after init:", err);
              logout(); 
            });
          } catch (e) {
            console.error("Failed to parse stored user data or invalid token after init", e);
            logout(); 
          }
        }
    } else if (!wpData.siteUrl) { // Check siteUrl property instead of window.wpData directly
      // If wpData is not present, set an error to indicate authentication service is not ready
      setError("Authentication service not ready. Please ensure WordPress is running and configured correctly.");
      console.error("[UserContext] wpData is not available. Authentication services will not function.");
    }
  }, []); // Run once on mount to initialize SDK

  // Function to fetch full user details after successful authentication or on page load
  const fetchUserDetails = async (token: string, email: string) => {
    // Ensure SDK is initialized before making requests
    if (!simpleJwtLoginRef.current) {
        throw new Error("Authentication SDK not initialized.");
    }

    try {
      // Use wpData from the local constant, as it's guaranteed to be available here
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


  // --- Authentication Functions with Simple JWT Login SDK ---

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    // Ensure SDK is initialized
    if (!simpleJwtLoginRef.current) {
        setLoading(false);
        setError("Authentication service not ready. Please refresh the page.");
        throw new Error("Authentication SDK not initialized.");
    }

    try {
      const loginParams: AuthenticateInterface = {
        email: emailParam,
        password: passwordParam
      };
      // Use SDK's authenticate method
      const data = await simpleJwtLoginRef.current.authenticate(loginParams); 

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
    // Ensure SDK is initialized
    if (!simpleJwtLoginRef.current) {
        setLoading(false);
        setError("Authentication service not ready. Please refresh the page.");
        return; // Exit if SDK not ready
    }

    try {
      const registerParams: RegisterUserInterface = {
        email: emailParam,
        password: passwordParam,
        user_login: emailParam, // SDK uses user_login for username
        display_name: nameParam,
        first_name: nameParam 
      };
      // *** CORREÇÃO AQUI: Chamar o endpoint /users diretamente via fetch, pois o SDK's registerUser parece usar /users/register ***
      const response = await fetch(`${wpData.restUrl}simple-jwt-login/v1/users`, { // <-- Endpoint CORRIGIDO para /users
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpData.nonce, // Nonce may be required even for public endpoints
        },
        body: JSON.stringify({
            email: emailParam,
            password: passwordParam,
            user_login: emailParam, 
            display_name: nameParam,
            first_name: nameParam 
        }),
        credentials: 'include' 
      });

      const data = await response.json();
      if (response.ok && data.success) { 
        console.log('Registration successful!', data);
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
    window.location.href = wpData.siteUrl; 
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    // Ensure SDK is initialized
    if (!simpleJwtLoginRef.current) {
        setLoading(false);
        setError("Authentication service not ready. Please refresh the page.");
        return; // Exit if SDK not ready
    }
    
    try {
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
