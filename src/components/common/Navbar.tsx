// src/components/common/Navbar.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

// --- Componente interno para o seletor de idiomas estilo "Interruptor" ---
const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lng: 'pt' | 'en') => {
        const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
        if (lng === currentLang) return; // Não faz nada se já estiver no idioma selecionado

        const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
        const newPath = lng === 'en' ? (currentPath || '/') : `/pt${currentPath || '/'}`;
        navigate(newPath);
    };

    return (
        <div className="flex items-center gap-2 bg-surface/50 border border-white/10 rounded-full p-1">
            <button 
                onClick={() => changeLanguage('en')} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-300 ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
            >
                EN
            </button>
            <button 
                onClick={() => changeLanguage('pt')} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-300 ${i18n.language.startsWith('pt') ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
            >
                PT
            </button>
        </div>
    );
};


// --- Componente Principal do Navbar ---
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
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!window.wpData?.restUrl) return;
      try {
        const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/menu?lang=${langToFetch}`);
        if (!response.ok) throw new Error('Falha ao buscar o menu do WordPress');
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
            ...item,
            url: item.url.replace(window.wpData.siteUrl, '') || '/',
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
      <NavLink key={item.ID} to={item.url} target={item.target || '_self'} className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}>
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* O INTERRUPTOR DE IDIOMA NO LUGAR DO LOGO */}
            <LanguageToggle />
            <Link to={i18n.language.startsWith('pt') ? '/pt' : '/'} className="flex items-center">
              <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={onLoginClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>{t('sign_in', 'Login')}</span></button>}
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
                {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : <button onClick={onLoginClick} className="w-full btn btn-primary flex items-center justify-center space-x-2"><LogIn size={18} /><span>{t('join_the_tribe','Login / Sign Up')}</span></button>}
            </div>
            {/* Seletor de idioma no mobile pode ser adicionado aqui, mas o design atual já o contempla no topo */}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;