import 'i18next';
import translation from '../locales/en/translation.json';
import encyclopedia from '../locales/en/encyclopedia.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      encyclopedia: typeof encyclopedia;
    };
    returnNull: false;
  }
}
