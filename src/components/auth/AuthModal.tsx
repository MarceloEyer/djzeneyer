// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // <<< AJUSTE O CAMINHO SE NECESSÁRIO

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  console.log(`[AuthModal] Renderizando/Atualizado. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Usando 'loading' do UserContext para desabilitar elementos durante operações de auth
  const { login, register, loginWithGoogle, loading, user } = useUser();

  // Limpa os campos e erro local quando o modo muda ou o modal é fechado/aberto
  useEffect(() => {
    if (isOpen) { // Limpa apenas quando for abrir ou quando o modo mudar com ele aberto
      setEmail('');
      setPassword('');
      setName('');
      setLocalError(null);
    }
  }, [mode, isOpen]);

  // Fecha o modal se o usuário logar com sucesso (vindo do context)
  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      console.log('[AuthModal] Usuário agora está logado (contexto), fechando modal.');
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    // O 'loading' do context será true se login/register estiverem em progresso
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      // O useEffect acima (que observa 'user') deve cuidar de fechar o modal em caso de sucesso.
      // Se não houver erro, o usuário será logado, e o modal fechará.
    } catch (err: any) {
      console.error("[AuthModal] Erro no handleSubmit:", err);
      setLocalError(err.message || 'Ocorreu um erro inesperado.');
    }
    // Não precisa de setLoading(false) local aqui, pois usamos o 'loading' do context.
  };

  const handleGoogleAuthClick = async () => {
    setLocalError(null);
    try {
      await loginWithGoogle();
      // O useEffect que observa 'user' deve cuidar de fechar o modal em caso de sucesso.
    } catch (err: any) {
      console.error("[AuthModal] Erro no login com Google:", err);
      setLocalError(err.message || 'Falha no login com Google.');
    }
  };
  
  const handleFacebookAuthClick = () => {
    setLocalError(null);
    console.log("Login com Facebook clicado - funcionalidade a ser implementada no UserContext.");
    alert("Login com Facebook ainda não implementado.");
    // Quando implementar, chame algo como:
    // try {
    //   await loginWithFacebook(); 
    // } catch (err: any) {
    //   setLocalError(err.message || 'Falha no login com Facebook.');
    // }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"> {/* Adicionado padding para telas menores */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined} // Não fecha no clique do overlay se estiver carregando
        aria-hidden="true"
      ></div>
      
      <div
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-white/10" // mx-auto para centralizar se p-4 estiver ativo
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold text-white">
            {mode === 'login' ? 'Login to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {localError && (
            <div className="mb-4 py-2.5 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400" role="alert">
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
                disabled={loading}
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
              autoComplete="email"
              disabled={loading}
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
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              disabled={loading}
            />
          </div>
          
          {mode === 'login' && (
            <div className="text-right -mt-2 mb-1">
              <button
                type="button"
                // onClick={handleForgotPassword} // Implementar esta função se necessário
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading} // Usa o loading do UserContext
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
          
          <div className="text-center text-sm text-white/70">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined}
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </form>
        
        <div className="px-6 pb-6 pt-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-5">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-4 text-xs text-white/50 uppercase">or continue with</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={!loading ? handleFacebookAuthClick : undefined}
              disabled={true || loading} // Facebook ainda não implementado funcionalmente no UserContext
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Facebook"
            >
              {/* SVG do Facebook (como na sua versão "que não dava erro") */}
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#1877F2"/><path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.9219C17.3438 4.9219 15.9703 4.6875 14.6578 4.6875C11.9156 4.6875 10.125 6.3516 10.125 9.3516V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875 23.8547V15.4688H16.6711Z" fill="white"/></svg>
              Facebook
            </button>
            
            <button
              type="button"
              onClick={!loading ? handleGoogleAuthClick : undefined} // Conectado
              disabled={loading}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Google"
            >
              {/* SVG do Google (versão completa) */}
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;