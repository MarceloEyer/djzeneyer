// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa os dicionários de tradução diretamente do código-fonte.
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

// Cria o objeto de recursos com as traduções importadas.
const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  // O LanguageDetector tenta descobrir o idioma do usuário.
  .use(LanguageDetector)
  // Passa a instância do i18n para o react-i18next.
  .use(initReactI18next)
  // Configuração inicial.
  .init({
    resources, // Usa os recursos que importamos.
    fallbackLng: 'en', // Idioma padrão: Inglês.
    supportedLngs: ['en', 'pt'],
    
    detection: {
      // Ordem de detecção: 1º a URL, 2º o localStorage, 3º um cookie.
      order: ['path', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false, // O React já protege contra ataques XSS.
    },
  });

export default i18n;