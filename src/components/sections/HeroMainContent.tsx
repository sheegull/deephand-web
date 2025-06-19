import React from 'react';
import { Button } from '../ui/button';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import {
  MotionDiv,
  useScroll,
  useTransform,
  optimizedHoverAnimation,
  optimizedTapAnimation,
  optimizedTransition,
} from '../ui/motion-optimized';

interface HeroMainContentProps {
  onRequestClick?: () => void;
  isClient?: boolean;
}

/**
 * HeroMainContent - Main hero content extracted from HeroSection
 * Handles main title, subtitle, and CTA button
 */
export const HeroMainContent: React.FC<HeroMainContentProps> = ({
  onRequestClick,
  isClient = false,
}) => {
  const { currentLanguage } = useLanguage();

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // Scroll transform for parallax effect
  const { scrollYProgress } = useScroll();
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <MotionDiv
      className="flex flex-col max-w-[654px] gap-6 lg:gap-8 text-center lg:text-left flex-1 justify-center"
      style={{ y: textY }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      data-testid="hero-main-content"
    >
      {/* Hero Title */}
      <MotionDiv
        className="font-alliance font-normal text-white text-3xl md:text-5xl lg:text-[64px] leading-[1.1]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        data-testid="hero-title"
      >
        {t('hero.title')
          .split('\n')
          .map((line: string, index: number) => (
            <MotionDiv
              key={index}
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
            >
              {line}
            </MotionDiv>
          ))}
      </MotionDiv>

      {/* Hero Subtitle */}
      <MotionDiv
        className="font-alliance font-light text-zinc-400 text-base md:text-lg lg:text-xl leading-[1.6] max-w-[555px] mx-auto lg:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        data-testid="hero-subtitle"
      >
        {t('hero.subtitle')}
      </MotionDiv>

      {/* CTA Button */}
      <MotionDiv
        whileHover={optimizedHoverAnimation}
        whileTap={optimizedTapAnimation}
        className="w-fit mx-auto lg:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      >
        <Button
          onClick={() => {
            if (onRequestClick) {
              onRequestClick();
            } else {
              const targetUrl = currentLanguage === 'en' ? '/en/request' : '/request';
              handleNavigation(targetUrl);
            }
          }}
          size="lg"
          className="w-40 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] transition-all duration-300 ease-out border-0"
          data-testid="hero-cta-button"
        >
          <span className="relative z-10">{t('hero.requestButton')}</span>
        </Button>
      </MotionDiv>
    </MotionDiv>
  );
};