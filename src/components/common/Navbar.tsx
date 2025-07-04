// src/components/common/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn, Music, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import UserMenu from './UserMenu';

// Componente interno para o seletor de idiomas
const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: 'pt' | 'en') => {
    const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
    if (lng === currentLang) return;
    
    const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
    const newPath = lng === 'en' ? (currentPath || '/') : `/pt${currentPath || '/'}`;
    
    navigate(newPath);
  };

  return (
    <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
      <button 
        onClick={() => changeLanguage('pt')} 
        className={`text-sm font-bold transition-colors ${
          i18n.language.startsWith('pt') ? 'text-primary' : 'text-white/60 hover:text-white'
        }`}
      >
        PT
      </button>
      <span className="text-white/20">|</span>
      <button 
        onClick={() => changeLanguage('en')} 
        className={`text-sm font-bold transition-colors ${
          i18n.language === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'
        }`}
      >
        EN
      </button>
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
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { i18n, t } = useTranslation();
  const { user } = useUser();
  const { cart } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Menu padrão quando a API do WordPress não estiver disponível
  const defaultMenuItems = [
    { ID: 1, title: t('menu_home'), url: i18n.language.startsWith('pt') ? '/pt' : '/' },
    { ID: 2, title: t('menu_music'), url: i18n.language.startsWith('pt') ? '/pt/music' : '/music' },
    { ID: 3, title: t('menu_events'), url: i18n.language.startsWith('pt') ? '/pt/events' : '/events' },
    { ID: 4, title: t('menu_tribe'), url: i18n.language.startsWith('pt') ? '/pt/tribe' : '/tribe' },
    { ID: 5, title: t('menu_work'), url: i18n.language.startsWith('pt') ? '/pt/work-with-me' : '/work-with-me' },
    { ID: 6, title: t('menu_shop'), url: i18n.language.startsWith('pt') ? '/pt/shop' : '/shop' },
  ];

  const fetchMenu = useCallback(async () => {
    try {
      if (window.wpData?.restUrl) {
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/menu`);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setMenuItems(data);
            return;
          }
        }
      }
    } catch (error) {
      console.log('WordPress menu API não disponível, usando menu padrão');
    }
    
    // Fallback para menu padrão
    setMenuItems(defaultMenuItems);
  }, [i18n.language, t]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => { 
    setIsMenuOpen(false); 
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  
  const renderNavLinks = (isMobile = false) => (
    menuItems.map((item) => (
      <NavLink 
        key={item.ID} 
        to={item.url} 
        className={({ isActive }) => 
          `nav-link transition-colors duration-200 ${
            isMobile 
              ? "text-lg block py-3 px-4 hover:bg-white/10 rounded-lg text-center" 
              : "relative px-3 py-2"
          } ${
            isActive 
              ? "text-primary" 
              : "text-white/80 hover:text-white"
          }`
        }
        onClick={isMobile ? toggleMenu : undefined}
      >
        {item.title}
      </NavLink>
    ))
  );

  // Calcular número total de itens no carrinho
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to={i18n.language.startsWith('pt') ? '/pt' : '/'} 
            className="flex items-center hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {renderNavLinks()}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative text-white/70 hover:text-white transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              <button 
                onClick={onLoginClick} 
                className="btn btn-primary flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-primary transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation Links */}
              <nav className="space-y-2 mb-6">
                {renderNavLinks(true)}
              </nav>

              {/* Mobile Language Selector */}
              <div className="flex justify-center gap-4 mb-6 py-4 border-y border-white/10">
                <button 
                  onClick={() => {
                    const navigate = useNavigate();
                    const location = useLocation();
                    const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
                    const newPath = `/pt${currentPath || '/'}`;
                    navigate(newPath);
                    toggleMenu();
                  }} 
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    i18n.language.startsWith('pt') 
                      ? 'bg-primary text-white' 
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  Português
                </button>
                <button 
                  onClick={() => {
                    const navigate = useNavigate();
                    const location = useLocation();
                    const currentPath = location.pathname.replace(/^\/(en|pt)/, '');
                    const newPath = currentPath || '/';
                    navigate(newPath);
                    toggleMenu();
                  }} 
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    i18n.language === 'en' 
                      ? 'bg-primary text-white' 
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-4">
                {/* Mobile Cart */}
                <Link 
                  to="/cart" 
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  onClick={toggleMenu}
                >
                  <ShoppingCart size={20} />
                  <span>Carrinho</span>
                  {cartItemsCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {user?.isLoggedIn ? (
                  <div className="text-center">
                    <UserMenu orientation="vertical" />
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      onLoginClick();
                      toggleMenu();
                    }}
                    className="w-full btn btn-primary flex items-center justify-center space-x-2"
                  >
                    <LogIn size={18} />
                    <span>Fazer Login</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;