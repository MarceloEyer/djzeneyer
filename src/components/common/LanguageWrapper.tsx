// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const availableLangs = ['en', 'pt'];

const LanguageWrapper: React.FC = () => {
  const { lang: urlLang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  // Determina o idioma baseado na URL: sem parâmetro = 'en', '/pt/*' = 'pt'
  const lang = urlLang || 'en';

  useEffect(() => {
    console.log('[LanguageWrapper] URL atual:', location.pathname);
    console.log('[LanguageWrapper] Parâmetro lang da URL:', urlLang);
    console.log('[LanguageWrapper] Idioma determinado:', lang);
    console.log('[LanguageWrapper] Idioma atual do i18n:', i18n.language);

    // Sincroniza i18n com o idioma da URL
    if (i18n.language !== lang) {
      console.log('[LanguageWrapper] Mudando idioma de', i18n.language, 'para', lang);
      i18n.changeLanguage(lang).then(() => {
        console.log('[LanguageWrapper] ✅ Idioma mudou com sucesso para:', i18n.language);
      }).catch(err => {
        console.error('[LanguageWrapper] ❌ Erro ao mudar idioma:', err);
      });
    } else {
      console.log('[LanguageWrapper] ✅ Idioma já sincronizado:', lang);
    }
  }, [lang, i18n, location.pathname, urlLang]);

  // Validação: idioma inválido redireciona para 404
  if (urlLang && !availableLangs.includes(urlLang)) {
    console.error('[LanguageWrapper] ❌ Idioma inválido na URL:', urlLang);
    return <Navigate to="/404" replace />;
  }

  console.log('[LanguageWrapper] ✅ Renderizando Outlet com idioma:', lang);
  return <Outlet />;
};

export default LanguageWrapper;