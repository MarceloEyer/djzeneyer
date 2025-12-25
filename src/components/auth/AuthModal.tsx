// src/components/auth/AuthModal.tsx
// VERSÃO DEFINITIVA: SEGURANÇA MÁXIMA (Turnstile + Honeypot) + UX PREMIUM

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Turnstile } from '@marsidev/react-turnstile'; // Biblioteca do Cloudflare
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
  // ATENÇÃO: Verifique se o seu useUser() já aceita o 4º argumento (token) no register
  const { login, register, googleLogin, googleClientId } = useUser();
  
  // Estados do Formulário
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Estados de Segurança
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [honeypot, setHoneypot] = useState(''); // Campo armadilha para bots

  // Estados de UX
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // --- Validação ---
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validação de Email
    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email inválido';
    }

    // Validação de Senha
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else {
      if (password.length < 6) {
        errors.password = 'Mínimo de 6 caracteres';
      }
    }

    // Validação de Nome
    if (mode === 'register' && !username.trim()) {
      errors.username = 'Nome é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Verificação Honeypot (Se preenchido, é bot)
    if (honeypot) {
      // Fingimos sucesso para enganar o bot
      onClose();
      return;
    }

    if (!validateForm()) return;

    // 2. Verificação Turnstile (Apenas no Registro)
    if (mode === 'register' && !turnstileToken) {
      setError('Por favor, aguarde a verificação de segurança.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        // Envia o token do Cloudflare junto com os dados
        // Certifique-se que sua função register no UserContext aceita esse argumento
        await register(username.trim(), email, password, turnstileToken);
      }
      
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ [AuthModal] Erro:', err);
      // Se der erro, reseta o token para forçar nova verificação
      setTurnstileToken(''); 
      setError(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError('Credencial do Google não recebida');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await googleLogin(credentialResponse.credential);
      if (onSuccess) onSuccess();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ [AuthModal] Erro no Google Login:', err);
      setError('Falha na autenticação com Google.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormErrors({});
    setTurnstileToken(''); // Reseta token ao trocar de modo
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/reset-password');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Backdrop Dark & Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
          {/* Efeito de Brilho de Fundo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-3xl blur-xl" />
          
          {/* Card Principal */}
          <div className="relative bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            
            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white/60 hover:text-white"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {/* Cabeçalho Limpo */}
            <div className="pt-10 pb-6 px-8 text-center">
              <h2 className="text-3xl font-black text-white mb-2 font-display tracking-tight">
                {mode === 'login' ? 'Bem-vindo de Volta' : 'Junte-se à Tribe'}
              </h2>
              <p className="text-white/60 text-sm">
                {mode === 'login'
                  ? 'Acesse conteúdos exclusivos e sua dashboard'
                  : 'Crie sua conta gratuita e comece sua jornada'}
              </p>
            </div>

            <div className="px-8 pb-8">
              {/* Mensagem de Erro Global */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-3"
                >
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Google Login Button */}
              {googleClientId ? (
                <div className="mb-6">
                  <GoogleOAuthProvider clientId={googleClientId}>
                    <div className="w-full flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Falha ao conectar com Google')}
                        theme="filled_black"
                        size="large"
                        text={mode === 'login' ? 'signin_with' : 'signup_with'}
                        width="100%"
                        logo_alignment="center"
                      />
                    </div>
                  </GoogleOAuthProvider>
                </div>
              ) : (
                <div className="mb-6 h-12 bg-white/5 animate-pulse rounded-lg flex items-center justify-center border border-white/5">
                  <Loader2 size={20} className="animate-spin text-white/40" />
                </div>
              )}

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                  <span className="px-3 bg-[#1a1a1a] text-white/40">ou continue com email</span>
                </div>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* --- CAMPO ARMADILHA (HONEYPOT) - Invisível --- */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} aria-hidden="true">
                  <label htmlFor="user_website_trap">Se você é humano, não preencha este campo</label>
                  <input
                    type="text"
                    id="user_website_trap"
                    name="user_website_trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Campo Nome (Apenas Registro) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-white/50 mb-1.5 ml-1">Nome</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (formErrors.username) setFormErrors({ ...formErrors, username: undefined });
                        }}
                        className={`w-full bg-black/40 text-white border ${
                          formErrors.username ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-primary/50'
                        } rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`}
                        placeholder="Como devemos te chamar?"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.username && <p className="mt-1 text-xs text-red-400 ml-1">{formErrors.username}</p>}
                  </div>
                )}

                {/* Campo Email */}
                <div>
                  <label className="block text-xs font-bold uppercase text-white/50 mb-1.5 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      className={`w-full bg-black/40 text-white border ${
                        formErrors.email ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-primary/50'
                      } rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`}
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-xs text-red-400 ml-1">{formErrors.email}</p>}
                </div>

                {/* Campo Senha com Toggle */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="text-xs font-bold uppercase text-white/50">Senha</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Esqueceu?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                      }}
                      className={`w-full bg-black/40 text-white border ${
                        formErrors.password ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-primary/50'
                      } rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.password && <p className="mt-1 text-xs text-red-400 ml-1">{formErrors.password}</p>}
                </div>

                {/* CLOUDFLARE TURNSTILE (Apenas no Registro) */}
                {mode === 'register' && (
                  <div className="flex justify-center py-2">
                    <Turnstile 
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                      onSuccess={(token) => setTurnstileToken(token)}
                      options={{ theme: 'dark' }}
                    />
                  </div>
                )}

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <span>
                      {mode === 'login' ? 'Acessar Conta' : 'Criar Conta Grátis'}
                    </span>
                  )}
                </button>
              </form>

              {/* Switch Mode Footer */}
              <div className="mt-6 text-center pt-4 border-t border-white/5">
                <p className="text-white/50 text-sm">
                  {mode === 'login' ? 'Ainda não é membro?' : 'Já tem uma conta?'}
                  {' '}
                  <button
                    onClick={switchMode}
                    disabled={loading}
                    className="text-primary font-bold hover:text-white transition-colors disabled:opacity-50 ml-1"
                  >
                    {mode === 'login' ? 'Crie agora' : 'Faça Login'}
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