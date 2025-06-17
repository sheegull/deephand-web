/**
 * DitherBackgroundLazy - Lazy Loaded Three.js Background Component
 * 
 * TDD Approach:
 * - 遅延読み込みによるバンドルサイズ最適化
 * - Intersection Observerによる効率的な読み込み
 * - WebGL対応・デバイス性能チェック
 * - 低性能デバイス向けフォールバック
 * - メモリリーク防止のためのクリーンアップ
 */

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

// Lazy load the heavy Three.js component (Fixed import syntax)
const DitherBackground = lazy(() => 
  import('./DitherBackground').then(module => ({
    default: module.default  // ✅ Fixed: Use default export correctly
  })).catch(error => {
    console.warn('Failed to load DitherBackground, falling back to static background:', error);
    // Fallback component for load failure
    return {
      default: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
        <div 
          className={`bg-[#1e1e1e] ${className}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.05) 0%, transparent 40%)
            `
          }}
        >
          {children}
        </div>
      )
    };
  })
);

interface DitherBackgroundLazyProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Device Performance Detection
 * ローエンドデバイスを検出してフォールバックを決定
 */
const detectDevicePerformance = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';

  // Hardware concurrency check
  const cores = navigator.hardwareConcurrency || 2;
  
  // Memory check (if available)
  const memory = (navigator as any).deviceMemory;
  
  // User agent detection for mobile devices
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Performance scoring
  let performanceScore = 0;
  
  if (cores >= 8) performanceScore += 3;
  else if (cores >= 4) performanceScore += 2;
  else performanceScore += 1;
  
  if (memory) {
    if (memory >= 8) performanceScore += 3;
    else if (memory >= 4) performanceScore += 2;
    else performanceScore += 1;
  } else {
    performanceScore += 2; // Assume medium if unknown
  }
  
  if (isMobile) performanceScore -= 2;
  
  if (performanceScore >= 5) return 'high';
  if (performanceScore >= 3) return 'medium';
  return 'low';
};

/**
 * WebGL Capability Detection
 * WebGL対応状況をチェック
 */
const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (error) {
    return false;
  }
};

/**
 * Prefers Reduced Motion Detection
 * ユーザーのモーション設定を確認
 */
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Universal Fallback Component
 * SSR/CSR一貫性のためのユニバーサルフォールバック
 */
const UniversalFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`bg-[#1e1e1e] ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.05) 0%, transparent 40%)
      `
    }}
  />
);

/**
 * Loading Fallback Component
 * 読み込み中の表示（Hydration後のみ使用）
 */
const LoadingFallback: React.FC<{ className?: string }> = ({ className }) => (
  <UniversalFallback className={className} />
);

/**
 * Error Fallback Component  
 * エラー時の表示（Hydration後のみ使用）
 */
const ErrorFallback: React.FC<{ className?: string }> = ({ className }) => (
  <UniversalFallback className={className} />
);

/**
 * Static Fallback Component
 * 低性能デバイス向けの静的な背景（Hydration後のみ使用）
 */
const StaticFallback: React.FC<{ className?: string }> = ({ className }) => (
  <UniversalFallback className={className} />
);

/**
 * Main DitherBackgroundLazy Component (Hydration Safe)
 */
export const DitherBackgroundLazy: React.FC<DitherBackgroundLazyProps> = (props) => {
  const {
    className,
    children,
    disableAnimation = false,
    ...ditherProps
  } = props;

  // Hydration-safe state management
  const [isClient, setIsClient] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [deviceChecked, setDeviceChecked] = useState(false);
  const [shouldShowThreeJS, setShouldShowThreeJS] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Step 1: Hydration-safe client detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Step 2: Device capability detection (after hydration)
  useEffect(() => {
    if (!isClient) return;

    const checkDeviceCapability = () => {
      const devicePerformance = detectDevicePerformance();
      const webGLSupported = checkWebGLSupport();
      const reducedMotion = prefersReducedMotion();
      
      const canShowThreeJS = devicePerformance !== 'low' && webGLSupported && !reducedMotion;
      setShouldShowThreeJS(canShowThreeJS);
      setDeviceChecked(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(checkDeviceCapability, 50);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Step 3: Intersection Observer setup (after device check)
  useEffect(() => {
    if (!deviceChecked || !shouldShowThreeJS || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay to ensure smooth transition
          setTimeout(() => setShouldLoad(true), 100);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current = observer;
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [deviceChecked, shouldShowThreeJS]);

  // Error boundary
  const handleError = useCallback((error: Error) => {
    console.warn('DitherBackground failed to load:', error);
    setHasError(true);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Always render universal fallback initially (SSR/CSR consistent)
  if (!isClient || !deviceChecked) {
    return (
      <div ref={containerRef} className={className}>
        <UniversalFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // Show static fallback for low-performance devices
  if (!shouldShowThreeJS) {
    return (
      <div ref={containerRef} className={className}>
        <StaticFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // Show error fallback if Three.js failed to load
  if (hasError) {
    return (
      <div ref={containerRef} className={className}>
        <ErrorFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // Show loading state until intersection
  if (!isVisible || !shouldLoad) {
    return (
      <div ref={containerRef} className={className}>
        <LoadingFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // Render Three.js background with Suspense
  return (
    <div ref={containerRef} className={className}>
      <Suspense fallback={<LoadingFallback className="absolute inset-0" />}>
        <DitherBackground
          {...ditherProps}
          disableAnimation={disableAnimation}
          className="absolute inset-0"
        />
      </Suspense>
      {children}
    </div>
  );
};

export default DitherBackgroundLazy;