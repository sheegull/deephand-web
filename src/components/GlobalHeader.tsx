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
  const { currentLanguage, switchLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // Navigation links data
  const navLinks = [
    {
      text: t('nav.solutions'),
      href: currentLanguage === 'en' ? '/en/solutions' : '/solutions',
    },
    {
      text: t('nav.resources'),
      href: currentLanguage === 'en' ? '/en/resources' : '/resources',
    },
    {
      text: t('nav.pricing'),
      href: currentLanguage === 'en' ? '/en/pricing' : '/pricing',
    },
    {
      text: t('nav.aboutUs'),
      href: currentLanguage === 'en' ? '/en/about' : '/about',
    },
  ];

  return (
    <header className={`fixed top-0 z-[100] w-full h-16 sm:h-18 lg:h-20 flex items-center justify-between px-3 sm:px-4 lg:px-20 ${className}`}>
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div
          className="flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0"
          onClick={() => {
            const homeUrl = currentLanguage === 'en' ? '/en' : '/';
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
          <LanguageToggle currentLanguage={currentLanguage} onLanguageChange={switchLanguage} />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => {
                const targetUrl = currentLanguage === 'en' ? '/en/request' : '/request';
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
          <div className="flex flex-col gap-2 mt-2 p-2 border-t border-gray-700">
            <div className="mb-2">
              <LanguageToggle
                currentLanguage={currentLanguage}
                onLanguageChange={switchLanguage}
              />
            </div>
            <Button
              onClick={() => {
                const targetUrl = currentLanguage === 'en' ? '/en/request' : '/request';
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