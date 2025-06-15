import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import jaTranslations from './locales/ja.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ja', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles XSS protection
  },
  react: {
    useSuspense: false, // Disable suspense for SSR compatibility
  },
});

export default i18n;