// src/components/AuthModal.tsx - VERSÃO ZEN EYER (HEADLESS & CONTEXT)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google'; // 📦 Lib oficial
import { useUser } from '../contexts/UserContext'; // 🧠 O Cérebro

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Consumindo o Cérebro (Contexto)
  const { login, register, googleLogin, googleClientId } = useUser();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Login/Registro Unificado (Via Contexto)
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
        await login(data);
      } else {
        await register(data);
      }

      // Sucesso!
      console.log('✅ Autenticação realizada com sucesso!');
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard'); // SPA Navigation (sem reload)

    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'Falha na autenticação. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google OAuth (Via Componente Oficial)
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Envia o ID Token para o nosso Backend validar
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">
                {mode === 'login' ? (t('auth_welcome_back') || 'Bem-vindo de Volta') : (t('auth_create_account') || 'Criar Conta')}
              </h2>
              <p className="text-white/60">
                {mode === 'login' 
                  ? (t('auth_enter_account') || 'Entre na sua conta Zen Tribe')
                  : (t('auth_join_tribe') || 'Junte-se à Zen Tribe')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* 🔥 Google Login Button (Dinâmico) */}
            <div className="flex justify-center mb-6 w-full">
              {googleClientId ? (
                <div className="w-full flex justify-center">
                   {/* Google OAuth Provider já está no UserContext, mas o componente precisa do wrapper se for usado isolado. 
                       Como importamos a lib, usamos direto aqui. */}
                   <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Login falhou')}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      text={mode === 'login' ? "signin_with" : "signup_with"}
                      width="100%" // Tenta preencher largura
                   />
                </div>
              ) : (
                // Skeleton loader enquanto carrega o ID do WordPress
                <div className="w-full h-12 bg-white/10 animate-pulse rounded-full"></div>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-white/60">ou use email</span>
              </div>
            </div>

            {/* Email/Pass Form */}
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
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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