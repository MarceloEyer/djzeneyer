// src/components/common/LanguageWrapper.tsx
import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageWrapper: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const targetLang = lang === 'pt' ? 'pt' : 'en';
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [lang, i18n]);

  return <Outlet />;
};

export default LanguageWrapper;
