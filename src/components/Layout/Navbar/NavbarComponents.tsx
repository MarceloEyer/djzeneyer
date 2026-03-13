// src/components/Layout/Navbar/NavbarComponents.tsx

import React, { useMemo, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { getAlternateLinks } from '../../../config/routes';
import { safeRedirect, sanitizePath } from '../../../utils/sanitize';

// ============================================================================
// TYPES
// ============================================================================

export interface MenuItemData {
    ID: number;
    safeUrl: string;
    safeTitle: string;
    visuals: { icon: JSX.Element; color: string; bg: string };
    target?: string;
    [key: string]: unknown;
}

export interface MenuItemProps {
    item: MenuItemData;
    isMobile: boolean;
    onNavigate: () => void;
    onPrefetch?: (url: string) => void;
}

// ============================================================================
// COMPONENTS
// ============================================================================

export const LanguageSelector: React.FC = React.memo(() => {
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
            const finalPath = safeRedirect(sanitizePath(targetPath) + (location.search || '') + (location.hash || ''), '/');
            navigate(finalPath);
        },
        [currentLang, location, navigate]
    );

    return (
        <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-2">
            <button onClick={() => changeLanguage('pt')} className={`text-sm font-bold transition-colors ${currentLang === 'pt' ? 'text-primary' : 'text-white/60 hover:text-white'}`}>PT</button>
            <span className="text-white/20">|</span>
            <button onClick={() => changeLanguage('en')} className={`text-sm font-bold transition-colors ${currentLang === 'en' ? 'text-primary' : 'text-white/60 hover:text-white'}`}>EN</button>
        </div>
    );
});

export const MenuItem: React.FC<MenuItemProps> = React.memo(({ item, isMobile, onNavigate, onPrefetch }) => {
    const { t } = useTranslation();
    const { safeUrl, safeTitle, visuals, target } = item;
    const isExternal = safeUrl.startsWith('http');
    const isBlank = target === '_blank';

    const handleMouseEnter = () => {
        if (!isExternal && onPrefetch) {
            onPrefetch(safeUrl);
        }
    };

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
            onMouseEnter={handleMouseEnter}
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
});

LanguageSelector.displayName = 'LanguageSelector';
MenuItem.displayName = 'MenuItem';
