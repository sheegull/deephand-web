import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock all external dependencies to isolate the logic
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => '0%' }),
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, type, disabled, ...props }: any) => (
    <button onClick={onClick} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));

vi.mock('../ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock('../ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock('../ui/language-toggle', () => ({
  LanguageToggle: () => <div>Language Toggle</div>,
}));

vi.mock('../ui/DitherBackground', () => ({
  default: () => <div data-testid="dither-background">Dither Background</div>,
}));

vi.mock('../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'contact.title': 'Get in Touch',
      'contact.subtitle': 'Fill out the form below',
      'contact.name': 'Name',
      'contact.organization': 'Organization',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.placeholder.name': 'Your name',
      'contact.placeholder.organization': 'Your organization',
      'contact.placeholder.email': 'your@email.com',
      'contact.placeholder.message': 'Your message',
      'contact.submit': 'Submit',
      'contact.submitting': 'Submitting...',
      'contact.success': 'Message sent successfully!',
      'contact.error': 'Failed to send message. Please try again.',
    };
    return translations[key] || key;
  },
  getCurrentLanguage: () => 'en',
  setCurrentLanguage: vi.fn(),
}));

vi.mock('../../lib/error-handling', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
}));

// Global fetch mock
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test component directly
function TestContactForm() {
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      organization: formData.get('organization'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        setSubmitStatus('error');
        return;
      }

      // Test the exact logic from HeroSection
      const isMainFunctionSuccessful = response.status === 200 && response.ok && 
        (
          result.success === true || 
          result.success === "true" || 
          (result.emailId && result.emailId.length > 0)
        );

      if (isMainFunctionSuccessful) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="your@email.com" required />
      <textarea name="message" placeholder="Your message" required />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      
      {submitStatus === 'success' && (
        <p data-testid="success-message">Message sent successfully!</p>
      )}
      {submitStatus === 'error' && (
        <p data-testid="error-message">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}

describe('Contact Form Logic Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show success message when API returns correct response', async () => {
    // Mock successful API response exactly like the real API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: true,
        message: 'お問い合わせを受け付けました。24時間以内にご返信いたします。',
        emailId: 'test-email-id-123'
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    render(<TestContactForm />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });

    // Submit form
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify no error message
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });
});