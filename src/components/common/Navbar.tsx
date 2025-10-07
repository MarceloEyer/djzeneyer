// src/components/common/Navbar.tsx

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import throttle from 'lodash.throttle';

// Contexto para configuração de API
const ApiConfigContext = createContext<{ restUrl: string }>({ restUrl: '' });
export const ApiConfigProvider: React.FC<{ restUrl: string }> = ({ restUrl, children }) => (
  <ApiConfigContext.Provider value={{ restUrl }}>{children}</ApiConfigContext.Provider>
);

// Hook para fetch do menu com cancelamento
const useMenu = (lang: string) => {
  const { restUrl } = useContext(ApiConfigContext);
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${restUrl}djzeneyer/v1/menu?lang=${lang}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar menu');
        return res.json();
      })
      .then((data: any[]) => {
        const normalized = data.map(item => ({
          ...item,
          url: (() => {
            let path = item.url.replace(restUrl.replace(/\/$/, ''), '');
            path = path.replace(/^\/(en|pt)/, '');
            return path.startsWith('/') ? path : `/${path}`;
          })(),
        }));
        setItems(normalized);
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, [restUrl, lang]);
  return items;
};

// Helpers de responsividade
const DesktopOnly: React.FC = ({ children }) => <div className="hidden md:flex">{children}</div>;
const MobileOnly: React.FC = ({ children }) => <div className="md:hidden">{children}</div>;

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const menuItems = useMenu(currentLang);

  // Listener de scroll otimizado
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100);
    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lng: 'pt' | 'en') => {
    if (lng === currentLang) return;
    const base = location.pathname.replace(/^\/(en|pt)/, '');
    navigate(lng === 'en' ? base || '/' : `/pt${base || '/'}`);
  };

  const renderNavLinks = useCallback(
    (isMobile = false) =>
      menuItems.map(item => (
        <NavLink
          key={item.ID}
          to={`/${currentLang}${item.url}`}
          target={item.target || '_self'}
          aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          className={isMobile ? 'nav-link text-lg block py-2 text-center' : 'nav-link'}
        >
          {item.title}
        </NavLink>
      )),
    [menuItems, currentLang]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={`/${currentLang}`} aria-label={t('home')} className="flex items-center">
          <span className="text-xl font-display font-bold tracking-wide">
            <span className="text-primary">DJ</span> Zen Eyer
          </span>
        </Link>

        {/* Desktop nav */}
        <DesktopOnly>
          <nav className="items-center space-x-6 lg:space-x-8">{renderNavLinks()}</nav>
        </DesktopOnly>

        {/* Actions desktop */}
        <DesktopOnly>
          <LanguageSelector />
          {user?.isLoggedIn ? (
            <UserMenu />
          ) : (
            <button
              onClick={onLoginClick}
              className="btn btn-primary flex items-center space-x-2"
              aria-label={t('sign_in')}
            >
              <LogIn size={18} />
              <span>{t('sign_in')}</span>
            </button>
          )}
        </DesktopOnly>

        {/* Mobile toggle */}
        <MobileOnly>
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
            className="text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </MobileOnly>
      </div>

      {/* Mobile menu */}
      <MobileOnly>
        <div
          className={`absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 p-4">{renderNavLinks(true)}</nav>
          <div className="border-t border-white/10 pt-4 px-4 flex items-center justify-between">
            {user?.isLoggedIn ? (
              <UserMenu orientation="vertical" />
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
                aria-label={t('sign_in')}
              >
                <LogIn size={18} />
                <span>{t('sign_in')}</span>
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </MobileOnly>
    </header>
  );
});

export default Navbar;
