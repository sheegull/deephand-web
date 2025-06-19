/**
 * DitherBackgroundOptimized - Zero-Delay Optimized Background
 * 
 * TDD Problem: 0.5-1秒の初期ラグ除去
 * Solution: 段階的遅延を最小化し、並列処理で高速化
 */

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

// ⚡ 最適化1: より積極的なプリロード
const DitherBackground = lazy(() => {
  // 即座にプリロード開始
  const loadPromise = import('./DitherBackground').then(module => ({
    default: module.default
  })).catch(error => {
    console.warn('Failed to load DitherBackground:', error);
    return {
      default: ({ className }: { className?: string }) => (
        <div 
          className={`bg-[#1e1e1e] ${className}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.05) 0%, transparent 40%)
            `
          }}
        />
      )
    };
  });

  return loadPromise;
});

interface DitherBackgroundOptimizedProps {
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

// ⚡ 最適化2: キャッシュされたデバイス検出
let devicePerformanceCache: 'high' | 'medium' | 'low' | null = null;
let webGLSupportCache: boolean | null = null;

const detectDevicePerformanceOptimized = (): 'high' | 'medium' | 'low' => {
  if (devicePerformanceCache !== null) return devicePerformanceCache;
  if (typeof window === 'undefined') return 'medium';

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  let score = 0;
  
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;
  
  if (memory) {
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;
  } else {
    score += 2;
  }
  
  if (isMobile) score -= 2;
  
  const result = score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low';
  devicePerformanceCache = result;
  return result;
};

const checkWebGLSupportOptimized = (): boolean => {
  if (webGLSupportCache !== null) return webGLSupportCache;
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    webGLSupportCache = !!gl;
    return webGLSupportCache;
  } catch (error) {
    webGLSupportCache = false;
    return false;
  }
};

// ⚡ 最適化3: 即座の代替表示（ラグなし）
const InstantFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`bg-[#1e1e1e] ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.05) 0%, transparent 40%),
        linear-gradient(45deg, 
          rgba(31, 33, 36, 0.3) 0%, 
          rgba(35, 74, 217, 0.02) 25%, 
          rgba(30, 62, 184, 0.02) 75%, 
          rgba(31, 33, 36, 0.3) 100%
        )
      `,
      // ⚡ CSS-only微細な動的効果
      animation: 'subtle-drift 20s ease-in-out infinite',
    }}
  />
);

// ⚡ 最適化4: ゼロ遅延コンポーネント
export const DitherBackgroundOptimized: React.FC<DitherBackgroundOptimizedProps> = (props) => {
  const {
    className,
    children,
    disableAnimation = false,
    ...ditherProps
  } = props;

  // 🚀 並列状態管理（遅延なし）
  const [isClient, setIsClient] = useState(false);
  const [shouldShowThreeJS, setShouldShowThreeJS] = useState(false);
  const [isThreeJSReady, setIsThreeJSReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  // ⚡ Step 1: 即座のhydration検出
  useEffect(() => {
    setIsClient(true);
    
    // 並列でデバイス検出開始（遅延なし）
    const devicePerformance = detectDevicePerformanceOptimized();
    const webGLSupported = checkWebGLSupportOptimized();
    const reducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const canShowThreeJS = devicePerformance !== 'low' && webGLSupported && !reducedMotion;
    setShouldShowThreeJS(canShowThreeJS);

    // ⚡ Three.js読み込み並列開始（Intersection Observer不要）
    if (canShowThreeJS) {
      // 🚀 微小遅延でスムーズな移行（元の150msから10msに短縮）
      initTimeoutRef.current = setTimeout(() => {
        setIsThreeJSReady(true);
      }, 10);
    }
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  // エラーハンドリング
  const handleError = useCallback((error: Error) => {
    console.warn('DitherBackground failed to load:', error);
    setHasError(true);
  }, []);

  // ⚡ 最適化5: 条件分岐最小化

  // SSR/初期状態：即座の代替表示
  if (!isClient) {
    return (
      <div ref={containerRef} className={className}>
        <InstantFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // 低性能デバイス：即座の静的背景
  if (!shouldShowThreeJS) {
    return (
      <div ref={containerRef} className={className}>
        <InstantFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // エラー時：即座のフォールバック
  if (hasError) {
    return (
      <div ref={containerRef} className={className}>
        <InstantFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // Three.js準備中：即座の代替 + プリロード
  if (!isThreeJSReady) {
    return (
      <div ref={containerRef} className={className}>
        <InstantFallback className="absolute inset-0" />
        {children}
      </div>
    );
  }

  // ⚡ Three.js表示：最小遅延で移行
  return (
    <div ref={containerRef} className={className}>
      <Suspense 
        fallback={<InstantFallback className="absolute inset-0" />}
      >
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

// CSS Animation for subtle background movement (lagless)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes subtle-drift {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 0% 0%;
      }
      25% { 
        background-position: 10% 5%, 90% 95%, 5% 10%;
      }
      50% { 
        background-position: 5% 10%, 95% 90%, 10% 5%;
      }
      75% { 
        background-position: 15% 5%, 85% 95%, 5% 15%;
      }
    }
  `;
  document.head.appendChild(style);
}

export default DitherBackgroundOptimized;