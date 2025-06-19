// TDD Green Step: Motion configuration implementation

export interface DeviceCapabilities {
  isMobile: boolean;
  supportsAdvancedAnimations: boolean;
  particleCount: number;
  lowPowerMode: boolean;
  preferredFrameRate: number;
}

export interface PerformanceBudget {
  targetFrameTime: number;
  maxMemoryUsage: number;
  fallbackThreshold: number;
}

export interface PerformanceMonitoring {
  enabled: boolean;
  sampleInterval: number;
  alertThreshold: number;
}

export interface MotionConfig {
  enableComplexAnimations: boolean;
  particleCount: number;
  animationDuration: number;
  targetFPS: number;
  respectReducedMotion: boolean;
  fallbackMode: 'simple' | 'disabled';
  performanceBudget: PerformanceBudget;
  deviceCapabilities: DeviceCapabilities;
  performanceMonitoring: PerformanceMonitoring;
  shouldTriggerFallback?: (performanceData: {
    averageFPS: number;
    frameDrops: number;
    memoryUsage: number;
  }) => boolean;
}

// Detect reduced motion preference
export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Detect device capabilities
export function getDeviceCapabilities(): DeviceCapabilities | Promise<DeviceCapabilities> {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  const capabilities: DeviceCapabilities = {
    isMobile,
    supportsAdvancedAnimations: true, // iOS でもアニメーション有効化
    particleCount: isMobile ? 50 : 200,
    lowPowerMode: false,
    preferredFrameRate: isMobile ? 30 : 60,
  };

  // Check battery status for low power mode detection
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    return (navigator as any)
      .getBattery()
      .then((battery: any) => {
        const lowPowerMode = !battery.charging && battery.level < 0.3;
        return {
          ...capabilities,
          lowPowerMode,
        };
      })
      .catch(() => capabilities);
  }

  return capabilities;
}

// Optimize configuration based on device capabilities
export function optimizeForPerformance(
  capabilities: DeviceCapabilities,
  reducedMotion = false
): MotionConfig {
  const baseConfig: MotionConfig = {
    enableComplexAnimations: !reducedMotion && capabilities.supportsAdvancedAnimations,
    particleCount: capabilities.particleCount,
    animationDuration: capabilities.isMobile ? 0.3 : 0.6,
    targetFPS: capabilities.preferredFrameRate,
    respectReducedMotion: reducedMotion,
    fallbackMode: reducedMotion ? 'simple' : 'disabled',
    performanceBudget: {
      targetFrameTime: 1000 / capabilities.preferredFrameRate,
      maxMemoryUsage: capabilities.isMobile ? 50000000 : 100000000, // 50MB mobile, 100MB desktop
      fallbackThreshold: capabilities.preferredFrameRate * 0.7, // 70% of target FPS
    },
    deviceCapabilities: capabilities,
    performanceMonitoring: {
      enabled: true,
      sampleInterval: 1000, // 1 second
      alertThreshold: capabilities.preferredFrameRate * 0.5, // 50% of target FPS
    },
  };

  // Add fallback trigger function
  baseConfig.shouldTriggerFallback = performanceData => {
    return (
      performanceData.averageFPS < baseConfig.performanceBudget.fallbackThreshold ||
      performanceData.frameDrops > 30 ||
      performanceData.memoryUsage > baseConfig.performanceBudget.maxMemoryUsage
    );
  };

  return baseConfig;
}

// Create complete motion configuration
export function createMotionConfig(): MotionConfig {
  const reducedMotion = detectReducedMotion();
  const capabilities = getDeviceCapabilities();

  // Handle both sync and async capabilities
  if (capabilities instanceof Promise) {
    // For async battery detection, return default config immediately
    // and update later if needed
    const defaultCapabilities: DeviceCapabilities = {
      isMobile: /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      ),
      supportsAdvancedAnimations: true, // iOS でもアニメーション有効化
      particleCount: 150,
      lowPowerMode: false,
      preferredFrameRate: 60,
    };

    return optimizeForPerformance(defaultCapabilities, reducedMotion);
  }

  return optimizeForPerformance(capabilities, reducedMotion);
}
