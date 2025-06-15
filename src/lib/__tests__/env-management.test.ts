// TDD Green Step: Environment variable management tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateEnvironmentVariables,
  validateRequiredEnvVars,
  getEnvironmentType,
  generateEnvTemplate,
  validateEnvFormat,
} from '../env-management';

describe('Environment Variable Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables to known state
    process.env.NODE_ENV = 'test';
    process.env.PUBLIC_SITE_URL = 'https://deephand.ai';
    process.env.RESEND_API_KEY = 're_test-key';
    process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN = 'test-analytics-token';
  });

  describe('validateEnvironmentVariables', () => {
    it('should validate all required environment variables', () => {
      const config = validateEnvironmentVariables();

      expect(config.isValid).toBe(true);
      expect(config.errors).toHaveLength(0);
      expect(config.environment).toBe('test');
    });

    it('should detect missing required variables', () => {
      delete process.env.RESEND_API_KEY;

      const config = validateEnvironmentVariables();

      expect(config.isValid).toBe(false);
      expect(config.errors).toContain('RESEND_API_KEY is required');
    });

    it('should detect invalid variable formats', () => {
      process.env.RESEND_API_KEY = 'invalid-key-format';

      const config = validateEnvironmentVariables();

      expect(config.isValid).toBe(false);
      expect(config.errors).toContain('RESEND_API_KEY must start with "re_"');
    });

    it('should provide warnings for optional missing variables', () => {
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const config = validateEnvironmentVariables();

      expect(config.isValid).toBe(true);
      expect(config.warnings).toContain(
        'PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN is optional but recommended'
      );
    });
  });

  describe('validateRequiredEnvVars', () => {
    it('should validate specific required variables', () => {
      const result = validateRequiredEnvVars(['PUBLIC_SITE_URL', 'RESEND_API_KEY']);

      expect(result.isValid).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    it('should detect missing specific variables', () => {
      const result = validateRequiredEnvVars(['NON_EXISTENT_VAR']);

      expect(result.isValid).toBe(false);
      expect(result.missing).toContain('NON_EXISTENT_VAR');
    });

    it('should provide helpful suggestions', () => {
      const result = validateRequiredEnvVars(['RESEND_API_KEY']);

      expect(result.suggestions).toContain('Get RESEND_API_KEY from https://resend.com/api-keys');
    });
  });

  describe('getEnvironmentType', () => {
    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';

      const env = getEnvironmentType();

      expect(env).toBe('development');
    });

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';

      const env = getEnvironmentType();

      expect(env).toBe('production');
    });

    it('should default to development for unknown environments', () => {
      process.env.NODE_ENV = 'staging';

      const env = getEnvironmentType();

      expect(env).toBe('development');
    });
  });

  describe('generateEnvTemplate', () => {
    it('should generate complete .env template', () => {
      const template = generateEnvTemplate();

      expect(template).toContain('RESEND_API_KEY=');
      expect(template).toContain('PUBLIC_SITE_URL=');
      expect(template).toContain('PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=');
    });

    it('should include helpful comments', () => {
      const template = generateEnvTemplate();

      expect(template).toContain('# Required for email functionality');
      expect(template).toContain('# Get from https://resend.com');
    });

    it('should include example values', () => {
      const template = generateEnvTemplate();

      expect(template).toContain('re_your_api_key_here');
      expect(template).toContain('https://your-domain.com');
    });
  });

  describe('validateEnvFormat', () => {
    it('should validate RESEND_API_KEY format', () => {
      const isValid = validateEnvFormat('RESEND_API_KEY', 're_test123');

      expect(isValid).toBe(true);
    });

    it('should reject invalid RESEND_API_KEY format', () => {
      const isValid = validateEnvFormat('RESEND_API_KEY', 'invalid-key');

      expect(isValid).toBe(false);
    });

    it('should validate URL format', () => {
      const isValid = validateEnvFormat('PUBLIC_SITE_URL', 'https://example.com');

      expect(isValid).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const isValid = validateEnvFormat('PUBLIC_SITE_URL', 'not-a-url');

      expect(isValid).toBe(false);
    });
  });

  describe('Environment-specific Configuration', () => {
    it('should have stricter validation in production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const config = validateEnvironmentVariables();

      // In production, analytics token should be required
      expect(config.isValid).toBe(false);
    });

    it('should be more lenient in development', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

      const config = validateEnvironmentVariables();

      // In development, analytics token is optional
      expect(config.isValid).toBe(true);
    });
  });

  describe('Security Validation', () => {
    it('should detect potentially insecure values', () => {
      process.env.RESEND_API_KEY = 're_test';

      const config = validateEnvironmentVariables();

      expect(config.warnings).toContain('RESEND_API_KEY appears to be a test/placeholder value');
    });

    it('should validate secure URL protocols', () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_SITE_URL = 'http://example.com';

      const config = validateEnvironmentVariables();

      expect(config.warnings).toContain('PUBLIC_SITE_URL should use HTTPS in production');
    });
  });

  describe('Configuration Completeness', () => {
    it('should report configuration completeness percentage', () => {
      const config = validateEnvironmentVariables();

      expect(config).toHaveProperty('requiredVars');
      expect(config).toHaveProperty('optionalVars');
    });

    it('should categorize variables correctly', () => {
      const config = validateEnvironmentVariables();

      expect(config.requiredVars).toHaveProperty('RESEND_API_KEY');
      expect(config.requiredVars).toHaveProperty('PUBLIC_SITE_URL');
      expect(config.optionalVars).toHaveProperty('PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN');
    });
  });
});
