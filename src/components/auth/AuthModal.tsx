// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  console.log(`[AuthModal] Renderizando. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loginWithGoogle, loading: globalLoading, user } = useUser();
  
  const loading = isSubmitting || globalLoading;

  // Limpar campos quando modal abre/fecha ou modo muda
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setLocalError(null);
      setLocalSuccess(null);
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [mode, isOpen]);

  // Fechar modal quando login é bem-sucedido
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess('Login realizado com sucesso! Bem-vindo à Zen Tribe.');
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose]);

  const validateForm = () => {
    setLocalError(null);

    if (!email || !email.includes('@')) {
      setLocalError('Por favor, insira um endereço de email válido.');
      return false;
    }
    if (!password || password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (mode === 'register' && (!name || name.trim().length < 2)) {
      setLocalError('Por favor, insira seu nome completo (mínimo 2 caracteres).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name.trim(), email, password);
      }
    } catch (err: any) {
      console.error(`[AuthModal] ${mode} error:`, err);
      
      let errorMessage = err.message ? String(err.message) : 'Ocorreu um erro inesperado.';
      
      // Limpar tags HTML se presentes
      errorMessage = errorMessage.replace(/<[^>]*>/g, '');
      
      // Tratar mensagens de erro comuns do WordPress
      if (errorMessage.includes('Invalid username') || errorMessage.includes('Invalid email') || errorMessage.includes('incorrect')) {
        errorMessage = 'Email ou senha inválidos. Verifique suas credenciais.';
      } else if (errorMessage.includes('username already exists') || errorMessage.includes('email already exists')) {
        errorMessage = 'Já existe uma conta com este email. Tente fazer login.';
      } else if (errorMessage.includes('weak password')) {
        errorMessage = 'Escolha uma senha mais forte com pelo menos 6 caracteres.';
      } else if (errorMessage.includes('too many attempts')) {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
      } else if (errorMessage.includes('Could not determine user from JWT')) {
        errorMessage = 'Falha na autenticação. Tente fazer login novamente.';
      } else if (errorMessage.includes('rest_cookie_invalid_nonce')) {
        errorMessage = 'Falha na verificação de segurança. Atualize a página e tente novamente.';
      } else if (errorMessage.includes('Token JWT não foi retornado')) {
        errorMessage = 'Erro de configuração do servidor. Contate o suporte se o problema persistir.';
      }
      
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    window.open(`${window.wpData.siteUrl}/wp-login.php?action=lostpassword`, '_blank');
  };

  const handleGoogleAuthClick = async () => {
    setLocalError(null);
    setLocalSuccess(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("[AuthModal] Erro no login Google:", err);
      const cleanErrorMessage = err.message ? String(err.message).replace(/<[^>]*>?/gm, '') : 'Falha ao fazer login com Google.';
      setLocalError(cleanErrorMessage);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      />
      
      <div
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-white/10 transform transition-all duration-300 scale-100"
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold text-white">
            {mode === 'login' ? 'Bem-vindo de volta à Zen Tribe' : 'Junte-se à Zen Tribe'}
          </h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-white/10"
            aria-label="Fechar modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success Message */}
          {localSuccess && (
            <div className="flex items-center gap-3 p-4 bg-success/20 border border-success/30 rounded-lg text-success">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localSuccess}</span>
            </div>
          )}

          {/* Error Message */}
          {localError && (
            <div className="flex items-center gap-3 p-4 bg-error/20 border border-error/30 rounded-lg text-error">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{localError}</span>
            </div>
          )}
          
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-white/90 mb-2">
                Nome Completo
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
                placeholder="Seu nome completo"
                required
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}
          
          {/* Email Field */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-white/90 mb-2">
              Endereço de Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
              placeholder="Seu email"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-white/90 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 transition-all duration-200"
                placeholder="Sua senha"
                required
                minLength={6}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-xs text-white/60 mt-1">
                A senha deve ter pelo menos 6 caracteres
              </p>
            )}
          </div>

          {/* Forgot Password Link (Login only) */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none transition-colors"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{mode === 'login' ? 'Entrando...' : 'Criando Conta...'}</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
            )}
          </button>
          
          {/* Mode Toggle */}
          <div className="text-center text-sm text-white/70 pt-4 border-t border-white/10">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Junte-se à Tribe
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </form>
        
        {/* Social Login */}
        <div className="px-6 pb-6 pt-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-5">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-4 text-xs text-white/50 uppercase">ou continue com</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={!loading ? handleGoogleAuthClick : undefined}
              disabled={loading}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login com Google"
            >
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;