// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2 for spinners
import { useUser } from '../../contexts/UserContext'; // Adjust path if necessary

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void; // Used to toggle between login/register modes
}

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string; // e.g., https://djzeneyer.com/wp-json/
      nonce: string; // Nonce for WP REST API requests
    };
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  console.log(`[AuthModal] Rendering/Updated. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null); // For success feedback
  const [isSubmitting, setIsSubmitting] = useState(false); // Local state for form submission loading

  // Using 'loading' from UserContext for global auth loading state
  // Added loginWithGoogle from UserContext
  const { login, register, loginWithGoogle, loading: globalLoading, user } = useUser();
  
  // Use a combined loading state: local form submission OR global UserContext loading
  const loading = isSubmitting || globalLoading;

  // Clear fields, error, and success messages when mode changes or modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setLocalError(null);
      setLocalSuccess(null); // Clear success message too
      setShowPassword(false);
      setIsSubmitting(false); // Reset local submission state
    }
  }, [mode, isOpen]);

  // Close modal when user successfully logs in
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess('Successfully logged in! Welcome to the Zen Tribe.');
      const timer = setTimeout(() => {
        onClose();
      }, 1500); // Show success message for 1.5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [user, isOpen, onClose]);

  const validateForm = () => {
    // Clear previous errors before validating
    setLocalError(null); 

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) { // Min length aligned with typical WP strength (6 chars)
      setLocalError('Password must be at least 6 characters long.');
      return false;
    }
    if (mode === 'register' && (!name || name.trim().length < 2)) {
      setLocalError('Please enter your full name (at least 2 characters).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null); // Clear previous success message

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true); // Start local submission loading

    try {
      if (mode === 'login') {
        await login(email, password);
        // Success message handled by useEffect watching 'user'
      } else { // Register mode attempts API call via UserContext
        await register(name.trim(), email, password); // Trim whitespace from name
        // Success message handled by useEffect watching 'user'
      }
    } catch (err: any) {
      console.error(`[AuthModal] ${mode} error:`, err);
      
      // Clean up error messages from WordPress/API
      let errorMessage = err.message ? String(err.message) : 'An unexpected error occurred.'; // Ensure it's a string
      
      // Remove HTML tags if present (e.g., from WP_Error messages)
      errorMessage = errorMessage.replace(/<[^>]*>/g, '');
      
      // Handle common WordPress error messages for user-friendly display
      if (errorMessage.includes('Invalid username') || errorMessage.includes('Invalid email')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (errorMessage.includes('username already exists') || errorMessage.includes('email already exists')) {
        errorMessage = 'An account with this email already exists. Try logging in instead.';
      } else if (errorMessage.includes('weak password')) {
        errorMessage = 'Please choose a stronger password with at least 6 characters.';
      } else if (errorMessage.includes('too many attempts')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (errorMessage.includes('Could not determine user from JWT')) {
        errorMessage = 'Authentication failed. Please try logging in again.';
      } else if (errorMessage.includes('rest_cookie_invalid_nonce')) {
        errorMessage = 'Security check failed. Please refresh the page and try again.';
      }
      
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false); // End local submission loading
    }
  };

  const handleForgotPassword = () => {
    window.open(`${window.wpData.siteUrl}/wp-login.php?action=lostpassword`, '_blank'); // Open in new tab
  };

  // This function just toggles the mode (login/register)
  const handleRegisterModeToggle = () => {
    onToggleMode(); 
  };

  const handleGoogleAuthClick = async () => {
    setLocalError(null); // Clear errors
    setLocalSuccess(null); // Clear success message
    setIsSubmitting(true); // Start local loading for Google login

    try {
      await loginWithGoogle(); 
      // UserContext handles the redirection or social login logic.
      // Success will be caught by useEffect watching 'user'.
    } catch (err: any) {
      console.error("[AuthModal] Error during Google login:", err);
      const cleanErrorMessage = err.message ? String(err.message).replace(/<[^>]*>?/gm, '') : 'Failed to log in with Google.';
      setLocalError(cleanErrorMessage);
    } finally {
      setIsSubmitting(false); // End local loading
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={!loading ? onClose : undefined} // Allow close if not globally loading
        aria-hidden="true"
      />
      
      <div
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-white/10 transform transition-all duration-300 scale-100"
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold text-white">
            {mode === 'login' ? 'Welcome Back to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={!loading ? onClose : undefined} // Allow close if not globally loading
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
            disabled={loading} // Disable close button if any loading is happening
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success Message */}
          {localSuccess && (
            <div className="flex items-center gap-3 p-4 bg-success/20 border border-success/30 rounded-lg text-success">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localSuccess}</span>
            </div>
          )}

          {/* Error Message */}
          {localError && (
            <div className="flex items-center gap-3 p-4 bg-error/20 border border-error/30 rounded-lg text-error">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localError}</span>
            </div>
          )}
          
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-white/90 mb-2">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
                placeholder="Your full name"
                required
                autoComplete="name"
                disabled={loading} // Disabled if any loading is happening
              />
            </div>
          )}
          
          {/* Email Field */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-white/90 mb-2">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
              placeholder="Your email"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
                placeholder="Your password"
                required
                minLength={6} // Minimum length of 6 characters
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                tabIndex={-1} // Prevents tabbing to this button
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-xs text-white/60 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Forgot Password Link (Login only) */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none transition-colors"
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable if any loading is happening
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? ( // Use the combined 'loading' state for spinner and text
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
          
          {/* Mode Toggle */}
          <div className="text-center text-sm text-white/70 pt-4 border-t border-white/10">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined} // Only allow toggle if not loading
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Join the Tribe
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined} // Only allow toggle if not loading
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </form>
        
        {/* "or continue with" block and social buttons */}
        <div className="px-6 pb-6 pt-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-5">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-4 text-xs text-white/50 uppercase">or continue with</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={!loading ? handleGoogleAuthClick : undefined} // Only allow click if not loading
              disabled={loading} // Disable if loading
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Google"
            >
              {/* Google SVG */}
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            {/* Facebook Button - Placeholder */}
            <button
              type="button"
              onClick={() => alert("Login with Facebook not yet implemented.")} 
              disabled={true || loading}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Facebook"
            >
              {/* Facebook SVG */}
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#1877F2"/><path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.9219C17.3438 4.9219 15.9703 4.6875 14.6578 4.6875C11.9156 4.6875 10.125 6.3516 10.125 9.3516V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875 23.8547V15.4688H16.6711Z" fill="white"/></svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;