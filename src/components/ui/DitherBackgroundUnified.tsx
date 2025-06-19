/**
 * DitherBackgroundUnified - 最終統合版
 * 
 * TDD実装:
 * - 7つのDitherBackgroundファイルを1つに統合
 * - 遅延読み込み + デバイス検出 + パフォーマンス最適化
 * - すべての冗長ファイルを置き換える完全版
 */

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState, useMemo } from 'react';

// Performance detection cache
let deviceCapabilitiesCache: {
  performance: 'high' | 'medium' | 'low';
  webGLSupported: boolean;
  reducedMotion: boolean;
  shouldLoadThreeJS: boolean;
  isMobile: boolean;
  cores: number;
  memory?: number;
} | null = null;

/**
 * デバイス能力検出（キャッシュ付き）
 */
const detectDeviceCapabilities = () => {
  if (deviceCapabilitiesCache !== null) return deviceCapabilitiesCache;
  
  if (typeof window === 'undefined') {
    return {
      performance: 'medium' as const,
      webGLSupported: false,
      reducedMotion: false,
      shouldLoadThreeJS: false,
      isMobile: false,
      cores: 2,
      memory: undefined
    };
  }

  // Hardware detection
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // WebGL support check
  let webGLSupported = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    webGLSupported = !!gl;
  } catch {
    webGLSupported = false;
  }

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
    performanceScore += 2; // デフォルト
  }

  if (isMobile) performanceScore -= 2;

  const performance = performanceScore >= 5 ? 'high' : performanceScore >= 3 ? 'medium' : 'low';
  const shouldLoadThreeJS = performance !== 'low' && webGLSupported && !reducedMotion;

  deviceCapabilitiesCache = {
    performance,
    webGLSupported,
    reducedMotion,
    shouldLoadThreeJS,
    isMobile,
    cores,
    memory
  };

  return deviceCapabilitiesCache;
};

// 元のDitherBackgroundOptimizedを使用して既存のアニメーションを保持
const DitherBackgroundOptimized = lazy(() => 
  import('./DitherBackgroundOptimized').then(module => ({
    default: module.default
  })).catch(() => {
    console.warn('Failed to load DitherBackgroundOptimized, using enhanced fallback');
    return {
      default: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
        <EnhancedFallback className={className}>
          {children}
        </EnhancedFallback>
      )
    };
  })
);

/**
 * 高性能フォールバック（CSS-only animation）
 */
const EnhancedFallback: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className, 
  children 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
        `,
        willChange: 'transform',
        transform: 'translateZ(0)', // GPU レイヤー作成
      }}
    >
      {children}
    </div>
  );
};

/**
 * シンプルフォールバック（軽量版）
 */
const SimpleFallback: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className, 
  children 
}) => (
  <div 
    className={`bg-gradient-to-br from-gray-900 to-gray-800 ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 40%)
      `
    }}
  >
    {children}
  </div>
);

interface DitherBackgroundUnifiedProps {
  // DitherBackground 統合プロパティ
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  
  // レイアウトプロパティ
  className?: string;
  children?: React.ReactNode;
  
  // パフォーマンス制御
  forceMode?: 'auto' | 'optimized' | 'fallback' | 'simple';
  
  // その他
  'data-testid'?: string;
}

/**
 * DitherBackgroundUnified - メインコンポーネント
 */
export const DitherBackgroundUnified: React.FC<DitherBackgroundUnifiedProps> = (props) => {
  const {
    className = "w-full h-full absolute inset-0 z-0",
    children,
    forceMode = 'auto',
    'data-testid': dataTestId = 'dither-background-unified',
    disableAnimation = false,
    ...ditherProps
  } = props;

  // 状態管理
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // デバイス能力検出（メモ化）
  const deviceCapabilities = useMemo(() => detectDeviceCapabilities(), []);

  // クライアント検出
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Intersection Observer（遅延読み込み）
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 段階的レンダリング
          const timer = setTimeout(() => setShouldRender(true), 100);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current = observer;
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isClient]);

  // エラーハンドリング
  const handleError = useCallback(() => {
    setLoadError(true);
  }, []);

  // レンダリング判定
  const getRenderMode = () => {
    if (forceMode !== 'auto') return forceMode;
    
    if (!isClient || !isVisible || !shouldRender || loadError) {
      return 'simple';
    }

    if (!deviceCapabilities.shouldLoadThreeJS) {
      return deviceCapabilities.performance === 'medium' ? 'fallback' : 'simple';
    }

    return 'optimized';
  };

  const renderMode = getRenderMode();

  // コンテンツレンダリング
  const renderContent = () => {
    switch (renderMode) {
      case 'optimized':
        return (
          <Suspense fallback={<EnhancedFallback className="absolute inset-0" />}>
            <DitherBackgroundOptimized
              {...ditherProps}
              disableAnimation={disableAnimation}
              className="absolute inset-0"
            />
          </Suspense>
        );

      case 'fallback':
        return <EnhancedFallback className="absolute inset-0" />;

      case 'simple':
      default:
        return <SimpleFallback className="absolute inset-0" />;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={className}
      data-testid={dataTestId}
      data-render-mode={renderMode}
    >
      {renderContent()}
      {children}
    </div>
  );
};

export default DitherBackgroundUnified;