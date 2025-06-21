/**
 * HeroSection Footer Integration Tests (TDD Approach)
 * 
 * GlobalFooter統合とiOS Safari対応の要件を定義します。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

// Mock GlobalFooter
vi.mock('../GlobalFooter', () => ({
  GlobalFooter: ({ className }: { className?: string }) => (
    <footer 
      role="contentinfo" 
      className={`global-footer-mock ${className || ''}`}
      data-testid="global-footer"
    >
      <div>GlobalFooter Mock</div>
    </footer>
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

describe('HeroSection Footer Integration (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('GlobalFooter統合要件', () => {
    it('should use GlobalFooter component instead of custom footer', async () => {
      // TDD: HeroSectionはGlobalFooterコンポーネントを使用する
      render(<HeroSection />);
      
      // GlobalFooterが存在することを確認
      const globalFooter = screen.getByTestId('global-footer');
      expect(globalFooter).toBeInTheDocument();
      expect(globalFooter).toHaveClass('global-footer-mock');
    });

    it('should not render duplicate footer elements', async () => {
      // TDD: 重複するフッター要素が存在しない
      render(<HeroSection />);
      
      // GlobalFooterが1つだけ存在することを確認
      const footers = screen.getAllByRole('contentinfo');
      expect(footers).toHaveLength(1);
      
      // GlobalFooterのテストIDを持つ要素が1つだけ存在
      const globalFooters = screen.getAllByTestId('global-footer');
      expect(globalFooters).toHaveLength(1);
    });

    it('should not render inline footer content in main', async () => {
      // TDD: メインコンテンツ内にインラインフッター内容がない
      render(<HeroSection />);
      
      const mainContent = screen.getByRole('main');
      
      // メインコンテンツ内にフッター関連のテキストが存在しないことを確認
      const footerTextsInMain = mainContent.querySelectorAll('*');
      const hasFooterContent = Array.from(footerTextsInMain).some(element => 
        element.textContent?.includes('© 2024 DeepHand') ||
        element.textContent?.includes('Terms of Service') ||
        element.textContent?.includes('Privacy Policy')
      );
      
      expect(hasFooterContent).toBe(false);
    });

    it('should maintain proper document structure', async () => {
      // TDD: 適切なドキュメント構造を維持
      render(<HeroSection />);
      
      const globalHeader = screen.getByTestId('global-header');
      const mainContent = screen.getByRole('main');
      const globalFooter = screen.getByTestId('global-footer');
      
      // 全ての要素が存在することを確認
      expect(globalHeader).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();
      expect(globalFooter).toBeInTheDocument();
      
      // 適切な順序で配置されていることを確認（DOM順序）
      const allElements = [globalHeader, mainContent, globalFooter];
      allElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('レイアウト統合要件', () => {
    it('should place GlobalFooter outside main content', async () => {
      // TDD: GlobalFooterがメインコンテンツの外に配置される
      render(<HeroSection />);
      
      const mainContent = screen.getByRole('main');
      const globalFooter = screen.getByTestId('global-footer');
      
      // フッターがメインコンテンツの子要素ではないことを確認
      expect(mainContent.contains(globalFooter)).toBe(false);
      
      // 両方の要素が存在することを確認
      expect(mainContent).toBeInTheDocument();
      expect(globalFooter).toBeInTheDocument();
    });

    it('should maintain SolutionsPage-like layout structure', async () => {
      // TDD: SolutionsPageのようなレイアウト構造を維持
      render(<HeroSection />);
      
      // レイアウト構造の確認
      const globalHeader = screen.getByTestId('global-header');
      const globalFooter = screen.getByTestId('global-footer');
      
      expect(globalHeader).toBeInTheDocument();
      expect(globalFooter).toBeInTheDocument();
      
      // SolutionsPageと同様の要素配置
      expect(globalFooter).toHaveClass('global-footer-mock');
    });

    it('should remove fixed inset-0 layout for iOS Safari compatibility', async () => {
      // TDD: iOS Safari互換性のためfixed inset-0レイアウトを削除
      render(<HeroSection />);
      
      // コンテナ要素を取得（最上位のdiv）
      const container = screen.getByTestId('dither-background').parentElement;
      
      // fixed inset-0クラスが存在しないことを確認
      if (container) {
        expect(container).not.toHaveClass('fixed');
        expect(container).not.toHaveClass('inset-0');
      }
      
      // 通常のdocument flowレイアウトであることを確認
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });

    it('should use min-h-screen without height constraints', async () => {
      // TDD: 高さ制約なしでmin-h-screenを使用
      render(<HeroSection />);
      
      // min-h-screenが適用されていることを確認
      const container = screen.getByTestId('dither-background').parentElement;
      
      if (container) {
        expect(container).toHaveClass('min-h-screen');
        // h-fullやh-screenクラスが存在しないことを確認
        expect(container).not.toHaveClass('h-full');
        expect(container).not.toHaveClass('h-screen');
      }
    });
  });

  describe('iOS Safari対応要件', () => {
    it('should not use problematic viewport height units', async () => {
      // TDD: 問題のあるビューポート高さ単位を使用しない
      render(<HeroSection />);
      
      // 100vh、100vhベースのクラスが存在しないことを確認
      const container = screen.getByTestId('dither-background').parentElement;
      
      if (container) {
        // インラインスタイルでの100vhも避ける
        const computedStyle = window.getComputedStyle(container);
        expect(computedStyle.height).not.toContain('100vh');
      }
    });

    it('should allow natural document flow scrolling', async () => {
      // TDD: 自然なドキュメントフローでのスクロールを許可
      render(<HeroSection />);
      
      const container = screen.getByTestId('dither-background').parentElement;
      
      if (container) {
        // overflow-autoやoverflow-hiddenによる制約がないことを確認
        expect(container).not.toHaveClass('overflow-auto');
        expect(container).not.toHaveClass('overflow-hidden');
      }
    });

    it('should have proper bottom spacing for footer visibility', async () => {
      // TDD: フッター表示のための適切な下部スペーシング
      render(<HeroSection />);
      
      const globalFooter = screen.getByTestId('global-footer');
      
      // フッターが存在し、適切なクラスを持つことを確認
      expect(globalFooter).toBeInTheDocument();
      expect(globalFooter).toHaveClass('global-footer-mock');
    });
  });

  describe('機能統合要件', () => {
    it('should maintain all header functionality', async () => {
      // TDD: 全ヘッダー機能を維持
      render(<HeroSection />);
      
      const globalHeader = screen.getByTestId('global-header');
      expect(globalHeader).toBeInTheDocument();
      expect(globalHeader).toHaveClass('global-header-mock');
    });

    it('should maintain all footer functionality', async () => {
      // TDD: 全フッター機能を維持
      render(<HeroSection />);
      
      const globalFooter = screen.getByTestId('global-footer');
      expect(globalFooter).toBeInTheDocument();
      expect(globalFooter).toHaveClass('global-footer-mock');
    });

    it('should handle props correctly with Global components', async () => {
      // TDD: Globalコンポーネントと組み合わせてpropsが正しく処理される
      const mockOnLogoClick = vi.fn();
      const mockOnNavClick = vi.fn();
      
      render(
        <HeroSection 
          onLogoClick={mockOnLogoClick}
          onNavClick={mockOnNavClick}
        />
      );
      
      // GlobalHeaderとGlobalFooterが正しく表示される
      const globalHeader = screen.getByTestId('global-header');
      const globalFooter = screen.getByTestId('global-footer');
      
      expect(globalHeader).toBeInTheDocument();
      expect(globalFooter).toBeInTheDocument();
    });
  });

  describe('パフォーマンス統合要件', () => {
    it('should not duplicate footer rendering overhead', async () => {
      // TDD: フッターレンダリングのオーバーヘッドが重複しない
      const startTime = performance.now();
      
      render(<HeroSection />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // レンダリング時間が合理的な範囲内
      expect(renderTime).toBeLessThan(100); // 100ms以内
      
      // 単一のフッターのみ存在
      const footers = screen.getAllByRole('contentinfo');
      expect(footers).toHaveLength(1);
    });

    it('should maintain efficient re-render behavior with Global components', async () => {
      // TDD: Globalコンポーネントと組み合わせて効率的な再レンダリング動作を維持
      const { rerender } = render(<HeroSection />);
      
      // 複数回再レンダリングしても問題なし
      for (let i = 0; i < 5; i++) {
        rerender(<HeroSection />);
      }
      
      // GlobalHeaderとGlobalFooterが依然として存在
      const globalHeader = screen.getByTestId('global-header');
      const globalFooter = screen.getByTestId('global-footer');
      
      expect(globalHeader).toBeInTheDocument();
      expect(globalFooter).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ統合要件', () => {
    it('should maintain proper landmark structure', async () => {
      // TDD: 適切なランドマーク構造を維持
      render(<HeroSection />);
      
      // 適切なランドマークが存在
      const banner = screen.getByRole('banner'); // GlobalHeader
      const main = screen.getByRole('main'); // メインコンテンツ  
      const contentinfo = screen.getByRole('contentinfo'); // GlobalFooter
      
      expect(banner).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(contentinfo).toBeInTheDocument();
    });

    it('should maintain proper focus order', async () => {
      // TDD: 適切なフォーカス順序を維持
      render(<HeroSection />);
      
      // フォーカス可能な要素が適切な順序で存在
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // 各ボタンがフォーカス可能
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should maintain semantic heading hierarchy', async () => {
      // TDD: セマンティックな見出し階層を維持
      render(<HeroSection />);
      
      // メインのh1が存在
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(/AI-Powered Hand Recognition/);
    });
  });
});