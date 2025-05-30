// AuthModal.tsx
import React, { useState } from 'react'; // O useState local para os campos do form continua útil
import { X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext'; // <<< VERIFIQUE ESTE CAMINHO!

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  // Estados locais para os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Estados e funções do UserContext (agora com Supabase)
  const { login, register, loginWithGoogle, loading, user } = useUser(); 
  // O 'user' aqui pode ser usado para fechar o modal se já estiver logado, por exemplo.
  // O 'loading' agora é o global do UserContext.

  const [error, setError] = useState<string | null>(null); // Erro local para o modal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores do modal
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password); // 'name' é coletado aqui
      }
      // Se chegou aqui sem erro, o onAuthStateChange no UserContext vai lidar
      // com a atualização do usuário e o modal pode ser fechado.
      // A lógica de fechar o modal após o sucesso pode ser melhorada
      // observando o estado 'user' do context ou através de um callback.
      // Por enquanto, vamos fechar explicitamente se não houver erro.
      onClose(); 
      // Resetar campos do formulário
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) { // Captura o erro lançado pelo UserContext
      console.error("AuthModal Erro:", err);
      setError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  const handleGoogleLoginClick = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // O redirecionamento e o onAuthStateChange cuidarão do resto.
      // O modal pode ser fechado aqui, ou esperar o onAuthStateChange.
      // Se o fluxo OAuth iniciar corretamente, podemos fechar o modal.
      // onClose(); // Descomente se quiser fechar o modal imediatamente ao clicar
    } catch (err: any) {
      console.error("AuthModal Erro Google Login:", err);
      setError(err.message || 'Falha no login com Google.');
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Se o usuário já estiver logado (verificado pelo UserContext),
  // talvez você queira fechar o modal automaticamente ou nem abri-lo.
  // Isso pode ser gerenciado no componente pai que controla 'isOpen'.
  // useEffect(() => {
  //   if (user && isOpen) {
  //     onClose();
  //   }
  // }, [user, isOpen, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose} // Permite fechar clicando fora
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
            {mode === 'login' ? 'Login na Zen Tribe' : 'Junte-se à Zen Tribe'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Fechar"
            disabled={loading} // Desabilita se estiver carregando algo do context
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {error && ( // Exibe erro local do modal
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
                id="auth-name" // ID único para o input
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
              id="auth-email" // ID único
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
              id="auth-password" // ID único
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6} // Boa prática manter
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>
          
          {mode === 'login' && (
            <div className="mb-4 text-right">
              <button
                type="button"
                // onClick={handleForgotPassword} // Você implementaria essa função
                className="text-sm text-primary/80 hover:text-primary hover:underline focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading} // Usa o loading do UserContext
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
        
        {/* Social Login Options */}
        <div className="p-5 border-t border-white/10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-white/50">ou continue com</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              // onClick={() => handleSocialLogin('facebook')} // Manter desabilitado ou implementar
              disabled={true || loading} // Facebook ainda não implementado no context
              className="flex items-center justify-center py-2 px-3 rounded border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login com Facebook"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="#1877F2"/>
                <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.9219C17.3438 4.9219 15.9703 4.6875 14.6578 4.6875C11.9156 4.6875 10.125 6.3516 10.125 9.3516V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875