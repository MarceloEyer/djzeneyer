// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Music, Calendar, Users, Menu, X, Briefcase, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "nav-link active" : "nav-link";

  const navLinkWithIconClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "nav-link active flex items-center space-x-1" : "nav-link flex items-center space-x-1";
    
  const mobileNavLinkWithIconClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active text-lg flex items-center space-x-2" : "nav-link text-lg flex items-center space-x-2";

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
          
          {/* LOGO ATUALIZADO */}
          <div className="flex items-center gap-4">
            {/* O seletor de idioma agora vive aqui */}
            <LanguageSwitcher />

            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </Link>
          </div>

          {/* MENU DESKTOP */}
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

      {/* MENU MOBILE */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-b border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <NavLink to="/" className={mobileNavLinkWithIconClass}>Home</NavLink>
            <NavLink to="/music" className={mobileNavLinkWithIconClass}><Music size={18} /><span>Music</span></NavLink>
            <NavLink to="/events" className={mobileNavLinkWithIconClass}><Calendar size={18} /><span>Events</span></NavLink>
            <NavLink to="/tribe" className={mobileNavLinkWithIconClass}><Users size={18} /><span>Zen Tribe</span></NavLink>
            <NavLink to="/work-with-me" className={mobileNavLinkWithIconClass}><Briefcase size={18} /><span>Work With Me</span></NavLink>
          </nav>

          {/* BOTÃO DE LOGIN E SELETOR DE IDIOMA NO MOBILE */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? (
                <UserMenu orientation="vertical" /> 
              ) : (
                <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2">
                  <LogIn size={18} />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
            <div className="flex-shrink-0">
              {/* ADICIONADO AQUI */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;