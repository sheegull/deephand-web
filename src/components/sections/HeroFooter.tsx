import React from 'react';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';

interface HeroFooterProps {
  onNavClick?: (element: string) => void;
  isClient?: boolean;
}

/**
 * HeroFooter - Footer component extracted from HeroSection
 * Handles footer links and copyright information
 */
export const HeroFooter: React.FC<HeroFooterProps> = ({
  onNavClick,
  isClient = false,
}) => {
  const { currentLanguage } = useLanguage();

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // Footer links data
  const footerLinks = [
    { text: t('footer.termsOfService'), href: '#terms' },
    { text: t('footer.privacyPolicy'), href: '#privacy' },
  ];

  return (
    <footer 
      className="flex flex-col md:flex-row items-center justify-between w-full mt-12 gap-4 md:gap-0 pb-16"
      data-testid="hero-footer"
    >
      {/* Copyright */}
      <div 
        className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]"
        data-testid="copyright"
      >
        {t('footer.copyright')}
      </div>
      
      {/* Footer Links */}
      <div className="flex items-center gap-6" data-testid="footer-links">
        {footerLinks.map((link, index) => (
          <a
            key={index}
            onClick={() => {
              const linkType = link.text.toLowerCase().replace(/\s+/g, '-');
              if (linkType.includes('terms') || linkType.includes('利用規約')) {
                const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
                handleNavigation(termsUrl);
              } else if (linkType.includes('privacy') || linkType.includes('プライバシー')) {
                const privacyUrl = currentLanguage === 'en' ? '/en/privacy' : '/privacy';
                handleNavigation(privacyUrl);
              } else {
                onNavClick?.(linkType);
              }
            }}
            className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
            data-testid={`footer-link-${index}`}
          >
            {link.text}
          </a>
        ))}
      </div>
    </footer>
  );
};