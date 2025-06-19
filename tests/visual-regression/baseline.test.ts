import { test, expect } from '@playwright/test';

/**
 * ビジュアル回帰テスト - ベースライン確立
 * リファクタリング前のスクリーンショットを保存
 */
test.describe('Visual Regression - Baseline', () => {
  
  test('Homepage - Before Refactoring', async ({ page }) => {
    await page.goto('/');
    
    // ページが完全に読み込まれるまで待機
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
    
    // 安定するまで待機
    await page.waitForTimeout(2000);
    
    // フルページスクリーンショット
    await expect(page).toHaveScreenshot('homepage-before-refactoring.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('Homepage Desktop - Key Sections', async ({ page }) => {
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
    await page.waitForTimeout(2000);
    
    // ヘッダーセクション
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header-before-refactoring.png', {
      animations: 'disabled',
      threshold: 0.3
    });
    
    // メインヒーローセクション
    const heroMain = page.locator('main').first();
    await expect(heroMain).toHaveScreenshot('hero-main-before-refactoring.png', {
      animations: 'disabled',
      threshold: 0.3
    });
  });

  test('Homepage Mobile - Responsive Check', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
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
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('homepage-mobile-before-refactoring.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('English Homepage - i18n Check', async ({ page }) => {
    await page.goto('/en');
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
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('homepage-en-before-refactoring.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });
});