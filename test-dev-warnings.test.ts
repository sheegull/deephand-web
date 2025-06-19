/**
 * Development Environment Warnings Test
 * TDDアプローチで開発環境の警告を検証
 */

import { test, expect } from '@playwright/test';

test.describe('Development Environment Optimization', () => {
  test('should not show backup file warnings', async ({ page }) => {
    // ログ監視を開始
    const consoleMessages: string[] = [];
    const warningMessages: string[] = [];
    
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
      if (msg.type() === 'warning') {
        warningMessages.push(msg.text());
      }
    });

    // 開発サーバーにアクセス
    await page.goto('http://localhost:4321/');
    
    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle');
    
    // バックアップファイル警告がないことを確認
    const backupWarnings = warningMessages.filter(msg => 
      msg.includes('backup') || msg.includes('.backup')
    );
    
    expect(backupWarnings.length).toBe(0);
    
    console.log('✅ No backup file warnings found');
    if (warningMessages.length > 0) {
      console.log('📝 Remaining warnings:', warningMessages);
    }
  });

  test('should verify image service configuration', async ({ page }) => {
    // ページを読み込んで画像処理をテスト
    await page.goto('http://localhost:4321/');
    
    // 画像要素を確認
    const images = await page.locator('img').count();
    console.log(`📸 Found ${images} images on the page`);
    
    // コンソールでSharp関連の警告を確認
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('sharp') || msg.text().includes('Sharp')) {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log('📊 Image processing status:', {
      imagesFound: images,
      sharpMessages: consoleMessages.length
    });
  });

  test('should check overall performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // パフォーマンスメトリクスを取得
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
      };
    });
    
    console.log('⚡ Performance Metrics:', {
      ...metrics,
      clientSideLoadTime: loadTime
    });
    
    // 基本的なパフォーマンス期待値
    expect(loadTime).toBeLessThan(10000); // 10秒以内
    expect(metrics.totalLoadTime).toBeLessThan(8000); // 8秒以内
  });

  test('should verify development environment stability', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // 複数のページを確認
    const testPages = ['/', '/contact', '/test-phase1'];
    
    for (const pagePath of testPages) {
      console.log(`🔍 Testing page: ${pagePath}`);
      await page.goto(`http://localhost:4321${pagePath}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }
    
    // クリティカルエラーがないことを確認
    const criticalErrors = errors.filter(error => 
      !error.includes('Failed to load resource') && // 一般的なリソース読み込みエラーを除外
      !error.includes('net::ERR_') // ネットワークエラーを除外
    );
    
    console.log('📋 Development Environment Status:', {
      criticalErrors: criticalErrors.length,
      totalWarnings: warnings.length,
      pagesChecked: testPages.length
    });
    
    if (criticalErrors.length > 0) {
      console.log('❌ Critical errors found:', criticalErrors);
    }
    
    if (warnings.length > 0) {
      console.log('⚠️ Warnings found:', warnings);
    }
    
    expect(criticalErrors.length).toBe(0);
  });
});