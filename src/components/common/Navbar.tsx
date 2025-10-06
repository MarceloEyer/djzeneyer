// src/components/common/Navbar.tsx - VERSÃO DE TESTE
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Music, Calendar, Users, Menu, X, Briefcase, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
// import LanguageSwitcher from './LanguageSwitcher'; // TEMPORARIAMENTE DESATIVADO

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link";
  const navLinkWithIconClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active flex items-center space-x-1" : "nav-link flex items-center space-x-1";
    
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/music" className={navLinkWithIconClass}><Music size={16} /><span>Music</span></NavLink>
            <NavLink to="/events" className={navLinkWithIconClass}><Calendar size={16} /><span>Events</span></NavLink>
            <NavLink to="/tribe" className={navLinkWithIconClass}><Users size={16} /><span>Zen Tribe</span></NavLink>
            <NavLink to="/work-with-me" className={navLinkWithIconClass}><Briefcase size={16} /><span>Work With Me</span></NavLink>
          </nav>
          <div className="hidden md:flex items-center">
            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2">
                <LogIn size={18} /> 
                <span>Login</span>
              </button>
            )}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* ... (Menu Mobile, pode manter como está, apenas sem o LanguageSwitcher) ... */}
    </header>
  );
});

export default Navbar;