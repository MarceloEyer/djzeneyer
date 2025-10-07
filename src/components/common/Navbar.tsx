// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { useMenu } from '../../hooks/useMenu';
import throttle from 'lodash.throttle';

const NAV_LINK_CLASS = "text-white/80 hover:text-primary transition-colors";
const DESKTOP_ONLY = "hidden md:flex";
const MOBILE_ONLY = "md:hidden";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const menuItems = useMenu(currentLang);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => setIsScrolled(window.scrollY > 50), 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const changeLanguage = useCallback((lng: 'pt' | 'en') => {
    if (lng === currentLang) return;
    const base = location.pathname.replace(/^\/(en|pt)/, '');
    navigate(lng === 'en' ? base || '/' : `/pt${base || '/'}`);
  }, [currentLang, location.pathname, navigate]);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map(item => (
      <NavLink
        key={item.ID}
        to={item.url}
        target={item.target || '_self'}
        className={`${NAV_LINK_CLASS} ${isMobile ? "text-lg block py-2 text-center" : ""}`}
        aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
      >
        {item.title}
      </NavLink>
    ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={currentLang === 'pt' ? '/pt' : '/'} aria-label={t('home')} className="flex items-center flex-shrink-0">
            <span className="text-xl font-display font-bold tracking-wide">
              <span className="text-primary">DJ</span> Zen Eyer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={DESKTOP_ONLY + " items-center flex-1 justify-center"}>
            <div className="flex items-center gap-6 lg:gap-8">
              {renderNavLinks(false)}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className={DESKTOP_ONLY + " items-center gap-4 flex-shrink-0"}>
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              {[ 'pt', 'en' ].map(lng => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng as 'pt' | 'en')}
                  className={`text-sm font-bold transition-all ${currentLang === lng ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                  aria-label={t(`change_language_${lng}`)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              <button onClick={onLoginClick} className="btn btn-primary flex items-center gap-2" aria-label={t('sign_in')}>
                <LogIn size={18} /><span>{t('sign_in')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={MOBILE_ONLY + " text-white"}
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className={`${MOBILE_ONLY} absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">{renderNavLinks(true)}</nav>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            {user?.isLoggedIn ? (
              <UserMenu orientation="vertical" />
            ) : (
              <button onClick={onLoginClick} className="w-full btn btn-primary flex items-center justify-center space-x-2" aria-label={t('sign_in')}>
                <LogIn size={18} /><span>{t('join_the_tribe')}</span>
              </button>
            )}
            <div className="flex flex-shrink-0 items-center gap-2">
              {[ 'pt', 'en' ].map(lng => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng as 'pt' | 'en')}
                  className={`text-sm font-bold ${currentLang === lng ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                  aria-label={t(`change_language_${lng}`)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
