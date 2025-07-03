// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Importamos nossos dicionários de tradução diretamente do projeto.
// O Vite sabe como lidar com arquivos .json.
import translationEN from '../public/locales/en/translation.json';
import translationPT from '../public/locales/pt/translation.json';

// 2. Criamos o objeto de recursos com as traduções importadas
const resources = {
  en: {
    translation: translationEN,
  },
  pt: { // Usamos 'pt' em vez de 'pt-BR' para simplificar a detecção de idioma
    translation: translationPT,
  },
};

i18n
  // Detecta o idioma do usuário (ex: do navegador)
  .use(LanguageDetector)
  // Passa a instância do i18n para o react-i18next
  .use(initReactI18next)
  // Configuração inicial
  .init({
    resources, // 3. Usamos os recursos importados em vez da opção 'backend'
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