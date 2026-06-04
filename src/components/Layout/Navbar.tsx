// src/components/Layout/Navbar.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    Newspaper
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from '../common/UserMenu';
import { usePrefetchOnHover } from '../../hooks/usePrefetchOnHover';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';
import { STATIC_MENU } from '../../config/menu';
import { MenuItem, LanguageSelector } from './Navbar/NavbarComponents';
import type { MenuItemData } from './Navbar/NavbarComponents';

// ============================================================================
// HELPERS & CONSTANTS
// ============================================================================

const VISUAL_CONFIGS = {
    base: { color: 'text-primary', bg: 'bg-primary/10' },
    default: { icon: <Home size={20} />, color: 'text-white/70', bg: 'bg-white/5' },
    event: { icon: <Calendar size={20} /> },
    shop: { icon: <ShoppingBag size={20} /> },
    tribe: { icon: <Users size={20} /> },
    music: { icon: <Music size={20} /> },
    work: { icon: <Briefcase size={20} /> },
    media: { icon: <Newspaper size={20} /> },
    about: { icon: <Info size={20} /> }
} as const;

const PRECOMPUTED_VISUALS = {
    event: { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.event.icon },
    shop:  { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.shop.icon  },
    tribe: { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.tribe.icon },
    music: { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.music.icon },
    work:  { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.work.icon  },
    media: { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.media.icon },
    about: { ...VISUAL_CONFIGS.base, icon: VISUAL_CONFIGS.about.icon },
    default: VISUAL_CONFIGS.default
} as const;

interface NavbarProps {
    onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ onLoginClick }) => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useUser();
    const location = useLocation();

    const handlePrefetch = usePrefetchOnHover();
    const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setIsMenuOpen(false), 0);
        return () => window.clearTimeout(timeoutId);
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

    const processedMenuItems = useMemo((): MenuItemData[] =>
        STATIC_MENU.map(item => {
            const safeUrl = getLocalizedRoute(item.routeKey, currentLang);
            return {
                ID: item.id,
                title: t(item.navKey),
                url: safeUrl,
                safeUrl,
                safeTitle: t(item.navKey),
                visuals: PRECOMPUTED_VISUALS[item.iconKey],
            };
        }),
    [currentLang, t]);

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

                    <button className="md:hidden text-white z-50" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
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
