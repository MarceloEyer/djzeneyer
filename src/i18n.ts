import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

type SupportedLang = 'en' | 'pt';
type SupportedNamespace =
  | 'translation'
  | 'quiz'
  | 'encyclopedia'
  | 'faq'
  | 'legal'
  | 'conduct'
  | 'privacy'
  | 'about'
  | 'home'
  | 'zentribe'
  | 'newsletter';
type TranslationLoader = () => Promise<Record<string, unknown>>;

const normalizeLanguage = (lang: string): SupportedLang => {
  const normalized = (lang || '').trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

const namespaceLoaders: Record<SupportedLang, Record<SupportedNamespace, TranslationLoader>> = {
  en: {
    translation: async () => (await import('./locales/en/translation.json')).default as Record<string, unknown>,
    quiz: async () => (await import('./locales/en/quiz.json')).default as Record<string, unknown>,
    encyclopedia: async () => (await import('./locales/en/encyclopedia.json')).default as Record<string, unknown>,
    faq: async () => (await import('./locales/en/faq.json')).default as Record<string, unknown>,
    legal: async () => (await import('./locales/en/legal.json')).default as Record<string, unknown>,
    conduct: async () => (await import('./locales/en/conduct.json')).default as Record<string, unknown>,
    privacy: async () => (await import('./locales/en/privacy.json')).default as Record<string, unknown>,
    about: async () => (await import('./locales/en/about.json')).default as Record<string, unknown>,
    home: async () => (await import('./locales/en/home.json')).default as Record<string, unknown>,
    zentribe: async () => (await import('./locales/en/zentribe.json')).default as Record<string, unknown>,
    newsletter: async () => (await import('./locales/en/newsletter.json')).default as Record<string, unknown>,
  },
  pt: {
    translation: async () => (await import('./locales/pt/translation.json')).default as Record<string, unknown>,
    quiz: async () => (await import('./locales/pt/quiz.json')).default as Record<string, unknown>,
    encyclopedia: async () => (await import('./locales/pt/encyclopedia.json')).default as Record<string, unknown>,
    faq: async () => (await import('./locales/pt/faq.json')).default as Record<string, unknown>,
    legal: async () => (await import('./locales/pt/legal.json')).default as Record<string, unknown>,
    conduct: async () => (await import('./locales/pt/conduct.json')).default as Record<string, unknown>,
    privacy: async () => (await import('./locales/pt/privacy.json')).default as Record<string, unknown>,
    about: async () => (await import('./locales/pt/about.json')).default as Record<string, unknown>,
    home: async () => (await import('./locales/pt/home.json')).default as Record<string, unknown>,
    zentribe: async () => (await import('./locales/pt/zentribe.json')).default as Record<string, unknown>,
    newsletter: async () => (await import('./locales/pt/newsletter.json')).default as Record<string, unknown>,
  },
};

const normalizeNamespace = (ns: string): SupportedNamespace => {
  if (ns in namespaceLoaders.en) return ns as SupportedNamespace;
  return 'translation';
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
    debug: false,
    showSupportNotice: false,
    supportedLngs: ['en', 'pt'],
    ns: ['translation', 'quiz', 'encyclopedia', 'faq', 'legal', 'conduct', 'privacy', 'about', 'zentribe', 'newsletter'],
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
