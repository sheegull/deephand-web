// TDD Green Step: Mobile optimization implementation

export interface MobileOptimization {
  mobileFirst: boolean;
  touchTargetSize: number;
  performanceOptimized: boolean;
  batteryEfficient: boolean;
  dataOptimization: {
    compressedAssets: boolean;
    minimalPayloads: boolean;
    prioritizedContent: boolean;
  };
  batteryOptimization: {
    reducedAnimations: boolean;
    efficientRendering: boolean;
    backgroundOptimization: boolean;
  };
}

export interface TouchOptimization {
  touchTargets: {
    minSize: number;
    spacing: number;
  };
  hapticFeedback: boolean;
  gestureRecognition: boolean;
  visualFeedback: boolean;
  feedbackDelay: number;
  scrollOptimization: {
    smoothScrolling: boolean;
    momentum: boolean;
    overscrollBehavior: string;
  };
  supportedGestures: string[];
}

export interface ProgressiveLoading {
  criticalResourcesFirst: boolean;
  lazyLoadingEnabled: boolean;
  preloadStrategies: string[];
  estimatedImprovement: number;
  criticalResources: {
    css: boolean;
    fonts: boolean;
    scripts: boolean;
  };
  lazyLoading: {
    images: boolean;
    iframes: boolean;
    thirdPartyContent: boolean;
  };
  performanceMetrics: {
    fcp: number;
    lcp: number;
    tti: number;
  };
}

export interface MobileImageOptimization {
  responsive: boolean;
  formats: string[];
  quality: number;
  sizes: number[];
  compressionLevel: number;
  highDPI: boolean;
  retinaSupport: boolean;
  srcset: string;
}

export interface MobileMetrics {
  fcp: number;
  lcp: number;
  tti: number;
  cls: number;
  touchResponseTime: number;
  scrollPerformance: number;
  batteryUsage: 'low' | 'medium' | 'high';
  networkEfficiency: number;
}

export interface MobileViewport {
  meta: string;
  responsive: boolean;
  userScalable: boolean;
  maximumScale: number;
  accessibilityCompliant: boolean;
}

export interface OfflineSupport {
  serviceWorkerEnabled: boolean;
  cacheStrategy: string;
  offlineCapable: boolean;
  fallbackSupport: boolean;
  cachedResources: {
    css: boolean;
    js: boolean;
    images: boolean;
  };
  stateManagement: {
    onlineDetection: boolean;
    syncWhenOnline: boolean;
    userNotification: boolean;
  };
}

// Detect mobile device
export function detectMobileDevice() {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  // Device type detection
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet =
    /iPad|Android(?=.*\bMobile\b)(?=.*\bTablet\b)|KFAPWI|LG-V909|GT-P\d{4}|SGH-T879|Nexus 7/i.test(
      userAgent
    );

  let deviceType: 'mobile' | 'tablet' | 'desktop';
  if (isTablet) {
    deviceType = 'tablet';
  } else if (isMobile) {
    deviceType = 'mobile';
  } else {
    deviceType = 'desktop';
  }

  // Touch support detection
  const touchSupport =
    isMobile &&
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Screen size detection
  const screenSize =
    typeof window !== 'undefined'
      ? {
          width: window.screen.width,
          height: window.screen.height,
          pixelRatio: window.devicePixelRatio || 1,
        }
      : { width: 375, height: 667, pixelRatio: 2 };

  // Network connection
  const connection =
    typeof navigator !== 'undefined' && 'connection' in navigator
      ? (navigator as any).connection
      : null;

  return {
    isMobile: isMobile || isTablet,
    deviceType,
    screenSize,
    touchSupport,
    connection: {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
    },
  };
}

// Optimize for mobile
export function optimizeForMobile(config: {
  mobileFirst: boolean;
  touchOptimized: boolean;
  reducedMotion: boolean;
  dataOptimized: boolean;
  batteryOptimized: boolean;
}): MobileOptimization {
  return {
    mobileFirst: config.mobileFirst,
    touchTargetSize: config.touchOptimized ? 44 : 32, // WCAG minimum
    performanceOptimized: true,
    batteryEfficient: config.batteryOptimized,
    dataOptimization: {
      compressedAssets: config.dataOptimized,
      minimalPayloads: config.dataOptimized,
      prioritizedContent: config.dataOptimized,
    },
    batteryOptimization: {
      reducedAnimations: config.reducedMotion || config.batteryOptimized,
      efficientRendering: config.batteryOptimized,
      backgroundOptimization: config.batteryOptimized,
    },
  };
}

// Optimize touch interactions
export function optimizeTouchInteractions(config: {
  minTouchTargetSize: number;
  touchFeedback: boolean;
  gestureSupport: boolean;
  scrollOptimization: boolean;
}): TouchOptimization {
  const supportedGestures = config.gestureSupport
    ? ['tap', 'swipe', 'pinch', 'rotate', 'pan']
    : ['tap'];

  return {
    touchTargets: {
      minSize: config.minTouchTargetSize,
      spacing: Math.max(8, config.minTouchTargetSize * 0.2), // 20% of target size or 8px minimum
    },
    hapticFeedback: config.touchFeedback,
    gestureRecognition: config.gestureSupport,
    visualFeedback: config.touchFeedback,
    feedbackDelay: config.touchFeedback ? 50 : 0, // 50ms for good UX
    scrollOptimization: {
      smoothScrolling: config.scrollOptimization,
      momentum: config.scrollOptimization,
      overscrollBehavior: config.scrollOptimization ? 'contain' : 'auto',
    },
    supportedGestures,
  };
}

// Implement progressive loading
export function implementProgressiveLoading(config: {
  criticalFirst: boolean;
  lazyLoading: boolean;
  preloadStrategies: string[];
  compressionEnabled: boolean;
}): ProgressiveLoading {
  // Calculate estimated performance improvement
  let estimatedImprovement = 0;
  if (config.criticalFirst) estimatedImprovement += 25;
  if (config.lazyLoading) estimatedImprovement += 30;
  if (config.preloadStrategies.length > 0) estimatedImprovement += 15;
  if (config.compressionEnabled) estimatedImprovement += 20;

  // Estimated performance metrics after optimization
  const baseMetrics = { fcp: 2.5, lcp: 4.0, tti: 5.0 };
  const improvementFactor = estimatedImprovement / 100;

  return {
    criticalResourcesFirst: config.criticalFirst,
    lazyLoadingEnabled: config.lazyLoading,
    preloadStrategies: config.preloadStrategies,
    estimatedImprovement,
    criticalResources: {
      css: config.criticalFirst,
      fonts: config.criticalFirst,
      scripts: config.criticalFirst,
    },
    lazyLoading: {
      images: config.lazyLoading,
      iframes: config.lazyLoading,
      thirdPartyContent: config.lazyLoading,
    },
    performanceMetrics: {
      fcp: baseMetrics.fcp * (1 - improvementFactor * 0.5),
      lcp: baseMetrics.lcp * (1 - improvementFactor * 0.4),
      tti: baseMetrics.tti * (1 - improvementFactor * 0.3),
    },
  };
}

// Optimize mobile images
export function optimizeMobileImages(config: {
  devicePixelRatio: number;
  networkSpeed: 'slow' | 'fast';
  responsiveImages: boolean;
  modernFormats: boolean;
  qualityOptimization: boolean;
}): MobileImageOptimization {
  const formats = ['jpeg'];
  if (config.modernFormats) {
    formats.push('webp', 'avif');
  }

  // Adjust quality based on network speed
  let quality = 85; // Default quality
  if (config.qualityOptimization) {
    quality = config.networkSpeed === 'slow' ? 70 : 85;
  }

  // Generate responsive sizes
  const baseSizes = [320, 640, 768, 1024];
  const sizes = config.responsiveImages ? baseSizes : [640];

  // Calculate compression level
  const compressionLevel = config.networkSpeed === 'slow' ? 8 : 6; // Higher compression for slow networks

  // Generate srcset
  const srcset = sizes
    .map((size, index) => {
      const descriptor =
        config.devicePixelRatio > 1 && index === sizes.length - 1
          ? `${size * config.devicePixelRatio}w`
          : `${size}w`;
      return `image-${size}w.webp ${descriptor}`;
    })
    .join(', ');

  // Add pixel ratio descriptors
  const pixelRatioSrcset =
    config.devicePixelRatio > 1 ? srcset + ', image-1280w.webp 2x, image-1920w.webp 3x' : srcset;

  return {
    responsive: config.responsiveImages,
    formats,
    quality,
    sizes,
    compressionLevel,
    highDPI: config.devicePixelRatio > 1,
    retinaSupport: config.devicePixelRatio > 1,
    srcset: pixelRatioSrcset,
  };
}

// Create mobile performance budget
export function createMobilePerformanceBudget(config: {
  maxBundleSize: number;
  maxImageSize: number;
  maxFCP: number;
  maxLCP: number;
  maxTTI: number;
}) {
  return {
    thresholds: {
      bundleSize: config.maxBundleSize,
      imageSize: config.maxImageSize,
      fcp: config.maxFCP,
      lcp: config.maxLCP,
      tti: config.maxTTI,
    },
    mobileOptimized: true,
    networkAware: true,
    networkAdaptation: config.maxBundleSize <= 150, // Consider < 150KB as network adapted
    mobileMetrics: {
      touchResponseTime: 100, // ms
      scrollPerformance: 60, // FPS
      batteryUsage: 'low',
    },
  };
}

// Validate mobile metrics
export function validateMobileMetrics(metrics: MobileMetrics) {
  // Touch performance validation
  const touchStatus =
    metrics.touchResponseTime <= 100
      ? 'good'
      : metrics.touchResponseTime <= 150
        ? 'needs-improvement'
        : 'poor';

  // Scroll performance validation
  const scrollStatus =
    metrics.scrollPerformance >= 70
      ? 'good'
      : metrics.scrollPerformance >= 50
        ? 'needs-improvement'
        : 'poor';

  // Battery efficiency validation
  const batteryStatus =
    metrics.batteryUsage === 'low'
      ? 'good'
      : metrics.batteryUsage === 'medium'
        ? 'needs-improvement'
        : 'poor';

  // Overall performance
  const scores = { good: 100, 'needs-improvement': 70, poor: 40 };
  const overallScore = (scores[touchStatus] + scores[scrollStatus] + scores[batteryStatus]) / 3;
  const overallStatus =
    overallScore >= 90 ? 'good' : overallScore >= 70 ? 'needs-improvement' : 'poor';

  // Generate recommendations
  const recommendations: string[] = [];
  if (touchStatus !== 'good') {
    recommendations.push('Optimize touch response time');
  }
  if (scrollStatus !== 'good') {
    recommendations.push('Improve scroll performance');
  }
  if (batteryStatus !== 'good') {
    recommendations.push('Reduce battery usage');
  }
  if (metrics.networkEfficiency < 70) {
    recommendations.push('Improve network efficiency');
  }

  return {
    touchPerformance: { status: touchStatus },
    scrollPerformance: { status: scrollStatus },
    batteryEfficiency: { status: batteryStatus },
    overall: { status: overallStatus, score: overallScore },
    recommendations,
  };
}

// Create mobile viewport
export function createMobileViewport(config: {
  responsive: boolean;
  userScalable: boolean;
  initialScale: number;
  minimumScale: number;
  maximumScale: number;
}): MobileViewport {
  const parts = ['width=device-width'];

  if (config.initialScale) {
    parts.push(`initial-scale=${config.initialScale.toFixed(1)}`);
  }

  if (config.minimumScale) {
    parts.push(`minimum-scale=${config.minimumScale}`);
  }

  if (config.maximumScale) {
    parts.push(`maximum-scale=${config.maximumScale}`);
  }

  if (config.userScalable !== undefined) {
    parts.push(`user-scalable=${config.userScalable ? 'yes' : 'no'}`);
  }

  // Ensure accessibility compliance (allow zoom for accessibility even if userScalable is false)
  const accessibilityCompliant = config.maximumScale >= 2.0;

  return {
    meta: parts.join(', '),
    responsive: config.responsive,
    userScalable: config.userScalable,
    maximumScale: config.maximumScale,
    accessibilityCompliant,
  };
}

// Optimize mobile navigation
export function optimizeMobileNavigation(config: {
  hamburgerMenu: boolean;
  touchFriendly: boolean;
  thumbReachable: boolean;
  gestureNavigation: boolean;
}) {
  return {
    hamburgerMenu: config.hamburgerMenu,
    touchTargetSize: config.touchFriendly ? 44 : 32,
    thumbZone: config.thumbReachable,
    gestureSupport: config.gestureNavigation,
    bottomNavigation: config.thumbReachable, // Bottom nav for thumb reach
    oneHandedOperation: config.thumbReachable,
  };
}

// Implement offline support
export function implementOfflineSupport(config: {
  serviceWorker: boolean;
  cacheStrategy: string;
  offlinePages: string[];
  fallbackPage: string;
}): OfflineSupport {
  return {
    serviceWorkerEnabled: config.serviceWorker,
    cacheStrategy: config.cacheStrategy,
    offlineCapable: config.serviceWorker && config.offlinePages.length > 0,
    fallbackSupport: config.serviceWorker && !!config.fallbackPage,
    cachedResources: {
      css: config.serviceWorker,
      js: config.serviceWorker,
      images: config.serviceWorker,
    },
    stateManagement: {
      onlineDetection: config.serviceWorker,
      syncWhenOnline: config.serviceWorker,
      userNotification: config.serviceWorker,
    },
  };
}
