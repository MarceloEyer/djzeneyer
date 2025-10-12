// src/components/auth/AuthModal.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { t } = useTranslation();
  const { login, register, error: contextError, loading, clearError, loginWithGoogleToken } = useUser();
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  console.log('[AuthModal] Mode:', mode, 'IsOpen:', isOpen);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLocalError(null);
      setLocalSuccess(null);
      clearError();
    }
  }, [isOpen, clearError]);

  const validateForm = (): boolean => {
    setLocalError(null);

    if (!email || !password) {
      setLocalError(t('auth.errors.fillAllFields'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError(t('auth.errors.invalidEmail'));
      return false;
    }

    if (mode === 'register') {
      if (!name) {
        setLocalError(t('auth.errors.nameRequired'));
        return false;
      }

      if (password.length < 8) {
        setLocalError(t('auth.errors.passwordTooShort'));
        return false;
      }

      if (password !== confirmPassword) {
        setLocalError(t('auth.errors.passwordMismatch'));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[AuthModal] 📝 Form submitted - Mode:', mode);
    console.log('[AuthModal] Form data:', {
      name,
      email,
      password: password ? '***' : 'empty',
      confirmPassword: confirmPassword ? '***' : 'empty'
    });
    
    if (!validateForm()) {
      console.log('[AuthModal] ❌ Validation failed');
      return;
    }
    
    setIsSubmitting(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      if (mode === 'login') {
        console.log('[AuthModal] 🔐 Calling login...');
        await login(email, password);
        console.log('[AuthModal] ✅ Login successful');
        setLocalSuccess(t('auth.success.loginSuccess'));
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        console.log('[AuthModal] 📝 Calling register...');
        console.log('[AuthModal] Data:', { 
          name: name.trim(), 
          email, 
          passwordLength: password.length 
        });
        await register(name.trim(), email, password);
        console.log('[AuthModal] ✅ Registration successful');
        setLocalSuccess(t('auth.success.registerSuccess'));
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('[AuthModal] ❌ Error:', err);
      const errorMsg = err?.message || (mode === 'login' ? t('auth.errors.loginFailed') : t('auth.errors.registerFailed'));
      setLocalError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    console.log('[AuthModal] 🔵 Google login initiated');
    setIsSubmitting(true);
    setLocalError(null);
    
    try {
      await loginWithGoogleToken(credential);
      console.log('[AuthModal] ✅ Google login successful');
      setLocalSuccess(t('auth.success.googleSuccess'));
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('[AuthModal] ❌ Google login error:', err);
      setLocalError(err?.message || t('auth.errors.googleFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || contextError;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 text-center border-b border-white/10">
            <h2 className="text-3xl font-black font-display">
              {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
            </h2>
            <p className="text-white/70 mt-2">
              {mode === 'login' ? t('auth.login.subtitle') : t('auth.register.subtitle')}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Error Message */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-error/10 border border-error/50 rounded-lg flex items-start gap-3"
              >
                <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{displayError}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {localSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-success/10 border border-success/50 rounded-lg flex items-start gap-3"
              >
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-success">{localSuccess}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (Register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('auth.register.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('auth.register.fullNamePlaceholder')}
                      className="input pl-12"
                      disabled={isSubmitting || loading}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('auth.login.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.login.emailPlaceholder')}
                    className="input pl-12"
                    disabled={isSubmitting || loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('auth.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    className="input pl-12 pr-12"
                    disabled={isSubmitting || loading}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('auth.register.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.register.confirmPasswordPlaceholder')}
                      className="input pl-12 pr-12"
                      disabled={isSubmitting || loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>{t('auth.loading')}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? t('auth.login.button') : t('auth.register.button')}</span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-sm">
              <span className="text-white/60">
                {mode === 'login' ? t('auth.login.noAccount') : t('auth.register.hasAccount')}
              </span>
              {' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setLocalError(null);
                  setLocalSuccess(null);
                  clearError();
                }}
                className="text-primary font-semibold hover:underline"
              >
                {mode === 'login' ? t('auth.login.createAccount') : t('auth.register.loginHere')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
