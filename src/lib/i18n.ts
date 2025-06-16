// Import JSON translation files
import jaTranslations from '../i18n/locales/ja.json';
import enTranslations from '../i18n/locales/en.json';

// i18n実装
export const translations = {
  en: enTranslations,
  ja: jaTranslations
};

// Language state management with localStorage persistence
let currentLanguage: 'ja' | 'en' = 'ja';

// Initialize language from localStorage or URL
if (typeof window !== 'undefined') {
  const storedLang = localStorage.getItem('language') as 'ja' | 'en';
  const path = window.location.pathname;
  
  if (storedLang && (storedLang === 'ja' || storedLang === 'en')) {
    currentLanguage = storedLang;
  } else if (path.startsWith('/en')) {
    currentLanguage = 'en';
  }
}

export const getCurrentLanguage = () => currentLanguage;

export const setCurrentLanguage = (lang: 'ja' | 'en') => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
};

export const t = (key: string, interpolations?: Record<string, any>) => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  let result = value || key;
  
  // Handle interpolations like {{field}}
  if (interpolations && typeof result === 'string') {
    Object.entries(interpolations).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });
  }
  
  return result;
};