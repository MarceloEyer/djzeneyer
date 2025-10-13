// src/components/AuthModal.tsx
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.jwt) {
        // Salva o token JWT
        localStorage.setItem('jwt_token', data.data.jwt);
        localStorage.setItem('user_email', email);
        
        console.log('✅ Login successful!');
        
        if (onSuccess) onSuccess();
        onClose();
        
        // Recarrega a página para atualizar o estado
        window.location.reload();
      } else {
        throw new Error(data.data?.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || t('auth_error_login'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/wp-json/simple-jwt-login/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Registration successful!');
        // Após registro, faz login automaticamente
        handleLogin(e);
      } else {
        throw new Error(data.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || t('auth_error_register'));
    } finally {
      setLoading(false);
    }
  };

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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            {/* Header */}
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

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-error/20 border border-error/50 rounded-lg text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
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
                      placeholder={t('auth_username_placeholder') || 'Digite seu nome de usuário'}
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
                <label className="block text-sm font-semibold mb-2">
                  {t('auth_password') || 'Senha'}
                </label>
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
                    <span>{t('loading') || 'Carregando...'}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? (t('auth_login') || 'Entrar') : (t('auth_register') || 'Criar Conta')}</span>
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center">
              <p className="text-white/60">
                {mode === 'login' 
                  ? (t('auth_no_account') || 'Não tem uma conta?')
                  : (t('auth_have_account') || 'Já tem uma conta?')}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  {mode === 'login' 
                    ? (t('auth_create_account') || 'Criar Conta')
                    : (t('auth_login') || 'Entrar')}
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
