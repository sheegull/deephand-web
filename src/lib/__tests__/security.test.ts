// TDD Green Step: Security hardening tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateSecurityHeaders,
  generateCSRFToken,
  validateCSRFToken,
  sanitizeInput,
  validateOrigin,
  createSecurityMiddleware,
  checkRateLimiting,
} from '../security';

describe('Security Hardening', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Security Headers', () => {
    it('should validate presence of essential security headers', () => {
      const headers = {
        'Content-Security-Policy': "default-src 'self'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      };

      const result = validateSecurityHeaders(headers);

      expect(result.isSecure).toBe(true);
      expect(result.vulnerabilities).toHaveLength(0);
      expect(result.securityLevel).toBe('high');
    });

    it('should detect missing security headers', () => {
      const headers = {
        'Content-Type': 'text/html',
      };

      const result = validateSecurityHeaders(headers);

      expect(result.isSecure).toBe(false);
      expect(result.vulnerabilities).toContain('Missing Content-Security-Policy header');
      expect(result.vulnerabilities).toContain('Missing X-Frame-Options header');
      expect(result.securityLevel).toBe('low');
    });

    it('should validate Content Security Policy configuration', () => {
      const headers = {
        'Content-Security-Policy': "default-src 'unsafe-inline' 'unsafe-eval' *",
      };

      const result = validateSecurityHeaders(headers);

      expect(result.isSecure).toBe(false);
      expect(result.vulnerabilities).toContain('CSP allows unsafe-inline');
      expect(result.vulnerabilities).toContain('CSP allows unsafe-eval');
    });

    it('should provide security recommendations', () => {
      const headers = {};

      const result = validateSecurityHeaders(headers);

      expect(result.recommendations).toContain('Add Content-Security-Policy header');
      expect(result.recommendations).toContain('Add X-Frame-Options header');
      expect(result.recommendations).toContain('Enable HTTPS Strict Transport Security');
    });
  });

  describe('CSRF Protection', () => {
    it('should generate secure CSRF tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(20);
    });

    it('should validate CSRF tokens correctly', () => {
      const token = generateCSRFToken();

      expect(validateCSRFToken(token, token)).toBe(true);
      expect(validateCSRFToken(token, 'invalid-token')).toBe(false);
      expect(validateCSRFToken('', token)).toBe(false);
    });

    it('should reject empty or null CSRF tokens', () => {
      const validToken = generateCSRFToken();

      expect(validateCSRFToken('', validToken)).toBe(false);
      expect(validateCSRFToken(null as any, validToken)).toBe(false);
      expect(validateCSRFToken(undefined as any, validToken)).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML injection attempts', () => {
      const maliciousInput = '<script>alert("XSS")</script>';

      const result = sanitizeInput(maliciousInput);

      expect(result.safe).toBe(false);
      expect(result.threats).toContain('Script injection detected');
      expect(result.sanitized).not.toContain('<script>');
    });

    it('should sanitize SQL injection attempts', () => {
      const maliciousInput = "'; DROP TABLE users; --";

      const result = sanitizeInput(maliciousInput);

      expect(result.safe).toBe(false);
      expect(result.threats).toContain('SQL injection detected');
      expect(result.sanitized).not.toContain('DROP TABLE');
    });

    it('should allow safe input through unchanged', () => {
      const safeInput = 'Hello, this is a normal message.';

      const result = sanitizeInput(safeInput);

      expect(result.safe).toBe(true);
      expect(result.threats).toHaveLength(0);
      expect(result.sanitized).toBe(safeInput);
    });

    it('should handle email addresses safely', () => {
      const emailInput = 'user@example.com';

      const result = sanitizeInput(emailInput);

      expect(result.safe).toBe(true);
      expect(result.sanitized).toBe(emailInput);
    });

    it('should sanitize path traversal attempts', () => {
      const maliciousInput = '../../../etc/passwd';

      const result = sanitizeInput(maliciousInput);

      expect(result.safe).toBe(false);
      expect(result.threats).toContain('Path traversal detected');
      expect(result.sanitized).not.toContain('../');
    });
  });

  describe('Origin Validation', () => {
    it('should validate allowed origins', () => {
      const allowedOrigins = ['https://deephand.ai', 'https://www.deephand.ai'];

      expect(validateOrigin('https://deephand.ai', allowedOrigins)).toBe(true);
      expect(validateOrigin('https://www.deephand.ai', allowedOrigins)).toBe(true);
    });

    it('should reject unauthorized origins', () => {
      const allowedOrigins = ['https://deephand.ai'];

      expect(validateOrigin('https://malicious.com', allowedOrigins)).toBe(false);
      expect(validateOrigin('http://deephand.ai', allowedOrigins)).toBe(false);
      expect(validateOrigin('https://evil.deephand.ai', allowedOrigins)).toBe(false);
    });

    it('should handle localhost in development', () => {
      const allowedOrigins = ['http://localhost:4321', 'https://deephand.ai'];

      expect(validateOrigin('http://localhost:4321', allowedOrigins)).toBe(true);
      expect(validateOrigin('http://localhost:3000', allowedOrigins)).toBe(false);
    });

    it('should reject null or undefined origins', () => {
      const allowedOrigins = ['https://deephand.ai'];

      expect(validateOrigin(null as any, allowedOrigins)).toBe(false);
      expect(validateOrigin(undefined as any, allowedOrigins)).toBe(false);
      expect(validateOrigin('', allowedOrigins)).toBe(false);
    });
  });

  describe('Security Middleware', () => {
    it('should create security middleware with proper configuration', () => {
      const middleware = createSecurityMiddleware();

      expect(middleware).toBeDefined();
      expect(typeof middleware.validateRequest).toBe('function');
      expect(typeof middleware.addSecurityHeaders).toBe('function');
    });

    it('should validate requests with CSRF protection', () => {
      const middleware = createSecurityMiddleware();
      const token = generateCSRFToken();

      const request = {
        method: 'POST',
        headers: {
          'x-csrf-token': token,
          origin: 'https://deephand.ai',
        },
      };

      const result = middleware.validateRequest(request, { csrfToken: token });

      expect(result.valid).toBe(true);
    });

    it('should reject requests without proper CSRF tokens', () => {
      const middleware = createSecurityMiddleware();

      const request = {
        method: 'POST',
        headers: {
          origin: 'https://deephand.ai',
        },
      };

      const result = middleware.validateRequest(request, { csrfToken: 'valid-token' });

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('CSRF token');
    });

    it('should add security headers to responses', () => {
      const middleware = createSecurityMiddleware();
      const headers = {};

      middleware.addSecurityHeaders(headers);

      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers).toHaveProperty('X-Frame-Options');
      expect(headers).toHaveProperty('X-Content-Type-Options');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limits', () => {
      const result = checkRateLimiting('192.168.1.1');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it('should track multiple requests from same IP', () => {
      const ip = '192.168.1.2';

      const first = checkRateLimiting(ip);
      const second = checkRateLimiting(ip);

      expect(first.allowed).toBe(true);
      expect(second.allowed).toBe(true);
      expect(second.remaining).toBe(first.remaining - 1);
    });

    it('should block requests exceeding rate limits', () => {
      const ip = '192.168.1.3';

      // Simulate many requests
      for (let i = 0; i < 100; i++) {
        checkRateLimiting(ip);
      }

      const result = checkRateLimiting(ip);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset rate limits after time window', () => {
      const ip = '192.168.1.4';

      // Make many requests
      for (let i = 0; i < 50; i++) {
        checkRateLimiting(ip);
      }

      // Should have rate limit data
      const blocked = checkRateLimiting(ip);
      expect(blocked.remaining).toBeLessThan(50);
    });
  });

  describe('Environment Security', () => {
    it('should detect development environment security issues', () => {
      process.env.NODE_ENV = 'development';
      process.env.PUBLIC_SITE_URL = 'http://localhost:4321';

      const headers = {};
      const result = validateSecurityHeaders(headers);

      expect(result.recommendations).toContain('Use HTTPS in production');
    });

    it('should enforce stricter security in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_SITE_URL = 'http://deephand.ai';

      const headers = {};
      const result = validateSecurityHeaders(headers);

      expect(result.vulnerabilities).toContain('Production site not using HTTPS');
    });

    it('should validate environment variables for security', () => {
      process.env.RESEND_API_KEY = 'plaintext-key';

      const headers = {};
      const result = validateSecurityHeaders(headers);

      expect(result.vulnerabilities).toContain('API key format appears insecure');
    });
  });

  describe('Content Security Policy', () => {
    it('should generate strict CSP for production', () => {
      const csp = createSecurityMiddleware().generateCSP('production');

      expect(csp).toContain("default-src 'self'");
      expect(csp).not.toContain("'unsafe-inline'");
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it('should allow development resources in development mode', () => {
      const csp = createSecurityMiddleware().generateCSP('development');

      expect(csp).toContain('localhost');
      expect(csp).toContain('127.0.0.1');
    });

    it('should include necessary third-party domains', () => {
      const csp = createSecurityMiddleware().generateCSP('production');

      expect(csp).toContain('static.cloudflareinsights.com');
      expect(csp).toContain('api.resend.com');
    });
  });
});
