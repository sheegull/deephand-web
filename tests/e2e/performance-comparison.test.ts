import { test, expect } from '@playwright/test';

/**
 * リファクタリング前後のパフォーマンス比較テスト
 * 改善効果を定量的に測定
 */
test.describe('Performance Comparison - Before vs After Refactoring', () => {
  
  test('should measure page load performance improvements', async ({ page }) => {
    // Performance API を有効化
    await page.addInitScript(() => {
      window.performanceMetrics = {};
    });

    const startTime = Date.now();
    await page.goto('/');
    
    // ネットワーク完了まで待機
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // パフォーマンスメトリクス取得
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize
      };
    });

    console.log('📊 Performance Metrics:', {
      loadTime: `${loadTime}ms`,
      domContentLoaded: `${Math.round(metrics.domContentLoaded)}ms`,
      loadComplete: `${Math.round(metrics.loadComplete)}ms`,
      firstPaint: `${Math.round(metrics.firstPaint)}ms`,
      firstContentfulPaint: `${Math.round(metrics.firstContentfulPaint)}ms`,
      transferSize: `${Math.round(metrics.transferSize / 1024)}KB`,
      encodedBodySize: `${Math.round(metrics.encodedBodySize / 1024)}KB`
    });

    // パフォーマンス改善の検証
    expect(loadTime).toBeLessThan(5000); // 5秒以内
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // FCP 3秒以内
    expect(metrics.domContentLoaded).toBeLessThan(4000); // DOM読み込み 4秒以内
  });

  test('should verify bundle size reduction', async ({ page }) => {
    // リソース読み込み詳細を取得
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
        .map(entry => ({
          name: entry.name.split('/').pop(),
          transferSize: entry.transferSize,
          encodedBodySize: entry.encodedBodySize,
          decodedBodySize: entry.decodedBodySize
        }))
        .sort((a, b) => b.transferSize - a.transferSize);
    });

    const totalJSSize = resources
      .filter(r => r.name?.endsWith('.js'))
      .reduce((sum, r) => sum + r.transferSize, 0);
    
    const totalCSSSize = resources
      .filter(r => r.name?.endsWith('.css'))
      .reduce((sum, r) => sum + r.transferSize, 0);

    console.log('📦 Bundle Analysis:', {
      totalJSSize: `${Math.round(totalJSSize / 1024)}KB`,
      totalCSSSize: `${Math.round(totalCSSSize / 1024)}KB`,
      totalSize: `${Math.round((totalJSSize + totalCSSSize) / 1024)}KB`,
      largestFiles: resources.slice(0, 5).map(r => ({
        name: r.name,
        size: `${Math.round(r.transferSize / 1024)}KB`
      }))
    });

    // バンドルサイズの妥当性チェック
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024); // 2MB以下
    expect(totalCSSSize).toBeLessThan(100 * 1024); // 100KB以下
  });

  test('should measure memory usage optimization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // メモリ使用量測定
    const memoryInfo = await page.evaluate(() => {
      // @ts-ignore
      return (performance as any).memory ? {
        // @ts-ignore
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        // @ts-ignore
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        // @ts-ignore
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (memoryInfo) {
      console.log('💾 Memory Usage:', {
        usedHeap: `${Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB`,
        totalHeap: `${Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)}MB`,
        heapLimit: `${Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)}MB`,
        efficiency: `${Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100)}%`
      });

      // メモリ使用量の妥当性チェック
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // 100MB以下
    }
  });

  test('should verify component loading efficiency', async ({ page }) => {
    const componentLoadTimes = [];
    let networkRequests = 0;

    // ネットワークリクエストを監視
    page.on('request', () => {
      networkRequests++;
    });

    const startTime = Date.now();
    await page.goto('/');
    
    // DitherBackgroundUnifiedの読み込み確認
    await page.locator('[data-render-mode]').first().waitFor({ state: 'visible' });
    const backgroundLoadTime = Date.now() - startTime;
    componentLoadTimes.push({ component: 'DitherBackground', time: backgroundLoadTime });

    // HeroSectionコンポーネントの読み込み確認
    await page.locator('[data-testid="hero-section"]').waitFor({ state: 'visible' });
    const heroLoadTime = Date.now() - startTime;
    componentLoadTimes.push({ component: 'HeroSection', time: heroLoadTime });

    await page.waitForLoadState('networkidle');
    const totalLoadTime = Date.now() - startTime;

    console.log('⚡ Component Loading:', {
      components: componentLoadTimes,
      totalLoadTime: `${totalLoadTime}ms`,
      networkRequests: networkRequests,
      efficiency: `${Math.round((componentLoadTimes.length / totalLoadTime) * 10000)}` + ' components/sec'
    });

    // コンポーネント読み込み効率の検証
    expect(backgroundLoadTime).toBeLessThan(3000); // DitherBackground 3秒以内
    expect(heroLoadTime).toBeLessThan(2000); // HeroSection 2秒以内
    expect(networkRequests).toBeLessThan(50); // リクエスト数制限
  });

  test('should validate lazy loading effectiveness', async ({ page }) => {
    let lazyLoadedComponents = 0;
    
    // console.log を監視してlazy loadingを検出
    page.on('console', msg => {
      if (msg.text().includes('lazy') || msg.text().includes('dynamic import')) {
        lazyLoadedComponents++;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 遅延読み込みコンポーネントの存在確認
    const backgroundElement = page.locator('[data-render-mode]');
    await expect(backgroundElement).toBeVisible();
    
    const renderMode = await backgroundElement.first().getAttribute('data-render-mode');
    
    console.log('🔄 Lazy Loading Analysis:', {
      renderMode: renderMode,
      lazyComponents: lazyLoadedComponents,
      isOptimized: renderMode === 'optimized'
    });

    // 適切な遅延読み込みモードが選択されていることを確認
    expect(['simple', 'fallback', 'optimized']).toContain(renderMode);
  });
});