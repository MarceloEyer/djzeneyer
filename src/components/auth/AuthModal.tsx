// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // <<< AJUSTE O CAMINHO SE NECESSÁRIO
import FacebookIcon from '../icons/FacebookIcon';   // <<< AJUSTE O CAMINHO SE NECESSÁRIO
import GoogleIcon from '../icons/GoogleIcon';     // <<< AJUSTE O CAMINHO SE NECESSÁRIO

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  // DEBUG: Log para verificar renderização e props
  console.log(`[AuthModal] Renderizando/Atualizado. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null); // Erro específico do modal

  const { login, register, loginWithGoogle, loading: contextLoading, user } = useUser(); // Pegando loading do context

  // Limpa os campos e erro local quando o modo muda ou o modal é fechado/aberto
  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
    setLocalError(null);
  }, [mode, isOpen]);

  // Fecha o modal se o usuário logar com sucesso
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      console.log('[AuthModal] Usuário logado, fechando modal.');
      onClose();
    }
  }, [user, isOpen, onClose]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      // O useEffect acima cuidará de fechar o modal se o 'user' for atualizado com sucesso.
      // Se não houver erro, a lógica de fechar o modal e resetar campos já está no useEffect ou será tratada pelo UserContext.
    } catch (err: any) {
      console.error("[AuthModal] Erro no handleSubmit:", err);
      setLocalError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError(null);
    try {
      await loginWithGoogle();
      // O redirecionamento e o onAuthStateChange no UserContext cuidarão do resto.
      // O useEffect que observa 'user' fechará o modal.
    } catch (err: any) {
      console.error("[AuthModal] Erro no login com Google:", err);
      setLocalError(err.message || 'Falha no login com Google.');
    }
  };
  
  // Função para o botão do Facebook (ainda como placeholder)
  const handleFacebookAuth = () => {
    setLocalError(null);
    console.log("Login com Facebook clicado - funcionalidade a ser implementada no UserContext.");
    alert("Login com Facebook ainda não implementado.");
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"> {/* Aumentado z-index */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" // Overlay um pouco mais escuro
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-white/10" // Estilo de card
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold text-white">
            {mode === 'login' ? 'Login to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close"
            disabled={contextLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {localError && (
            <div className="mb-4 py-2.5 px-4 bg-error/20 border border-error/30 rounded-lg text-sm text-error" role="alert">
              {localError}
            </div>
          )}
          
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-white/80 mb-1.5">
                Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
                placeholder="Your name"
                required
                autoComplete="name"
                disabled={contextLoading}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-white/80 mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
              placeholder="your@email.com"
              required
              autoComplete={mode === 'login' ? 'username' : 'email'}
              disabled={contextLoading}
            />
          </div>
          
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-white/80 mb-1.5">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={contextLoading}
            />
          </div>
          
          {mode === 'login' && (
            <div className="text-right -mt-2 mb-1"> {/* Ajuste de margem para o link */}
              <button
                type="button"
                // onClick={handleForgotPassword} // Implementar esta função se necessário
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                disabled={contextLoading}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={contextLoading}
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {contextLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
          
          <div className="text-center text-sm text-white/70">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={contextLoading}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={contextLoading}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </form>
        
        {/* Social Login Options */}
        <div className="px-6 pb-6 pt-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-5">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-4 text-xs text-white/50 uppercase">or continue with</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleFacebookAuth} // Placeholder
              disabled={true || contextLoading} // Facebook ainda não implementado no context
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Facebook"
            >
              <FacebookIcon className="w-5 h-5 mr-2.5" /> {/* Passando className se precisar de ajuste */}
              Facebook
            </button>
            
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={contextLoading}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Google"
            >
              <GoogleIcon className="w-5 h-5 mr-2.5" /> {/* Passando className se precisar de ajuste */}
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;