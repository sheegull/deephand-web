/**
 * GlobalFooter Navigation Tests (TDD Approach)
 * 
 * 利用規約・プライバシーポリシーページへの専用ページ遷移とz-index最上位配置の要件を定義します。
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

// Mock i18n with static implementation first, then we'll override in tests
vi.mock('../../lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'footer.copyright': '© 2024 DeepHand. All rights reserved.',
      'footer.termsOfService': 'Terms of Service',
      'footer.privacyPolicy': 'Privacy Policy',
    };
    return translations[key] || key;
  },
  getCurrentLanguage: vi.fn(() => 'ja'),
}));

describe('GlobalFooter Navigation (TDD)', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
    
    // Reset language mock to default Japanese
    const { getCurrentLanguage } = await import('../../lib/i18n');
    vi.mocked(getCurrentLanguage).mockReturnValue('ja');
    
    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as Location;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('専用ページ遷移要件', () => {
    it('should navigate to terms page when terms link is clicked', async () => {
      // TDD: 利用規約リンククリック時に専用ページに遷移
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      expect(termsLink).toBeInTheDocument();
      
      // リンクがクリック可能であることを確認
      expect(termsLink.tagName).toBe('A');
      expect(termsLink).toHaveAttribute('href');
      
      // 日本語版の場合、/termsに遷移する
      expect(termsLink).toHaveAttribute('href', '/terms');
    });

    it('should navigate to privacy page when privacy link is clicked', async () => {
      // TDD: プライバシーポリシーリンククリック時に専用ページに遷移
      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink).toBeInTheDocument();
      
      // リンクがクリック可能であることを確認
      expect(privacyLink.tagName).toBe('A');
      expect(privacyLink).toHaveAttribute('href');
      
      // 日本語版の場合、/privacyに遷移する
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should handle English language terms navigation', async () => {
      // TDD: 英語版の場合、/en/termsに遷移
      
      // Mock English language
      const { getCurrentLanguage } = await import('../../lib/i18n');
      vi.mocked(getCurrentLanguage).mockReturnValue('en');
      
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      expect(termsLink).toHaveAttribute('href', '/en/terms');
    });

    it('should handle English language privacy navigation', async () => {
      // TDD: 英語版の場合、/en/privacyに遷移
      
      // Mock English language
      const { getCurrentLanguage } = await import('../../lib/i18n');
      vi.mocked(getCurrentLanguage).mockReturnValue('en');
      
      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink).toHaveAttribute('href', '/en/privacy');
    });

    it('should prevent default click behavior and use custom navigation', async () => {
      // TDD: デフォルトのクリック動作を防ぎ、カスタムナビゲーションを使用
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      
      // クリックイベントをシミュレート
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(clickEvent, 'preventDefault', { value: vi.fn() });
      
      fireEvent(termsLink, clickEvent);
      
      // preventDefault が呼び出されることを確認
      expect(clickEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle click navigation correctly for terms', async () => {
      // TDD: 利用規約のクリックナビゲーションが正しく動作
      const originalLocation = window.location;
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      fireEvent.click(termsLink);
      
      // window.location.href が設定されることを確認
      expect(mockLocation.href).toBe('/terms');
      
      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('should handle click navigation correctly for privacy', async () => {
      // TDD: プライバシーポリシーのクリックナビゲーションが正しく動作
      const originalLocation = window.location;
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      fireEvent.click(privacyLink);
      
      // window.location.href が設定されることを確認
      expect(mockLocation.href).toBe('/privacy');
      
      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });
  });

  describe('z-index最上位配置要件', () => {
    it('should have highest z-index for proper layering', async () => {
      // TDD: フッターが最上位のz-indexを持つ
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // z-index最上位クラスまたはスタイルが適用されている
      expect(footer.className).toMatch(/z-\[100\]/);
    });

    it('should be above background and content layers', async () => {
      // TDD: 背景とコンテンツレイヤーより上に配置
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // z-indexクラスが適用されていることを確認
      expect(footer.className).toMatch(/z-\[100\]/);
      
      // または、計算済みスタイルからz-indexを確認
      const computedStyle = window.getComputedStyle(footer);
      const zIndex = computedStyle.zIndex;
      
      // z-indexが設定されている（'auto'でない）
      expect(zIndex).not.toBe('auto');
    });

    it('should maintain z-index consistency across different screen sizes', async () => {
      // TDD: 異なる画面サイズでz-indexの一貫性を維持
      render(<GlobalFooter />);
      
      const footer = screen.getByRole('contentinfo');
      
      // レスポンシブクラスでもz-indexが保持される
      expect(footer.className).toMatch(/z-\[100\]/);
    });

    it('should not be blocked by other UI elements', async () => {
      // TDD: 他のUI要素によってブロックされない
      render(
        <div>
          <div className="relative z-10 bg-red-500 h-20">Other Content</div>
          <GlobalFooter />
        </div>
      );
      
      const footer = screen.getByRole('contentinfo');
      const otherContent = screen.getByText('Other Content');
      
      // フッターが高いz-indexクラスを持つことを確認
      expect(footer.className).toMatch(/z-\[100\]/);
      
      // 他のコンテンツより高いz-indexであることを確認
      const footerClasses = footer.className;
      const contentClasses = otherContent.className;
      
      expect(footerClasses).toContain('z-[100]');
    });
  });

  describe('リンクアクセシビリティ要件', () => {
    it('should have proper role and href attributes for terms link', async () => {
      // TDD: 利用規約リンクが適切なroleとhref属性を持つ
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      
      expect(termsLink).toHaveAttribute('role', 'link');
      expect(termsLink).toHaveAttribute('href');
      expect(termsLink.getAttribute('href')).toBe('/terms');
    });

    it('should have proper role and href attributes for privacy link', async () => {
      // TDD: プライバシーリンクが適切なroleとhref属性を持つ
      render(<GlobalFooter />);
      
      const privacyLink = screen.getByText('Privacy Policy');
      
      expect(privacyLink).toHaveAttribute('role', 'link');
      expect(privacyLink).toHaveAttribute('href');
      expect(privacyLink.getAttribute('href')).toBe('/privacy');
    });

    it('should be keyboard accessible', async () => {
      // TDD: キーボードアクセス可能
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      // フォーカス可能であることを確認
      expect(termsLink).not.toHaveAttribute('tabindex', '-1');
      expect(privacyLink).not.toHaveAttribute('tabindex', '-1');
      
      // フォーカス時のスタイリングがある
      expect(termsLink.className).toMatch(/hover:|focus:/);
      expect(privacyLink.className).toMatch(/hover:|focus:/);
    });

    it('should have appropriate cursor styling', async () => {
      // TDD: 適切なカーソルスタイリング
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      const privacyLink = screen.getByText('Privacy Policy');
      
      expect(termsLink).toHaveClass('cursor-pointer');
      expect(privacyLink).toHaveClass('cursor-pointer');
    });
  });

  describe('多言語対応要件', () => {
    it('should update URLs when language changes to English', async () => {
      // TDD: 言語が英語に変更された際にURLが更新される
      
      // 最初は日本語
      const { rerender } = render(<GlobalFooter />);
      
      let termsLink = screen.getByText('Terms of Service');
      let privacyLink = screen.getByText('Privacy Policy');
      
      expect(termsLink).toHaveAttribute('href', '/terms');
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      
      // 英語に変更
      const { getCurrentLanguage } = await import('../../lib/i18n');
      vi.mocked(getCurrentLanguage).mockReturnValue('en');
      
      rerender(<GlobalFooter />);
      
      termsLink = screen.getByText('Terms of Service');
      privacyLink = screen.getByText('Privacy Policy');
      
      expect(termsLink).toHaveAttribute('href', '/en/terms');
      expect(privacyLink).toHaveAttribute('href', '/en/privacy');
    });

    it('should maintain consistent navigation behavior across languages', async () => {
      // TDD: 言語間で一貫したナビゲーション動作を維持
      
      // 日本語版でテスト
      render(<GlobalFooter />);
      
      const termsLink = screen.getByText('Terms of Service');
      expect(termsLink).toHaveAttribute('href', '/terms');
      
      // クリック動作をテスト
      const originalLocation = window.location;
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });
      
      fireEvent.click(termsLink);
      expect(mockLocation.href).toBe('/terms');
      
      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });
  });
});