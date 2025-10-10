// src/components/auth/AuthModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { googleAuth } from '../../services/googleAuth';

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
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const { login, register, loading: globalLoading, user } = useUser();
  const loading = isSubmitting || globalLoading;

  console.log('[AuthModal] Renderizado. Mode:', mode, 'IsOpen:', isOpen);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setLocalError(null);
      setLocalSuccess(null);
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [mode, isOpen]);

  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess(t('login_successful'));
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
        setLocalError(t('name_min_length', 'Nome é obrigatório.'));
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLocalError(null);
    setLocalSuccess(null);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name.trim(), email, password);
      }
    } catch (err: any) {
      console.error(`[AuthModal] ${mode} error:`, err);
      let errorMessage = err.message ? String(err.message).replace(/<[^>]*>/g, '') : t('registration_failed', 'Ocorreu um erro.');
      
      if (errorMessage.includes('Invalid') || errorMessage.includes('incorrect')) {
        errorMessage = t('invalid_credentials_short');
      } else if (errorMessage.includes('already exists')) {
        errorMessage = t('account_exists');
      }
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    window.open(`${window.wpData.siteUrl}/wp-login.php?action=lostpassword`, '_blank');
  };

  // Inicializa botão Google quando modal abre
  useEffect(() => {
    if (isOpen && googleButtonRef.current && mode === 'login') {
      console.log('[AuthModal] Inicializando botão Google Sign-In');
      googleAuth.initializeGoogleButton(googleButtonRef.current);
    }
  }, [isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
        <div className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{mode === 'login' ? t('welcome_back') : t('join_the_tribe')}</h2>
                <button onClick={!loading ? onClose : undefined} disabled={loading} className="p-1 rounded-full hover:bg-white/10"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {localSuccess && <div className="p-3 bg-success/20 text-success rounded-lg text-sm flex items-center gap-2"><CheckCircle size={18}/> {localSuccess}</div>}
                {localError && <div className="p-3 bg-error/20 text-error rounded-lg text-sm flex items-center gap-2"><AlertCircle size={18}/> {localError}</div>}
                
                {mode === 'register' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('full_name')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full input" required disabled={loading} />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium mb-2">{t('email_address')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full input" required disabled={loading} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">{t('password')}</label>
                    <div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full input pr-10" required disabled={loading} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
                </div>
                {mode === 'register' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('confirm_password')}</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full input" required disabled={loading} />
                    </div>
                )}
                {mode === 'login' && <div className="text-right"><button type="button" onClick={handleForgotPassword} className="text-sm text-primary/80 hover:text-primary hover:underline">{t('forgot_password')}</button></div>}

                <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : (mode === 'login' ? t('sign_in') : t('create_account'))}
                </button>

                {mode === 'login' && (
                    <>
                        <div className="relative flex items-center py-3">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink mx-4 text-white/60 text-sm">{t('or_continue_with')}</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>
                        <div ref={googleButtonRef} className="w-full flex justify-center"></div>
                    </>
                )}

                <div className="text-center text-sm pt-4 border-t border-white/10">
                    {mode === 'login' ? (
                        <>{t('no_account')} <button type="button" onClick={!loading ? onToggleMode : undefined} className="font-semibold text-primary hover:underline">{t('join_the_tribe')}</button></>
                    ) : (
                        <>{t('already_have_account')} <button type="button" onClick={!loading ? onToggleMode : undefined} className="font-semibold text-primary hover:underline">{t('sign_in')}</button></>
                    )}
                </div>
            </form>
        </div>
    </div>
  );
};

export default AuthModal;