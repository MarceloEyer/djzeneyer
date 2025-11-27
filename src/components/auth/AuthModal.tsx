// src/components/auth/AuthModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
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
        name: mode === 'register' ? username : undefined,
      };
      if (mode === 'login') {
        await login(data.email, data.password);
      } else {
        await register(data.name || '', data.email, data.password);
      }
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
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

  const { signIn: googleSignIn } = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Login com Google falhou'),
  });

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
          className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white"
          >
            <X size={24} />
          </button>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">
                {mode === 'login' ? 'Bem-vindo de Volta' : 'Criar Conta'}
              </h2>
              <p className="text-white/60">
                {mode === 'login' ? 'Entre na sua conta Zen Tribe' : 'Junte-se à Zen Tribe'}
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            <div className="flex justify-center mb-6 w-full">
              {googleClientId ? (
                <button
                  onClick={() => googleSignIn()}
                  className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all hover:shadow-lg hover:shadow-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 0 0-8.6 3.893-8.6 8.72 0 4.827 3.893 8.72 8.6 8.72 0 0 1.44-.627 2.307-1.467-2.307-1.387-3.787-3.28-3.787-5.627 0-1.76 1.12-3.28 2.627-4.133-.313-.687-.473-1.473-.473-2.347 0-2.2 1.567-4.027 3.707-4.407z" />
                  </svg>
                  <span>Continuar com Google</span>
                </button>
              ) : (
                <div className="w-full h-12 bg-white/10 animate-pulse rounded-lg flex items-center justify-center text-xs text-white/40">
                  Conectando ao servidor...
                </div>
              )}
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-white/60">ou use email</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-11 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
            <div className="mt-6 text-center">
              <p className="text-white/60">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                  }}
                  className="text-purple-400 font-bold hover:underline ml-1"
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
