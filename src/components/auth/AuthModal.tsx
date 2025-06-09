import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loading, user } = useUser();

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setLocalError(null);
      setLocalSuccess(null);
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [mode, isOpen]);

  // Close modal when user successfully logs in
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess('Successfully logged in! Welcome to the Zen Tribe.');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [user, isOpen, onClose]);

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
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
    setLocalSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setLocalSuccess('Login successful! Welcome back to the Zen Tribe.');
      } else {
        await register(name.trim(), email, password);
        setLocalSuccess('Account created successfully! Welcome to the Zen Tribe.');
      }
    } catch (err: any) {
      console.error(`[AuthModal] ${mode} error:`, err);
      
      // Clean up error messages from WordPress/API
      let errorMessage = err.message || 'An unexpected error occurred.';
      
      // Remove HTML tags if present
      errorMessage = errorMessage.replace(/<[^>]*>/g, '');
      
      // Handle common WordPress error messages
      if (errorMessage.includes('Invalid username') || errorMessage.includes('Invalid email')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (errorMessage.includes('username already exists') || errorMessage.includes('email already exists')) {
        errorMessage = 'An account with this email already exists. Try logging in instead.';
      } else if (errorMessage.includes('weak password')) {
        errorMessage = 'Please choose a stronger password with at least 6 characters.';
      }
      
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    window.open(`${window.wpData.siteUrl}/wp-login.php?action=lostpassword`, '_blank');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={!isSubmitting ? onClose : undefined}
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
            onClick={!isSubmitting ? onClose : undefined}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
            disabled={isSubmitting}
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
                placeholder="Enter your full name"
                required
                autoComplete="name"
                disabled={isSubmitting}
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
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={isSubmitting}
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
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                disabled={isSubmitting}
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {isSubmitting || loading ? (
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
                  onClick={!isSubmitting ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Join the Tribe
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={!isSubmitting ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;