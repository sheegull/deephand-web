import { test, expect } from '@playwright/test';

/**
 * Phase 1 TDD: DitherBackgroundUnified 統合テスト
 * HeroSectionでの実際の動作確認
 */
test.describe('Phase 1: DitherBackground Unified Implementation', () => {
  
  test('should load homepage with DitherBackgroundUnified', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // DitherBackground統合版が読み込まれることを確認
    const backgroundElement = page.locator('[data-render-mode]').first();
    await expect(backgroundElement).toBeVisible();
    
    // レンダリングモードを確認
    const renderMode = await backgroundElement.getAttribute('data-render-mode');
    expect(['simple', 'fallback', 'optimized']).toContain(renderMode);
  });

  test('should maintain visual consistency after refactoring', async ({ page }) => {
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
    
    // ビジュアル回帰テスト
    await expect(page).toHaveScreenshot('phase1-unified-homepage.png', {
      fullPage: true,
      threshold: 0.4,
      animations: 'disabled'
    });
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // モバイルでもDitherBackgroundが機能することを確認
    const backgroundElement = page.locator('[data-render-mode]').first();
    await expect(backgroundElement).toBeVisible();
    
    // モバイルでは軽量版が使用されることを期待
    const renderMode = await backgroundElement.getAttribute('data-render-mode');
    expect(['simple', 'fallback']).toContain(renderMode);
  });

  test('should handle performance gracefully', async ({ page }) => {
    // CPU throttlingをシミュレート
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 性能制限環境でも適切にフォールバックすることを確認
    const backgroundElement = page.locator('[data-render-mode]').first();
    await expect(backgroundElement).toBeVisible();
    
    // 5秒以内にページが操作可能になることを確認
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 });
  });

  test('should preserve all existing functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 既存のヘッダーナビゲーションが機能することを確認
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // コンタクトフォームが機能することを確認
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await expect(form).toBeVisible();
    }
    
    // ページの基本レイアウトが崩れていないことを確認
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });
});