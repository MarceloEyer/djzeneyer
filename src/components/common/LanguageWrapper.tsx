// src/components/common/LanguageWrapper.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

const LanguageWrapper: React.FC<LanguageWrapperProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || '/';
    const targetLang = pathname.startsWith('/pt') ? 'pt' : 'en';


    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang).catch((err) => {
        console.error('[LanguageWrapper] i18n.changeLanguage error:', err);
      });
    } else {
    }
  }, [location.pathname, i18n]);

  return <>{children}</>;
};

export default LanguageWrapper;
