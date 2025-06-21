import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { t } from '../lib/i18n';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from './ui/language-toggle';

interface GlobalHeaderProps {
  className?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ className = '' }) => {
  // 🚀 Step 3: リロードなし言語切り替えを使用
  const { currentLanguage, switchLanguage, isLoading } = useLanguage({ reloadOnSwitch: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      // 複数のスクロール要素をチェック
      const heroScrollElement = document.querySelector('.hero-scroll-container') as HTMLElement;
      const bodyScrollY = window.scrollY;
      const heroScrollY = heroScrollElement ? heroScrollElement.scrollTop : 0;
      
      // いずれかのスクロール量が50pxを超えていればブラー効果を適用
      const totalScrollY = Math.max(bodyScrollY, heroScrollY);
      const shouldShowBlur = totalScrollY > 50;
      
      
      setIsScrolled(shouldShowBlur);
    };

    // windowスクロールをリスン
    window.addEventListener('scroll', handleScroll);
    
    // HeroSection内のスクロール要素を探してリスン
    const checkForHeroElement = () => {
      const heroScrollElement = document.querySelector('.hero-scroll-container') as HTMLElement;
      if (heroScrollElement) {
        heroScrollElement.addEventListener('scroll', handleScroll);
        return heroScrollElement;
      }
      return null;
    };
    
    // 初期チェック
    let heroElement = checkForHeroElement();
    
    // 要素が見つからない場合は少し待ってから再試行
    const retryTimeout = setTimeout(() => {
      if (!heroElement) {
        heroElement = checkForHeroElement();
      }
    }, 100);

    // 初期スクロール状態をチェック
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (heroElement) {
        heroElement.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(retryTimeout);
    };
  }, []);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // Navigation links data (Step 1: 英語デフォルト、日本語は/jaプレフィックス)
  const navLinks = [
    {
      text: t('nav.solutions'),
      href: currentLanguage === 'ja' ? '/ja/solutions' : '/solutions',
    },
    {
      text: t('nav.resources'),
      href: currentLanguage === 'ja' ? '/ja/resources' : '/resources',
    },
    {
      text: t('nav.pricing'),
      href: currentLanguage === 'ja' ? '/ja/pricing' : '/pricing',
    },
    {
      text: t('nav.aboutUs'),
      href: currentLanguage === 'ja' ? '/ja/about' : '/about',
    },
  ];

  return (
    <header
      className={`fixed top-0 z-[100] w-full h-16 sm:h-18 lg:h-20 flex items-center justify-between px-3 sm:px-4 lg:px-20 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-black/10' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div
          className="flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0"
          onClick={() => {
            const homeUrl = currentLanguage === 'ja' ? '/ja' : '/';
            handleNavigation(homeUrl);
          }}
        >
          <img
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-cover"
            alt="Icon"
            src="/logo.png"
          />
          <div className="font-alliance font-light text-white text-lg sm:text-xl lg:text-2xl leading-tight whitespace-nowrap">
            DeepHand
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-1 sm:p-2 text-white flex-shrink-0"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="flex items-center">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block mx-auto">
          <ul className="flex gap-3 xl:gap-6">
            {navLinks.map((link, index) => (
              <li
                key={index}
                onClick={() => handleNavigation(link.href)}
                className="cursor-pointer"
              >
                <span className="font-alliance font-light text-white text-[12px] xl:text-[14px] leading-tight hover:text-gray-300 transition-colors whitespace-nowrap">
                  {link.text}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
          <LanguageToggle 
            currentLanguage={currentLanguage} 
            onLanguageChange={switchLanguage}
            isLoading={isLoading}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => {
                const targetUrl = currentLanguage === 'ja' ? '/ja/request' : '/request';
                handleNavigation(targetUrl);
              }}
              className="w-[100px] xl:w-[130px] h-8 xl:h-10 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-xs xl:text-sm transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#234ad9] hover:to-[#1e3eb8] hover:border-transparent whitespace-nowrap"
            >
              <span className="relative z-10">{t('nav.getStarted')}</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`absolute top-16 sm:top-18 lg:top-20 left-0 right-0 bg-[#1e1e1e] transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } lg:hidden border-t border-gray-700 shadow-lg z-[90]`}
      >
        <nav className="flex flex-col py-3">
          {navLinks.map((link, index) => (
            <a
              key={index}
              onClick={() => {
                handleNavigation(link.href);
                setIsMenuOpen(false); // モバイルメニューを閉じる
              }}
              className="py-2 px-4 text-white hover:bg-white/20 active:bg-white/30 transition-colors text-sm cursor-pointer"
            >
              {link.text}
            </a>
          ))}
          <a
            onClick={async () => {
              const newLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
              await switchLanguage(newLanguage);
              setIsMenuOpen(false); // 切り替え成功後にメニューを閉じる
            }}
            className={`py-2 px-4 text-white hover:bg-white/20 active:bg-white/30 transition-colors text-sm cursor-pointer flex items-center gap-2 ${
              isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            {currentLanguage === 'ja' ? 'EN' : 'JA'}
          </a>
          <div className="flex flex-col gap-2 mt-2 p-2 border-t border-gray-700">
            <Button
              onClick={() => {
                const targetUrl = currentLanguage === 'ja' ? '/ja/request' : '/request';
                handleNavigation(targetUrl);
              }}
              className="w-full h-9 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-sm transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#234ad9] hover:to-[#1e3eb8] hover:border-transparent"
            >
              {t('nav.getStarted')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
