// TDD Green Step: Error handling and resilience implementation

export interface ErrorContext {
  operation: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorLog {
  id: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  context: ErrorContext;
  stack?: string;
  resolved: boolean;
}

export interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  exponential: boolean;
  retryableErrors: string[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

// Global logger instance
let globalLogger: ReturnType<typeof createErrorLogger> | null = null;

// Error logger implementation
export function createErrorLogger() {
  const logs: ErrorLog[] = [];

  return {
    log: (level: 'error' | 'warn' | 'info', message: string, context: ErrorContext): ErrorLog => {
      const errorLog: ErrorLog = {
        id: generateErrorId(),
        level,
        message: sanitizeMessage(message),
        context: sanitizeContext(context),
        resolved: false,
      };

      logs.push(errorLog);

      // Only log to console in development or if explicitly enabled
      const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
      const enableLogging = typeof process !== 'undefined' && process.env.ENABLE_CONSOLE_LOGGING === 'true';

      if (isDev || enableLogging) {
        switch (level) {
          case 'error':
            console.error(`[${errorLog.id}] ${message}`, context);
            break;
          case 'warn':
            console.warn(`[${errorLog.id}] ${message}`, context);
            break;
          case 'info':
            console.info(`[${errorLog.id}] ${message}`, context);
            break;
        }
      }

      return errorLog;
    },

    error: (message: string, context: ErrorContext): ErrorLog => {
      return createErrorLogger().log('error', message, context);
    },

    warn: (message: string, context: ErrorContext): ErrorLog => {
      return createErrorLogger().log('warn', message, context);
    },

    info: (message: string, context: ErrorContext): ErrorLog => {
      return createErrorLogger().log('info', message, context);
    },

    getLogs: () => [...logs],
    clearLogs: () => logs.splice(0, logs.length),
  };
}

// Singleton logger functions for easy use throughout the app
export function logError(message: string, context: Partial<ErrorContext> = {}): ErrorLog {
  if (!globalLogger) {
    globalLogger = createErrorLogger();
  }
  
  const fullContext: ErrorContext = {
    operation: 'unknown',
    timestamp: Date.now(),
    ...context
  };
  
  return globalLogger.log('error', message, fullContext);
}

export function logWarn(message: string, context: Partial<ErrorContext> = {}): ErrorLog {
  if (!globalLogger) {
    globalLogger = createErrorLogger();
  }
  
  const fullContext: ErrorContext = {
    operation: 'unknown',
    timestamp: Date.now(),
    ...context
  };
  
  return globalLogger.log('warn', message, fullContext);
}

export function logInfo(message: string, context: Partial<ErrorContext> = {}): ErrorLog {
  if (!globalLogger) {
    globalLogger = createErrorLogger();
  }
  
  const fullContext: ErrorContext = {
    operation: 'unknown',
    timestamp: Date.now(),
    ...context
  };
  
  return globalLogger.log('info', message, fullContext);
}

// API error handling
export function handleApiError(error: unknown, context: ErrorContext): ErrorLog {
  const logger = createErrorLogger();

  let message: string;
  let level: 'error' | 'warn' | 'info';
  let stack: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;

    // Categorize error by type
    if (error.message.includes('Unauthorized') || error.message.includes('Invalid API key')) {
      level = 'error';
    } else if (error.message.includes('Invalid email') || error.message.includes('validation')) {
      level = 'warn';
    } else {
      level = 'error';
    }
  } else if (typeof error === 'string') {
    message = error;
    level = 'error';
  } else if (error && typeof error === 'object') {
    message = JSON.stringify(error);
    level = 'error';
  } else {
    message = 'Unknown error occurred';
    level = 'error';
  }

  const errorLog = logger.log(level, message, context);

  if (stack) {
    errorLog.stack = sanitizeStackTrace(stack);
  }

  return errorLog;
}

// Retry logic with backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error) || attempt === config.maxAttempts) {
        throw error;
      }

      // Calculate backoff delay
      const delay = config.exponential
        ? config.backoffMs * Math.pow(2, attempt - 1)
        : config.backoffMs;

      console.warn(
        `Operation failed (attempt ${attempt}/${config.maxAttempts}), retrying in ${delay}ms:`,
        error
      );

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Error boundary implementation
export function createErrorBoundary() {
  let state: ErrorBoundaryState = {
    hasError: false,
    retryCount: 0,
  };

  return {
    get state() {
      return { ...state };
    },

    catchError: (error: Error) => {
      state = {
        hasError: true,
        error,
        errorId: generateErrorId(),
        retryCount: state.retryCount,
      };

      console.error(`Error boundary caught error [${state.errorId}]:`, error);
    },

    retry: () => {
      if (state.retryCount < 3) {
        state = {
          hasError: false,
          error: undefined,
          errorId: undefined,
          retryCount: state.retryCount + 1,
        };
      }
    },

    reset: () => {
      state = {
        hasError: false,
        retryCount: 0,
      };
    },
  };
}

// Sensitive data sanitization
export function sanitizeErrorForLogging(error: unknown): Record<string, any> {
  let message: string;
  let sanitized: Record<string, any> = {};

  if (error instanceof Error) {
    message = error.message;
    sanitized.name = error.name;
    sanitized.stack = sanitizeStackTrace(error.stack);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = JSON.stringify(error);
    sanitized = { ...sanitized, originalType: typeof error };
  }

  // Sanitize sensitive information
  sanitized.message = sanitizeMessage(message);

  return sanitized;
}

// Error categorization
export function isRetryableError(error: unknown): boolean {
  if (!error) return false;

  const retryablePatterns = [
    'Network timeout',
    'network timeout',
    'ETIMEDOUT',
    'ECONNRESET',
    'ENOTFOUND',
    'fetch failed',
    'FetchError',
    'TimeoutError',
    'Internal server error',
    'Service unavailable',
    'Too many requests',
    'Analytics service unavailable',
  ];

  const nonRetryablePatterns = [
    'Unauthorized',
    'Invalid API key',
    'Invalid email',
    'validation',
    'Bad Request',
    'Forbidden',
  ];

  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = error.message;

    // Check error name for specific types
    if (error.name === 'FetchError' || error.name === 'TimeoutError') {
      return true;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error);
  }

  // Check non-retryable patterns first
  for (const pattern of nonRetryablePatterns) {
    if (errorMessage.includes(pattern)) {
      return false;
    }
  }

  // Check retryable patterns
  for (const pattern of retryablePatterns) {
    if (errorMessage.includes(pattern)) {
      return true;
    }
  }

  return false;
}

// Utility functions
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sanitizeMessage(message: string): string {
  let sanitized = message;

  // Redact API keys
  sanitized = sanitized.replace(/re_[a-zA-Z0-9]{10,}/g, '[REDACTED]');

  // Redact email addresses
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL_REDACTED]'
  );

  // Redact URLs with sensitive parameters
  sanitized = sanitized.replace(
    /https?:\/\/[^\s]*[?&](key|token|secret|password|auth)=[^\s&]*/g,
    '[URL_REDACTED]'
  );

  return sanitized;
}

function sanitizeContext(context: ErrorContext): ErrorContext {
  const sanitized = { ...context };

  // Remove or redact sensitive fields
  if (sanitized.userId) {
    sanitized.userId = sanitized.userId.substring(0, 8) + '***';
  }

  if (sanitized.url) {
    sanitized.url = sanitizeMessage(sanitized.url);
  }

  return sanitized;
}

function sanitizeStackTrace(stack?: string): string | undefined {
  if (!stack) return undefined;

  return sanitizeMessage(stack);
}

// Default retry configuration
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  backoffMs: 1000,
  exponential: true,
  retryableErrors: [
    'Network timeout',
    'fetch failed',
    'Internal server error',
    'Service unavailable',
  ],
};

// Email-specific retry configuration
export const EMAIL_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 2,
  backoffMs: 2000,
  exponential: false,
  retryableErrors: ['Network timeout', 'Service unavailable', 'Internal server error'],
};

// Analytics-specific retry configuration
export const ANALYTICS_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 1,
  backoffMs: 500,
  exponential: false,
  retryableErrors: ['Analytics service unavailable', 'Network timeout'],
};
