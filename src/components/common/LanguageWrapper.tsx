// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const availableLangs = ['en', 'pt'];

const LanguageWrapper: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // Sincroniza a biblioteca de tradução com o idioma da URL
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Se o parâmetro de idioma não for válido (ex: /es/shop), redireciona para 404
  if (lang && !availableLangs.includes(lang)) {
    // Mantém o resto do path para que o NotFoundPage possa mostrar a URL errada
    return <Navigate to={`/404${location.pathname.replace(`/${lang}`, '')}`} replace />;
  }

  // Renderiza o conteúdo da página aninhada
  return <Outlet />;
};

export default LanguageWrapper;