import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateDeploymentConfig, checkRequiredEnvVars, validateBuildOutput } from '../deployment';

describe('Deployment Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateDeploymentConfig', () => {
    it('should validate production deployment config', () => {
      const config = {
        environment: 'production',
        siteUrl: 'https://deephand.ai',
        buildCommand: 'pnpm build',
        outputDirectory: 'dist',
        nodeVersion: '22.16.0',
      };

      const result = validateDeploymentConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid site URL', () => {
      const config = {
        environment: 'production',
        siteUrl: 'invalid-url',
        buildCommand: 'pnpm build',
        outputDirectory: 'dist',
        nodeVersion: '22.16.0',
      };

      const result = validateDeploymentConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid site URL format');
    });

    it('should fail validation for unsupported Node.js version', () => {
      const config = {
        environment: 'production',
        siteUrl: 'https://deephand.ai',
        buildCommand: 'pnpm build',
        outputDirectory: 'dist',
        nodeVersion: '18.0.0',
      };

      const result = validateDeploymentConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Node.js version must be 22.16.0 or higher');
    });
  });

  describe('checkRequiredEnvVars', () => {
    it('should validate all required environment variables for production', () => {
      const envVars = {
        NODE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://deephand.ai',
        RESEND_API_KEY: 'test-key',
        CLOUDFLARE_ANALYTICS_TOKEN: 'test-token',
      };

      const result = checkRequiredEnvVars(envVars, 'production');

      expect(result.isValid).toBe(true);
      expect(result.missingVars).toHaveLength(0);
    });

    it('should identify missing environment variables', () => {
      const envVars = {
        NODE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://deephand.ai',
        // Missing RESEND_API_KEY and CLOUDFLARE_ANALYTICS_TOKEN
      };

      const result = checkRequiredEnvVars(envVars, 'production');

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toContain('RESEND_API_KEY');
      expect(result.missingVars).toContain('CLOUDFLARE_ANALYTICS_TOKEN');
    });

    it('should allow optional variables for development', () => {
      const envVars = {
        NODE_ENV: 'development',
        PUBLIC_SITE_URL: 'http://localhost:4321',
        // RESEND_API_KEY and CLOUDFLARE_ANALYTICS_TOKEN are optional in dev
      };

      const result = checkRequiredEnvVars(envVars, 'development');

      expect(result.isValid).toBe(true);
      expect(result.missingVars).toHaveLength(0);
    });
  });

  describe('validateBuildOutput', () => {
    it('should validate successful Astro build output', () => {
      const buildOutput = {
        success: true,
        pages: ['/', '/request-data'],
        assets: ['/_astro/main.js', '/_astro/main.css'],
        buildTime: 1500,
        bundleSize: 58000, // bytes
      };

      const result = validateBuildOutput(buildOutput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required pages', () => {
      const buildOutput = {
        success: true,
        pages: ['/'], // Missing /request-data
        assets: ['/_astro/main.js', '/_astro/main.css'],
        buildTime: 1500,
        bundleSize: 58000,
      };

      const result = validateBuildOutput(buildOutput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required page: /request-data');
    });

    it('should fail validation for bundle size too large', () => {
      const buildOutput = {
        success: true,
        pages: ['/', '/request-data'],
        assets: ['/_astro/main.js', '/_astro/main.css'],
        buildTime: 1500,
        bundleSize: 500000, // 500KB - too large
      };

      const result = validateBuildOutput(buildOutput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bundle size exceeds limit (488KB > 100KB)');
    });

    it('should fail validation for build time too long', () => {
      const buildOutput = {
        success: true,
        pages: ['/', '/request-data'],
        assets: ['/_astro/main.js', '/_astro/main.css'],
        buildTime: 180000, // 3 minutes - too long
        bundleSize: 58000,
      };

      const result = validateBuildOutput(buildOutput);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Build time exceeds limit (180000ms > 60000ms)');
    });
  });
});
