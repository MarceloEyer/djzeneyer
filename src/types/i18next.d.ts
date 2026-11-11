import 'i18next';
import translation from '../locales/en/translation.json';
import encyclopedia from '../locales/en/encyclopedia.json';
import faq from '../locales/en/faq.json';
import legal from '../locales/en/legal.json';
import conduct from '../locales/en/conduct.json';
import privacy from '../locales/en/privacy.json';
import about from '../locales/en/about.json';
import zentribe from '../locales/en/zentribe.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      encyclopedia: typeof encyclopedia;
      faq: typeof faq;
      legal: typeof legal;
      conduct: typeof conduct;
      privacy: typeof privacy;
      about: typeof about;
      zentribe: typeof zentribe;
    };
    returnNull: false;
  }
}
