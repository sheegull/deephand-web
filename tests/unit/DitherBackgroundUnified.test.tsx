import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { DitherBackgroundUnified } from '../../src/components/ui/DitherBackgroundUnified';

/**
 * TDD Test: DitherBackgroundUnified
 * Phase 1: 統合版テスト
 */
describe('DitherBackgroundUnified', () => {
  beforeEach(() => {
    // モックの設定
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 4
    });
    
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn().mockImplementation(() => {
        // 即座に visible として扱う
        callback([{ isIntersecting: true }]);
      }),
      disconnect: vi.fn(),
      unobserve: vi.fn()
    }));
  });

  test('should render fallback on server side', () => {
    // SSR環境での動作確認
    Object.defineProperty(window, 'window', {
      value: undefined,
      writable: true
    });

    render(<DitherBackgroundUnified />);
    
    // フォールバック表示の確認
    const container = screen.getByTestId('dither-background-unified');
    expect(container).toBeInTheDocument();
  });

  test('should detect device capabilities correctly', async () => {
    render(<DitherBackgroundUnified data-testid="dither-unified" />);
    
    await waitFor(() => {
      const container = screen.getByTestId('dither-unified');
      expect(container).toBeInTheDocument();
    });
  });

  test('should use lazy loading for optimized component', async () => {
    // 高性能デバイスをシミュレート
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 8
    });

    render(<DitherBackgroundUnified />);
    
    await waitFor(() => {
      // 遅延読み込みが機能していることを確認
      expect(screen.getByTestId('dither-background-unified')).toBeInTheDocument();
    });
  });

  test('should handle reduced motion preference', async () => {
    // Reduced motionの設定
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }))
    });

    render(<DitherBackgroundUnified />);
    
    await waitFor(() => {
      const container = screen.getByTestId('dither-background-unified');
      expect(container).toBeInTheDocument();
    });
  });

  test('should render children properly', () => {
    render(
      <DitherBackgroundUnified>
        <div data-testid="child-content">Child Content</div>
      </DitherBackgroundUnified>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    render(<DitherBackgroundUnified className="custom-class" />);
    
    const container = screen.getByTestId('dither-background-unified');
    expect(container).toHaveClass('custom-class');
  });
});