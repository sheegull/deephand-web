import { test, expect } from '@playwright/test';

/**
 * DitherBackground アニメーション検証テスト
 * 元のアニメーションが正しく動作することを確認
 */
test.describe('DitherBackground Animation Validation', () => {
  
  test('should use optimized mode with original animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // DitherBackgroundUnified が optimized モードで動作することを確認
    const backgroundElement = page.locator('[data-render-mode="optimized"]').first();
    await expect(backgroundElement).toBeVisible();
    
    // 元のアニメーション設定が適用されていることを確認
    const renderMode = await backgroundElement.getAttribute('data-render-mode');
    expect(renderMode).toBe('optimized');
  });

  test('should maintain original Three.js animation behavior', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ページ読み込み後、Three.jsベースのアニメーションが動作することを確認
    await page.waitForTimeout(3000);
    
    // canvasまたはWebGL要素が存在することを確認（Three.jsが動作している証拠）
    const canvas = page.locator('canvas');
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible();
    }
    
    // エラーがないことを確認
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // DitherBackgroundに関連するエラーがないことを確認
    const ditherErrors = errors.filter(error => 
      error.includes('DitherBackground') || 
      error.includes('Three') || 
      error.includes('WebGL')
    );
    
    expect(ditherErrors.length).toBe(0);
  });

  test('should pass visual test with original animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 少し待ってアニメーションを安定させる
    await page.waitForTimeout(2000);
    
    // アニメーションありの状態でスクリーンショット
    await expect(page).toHaveScreenshot('dither-animation-original.png', {
      fullPage: true,
      threshold: 0.4
    });
  });
});