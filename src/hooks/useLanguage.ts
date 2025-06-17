import { useState, useEffect } from 'react';
import { getCurrentLanguage, onLanguageChange, switchLanguageInstantly } from '../lib/i18n';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en'>(getCurrentLanguage());
  
  useEffect(() => {
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      setCurrentLanguage(getCurrentLanguage());
    });
    
    return unsubscribe;
  }, []);
  
  const switchLanguage = (lang: 'ja' | 'en') => {
    switchLanguageInstantly(lang);
  };
  
  return {
    currentLanguage,
    switchLanguage
  };
};