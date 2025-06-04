// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // <<< AJUSTE O CAMINHO SE NECESSÁRIO

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void; // Manter para caso queira alternar modos internamente, mas o botão de registro vai redirecionar
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

    // Se o modo for registro, redirecionamos para a página padrão do WP.
    // O formulário de registro dentro do modal não será mais usado para o registro direto via API.
    if (mode === 'register') {
      handleRegisterRedirect(); // Redireciona em vez de tentar a API
      return; // Sai da função para não tentar o registro via API
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } 
      // A lógica de 'else { await register(name, email, password); }'
      // foi movida para o redirecionamento acima para o modo 'register'.
    } catch (err: any) {
      console.error("[AuthModal] Erro no handleSubmit:", err);
      setLocalError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  const handleForgotPassword = () => {
    window.location.href = `${window.wpData.siteUrl}/wp-login.php?action=lostpassword`;
  };

  // Redireciona para a página padrão de registro do WP
  const handleRegisterRedirect = () => {
    window.location.href = `${window.wpData.siteUrl}/wp-login.php?action=register`;
  };

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
          
          {/* O formulário de registro dentro do modal não será mais usado para o registro direto via API.
              Ele será apenas um placeholder visual que redireciona. */}
          {mode === 'register' && (
            <>
              <p className="text-white/70 text-center">Para criar sua conta, você será redirecionado para a página de registro segura do WordPress.</p>
              {/* Campos de email, password, name podem ser removidos ou mantidos desabilitados
                  se você quiser que o usuário veja os campos antes de redirecionar.
                  Por simplicidade, vamos manter os campos, mas a submissão redireciona. */}
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-white/80 mb-1.5">
                  Nome
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                  disabled={loading} // Desabilitado se estiver carregando
                />
              </div>
              
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
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Senha
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
                  placeholder="••••••••"
                  required
                  minLength={7} // ALTERADO PARA 7 DÍGITOS
                  autoComplete={"new-password"}
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          {mode === 'login' && (
            <>
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
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Senha
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
                  placeholder="••••••••"
                  required
                  minLength={7} // ALTERADO PARA 7 DÍGITOS
                  autoComplete={"current-password"}
                  disabled={loading}
                />
              </div>
              <div className="text-right -mt-2 mb-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Esqueceu a senha?
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Login' : 'Criar Conta'}
          </button>
          
          <div className="text-center text-sm text-white/70">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={!loading ? handleRegisterRedirect : undefined} // Botão "Sign up" agora redireciona
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={!loading ? onToggleMode : undefined} // Este botão ainda alterna para o modo login
                  className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Login
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