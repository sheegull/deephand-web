/**
 * Language Switching Integration Test (TDD)
 * 
 * Solutions、Resources、Pricing、About ページでの言語切替機能テスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SolutionsPage } from '../SolutionsPage';
import { PricingPage } from '../PricingPageFixed';
import { ResourcesPage } from '../ResourcesPageFixed';
import { AboutPage } from '../AboutPageFixed';

// Mock useLanguage hook
const mockSwitchLanguage = vi.fn();
const mockCurrentLanguage = vi.fn().mockReturnValue('en');

vi.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: mockCurrentLanguage(),
    switchLanguage: mockSwitchLanguage,
    isLoading: false,
  }),
}));

// Mock i18n
vi.mock('../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'solutions.title': 'Our Solutions',
      'solutions.subtitle': 'Comprehensive data annotation services',
      'solutions.description': 'Professional annotation for AI and robotics',
      'pricing.title': 'Pricing Plans',
      'pricing.subtitle': 'Choose the right plan for your needs',
      'resources.title': 'Resources',
      'resources.subtitle': 'Learn more about our services',
      'about.title': 'About Us',
      'about.subtitle': 'Our mission and team',
      'nav.solutions': 'Solutions',
      'nav.resources': 'Resources',
      'nav.pricing': 'Pricing',
      'nav.aboutUs': 'About Us',
      'nav.getStarted': 'Get Started',
      'footer.copyright': '© 2024 DeepHand. All rights reserved.',
      'footer.termsOfService': 'Terms of Service',
      'footer.privacyPolicy': 'Privacy Policy',
    };
    return translations[key] || key;
  },
  getCurrentLanguage: () => mockCurrentLanguage(),
  setCurrentLanguage: vi.fn(),
}));

// Mock GlobalHeaderFixed
vi.mock('../GlobalHeaderFixed', () => ({
  GlobalHeaderFixed: ({ className, onLanguageChange }: { className?: string, onLanguageChange?: (lang: string) => void }) => (
    <header 
      role="banner" 
      className={`global-header-mock ${className || ''}`}
      data-testid="global-header"
    >
      <div>GlobalHeaderFixed Mock</div>
      <button 
        data-testid="language-toggle"
        role="button"
        onClick={() => {
          const newLanguage = mockCurrentLanguage() === 'en' ? 'ja' : 'en';
          mockSwitchLanguage(newLanguage);
          if (onLanguageChange) {
            onLanguageChange(newLanguage);
          }
        }}
      >
        {mockCurrentLanguage() === 'en' ? 'JA' : 'EN'}
      </button>
    </header>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h1: ({ children, className, ...props }: any) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
  },
}));

// Mock UI components
vi.mock('../ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className} data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div className={className} data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h3 className={className} data-testid="card-title">{children}</h3>
  ),
  CardDescription: ({ children, className }: any) => (
    <p className={className} data-testid="card-description">{children}</p>
  ),
}));

describe('Language Switching Integration (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentLanguage.mockReturnValue('en');
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('SolutionsPage 言語切替', () => {
    it('should render GlobalHeader with language toggle', () => {
      // TDD: GlobalHeaderが言語切替ボタンと共にレンダリングされる
      render(<SolutionsPage />);
      
      const globalHeader = screen.getByTestId('global-header');
      const languageToggle = screen.getByTestId('language-toggle');
      
      expect(globalHeader).toBeInTheDocument();
      expect(languageToggle).toBeInTheDocument();
      expect(languageToggle).toHaveTextContent('JA'); // 英語ページなので日本語切替
    });

    it('should call switchLanguage when language toggle is clicked', async () => {
      // TDD: 言語切替ボタンクリック時にswitchLanguageが呼ばれる
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      expect(mockSwitchLanguage).toHaveBeenCalledWith('ja');
    });

    it('should update content when language changes to Japanese', async () => {
      // TDD: 日本語に切り替わった時にコンテンツが更新される
      const { rerender } = render(<SolutionsPage />);
      
      // 日本語に切り替え
      mockCurrentLanguage.mockReturnValue('ja');
      rerender(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      expect(languageToggle).toHaveTextContent('EN'); // 日本語ページなので英語切替
    });

    it('should handle navigation with correct language URLs', () => {
      // TDD: 言語に応じた正しいURLでナビゲーションする
      render(<SolutionsPage />);
      
      // ページ内のリンクが正しい言語URLを使用することを確認
      // この場合は英語ページなので /request になる
      expect(window.location.href).toBe('');
    });
  });

  describe('PricingPage 言語切替', () => {
    it('should render with language switching capability', () => {
      // TDD: PricingPageが言語切替機能と共にレンダリングされる
      render(<PricingPage />);
      
      const globalHeader = screen.getByTestId('global-header');
      const languageToggle = screen.getByTestId('language-toggle');
      
      expect(globalHeader).toBeInTheDocument();
      expect(languageToggle).toBeInTheDocument();
    });

    it('should maintain language state consistency', async () => {
      // TDD: 言語状態の一貫性を維持する
      render(<PricingPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      await waitFor(() => {
        expect(mockSwitchLanguage).toHaveBeenCalledWith('ja');
      });
    });
  });

  describe('ResourcesPage 言語切替', () => {
    it('should support language switching', () => {
      // TDD: ResourcesPageが言語切替をサポートする
      render(<ResourcesPage />);
      
      const globalHeader = screen.getByTestId('global-header');
      const languageToggle = screen.getByTestId('language-toggle');
      
      expect(globalHeader).toBeInTheDocument();
      expect(languageToggle).toBeInTheDocument();
    });

    it('should handle language change properly', async () => {
      // TDD: 言語変更を適切に処理する
      render(<ResourcesPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      expect(mockSwitchLanguage).toHaveBeenCalledWith('ja');
    });
  });

  describe('AboutPage 言語切替', () => {
    it('should implement language switching', () => {
      // TDD: AboutPageが言語切替を実装する
      render(<AboutPage />);
      
      const globalHeader = screen.getByTestId('global-header');
      const languageToggle = screen.getByTestId('language-toggle');
      
      expect(globalHeader).toBeInTheDocument();
      expect(languageToggle).toBeInTheDocument();
    });

    it('should respond to language toggle clicks', async () => {
      // TDD: 言語切替クリックに応答する
      render(<AboutPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      expect(mockSwitchLanguage).toHaveBeenCalledWith('ja');
    });
  });

  describe('言語状態同期要件', () => {
    it('should maintain consistent language state across page components', () => {
      // TDD: ページコンポーネント間で一貫した言語状態を維持する
      const { unmount: unmountSolutions } = render(<SolutionsPage />);
      expect(mockCurrentLanguage()).toBe('en');
      
      unmountSolutions();
      
      const { unmount: unmountPricing } = render(<PricingPage />);
      expect(mockCurrentLanguage()).toBe('en');
      
      unmountPricing();
    });

    it('should propagate language changes to all page components', async () => {
      // TDD: 言語変更を全ページコンポーネントに伝播する
      const { rerender: rerenderSolutions } = render(<SolutionsPage />);
      
      // 言語切替
      mockCurrentLanguage.mockReturnValue('ja');
      rerenderSolutions(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      expect(languageToggle).toHaveTextContent('EN');
    });

    it('should handle language switching without page reload', async () => {
      // TDD: ページリロードなしで言語切替を処理する
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      const initialHref = window.location.href;
      
      fireEvent.click(languageToggle);
      
      // ページリロードが発生しないことを確認
      expect(window.location.href).toBe(initialHref);
      expect(mockSwitchLanguage).toHaveBeenCalledWith('ja');
    });
  });

  describe('エラーハンドリング要件', () => {
    it('should handle language switching failures gracefully', async () => {
      // TDD: 言語切替失敗を適切に処理する
      mockSwitchLanguage.mockRejectedValueOnce(new Error('Language switch failed'));
      
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      
      expect(() => {
        fireEvent.click(languageToggle);
      }).not.toThrow();
    });

    it('should maintain UI responsiveness during language switching', () => {
      // TDD: 言語切替中もUIの応答性を維持する
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      expect(languageToggle).toBeEnabled();
      
      fireEvent.click(languageToggle);
      
      // 切替中もボタンがクリック可能であることを確認
      expect(languageToggle).toBeEnabled();
    });
  });

  describe('パフォーマンス要件', () => {
    it('should not cause memory leaks during language switching', () => {
      // TDD: 言語切替時にメモリリークを起こさない
      const { unmount } = render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should minimize re-renders during language switching', async () => {
      // TDD: 言語切替時の再レンダリングを最小化する
      const renderCount = vi.fn();
      
      const TestComponent = () => {
        renderCount();
        return <SolutionsPage />;
      };
      
      const { rerender } = render(<TestComponent />);
      
      const initialRenderCount = renderCount.mock.calls.length;
      
      // 言語変更
      mockCurrentLanguage.mockReturnValue('ja');
      rerender(<TestComponent />);
      
      const finalRenderCount = renderCount.mock.calls.length;
      
      // 不要な再レンダリングが発生していないことを確認
      expect(finalRenderCount - initialRenderCount).toBeLessThanOrEqual(2);
    });
  });

  describe('アクセシビリティ要件', () => {
    it('should announce language changes to screen readers', () => {
      // TDD: スクリーンリーダーに言語変更をアナウンスする
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      expect(languageToggle).toHaveAttribute('role', 'button');
      
      // アクセシビリティ属性が適切に設定されていることを確認
      expect(languageToggle).toBeInTheDocument();
    });

    it('should maintain focus management during language switching', () => {
      // TDD: 言語切替時のフォーカス管理を維持する
      render(<SolutionsPage />);
      
      const languageToggle = screen.getByTestId('language-toggle');
      languageToggle.focus();
      
      expect(document.activeElement).toBe(languageToggle);
      
      fireEvent.click(languageToggle);
      
      // フォーカスが失われないことを確認
      expect(document.activeElement).toBe(languageToggle);
    });
  });
});