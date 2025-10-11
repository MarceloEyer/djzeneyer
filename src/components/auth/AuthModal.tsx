// src/components/auth/AuthModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // <-- ADICIONAR IMPORT
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { initializeGoogleButton } from '../../services/googleAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // <-- ADICIONAR HOOK
  
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

  // Reseta form quando modal abre
  useEffect(() => {
    if (isOpen) {
      console.log('[AuthModal] 🚪 Modal aberto - Mode:', mode);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setLocalError(null);
      setLocalSuccess(null);
      setShowPassword(false);
      setIsSubmitting(false);
      
      setTimeout(() => {
        if (mode === 'register') {
          nameInputRef.current?.focus();
        } else {
          emailInputRef.current?.focus();
        }
      }, 10);
    }
  }, [mode, isOpen]);

  // FIX: Redireciona para dashboard após login bem-sucedido
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      console.log('[AuthModal] ✅ Usuário logado detectado!');
      console.log('[AuthModal] User data:', user);
      
      setLocalSuccess(t('login_successful', { defaultValue: 'Login realizado com sucesso.' }));
      
      const timer = setTimeout(() => {
        console.log('[AuthModal] 🚀 Redirecionando para /dashboard');
        onClose(); // Fecha modal
        navigate('/dashboard'); // <-- ADICIONAR NAVEGAÇÃO
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose, navigate, t]); // <-- ADICIONAR navigate nas dependências

  // Inicializa botão do Google
  useEffect(() => {
    if (!isOpen || mode !== 'login') return;
    
    const el = googleButtonRef.current;
    if (!el) return;
    
    console.log('[AuthModal] 🔵 Inicializando Google Button');
    
    try {
      initializeGoogleButton(el, async (credential) => {
        console.log('[AuthModal] 🔐 Google credential recebido');
        await loginWithGoogleToken(credential);
      });
    } catch (e) {
      console.warn('[AuthModal] ⚠️ Falha ao inicializar Google Button', e);
    }
  }, [isOpen, mode, loginWithGoogleToken]);

  // Validação do formulário
  const validateForm = () => {
    setLocalError(null);
    
    console.log('[AuthModal] 🔍 Validando formulário:', { mode, email, hasPassword: !!password });
    
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

  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[AuthModal] 📝 Form submitted - Mode:', mode);
    
    if (!validateForm()) {
      console.log('[AuthModal] ❌ Validação falhou');
      return;
    }
    
    setIsSubmitting(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      if (mode === 'login') {
        console.log('[AuthModal] 🔐 Tentando login...');
        await login(email, password);
        console.log('[AuthModal] ✅ Login executado');
      } else {
        console.log('[AuthModal] 📝 Tentando registro...');
        await register(name.trim(), email, password);
        console.log('[AuthModal] ✅ Registro executado');
      }
    } catch (err: any) {
      console.error('[AuthModal] ❌ Erro:', err);
      
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

  // Esqueceu senha
  const handleForgotPassword = () => {
    console.log('[AuthModal] 🔑 Redirecionando para recuperação de senha');
    const siteUrl = typeof window !== 'undefined' && (window as any).wpData?.siteUrl 
      ? (window as any).wpData.siteUrl 
      : '';
    const target = siteUrl 
      ? `${String(siteUrl).replace(/\/$/, '')}/wp-login.php?action=lostpassword` 
      : '/wp-login.php?action=lostpassword';
    window.open(target, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={!loading ? onClose : undefined} 
      />
      
      {/* Modal */}
      <div 
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full border border-white/10" 
        aria-live="polite"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold font-display">
            {mode === 'login' ? t('welcome_back') : t('create_account')}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Success message */}
          {localSuccess && (
            <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/50 rounded-lg">
              <CheckCircle className="text-success" size={20} />
              <span className="text-success">{localSuccess}</span>
            </div>
          )}

          {/* Error message */}
          {localError && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-400">{localError}</span>
            </div>
          )}

          {/* Name field (register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                {t('full_name')}
              </label>
              <input
                ref={nameInputRef}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              {t('email_address')}
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors pr-12"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm password (register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                {t('confirm_password')}
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Forgot password (login only) */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
                disabled={loading}
              >
                {t('forgot_password')}
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{mode === 'login' ? 'Entrando...' : 'Cadastrando...'}</span>
              </>
            ) : (
              <span>{mode === 'login' ? t('sign_in') : t('create_account')}</span>
            )}
          </button>

          {/* Divider */}
          {mode === 'login' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-white/60">
                    {t('or_continue_with')}
                  </span>
                </div>
              </div>

              {/* Google button */}
              <div ref={googleButtonRef} className="flex justify-center" />
            </>
          )}

          {/* Toggle mode */}
          <div className="text-center text-sm text-white/60 pt-4">
            {mode === 'login' ? (
              <p>
                {t('no_account')}{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-primary hover:underline font-semibold"
                  disabled={loading}
                >
                  {t('create_account')}
                </button>
              </p>
            ) : (
              <p>
                {t('already_have_account')}{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-primary hover:underline font-semibold"
                  disabled={loading}
                >
                  {t('sign_in')}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
