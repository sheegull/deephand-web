import React, { Suspense } from 'react';
import { useScroll, useTransform } from '../ui/motion-optimized';

// Lazy load the background component for better performance
const DitherBackgroundUnified = React.lazy(() => import('../ui/DitherBackgroundUnified'));

interface HeroBackgroundProps {
  quality?: 'low' | 'medium' | 'high';
  mode?: 'minimal' | 'standard' | 'enhanced';
  lazy?: boolean;
}

/**
 * HeroBackground - Background animation extracted from HeroSection
 * Handles lazy-loaded dither background with parallax effects
 */
export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  quality = 'medium',
  mode = 'standard',
  lazy = true,
}) => {
  // Scroll transform for parallax effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Loading fallback for better UX
  const LoadingFallback = () => (
    <div 
      className="absolute inset-0 z-0 opacity-60"
      style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 25%, #1e1e1e 50%, #2a2a2a 75%, #1e1e1e 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite'
      }}
      data-testid="hero-background-loading"
    />
  );

  return (
    <div 
      className="absolute inset-0 z-0"
      style={{ y: backgroundY }}
      data-testid="hero-background"
    >
      <Suspense fallback={<LoadingFallback />}>
        <DitherBackgroundUnified
          waveSpeed={0.05}
          waveFrequency={6.0}
          waveAmplitude={0.05}
          waveColor={[0.35, 0.36, 0.37]}
          colorNum={8}
          pixelSize={1}
          className="absolute inset-0 z-0 opacity-60"
          forceMode="optimized"
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.1}
        />
      </Suspense>
      
      {/* CSS Animation for loading fallback */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};