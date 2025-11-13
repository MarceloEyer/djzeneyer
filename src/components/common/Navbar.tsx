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

// Função de segurança para garantir que o redirecionamento seja sempre interno (Corrige Open Redirect - Snyk)
const sanitizePath = (path: string) => {
  // Remove qualquer coisa que pareça um protocolo (http:) ou domínio
  // Garante que começa com / e não é // (protocol relative)
  const cleanPath = path.replace(/^(?:https?:\/\/[^\/]+)?/, '');
  return cleanPath.startsWith('/') && !cleanPath.startsWith('//') 
    ? cleanPath 
    : '/';
};

// Componente seletor de idioma PT/EN
const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = i18n.language && i18n.language.startsWith('pt') ? 'pt' : 'en';
  const routeMap: Record<string, { pt: string; en: string }> = routeMapData as any;

  // Função para trocar idioma e navegar para rota equivalente
  const changeLanguage = (newLang: Lang) => {
    if (newLang === currentLang) return;

    const rawPath = normalizePath(location.pathname);
    const search = location.search || '';
    const hash = location.hash || '';

    console.debug('[LanguageSelector] changeLanguage:', { from: currentLang, to: newLang, rawPath });

    // Tenta mapeamento direto das rotas (ex: /pt -> /)
    const mapping = routeMap[rawPath];
    if (mapping) {
      const dest = mapping[newLang];
      console.debug('[LanguageSelector] direct mapping ->', dest);
      // Aplica sanitização antes de navegar
      navigate(sanitizePath(dest) + search + hash);
      return;
    }

    // Tenta mapeamento dinâmico para rotas parametrizadas
    const dyn = tryDynamicMapping(rawPath, newLang);
    if (dyn) {
      console.debug('[LanguageSelector] dynamic mapping ->', dyn);
      // Aplica sanitização antes de navegar
      navigate(sanitizePath(dyn) + search + hash);
      return;
    }

    // Fallback: adiciona ou remove /pt do caminho
    if (newLang === 'pt') {
      const newPath = rawPath === '/' ? '/pt' : `/pt${rawPath}`;
      console.debug('[LanguageSelector] fallback prefix ->', newPath);
      navigate(sanitizePath(newPath) + search + hash);
      return;
    } else {
      const withoutPt = rawPath.startsWith('/pt') ? rawPath.replace(/^\/pt/, '') || '/' : rawPath;
      console.debug('[LanguageSelector] fallback remove pt ->', withoutPt);
      navigate(sanitizePath(withoutPt) + search + hash);
      return;
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
  const { lang } = useParams<{ lang?: string }>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMenu() || [];

  // Fecha menu mobile ao trocar de página
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  // Detecta scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => onLoginClick(), [onLoginClick]);

  // Renderiza links do menu com NavLink para estilo ativo
  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => {
      const finalToPath = item.url;
      return (
        <NavLink
          key={item.ID}
          to={finalToPath}
          end // FIX: Força match exato da rota, evitando dupla linha azul em PT
          target={item.target || '_self'}
          className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}
        >
          {item.title}
        </NavLink>
      );
    })
  );

  // Link home preservando idioma atual
  const homeLink = useMemo(() => {
    const currentLang = i18n.language && i18n.language.startsWith('pt') ? 'pt' : 'en';
    return currentLang === 'pt' ? '/pt' : '/';
  }, [i18n.language]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={homeLink} className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label={t('main_navigation')}>
            {renderNavLinks()}
          </nav>

          {/* Seletor de idioma e Login/User menu - Desktop */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              // Removido aria-label redundante (texto visível "Sign In" já é suficiente)
              <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2">
                <LogIn size={18} />
                <span>{t('sign_in')}</span>
              </button>
            )}
          </div>

          {/* Botão hamburger - Mobile */}
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4" aria-label={t('mobile_navigation')}>
            {renderNavLinks(true)}
          </nav>

          {/* Login/User menu e seletor de idioma - Mobile */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex-grow pr-4">
              {user?.isLoggedIn ? (
                <UserMenu orientation="vertical" />
              ) : (
                // Removido aria-label redundante (texto visível "Join the Tribe" já é suficiente)
                <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2">
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