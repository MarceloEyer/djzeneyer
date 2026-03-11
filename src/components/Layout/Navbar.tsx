// src/components/Layout/Navbar.tsx
// Optimized Navbar: SSR Security + UX + Performance

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    Newspaper
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from '../common/UserMenu';
import { useMenu } from '../../hooks/useMenu';
import { usePrefetchOnHover } from '../../hooks/usePrefetchOnHover';
import { getLocalizedRoute, normalizeLanguage, getAlternateLinks } from '../../config/routes';
import { safeRedirect, sanitizePath } from '../../utils/sanitize';

// ============================================================================
// HELPERS
// ============================================================================
const getLinkVisuals = (url: string) => {
    const path = url.toLowerCase();
    if (path.includes('event'))
        return { icon: <Calendar size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('shop') || path.includes('loja'))
        return { icon: <ShoppingBag size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('tribe') || path.includes('tribo'))
        return { icon: <Users size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('music') || path.includes('música') || path.includes('musica'))
        return { icon: <Music size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('work') || path.includes('trabalhe'))
        return { icon: <Briefcase size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('media') || path.includes('midia'))
        return { icon: <Newspaper size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    if (path.includes('about') || path.includes('sobre'))
        return { icon: <Info size={20} />, color: 'text-primary', bg: 'bg-primary/10' };
    return { icon: <Home size={20} />, color: 'text-white/70', bg: 'bg-white/5' };
};

const LanguageSelector: React.FC = React.memo(() => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const currentLang = useMemo(
        () => (i18n.language?.startsWith('pt') ? 'pt' : 'en'),
        [i18n.language]
    );

    const changeLanguage = useCallback(
        (newLang: 'pt' | 'en') => {
            if (newLang === currentLang) return;
            const alternates = getAlternateLinks(location.pathname, currentLang);
            const targetPath = alternates[newLang] || (newLang === 'pt' ? '/pt/' : '/');
            // Usamos safeRedirect para garantir que o path resultante seja interno e seguro
            const finalPath = safeRedirect(sanitizePath(targetPath) + (location.search || '') + (location.hash || ''), '/');
            navigate(finalPath);
        },
        [currentLang, location, navigate]
    );

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button onClick={() => changeLanguage('pt')} className={`text-sm font-bold ${currentLang === 'pt' ? 'text-primary' : 'text-white/60 hover:text-white'}`}>PT</button>
            <span className="text-white/20">|</span>
            <button onClick={() => changeLanguage('en')} className={`text-sm font-bold ${currentLang === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
});

interface MenuItemData {
    safeUrl: string;
    safeTitle: string;
    visuals?: { icon: JSX.Element; color: string; bg: string };
    target?: string;
    [key: string]: unknown;
}

interface MenuItemProps {
    item: MenuItemData;
    isMobile: boolean;
    onNavigate: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isMobile, onNavigate }) => {
    const { t } = useTranslation();
    const { safeUrl, safeTitle, visuals, target } = item;
    const isExternal = safeUrl.startsWith('http');
    const isBlank = target === '_blank';

    const commonClass = isMobile
        ? `group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent`
        : `relative group nav-link py-2 text-white/80 hover:text-white transition-colors`;

    const activeMobileClass = 'bg-primary/10 border-white/5';

    if (isExternal) {
        return (
            <a
                href={safeUrl}
                target={target || '_self'}
                rel={isBlank ? 'noopener noreferrer' : undefined}
                aria-label={isBlank ? `${safeTitle} (${t('common.opens_in_new_tab')})` : safeTitle}
                className={commonClass}
                onClick={onNavigate}
            >
                <div className="flex items-center gap-3">
                    {isMobile && <div className="p-2 rounded-lg bg-white/5 text-white/50 group-hover:text-white">{visuals.icon}</div>}
                    <span className={isMobile ? 'text-base font-medium' : ''}>{safeTitle}</span>
                </div>
                {isMobile && <ChevronRight size={16} className="text-white/20" />}
            </a>
        );
    }

    return (
        <NavLink
            to={safeUrl}
            end
            onClick={onNavigate}
            className={({ isActive }) => `${commonClass} ${isMobile && isActive ? activeMobileClass : ''} ${!isMobile && isActive ? 'text-primary font-medium' : ''}`}
        >
            {({ isActive }) => (
                <>
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <div className={`p-2 rounded-lg ${isActive ? visuals.color + ' bg-black/20' : 'text-white/50 bg-white/5 group-hover:text-white'}`}>
                                {visuals.icon}
                            </div>
                        )}
                        <span className={isMobile ? 'text-base font-medium' : ''}>{safeTitle}</span>
                    </div>
                    {!isMobile && (
                        <span className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    )}
                    {isMobile && <ChevronRight size={16} className={`transition-transform ${isActive ? 'text-primary translate-x-1' : 'text-white/20'}`} />}
                </>
            )}
        </NavLink>
    );
};

interface NavbarProps {
    onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useUser();
    const location = useLocation();

    const menuItems = useMenu();
    const handlePrefetch = usePrefetchOnHover();
    const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginButtonClick = useCallback(() => {
        setIsMenuOpen(false);
        onLoginClick();
    }, [onLoginClick]);

    const processedMenuItems = useMemo(() => {
        if (!menuItems?.length) return [];
        return menuItems.map(item => {
            const rawUrl = item.url || '/';
            const isExternal = /^https?:\/\//i.test(rawUrl);
            const localizedPath = isExternal ? rawUrl : getLocalizedRoute(rawUrl.split(/[#?]/)[0], currentLang);
            // Re-add query and hash
            const queryPart = rawUrl.includes('?') ? '?' + rawUrl.split('?')[1].split('#')[0] : '';
            const hashPart = rawUrl.includes('#') ? '#' + rawUrl.split('#')[1] : '';

            const fullUrl = isExternal ? rawUrl : `${localizedPath}${queryPart}${hashPart}`;
            const safeUrl = isExternal ? fullUrl : sanitizePath(fullUrl);

            // SSR Safe Logic: Se o título vindo do WP for redundante (ex: "Zouk Events"), usamos a tradução centralizada
            let safeTitle = item.title || '';
            const lowerTitle = safeTitle.toLowerCase();

            if (lowerTitle.includes('zouk events')) {
                safeTitle = t('nav.events');
            } else if (lowerTitle.includes('zouk music')) {
                safeTitle = t('nav.music');
            } else if (lowerTitle.includes('mídia') || lowerTitle.includes('media')) {
                safeTitle = t('nav.media');
                safeUrl = getLocalizedRoute('media', currentLang);
            }

            return {
                ...item,
                safeUrl,
                safeTitle,
                visuals: getLinkVisuals(safeUrl),
            };
        });
    }, [menuItems, currentLang, t]);


    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-14">
                    <Link to={getLocalizedRoute('', currentLang)} className="flex items-center z-50 group font-display font-bold text-xl">
                        <span className="text-primary mr-1">DJ</span> Zen Eyer
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {processedMenuItems.map(item => (
                            <MenuItem
                                key={item.ID}
                                item={item}
                                isMobile={false}
                                onNavigate={() => { }}
                                onPrefetch={handlePrefetch}
                            />
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSelector />
                        {user?.isLoggedIn ? <UserMenu /> : (
                            <button onClick={handleLoginButtonClick} className="btn btn-primary btn-sm flex items-center gap-2 shadow-lg shadow-primary/20">
                                <LogIn size={16} /> <span>{t('nav.sign_in')}</span>
                            </button>
                        )}
                    </div>

                    <button className="md:hidden text-white z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <>
                    <div
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden opacity-100 transition-opacity duration-200"
                    />
                    <div className="fixed top-0 left-0 right-0 bg-[#0f0f0f] z-40 md:hidden shadow-2xl rounded-b-3xl border-b border-white/10 pt-24 pb-8 px-4 flex flex-col max-h-[90vh] overflow-y-auto translate-y-0 transition-transform duration-300">
                        <nav className="flex flex-col space-y-3 mb-6">
                            {processedMenuItems.map(item => (
                                <MenuItem
                                    key={item.ID}
                                    item={item}
                                    isMobile={true}
                                    onNavigate={() => setIsMenuOpen(false)}
                                    onPrefetch={handlePrefetch}
                                />
                            ))}
                        </nav>
                        <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                            {user?.isLoggedIn ? <UserMenu /> : (
                                <button onClick={handleLoginButtonClick} className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                                    <LogIn size={18} /> <span className="font-bold">{t('nav.join_the_tribe')}</span>
                                </button>
                            )}
                            <div className="flex justify-center"><LanguageSelector /></div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
});

Navbar.displayName = 'Navbar';
export default Navbar;
