// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// CORRIGIDO: O caminho do import agora é relativo à pasta `src`
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

// Criamos o objeto de recursos com as traduções importadas
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
    resources, // Usamos os recursos importados
    fallbackLng: 'en',
    
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;