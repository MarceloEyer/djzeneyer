// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageWrapper: React.FC = () => {
  // Pega o parâmetro 'lang' da URL, que pode ser 'pt' ou undefined
  const { lang } = useParams<{ lang?: 'pt' }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Define o idioma alvo com base na URL
    const targetLang = lang === 'pt' ? 'pt' : 'en';

    // Apenas muda o idioma se ele for diferente do idioma atual
    // para evitar re-renderizações desnecessárias
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [lang, i18n]); // Roda sempre que o parâmetro 'lang' na URL mudar

  // O <Outlet /> renderiza o resto das rotas que estão aninhadas dentro deste componente
  return <Outlet />;
};

export default LanguageWrapper;