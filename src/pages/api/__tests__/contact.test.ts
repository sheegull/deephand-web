/**
 * Contact API Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../contact';

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendContactEmail: vi.fn(),
  validateEmailConfig: vi.fn(() => ({ isValid: true, errors: [] }))
}));

vi.mock('@/lib/error-handling', () => ({
  logError: vi.fn(),
  logInfo: vi.fn()
}));

describe('Contact API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid contact form submission', async () => {
    const { sendContactEmail } = await import('@/lib/email');
    (sendContactEmail as any).mockResolvedValue({ success: true, messageId: 'test-id' });

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        organization: 'Test Org',
        message: 'Test message'
      })
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    expect(sendContactEmail).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      organization: 'Test Org',
      message: 'Test message'
    });
  });

  it('should handle missing required fields', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        email: 'test@example.com',
        // Missing name and message
      })
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('validation');
  });

  it('should handle invalid email format', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message'
      })
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
  });

  it('should handle email sending failure', async () => {
    const { sendContactEmail } = await import('@/lib/email');
    (sendContactEmail as any).mockResolvedValue({ 
      success: false, 
      error: 'Email service unavailable' 
    });

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('Failed to send');
  });

  it('should handle malformed JSON request', async () => {
    const mockRequest = {
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('Invalid request format');
  });

  it('should handle email configuration errors', async () => {
    const { validateEmailConfig } = await import('@/lib/email');
    (validateEmailConfig as any).mockReturnValue({ 
      isValid: false, 
      errors: ['RESEND_API_KEY is required'] 
    });

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    };

    const mockContext = {};

    const response = await POST(mockRequest as any, mockContext as any);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('Email configuration');
  });

  it('should log successful requests', async () => {
    const { sendContactEmail } = await import('@/lib/email');
    const { logInfo } = await import('@/lib/error-handling');
    
    (sendContactEmail as any).mockResolvedValue({ success: true, messageId: 'test-id' });

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    };

    const mockContext = {};

    await POST(mockRequest as any, mockContext as any);

    expect(logInfo).toHaveBeenCalledWith(
      expect.stringContaining('Contact form submitted successfully'),
      expect.any(Object)
    );
  });

  it('should log error conditions', async () => {
    const { logError } = await import('@/lib/error-handling');

    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        // Invalid data
      })
    };

    const mockContext = {};

    await POST(mockRequest as any, mockContext as any);

    expect(logError).toHaveBeenCalled();
  });
});