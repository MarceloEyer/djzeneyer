// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { useMenu } from '../../hooks/useMenu';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useParams<{ lang?: string }>();

    const currentLang = lang || 'en';

    const changeLanguage = (newLang: 'pt' | 'en') => {
        if (newLang === currentLang) return;

        let currentPath = location.pathname;

        if (currentPath.startsWith('/pt/')) {
            currentPath = currentPath.replace(/^\/pt/, '');
        } else if (currentPath === '/pt') {
            currentPath = '/';
        } else if (currentPath.startsWith('/en/')) {
            currentPath = currentPath.replace(/^\/en/, '');
        } else if (currentPath === '/en') {
            currentPath = '/';
        }

        let newPath: string;
        if (newLang === 'pt') {
            newPath = currentPath === '/' ? '/pt' : `/pt${currentPath}`;
        } else {
            newPath = currentPath;
        }

        navigate(newPath);
    };

    const isPtActive = currentLang === 'pt';
    const isEnActive = currentLang === 'en';

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button onClick={() => changeLanguage('pt')} className={`text-sm font-bold transition-colors ${isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}>PT</button>
            <span className="text-white/20">|</span>
            <button onClick={() => changeLanguage('en')} className={`text-sm font-bold transition-colors ${isEnActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
};

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  
  const menuItems = useMenu();

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => {
      const finalToPath = item.url;

      return (
        <NavLink
          key={item.ID}
          to={finalToPath}
          target={item.target || '_self'}
          className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}
        >
          {item.title}
        </NavLink>
      );
    })
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={`/${lang || ''}`} className="flex items-center">
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