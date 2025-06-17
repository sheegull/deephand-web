/**
 * Email Module Index
 * 
 * Main entry point for all email functionality
 * Exports all public interfaces and functions
 */

// Re-export all email functionality
export type { EmailResult, EmailValidation } from './validation';
export { validateEmailConfig } from './validation';
export { sendContactEmail, sendDataRequestEmail } from './sender';
export * from './templates';