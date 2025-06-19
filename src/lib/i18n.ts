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
let languageChangeCallbacks: (() => void)[] = [];

// Initialize language from localStorage or URL
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  
  // URL優先で言語を判定
  if (path.startsWith('/en')) {
    currentLanguage = 'en';
    localStorage.setItem('language', 'en');
  } else {
    // URL が /en 以外の場合は日本語
    currentLanguage = 'ja';
    localStorage.setItem('language', 'ja');
  }
} else {
  // サーバーサイドでは、URLパスから言語を判定
  if (typeof globalThis !== 'undefined' && globalThis.location?.pathname?.startsWith('/en')) {
    currentLanguage = 'en';
  }
}

export const getCurrentLanguage = () => currentLanguage;

export const setCurrentLanguage = (lang: 'ja' | 'en') => {
  const previousLanguage = currentLanguage;
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
  
  // 言語が変更された場合のみコールバックを実行
  if (previousLanguage !== lang) {
    languageChangeCallbacks.forEach(callback => callback());
  }
};

// コンポーネントの再レンダリング用コールバック登録
export const onLanguageChange = (callback: () => void) => {
  languageChangeCallbacks.push(callback);
  return () => {
    languageChangeCallbacks = languageChangeCallbacks.filter(cb => cb !== callback);
  };
};

// ページパスを言語に対応したパスに変換
export const getLocalizedPath = (lang: 'ja' | 'en', currentPath?: string) => {
  if (typeof window === 'undefined' && !currentPath) return lang === 'en' ? '/en' : '/';
  
  const path = currentPath || window.location.pathname;
  
  // 現在のパスから言語プレフィックスを除去
  const cleanPath = path.startsWith('/en') ? path.slice(3) : path;
  
  // 🚀 空文字列とルートパスの正規化
  const normalizedPath = cleanPath === '' ? '/' : cleanPath;
  
  // 新しい言語でのパスを構築
  if (lang === 'en') {
    return normalizedPath === '/' ? '/en' : `/en${normalizedPath}`;
  } else {
    return normalizedPath === '/' ? '/' : normalizedPath;
  }
};

// 即座に言語を変更（現在のページに対応する言語ページに遷移）
export const switchLanguageInstantly = (lang: 'ja' | 'en') => {
  setCurrentLanguage(lang);
  // URLを更新（適切な言語ページに遷移）
  if (typeof window !== 'undefined') {
    const newPath = getLocalizedPath(lang);
    window.location.href = newPath; // pushStateではなくhrefで完全な遷移
  }
};

export const t = (key: string, interpolations?: Record<string, any>) => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  let result = value !== undefined ? value : key;
  
  // Handle interpolations like {{field}}
  if (interpolations && typeof result === 'string') {
    Object.entries(interpolations).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });
  }
  
  return result;
};