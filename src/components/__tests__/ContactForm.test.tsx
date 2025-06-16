import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '../HeroSection';

// Mock framer-motion
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

// Mock other dependencies
vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
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

describe('ContactForm Success/Error Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  it('should show success message when API returns success: true', async () => {
    // Test 1: API returns success: true with emailId
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: true,
        message: 'お問い合わせを受け付けました。',
        emailId: 'test-email-id-123'
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const user = userEvent.setup();
    render(<HeroSection />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'This is a test message for success case');

    // Submit form
    await user.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify API was called correctly
    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        organization: '',
        email: 'test@example.com',
        message: 'This is a test message for success case',
      }),
    });
  });

  it('should show success message even when success field is string "true"', async () => {
    // Test 2: API returns success as string (edge case)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: 'true', // String instead of boolean
        message: 'お問い合わせを受け付けました。',
        emailId: 'test-email-id-456'
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const user = userEvent.setup();
    render(<HeroSection />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User 2');
    await user.type(emailInput, 'test2@example.com');
    await user.type(messageInput, 'This is a test message for string success case');

    // Submit form
    await user.click(submitButton);

    // Should show success even with string "true"
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show success message when emailId exists even without explicit success', async () => {
    // Test 3: API returns emailId but success field is missing/undefined
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        message: 'お問い合わせを受け付けました。',
        emailId: 'test-email-id-789'
        // success field intentionally missing
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const user = userEvent.setup();
    render(<HeroSection />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User 3');
    await user.type(emailInput, 'test3@example.com');
    await user.type(messageInput, 'This is a test message for emailId-only success case');

    // Submit form
    await user.click(submitButton);

    // Should show success when emailId exists
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show error message when API returns success: false', async () => {
    // Test 4: API explicitly returns success: false
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({
        success: false,
        message: 'メール送信に失敗しました。',
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const user = userEvent.setup();
    render(<HeroSection />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User 4');
    await user.type(emailInput, 'test4@example.com');
    await user.type(messageInput, 'This is a test message for error case');

    // Submit form
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show error message when API returns 200 but no success indicator', async () => {
    // Test 5: API returns 200 but no success field or emailId
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        message: 'Some response message',
        // No success field, no emailId
      }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const user = userEvent.setup();
    render(<HeroSection />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const messageInput = screen.getByPlaceholderText('Your message');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'Test User 5');
    await user.type(emailInput, 'test5@example.com');
    await user.type(messageInput, 'This is a test message for no indicator case');

    // Submit form
    await user.click(submitButton);

    // Should show error message when no success indicators
    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});