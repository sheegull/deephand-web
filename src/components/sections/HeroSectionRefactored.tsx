import React, { useState, useEffect } from 'react';
import { HeroHeader } from './HeroHeader';
import { HeroMainContent } from './HeroMainContent';
import { HeroContactForm } from './HeroContactForm';
import { HeroFooter } from './HeroFooter';
import { HeroBackground } from './HeroBackground';
import { useMemoryTracking } from '@/lib/performance/memory-optimizer';

interface HeroSectionRefactoredProps {
  onRequestClick?: () => void;
  onNavClick?: (element: string) => void;
  onLogoClick?: () => void;
  isLoading?: boolean;
}

/**
 * Refactored HeroSection - Split into 5 focused components
 * Reduced from 725 lines to ~50 lines with lazy loading
 * Implements TDD approach with clear separation of concerns
 */
export const HeroSectionRefactored: React.FC<HeroSectionRefactoredProps> = ({
  onRequestClick,
  onNavClick,
  onLogoClick,
  isLoading = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  
  // メモリ使用量追跡 - Performance optimization Phase 4
  useMemoryTracking('HeroSectionRefactored', [
    () => console.debug('[Memory] HeroSectionRefactored cleanup completed')
  ]);

  // Client-side hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div 
      className="flex flex-col w-full items-start bg-[#1e1e1e] min-h-screen relative"
      data-testid="hero-section"
    >
      {/* Background - Lazy loaded for performance */}
      <HeroBackground 
        quality="medium"
        mode="standard"
        lazy={true}
      />

      {/* Header Navigation */}
      <HeroHeader
        onNavClick={onNavClick}
        onLogoClick={onLogoClick}
        isClient={isClient}
      />

      {/* Main Content Area */}
      <main className="relative w-full px-4 md:px-[92px] flex-1 shadow-[0px_4px_4px_#00000040] mt-16 sm:mt-18 lg:mt-20 z-10">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center py-[60px] md:py-[100px] gap-8 lg:gap-16 relative z-10 min-h-[calc(100vh-180px)]">
          
          {/* Main Content */}
          <HeroMainContent
            onRequestClick={onRequestClick}
            isClient={isClient}
          />

          {/* Contact Form */}
          <HeroContactForm
            isClient={isClient}
          />
        </div>

        {/* Footer */}
        <HeroFooter
          onNavClick={onNavClick}
          isClient={isClient}
        />
      </main>
    </div>
  );
};

export default HeroSectionRefactored;