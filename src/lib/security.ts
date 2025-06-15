// TDD Green Step: Security hardening implementation

import crypto from 'crypto';

export interface SecurityConfig {
  isSecure: boolean;
  vulnerabilities: string[];
  recommendations: string[];
  securityLevel: 'low' | 'medium' | 'high';
}

export interface CSRFProtection {
  enabled: boolean;
  token: string;
  origin: string;
}

export interface InputSanitization {
  sanitized: string;
  threats: string[];
  safe: boolean;
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers validation
export function validateSecurityHeaders(headers: Record<string, string>): SecurityConfig {
  const vulnerabilities: string[] = [];
  const recommendations: string[] = [];

  // Check for essential security headers
  if (!headers['Content-Security-Policy']) {
    vulnerabilities.push('Missing Content-Security-Policy header');
    recommendations.push('Add Content-Security-Policy header');
  } else {
    // Validate CSP content
    const csp = headers['Content-Security-Policy'];
    if (csp.includes("'unsafe-inline'")) {
      vulnerabilities.push('CSP allows unsafe-inline');
    }
    if (csp.includes("'unsafe-eval'")) {
      vulnerabilities.push('CSP allows unsafe-eval');
    }
  }

  if (!headers['X-Frame-Options']) {
    vulnerabilities.push('Missing X-Frame-Options header');
    recommendations.push('Add X-Frame-Options header');
  }

  if (!headers['X-Content-Type-Options']) {
    vulnerabilities.push('Missing X-Content-Type-Options header');
    recommendations.push('Add X-Content-Type-Options header');
  }

  if (!headers['Referrer-Policy']) {
    vulnerabilities.push('Missing Referrer-Policy header');
    recommendations.push('Add Referrer-Policy header');
  }

  if (!headers['Permissions-Policy']) {
    vulnerabilities.push('Missing Permissions-Policy header');
    recommendations.push('Add Permissions-Policy header');
  }

  if (!headers['Strict-Transport-Security']) {
    recommendations.push('Enable HTTPS Strict Transport Security');
  }

  // Environment-specific checks
  const nodeEnv = process.env.NODE_ENV;
  const siteUrl = process.env.PUBLIC_SITE_URL;

  if (nodeEnv === 'production' && siteUrl?.startsWith('http://')) {
    vulnerabilities.push('Production site not using HTTPS');
  }

  if (nodeEnv === 'development' && siteUrl?.startsWith('http://')) {
    recommendations.push('Use HTTPS in production');
  }

  // Check API key security
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && !apiKey.startsWith('re_')) {
    vulnerabilities.push('API key format appears insecure');
  }

  // Determine security level
  let securityLevel: 'low' | 'medium' | 'high';
  if (vulnerabilities.length === 0) {
    securityLevel = 'high';
  } else if (vulnerabilities.length <= 2) {
    securityLevel = 'medium';
  } else {
    securityLevel = 'low';
  }

  return {
    isSecure: vulnerabilities.length === 0,
    vulnerabilities,
    recommendations,
    securityLevel,
  };
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expectedToken, 'hex'));
  } catch {
    return false;
  }
}

// Input sanitization
export function sanitizeInput(input: string): InputSanitization {
  if (!input || typeof input !== 'string') {
    return {
      sanitized: '',
      threats: ['Invalid input type'],
      safe: false,
    };
  }

  const threats: string[] = [];
  let sanitized = input;

  // Check for XSS attempts
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]*on\w+[^>]*>/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      threats.push('Script injection detected');
      sanitized = sanitized.replace(pattern, '');
      break;
    }
  }

  // Check for SQL injection attempts
  const sqlPatterns = [
    /('|;|--|(\s(OR|AND)\s))/gi,
    /(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER)\s+(TABLE|DATABASE)/gi,
    /UNION\s+SELECT/gi,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      threats.push('SQL injection detected');
      sanitized = sanitized.replace(pattern, '[SQL_FILTERED]');
    }
  }

  // Check for path traversal attempts
  const pathTraversalPatterns = [/\.\.\//g, /\.\.\\/g, /%2e%2e%2f/gi, /%2e%2e\\/gi];

  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(input)) {
      threats.push('Path traversal detected');
      sanitized = sanitized.replace(pattern, '');
      break;
    }
  }

  // Additional HTML entity encoding for safety
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return {
    sanitized,
    threats,
    safe: threats.length === 0,
  };
}

// Origin validation
export function validateOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (!origin || typeof origin !== 'string') {
    return false;
  }

  return allowedOrigins.includes(origin);
}

// Rate limiting
export function checkRateLimiting(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // 100 requests per window

  const key = ip;
  const record = rateLimitStore.get(key);

  if (!record || record.resetTime <= now) {
    // New window or expired window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Security middleware
export function createSecurityMiddleware() {
  return {
    validateRequest: (request: any, context: { csrfToken?: string } = {}) => {
      const method = request.method?.toUpperCase();
      const headers = request.headers || {};

      // CSRF validation for state-changing operations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const token = headers['x-csrf-token'];
        const expectedToken = context.csrfToken;

        if (!validateCSRFToken(token, expectedToken)) {
          return {
            valid: false,
            reason: 'Invalid or missing CSRF token',
          };
        }
      }

      return { valid: true };
    },

    addSecurityHeaders: (headers: Record<string, string>) => {
      const environment = process.env.NODE_ENV || 'development';

      // Content Security Policy
      headers['Content-Security-Policy'] = createSecurityMiddleware().generateCSP(environment);

      // Frame protection
      headers['X-Frame-Options'] = 'DENY';

      // Content type protection
      headers['X-Content-Type-Options'] = 'nosniff';

      // Referrer policy
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';

      // Permissions policy
      headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()';

      // HTTPS Strict Transport Security (only for HTTPS)
      if (process.env.PUBLIC_SITE_URL?.startsWith('https://')) {
        headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
      }
    },

    generateCSP: (environment: string) => {
      const baseCSP = "default-src 'self'";
      const scriptSrc =
        environment === 'development'
          ? "script-src 'self' 'unsafe-inline' localhost:* 127.0.0.1:* static.cloudflareinsights.com"
          : "script-src 'self' static.cloudflareinsights.com";

      const styleSrc =
        environment === 'development' ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'";
      const connectSrc =
        environment === 'development'
          ? "connect-src 'self' localhost:* 127.0.0.1:* api.resend.com"
          : "connect-src 'self' api.resend.com";

      const imgSrc = "img-src 'self' data: https:";
      const fontSrc = "font-src 'self' data:";

      return [baseCSP, scriptSrc, styleSrc, connectSrc, imgSrc, fontSrc].join('; ');
    },
  };
}

// Security configuration for different environments
export function getSecurityConfig(environment: string = 'development') {
  const isDevelopment = environment === 'development';
  const isProduction = environment === 'production';

  return {
    csrf: {
      enabled: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
    },

    rateLimit: {
      windowMs: isDevelopment ? 60000 : 900000, // 1 min dev, 15 min prod
      maxRequests: isDevelopment ? 1000 : 100,
      skipSuccessfulRequests: isDevelopment,
    },

    cors: {
      origin: isDevelopment
        ? ['http://localhost:4321', 'http://127.0.0.1:4321']
        : ['https://deephand.ai', 'https://www.deephand.ai'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    },

    headers: {
      hsts: isProduction,
      contentTypeOptions: true,
      frameOptions: 'DENY',
      xssProtection: true,
    },
  };
}

// Utility function to validate request security
export function validateRequestSecurity(request: any): {
  valid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const headers = request.headers || {};
  const method = request.method?.toUpperCase();
  const origin = headers.origin;

  // Check origin for cross-origin requests
  if (origin && !validateOrigin(origin, getSecurityConfig().cors.origin)) {
    issues.push('Unauthorized origin');
  }

  // Check for required headers in POST requests
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    if (!headers['content-type']) {
      issues.push('Missing Content-Type header');
    }
  }

  // Rate limiting check (simplified)
  const ip = request.ip || 'unknown';
  const rateLimitResult = checkRateLimiting(ip);
  if (!rateLimitResult.allowed) {
    issues.push('Rate limit exceeded');
  }

  if (issues.length === 0 && rateLimitResult.remaining < 10) {
    recommendations.push('Consider implementing user authentication to increase rate limits');
  }

  return {
    valid: issues.length === 0,
    issues,
    recommendations,
  };
}
