// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';
import { useMenu } from '../../hooks/useMenu';
import routeMapData from '../../data/routeMap.json';
import { normalizePath, tryDynamicMapping } from '../../utils/routeUtils';

type Lang = 'pt' | 'en';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const routeMap: Record<string, { pt: string; en: string }> = routeMapData as any;

  const changeLanguage = (newLang: Lang) => {
    if (newLang === currentLang) return;

    const rawPath = normalizePath(location.pathname);
    const search = location.search;
    const hash = location.hash;

    // 1. Mapeamento direto
    const mapping = routeMap[rawPath];
    if (mapping) {
      navigate(mapping[newLang] + search + hash);
      return;
    }

    // 2. Mapeamento dinâmico
    const dyn = tryDynamicMapping(rawPath, newLang);
    if (dyn) {
      navigate(dyn + search + hash);
      return;
    }

    // 3. Fallback com prefixo
    if (newLang === 'pt') {
      const newPath = rawPath === '/' ? '/pt' : `/pt${rawPath}`;
      navigate(newPath + search + hash);
    } else {
      const withoutPt = rawPath.startsWith('/pt') ? rawPath.replace(/^\/pt/, '') || '/' : rawPath;
      navigate(withoutPt + search + hash);
    }
  };

  const isPtActive = currentLang === 'pt';

  return (
    <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-sm font-bold transition-colors ${isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
        aria-pressed={isPtActive}
      >
        PT
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-bold transition-colors ${!isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
        aria-pressed={!isPtActive}
      >
        EN
      </button>
    </div>
  );
};

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = useMenu() || [];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  // ✅ HOME LINK DINÂMICO (responde a mudanças de idioma em tempo real)
  const homeLink = useMemo(() => {
    return i18n.language?.startsWith('pt') ? '/pt' : '/';
  }, [i18n.language]); // ← depende de i18n.language, não de useParams

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink
        key={item.ID}
        to={item.url}
        // ❌ REMOVIDO: end → permite estilo ativo em rotas filhas
        target={item.target || '_self'}
        className={({ isActive }) =>
          `transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-primary'} ${isMobile ? 'text-lg block py-2 text-center' : ''}`
        }
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
          <Link to={homeLink} className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label={t('main_navigation')}>
            {renderNavLinks()}
          </nav>

          <div className="hidden md:flex items-center">
            <LanguageSelector />
            {user?.isLoggedIn ? <UserMenu /> : (
              <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2" aria-label={t('sign_in')}>
                <LogIn size={18} />
                <span>{t('sign_in')}</span>
              </button>
            )}
          </div>

          <button className="md:hidden text-white" onClick={toggleMenu} aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4" aria-label={t('mobile_navigation')}>
            {renderNavLinks(true)}
          </nav>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? <UserMenu orientation="vertical" /> : (
                <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2" aria-label={t('join_the_tribe')}>
                  <LogIn size={18} />
                  <span>{t('join_the_tribe')}</span>
                </button>
              )}
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