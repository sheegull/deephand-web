/**
 * Step 3: React Context for Language Management
 * 
 * リロードなし言語切り替えのためのReact Context実装
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getCurrentLanguage, 
  switchLanguageWithoutReload, 
  onLanguageChange 
} from './i18n';

// 🚀 Step 3: 言語Context型定義
export interface LanguageContextType {
  currentLanguage: 'ja' | 'en';
  switchLanguage: (lang: 'ja' | 'en') => Promise<void>;
  isLoading: boolean;
}

// 🚀 Context作成
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 🚀 Provider Props
interface LanguageProviderProps {
  children: ReactNode;
}

// 🚀 Language Provider Component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en'>(getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 言語変更の監視
  useEffect(() => {
    const unsubscribe = onLanguageChange(() => {
      setCurrentLanguage(getCurrentLanguage());
    });

    return unsubscribe;
  }, []);

  // 🚀 リロードなし言語切り替え関数
  const switchLanguage = async (lang: 'ja' | 'en'): Promise<void> => {
    if (currentLanguage === lang) return;

    setIsLoading(true);
    
    try {
      await switchLanguageWithoutReload(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Failed to switch language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    switchLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// 🚀 Custom Hook
export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  
  return context;
};

// 🚀 高階コンポーネント（オプション）
export const withLanguageContext = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <LanguageProvider>
      <Component {...props} />
    </LanguageProvider>
  );
};