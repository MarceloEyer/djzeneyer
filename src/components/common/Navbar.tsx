// Caminho: src/components/common/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Music, Calendar, Users, Menu, X, Briefcase, LogIn } from 'lucide-react'; // Adicionado LogIn
import { useUser } from '../../contexts/UserContext'; // Ajuste o caminho se necessário
import UserMenu from './UserMenu'; // Ajuste o caminho se necessário

interface NavbarProps {
  onLoginClick: () => void;
  // onRegisterClick não é mais estritamente necessário se o modal tem um toggle
  // e o botão principal abre o modal em modo login.
  // Mas MainLayout ainda a define, então podemos mantê-la ou refatorar depois.
  onRegisterClick: () => void; // Mantendo por enquanto, mas o botão principal usará onLoginClick
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUser(); // Adicionado logout aqui para o UserMenu
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false); // Fecha o menu mobile ao mudar de rota
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthButtonClick = () => {
    console.log('[Navbar] Botão de Autenticação (Acessar Zen Tribe / Login) clicado!');
    onLoginClick(); // Abre o modal no modo 'login' por padrão
  };

  const handleJoinTribeMobileClick = () => {
    console.log('[Navbar] Botão Join Tribe (mobile) clicado!');
    onRegisterClick(); // Abre o modal no modo 'register'
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <Music 
                size={28} 
                className="text-primary group-hover:opacity-0 transition-opacity duration-300" 
              />
              <span 
                className="absolute inset-0 flex items-center justify-center text-xl font-display font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                ZEN
              </span>
            </div>
            <span className="text-xl font-display font-bold tracking-wide">
              <span className="text-primary">DJ</span> Zen Eyer
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/music" className={({ isActive }) => isActive ? "nav-link active flex items-center space-x-1" : "nav-link flex items-center space-x-1"}><Music size={16} /><span>Music</span></NavLink>
            <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active flex items-center space-x-1" : "nav-link flex items-center space-x-1"}><Calendar size={16} /><span>Events</span></NavLink>
            <NavLink to="/tribe" className={({ isActive }) => isActive ? "nav-link active flex items-center space-x-1" : "nav-link flex items-center space-x-1"}><Users size={16} /><span>Zen Tribe</span></NavLink>
            <a 
              href="https://work.djzeneyer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link flex items-center space-x-1"
            >
              <Briefcase size={16} />
              <span>Work With Me</span>
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              // Botão ÚNICO para desktop quando deslogado
              <button 
                onClick={handleAuthButtonClick} 
                className="btn btn-primary flex items-center space-x-2"
              >
                <LogIn size={18} /> 
                <span>Acessar Zen Tribe</span>
              </button>
            )}
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen border-b border-white/10' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active text-lg" : "nav-link text-lg"}>Home</NavLink>
            <NavLink to="/music" className={({ isActive }) => isActive ? "nav-link active text-lg flex items-center space-x-2" : "nav-link text-lg flex items-center space-x-2"}><Music size={18} /><span>Music</span></NavLink>
            <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active text-lg flex items-center space-x-2" : "nav-link text-lg flex items-center space-x-2"}><Calendar size={18} /><span>Events</span></NavLink>
            <NavLink to="/tribe" className={({ isActive }) => isActive ? "nav-link active text-lg flex items-center space-x-2" : "nav-link text-lg flex items-center space-x-2"}><Users size={18} /><span>Zen Tribe</span></NavLink>
            <a 
              href="https://work.djzeneyer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link text-lg flex items-center space-x-2"
            >
              <Briefcase size={18} />
              <span>Work With Me</span>
            </a>
          </nav>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col space-y-3">
            {user?.isLoggedIn ? (
              <UserMenu orientation="vertical" /> // Supondo que UserMenu aceite 'orientation'
            ) : (
              <>
                {/* No mobile, mantive os dois botões separados por clareza, mas você pode unificar também */}
                <button 
                  onClick={handleAuthButtonClick} 
                  className="w-full py-3 text-center text-white/90 hover:text-white transition-colors border border-white/20 rounded-md"
                >
                  Login
                </button>
                <button 
                  onClick={handleJoinTribeMobileClick} // Chama a função que abre o modal em modo 'register'
                  className="w-full btn btn-primary"
                >
                  Join Tribe
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;