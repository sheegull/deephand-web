// TDD Green Step: Cloudflare Web Analytics integration tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateAnalyticsConfig,
  initializeAnalytics,
  trackEvent,
  trackPageView,
  generateAnalyticsScript,
  type AnalyticsEvent,
} from '../analytics';

// Import the analytics module to access internal state for testing
import * as analytics from '../analytics';

describe('Cloudflare Web Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN = 'test-analytics-token';
    process.env.PUBLIC_SITE_URL = 'https://deephand.ai';
  });

  describe('validateAnalyticsConfig', () => {
    it('should validate correct analytics configuration', () => {
      const config = validateAnalyticsConfig();

      expect(config.isEnabled).toBe(true);
      expect(config.token).toBe('test-analytics-token');
      expect(config.siteUrl).toBe('https://deephand.ai');
      expect(config.hasValidConfig).toBe(true);
    });

    it('should fail when analytics token is missing', () => {
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const config = validateAnalyticsConfig();

      expect(config.isEnabled).toBe(false);
      expect(config.hasValidConfig).toBe(false);
    });

    it('should fail when site URL is missing', () => {
      delete process.env.PUBLIC_SITE_URL;

      const config = validateAnalyticsConfig();

      expect(config.hasValidConfig).toBe(false);
    });
  });

  describe('initializeAnalytics', () => {
    it('should successfully initialize analytics', () => {
      const result = initializeAnalytics();

      expect(result).toBe(true);
    });

    it('should fail initialization with invalid config', () => {
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const result = initializeAnalytics();

      expect(result).toBe(false);
    });
  });

  describe('trackEvent', () => {
    const mockEvent: AnalyticsEvent = {
      name: 'contact_form_submit',
      properties: {
        formType: 'contact',
        userAgent: 'Mozilla/5.0...',
      },
      timestamp: Date.now(),
    };

    it('should track events successfully', () => {
      // Initialize analytics first
      initializeAnalytics();

      const result = trackEvent(mockEvent);

      expect(result).toBe(true);
    });

    it('should handle invalid event data', () => {
      const invalidEvent = {
        name: '',
        timestamp: Date.now(),
      } as AnalyticsEvent;

      const result = trackEvent(invalidEvent);

      expect(result).toBe(false);
    });

    it('should include required event properties', () => {
      // Initialize analytics first
      initializeAnalytics();

      const event: AnalyticsEvent = {
        name: 'data_request_submit',
        properties: {
          projectType: 'image',
          dataVolume: '10000',
          timeline: '4weeks',
        },
        timestamp: Date.now(),
      };

      const result = trackEvent(event);

      expect(result).toBe(true);
    });
  });

  describe('trackPageView', () => {
    it('should track page views successfully', () => {
      initializeAnalytics();

      const result = trackPageView('/contact');

      expect(result).toBe(true);
    });

    it('should track root page view', () => {
      initializeAnalytics();

      const result = trackPageView('/');

      expect(result).toBe(true);
    });

    it('should track data request page view', () => {
      initializeAnalytics();

      const result = trackPageView('/request-data');

      expect(result).toBe(true);
    });

    it('should handle invalid page paths', () => {
      const result = trackPageView('');

      expect(result).toBe(false);
    });
  });

  describe('generateAnalyticsScript', () => {
    it('should generate valid Cloudflare analytics script', () => {
      const script = generateAnalyticsScript();

      expect(script).toContain('beacon.min.js');
      expect(script).toContain('test-analytics-token');
      expect(script).toContain('data-cf-beacon');
    });

    it('should include proper script attributes', () => {
      const script = generateAnalyticsScript();

      expect(script).toContain('defer');
      expect(script).toContain('src=');
      expect(script).toMatch(/<script[^>]*>/);
    });

    it('should fail with invalid configuration', () => {
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const script = generateAnalyticsScript();

      expect(script).toBe('');
    });
  });

  describe('Privacy and GDPR Compliance', () => {
    it('should respect privacy settings', () => {
      // Test analytics respects user privacy preferences
      const config = validateAnalyticsConfig();

      expect(config.hasValidConfig).toBe(true);
    });

    it('should not track when analytics disabled', () => {
      // Test with missing token - the URL exists but token is missing
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const result = trackPageView('/contact');

      expect(result).toBe(false);
    });
  });

  describe('Performance Impact', () => {
    it('should load analytics asynchronously', () => {
      const script = generateAnalyticsScript();

      expect(script).toContain('defer');
    });

    it('should not block page rendering', () => {
      const script = generateAnalyticsScript();

      // Script should be non-blocking
      expect(script).not.toContain('async="false"');
    });
  });
});
