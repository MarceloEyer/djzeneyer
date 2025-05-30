// AuthModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // <<< VERIFIQUE ESTE CAMINHO!

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, register, loginWithGoogle, loading } = useUser(); 
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose(); 
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) { 
      console.error("AuthModal Erro:", err);
      setError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  const handleGoogleLoginClick = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // onClose(); // Opcional: fechar imediatamente
    } catch (err: any) {
      console.error("AuthModal Erro Google Login:", err);
      setError(err.message || 'Falha no login com Google.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div
        className="relative z-10 bg-surface rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold">
            {mode === 'login' ? 'Login na Zen Tribe' : 'Junte-se à Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Fechar"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 py-2 px-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          
          {mode === 'register' && (
            <div className="mb-4">
              <label htmlFor="auth-name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Seu nome"
                required
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="auth-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="seu@email.com"
              required
              autoComplete={mode === 'login' ? 'username' : 'email'}
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="auth-password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>
          
          {mode === 'login' && (
            <div className="mb-4 text-right">
              <button
                type="button"
                // onClick={handleForgotPassword} 
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Login' : 'Criar Conta'}
          </button>
          
          <div className="text-center text-sm text-white/70">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-primary hover:underline focus:outline-none disabled:opacity-50"
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
                  onClick={onToggleMode}
                  className="text-primary hover:underline focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  Faça login
                </button>
              </>
            )}
          </div>
        </form>
        
        <div className="p-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-white/50">ou continue com</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={true || loading} // Facebook ainda não implementado
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login com Facebook"
            >
              {/* SVG do Facebook Corrigido */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="#1877F2"/>
                <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.9219C17.3438 4.9219 15.9703 4.6875 14.6578 4.687