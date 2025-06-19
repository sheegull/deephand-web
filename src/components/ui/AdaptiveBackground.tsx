/**
 * AdaptiveBackground - 統一的な背景コンポーネント
 * 
 * デバイス性能に応じて最適なレンダリング方式を自動選択
 * シンプルで可読性の高い実装
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useMobilePerformance } from '../lib/performance/mobile-performance-manager';

// 遅延読み込みコンポーネント
const DitherBackgroundUnified = lazy(() => import('./DitherBackgroundUnified'));

interface AdaptiveBackgroundProps {
  type?: 'dither' | 'metaBalls' | 'auto';
  className?: string;
  children?: React.ReactNode;
  fallbackBackground?: string;
}

// 静的フォールバックコンポーネント
const StaticFallback: React.FC<{ className?: string; type?: string }> = ({ 
  className = '', 
  type = 'default' 
}) => {
  const gradients = {
    dither: `linear-gradient(135deg, 
      rgba(17, 24, 39, 1) 0%, 
      rgba(31, 41, 55, 1) 50%, 
      rgba(17, 24, 39, 1) 100%)`,
    metaBalls: `radial-gradient(circle at 30% 30%, 
      rgba(59, 130, 246, 0.1) 0%, 
      transparent 50%), 
      radial-gradient(circle at 70% 70%, 
      rgba(147, 51, 234, 0.1) 0%, 
      transparent 50%), 
      linear-gradient(135deg, rgba(17, 24, 39, 1) 0%, rgba(31, 41, 55, 1) 100%)`,
    default: `linear-gradient(135deg, 
      rgba(17, 24, 39, 1) 0%, 
      rgba(31, 41, 55, 1) 100%)`,
  };

  return (
    <div 
      className={`w-full h-full ${className}`}
      style={{
        background: gradients[type as keyof typeof gradients] || gradients.default,
      }}
    />
  );
};

// ローディングコンポーネント
const LoadingFallback: React.FC<{ className?: string }> = ({ className }) => (
  <StaticFallback className={className} type="default" />
);

// エラーフォールバックコンポーネント  
const ErrorFallback: React.FC<{ className?: string; type?: string }> = ({ className, type }) => (
  <StaticFallback className={className} type={type} />
);

/**
 * メインコンポーネント
 */
export const AdaptiveBackground: React.FC<AdaptiveBackgroundProps> = ({
  type = 'auto',
  className = 'w-full h-full absolute inset-0 z-0',
  children,
  fallbackBackground,
}) => {
  const {
    deviceCapabilities,
    performanceSettings,
    shouldRenderComponent,
    getDitherSettings,
    getMetaBallsSettings,
  } = useMobilePerformance();

  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  // クライアント検出
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 最適なコンポーネントタイプの決定
  const getOptimalType = (): 'dither' | 'metaBalls' | 'static' => {
    // 手動指定がある場合
    if (type !== 'auto') {
      if (!shouldRenderComponent(type)) return 'static';
      return type;
    }

    // 自動選択ロジック
    if (!performanceSettings.enableComplexEffects) return 'static';
    
    if (performanceSettings.quality === 'high') {
      return 'dither'; // 高性能デバイスではdither優先
    } else if (performanceSettings.quality === 'medium') {
      return deviceCapabilities.isMobile ? 'metaBalls' : 'dither'; // モバイルではmetaBalls
    } else {
      return 'static'; // 低性能では静的背景
    }
  };

  // エラーハンドリング
  const handleError = (error: Error) => {
    console.warn('AdaptiveBackground エラー:', error);
    setHasError(true);
  };

  // レンダリング判定
  const renderContent = () => {
    // SSR または初期化前
    if (!isClient) {
      return <StaticFallback className="absolute inset-0" />;
    }

    // エラー発生時
    if (hasError) {
      return <ErrorFallback className="absolute inset-0" type={type} />;
    }

    const optimalType = getOptimalType();

    // 静的背景の場合
    if (optimalType === 'static') {
      return (
        <div 
          className="absolute inset-0"
          style={fallbackBackground ? { background: fallbackBackground } : {}}
        >
          <StaticFallback className="w-full h-full" type={type} />
        </div>
      );
    }

    // 動的背景の場合
    try {
      if (optimalType === 'dither') {
        const ditherSettings = getDitherSettings();
        return (
          <Suspense fallback={<LoadingFallback className="absolute inset-0" />}>
            <DitherBackgroundUnified
              className="absolute inset-0"
              waveSpeed={ditherSettings.waveSpeed}
              waveFrequency={ditherSettings.waveFrequency}
              waveAmplitude={ditherSettings.waveAmplitude}
              colorNum={ditherSettings.colorNum}
              pixelSize={ditherSettings.pixelSize}
              disableAnimation={!performanceSettings.enableAnimations}
              enableMouseInteraction={performanceSettings.enableMouseInteraction}
            />
          </Suspense>
        );
      } else if (optimalType === 'metaBalls') {
        // MetaBalls は DitherBackgroundUnified で代替
        return (
          <Suspense fallback={<LoadingFallback className="absolute inset-0" />}>
            <DitherBackgroundUnified
              className="absolute inset-0"
              forceMode="fallback"
              disableAnimation={!performanceSettings.enableAnimations}
              enableMouseInteraction={performanceSettings.enableMouseInteraction}
            />
          </Suspense>
        );
      }
    } catch (error) {
      handleError(error as Error);
      return <ErrorFallback className="absolute inset-0" type={type} />;
    }

    // フォールバック
    return <StaticFallback className="absolute inset-0" type={type} />;
  };

  return (
    <div className={className}>
      {renderContent()}
      {children}
    </div>
  );
};

export default AdaptiveBackground;

// 使用例とヘルパー
export const DitherBackground: React.FC<Omit<AdaptiveBackgroundProps, 'type'>> = (props) => (
  <AdaptiveBackground {...props} type="dither" />
);

export const MetaBallsBackground: React.FC<Omit<AdaptiveBackgroundProps, 'type'>> = (props) => (
  <AdaptiveBackground {...props} type="metaBalls" />
);

export const AutoBackground: React.FC<AdaptiveBackgroundProps> = (props) => (
  <AdaptiveBackground {...props} type="auto" />
);