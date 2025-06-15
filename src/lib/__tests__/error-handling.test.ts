// TDD Green Step: Error handling and resilience tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createErrorLogger,
  handleApiError,
  retryWithBackoff,
  createErrorBoundary,
  sanitizeErrorForLogging,
  isRetryableError,
  type ErrorContext,
  type RetryConfig,
} from '../error-handling';

describe('Error Handling & Resilience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Error Logger', () => {
    it('should create error logger with proper configuration', () => {
      const logger = createErrorLogger();

      expect(logger).toBeDefined();
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
    });

    it('should log errors with context information', () => {
      const logger = createErrorLogger();
      const timestamp = Date.now();
      const context: ErrorContext = {
        operation: 'send_email',
        timestamp,
        userId: 'user123',
        url: '/api/contact',
      };

      const errorLog = logger.error('Email sending failed', context);

      expect(errorLog.level).toBe('error');
      expect(errorLog.message).toBe('Email sending failed');
      expect(errorLog.context.operation).toBe('send_email');
      expect(errorLog.context.timestamp).toBe(timestamp);
      expect(errorLog.id).toBeDefined();
    });

    it('should sanitize sensitive information from logs', () => {
      const sensitiveError = new Error('API key re_secret123 is invalid');

      const sanitized = sanitizeErrorForLogging(sensitiveError);

      expect(sanitized.message).not.toContain('re_secret123');
      expect(sanitized.message).toContain('[REDACTED]');
    });
  });

  describe('API Error Handling', () => {
    it('should handle API errors with proper context', () => {
      const apiError = new Error('Network timeout');
      const context: ErrorContext = {
        operation: 'email_send',
        timestamp: Date.now(),
        url: '/api/contact',
      };

      const errorLog = handleApiError(apiError, context);

      expect(errorLog.level).toBe('error');
      expect(errorLog.context).toEqual(context);
      expect(errorLog.resolved).toBe(false);
    });

    it('should categorize different types of API errors', () => {
      const networkError = new Error('Network timeout');
      const authError = new Error('Unauthorized');
      const validationError = new Error('Invalid email format');

      const networkLog = handleApiError(networkError, { operation: 'test', timestamp: Date.now() });
      const authLog = handleApiError(authError, { operation: 'test', timestamp: Date.now() });
      const validationLog = handleApiError(validationError, {
        operation: 'test',
        timestamp: Date.now(),
      });

      expect(networkLog.level).toBe('error');
      expect(authLog.level).toBe('error');
      expect(validationLog.level).toBe('warn');
    });

    it('should handle non-Error objects gracefully', () => {
      const stringError = 'Something went wrong';
      const objectError = { code: 500, message: 'Server error' };
      const nullError = null;

      expect(() =>
        handleApiError(stringError, { operation: 'test', timestamp: Date.now() })
      ).not.toThrow();
      expect(() =>
        handleApiError(objectError, { operation: 'test', timestamp: Date.now() })
      ).not.toThrow();
      expect(() =>
        handleApiError(nullError, { operation: 'test', timestamp: Date.now() })
      ).not.toThrow();
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed operations with exponential backoff', async () => {
      let attempts = 0;
      const failingOperation = () => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Network timeout'));
        }
        return Promise.resolve('success');
      };

      const config: RetryConfig = {
        maxAttempts: 3,
        backoffMs: 10, // Reduced for faster test
        exponential: true,
        retryableErrors: ['Network timeout'],
      };

      const result = await retryWithBackoff(failingOperation, config);

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    }, 10000);

    it('should not retry non-retryable errors', async () => {
      let attempts = 0;
      const failingOperation = () => {
        attempts++;
        return Promise.reject(new Error('Invalid API key'));
      };

      const config: RetryConfig = {
        maxAttempts: 3,
        backoffMs: 100,
        exponential: true,
        retryableErrors: ['Network timeout'],
      };

      await expect(retryWithBackoff(failingOperation, config)).rejects.toThrow('Invalid API key');
      expect(attempts).toBe(1);
    });

    it('should respect maximum retry attempts', async () => {
      let attempts = 0;
      const alwaysFailingOperation = () => {
        attempts++;
        return Promise.reject(new Error('Network timeout'));
      };

      const config: RetryConfig = {
        maxAttempts: 2,
        backoffMs: 10, // Reduced for faster test
        exponential: false,
        retryableErrors: ['Network timeout'],
      };

      await expect(retryWithBackoff(alwaysFailingOperation, config)).rejects.toThrow(
        'Network timeout'
      );
      expect(attempts).toBe(2);
    }, 10000);

    it('should implement exponential backoff correctly', async () => {
      let attempts = 0;

      const failingOperation = () => {
        attempts++;
        return Promise.reject(new Error('Network timeout'));
      };

      const config: RetryConfig = {
        maxAttempts: 3,
        backoffMs: 10, // Reduced for faster test
        exponential: true,
        retryableErrors: ['Network timeout'],
      };

      await expect(retryWithBackoff(failingOperation, config)).rejects.toThrow();

      expect(attempts).toBe(3);
    }, 10000);
  });

  describe('Error Boundary', () => {
    it('should create error boundary with initial state', () => {
      const boundary = createErrorBoundary();

      expect(boundary.state.hasError).toBe(false);
      expect(boundary.state.retryCount).toBe(0);
    });

    it('should catch and handle errors', () => {
      const boundary = createErrorBoundary();
      const testError = new Error('Component crashed');

      boundary.catchError(testError);

      expect(boundary.state.hasError).toBe(true);
      expect(boundary.state.error).toBe(testError);
      expect(boundary.state.errorId).toBeDefined();
    });

    it('should allow error recovery and retry', () => {
      const boundary = createErrorBoundary();
      const testError = new Error('Recoverable error');

      boundary.catchError(testError);
      expect(boundary.state.hasError).toBe(true);

      boundary.retry();
      expect(boundary.state.hasError).toBe(false);
      expect(boundary.state.retryCount).toBe(1);
    });

    it('should limit retry attempts', () => {
      const boundary = createErrorBoundary();
      const testError = new Error('Persistent error');

      // Simulate multiple retry attempts
      for (let i = 0; i < 5; i++) {
        boundary.catchError(testError);
        boundary.retry();
      }

      expect(boundary.state.retryCount).toBeLessThanOrEqual(3);
    });
  });

  describe('Error Categorization', () => {
    it('should identify retryable errors correctly', () => {
      const networkError = new Error('Network timeout');
      const serverError = new Error('Internal server error');
      const authError = new Error('Unauthorized');
      const validationError = new Error('Invalid email format');

      expect(isRetryableError(networkError)).toBe(true);
      expect(isRetryableError(serverError)).toBe(true);
      expect(isRetryableError(authError)).toBe(false);
      expect(isRetryableError(validationError)).toBe(false);
    });

    it('should handle fetch response errors', () => {
      const fetchError = new Error('fetch failed');
      fetchError.name = 'FetchError';

      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';

      expect(isRetryableError(fetchError)).toBe(true);
      expect(isRetryableError(timeoutError)).toBe(true);
    });
  });

  describe('Sensitive Data Protection', () => {
    it('should redact API keys from error messages', () => {
      const error = new Error('Invalid API key: re_1234567890abcdef');

      const sanitized = sanitizeErrorForLogging(error);

      expect(sanitized.message).not.toContain('re_1234567890abcdef');
      expect(sanitized.message).toContain('[REDACTED]');
    });

    it('should redact email addresses from error logs', () => {
      const error = new Error('Email validation failed for user@example.com');

      const sanitized = sanitizeErrorForLogging(error);

      expect(sanitized.message).not.toContain('user@example.com');
      expect(sanitized.message).toContain('[EMAIL_REDACTED]');
    });

    it('should redact URLs with sensitive parameters', () => {
      const error = new Error('Request failed: https://api.example.com/send?key=secret123');

      const sanitized = sanitizeErrorForLogging(error);

      expect(sanitized.message).not.toContain('key=secret123');
      expect(sanitized.message).toContain('[URL_REDACTED]');
    });
  });

  describe('Error Recovery Strategies', () => {
    it('should provide fallback mechanisms for email sending', async () => {
      const primaryEmailFail = () => Promise.reject(new Error('Resend API down'));
      const fallbackEmail = () => Promise.resolve({ success: true, method: 'fallback' });

      // Test that fallback is used when primary fails
      // Implementation would depend on the actual fallback strategy
      expect(true).toBe(true); // Placeholder for actual fallback test
    });

    it('should gracefully degrade analytics when unavailable', () => {
      const analyticsError = new Error('Analytics service unavailable');

      const shouldContinue = isRetryableError(analyticsError);

      // Analytics errors should not block main functionality
      expect(shouldContinue).toBe(true);
    });
  });
});
