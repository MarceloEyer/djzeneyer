import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

type SupportedLang = 'en' | 'pt';
type SupportedNamespace = 'translation' | 'quiz';
type TranslationLoader = () => Promise<Record<string, unknown>>;

const normalizeLanguage = (lang: string): SupportedLang => {
  const normalized = (lang || '').trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

const namespaceLoaders: Record<SupportedLang, Record<SupportedNamespace, TranslationLoader>> = {
  en: {
    translation: async () => (await import('./locales/en/translation.json')).default as Record<string, unknown>,
    quiz: async () => (await import('./locales/en/quiz.json')).default as Record<string, unknown>,
  },
  pt: {
    translation: async () => (await import('./locales/pt/translation.json')).default as Record<string, unknown>,
    quiz: async () => (await import('./locales/pt/quiz.json')).default as Record<string, unknown>,
  },
};

const normalizeNamespace = (ns: string): SupportedNamespace => {
  return ns === 'quiz' ? 'quiz' : 'translation';
};

i18n
  .use({
    type: 'backend',
    read: async (
      language: string,
      namespace: string,
      callback: (error: Error | null, data: false | Record<string, unknown>) => void
    ) => {
      const normalizedLanguage = normalizeLanguage(language);
      const normalizedNamespace = normalizeNamespace(namespace);

      try {
        const loader = namespaceLoaders[normalizedLanguage][normalizedNamespace];
        const translations = await loader();
        callback(null, translations);
      } catch (error) {
        callback(error as Error, false);
      }
    },
  })
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    ns: ['translation', 'quiz'],
    defaultNS: 'translation',
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    cleanCode: true,
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => normalizeLanguage(lng),
    },
    returnNull: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    react: {
      useSuspense: true,
      nsMode: 'fallback',
    },
  });

export default i18n;
