import React from 'react';
import { t, getCurrentLanguage, onLanguageChange, getFooterUrls } from '../lib/i18n';

interface GlobalFooterProps {
  className?: string;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = React.useState(false);
  // 言語変更に反応するための再レンダリングstate
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    setIsClient(true);
    
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      forceUpdate({}); // 強制的に再レンダリング
    });
    
    return unsubscribe;
  }, []);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // 統一されたURL生成
  const footerUrls = isClient ? getFooterUrls() : { terms: '#', privacy: '#' };

  return (
    <footer className={`flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 mt-auto pt-16 pb-8 z-[100] relative ${className}`}>
      <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
        {t('footer.copyright')}
      </div>
      <div className="flex items-center gap-6">
        <a
          role="link"
          href={footerUrls.terms}
          onClick={(e) => {
            e.preventDefault();
            if (isClient && typeof window !== 'undefined') {
              handleNavigation(footerUrls.terms);
            }
          }}
          className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 focus:text-gray-300 transition-colors cursor-pointer"
        >
          {t('footer.termsOfService')}
        </a>
        <a
          role="link"
          href={footerUrls.privacy}
          onClick={(e) => {
            e.preventDefault();
            if (isClient && typeof window !== 'undefined') {
              handleNavigation(footerUrls.privacy);
            }
          }}
          className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 focus:text-gray-300 transition-colors cursor-pointer"
        >
          {t('footer.privacyPolicy')}
        </a>
      </div>
    </footer>
  );
};