/**
 * DitherBackgroundLazyOptimized - 最適化された遅延読み込み背景コンポーネント
 * 
 * TDD Approach:
 * - モバイル性能最適化に特化
 * - シンプルで可読性の高いコード
 * - デバイス適応型の設定自動切り替え
 * - 最小限のメモリフットプリント
 */

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

// 最適化されたコンポーネントの遅延読み込み
const DitherBackgroundOptimized = lazy(() => 
  import('./DitherBackgroundOptimized').then(module => ({
    default: module.default
  })).catch(error => {
    console.warn('Failed to load optimized DitherBackground, using fallback:', error);
    return {
      default: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
        <div 
          className={`bg-gradient-to-br from-gray-900 to-gray-800 ${className}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {children}
        </div>
      )
    };
  })
);

interface DitherBackgroundLazyOptimizedProps {
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

// シンプルなデバイス性能検出
const detectDeviceCapabilities = () => {
  if (typeof window === 'undefined') return { shouldLoad: false, isLowEnd: true };

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // WebGL簡易チェック
  let supportsWebGL = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    supportsWebGL = !!gl;
  } catch {
    supportsWebGL = false;
  }

  // シンプルな判定ロジック
  const isLowEnd = cores <= 2 || (memory && memory <= 4) || isMobile;
  const shouldLoad = supportsWebGL && !prefersReducedMotion && !isLowEnd;

  return {
    shouldLoad,
    isLowEnd,
    isMobile,
    supportsWebGL,
    prefersReducedMotion,
    cores,
    memory,
  };
};

// 統一フォールバックコンポーネント
const UnifiedFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`bg-gradient-to-br from-gray-900 to-gray-800 ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.08) 0%, transparent 40%)
      `
    }}
  />
);

/**
 * メインコンポーネント - シンプルで高性能
 */
export const DitherBackgroundLazyOptimized: React.FC<DitherBackgroundLazyOptimizedProps> = (props) => {
  const {
    className = "w-full h-full absolute inset-0 z-0",
    children,
    disableAnimation = false,
    ...optimizedProps
  } = props;

  // 状態管理 - 最小限
  const [isClient, setIsClient] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({ shouldLoad: false, isLowEnd: true });
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Step 1: クライアント検出
  useEffect(() => {
    setIsClient(true);
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  // Step 2: Intersection Observer（効率的）
  useEffect(() => {
    if (!isClient || !deviceCapabilities.shouldLoad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 小さな遅延で段階的レンダリング
          setTimeout(() => setShouldRender(true), 100);
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

    return () => observer.disconnect();
  }, [isClient, deviceCapabilities.shouldLoad]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // レンダリング判定 - シンプルな条件分岐
  const renderContent = () => {
    // SSR または初期化前
    if (!isClient) {
      return <UnifiedFallback className="absolute inset-0" />;
    }

    // WebGL非対応 または 低性能デバイス
    if (!deviceCapabilities.shouldLoad) {
      return <UnifiedFallback className="absolute inset-0" />;
    }

    // 未表示 または レンダリング前
    if (!isVisible || !shouldRender) {
      return <UnifiedFallback className="absolute inset-0" />;
    }

    // 最適化版の描画
    return (
      <Suspense fallback={<UnifiedFallback className="absolute inset-0" />}>
        <DitherBackgroundOptimized
          {...optimizedProps}
          disableAnimation={disableAnimation}
          className="absolute inset-0"
        />
      </Suspense>
    );
  };

  return (
    <div ref={containerRef} className={className}>
      {renderContent()}
      {children}
    </div>
  );
};

export default DitherBackgroundLazyOptimized;