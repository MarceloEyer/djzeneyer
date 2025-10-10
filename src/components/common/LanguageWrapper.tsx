// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const availableLangs = ['en', 'pt'];

const LanguageWrapper: React.FC = () => {
  const { lang: urlLang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  // Determina o idioma real a ser usado
  // Se não houver parâmetro 'lang' (ou seja, estamos em /), assume 'en'
  const lang = urlLang || 'en';

  useEffect(() => {
    // Sincroniza a biblioteca de tradução com o idioma determinado
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Se o parâmetro de idioma estiver presente e não for válido, redireciona para 404
  if (urlLang && !availableLangs.includes(urlLang)) {
    // Mantém o resto do path para que o NotFoundPage possa mostrar a URL errada
    return <Navigate to={`/404${location.pathname.replace(`/${urlLang}`, '')}`} replace />;
  }

  // Renderiza o conteúdo da página aninhada
  return <Outlet />;
};

export default LanguageWrapper;