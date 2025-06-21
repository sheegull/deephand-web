import { useState, useEffect } from 'react';
import { 
  getCurrentLanguage, 
  onLanguageChange, 
  switchLanguageInstantly, 
  switchLanguageWithoutReload 
} from '../lib/i18n';

// 🚀 Step 3: useLanguage拡張オプション
interface UseLanguageOptions {
  reloadOnSwitch?: boolean; // true: 完全リロード, false: リロードなし切り替え
}

export const useLanguage = (options: UseLanguageOptions = { reloadOnSwitch: true }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en'>(getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      setCurrentLanguage(getCurrentLanguage());
    });
    
    return unsubscribe;
  }, []);
  
  // 🚀 Step 3: リロードなし切り替え対応
  const switchLanguage = async (lang: 'ja' | 'en') => {
    if (options.reloadOnSwitch) {
      // 従来の完全リロード
      switchLanguageInstantly(lang);
    } else {
      // 🚀 新しいリロードなし切り替え
      if (currentLanguage === lang) return;
      
      setIsLoading(true);
      try {
        await switchLanguageWithoutReload(lang);
        setCurrentLanguage(lang);
      } catch (error) {
        console.error('Failed to switch language without reload:', error);
        // フォールバック: 完全リロード
        switchLanguageInstantly(lang);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return {
    currentLanguage,
    switchLanguage,
    isLoading, // 🚀 Step 3: ローディング状態追加
  };
};