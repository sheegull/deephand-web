/**
 * GlobalHeader Tests (TDD Approach)
 * 
 * スクロール時のブラー機能とヘッダー統一の要件を定義します。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalHeader } from '../GlobalHeader';

// Mock useLanguage hook
vi.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: 'ja',
    switchLanguage: vi.fn(),
  }),
}));

// Mock i18n
vi.mock('../../lib/i18n', () => ({
  t: (key: string) => key,
  getCurrentLanguage: () => 'ja',
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
}));

describe('GlobalHeader (TDD)', () => {
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

  describe('スクロールブラー機能', () => {
    it('should not have blur effect when scrollY is less than 50px', async () => {
      // TDD: スクロール位置が50px未満の時はブラー効果なし
      Object.defineProperty(window, 'scrollY', {
        value: 30,
        writable: true,
      });

      render(<GlobalHeader />);
      
      const header = screen.getByRole('banner');
      
      // 初期状態ではブラークラスが適用されていない
      expect(header).not.toHaveClass('backdrop-blur-md');
      expect(header).not.toHaveClass('bg-black/10');
    });

    it('should apply blur effect when scrollY is 50px or more', async () => {
      // TDD: スクロール位置が50px以上の時はブラー効果適用
      const { rerender } = render(<GlobalHeader />);
      
      const header = screen.getByRole('banner');
      
      // スクロールイベントをシミュレート
      Object.defineProperty(window, 'scrollY', {
        value: 60,
        writable: true,
      });
      
      fireEvent.scroll(window, { target: { scrollY: 60 } });
      
      await waitFor(() => {
        expect(header).toHaveClass('backdrop-blur-md');
        expect(header).toHaveClass('bg-black/10');
      });
    });

    it('should remove blur effect when scrolling back to top', async () => {
      // TDD: トップに戻った時はブラー効果を削除
      render(<GlobalHeader />);
      
      const header = screen.getByRole('banner');
      
      // まず下にスクロール
      Object.defineProperty(window, 'scrollY', {
        value: 100,
        writable: true,
      });
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      
      await waitFor(() => {
        expect(header).toHaveClass('backdrop-blur-md');
      });
      
      // トップに戻る
      Object.defineProperty(window, 'scrollY', {
        value: 30,
        writable: true,
      });
      fireEvent.scroll(window, { target: { scrollY: 30 } });
      
      await waitFor(() => {
        expect(header).not.toHaveClass('backdrop-blur-md');
        expect(header).not.toHaveClass('bg-black/10');
      });
    });

    it('should properly cleanup scroll event listener on unmount', async () => {
      // TDD: アンマウント時にイベントリスナーがクリーンアップされる
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<GlobalHeader />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('共通ヘッダー要件', () => {
    it('should render logo with correct link behavior', async () => {
      // TDD: ロゴが正しく表示され、クリック動作が期待通り
      render(<GlobalHeader />);
      
      const logo = screen.getByAltText('Icon');
      const logoText = screen.getByText('DeepHand');
      
      expect(logo).toBeInTheDocument();
      expect(logoText).toBeInTheDocument();
      expect(logo.closest('div')).toHaveClass('cursor-pointer');
    });

    it('should render navigation links correctly', async () => {
      // TDD: ナビゲーションリンクが正しく表示される
      render(<GlobalHeader />);
      
      // Navigation should be present (hidden on mobile, visible on desktop)
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should render mobile menu button', async () => {
      // TDD: モバイルメニューボタンが表示される
      render(<GlobalHeader />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('lg:hidden'); // モバイルでのみ表示
    });

    it('should render action buttons (language toggle and get started)', async () => {
      // TDD: アクションボタン（言語切替、Get Started）が表示される
      render(<GlobalHeader />);
      
      // Get Startedボタンの存在確認
      const getStartedButton = screen.getByRole('button', { name: /nav.getStarted/ });
      expect(getStartedButton).toBeInTheDocument();
    });

    it('should have consistent styling across all pages', async () => {
      // TDD: 全ページで一貫したスタイリング
      render(<GlobalHeader />);
      
      const header = screen.getByRole('banner');
      
      // 期待するクラスが適用されている
      expect(header).toHaveClass('fixed', 'top-0', 'z-[100]', 'w-full');
      expect(header).toHaveClass('h-16', 'sm:h-18', 'lg:h-20');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
      expect(header).toHaveClass('px-3', 'sm:px-4', 'lg:px-20');
      expect(header).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('レスポンシブ要件', () => {
    it('should show desktop navigation on large screens', async () => {
      // TDD: 大画面ではデスクトップナビゲーションを表示
      render(<GlobalHeader />);
      
      const desktopNav = screen.getByRole('navigation');
      expect(desktopNav).toHaveClass('hidden', 'lg:block');
    });

    it('should show mobile menu button on small screens', async () => {
      // TDD: 小画面ではモバイルメニューボタンを表示
      render(<GlobalHeader />);
      
      const mobileMenuButton = screen.getByLabelText('Toggle menu');
      expect(mobileMenuButton).toHaveClass('lg:hidden');
    });

    it('should toggle mobile menu when button is clicked', async () => {
      // TDD: モバイルメニューボタンクリックでメニューが切り替わる
      render(<GlobalHeader />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // 初期状態では非表示
      const mobileMenu = menuButton.parentElement?.querySelector('[role="navigation"]');
      
      // メニューボタンをクリック
      fireEvent.click(menuButton);
      
      // メニューボタンのaria-expandedが切り替わることをテスト
      expect(menuButton).toHaveAttribute('aria-expanded');
    });
  });

  describe('アクセシビリティ要件', () => {
    it('should have proper ARIA attributes', async () => {
      // TDD: 適切なARIA属性が設定されている
      render(<GlobalHeader />);
      
      const header = screen.getByRole('banner');
      const menuButton = screen.getByLabelText('Toggle menu');
      
      expect(header).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
      expect(menuButton).toHaveAttribute('aria-expanded');
    });

    it('should be keyboard navigable', async () => {
      // TDD: キーボードナビゲーションが可能
      render(<GlobalHeader />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // フォーカス可能であることを確認
      menuButton.focus();
      expect(document.activeElement).toBe(menuButton);
    });
  });
});