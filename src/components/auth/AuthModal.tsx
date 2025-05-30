// Seu AuthModal.tsx (o que você acabou de colar)
import React, { useState } from 'react'; // Mantive seus imports originais desta versão
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  // ADICIONE ESTA LINHA DE DEBUG AQUI:
  console.log(`[AuthModal - Versão Atual Fornecida] Renderizando/Atualizado. isOpen: ${isOpen}, Mode: ${mode}`);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... resto do seu código AuthModal.tsx ...
  // (continua igual ao que você me enviou)

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false); // Este é o loading local desta versão do AuthModal
  const [error, setError] = useState<string | null>(null);
  
  const { login, register } = useUser(); // Funções do UserContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Usa o loading local
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      
      // A lógica para fechar o modal após sucesso no UserContext (observando 'user')
      // ou aqui diretamente chamando onClose() se o UserContext não fechar.
      // Para simplificar, se não houver erro, chamaremos onClose.
      // Em um fluxo ideal, o UserContext atualizaria o 'user', e um useEffect no AuthModal
      // ou MainLayout fecharia o modal. Mas vamos manter simples por agora.
      onClose(); 
      
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false); // Reseta o loading local
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true" // Adicionado aria-hidden para o overlay
      ></div>
      
      <div className="relative z-10 bg-surface rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold"> {/* Adicionado id para aria-labelledby */}
            {mode === 'login' ? 'Login to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close modal" // Melhorado aria-label
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 py-2 px-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm text-red-400" role="alert"> {/* Estilo de erro melhorado */}
              {error}
            </div>
          )}
          
          {mode === 'register' && (
            <div className="mb-4">
              <label htmlFor="auth-name" className="block text-sm font-medium mb-1"> {/* Associado htmlFor ao id */}
                Name
              </label>
              <input
                id="auth-name" // Adicionado id
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your name"
                required
                autoComplete="name" // Adicionado autocomplete
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="auth-email" className="block text-sm font-medium mb-1"> {/* Associado htmlFor ao id */}
              Email
            </label>
            <input
              id="auth-email" // Adicionado id
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
              required
              autoComplete="email" // Adicionado autocomplete
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="auth-password" className="block text-sm font-medium mb-1"> {/* Associado htmlFor ao id */}
              Password
            </label>
            <input
              id="auth-password" // Adicionado id
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? "current-password" : "new-password"} // Adicionado autocomplete
            />
          </div>
          
          <button
            type="submit"
            disabled={loading} // Usa o loading local desta versão do AuthModal
            className="w-full btn btn-primary mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
          
          <div className="text-center text-sm text-white/70">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-primary hover:underline focus:outline-none"
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
                  className="text-primary hover:underline focus:outline-none"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </form>
        
        {/* Social Login Options - SVGs embutidos como na sua versão */}
        <div className="p-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-white/50">or continue with</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              // onClick={handleFacebookAuth} // Implementar handleFacebookAuth
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              aria-label="Login with Facebook" // Adicionado aria-label
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG do Facebook (como você forneceu) */}
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.292 9.292H15.825C15.562 9.292 15.292 9.625 15.292 9.956V11H17.292L16.992 13H15.292V19H13.292V13H11.792V11H13.292V10.042C13.292 8.333 14.392 7 15.825 7H17.292V9.292Z" fill="#1877F2"/>
              </svg>
              Facebook
            </button>
            
            <button
              type="button"
              // onClick={handleGoogleAuth} // Implementar handleGoogleAuth
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              aria-label="Login with Google" // Adicionado aria-label
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* SVG do Google (como você forneceu) */}
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.855 11.982H12.872C12.872 11.982 12.872 15.912 12.872 15.937C12.872 16.498 12.416 16.955 11.855 16.955C11.293 16.955 10.837 16.498 10.837 15.937C10.837 15.912 10.837 12.982 10.837 12.982C10.837 12.982 8.419 12.982 8.376 12.982C7.815 12.982 7.358 12.525 7.358 11.964C7.358 11.402 7.815 10.946 8.376 10.946C8.419 10.946 10.837 10.946 10.837 10.946C10.837 10.946 10.837 8.964 10.837 8.919C10.837 8.357 11.293 7.901 11.855 7.901C12.416 7.901 12.872 8.357 12.872 8.919C12.872 8.964 12.872 10.946 12.872 10.946C12.872 10.946 16.801 10.946 16.837 10.946C17.398 10.946 17.855 11.402 17.855 11.964C17.855 12.525 17.398 11.982 16.837 11.982C16.801 11.982 17.855 11.982 17.855 11.982Z" fill="#DB4437"/>
                {/* Adicionei os outros paths do ícone do Google que podem estar faltando no seu exemplo */}
                <path d="M12 0C5.373 0 0 5.373 0 12S5.373 24 12 24 24 18.627 24 12S18.627 0 12 0zm0 21.818c-5.41 0-9.818-4.408-9.818-9.818S6.59 2.182 12 2.182s9.818 4.408 9.818 9.818-4.408 9.818-9.818 9.818z" fill="#4285F4"/>
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