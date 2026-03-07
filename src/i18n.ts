import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

type SupportedLang = 'en' | 'pt';
type TranslationLoader = () => Promise<Record<string, unknown>>;

const normalizeLanguage = (lang: string): SupportedLang => {
  const normalized = (lang || '').trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

const translationLoaders: Record<SupportedLang, TranslationLoader> = {
  en: async () => (await import('./locales/en/translation.json')).default as Record<string, unknown>,
  pt: async () => (await import('./locales/pt/translation.json')).default as Record<string, unknown>,
};

i18n
  .use({
    type: 'backend',
    read: async (
      language: string,
      _namespace: string,
      callback: (error: Error | null, data: false | Record<string, unknown>) => void
    ) => {
      const normalized = normalizeLanguage(language);

      try {
        const translations = await translationLoaders[normalized]();
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
    ns: ['translation'],
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
    },
  });

export default i18n;
