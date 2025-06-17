/**
 * Email Validation Module
 * 
 * Contains email configuration validation functionality
 */

import { ENV, diagnoseEnvironment } from '../env';

export interface EmailValidation {
  isValid: boolean;
  errors: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export function validateEmailConfig(): EmailValidation {
  const errors: string[] = [];

  // 環境変数診断実行
  if (ENV.ENABLE_EMAIL_DEBUG) {
    diagnoseEnvironment();
  }

  // Check if RESEND_API_KEY exists
  if (!ENV.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required');
  } else if (!ENV.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with "re_"');
  }

  // Check if site URL is configured
  if (!ENV.PUBLIC_SITE_URL) {
    errors.push('PUBLIC_SITE_URL is required');
  }

  // Check if admin email is configured
  if (!ENV.ADMIN_EMAIL) {
    errors.push('ADMIN_EMAIL is required');
  }

  // Check if from email is configured
  if (!ENV.FROM_EMAIL) {
    errors.push('FROM_EMAIL is required');
  }

  // Check if noreply email is configured
  if (!ENV.NOREPLY_EMAIL) {
    errors.push('NOREPLY_EMAIL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}