import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { LanguageToggle } from '../ui/language-toggle';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import {
  MotionDiv,
  optimizedHoverAnimation,
  optimizedTapAnimation,
  optimizedTransition,
} from '../ui/motion-optimized';

interface HeroHeaderProps {
  onNavClick?: (element: string) => void;
  onLogoClick?: () => void;
  isClient?: boolean;
}

/**
 * HeroHeader - Navigation component extracted from HeroSection
 * Handles top navigation, mobile menu, and language switching
 */
export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onNavClick,
  onLogoClick,
  isClient = false,
}) => {
  const { currentLanguage, switchLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header 
      className="fixed top-0 z-[100] w-full h-16 sm:h-18 lg:h-20 flex items-center justify-between px-3 sm:px-4 lg:px-20"
      data-testid="hero-header"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div
          className="flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0"
          onClick={() => {
            if (onLogoClick) {
              onLogoClick();
            } else {
              const homeUrl = currentLanguage === 'en' ? '/en' : '/';
              handleNavigation(homeUrl);
            }
          }}
          data-testid="logo"
        >
          <img
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-cover"
            alt="DeepHand Logo"
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
          data-testid="mobile-menu-button"
        >
          <div className="flex items-center">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block mx-auto" data-testid="desktop-nav">
          <ul className="flex gap-3 xl:gap-6">
            {navLinks.map((link, index) => (
              <li
                key={index}
                onClick={() => {
                  if (onNavClick) {
                    onNavClick(link.text.toLowerCase());
                  } else {
                    handleNavigation(link.href);
                  }
                }}
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
          />
          <MotionDiv
            whileHover={optimizedHoverAnimation}
            whileTap={optimizedTapAnimation}
            transition={optimizedTransition}
          >
            <Button
              onClick={() => {
                const targetUrl = currentLanguage === 'en' ? '/en/request' : '/request';
                handleNavigation(targetUrl);
              }}
              className="w-[100px] xl:w-[130px] h-8 xl:h-10 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-xs xl:text-sm transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#234ad9] hover:to-[#1e3eb8] hover:border-transparent whitespace-nowrap"
              data-testid="get-started-button"
            >
              <span className="relative z-10">{t('nav.getStarted')}</span>
            </Button>
          </MotionDiv>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`absolute top-16 sm:top-18 lg:top-20 left-0 right-0 bg-[#1e1e1e] transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } lg:hidden border-t border-gray-700 shadow-lg z-[90]`}
        data-testid="mobile-menu"
      >
        <nav className="flex flex-col py-3">
          {navLinks.map((link, index) => (
            <a
              key={index}
              onClick={() => {
                if (onNavClick) {
                  onNavClick(link.text.toLowerCase());
                } else {
                  handleNavigation(link.href);
                }
                setIsMenuOpen(false);
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