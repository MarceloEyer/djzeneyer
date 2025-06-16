// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage

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
  const { t } = useLanguage(); // Get t function for translations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loginWithGoogle, loading: globalLoading, user } = useUser();
  
  const loading = isSubmitting || globalLoading;

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword(''); // Clear confirm password
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
      setLocalSuccess(t('login_successful')); // Use translated success message
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose, t]);

  const validateForm = () => {
    setLocalError(null);

    if (!email || !email.includes('@')) {
      setLocalError(t('invalid_email'));
      return false;
    }
    if (!password || password.length < 6) {
      setLocalError(t('password_min_length'));
      return false;
    }
    if (mode === 'register') {
      if (!name || name.trim().length < 2) {
        setLocalError(t('name_min_length'));
        return false;
      }
      if (password !== confirmPassword) {
        setLocalError(t('passwords_do_not_match'));
        return false;
      }
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
      } else {
        await register(name.trim(), email, password);
      }
    } catch (err: any) {
      console.error(`[AuthModal] ${mode} error:`, err);
      
      let errorMessage = err.message ? String(err.message) : t('registration_failed');
      
      errorMessage = errorMessage.replace(/<[^>]*>/g, '');
      
      // Mapeamento de erros técnicos para chaves de tradução
      const errorMap: { [key: string]: string } = {
        'Invalid username': t('invalid_credentials_short'),
        'Invalid email': t('invalid_credentials_short'),
        'incorrect_password': t('invalid_credentials_short'),
        'username already exists': t('account_exists'),
        'email already exists': t('account_exists'),
        'weak password': t('weak_password'),
        'too many attempts': t('too_many_attempts'),
        'Could not determine user from JWT': t('auth_failed_try_again'),
        'rest_cookie_invalid_nonce': t('security_check_failed'),
      };

      for (const key in errorMap) {
        if (errorMessage.includes(key)) {
          errorMessage = errorMap[key];
          break;
        }
      }
      
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    window.open(`${window.wpData.siteUrl}/wp-login.php?action=lostpassword`, '_blank');
  };

  const handleGoogleAuthClick = async () => {
    setLocalError(null);
    setLocalSuccess(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("[AuthModal] Error during Google login:", err);
      const cleanErrorMessage = err.message ? String(err.message).replace(/<[^>]*>?/gm, '') : t('failed_to_initiate_google_login');
      setLocalError(cleanErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
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
            {mode === 'login' ? t('welcome_back') : t('join_tribe')}
          </h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-white/10"
            aria-label={t('close_modal_aria')}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {localSuccess && (
            <div className="flex items-center gap-3 p-4 bg-success/20 border border-success/30 rounded-lg text-success">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localSuccess}</span>
            </div>
          )}

          {localError && (
            <div className="flex items-center gap-3 p-4 bg-error/20 border border-error/30 rounded-lg text-error">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localError}</span>
            </div>
          )}
          
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-white/90 mb-2">
                {t('full_name')}
              </label>
              <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('full_name_placeholder')} required autoComplete="name" disabled={loading} />
            </div>
          )}
          
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-white/90 mb-2">
              {t('email_address')}
            </label>
            <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('email_address_placeholder')} required autoComplete="email" disabled={loading} />
          </div>
          
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-white/90 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <input id="auth-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('password_placeholder')} required minLength={6} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80" tabIndex={-1} aria-label={showPassword ? t('hide_password_aria') : t('show_password_aria')} disabled={loading}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-confirm-password" className="block text-sm font-medium text-white/90 mb-2">
                {t('confirm_password')}
              </label>
              <div className="relative">
                <input id="auth-confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder={t('confirm_password_placeholder')} required minLength={6} autoComplete="new-password" disabled={loading} />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button type="button" onClick={handleForgotPassword} className="text-sm text-primary/80 hover:text-primary hover:underline" disabled={loading}>
                {t('forgot_password')}
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (<><Loader2 size={20} className="animate-spin" /><span>{mode === 'login' ? t('signing_in') : t('creating_account')}</span></>) : (<span>{mode === 'login' ? t('sign_in') : t('create_account')}</span>)}
          </button>
          
          <div className="text-center text-sm text-white/70 pt-4 border-t border-white/10">
            {mode === 'login' ? (
              <>{t('no_account')}{' '}<button type="button" onClick={!loading ? onToggleMode : undefined} className="font-semibold text-primary hover:underline" disabled={loading}>{t('join_the_tribe')}</button></>
            ) : (
              <>{t('already_have_account')}{' '}<button type="button" onClick={!loading ? onToggleMode : undefined} className="font-semibold text-primary hover:underline" disabled={loading}>{t('sign_in')}</button></>
            )}
          </div>
        </form>
        
        <div className="px-6 pb-6 pt-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-5">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-4 text-xs text-white/50 uppercase">{t('or_continue_with')}</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={!loading ? handleGoogleAuthClick : undefined} disabled={loading} className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50">
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" disabled className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50">
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