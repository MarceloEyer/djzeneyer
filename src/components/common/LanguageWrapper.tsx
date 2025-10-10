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
  const lang = urlLang || 'en';

  useEffect(() => {
    console.log("LanguageWrapper - useEffect: Idioma da URL:", urlLang, "Idioma determinado:", lang, "Idioma atual do i18n:", i18n.language);
    // Sincroniza a biblioteca de tradução com o idioma determinado
    if (i18n.language !== lang) {
      console.log("LanguageWrapper - Tentando mudar idioma para:", lang);
      i18n.changeLanguage(lang).then(() => {
          console.log("LanguageWrapper - Idioma mudou com sucesso para:", i18n.language);
      }).catch(err => {
          console.error("LanguageWrapper - Erro ao mudar idioma:", err);
      });
    } else {
        console.log("LanguageWrapper - Idioma já está correto:", lang);
    }
  }, [lang, i18n]);

  // Se o parâmetro de idioma estiver presente e não for válido, redireciona para 404
  if (urlLang && !availableLangs.includes(urlLang)) {
    console.log("LanguageWrapper - Idioma inválido:", urlLang);
    return <Navigate to={`/404${location.pathname.replace(`/${urlLang}`, '')}`} replace />;
  }

  // Renderiza o conteúdo da página aninhada
  return <Outlet />;
};

export default LanguageWrapper;