// src/components/common/Navbar.tsx - Versão Final Dinâmica

import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  onLoginClick: () => void;
}

// Nova interface para os itens de menu que vêm da API
interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const { language } = useLanguage(); // Pega o idioma atual do contexto
  const location = useLocation();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Estado para guardar os itens do menu

  // Busca o menu da API sempre que o idioma mudar
  useEffect(() => {
    const fetchMenu = async () => {
      if (!window.wpData?.restUrl) return;

      try {
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/menu?lang=${language}`);
        const data = await response.json();
        
        // Transforma a URL completa (ex: https://site.com/events) em uma rota interna (/events)
        const formattedData = data.map((item: any) => ({
          ...item,
          url: item.url.replace(window.wpData.siteUrl, '') || '/',
        }));
        setMenuItems(formattedData);
      } catch (error) {
        console.error("Falha ao buscar menu:", error);
      }
    };

    fetchMenu();
  }, [language]); // A dependência é o idioma, então ele busca novamente quando o idioma muda

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link";
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active text-lg" : "nav-link text-lg";

  // Componente para renderizar os links, para não repetir código
  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink 
        key={item.ID} 
        to={item.url} 
        target={item.target || '_self'}
        className={isMobile ? mobileNavLinkClass : navLinkClass}
      >
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={onLoginClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>Login</span></button>}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu}><span className="sr-only">Toggle menu</span>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-b border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {renderNavLinks(true)}
          </nav>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
             {/* ... (lógica de login/user menu para mobile) ... */}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;