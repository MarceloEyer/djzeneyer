// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. O caminho agora aponta para dentro de 'src', o que é o correto
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

// 2. Criamos o objeto de recursos com as traduções importadas
const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources, // 3. Usamos os recursos importados, sem a opção 'backend'
    fallbackLng: 'en', // Idioma padrão: Inglês americano
    supportedLngs: ['en', 'pt'],
    
    detection: {
      order: ['path', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;