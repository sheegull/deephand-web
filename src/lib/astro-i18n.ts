/**
 * Astro-specific i18n utilities
 * 🎯 Purpose: Solve SSR/Hydration consistency issues
 * 📋 Approach: Context-based language detection
 */

import jaTranslations from '../i18n/locales/ja.json';
import enTranslations from '../i18n/locales/en.json';

export const translations = {
  en: enTranslations,
  ja: jaTranslations
};

/**
 * Context-aware translation function for Astro components
 * Determines language from URL path without relying on global state
 */
export function createContextualTranslation(pathname: string) {
  const language: 'ja' | 'en' = pathname.startsWith('/en') ? 'en' : 'ja';
  
  return function t(key: string, interpolations?: Record<string, any>) {
    const keys = key.split('.');
    let value: any = translations[language];
    
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
}

/**
 * Hook for client-side components to get SSR-consistent translations
 */
export function useConsistentTranslation() {
  if (typeof window === 'undefined') {
    // Server-side: try to get pathname from global context
    if (typeof globalThis !== 'undefined' && globalThis.astroPathname) {
      return createContextualTranslation(globalThis.astroPathname);
    }
    // Default to Japanese if no context available
    return createContextualTranslation('');
  }
  
  // Client-side: use current pathname
  return createContextualTranslation(window.location.pathname);
}

/**
 * Set global pathname context for SSR
 */
export function setAstroPathname(pathname: string) {
  if (typeof globalThis !== 'undefined') {
    globalThis.astroPathname = pathname;
  }
}