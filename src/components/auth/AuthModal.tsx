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

// Certifique-se de que window.wpData está acessível globalmente
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
  console.log(`[AuthModal] Renderizando/Atualizado. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Usando 'loading' do UserContext para desabilitar elementos durante operações de auth
  const { login, register, loading, user } = useUser();

  // Limpa os campos e erro local quando o modo muda ou o modal é fechado/aberto
  useEffect(() => {
    if (isOpen) {
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

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      console.error("[AuthModal] Erro no handleSubmit:", err);
      // Aqui, o erro pode vir com HTML. Usamos textContent para extrair o texto puro
      // ou diretamente o erro.message se ele já for texto.
      // Se o erro.message já contiver HTML, precisamos usar dangerouslySetInnerHTML.
      // A mensagem de erro do WordPress (como "senha incorreta") vem com HTML.
      setLocalError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  // --- FUNÇÃO ATUALIZADA PARA ESQUECI A SENHA ---
  const handleForgotPassword = () => {
    // Redireciona para a página padrão de recuperação de senha do WordPress
    // Isso é mais robusto do que a página do WooCommerce, que pode ter problemas de roteamento em setups headless.
    window.location.href = `${window.wpData.siteUrl}/wp-login.php?action=lostpassword`;
  };
  // --- FIM DA FUNÇÃO ATUALIZADA ---

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      ></div>
      
      <div
        className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-white/10"
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
            <div 
              className="mb-4 py-2.5 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400" 
              role="alert"
              dangerouslySetInnerHTML={{ __html: localError }}
            ></div>
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
                onClick={handleForgotPassword}
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
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
        
        {/* Bloco de "or continue with" e botões de redes sociais removido */}
      </div>
    </div>
  );
};

export default AuthModal;