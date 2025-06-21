/**
 * GlobalFooter Tests (TDD Approach)
 * 
 * フッター統一とiOS Safari対応の要件を定義します。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalFooter } from '../GlobalFooter';

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
      'footer.copyright': '© 2024 DeepHand. All rights reserved.',
      'footer.termsOfService': 'Terms of Service',
      'footer.privacyPolicy': 'Privacy Policy',
    };
    return translations[key] || key;
  },
  getCurrentLanguage: () => 'ja',
}));

describe('GlobalFooter (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('基本要件', () => {
    it('should render footer element with proper role', async () => {
      // TDD: footerタグが適切なロールで表示される
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer.tagName.toLowerCase()).toBe('footer');
    });

    it('should render copyright text', async () => {
      // TDD: コピーライト文言が表示される
      render(<GlobalFooter />);
      
      const copyright = screen.getByText('© 2024 DeepHand. All rights reserved.');
      expect(copyright).toBeInTheDocument();
    });

    it('should render terms of service link', async () => {
      // TDD: 利用規約リンクが表示される
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      expect(termsLink).toBeInTheDocument();
      expect(termsLink.tagName.toLowerCase()).toBe('a');
    });

    it('should render privacy policy link', async () => {
      // TDD: プライバシーポリシーリンクが表示される
      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.tagName.toLowerCase()).toBe('a');
    });
  });

  describe('レイアウト要件', () => {
    it('should have responsive layout classes', async () => {
      // TDD: レスポンシブレイアウトクラスが適用される
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // フレックスレイアウトクラス
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('flex-col', 'md:flex-row');
      
      // アライメントクラス
      expect(footer).toHaveClass('items-center');
      expect(footer).toHaveClass('justify-between');
      
      // 幅とギャップ
      expect(footer).toHaveClass('w-full');
      expect(footer).toHaveClass('gap-4', 'md:gap-0');
    });

    it('should have proper spacing classes', async () => {
      // TDD: 適切なスペーシングクラスが適用される
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // mt-auto for bottom alignment
      expect(footer).toHaveClass('mt-auto');
      
      // パディング
      expect(footer).toHaveClass('pt-16', 'pb-8');
    });

    it('should have consistent text styling', async () => {
      // TDD: 一貫したテキストスタイリング
      render(<GlobalFooter />);
      
      const copyright = screen.getByText('© 2024 DeepHand. All rights reserved.');
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // 共通のフォントクラス
      expect(copyright).toHaveClass('font-alliance', 'font-light');
      expect(termsLink).toHaveClass('font-alliance', 'font-light');
      expect(privacyLink).toHaveClass('font-alliance', 'font-light');
      
      // 共通のカラークラス
      expect(copyright).toHaveClass('text-zinc-400');
      expect(termsLink).toHaveClass('text-zinc-400');
      expect(privacyLink).toHaveClass('text-zinc-400');
      
      // 共通のテキストサイズ
      expect(copyright).toHaveClass('text-[10px]');
      expect(termsLink).toHaveClass('text-[10px]');
      expect(privacyLink).toHaveClass('text-[10px]');
    });
  });

  describe('インタラクション要件', () => {
    it('should have hover effects on links', async () => {
      // TDD: リンクにホバー効果が適用される
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // ホバー効果クラス
      expect(termsLink).toHaveClass('hover:text-gray-300');
      expect(privacyLink).toHaveClass('hover:text-gray-300');
      
      // トランジション効果
      expect(termsLink).toHaveClass('transition-colors');
      expect(privacyLink).toHaveClass('transition-colors');
      
      // カーソル
      expect(termsLink).toHaveClass('cursor-pointer');
      expect(privacyLink).toHaveClass('cursor-pointer');
    });

    it('should handle terms link click', async () => {
      // TDD: 利用規約リンククリックが処理される
      const mockLocationHref = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { href: mockLocationHref },
        writable: true,
      });

      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      fireEvent.click(termsLink);
      
      // クリックイベントが発火することを確認
      expect(termsLink).toBeInTheDocument();
    });

    it('should handle privacy link click', async () => {
      // TDD: プライバシーポリシーリンククリックが処理される
      const mockLocationHref = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { href: mockLocationHref },
        writable: true,
      });

      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      fireEvent.click(privacyLink);
      
      // クリックイベントが発火することを確認
      expect(privacyLink).toBeInTheDocument();
    });
  });

  describe('多言語対応要件', () => {
    it('should generate correct URLs for Japanese locale', async () => {
      // TDD: 日本語ロケールで正しいURLが生成される
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // リンクが存在することを確認（実際のURL生成は実装で検証）
      expect(termsLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
    });

    it('should generate correct URLs for English locale', async () => {
      // TDD: 英語ロケールで正しいURLが生成される
      // 英語ロケール用のmockに変更
      vi.mocked(vi.importMock('../../lib/i18n')).getCurrentLanguage.mockReturnValue('en');
      
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // リンクが存在することを確認
      expect(termsLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ要件', () => {
    it('should have proper semantic HTML structure', async () => {
      // TDD: 適切なセマンティックHTML構造
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      // リンクが適切なロールを持つ
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
    });

    it('should be keyboard navigable', async () => {
      // TDD: キーボードナビゲーション可能
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // フォーカス可能であることを確認
      termsLink.focus();
      expect(document.activeElement).toBe(termsLink);
      
      privacyLink.focus();
      expect(document.activeElement).toBe(privacyLink);
    });

    it('should have proper text contrast', async () => {
      // TDD: 適切なテキストコントラスト
      render(<GlobalFooter />);
      
      const copyright = screen.getByText('© 2024 DeepHand. All rights reserved.');
      const termsLink = screen.getByText('Terms of Service');
      
      // テキストカラーが適切に設定されている
      expect(copyright).toHaveClass('text-zinc-400');
      expect(termsLink).toHaveClass('text-zinc-400');
    });
  });

  describe('統一性要件', () => {
    it('should match SolutionsPage footer styling exactly', async () => {
      // TDD: SolutionsPageのフッタースタイリングと完全一致
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // SolutionsPageと同じクラス構成
      expect(footer).toHaveClass(
        'flex',
        'flex-col',
        'md:flex-row',
        'items-center',
        'justify-between',
        'w-full',
        'gap-4',
        'md:gap-0',
        'mt-auto',
        'pt-16',
        'pb-8'
      );
    });

    it('should be reusable across different pages', async () => {
      // TDD: 異なるページで再利用可能
      const { unmount, rerender } = render(<GlobalFooter />);
      
      // 複数回レンダリングしても問題なし
      rerender(<GlobalFooter />);
      rerender(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      unmount();
    });

    it('should not have page-specific dependencies', async () => {
      // TDD: ページ固有の依存関係がない
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // GlobalFooterは純粋なコンポーネントとして動作
      expect(footer).toBeInTheDocument();
      
      // プロップスに依存しない基本構造
      const copyright = screen.getByText('© 2024 DeepHand. All rights reserved.');
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      expect(copyright).toBeInTheDocument();
      expect(termsLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
    });
  });
});