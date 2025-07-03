// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // O 'Backend' carrega as traduções de arquivos .json na sua pasta 'public'
  .use(Backend)
  // Detecta o idioma do usuário
  .use(LanguageDetector)
  // Passa a instância do i18n para o react-i18next
  .use(initReactI18next)
  // Configuração inicial
  .init({
    fallbackLng: 'en', // Idioma padrão se a detecção falhar
    debug: true, // Mostra logs no console durante o desenvolvimento
    interpolation: {
      escapeValue: false, // O React já protege contra XSS
    },
    backend: {
      // Caminho para seus arquivos de tradução
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;