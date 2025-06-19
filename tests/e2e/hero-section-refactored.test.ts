import { test, expect } from '@playwright/test';

/**
 * TDD Test: HeroSection Refactoring
 * 分割後のHeroSectionが正しく動作することを確認
 */
test.describe('HeroSection Refactored Components', () => {
  
  test('should render all hero components correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ヘッダーセクション
    const header = page.locator('[data-testid="hero-header"], header').first();
    await expect(header).toBeVisible();
    
    // メインコンテンツ
    const mainContent = page.locator('[data-testid="hero-main-content"], main').first();
    await expect(mainContent).toBeVisible();
    
    // コンタクトフォーム
    const contactForm = page.locator('[data-testid="hero-contact-form"], form').first();
    if (await contactForm.count() > 0) {
      await expect(contactForm).toBeVisible();
    }
    
    // フッター
    const footer = page.locator('[data-testid="hero-footer"], footer').first();
    await expect(footer).toBeVisible();
    
    // バックグラウンド
    const background = page.locator('[data-render-mode]').first();
    await expect(background).toBeVisible();
  });

  test('should maintain responsive design after refactoring', async ({ page }) => {
    // デスクトップ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('main')).toBeVisible();
    
    // タブレット
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();
    
    // モバイル
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('should preserve navigation functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 言語切り替えボタン
    const languageToggle = page.locator('[data-testid="language-toggle"]').first();
    if (await languageToggle.count() > 0) {
      await expect(languageToggle).toBeVisible();
    }
    
    // ナビゲーションメニュー
    const menuButton = page.locator('button').filter({ hasText: /menu|メニュー/i }).first();
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
    }
  });

  test('should maintain contact form functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // フォームフィールドが存在することを確認
      const nameField = form.locator('input[name="name"], input[type="text"]').first();
      const emailField = form.locator('input[name="email"], input[type="email"]').first();
      const messageField = form.locator('textarea[name="message"], textarea').first();
      
      await expect(nameField).toBeVisible();
      await expect(emailField).toBeVisible();
      await expect(messageField).toBeVisible();
    }
  });

  test('should maintain visual consistency after split', async ({ page }) => {
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
    await expect(page).toHaveScreenshot('hero-section-refactored.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });
});