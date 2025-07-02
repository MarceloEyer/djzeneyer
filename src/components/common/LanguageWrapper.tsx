// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageWrapper: React.FC = () => {
  // Pega os parâmetros da URL. Ex: em /en/music, o 'lang' será 'en'.
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Se a URL tiver '/en', muda o idioma do site para inglês.
    if (lang === 'en') {
      setLanguage('en');
    } else {
      // Se não, garante que o idioma seja português.
      setLanguage('pt-BR');
    }
    // Roda sempre que o parâmetro 'lang' na URL mudar.
  }, [lang, setLanguage]);

  // O <Outlet /> simplesmente renderiza o resto das rotas que estão aninhadas
  // dentro deste componente no App.tsx.
  return <Outlet />;
};

export default LanguageWrapper;