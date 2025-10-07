// src/components/common/Navbar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lng: 'pt' | 'en') => {
        const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
        if (lng === currentLang) return;

        const basePath = location.pathname.replace(/^\/(en|pt)/, '');
        const newPath = lng === 'en' ? (basePath || '/') : `/pt${basePath || '/'}`;
        navigate(newPath);
    };

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button onClick={() => changeLanguage('pt')} className={`text-sm font-bold transition-colors ${i18n.language.startsWith('pt') ? 'text-primary' : 'text-white/60 hover:text-white'}`}>PT</button>
            <span className="text-white/20">|</span>
            <button onClick={() => changeLanguage('en')} className={`text-sm font-bold transition-colors ${i18n.language === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
};

interface NavbarProps { onLoginClick: () => void; }
interface MenuItem { ID: number; title: string; url: string; }

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
  const { i18n } = useTranslation();
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!window.wpData?.restUrl) return;
      try {
        const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/menu?lang=${langToFetch}`);
        if (!response.ok) throw new Error('Menu not found');
        const data = await response.json();
        if (Array.isArray(data)) {
            const formattedData = data.map((item: any) => ({ ...item, url: new URL(item.url).pathname }));
            setMenuItems(formattedData);
        }
      } catch (error) { console.error("Falha ao buscar menu:", error); }
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
  
  const renderNavLinks = (isMobile = false) => (
      menuItems.map((item) => (
          <NavLink key={item.ID} to={item.url} className={isMobile ? "nav-link text-lg block py-2 text-center" : "nav-link"}>
              {item.title}
          </NavLink>
      ))
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'} py-3`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={i18n.language.startsWith('pt') ? '/pt' : '/'} className="flex items-center">
            <span className="text-xl font-display font-bold tracking-wide"><span className="text-primary">DJ</span> Zen Eyer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {renderNavLinks()}
          </nav>
          <div className="hidden md:flex items-center">
            <LanguageSelector />
            {user?.isLoggedIn ? <UserMenu /> : <button onClick={onLoginClick} className="btn btn-primary flex items-center space-x-2"><LogIn size={18} /><span>Login</span></button>}
          </div>
          <button className="md-hidden text-white" onClick={toggleMenu}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
       {/* Cole o código completo do seu menu mobile aqui, garantindo que ele também tenha o LanguageSelector, se desejado */}
    </header>
  );
});

export default Navbar;