// src/components/Layout/Navbar.tsx
// FUSION MASTER: Lógica Avançada + UX Premium + Hover Underline Effect

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LogIn,
  Home,
  Calendar,
  ShoppingBag,
  Users,
  Music,
  Briefcase,
  Info,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import UserMenu from '../common/UserMenu';
import { useMenu } from '../../hooks/useMenu';
import routeMapData from '../../data/routeMap.json';
import { normalizePath, tryDynamicMapping } from '../../utils/routeUtils';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';

// ============================================================================
// SECURITY: Path Sanitization (Previne Open Redirect + Path Traversal)
// ============================================================================
const SAFE_PATH_REGEX = /^\/[a-zA-Z0-9\-_\/]*$/;
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

function sanitizePath(path: string): string {
  if (!path || typeof path !== 'string') return '/';

  const trimmed = path.trim();

  try {
    const url = new URL(trimmed, window.location.origin);
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return '/';
    if (url.origin !== window.location.origin) return '/';
  } catch {}

  if (trimmed.startsWith('//')) return '/';
  if (trimmed.includes('..') || trimmed.includes('./')) return '/';
  if (!SAFE_PATH_REGEX.test(trimmed)) return '/';

  const normalized = trimmed.replace(/\/+/g, '/');
  return normalized || '/';
}

function sanitizeHTML(str: string): string {
  if (!str) return '';
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// ============================================================================
// VISUAL HELPER: Cores e Ícones para o Menu Mobile
// ============================================================================
const getLinkVisuals = (url: string) => {
  const path = url.toLowerCase();
  if (path.includes('event'))
    return { icon: <Calendar size={20} />, color: 'text-orange-400', bg: 'bg-orange-500/10' };
  if (path.includes('shop') || path.includes('loja'))
    return { icon: <ShoppingBag size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (path.includes('tribe') || path.includes('tribo'))
    return { icon: <Users size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
  if (path.includes('music') || path.includes('música'))
    return { icon: <Music size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10' };
  if (path.includes('work') || path.includes('trabalhe'))
    return { icon: <Briefcase size={20} />, color: 'text-blue-400', bg: 'bg-blue-500/10' };
  if (path.includes('about') || path.includes('sobre'))
    return { icon: <Info size={20} />, color: 'text-pink-400', bg: 'bg-pink-500/10' };
  return { icon: <Home size={20} />, color: 'text-white/70', bg: 'bg-white/5' };
};

// ============================================================================
// COMPONENT: Language Selector
// ============================================================================
const LanguageSelector: React.FC = React.memo(() => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = useMemo(
    () => (i18n.language?.startsWith('pt') ? 'pt' : 'en'),
    [i18n.language]
  );

  const routeMap: Record<string, { pt: string; en: string }> = routeMapData as any;

  const changeLanguage = useCallback(
    (newLang: 'pt' | 'en') => {
      if (newLang === currentLang) return;

      const rawPath = normalizePath(location.pathname);
      const search = location.search || '';
      const hash = location.hash || '';

      // Tenta mapeamento
      const mapping = routeMap[rawPath];
      if (mapping) {
        navigate(sanitizePath(mapping[newLang]) + search + hash);
        return;
      }

      // Tenta dinâmico
      const dyn = tryDynamicMapping(rawPath, newLang);
      if (dyn) {
        navigate(sanitizePath(dyn) + search + hash);
        return;
      }

      // Fallback
      if (newLang === 'pt') {
        const newPath = rawPath === '/' ? '/pt' : `/pt${rawPath}`;
        navigate(sanitizePath(newPath) + search + hash);
      } else {
        const withoutPt = rawPath.startsWith('/pt') ? rawPath.replace(/^\/pt/, '') || '/' : rawPath;
        navigate(sanitizePath(withoutPt) + search + hash);
      }
    },
    [currentLang, location, navigate]
  );

  return (
    <div
      className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2"
      role="group"
      aria-label="Language selector"
    >
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-sm font-bold transition-colors ${currentLang === 'pt' ? 'text-primary' : 'text-white/60 hover:text-white'}`}
      >
        PT
      </button>
      <span className="text-white/20" aria-hidden="true">
        |
      </span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-bold transition-colors ${currentLang === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

// ============================================================================
// COMPONENT: Navbar (Main)
// ============================================================================
interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = useMenu();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  // 1. Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // 2. Fecha menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // 3. Detecta scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => {
    setIsMenuOpen(false);
    onLoginClick();
  }, [onLoginClick]);

  const homeLink = useMemo(() => getLocalizedRoute('', currentLang), [currentLang]);
  const resolveMenuUrl = useCallback(
    (url: string): string => {
      const rawUrl = url || '/';
      if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

      const [pathWithQuery, hash = ''] = rawUrl.split('#');
      const [path, query = ''] = pathWithQuery.split('?');
      const localizedPath = getLocalizedRoute(path, currentLang);
      const queryPart = query ? `?${query}` : '';
      const hashPart = hash ? `#${hash}` : '';

      return `${localizedPath}${queryPart}${hashPart}`;
    },
    [currentLang]
  );

  // Memoiza os itens processados para evitar cálculos caros no loop de render
  const processedMenuItems = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];

    return menuItems.map(item => {
      const localizedUrl = resolveMenuUrl(item.url || '/');
      const safeUrl = sanitizePath(localizedUrl);
      const safeTitle = sanitizeHTML(item.title || '');
      const isExternal = item.target === '_blank';
      const visuals = getLinkVisuals(safeUrl);

      return {
        ...item,
        safeUrl,
        safeTitle,
        isExternal,
        visuals,
      };
    });
  }, [menuItems, resolveMenuUrl]);

  // Renderiza Links
  const renderNavLinks = useCallback(
    (isMobile = false) => {
      if (!processedMenuItems || processedMenuItems.length === 0) return null;

      return processedMenuItems.map(({ ID, target, safeUrl, safeTitle, isExternal, visuals }) => {
        return (
          <NavLink
            key={ID}
            to={safeUrl}
            end
            target={target || '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isMobile
                ? `group flex items-center justify-between p-3 rounded-xl transition-all duration-300 border border-transparent ${
                    isActive ? `${visuals.bg} border-white/5` : 'hover:bg-white/5'
                  }`
                : // ✨ DESKTOP: Adicionado 'relative group' para o efeito de sublinhado
                  `relative group nav-link py-2 ${isActive ? 'text-primary font-medium' : 'text-white/80 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  {/* Ícone Colorido (Só no Mobile) */}
                  {isMobile && (
                    <div
                      className={`p-2 rounded-lg ${isActive ? visuals.color : 'text-white/50 group-hover:text-white'} ${isActive ? 'bg-black/20' : 'bg-white/5'}`}
                    >
                      {visuals.icon}
                    </div>
                  )}

                  <span
                    className={`${isMobile ? 'text-base font-medium' : ''} ${isActive ? (isMobile ? 'text-white' : '') : 'text-white/80 group-hover:text-white'}`}
                    dangerouslySetInnerHTML={{ __html: safeTitle }}
                  />
                </div>

                {/* ✨ DESKTOP HOVER EFFECT: Linha Azul Elétrico */}
                {!isMobile && (
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-all duration-300 ease-out
                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  />
                )}

                {/* Seta (Só no Mobile) */}
                {isMobile && (
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${isActive ? 'text-primary translate-x-1' : 'text-white/20'}`}
                  />
                )}
              </>
            )}
          </NavLink>
        );
      });
    },
    [processedMenuItems]
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10' : 'bg-transparent py-5'}`}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <Link
              to={homeLink}
              className="flex items-center z-50 group"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Home"
            >
              <span className="text-xl font-display font-bold tracking-wide group-hover:scale-105 transition-transform">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </Link>

            <nav
              className="hidden md:flex items-center space-x-6 lg:space-x-8"
              aria-label="Main navigation"
            >
              {renderNavLinks(false)}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <LanguageSelector />
              {user?.isLoggedIn ? (
                <UserMenu />
              ) : (
                <button
                  onClick={handleLoginButtonClick}
                  className="btn btn-primary btn-sm flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <LogIn size={16} />
                  <span>{t('sign_in')}</span>
                </button>
              )}
            </div>

            <button
              className="md:hidden text-white p-2 z-50 active:scale-90 transition-transform"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU (Drawer com Framer Motion) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />

            <motion.div
              ref={mobileMenuRef}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 bg-[#0f0f0f] z-40 md:hidden shadow-2xl rounded-b-3xl border-b border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <div className="pt-24 pb-8 px-4 flex flex-col">
                <nav className="flex flex-col space-y-2 mb-6" aria-label="Mobile navigation">
                  {renderNavLinks(true)}
                </nav>

                <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                  {user?.isLoggedIn ? (
                    <div className="w-full">
                      <UserMenu orientation="vertical" />
                    </div>
                  ) : (
                    <button
                      onClick={handleLoginButtonClick}
                      className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
                    >
                      <LogIn size={18} />
                      <span className="font-bold">{t('join_the_tribe')}</span>
                    </button>
                  )}

                  <div className="flex justify-center pt-2 pb-4">
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
