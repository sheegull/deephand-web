/**
 * HeroSection Integration Tests (TDD Approach)
 * 
 * GlobalHeaderとの統合とヘッダー統一の要件を定義します。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeroSection } from '../HeroSection';

// Mock useLanguage hook
vi.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: 'ja',
    switchLanguage: vi.fn(),
  }),
}));

// Mock i18n
vi.mock('../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'hero.title': 'AI-Powered Hand Recognition\nTechnology',
      'hero.subtitle': 'Revolutionary hand gesture recognition technology',
      'hero.requestButton': 'Get Started',
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch with our team',
      'contact.name': 'Name',
      'contact.organization': 'Organization', 
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.submit': 'Submit',
      'contact.placeholder.name': 'Enter your name',
      'contact.placeholder.organization': 'Enter your organization',
      'contact.placeholder.email': 'Enter your email',
      'contact.placeholder.message': 'Enter your message',
      'footer.copyright': '© 2024 DeepHand. All rights reserved.',
      'footer.termsOfService': 'Terms of Service',
      'footer.privacyPolicy': 'Privacy Policy',
      'nav.solutions': 'Solutions',
      'nav.resources': 'Resources', 
      'nav.pricing': 'Pricing',
      'nav.aboutUs': 'About Us',
      'nav.getStarted': 'Get Started',
    };
    return translations[key] || key;
  },
  getCurrentLanguage: () => 'ja',
}));

// Mock GlobalHeader
vi.mock('../GlobalHeader', () => ({
  GlobalHeader: ({ className }: { className?: string }) => (
    <header 
      role="banner" 
      className={`global-header-mock ${className || ''}`}
      data-testid="global-header"
    >
      <div>GlobalHeader Mock</div>
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

// Mock DitherBackground
vi.mock('../ui/DitherBackgroundOptimized', () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="dither-background">
      Dither Background
    </div>
  ),
}));

// Mock UI components
vi.mock('../ui/button', () => ({
  Button: ({ children, className, onClick, ...props }: any) => (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

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

vi.mock('../ui/input', () => ({
  Input: (props: any) => <input {...props} data-testid="input" />,
}));

vi.mock('../ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} data-testid="textarea" />,
}));

describe('HeroSection Integration (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('GlobalHeader統合要件', () => {
    it('should use GlobalHeader component instead of custom header', async () => {
      // TDD: HeroSectionはGlobalHeaderコンポーネントを使用する
      render(<HeroSection />);
      
      // GlobalHeaderが存在することを確認
      const globalHeader = screen.getByTestId('global-header');
      expect(globalHeader).toBeInTheDocument();
      expect(globalHeader).toHaveClass('global-header-mock');
    });

    it('should not render duplicate header elements', async () => {
      // TDD: 重複するヘッダー要素が存在しない
      render(<HeroSection />);
      
      // GlobalHeaderが1つだけ存在することを確認
      const headers = screen.getAllByRole('banner');
      expect(headers).toHaveLength(1);
      
      // GlobalHeaderのテストIDを持つ要素が1つだけ存在
      const globalHeaders = screen.getAllByTestId('global-header');
      expect(globalHeaders).toHaveLength(1);
    });

    it('should not render custom navigation elements in main content', async () => {
      // TDD: メインコンテンツ内に独自のナビゲーション要素がない
      render(<HeroSection />);
      
      const mainContent = screen.getByRole('main');
      
      // メインコンテンツ内にナビゲーション要素が存在しないことを確認
      const navigationElements = mainContent.querySelectorAll('nav');
      expect(navigationElements).toHaveLength(0);
      
      // メインコンテンツ内にメニューボタンが存在しないことを確認
      const menuButtons = mainContent.querySelectorAll('[aria-label="Toggle menu"]');
      expect(menuButtons).toHaveLength(0);
    });

    it('should have proper layout without duplicate header spacing', async () => {
      // TDD: ヘッダー重複による余分なスペーシングがない
      render(<HeroSection />);
      
      const mainContent = screen.getByRole('main');
      
      // メインコンテンツが適切なマージンを持つ
      expect(mainContent).toHaveClass('mt-24', 'sm:mt-28', 'lg:mt-40');
      
      // 重複するヘッダー用のマージンが存在しない
      expect(mainContent).not.toHaveClass('mt-48', 'mt-56', 'mt-64');
    });
  });

  describe('レイアウト統合要件', () => {
    it('should render main content below GlobalHeader', async () => {
      // TDD: メインコンテンツがGlobalHeaderの下に配置される
      render(<HeroSection />);
      
      const globalHeader = screen.getByTestId('global-header');
      const mainContent = screen.getByRole('main');
      
      // 両方の要素が存在することを確認
      expect(globalHeader).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();
      
      // z-indexが適切に設定されている
      expect(mainContent).toHaveClass('z-10');
    });

    it('should maintain proper spacing for hero content', async () => {
      // TDD: ヒーローコンテンツが適切なスペーシングを保つ
      render(<HeroSection />);
      
      const heroTitle = screen.getByText('AI-Powered Hand Recognition');
      expect(heroTitle).toBeInTheDocument();
      
      const mainContent = screen.getByRole('main');
      
      // パディングが適切に設定されている
      expect(mainContent).toHaveClass('px-4', 'md:px-[92px]');
    });

    it('should not interfere with background elements', async () => {
      // TDD: 背景要素（DitherBackground）との干渉がない
      render(<HeroSection />);
      
      const ditherBackground = screen.getByTestId('dither-background');
      expect(ditherBackground).toBeInTheDocument();
      expect(ditherBackground).toHaveClass('fixed', 'inset-0', 'z-0', 'opacity-60');
    });
  });

  describe('機能統合要件', () => {
    it('should inherit scroll blur functionality from GlobalHeader', async () => {
      // TDD: GlobalHeaderのスクロールブラー機能を継承
      render(<HeroSection />);
      
      const globalHeader = screen.getByTestId('global-header');
      
      // GlobalHeaderが存在し、必要なクラスを持つ
      expect(globalHeader).toBeInTheDocument();
      expect(globalHeader).toHaveClass('global-header-mock');
      
      // HeroSection自体はスクロール検知を行わない（GlobalHeaderに委譲）
      const mainContent = screen.getByRole('main');
      expect(mainContent).not.toHaveClass('backdrop-blur-md');
    });

    it('should maintain all navigation functionality', async () => {
      // TDD: 全てのナビゲーション機能が維持される
      render(<HeroSection />);
      
      // GlobalHeaderが提供するナビゲーション機能を確認
      const globalHeader = screen.getByTestId('global-header');
      expect(globalHeader).toBeInTheDocument();
      
      // Get Startedボタンが存在することを確認
      const getStartedButtons = screen.getAllByText('Get Started');
      expect(getStartedButtons.length).toBeGreaterThan(0);
    });

    it('should handle props correctly with GlobalHeader integration', async () => {
      // TDD: GlobalHeader統合時にpropsが正しく処理される
      const mockOnLogoClick = vi.fn();
      const mockOnNavClick = vi.fn();
      
      render(
        <HeroSection 
          onLogoClick={mockOnLogoClick}
          onNavClick={mockOnNavClick}
        />
      );
      
      // propsが正しく渡されることをテスト
      // （実際の実装では、これらのpropsはGlobalHeaderに渡される）
      const globalHeader = screen.getByTestId('global-header');
      expect(globalHeader).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ統合要件', () => {
    it('should maintain proper heading hierarchy', async () => {
      // TDD: 適切な見出し階層が維持される
      render(<HeroSection />);
      
      // メインのh1が存在
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('AI-Powered Hand Recognition');
      
      // GlobalHeaderが適切なランドマークロールを持つ
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
    });

    it('should maintain proper focus management', async () => {
      // TDD: 適切なフォーカス管理が維持される
      render(<HeroSection />);
      
      // フォーカス可能な要素が適切に存在
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // 各ボタンがフォーカス可能
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should maintain semantic HTML structure', async () => {
      // TDD: セマンティックなHTML構造が維持される
      render(<HeroSection />);
      
      // 適切なランドマークが存在
      const banner = screen.getByRole('banner'); // GlobalHeader
      const main = screen.getByRole('main'); // メインコンテンツ
      
      expect(banner).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });
  });

  describe('パフォーマンス統合要件', () => {
    it('should not duplicate header rendering overhead', async () => {
      // TDD: ヘッダーレンダリングのオーバーヘッドが重複しない
      const startTime = performance.now();
      
      render(<HeroSection />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // レンダリング時間が合理的な範囲内
      expect(renderTime).toBeLessThan(100); // 100ms以内
      
      // 単一のヘッダーのみ存在
      const headers = screen.getAllByRole('banner');
      expect(headers).toHaveLength(1);
    });

    it('should maintain efficient re-render behavior', async () => {
      // TDD: 効率的な再レンダリング動作を維持
      const { rerender } = render(<HeroSection />);
      
      // 複数回再レンダリングしても問題なし
      for (let i = 0; i < 5; i++) {
        rerender(<HeroSection />);
      }
      
      // GlobalHeaderが依然として存在
      const globalHeader = screen.getByTestId('global-header');
      expect(globalHeader).toBeInTheDocument();
    });
  });
});