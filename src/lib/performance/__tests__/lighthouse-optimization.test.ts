// TDD Red Step: Lighthouse optimization tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  optimizeImages,
  optimizeFonts,
  optimizeJavaScript,
  optimizeCSS,
  measurePerformance,
  generateLighthouseReport,
  validateCoreWebVitals,
  createPerformanceBudget,
  monitorPerformanceMetrics,
  type ImageOptimization,
  type FontOptimization,
  type JavaScriptOptimization,
  type CSSOptimization,
  type PerformanceMetrics,
  type LighthouseReport,
  type CoreWebVitals,
  type PerformanceBudget,
} from '../lighthouse-optimization';

// Mock performance APIs
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    timing: {
      navigationStart: 1000,
      loadEventEnd: 2000,
      domContentLoadedEventEnd: 1500,
    },
  },
  writable: true,
});

describe('Lighthouse Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Image Optimization', () => {
    it('should optimize images for different formats', () => {
      const imageConfig = {
        enableWebP: true,
        enableAVIF: true,
        quality: 85,
        sizes: [640, 828, 1200, 1920],
        lazyLoading: true,
      };

      const optimization = optimizeImages(imageConfig);

      expect(optimization.formats).toContain('webp');
      expect(optimization.formats).toContain('avif');
      expect(optimization.responsive).toBe(true);
      expect(optimization.lazyLoading).toBe(true);
      expect(optimization.estimatedSavings).toBeGreaterThan(0);
    });

    it('should calculate image optimization savings', () => {
      const imageConfig = {
        enableWebP: true,
        enableAVIF: false,
        quality: 75,
        sizes: [640, 1200],
        lazyLoading: true,
      };

      const optimization = optimizeImages(imageConfig);

      expect(optimization.estimatedSavings).toBeGreaterThan(0);
      expect(optimization.estimatedSavings).toBeLessThan(100); // Percentage
    });

    it('should handle responsive image generation', () => {
      const imageConfig = {
        enableWebP: true,
        enableAVIF: true,
        quality: 85,
        sizes: [320, 640, 1024, 1920],
        lazyLoading: true,
      };

      const optimization = optimizeImages(imageConfig);

      expect(optimization.responsive).toBe(true);
      expect(optimization.srcset).toBeDefined();
      expect(optimization.sizes).toBeDefined();
    });

    it('should implement lazy loading strategies', () => {
      const imageConfig = {
        enableWebP: true,
        enableAVIF: false,
        quality: 80,
        sizes: [640, 1200],
        lazyLoading: true,
      };

      const optimization = optimizeImages(imageConfig);

      expect(optimization.lazyLoading).toBe(true);
      expect(optimization.loadingStrategy).toBe('lazy');
      expect(optimization.intersectionObserver).toBe(true);
    });
  });

  describe('Font Optimization', () => {
    it('should optimize font loading strategies', () => {
      const fontConfig = {
        preload: ['Inter-Regular.woff2', 'Inter-Bold.woff2'],
        display: 'swap',
        subset: true,
        compression: 'woff2',
      };

      const optimization = optimizeFonts(fontConfig);

      expect(optimization.preload).toBe(true);
      expect(optimization.display).toBe('swap');
      expect(optimization.subset).toBe(true);
      expect(optimization.format).toBe('woff2');
      expect(optimization.estimatedSavings).toBeGreaterThan(0);
    });

    it('should implement font subsetting', () => {
      const fontConfig = {
        preload: ['font.woff2'],
        display: 'swap',
        subset: true,
        compression: 'woff2',
      };

      const optimization = optimizeFonts(fontConfig);

      expect(optimization.subset).toBe(true);
      expect(optimization.subsetCharacters).toBeDefined();
      expect(optimization.unicodeRange).toBeDefined();
    });

    it('should calculate font loading performance impact', () => {
      const fontConfig = {
        preload: ['font1.woff2', 'font2.woff2'],
        display: 'swap',
        subset: true,
        compression: 'woff2',
      };

      const optimization = optimizeFonts(fontConfig);

      expect(optimization.cls).toBeDefined(); // Cumulative Layout Shift
      expect(optimization.fcp).toBeDefined(); // First Contentful Paint
      expect(typeof optimization.cls).toBe('number');
      expect(typeof optimization.fcp).toBe('number');
    });
  });

  describe('JavaScript Optimization', () => {
    it('should implement code splitting strategies', () => {
      const jsConfig = {
        codeSplitting: true,
        treeshaking: true,
        minification: true,
        compression: 'gzip',
        moduleType: 'es6',
      };

      const optimization = optimizeJavaScript(jsConfig);

      expect(optimization.codeSplitting).toBe(true);
      expect(optimization.chunks).toBeDefined();
      expect(Array.isArray(optimization.chunks)).toBe(true);
      expect(optimization.estimatedSavings).toBeGreaterThan(0);
    });

    it('should implement tree shaking', () => {
      const jsConfig = {
        codeSplitting: false,
        treeshaking: true,
        minification: true,
        compression: 'brotli',
        moduleType: 'es6',
      };

      const optimization = optimizeJavaScript(jsConfig);

      expect(optimization.treeshaking).toBe(true);
      expect(optimization.unusedCodeRemoved).toBeGreaterThan(0);
      expect(optimization.bundleSize).toBeDefined();
    });

    it('should optimize bundle size', () => {
      const jsConfig = {
        codeSplitting: true,
        treeshaking: true,
        minification: true,
        compression: 'brotli',
        moduleType: 'es6',
      };

      const optimization = optimizeJavaScript(jsConfig);

      expect(optimization.bundleSize.original).toBeGreaterThan(optimization.bundleSize.optimized);
      expect(optimization.bundleSize.compression).toBeGreaterThan(0);
      expect(optimization.bundleSize.gzipped).toBeDefined();
    });

    it('should implement lazy loading for modules', () => {
      const jsConfig = {
        codeSplitting: true,
        treeshaking: true,
        minification: true,
        compression: 'gzip',
        moduleType: 'es6',
      };

      const optimization = optimizeJavaScript(jsConfig);

      expect(optimization.lazyModules).toBeDefined();
      expect(Array.isArray(optimization.lazyModules)).toBe(true);
      expect(optimization.dynamicImports).toBe(true);
    });
  });

  describe('CSS Optimization', () => {
    it('should implement critical CSS extraction', () => {
      const cssConfig = {
        criticalCSS: true,
        unusedCSSRemoval: true,
        minification: true,
        compression: 'gzip',
      };

      const optimization = optimizeCSS(cssConfig);

      expect(optimization.criticalCSS).toBe(true);
      expect(optimization.inlined).toBe(true);
      expect(optimization.criticalSize).toBeDefined();
      expect(optimization.criticalSize).toBeGreaterThan(0);
    });

    it('should remove unused CSS', () => {
      const cssConfig = {
        criticalCSS: false,
        unusedCSSRemoval: true,
        minification: true,
        compression: 'brotli',
      };

      const optimization = optimizeCSS(cssConfig);

      expect(optimization.unusedCSSRemoval).toBe(true);
      expect(optimization.removedSelectors).toBeGreaterThan(0);
      expect(optimization.estimatedSavings).toBeGreaterThan(0);
    });

    it('should optimize CSS delivery', () => {
      const cssConfig = {
        criticalCSS: true,
        unusedCSSRemoval: true,
        minification: true,
        compression: 'gzip',
      };

      const optimization = optimizeCSS(cssConfig);

      expect(optimization.deliveryOptimized).toBe(true);
      expect(optimization.nonCriticalDeferred).toBe(true);
      expect(optimization.mediaQueries).toBeDefined();
    });
  });

  describe('Performance Measurement', () => {
    it('should measure Core Web Vitals', () => {
      const metrics = measurePerformance();

      expect(metrics).toHaveProperty('lcp'); // Largest Contentful Paint
      expect(metrics).toHaveProperty('fid'); // First Input Delay
      expect(metrics).toHaveProperty('cls'); // Cumulative Layout Shift
      expect(metrics).toHaveProperty('fcp'); // First Contentful Paint
      expect(metrics).toHaveProperty('tti'); // Time to Interactive
      expect(metrics).toHaveProperty('tbt'); // Total Blocking Time
    });

    it('should calculate performance scores', () => {
      const metrics = measurePerformance();

      expect(metrics.performanceScore).toBeDefined();
      expect(metrics.performanceScore).toBeGreaterThanOrEqual(0);
      expect(metrics.performanceScore).toBeLessThanOrEqual(100);
    });

    it('should track navigation timing', () => {
      const metrics = measurePerformance();

      expect(metrics.navigationTiming).toBeDefined();
      expect(metrics.navigationTiming.domContentLoaded).toBeDefined();
      expect(metrics.navigationTiming.loadComplete).toBeDefined();
      expect(typeof metrics.navigationTiming.domContentLoaded).toBe('number');
    });

    it('should measure resource loading performance', () => {
      const metrics = measurePerformance();

      expect(metrics.resourceTiming).toBeDefined();
      expect(Array.isArray(metrics.resourceTiming)).toBe(true);
    });
  });

  describe('Lighthouse Report Generation', () => {
    it('should generate comprehensive Lighthouse report', async () => {
      const url = 'https://deephand.ai';
      const config = {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile' as const,
        throttling: 'simulated3G' as const,
      };

      const report = await generateLighthouseReport(url, config);

      expect(report).toHaveProperty('performance');
      expect(report).toHaveProperty('accessibility');
      expect(report).toHaveProperty('bestPractices');
      expect(report).toHaveProperty('seo');
      expect(report.performance.score).toBeDefined();
      expect(report.performance.score).toBeGreaterThanOrEqual(0);
      expect(report.performance.score).toBeLessThanOrEqual(100);
    });

    it('should provide detailed performance metrics', async () => {
      const url = 'https://deephand.ai/about';
      const config = {
        onlyCategories: ['performance'],
        formFactor: 'desktop' as const,
        throttling: 'none' as const,
      };

      const report = await generateLighthouseReport(url, config);

      expect(report.performance.metrics).toBeDefined();
      expect(report.performance.metrics.lcp).toBeDefined();
      expect(report.performance.metrics.fcp).toBeDefined();
      expect(report.performance.metrics.tti).toBeDefined();
    });

    it('should include optimization opportunities', async () => {
      const url = 'https://deephand.ai';
      const config = {
        onlyCategories: ['performance'],
        formFactor: 'mobile' as const,
        throttling: 'simulated3G' as const,
      };

      const report = await generateLighthouseReport(url, config);

      expect(report.performance.opportunities).toBeDefined();
      expect(Array.isArray(report.performance.opportunities)).toBe(true);
      expect(report.performance.diagnostics).toBeDefined();
    });
  });

  describe('Core Web Vitals Validation', () => {
    it('should validate LCP threshold', () => {
      const vitals: CoreWebVitals = {
        lcp: 2.3, // Good: < 2.5s
        fid: 80, // Good: < 100ms
        cls: 0.08, // Good: < 0.1
        fcp: 1.2,
        tti: 3.1,
        tbt: 150,
      };

      const validation = validateCoreWebVitals(vitals);

      expect(validation.lcp.status).toBe('good');
      expect(validation.lcp.threshold).toBe(2.5);
      expect(validation.overall.score).toBeGreaterThan(0);
    });

    it('should validate FID threshold', () => {
      const vitals: CoreWebVitals = {
        lcp: 3.0, // Needs improvement: 2.5-4.0s
        fid: 120, // Needs improvement: 100-300ms
        cls: 0.15, // Poor: > 0.25
        fcp: 1.8,
        tti: 4.2,
        tbt: 400,
      };

      const validation = validateCoreWebVitals(vitals);

      expect(validation.fid.status).toBe('needs-improvement');
      expect(validation.cls.status).toBe('needs-improvement');
      expect(validation.overall.status).toBe('needs-improvement');
    });

    it('should provide improvement recommendations', () => {
      const vitals: CoreWebVitals = {
        lcp: 4.5, // Poor: > 4.0s
        fid: 350, // Poor: > 300ms
        cls: 0.3, // Poor: > 0.25
        fcp: 2.8,
        tti: 6.0,
        tbt: 800,
      };

      const validation = validateCoreWebVitals(vitals);

      expect(validation.recommendations).toBeDefined();
      expect(Array.isArray(validation.recommendations)).toBe(true);
      expect(validation.recommendations.length).toBeGreaterThan(0);
      expect(validation.overall.status).toBe('poor');
    });
  });

  describe('Performance Budget', () => {
    it('should create performance budget with thresholds', () => {
      const config = {
        lcp: 2.5,
        fid: 100,
        cls: 0.1,
        bundleSize: 200, // KB
        imageSize: 500, // KB
        requestCount: 50,
      };

      const budget = createPerformanceBudget(config);

      expect(budget.thresholds).toEqual(config);
      expect(budget.monitoring).toBe(true);
      expect(budget.alerts).toBeDefined();
    });

    it('should validate budget compliance', () => {
      const budget = createPerformanceBudget({
        lcp: 2.5,
        fid: 100,
        cls: 0.1,
        bundleSize: 200,
        imageSize: 500,
        requestCount: 50,
      });

      const currentMetrics = {
        lcp: 3.0,
        fid: 80,
        cls: 0.08,
        bundleSize: 180,
        imageSize: 600, // Over budget
        requestCount: 45,
      };

      const compliance = budget.validateCompliance(currentMetrics);

      expect(compliance.passing).toBe(false);
      expect(compliance.violations).toContain('imageSize');
      expect(compliance.violations).toContain('lcp');
    });

    it('should track budget over time', () => {
      const budget = createPerformanceBudget({
        lcp: 2.5,
        fid: 100,
        cls: 0.1,
        bundleSize: 200,
        imageSize: 500,
        requestCount: 50,
      });

      const history = budget.getHistory();

      expect(Array.isArray(history)).toBe(true);
      expect(budget.addMeasurement).toBeDefined();
      expect(typeof budget.addMeasurement).toBe('function');
    });
  });

  describe('Performance Monitoring', () => {
    it('should monitor performance metrics continuously', () => {
      const monitoring = monitorPerformanceMetrics();

      expect(monitoring.isActive).toBe(true);
      expect(monitoring.interval).toBeDefined();
      expect(typeof monitoring.start).toBe('function');
      expect(typeof monitoring.stop).toBe('function');
    });

    it('should collect real user metrics (RUM)', () => {
      const monitoring = monitorPerformanceMetrics();

      expect(monitoring.rum).toBeDefined();
      expect(monitoring.rum.enabled).toBe(true);
      expect(monitoring.rum.sampleRate).toBeDefined();
    });

    it('should trigger alerts on threshold violations', () => {
      const monitoring = monitorPerformanceMetrics();
      const alertCallback = vi.fn();

      monitoring.onAlert(alertCallback);

      // Simulate threshold violation
      monitoring.checkThresholds({
        lcp: 5.0, // Above threshold
        fid: 400, // Above threshold
        cls: 0.3, // Above threshold
      });

      expect(alertCallback).toHaveBeenCalled();
    });
  });
});
