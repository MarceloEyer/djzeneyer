// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

const resources = {
  en: { translation: translationEN },
  pt: { translation: translationPT },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    detection: {
      order: ['path', 'localStorage', 'cookie', 'navigator'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
    },
    interpolation: { 
      escapeValue: false 
    },
    debug: false, // Set to true for debugging
  });

export default i18n;