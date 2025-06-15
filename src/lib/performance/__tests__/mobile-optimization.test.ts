// TDD Red Step: Mobile optimization tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  optimizeForMobile,
  detectMobileDevice,
  optimizeTouchInteractions,
  implementProgressiveLoading,
  optimizeMobileImages,
  createMobilePerformanceBudget,
  validateMobileMetrics,
  createMobileViewport,
  optimizeMobileNavigation,
  implementOfflineSupport,
  type MobileOptimization,
  type TouchOptimization,
  type ProgressiveLoading,
  type MobileImageOptimization,
  type MobileMetrics,
  type MobileViewport,
  type OfflineSupport,
} from '../mobile-optimization';

// Mock mobile APIs
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  configurable: true,
});

Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '3g',
    downlink: 1.5,
    rtt: 300,
    saveData: false,
  },
  configurable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: query.includes('pointer: coarse'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

describe('Mobile Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Device Detection', () => {
    it('should detect mobile devices correctly', () => {
      const detection = detectMobileDevice();

      expect(detection.isMobile).toBe(true);
      expect(detection.deviceType).toBe('mobile');
      expect(detection.screenSize).toBeDefined();
      expect(detection.touchSupport).toBe(true);
    });

    it('should detect tablet devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const detection = detectMobileDevice();

      expect(detection.isMobile).toBe(true);
      expect(detection.deviceType).toBe('tablet');
    });

    it('should detect desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });

      const detection = detectMobileDevice();

      expect(detection.isMobile).toBe(false);
      expect(detection.deviceType).toBe('desktop');
      expect(detection.touchSupport).toBe(false);
    });

    it('should detect network conditions', () => {
      const detection = detectMobileDevice();

      expect(detection.connection).toBeDefined();
      expect(detection.connection.effectiveType).toBe('3g');
      expect(detection.connection.saveData).toBe(false);
    });

    it('should handle missing connection API', () => {
      Object.defineProperty(navigator, 'connection', {
        value: undefined,
        configurable: true,
      });

      const detection = detectMobileDevice();

      expect(detection.connection).toBeDefined();
      expect(detection.connection.effectiveType).toBe('unknown');
    });
  });

  describe('Mobile-First Optimization', () => {
    it('should optimize for mobile-first approach', () => {
      const config = {
        mobileFirst: true,
        touchOptimized: true,
        reducedMotion: false,
        dataOptimized: true,
        batteryOptimized: true,
      };

      const optimization = optimizeForMobile(config);

      expect(optimization.mobileFirst).toBe(true);
      expect(optimization.touchTargetSize).toBeGreaterThanOrEqual(44); // 44px minimum
      expect(optimization.performanceOptimized).toBe(true);
      expect(optimization.batteryEfficient).toBe(true);
    });

    it('should optimize for slow networks', () => {
      const config = {
        mobileFirst: true,
        touchOptimized: true,
        reducedMotion: true,
        dataOptimized: true,
        batteryOptimized: true,
      };

      const optimization = optimizeForMobile(config);

      expect(optimization.dataOptimization).toBeDefined();
      expect(optimization.dataOptimization.compressedAssets).toBe(true);
      expect(optimization.dataOptimization.minimalPayloads).toBe(true);
      expect(optimization.dataOptimization.prioritizedContent).toBe(true);
    });

    it('should implement battery-efficient features', () => {
      const config = {
        mobileFirst: true,
        touchOptimized: true,
        reducedMotion: true,
        dataOptimized: true,
        batteryOptimized: true,
      };

      const optimization = optimizeForMobile(config);

      expect(optimization.batteryOptimization).toBeDefined();
      expect(optimization.batteryOptimization.reducedAnimations).toBe(true);
      expect(optimization.batteryOptimization.efficientRendering).toBe(true);
      expect(optimization.batteryOptimization.backgroundOptimization).toBe(true);
    });
  });

  describe('Touch Interaction Optimization', () => {
    it('should optimize touch targets', () => {
      const config = {
        minTouchTargetSize: 44,
        touchFeedback: true,
        gestureSupport: true,
        scrollOptimization: true,
      };

      const optimization = optimizeTouchInteractions(config);

      expect(optimization.touchTargets.minSize).toBe(44);
      expect(optimization.touchTargets.spacing).toBeGreaterThanOrEqual(8);
      expect(optimization.hapticFeedback).toBe(true);
      expect(optimization.gestureRecognition).toBe(true);
    });

    it('should implement touch feedback', () => {
      const config = {
        minTouchTargetSize: 48,
        touchFeedback: true,
        gestureSupport: false,
        scrollOptimization: true,
      };

      const optimization = optimizeTouchInteractions(config);

      expect(optimization.visualFeedback).toBe(true);
      expect(optimization.hapticFeedback).toBe(true);
      expect(optimization.feedbackDelay).toBeLessThan(100); // < 100ms
    });

    it('should optimize scrolling performance', () => {
      const config = {
        minTouchTargetSize: 44,
        touchFeedback: false,
        gestureSupport: true,
        scrollOptimization: true,
      };

      const optimization = optimizeTouchInteractions(config);

      expect(optimization.scrollOptimization).toBeDefined();
      expect(optimization.scrollOptimization.smoothScrolling).toBe(true);
      expect(optimization.scrollOptimization.momentum).toBe(true);
      expect(optimization.scrollOptimization.overscrollBehavior).toBeDefined();
    });

    it('should implement gesture recognition', () => {
      const config = {
        minTouchTargetSize: 44,
        touchFeedback: true,
        gestureSupport: true,
        scrollOptimization: false,
      };

      const optimization = optimizeTouchInteractions(config);

      expect(optimization.gestureRecognition).toBe(true);
      expect(optimization.supportedGestures).toBeDefined();
      expect(optimization.supportedGestures).toContain('swipe');
      expect(optimization.supportedGestures).toContain('pinch');
    });
  });

  describe('Progressive Loading', () => {
    it('should implement progressive loading strategy', () => {
      const config = {
        criticalFirst: true,
        lazyLoading: true,
        preloadStrategies: ['dns-prefetch', 'preconnect'],
        compressionEnabled: true,
      };

      const loading = implementProgressiveLoading(config);

      expect(loading.criticalResourcesFirst).toBe(true);
      expect(loading.lazyLoadingEnabled).toBe(true);
      expect(loading.preloadStrategies).toContain('dns-prefetch');
      expect(loading.estimatedImprovement).toBeGreaterThan(0);
    });

    it('should prioritize critical resources', () => {
      const config = {
        criticalFirst: true,
        lazyLoading: false,
        preloadStrategies: ['preload'],
        compressionEnabled: true,
      };

      const loading = implementProgressiveLoading(config);

      expect(loading.criticalResources).toBeDefined();
      expect(loading.criticalResources.css).toBe(true);
      expect(loading.criticalResources.fonts).toBe(true);
      expect(loading.criticalResources.scripts).toBe(true);
    });

    it('should implement lazy loading for non-critical resources', () => {
      const config = {
        criticalFirst: true,
        lazyLoading: true,
        preloadStrategies: [],
        compressionEnabled: false,
      };

      const loading = implementProgressiveLoading(config);

      expect(loading.lazyLoading).toBeDefined();
      expect(loading.lazyLoading.images).toBe(true);
      expect(loading.lazyLoading.iframes).toBe(true);
      expect(loading.lazyLoading.thirdPartyContent).toBe(true);
    });

    it('should calculate loading performance improvements', () => {
      const config = {
        criticalFirst: true,
        lazyLoading: true,
        preloadStrategies: ['dns-prefetch', 'preconnect', 'preload'],
        compressionEnabled: true,
      };

      const loading = implementProgressiveLoading(config);

      expect(loading.performanceMetrics).toBeDefined();
      expect(loading.performanceMetrics.fcp).toBeDefined();
      expect(loading.performanceMetrics.lcp).toBeDefined();
      expect(loading.performanceMetrics.tti).toBeDefined();
      expect(loading.estimatedImprovement).toBeGreaterThan(20); // At least 20% improvement
    });
  });

  describe('Mobile Image Optimization', () => {
    it('should optimize images for mobile devices', () => {
      const config = {
        devicePixelRatio: 2,
        networkSpeed: 'slow',
        responsiveImages: true,
        modernFormats: true,
        qualityOptimization: true,
      };

      const optimization = optimizeMobileImages(config);

      expect(optimization.responsive).toBe(true);
      expect(optimization.formats).toContain('webp');
      expect(optimization.quality).toBeLessThan(85); // Reduced quality for mobile
      expect(optimization.sizes).toBeDefined();
    });

    it('should adapt to network conditions', () => {
      const slowConfig = {
        devicePixelRatio: 2,
        networkSpeed: 'slow',
        responsiveImages: true,
        modernFormats: true,
        qualityOptimization: true,
      };

      const fastConfig = {
        devicePixelRatio: 2,
        networkSpeed: 'fast',
        responsiveImages: true,
        modernFormats: true,
        qualityOptimization: true,
      };

      const slowOptimization = optimizeMobileImages(slowConfig);
      const fastOptimization = optimizeMobileImages(fastConfig);

      expect(slowOptimization.quality).toBeLessThan(fastOptimization.quality);
      expect(slowOptimization.compressionLevel).toBeGreaterThan(fastOptimization.compressionLevel);
    });

    it('should handle high DPI displays', () => {
      const config = {
        devicePixelRatio: 3, // High DPI
        networkSpeed: 'fast',
        responsiveImages: true,
        modernFormats: true,
        qualityOptimization: true,
      };

      const optimization = optimizeMobileImages(config);

      expect(optimization.highDPI).toBe(true);
      expect(optimization.retinaSupport).toBe(true);
      expect(optimization.srcset).toContain('2x');
      expect(optimization.srcset).toContain('3x');
    });
  });

  describe('Mobile Performance Budget', () => {
    it('should create mobile-specific performance budget', () => {
      const config = {
        maxBundleSize: 150, // KB - smaller for mobile
        maxImageSize: 300, // KB
        maxFCP: 2.0, // seconds
        maxLCP: 3.0, // seconds
        maxTTI: 4.0, // seconds
      };

      const budget = createMobilePerformanceBudget(config);

      expect(budget.thresholds.bundleSize).toBe(150);
      expect(budget.thresholds.fcp).toBe(2.0);
      expect(budget.mobileOptimized).toBe(true);
      expect(budget.networkAware).toBe(true);
    });

    it('should adapt budget based on network conditions', () => {
      const slowNetworkBudget = createMobilePerformanceBudget({
        maxBundleSize: 100,
        maxImageSize: 200,
        maxFCP: 3.0,
        maxLCP: 4.0,
        maxTTI: 5.0,
      });

      expect(slowNetworkBudget.networkAdaptation).toBe(true);
      expect(slowNetworkBudget.thresholds.bundleSize).toBeLessThanOrEqual(100);
    });

    it('should monitor mobile-specific metrics', () => {
      const budget = createMobilePerformanceBudget({
        maxBundleSize: 150,
        maxImageSize: 300,
        maxFCP: 2.0,
        maxLCP: 3.0,
        maxTTI: 4.0,
      });

      expect(budget.mobileMetrics).toBeDefined();
      expect(budget.mobileMetrics.touchResponseTime).toBeDefined();
      expect(budget.mobileMetrics.scrollPerformance).toBeDefined();
      expect(budget.mobileMetrics.batteryUsage).toBeDefined();
    });
  });

  describe('Mobile Metrics Validation', () => {
    it('should validate mobile performance metrics', () => {
      const metrics: MobileMetrics = {
        fcp: 1.8,
        lcp: 2.9,
        tti: 3.5,
        cls: 0.05,
        touchResponseTime: 50,
        scrollPerformance: 90,
        batteryUsage: 'low',
        networkEfficiency: 85,
      };

      const validation = validateMobileMetrics(metrics);

      expect(validation.overall.status).toBe('good');
      expect(validation.touchPerformance.status).toBe('good');
      expect(validation.batteryEfficiency.status).toBe('good');
    });

    it('should detect poor mobile performance', () => {
      const metrics: MobileMetrics = {
        fcp: 3.5,
        lcp: 5.2,
        tti: 7.0,
        cls: 0.3,
        touchResponseTime: 200,
        scrollPerformance: 45,
        batteryUsage: 'high',
        networkEfficiency: 30,
      };

      const validation = validateMobileMetrics(metrics);

      expect(validation.overall.status).toBe('poor');
      expect(validation.touchPerformance.status).toBe('poor');
      expect(validation.batteryEfficiency.status).toBe('poor');
      expect(validation.recommendations.length).toBeGreaterThan(0);
    });

    it('should provide mobile-specific recommendations', () => {
      const metrics: MobileMetrics = {
        fcp: 2.5,
        lcp: 4.0,
        tti: 5.0,
        cls: 0.15,
        touchResponseTime: 120,
        scrollPerformance: 60,
        batteryUsage: 'medium',
        networkEfficiency: 50,
      };

      const validation = validateMobileMetrics(metrics);

      expect(validation.recommendations).toContain('Optimize touch response time');
      expect(validation.recommendations).toContain('Improve scroll performance');
      expect(validation.recommendations).toContain('Reduce battery usage');
    });
  });

  describe('Mobile Viewport Optimization', () => {
    it('should create optimized mobile viewport', () => {
      const config = {
        responsive: true,
        userScalable: false,
        initialScale: 1.0,
        minimumScale: 1.0,
        maximumScale: 5.0,
      };

      const viewport = createMobileViewport(config);

      expect(viewport.meta).toContain('width=device-width');
      expect(viewport.meta).toContain('initial-scale=1.0');
      expect(viewport.responsive).toBe(true);
      expect(viewport.accessibilityCompliant).toBe(true);
    });

    it('should handle accessibility requirements', () => {
      const config = {
        responsive: true,
        userScalable: true, // Required for accessibility
        initialScale: 1.0,
        minimumScale: 1.0,
        maximumScale: 5.0,
      };

      const viewport = createMobileViewport(config);

      expect(viewport.userScalable).toBe(true);
      expect(viewport.maximumScale).toBeGreaterThanOrEqual(2.0); // WCAG requirement
      expect(viewport.accessibilityCompliant).toBe(true);
    });
  });

  describe('Mobile Navigation Optimization', () => {
    it('should optimize navigation for mobile', () => {
      const config = {
        hamburgerMenu: true,
        touchFriendly: true,
        thumbReachable: true,
        gestureNavigation: true,
      };

      const navigation = optimizeMobileNavigation(config);

      expect(navigation.hamburgerMenu).toBe(true);
      expect(navigation.touchTargetSize).toBeGreaterThanOrEqual(44);
      expect(navigation.thumbZone).toBe(true);
      expect(navigation.gestureSupport).toBe(true);
    });

    it('should implement thumb-reachable navigation', () => {
      const config = {
        hamburgerMenu: true,
        touchFriendly: true,
        thumbReachable: true,
        gestureNavigation: false,
      };

      const navigation = optimizeMobileNavigation(config);

      expect(navigation.thumbZone).toBe(true);
      expect(navigation.bottomNavigation).toBe(true);
      expect(navigation.oneHandedOperation).toBe(true);
    });
  });

  describe('Offline Support', () => {
    it('should implement offline functionality', () => {
      const config = {
        serviceWorker: true,
        cacheStrategy: 'stale-while-revalidate',
        offlinePages: ['/', '/about'],
        fallbackPage: '/offline',
      };

      const offline = implementOfflineSupport(config);

      expect(offline.serviceWorkerEnabled).toBe(true);
      expect(offline.cacheStrategy).toBe('stale-while-revalidate');
      expect(offline.offlineCapable).toBe(true);
      expect(offline.fallbackSupport).toBe(true);
    });

    it('should cache critical resources', () => {
      const config = {
        serviceWorker: true,
        cacheStrategy: 'cache-first',
        offlinePages: ['/'],
        fallbackPage: '/offline',
      };

      const offline = implementOfflineSupport(config);

      expect(offline.cachedResources).toBeDefined();
      expect(offline.cachedResources.css).toBe(true);
      expect(offline.cachedResources.js).toBe(true);
      expect(offline.cachedResources.images).toBe(true);
    });

    it('should handle offline/online state changes', () => {
      const config = {
        serviceWorker: true,
        cacheStrategy: 'network-first',
        offlinePages: ['/', '/about', '/contact'],
        fallbackPage: '/offline',
      };

      const offline = implementOfflineSupport(config);

      expect(offline.stateManagement).toBeDefined();
      expect(offline.stateManagement.onlineDetection).toBe(true);
      expect(offline.stateManagement.syncWhenOnline).toBe(true);
      expect(offline.stateManagement.userNotification).toBe(true);
    });
  });
});
