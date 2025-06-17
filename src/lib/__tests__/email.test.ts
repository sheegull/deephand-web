import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendContactEmail, sendDataRequestEmail, validateEmailConfig } from '../email';
import type { ContactFormData, CurrentDataRequestFormData } from '../validationSchemas';

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.RESEND_API_KEY = 're_test-key';
    process.env.PUBLIC_SITE_URL = 'https://deephand.ai';
  });

  describe('validateEmailConfig', () => {
    it('should validate correct email configuration', () => {
      const result = validateEmailConfig();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when RESEND_API_KEY is missing', () => {
      delete process.env.RESEND_API_KEY;

      const result = validateEmailConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('RESEND_API_KEY is required');
    });

    it('should fail when RESEND_API_KEY format is invalid', () => {
      process.env.RESEND_API_KEY = 'invalid-key';

      const result = validateEmailConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('RESEND_API_KEY must start with "re_"');
    });
  });

  describe('sendContactEmail', () => {
    const mockContactData: ContactFormData = {
      name: '山田太郎',
      email: 'yamada@example.com',
      organization: '株式会社サンプル',
      company: '株式会社サンプル',
      subject: 'お問い合わせ',
      message: 'データアノテーションサービスについて詳しく知りたいです。',
      privacyConsent: true,
    };

    it('should send contact email successfully', async () => {
      const mockSend = vi.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null,
      });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(true);
      expect(result.emailId).toBe('email-123');
      expect(result.error).toBeUndefined();

      // Verify email was sent with correct parameters
      expect(mockSend).toHaveBeenCalledWith({
        from: 'contact@deephand.ai',
        to: ['info@deephand.ai'],
        replyTo: 'yamada@example.com',
        subject: 'お問い合わせ: お問い合わせ',
        html: expect.stringContaining('山田太郎'),
        text: expect.stringContaining('山田太郎'),
      });
    });

    it('should send confirmation email to user', async () => {
      const mockSend = vi
        .fn()
        .mockResolvedValueOnce({ data: { id: 'admin-email-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'user-email-123' }, error: null });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(2);

      // Check confirmation email to user
      expect(mockSend).toHaveBeenNthCalledWith(2, {
        from: 'noreply@deephand.ai',
        to: 'yamada@example.com',
        subject: 'お問い合わせありがとうございます - DeepHand',
        html: expect.stringContaining('山田太郎'),
        text: expect.stringContaining('お問い合わせを受け付けました'),
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockSend = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' },
      });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
      expect(result.emailId).toBeUndefined();
    });

    it('should handle network errors gracefully', async () => {
      const mockSend = vi.fn().mockRejectedValue(new Error('Network error'));

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('sendDataRequestEmail', () => {
    const mockDataRequestData: CurrentDataRequestFormData = {
      name: '佐藤花子',
      organization: '株式会社AI研究所',
      email: 'sato@ai-research.com',
      backgroundPurpose: '自動運転向けの物体検出用画像データセット。様々な天候・時間帯での撮影画像が必要。',
      dataType: ['image'],
      dataDetails: 'バウンディングボックスによる車両・歩行者・信号機の検出。アノテーション精度は95%以上を要求。',
      dataVolume: '10,000枚の画像',
      deadline: '4週間',
      budget: '¥500,000',
      otherRequirements: '品質を重視したアノテーションをお願いします。',
    };

    it('should send data request email successfully', async () => {
      const mockSend = vi.fn().mockResolvedValue({
        data: { id: 'data-request-123' },
        error: null,
      });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendDataRequestEmail(mockDataRequestData);

      expect(result.success).toBe(true);
      expect(result.emailId).toBe('data-request-123');

      // Verify detailed data request email content
      expect(mockSend).toHaveBeenCalledWith({
        from: 'requests@deephand.ai',
        to: ['sales@deephand.ai'],
        replyTo: 'sato@ai-research.com',
        subject: 'データリクエスト: 佐藤花子',
        html: expect.stringContaining('株式会社AI研究所'),
        text: expect.stringContaining('佐藤花子'),
      });
    });

    it('should include all project details in email', async () => {
      const mockSend = vi.fn().mockResolvedValue({
        data: { id: 'test' },
        error: null,
      });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      await sendDataRequestEmail(mockDataRequestData);

      const emailCall = mockSend.mock.calls[0][0];

      // Check that all important data is included
      expect(emailCall.html).toContain('株式会社AI研究所');
      expect(emailCall.html).toContain('佐藤花子');
      expect(emailCall.html).toContain('image');
      expect(emailCall.html).toContain('10,000枚の画像');
      expect(emailCall.html).toContain('4週間');
      expect(emailCall.html).toContain('¥500,000');
    });

    it('should handle missing optional fields gracefully', async () => {
      const dataWithoutOptionals: CurrentDataRequestFormData = {
        ...mockDataRequestData,
        organization: undefined,
        dataDetails: undefined,
        otherRequirements: undefined,
      };

      const mockSend = vi.fn().mockResolvedValue({
        data: { id: 'test' },
        error: null,
      });

      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: { send: mockSend },
          }) as any
      );

      const result = await sendDataRequestEmail(dataWithoutOptionals);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(2); // Admin + user confirmation
    });
  });
});
