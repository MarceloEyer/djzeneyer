// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

// O seletor de idiomas como um componente interno para organização
const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('pt') ? 'en' : 'pt';
        i18n.changeLanguage(newLang);
    };

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
    };

    return (
        <div
            onClick={toggleLanguage}
            className={`flex items-center w-[60px] h-8 p-1 cursor-pointer rounded-full transition-colors duration-300 bg-surface/50 border border-white/10`}
            data-is-portuguese={i18n.language.startsWith('pt')}
        >
            <motion.div className="w-6 h-6 bg-white rounded-full" layout transition={spring} />
            <div className="absolute inset-0 flex justify-around items-center px-2">
                <span className={`text-xs font-bold transition-colors ${i18n.language === 'en' ? 'text-primary' : 'text-white/50'}`}>EN</span>
                <span className={`text-xs font-bold transition-colors ${i18n.language.startsWith('pt') ? 'text-primary' : 'text-white/50'}`}>PT</span>
            </div>
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
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!(window as any).wpData?.restUrl) return;
      try {
        const response = await fetch(`${(window as any).wpData.restUrl}djzeneyer/v1/menu?lang=${i18n.language}`);
        if (!response.ok) throw new Error('Falha ao buscar o menu');
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          ...item,
          url: (item.url.replace((window as any).wpData.siteUrl, '') || '/').replace(/^\/en\//, '/').replace(/^\/pt\//, '/pt/'),
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link";
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active text-lg" : "nav-link text-lg";

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink key={item.ID} to={item.url} target={item.target || '_self'} className={isMobile ? mobileNavLinkClass : navLinkClass}>
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* O INTERRUPTOR DE IDIOMA NO LUGAR DO LOGO */}
            <LanguageToggle />
            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={onLoginClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>{t('sign_in')}</span></button>}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-b border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {renderNavLinks(true)}
          </nav>
          <div className="mt-6 pt-4 border-t border-white/10">
            {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : <button onClick={onLoginClick} className="w-full btn btn-primary flex items-center justify-center space-x-2"><LogIn size={18} /><span>{t('join_the_tribe')}</span></button>}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;