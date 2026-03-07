// src/components/common/LanguageWrapper.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

const normalizeLanguage = (lang: string): 'en' | 'pt' => {
  const normalized = (lang || '').trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

const LanguageWrapper: React.FC<LanguageWrapperProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || '/';
    const targetLang = normalizeLanguage(pathname.startsWith('/pt') ? 'pt' : 'en');
    const currentLang = normalizeLanguage(i18n.resolvedLanguage || i18n.language || 'en');

    if (currentLang !== targetLang) {
      i18n.changeLanguage(targetLang).catch((err) => {
        console.error('[LanguageWrapper] i18n.changeLanguage error:', err);
      });
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = targetLang;
    }
  }, [location.pathname, i18n]);

  return <>{children}</>;
};

export default LanguageWrapper;
