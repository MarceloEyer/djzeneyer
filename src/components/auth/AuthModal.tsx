import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, register } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      
      // Close modal on success
      onClose();
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'facebook' | 'google') => {
    // Implementação futura de login social
    console.log(`Login with ${provider}`);
    // Aqui você chamaria a função apropriada do seu contexto de usuário
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
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 id="auth-modal-title" className="text-xl font-display font-bold">
            {mode === 'login' ? 'Login to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 py-2 px-3 bg-error/20 border border-error/30 rounded-md text-sm" role="alert">
              {error}
            </div>
          )}
          
          {mode === 'register' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
              required
              autoComplete={mode === 'login' ? 'username' : 'email'}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
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
        
        {/* Social Login Options */}
        <div className="p-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-white/50">or continue with</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              aria-label="Login with Facebook"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="#1877F2"/>
                <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.9219C17.3438 4.9219 15.9703 4.6875 14.6578 4.6875C11.9156 4.6875 10.125 6.3516 10.125 9.3516V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875 23.8547V15.4688H16.6711Z" fill="white"/>
              </svg>
              Facebook
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              aria-label="Login with Google"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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