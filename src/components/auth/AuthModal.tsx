// src/components/auth/AuthModal.tsx - VERSÃO ESTILIZADA
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
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
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (mode === 'register' && !username.trim()) {
      errors.username = 'Nome é obrigatório';
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
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('🔵 [AuthModal] Google Login iniciado');
    
    if (!credentialResponse.credential) {
      console.error('❌ [AuthModal] Sem credencial do Google');
      setError('Credencial do Google não recebida');
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
      
      if (err.message.includes('Unexpected token') || err.message.includes('JSON')) {
        setError('Erro de servidor: o backend retornou HTML ao invés de JSON. Verifique se o plugin ZenEyer Auth está ativo.');
      } else {
        setError(err.message || 'Erro ao conectar com Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ [AuthModal] Google OAuth error callback');
    setError('Falha ao conectar com Google');
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
        {/* Backdrop com blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background/20 rounded-3xl blur-xl" />
          
          {/* Main Card */}
          <div className="relative bg-surface/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white/80 hover:text-white"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {/* Header with animated gradient */}
            <div className="relative overflow-hidden pt-12 pb-8 px-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-50" />
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{ backgroundSize: '200% 100%' }}
              />
              
              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary to-secondary"
                >
                  <Sparkles className="text-white" size={28} />
                </motion.div>
                
                <h2 className="text-3xl font-black text-white mb-2">
                  {mode === 'login' ? 'Bem-vindo de Volta' : 'Junte-se à Tribe'}
                </h2>
                <p className="text-white/60 text-sm">
                  {mode === 'login'
                    ? 'Entre na sua conta Zen Tribe'
                    : 'Crie sua conta e faça parte da comunidade'}
                </p>
              </div>
            </div>

            <div className="px-8 pb-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-start gap-3"
                >
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Google Login */}
              {googleClientId ? (
                <div className="mb-6">
                  <GoogleOAuthProvider clientId={googleClientId}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="filled_black"
                      size="large"
                      text={mode === 'login' ? 'signin_with' : 'signup_with'}
                      width="100%"
                      logo_alignment="left"
                    />
                  </GoogleOAuthProvider>
                </div>
              ) : (
                <div className="mb-6 h-12 bg-white/5 animate-pulse rounded-xl flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-white/40" />
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface text-white/60">ou use email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      Nome
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (formErrors.username) setFormErrors({ ...formErrors, username: undefined });
                        }}
                        className={`w-full bg-black/30 text-white border ${
                          formErrors.username ? 'border-red-500/50' : 'border-white/10'
                        } rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-white/30`}
                        placeholder="Seu nome"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.username && (
                      <p className="mt-2 text-xs text-red-400">{formErrors.username}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/90">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      className={`w-full bg-black/30 text-white border ${
                        formErrors.email ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-white/30`}
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/90">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                      }}
                      className={`w-full bg-black/30 text-white border ${
                        formErrors.password ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-white/30`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-xs text-red-400">{formErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <span>
                      {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                    </span>
                  )}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  {' '}
                  <button
                    onClick={switchMode}
                    disabled={loading}
                    className="text-primary font-bold hover:text-primary/80 hover:underline transition-colors disabled:opacity-50"
                  >
                    {mode === 'login' ? 'Criar Conta' : 'Entrar'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;