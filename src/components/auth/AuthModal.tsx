// src/components/auth/AuthModal.tsx (VERSÃO COM DEBUG)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register, googleLogin, googleClientId } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.email = t('auth.errors.emailRequired') || 'Email é obrigatório';
    } else if (!emailRegex.test(email)) {
      errors.email = t('auth.errors.emailInvalid') || 'Email inválido';
    }

    if (!password) {
      errors.password = t('auth.errors.passwordRequired') || 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = t('auth.errors.passwordTooShort') || 'Senha deve ter no mínimo 6 caracteres';
    }

    if (mode === 'register' && !username.trim()) {
      errors.username = t('auth.errors.nameRequired') || 'Nome é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username.trim(), email, password);
      }
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ [AuthModal] Erro:', err);
      setError(err.message || t('auth.errors.generic') || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('🔵 [AuthModal] Google Login iniciado');
    
    if (!credentialResponse.credential) {
      console.error('❌ [AuthModal] Sem credencial do Google');
      setError(t('auth.errors.googleNoCredential') || 'Credencial do Google não recebida');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 [AuthModal] Enviando token para backend...');
      await googleLogin(credentialResponse.credential);
      
      console.log('✅ [AuthModal] Login Google bem-sucedido');
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ [AuthModal] Erro no Google Login:', err);
      
      // Erro específico de JSON inválido
      if (err.message.includes('Unexpected token') || err.message.includes('JSON')) {
        setError('Erro de servidor: o backend retornou HTML ao invés de JSON. Verifique se o plugin ZenEyer Auth está ativo.');
      } else {
        setError(err.message || t('auth.errors.googleFailed') || 'Erro ao conectar com Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ [AuthModal] Google OAuth error callback');
    setError(t('auth.errors.googleFailed') || 'Falha ao conectar com Google');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormErrors({});
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white/80 hover:text-white"
            aria-label={t('common.close') || 'Fechar'}
          >
            <X size={24} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">
                {mode === 'login'
                  ? (t('auth.welcomeBack') || 'Bem-vindo de Volta')
                  : (t('auth.createAccount') || 'Criar Conta')}
              </h2>
              <p className="text-white/60">
                {mode === 'login'
                  ? (t('auth.loginSubtitle') || 'Entre na sua conta Zen Tribe')
                  : (t('auth.registerSubtitle') || 'Junte-se à Zen Tribe')}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-3"
              >
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {googleClientId ? (
              <div className="mb-6 flex justify-center">
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    size="large"
                    text={mode === 'login' ? 'signin_with' : 'signup_with'}
                    width="384"
                    logo_alignment="left"
                  />
                </GoogleOAuthProvider>
              </div>
            ) : (
              <div className="mb-6 h-12 bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-xs text-white/40">{t('auth.connectingServer') || 'Conectando...'}</span>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-white/60">
                  {t('auth.orUseEmail') || 'ou use email'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    {t('auth.name') || 'Nome'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (formErrors.username) setFormErrors({ ...formErrors, username: undefined });
                      }}
                      className={`w-full bg-gray-800 text-white border ${
                        formErrors.username ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                      placeholder={t('auth.namePlaceholder') || 'Seu nome'}
                      disabled={loading}
                    />
                  </div>
                  {formErrors.username && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.username}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('auth.email') || 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className={`w-full bg-gray-800 text-white border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                    placeholder={t('auth.emailPlaceholder') || 'seu@email.com'}
                    disabled={loading}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('auth.password') || 'Senha'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                    }}
                    className={`w-full bg-gray-800 text-white border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-gray-900 font-bold py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t('auth.processing') || 'Processando...'}</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login'
                      ? (t('auth.login') || 'Entrar')
                      : (t('auth.register') || 'Criar Conta')}
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                {mode === 'login'
                  ? (t('auth.noAccount') || 'Não tem uma conta?')
                  : (t('auth.hasAccount') || 'Já tem uma conta?')}
                {' '}
                <button
                  onClick={switchMode}
                  disabled={loading}
                  className="text-white font-bold hover:text-gray-300 hover:underline transition-colors disabled:opacity-50"
                >
                  {mode === 'login'
                    ? (t('auth.createAccount') || 'Criar Conta')
                    : (t('auth.login') || 'Entrar')}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;