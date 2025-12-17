// src/components/Layout/Navbar.tsx
// VERSÃO FUSION: Lógica Avançada de Rotas + UX Premium (Motion & Backdrop)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ Adicionado para UX
import { useUser } from '../../contexts/UserContext';
import UserMenu from '../common/UserMenu'; // Certifique-se do caminho correto
import { useMenu } from '../../hooks/useMenu';
import routeMapData from '../../data/routeMap.json';
import { normalizePath, tryDynamicMapping } from '../../utils/routeUtils';

type Lang = 'pt' | 'en';

// --- SECURITY UTILS ---
const sanitizePath = (path: string) => {
  const cleanPath = path.replace(/^(?:https?:\/\/[^\/]+)?/, '');
  return cleanPath.startsWith('/') && !cleanPath.startsWith('//') ? cleanPath : '/';
};

// --- LANGUAGE SELECTOR ---
const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = i18n.language && i18n.language.startsWith('pt') ? 'pt' : 'en';
  const routeMap: Record<string, { pt: string; en: string }> = routeMapData as any;

  const changeLanguage = (newLang: Lang) => {
    if (newLang === currentLang) return;

    const rawPath = normalizePath(location.pathname);
    const search = location.search || '';
    const hash = location.hash || '';

    // 1. Mapeamento Direto
    const mapping = routeMap[rawPath];
    if (mapping) {
      const dest = mapping[newLang];
      navigate(sanitizePath(dest) + search + hash);
      return;
    }

    // 2. Mapeamento Dinâmico
    const dyn = tryDynamicMapping(rawPath, newLang);
    if (dyn) {
      navigate(sanitizePath(dyn) + search + hash);
      return;
    }

    // 3. Fallback Padrão
    if (newLang === 'pt') {
      const newPath = rawPath === '/' ? '/pt' : `/pt${rawPath}`;
      navigate(sanitizePath(newPath) + search + hash);
    } else {
      const withoutPt = rawPath.startsWith('/pt') ? rawPath.replace(/^\/pt/, '') || '/' : rawPath;
      navigate(sanitizePath(withoutPt) + search + hash);
    }
  };

  const isPtActive = currentLang === 'pt';

  return (
    <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-sm font-bold transition-colors ${isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
      >
        PT
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-bold transition-colors ${!isPtActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  
  const menuItems = useMenu() || [];

  // ✅ FIX 1: Bloqueia scroll quando menu abre
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // ✅ FIX 2: Fecha menu ao mudar de rota ou apertar ESC
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Detecta scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const handleLoginButtonClick = useCallback(() => {
    setIsMenuOpen(false); // Garante que fecha o menu ao clicar em login
    onLoginClick();
  }, [onLoginClick]);

  // Link home inteligente
  const homeLink = useMemo(() => {
    const currentLang = i18n.language && i18n.language.startsWith('pt') ? 'pt' : 'en';
    return currentLang === 'pt' ? '/pt' : '/';
  }, [i18n.language]);

  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink
        key={item.ID}
        to={item.url}
        end
        target={item.target || '_self'}
        className={({ isActive }) => 
          isMobile 
            ? `text-lg py-3 block border-b border-white/5 ${isActive ? 'text-primary font-bold' : 'text-white/80'}`
            : `nav-link ${isActive ? 'text-primary' : 'text-white/80 hover:text-white'}`
        }
        onClick={() => setIsMenuOpen(false)} // Fecha ao clicar no link
      >
        {item.title}
      </NavLink>
    ))
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-background/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to={homeLink} className="flex items-center z-50" onClick={() => setIsMenuOpen(false)}>
              <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {renderNavLinks()}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center">
              <LanguageSelector />
              {user?.isLoggedIn ? (
                <UserMenu />
              ) : (
                <button onClick={handleLoginButtonClick} className="btn btn-primary flex items-center space-x-2 btn-sm">
                  <LogIn size={16} />
                  <span>{t('sign_in')}</span>
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-white p-2 z-50" onClick={toggleMenu} aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU (Com Framer Motion & Backdrop) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Invisível (Clica fora para fechar) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-[80px] left-0 right-0 bg-surface border-b border-white/10 z-40 md:hidden overflow-y-auto max-h-[80vh] shadow-2xl rounded-b-2xl"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col">
                <nav className="flex flex-col space-y-2" aria-label={t('mobile_navigation')}>
                  {renderNavLinks(true)}
                </nav>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                  {/* Mobile User/Login */}
                  {user?.isLoggedIn ? (
                    <div className="w-full">
                      <UserMenu orientation="vertical" />
                    </div>
                  ) : (
                    <button onClick={handleLoginButtonClick} className="w-full btn btn-primary flex items-center justify-center space-x-2 py-3">
                      <LogIn size={18} />
                      <span>{t('join_the_tribe')}</span>
                    </button>
                  )}

                  {/* Mobile Language */}
                  <div className="flex justify-center pt-2">
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

export default Navbar;