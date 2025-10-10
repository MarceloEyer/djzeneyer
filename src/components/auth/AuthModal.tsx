// src/components/auth/AuthModal.tsx

import React, 'useState', useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import googleAuth from '../../services/googleAuth'; // <-- CORREÇÃO AQUI

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
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
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const { login, register, loading: globalLoading, user, loginWithGoogleToken } = useUser();
  const loading = isSubmitting || globalLoading;

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
      // Foco no primeiro campo relevante
      setTimeout(() => {
        if (mode === 'register') {
          nameInputRef.current?.focus();
        } else {
          emailInputRef.current?.focus();
        }
      }, 10);
    }
  }, [mode, isOpen]);

  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess(t('login_successful', { defaultValue: 'Login realizado com sucesso.' }));
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose, t]);

  // Inicializa o botão do Google (idempotente)
  useEffect(() => {
    if (!isOpen || mode !== 'login') return;
    const el = googleButtonRef.current;
    if (!el) return;
    try {
      googleAuth.initializeGoogleButton(el, async (credential) => {
        await loginWithGoogleToken(credential);
      });
    } catch (e) {
      console.warn('Falha ao inicializar Google Button', e);
    }
  }, [isOpen, mode, loginWithGoogleToken]);

  const validateForm = () => {
    setLocalError(null);
    if (!email || !email.includes('@')) {
      setLocalError(t('invalid_email', { defaultValue: 'Email inválido.' }));
      return false;
    }
    if (!password || password.length < 6) {
      setLocalError(t('password_min_length', { defaultValue: 'A senha deve ter pelo menos 6 caracteres.' }));
      return false;
    }
    if (mode === 'register') {
      if (!name || name.trim().length < 2) {
        setLocalError(t('name_min_length', { defaultValue: 'Nome é obrigatório.' }));
        return false;
      }
      if (password !== confirmPassword) {
        setLocalError(t('passwords_do_not_match', { defaultValue: 'As senhas não coincidem.' }));
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
      let errorMessage = err?.message || t('registration_failed', { defaultValue: 'Ocorreu um erro.' });
      const low = String(errorMessage).toLowerCase();
      if (low.includes('invalid') || low.includes('incorrect')) {
        errorMessage = t('invalid_credentials_short', { defaultValue: 'Credenciais inválidas.' });
      } else if (low.includes('already exists') || low.includes('already_registered') || low.includes('exists')) {
        errorMessage = t('account_exists', { defaultValue: 'Conta já existe.' });
      }
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    const siteUrl = typeof window !== 'undefined' && (window as any).wpData?.siteUrl ? (window as any).wpData.siteUrl : '';
    const target = siteUrl ? `${String(siteUrl).replace(/\/$/, '')}/wp-login.php?action=lostpassword` : '/wp-login.php?action=lostpassword';
    window.open(target, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full border border-white/10" aria-live="polite">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login'
              ? t('welcome_back', { defaultValue: 'Bem-vindo de volta' })
              : t('join_the_tribe', { defaultValue: 'Junte-se à tribo' })}
          </h2>
          <button
            aria-label={t('close', { defaultValue: 'Fechar' })}
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {localSuccess && (
            <div className="p-3 bg-success/20 text-success rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={18} /> {localSuccess}
            </div>
          )}
          {localError && (
            <div className="p-3 bg-error/20 text-error rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {localError}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('full_name', { defaultValue: 'Nome completo' })}
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full input"
                required
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('email_address', { defaultValue: 'Email' })}
            </label>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full input"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('password', { defaultValue: 'Senha' })}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full input pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={
                  showPassword
                    ? t('hide_password', { defaultValue: 'Ocultar senha' })
                    : t('show_password', { defaultValue: 'Mostrar senha' })
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('confirm_password', { defaultValue: 'Confirmar senha' })}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full input"
                required
                disabled={loading}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary/80 hover:text-primary hover:underline"
              >
                {t('forgot_password', { defaultValue: 'Esqueceu a senha?' })}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
            aria-disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : mode === 'login' ? (
              t('sign_in', { defaultValue: 'Entrar' })
            ) : (
              t('create_account', { defaultValue: 'Criar conta' })
            )}
          </button>

          {mode === 'login' && (
            <>
              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-white/60 text-sm">
                  {t('or_continue_with', { defaultValue: 'ou continue com' })}
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <div ref={googleButtonRef} className="w-full flex justify-center" />
            </>
          )}

          <div className="text-center text-sm pt-4 border-t border-white/10">
            {mode === 'login' ? (
              <>
                {t('no_account', { defaultValue: 'Não tem uma conta?' })}{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline"
                >
                  {t('join_the_tribe', { defaultValue: 'Junte-se à tribo' })}
                </button>
              </>
            ) : (
              <>
                {t('already_have_account', { defaultValue: 'Já tem uma conta?' })}{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline"
                >
                  {t('sign_in', { defaultValue: 'Entrar' })}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Exports: both default and named for flexibility
export { AuthModal };
export default AuthModal;