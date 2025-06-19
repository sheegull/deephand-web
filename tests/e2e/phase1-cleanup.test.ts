import { test, expect } from '@playwright/test';

/**
 * Phase 1 TDD: 冗長ファイル削除後の動作確認
 * DitherBackgroundUnified以外の削除による影響がないことを確認
 */
test.describe('Phase 1: Cleanup - Remove Redundant Files', () => {
  
  test('should work correctly after removing redundant DitherBackground files', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // DitherBackgroundUnified のみが使用されていることを確認
    const backgroundElement = page.locator('[data-render-mode]').first();
    await expect(backgroundElement).toBeVisible();
    
    // 削除された冗長ファイルが参照されていないことを確認
    const errorMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    // 削除後もエラーが発生していないことを確認
    const hasCleanupErrors = errorMessages.some(msg => 
      msg.includes('DitherBackgroundOptimized') ||
      msg.includes('DitherBackgroundLazy') ||
      msg.includes('DitherBackgroundMinimal') ||
      msg.includes('MetaBallsOptimized')
    );
    
    expect(hasCleanupErrors).toBe(false);
  });

  test('should maintain all functionality after cleanup', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ページの基本機能が正常に動作することを確認
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // 英語ページも正常に動作することを確認
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have reduced console debug messages', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // デバッグメッセージの数が削減されていることを確認
    const debugMessages = consoleMessages.filter(msg => 
      msg.type === 'log' && (
        msg.text.includes('console.log') ||
        msg.text.includes('debug:') ||
        msg.text.includes('[DEBUG]')
      )
    );
    
    // 開発中の一時的なデバッグメッセージが過度に多くないことを確認
    expect(debugMessages.length).toBeLessThan(10);
  });

  test('should pass visual regression test after cleanup', async ({ page }) => {
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
    
    // クリーンアップ後のビジュアル確認
    await expect(page).toHaveScreenshot('phase1-cleanup-complete.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });
});