// src/components/common/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

// Seletor de Idiomas com design melhorado
const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: 'pt' | 'en') => {
        const currentPath = window.location.pathname.replace(/^\/(en|pt)/, '');
        const newPath = lng === 'en' ? currentPath : `/${lng}${currentPath}`;
        window.location.pathname = newPath === '' ? '/' : newPath;
    };

    return (
        <div className="flex items-center gap-2 bg-surface/50 border border-white/10 rounded-full px-2 py-1">
            <button onClick={() => changeLanguage('pt')} className={`px-2 py-1 text-xs font-bold rounded-full transition-colors ${i18n.language.startsWith('pt') ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}>
                PT
            </button>
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded-full transition-colors ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}>
                EN
            </button>
        </div>
    );
};


interface NavbarProps {
  onLoginClick: () => void;
}

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!(window as any).wpData?.restUrl) return;
      try {
        const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
        const response = await fetch(`${(window as any).wpData.restUrl}djzeneyer/v1/menu?lang=${langToFetch}`);
        if (!response.ok) throw new Error('Falha ao buscar o menu');
        const data = await response.json();
        
        const formattedData = data.map((item: any) => ({
            ...item,
            url: item.url.replace((window as any).wpData.siteUrl, '') || '/',
        }));
        setMenuItems(formattedData);
      } catch (error) {
        console.error("Falha ao buscar menu:", error);
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, [i18n.language]);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink key={item.ID} to={item.url} target={item.target || '_self'} className={isMobile ? "nav-link active text-lg" : "nav-link"}>
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={onLoginClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>Login</span></button>}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden ... ${isMenuOpen ? 'max-h-screen...' : 'max-h-0'}`}>
         {/* ... (lógica do menu mobile) ... */}
      </div>
    </header>
  );
});

export default Navbar;