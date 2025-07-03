// src/components/common/LanguageWrapper.tsx

import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageWrapper: React.FC = () => {
  // O parâmetro 'lang' agora será 'pt' ou ficará indefinido (undefined)
  const { lang } = useParams<{ lang?: 'pt' }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const targetLang = lang === 'pt' ? 'pt' : 'en';

    // Apenas muda o idioma se ele for diferente do idioma atual
    // Isso evita re-renderizações desnecessárias
    if (i18n.language !== targetLang) {
      console.log(`[LanguageWrapper] Mudando idioma para: ${targetLang}`);
      i18n.changeLanguage(targetLang);
    }
  }, [lang, i18n]);

  // O <Outlet /> renderiza a rota filha correspondente (HomePage, MusicPage, etc.)
  return <Outlet />;
};

export default LanguageWrapper;