import { test, expect } from '@playwright/test';

/**
 * 最終リファクタリング検証テスト
 * Phase 1-4 の全ての変更が正しく動作することを確認
 */
test.describe('Final Refactoring Validation', () => {
  
  test('should load homepage with all optimizations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // DitherBackgroundUnified が正しく動作することを確認
    const backgroundElement = page.locator('[data-render-mode]').first();
    await expect(backgroundElement).toBeVisible();
    
    // リファクタリングされたHeroSection構造を確認
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-header"]')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should maintain performance after refactoring', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // 読み込み時間が5秒以内であることを確認
    expect(loadTime).toBeLessThan(5000);
    
    // ページが操作可能であることを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('should work correctly on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // モバイルでの表示確認
    await expect(page.locator('main')).toBeVisible();
    
    // レスポンシブデザインが正しく動作することを確認
    const header = page.locator('[data-testid="hero-header"]');
    await expect(header).toBeVisible();
  });

  test('should maintain all functionality after refactoring', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 基本的なナビゲーション機能
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // 言語切り替え（存在する場合）
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    if (await languageToggle.count() > 0) {
      await expect(languageToggle).toBeVisible();
    }
    
    // フォーム機能（存在する場合）
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await expect(form).toBeVisible();
    }
  });

  test('should pass final visual regression test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // アニメーションを無効化
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `
    });
    await page.waitForTimeout(1000);
    
    // 最終的なビジュアル確認
    await expect(page).toHaveScreenshot('final-refactoring-complete.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('should validate English page functionality', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    // 英語ページも正しく表示されることを確認
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
});