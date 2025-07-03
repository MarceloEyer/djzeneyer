// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importamos nossos dicionários de tradução diretamente do projeto.
import translationEN from '../public/locales/en/translation.json';
import translationPT from '../public/locales/pt/translation.json';

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
  // O LanguageDetector tenta descobrir o idioma do usuário (opcional)
  .use(LanguageDetector)
  // Passa a instância do i18n para o react-i18next
  .use(initReactI18next)
  // Configuração inicial
  .init({
    resources, // Usamos os recursos importados em vez da opção 'backend'
    fallbackLng: 'en', // Idioma padrão se a detecção falhar
    
    // Configurações do detector de idioma
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },

    interpolation: {
      escapeValue: false, // O React já protege contra ataques XSS
    },
  });

export default i18n;