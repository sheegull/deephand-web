// TDD Red Step: Motion configuration tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMotionConfig,
  detectReducedMotion,
  getDeviceCapabilities,
  optimizeForPerformance,
  type MotionConfig,
  type DeviceCapabilities,
} from '../motion-config';

describe('Motion Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Reduced Motion Detection', () => {
    it('should detect reduced motion preference', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      const reducedMotion = detectReducedMotion();

      expect(reducedMotion).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should default to false when reduced motion not detected', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      const reducedMotion = detectReducedMotion();

      expect(reducedMotion).toBe(false);
    });

    it('should handle missing matchMedia gracefully', () => {
      // @ts-ignore - Testing legacy browser
      window.matchMedia = undefined;

      const reducedMotion = detectReducedMotion();

      expect(reducedMotion).toBe(false);
    });
  });

  describe('Device Capabilities Detection', () => {
    it('should detect mobile device capabilities', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const capabilities = getDeviceCapabilities();

      expect(capabilities.isMobile).toBe(true);
      expect(capabilities.supportsAdvancedAnimations).toBe(false);
      expect(capabilities.particleCount).toBeLessThan(200);
    });

    it('should detect desktop capabilities', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });

      const capabilities = getDeviceCapabilities();

      expect(capabilities.isMobile).toBe(false);
      expect(capabilities.supportsAdvancedAnimations).toBe(true);
      expect(capabilities.particleCount).toBeGreaterThan(100);
    });

    it('should detect low-power mode', () => {
      // Mock battery API
      Object.defineProperty(navigator, 'getBattery', {
        value: () =>
          Promise.resolve({
            charging: false,
            level: 0.2, // Low battery
            chargingTime: Infinity,
            dischargingTime: 3600,
          }),
        configurable: true,
      });

      return getDeviceCapabilities().then(capabilities => {
        expect(capabilities.lowPowerMode).toBe(true);
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should create optimized config for mobile', () => {
      const mobileCapabilities: DeviceCapabilities = {
        isMobile: true,
        supportsAdvancedAnimations: false,
        particleCount: 50,
        lowPowerMode: true,
        preferredFrameRate: 30,
      };

      const config = optimizeForPerformance(mobileCapabilities);

      expect(config.enableComplexAnimations).toBe(false);
      expect(config.particleCount).toBe(50);
      expect(config.animationDuration).toBeLessThan(0.5);
      expect(config.targetFPS).toBe(30);
    });

    it('should create high-performance config for desktop', () => {
      const desktopCapabilities: DeviceCapabilities = {
        isMobile: false,
        supportsAdvancedAnimations: true,
        particleCount: 200,
        lowPowerMode: false,
        preferredFrameRate: 60,
      };

      const config = optimizeForPerformance(desktopCapabilities);

      expect(config.enableComplexAnimations).toBe(true);
      expect(config.particleCount).toBe(200);
      expect(config.animationDuration).toBeGreaterThan(0.5);
      expect(config.targetFPS).toBe(60);
    });

    it('should fallback to simple animations on reduced motion', () => {
      const capabilities: DeviceCapabilities = {
        isMobile: false,
        supportsAdvancedAnimations: true,
        particleCount: 200,
        lowPowerMode: false,
        preferredFrameRate: 60,
      };

      const config = optimizeForPerformance(capabilities, true);

      expect(config.enableComplexAnimations).toBe(false);
      expect(config.respectReducedMotion).toBe(true);
      expect(config.fallbackMode).toBe('simple');
    });
  });

  describe('Motion Config Creation', () => {
    it('should create complete motion configuration', () => {
      const config = createMotionConfig();

      expect(config).toHaveProperty('enableComplexAnimations');
      expect(config).toHaveProperty('particleCount');
      expect(config).toHaveProperty('animationDuration');
      expect(config).toHaveProperty('targetFPS');
      expect(config).toHaveProperty('respectReducedMotion');
      expect(config).toHaveProperty('fallbackMode');
      expect(config).toHaveProperty('performanceBudget');
    });

    it('should respect reduced motion in configuration', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      const config = createMotionConfig();

      expect(config.respectReducedMotion).toBe(true);
      expect(config.enableComplexAnimations).toBe(false);
    });

    it('should configure performance budget', () => {
      const config = createMotionConfig();

      expect(config.performanceBudget).toHaveProperty('targetFrameTime');
      expect(config.performanceBudget).toHaveProperty('maxMemoryUsage');
      expect(config.performanceBudget).toHaveProperty('fallbackThreshold');
      expect(config.performanceBudget.targetFrameTime).toBeLessThanOrEqual(16.67); // 60fps
    });

    it('should provide device-specific optimizations', () => {
      const config = createMotionConfig();

      if (config.deviceCapabilities.isMobile) {
        expect(config.particleCount).toBeLessThan(100);
        expect(config.animationDuration).toBeLessThan(0.5);
      } else {
        expect(config.particleCount).toBeGreaterThan(100);
        expect(config.animationDuration).toBeGreaterThan(0.3);
      }
    });
  });

  describe('Performance Monitoring', () => {
    it('should monitor frame rate performance', () => {
      const config = createMotionConfig();

      expect(config.performanceMonitoring).toHaveProperty('enabled');
      expect(config.performanceMonitoring).toHaveProperty('sampleInterval');
      expect(config.performanceMonitoring).toHaveProperty('alertThreshold');
    });

    it('should trigger fallback on poor performance', () => {
      const config = createMotionConfig();
      const poorPerformanceData = {
        averageFPS: 20,
        frameDrops: 50,
        memoryUsage: 100000000, // 100MB
      };

      const shouldFallback = config.shouldTriggerFallback?.(poorPerformanceData);

      expect(shouldFallback).toBe(true);
    });
  });
});
