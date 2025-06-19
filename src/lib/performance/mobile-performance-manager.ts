/**
 * Mobile Performance Manager
 * 
 * モバイルデバイス用の統一的な性能管理システム
 * シンプルで可読性の高い実装
 */

interface DeviceCapabilities {
  readonly isLowEnd: boolean;
  readonly isMobile: boolean;
  readonly supportsWebGL: boolean;
  readonly cpuCores: number;
  readonly memoryGB: number | null;
  readonly prefersReducedMotion: boolean;
  readonly performanceScore: number; // 0-100の性能スコア
}

interface PerformanceSettings {
  readonly maxFPS: number;
  readonly quality: 'low' | 'medium' | 'high';
  readonly enableAnimations: boolean;
  readonly enableMouseInteraction: boolean;
  readonly enableComplexEffects: boolean;
  readonly memoryBudgetMB: number;
  readonly adaptiveQuality: boolean;
}

interface ComponentSettings {
  readonly dither: {
    octaveCount: number;
    colorNum: number;
    pixelSize: number;
    waveSpeed: number;
    waveFrequency: number;
    waveAmplitude: number;
  };
  readonly metaBalls: {
    ballCount: number;
    animationSize: number;
    speed: number;
    hoverSmoothness: number;
    cursorBallSize: number;
  };
  readonly dataNetwork: {
    nodeCount: number;
    animationSize: number;
    speed: number;
  };
}

// 性能管理クラス（シングルトン）
class MobilePerformanceManager {
  private static instance: MobilePerformanceManager;
  private deviceCapabilities: DeviceCapabilities | null = null;
  private performanceSettings: PerformanceSettings | null = null;
  private componentSettings: ComponentSettings | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MobilePerformanceManager {
    if (!MobilePerformanceManager.instance) {
      MobilePerformanceManager.instance = new MobilePerformanceManager();
    }
    return MobilePerformanceManager.instance;
  }

  // 初期化（ブラウザ環境でのみ実行）
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.performanceSettings = this.calculatePerformanceSettings();
    this.componentSettings = this.calculateComponentSettings();
    this.isInitialized = true;

    console.log('🚀 Mobile Performance Manager initialized', {
      capabilities: this.deviceCapabilities,
      settings: this.performanceSettings,
    });
  }

  // デバイス性能検出（簡素化版）
  private detectDeviceCapabilities(): DeviceCapabilities {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || null;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL対応チェック
    let supportsWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      supportsWebGL = !!gl;
    } catch {
      supportsWebGL = false;
    }

    // 性能スコア計算（0-100）
    let performanceScore = 50; // ベースライン

    // CPU評価
    if (cores >= 8) performanceScore += 25;
    else if (cores >= 4) performanceScore += 15;
    else if (cores >= 2) performanceScore += 5;
    else performanceScore -= 10;

    // メモリ評価
    if (memory) {
      if (memory >= 8) performanceScore += 20;
      else if (memory >= 4) performanceScore += 10;
      else if (memory >= 2) performanceScore += 5;
      else performanceScore -= 5;
    }

    // モバイルペナルティ
    if (isMobile) performanceScore -= 15;

    // WebGL対応ボーナス
    if (supportsWebGL) performanceScore += 10;

    // モーション設定ペナルティ
    if (prefersReducedMotion) performanceScore -= 20;

    performanceScore = Math.max(0, Math.min(100, performanceScore));

    const isLowEnd = performanceScore < 40;

    return {
      isLowEnd,
      isMobile,
      supportsWebGL,
      cpuCores: cores,
      memoryGB: memory,
      prefersReducedMotion,
      performanceScore,
    };
  }

  // 性能設定の計算
  private calculatePerformanceSettings(): PerformanceSettings {
    if (!this.deviceCapabilities) {
      throw new Error('Device capabilities not detected');
    }

    const { performanceScore, isLowEnd, isMobile, supportsWebGL, prefersReducedMotion } = this.deviceCapabilities;

    // 性能スコアに基づく設定
    if (performanceScore >= 70) {
      return {
        maxFPS: 60,
        quality: 'high',
        enableAnimations: !prefersReducedMotion,
        enableMouseInteraction: true,
        enableComplexEffects: supportsWebGL,
        memoryBudgetMB: 150,
        adaptiveQuality: false,
      };
    } else if (performanceScore >= 50) {
      return {
        maxFPS: 45,
        quality: 'medium',
        enableAnimations: !prefersReducedMotion,
        enableMouseInteraction: !isMobile,
        enableComplexEffects: supportsWebGL,
        memoryBudgetMB: 100,
        adaptiveQuality: true,
      };
    } else if (performanceScore >= 30) {
      return {
        maxFPS: 30,
        quality: 'medium',
        enableAnimations: !prefersReducedMotion && !isLowEnd,
        enableMouseInteraction: false,
        enableComplexEffects: supportsWebGL && !isLowEnd,
        memoryBudgetMB: 80,
        adaptiveQuality: true,
      };
    } else {
      return {
        maxFPS: 20,
        quality: 'low',
        enableAnimations: false,
        enableMouseInteraction: false,
        enableComplexEffects: false,
        memoryBudgetMB: 50,
        adaptiveQuality: true,
      };
    }
  }

  // コンポーネント別設定の計算
  private calculateComponentSettings(): ComponentSettings {
    if (!this.performanceSettings || !this.deviceCapabilities) {
      throw new Error('Performance settings not calculated');
    }

    const { quality } = this.performanceSettings;
    const { performanceScore } = this.deviceCapabilities;

    const qualityMultiplier = {
      'low': 0.5,
      'medium': 0.75,
      'high': 1.0,
    }[quality];

    return {
      dither: {
        octaveCount: Math.max(1, Math.floor(4 * qualityMultiplier)), // 最大4、最小1
        colorNum: quality === 'low' ? 2 : quality === 'medium' ? 3 : 4,
        pixelSize: quality === 'low' ? 4 : quality === 'medium' ? 3 : 2,
        waveSpeed: 0.003 * qualityMultiplier,
        waveFrequency: 1.0 * qualityMultiplier,
        waveAmplitude: 0.1 * qualityMultiplier,
      },
      metaBalls: {
        ballCount: Math.max(3, Math.floor(12 * qualityMultiplier)), // 最大12、最小3
        animationSize: 20 + (10 * qualityMultiplier),
        speed: 0.2 * qualityMultiplier,
        hoverSmoothness: quality === 'low' ? 0.1 : 0.05,
        cursorBallSize: 2 + qualityMultiplier,
      },
      dataNetwork: {
        nodeCount: Math.max(5, Math.floor(15 * qualityMultiplier)), // 最大15、最小5
        animationSize: 20 + (10 * qualityMultiplier),
        speed: 0.2 * qualityMultiplier,
      },
    };
  }

  // パブリックAPI
  getDeviceCapabilities(): DeviceCapabilities {
    if (!this.isInitialized) this.initialize();
    return this.deviceCapabilities!;
  }

  getPerformanceSettings(): PerformanceSettings {
    if (!this.isInitialized) this.initialize();
    return this.performanceSettings!;
  }

  getComponentSettings(): ComponentSettings {
    if (!this.isInitialized) this.initialize();
    return this.componentSettings!;
  }

  // 特定コンポーネント用の設定取得
  getDitherSettings() {
    return this.getComponentSettings().dither;
  }

  getMetaBallsSettings() {
    return this.getComponentSettings().metaBalls;
  }

  getDataNetworkSettings() {
    return this.getComponentSettings().dataNetwork;
  }

  // 動的品質調整（将来的な拡張用）
  shouldRenderComponent(componentType: 'dither' | 'metaBalls' | 'dataNetwork'): boolean {
    const settings = this.getPerformanceSettings();
    
    if (!settings.enableComplexEffects) {
      return false;
    }

    if (settings.quality === 'low' && componentType === 'dataNetwork') {
      return false; // 低品質時はDataNetworkを無効
    }

    return true;
  }

  // デバッグ情報
  getDebugInfo() {
    if (!this.isInitialized) this.initialize();
    
    return {
      initialized: this.isInitialized,
      deviceCapabilities: this.deviceCapabilities,
      performanceSettings: this.performanceSettings,
      componentSettings: this.componentSettings,
      timestamp: new Date().toISOString(),
    };
  }
}

// エクスポート
export const performanceManager = MobilePerformanceManager.getInstance();

// React Hook用のヘルパー
export function useMobilePerformance() {
  const manager = performanceManager;
  
  // 初期化確認
  if (typeof window !== 'undefined' && !manager['isInitialized']) {
    manager.initialize();
  }

  return {
    deviceCapabilities: manager.getDeviceCapabilities(),
    performanceSettings: manager.getPerformanceSettings(),
    componentSettings: manager.getComponentSettings(),
    shouldRenderComponent: manager.shouldRenderComponent.bind(manager),
    getDitherSettings: manager.getDitherSettings.bind(manager),
    getMetaBallsSettings: manager.getMetaBallsSettings.bind(manager),
    getDataNetworkSettings: manager.getDataNetworkSettings.bind(manager),
  };
}

// 型定義のエクスポート
export type {
  DeviceCapabilities,
  PerformanceSettings,
  ComponentSettings,
};