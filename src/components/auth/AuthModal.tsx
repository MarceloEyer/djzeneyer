// src/components/auth/AuthModal.tsx - DESIGN LIMPO E FUNCIONAL
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = { 
        email, 
        password, 
        name: mode === 'register' ? username : undefined 
      };

      if (mode === 'login') {
        await login(data.email, data.password);
      } else {
        await register(data.name || '', data.email, data.password);
      }

      console.log('✅ Autenticação realizada com sucesso!');
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');

    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'Falha na autenticação. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setLoading(true);
    setError('');
    
    try {
      await googleLogin(credentialResponse.credential);
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erro ao conectar com Google. Tente novamente.');
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
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-[#0A0E27] rounded-2xl shadow-2xl border border-white/5 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors z-10 text-white/60 hover:text-white"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-black text-white mb-2 font-['Orbitron']">
                  {mode === 'login' ? 'Bem-vindo de Volta' : 'Criar Conta'}
                </h2>
                <p className="text-white/50 text-sm">
                  {mode === 'login' 
                    ? 'Entre na sua conta Zen Tribe'
                    : 'Junte-se à Zen Tribe'}
                </p>
              </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Login */}
            <div className="mb-6">
              {googleClientId ? (
                <div className="flex justify-center">
                  <GoogleOAuthProvider clientId={googleClientId}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Login com Google falhou')}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      text={mode === 'login' ? "signin_with" : "signup_with"}
                      width="320"
                    />
                  </GoogleOAuthProvider>
                </div>
              ) : (
                <div className="h-12 bg-white/5 animate-pulse rounded-full flex items-center justify-center">
                  <span className="text-xs text-white/30">Conectando ao servidor...</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0A0E27] text-white/40">ou use email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (Register only) */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-semibold mb-2 text-white/70 uppercase tracking-wide">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 text-white border border-white/10 rounded-xl py-3.5 pl-12 pr-4 
                                 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07]
                                 transition-all placeholder:text-white/30"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-white/70 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-xl py-3.5 pl-12 pr-4 
                               focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07]
                               transition-all placeholder:text-white/30"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-white/70 uppercase tracking-wide">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-xl py-3.5 pl-12 pr-4 
                               focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07]
                               transition-all placeholder:text-white/30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl 
                           transition-all transform hover:scale-[1.02] active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                    setEmail('');
                    setPassword('');
                    setUsername('');
                  }}
                  className="text-purple-400 font-bold hover:text-purple-300 transition-colors ml-1"
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