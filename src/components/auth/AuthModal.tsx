// src/components/AuthModal.tsx - VERSÃO COM GOOGLE OAUTH

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login normal (email/senha)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.jwt) {
        localStorage.setItem('jwt_token', data.data.jwt);
        localStorage.setItem('user_email', email);
        
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
      } else {
        throw new Error(data.data?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || t('auth_error_login'));
    } finally {
      setLoading(false);
    }
  };

  // Registro normal
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (data.success) {
        handleLogin(e);
      } else {
        throw new Error(data.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || t('auth_error_register'));
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NOVO - Google OAuth Login
  const handleGoogleLogin = () => {
    // Gera URL do OAuth do Google via Simple JWT Login
    const clientId = 'SEU_GOOGLE_CLIENT_ID_AQUI'; // TODO: Buscar do backend
    const redirectUri = `${window.location.origin}/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google`;
    const scope = 'openid email profile';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline`;

    // Redireciona para Google
    window.location.href = googleAuthUrl;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black font-display mb-2">
                {mode === 'login' ? t('auth_welcome_back') || 'Bem-vindo de Volta' : t('auth_create_account') || 'Criar Conta'}
              </h2>
              <p className="text-white/60">
                {mode === 'login' 
                  ? t('auth_enter_account') || 'Entre na sua conta Zen Tribe' 
                  : t('auth_join_tribe') || 'Junte-se à Zen Tribe'}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-error/20 border border-error/50 rounded-lg text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* 🔥 NOVO - Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mb-6 py-4 px-6 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar com Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-white/60">ou use email</span>
              </div>
            </div>

            {/* Form normal */}
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('auth_username') || 'Nome de Usuário'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input pl-11"
                      placeholder="Digite seu nome de usuário"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-11"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Carregando...</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  {mode === 'login' ? 'Criar Conta' : 'Entrar'}
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
