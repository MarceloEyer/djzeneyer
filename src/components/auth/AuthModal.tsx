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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative z-10 bg-surface rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 className="text-xl font-display font-bold">
            {mode === 'login' ? 'Login to Zen Tribe' : 'Join the Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 py-2 px-3 bg-error/20 border border-error/30 rounded-md text-sm">
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
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.292 9.292H15.825C15.562 9.292 15.292 9.625 15.292 9.956V11H17.292L16.992 13H15.292V19H13.292V13H11.792V11H13.292V10.042C13.292 8.333 14.392 7 15.825 7H17.292V9.292Z" fill="#1877F2"/>
              </svg>
              Facebook
            </button>
            
            <button
              type="button"
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.855 11.982H12.872C12.872 11.982 12.872 15.912 12.872 15.937C12.872 16.498 12.416 16.955 11.855 16.955C11.293 16.955 10.837 16.498 10.837 15.937C10.837 15.912 10.837 12.982 10.837 12.982C10.837 12.982 8.419 12.982 8.376 12.982C7.815 12.982 7.358 12.525 7.358 11.964C7.358 11.402 7.815 10.946 8.376 10.946C8.419 10.946 10.837 10.946 10.837 10.946C10.837 10.946 10.837 8.964 10.837 8.919C10.837 8.357 11.293 7.901 11.855 7.901C12.416 7.901 12.872 8.357 12.872 8.919C12.872 8.964 12.872 10.946 12.872 10.946C12.872 10.946 16.801 10.946 16.837 10.946C17.398 10.946 17.855 11.402 17.855 11.964C17.855 12.525 17.398 11.982 16.837 11.982C16.801 11.982 17.855 11.982 17.855 11.982Z" fill="#DB4437"/>
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