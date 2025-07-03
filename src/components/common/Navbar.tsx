// src/components/common/Navbar.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react'; // useRef foi adicionado aqui
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, Calendar, Users, Menu, X, Briefcase, LogIn, Globe, Check } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';

// O seletor de idiomas agora faz parte do Navbar para simplificar
const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
  ];

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button onClick={() => setIsOpen(!isOpen)} className="text-white/70 hover:text-white transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Globe size={24} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 lg:left-0 mt-2 w-40 bg-surface border border-white/10 rounded-lg shadow-lg z-50">
            <ul className="py-1">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 flex items-center justify-between">
                    <span>{lang.name}</span>
                    {i18n.language.startsWith(lang.code) && <Check size={16} className="text-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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
            <LanguageSwitcher />
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
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : <button onClick={onLoginClick} className="w-full btn btn-primary flex items-center justify-center space-x-2"><LogIn size={18} /><span>{t('join_the_tribe')}</span></button>}
            </div>
            {/* O seletor de idiomas no mobile já está no logo, mas poderia ser movido para cá se preferir */}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;