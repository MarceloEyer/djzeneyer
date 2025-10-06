// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Globe, Check } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

// Componente interno para o seletor de idiomas
const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lng: 'pt' | 'en') => {
        const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
        if (lng === currentLang) return;

        const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
        const newPath = lng === 'en' ? (currentPath || '/') : `/pt${currentPath || '/'}`;
        navigate(newPath);
    };

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button 
                onClick={() => changeLanguage('pt')} 
                className={`text-sm font-bold transition-colors ${i18n.language.startsWith('pt') ? 'text-primary' : 'text-white/60 hover:text-white'}`}
            >
                PT
            </button>
            <span className="text-white/20">|</span>
            <button 
                onClick={() => changeLanguage('en')} 
                className={`text-sm font-bold transition-colors ${i18n.language === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'}`}
            >
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
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!window.wpData?.restUrl) return;
      try {
        const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/menu?lang=${langToFetch}`);
        if (!response.ok) throw new Error('Falha ao buscar o menu do WordPress');
        
        const data = await response.json();
        if (Array.isArray(data)) {
            // Lógica mais segura para extrair o caminho da URL
            const formattedData = data.map((item: any) => ({
                ...item,
                url: item.url.replace(window.wpData.siteUrl, '') || '/',
            }));
            setMenuItems(formattedData);
        } else {
            setMenuItems([]);
        }
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
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink key={item.ID} to={item.url} target={item.target || '_self'} className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}>
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={i18n.language.startsWith('pt') ? '/pt' : '/'} className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            <LanguageSelector />
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>{t('sign_in')}</span></button>}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {renderNavLinks(true)}
          </nav>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2"><LogIn size={18} /><span>{t('join_the_tribe')}</span></button>}
            </div>
            <div className="flex-shrink-0">
                <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;