import { test, expect } from '@playwright/test';

/**
 * 手動での性能検証テスト
 * TDD Approach: 実際の最適化コンポーネントの動作確認
 */

test.describe('手動性能検証', () => {
  test.beforeEach(async ({ page }) => {
    // コンソールエラーをキャプチャ
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // ネットワークエラーをキャプチャ
    page.on('response', (response) => {
      if (!response.ok()) {
        console.log(`Network error: ${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('基本的な表示確認', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/DeepHand/);
    
    // ヘッダーの存在確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // ロゴの確認
    const logo = page.locator('img[alt="Icon"]');
    await expect(logo).toBeVisible();
    
    // メインコンテンツの確認
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    console.log('✅ 基本的な表示要素は正常に表示されています');
  });

  test('WebGL対応状況の確認', async ({ page }) => {
    const webglInfo = await page.evaluate(() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return { supported: false };
        
        return {
          supported: true,
          renderer: gl.getParameter(gl.RENDERER),
          vendor: gl.getParameter(gl.VENDOR),
          version: gl.getParameter(gl.VERSION),
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        };
      } catch (error) {
        return {
          supported: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    });
    
    console.log('WebGL情報:', webglInfo);
    expect(webglInfo.supported).toBeDefined();
  });

  test('デバイス情報の取得', async ({ page }, testInfo) => {
    const deviceInfo = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        languages: navigator.languages,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
        },
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      };
    });
    
    console.log(`${testInfo.project.name} デバイス情報:`, deviceInfo);
    
    // テストプロジェクト名に応じた期待値の確認
    if (testInfo.project.name.includes('mobile')) {
      console.log('📱 モバイルデバイスとして認識されました');
    } else if (testInfo.project.name.includes('desktop')) {
      console.log('🖥️ デスクトップデバイスとして認識されました');
    }
    
    // 基本的な情報の存在確認
    expect(deviceInfo.userAgent).toBeTruthy();
    expect(deviceInfo.viewport.width).toBeGreaterThan(0);
    expect(deviceInfo.viewport.height).toBeGreaterThan(0);
  });

  test('現在の背景エフェクトの状態確認', async ({ page }) => {
    // 少し待ってからエフェクトをチェック
    await page.waitForTimeout(3000);
    
    const backgroundInfo = await page.evaluate(() => {
      // Canvas要素の検索
      const canvases = Array.from(document.querySelectorAll('canvas'));
      const canvasInfo = canvases.map((canvas, i) => ({
        index: i,
        width: canvas.width,
        height: canvas.height,
        visible: canvas.offsetParent !== null,
        style: canvas.style.cssText,
        className: canvas.className,
        parentElement: canvas.parentElement?.tagName,
        parentClass: canvas.parentElement?.className,
      }));
      
      // Three.js関連要素の検索
      const scripts = Array.from(document.querySelectorAll('script')).filter(
        script => script.src.includes('three') || script.textContent?.includes('THREE')
      );
      
      // DitherBackground関連の検索
      const ditherElements = Array.from(document.querySelectorAll('*')).filter(
        elem => elem.className && typeof elem.className === 'string' && 
        elem.className.toLowerCase().includes('dither')
      );
      
      // エラーチェック
      const hasThreeJSErrors = Array.from(document.querySelectorAll('*')).some(
        elem => elem.textContent?.includes('THREE is not defined')
      );
      
      return {
        canvasCount: canvases.length,
        canvasInfo,
        threeJSScripts: scripts.length,
        ditherElements: ditherElements.length,
        hasThreeJSErrors,
        documentReady: document.readyState,
      };
    });
    
    console.log('背景エフェクト状態:', backgroundInfo);
    
    // レポート生成
    if (backgroundInfo.canvasCount === 0) {
      console.log('⚠️ Canvas要素が見つかりません - 背景エフェクトが読み込まれていない可能性があります');
    } else {
      console.log(`✅ ${backgroundInfo.canvasCount}個のCanvas要素が見つかりました`);
    }
    
    if (backgroundInfo.hasThreeJSErrors) {
      console.log('❌ Three.js関連のエラーが検出されました');
    }
    
    // テスト結果のアタッチメント
    const report = {
      timestamp: new Date().toISOString(),
      testProject: test.info().project.name,
      backgroundInfo,
      status: backgroundInfo.canvasCount > 0 ? 'effects_active' : 'effects_inactive',
    };
    
    await test.info().attach('background-effect-status.json', {
      body: JSON.stringify(report, null, 2),
      contentType: 'application/json',
    });
  });

  test('基本的な性能メトリクス取得', async ({ page }, testInfo) => {
    // 性能測定開始
    const startTime = Date.now();
    
    // ページの基本的なパフォーマンス情報を取得
    const performanceInfo = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        navigation: navigation ? {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          firstByte: Math.round(navigation.responseStart - navigation.fetchStart),
        } : null,
        paint: paint.map(p => ({
          name: p.name,
          startTime: Math.round(p.startTime),
        })),
        memory: (performance as any).memory ? {
          usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
        } : null,
      };
    });
    
    console.log(`${testInfo.project.name} 性能情報:`, performanceInfo);
    
    // 簡易的なレスポンシブ性テスト
    const interactionTime = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const startTime = performance.now();
        
        // 短時間の計算タスクでレスポンシブ性をテスト
        requestAnimationFrame(() => {
          const endTime = performance.now();
          resolve(endTime - startTime);
        });
      });
    });
    
    console.log(`インタラクション応答時間: ${interactionTime.toFixed(2)}ms`);
    
    // 基本的な性能基準のチェック
    if (performanceInfo.navigation) {
      expect(performanceInfo.navigation.domContentLoaded).toBeLessThan(5000); // 5秒以内
      console.log(`✅ DOMContentLoaded: ${performanceInfo.navigation.domContentLoaded}ms`);
    }
    
    if (performanceInfo.memory) {
      expect(performanceInfo.memory.usedJSHeapSize).toBeLessThan(100); // 100MB未満
      console.log(`✅ メモリ使用量: ${performanceInfo.memory.usedJSHeapSize}MB`);
    }
    
    expect(interactionTime).toBeLessThan(50); // 50ms未満のレスポンス
    console.log(`✅ インタラクション応答性: ${interactionTime.toFixed(2)}ms`);
    
    // レポート生成
    const performanceReport = {
      timestamp: new Date().toISOString(),
      testProject: testInfo.project.name,
      testDuration: Date.now() - startTime,
      performanceInfo,
      interactionTime,
      summary: {
        domLoadTime: performanceInfo.navigation?.domContentLoaded || 0,
        memoryUsage: performanceInfo.memory?.usedJSHeapSize || 0,
        responsiveness: interactionTime,
      }
    };
    
    await testInfo.attach('basic-performance-metrics.json', {
      body: JSON.stringify(performanceReport, null, 2),
      contentType: 'application/json',
    });
  });

  test('最適化コンポーネントの性能テスト準備', async ({ page }) => {
    console.log('🧪 最適化コンポーネントのテスト準備中...');
    
    // 現在の状態をベースライン取得
    const baseline = await page.evaluate(() => {
      return {
        timestamp: Date.now(),
        canvasCount: document.querySelectorAll('canvas').length,
        hasErrors: document.querySelectorAll('[class*="error"]').length > 0,
        readyState: document.readyState,
        loadedResources: Array.from(document.querySelectorAll('script, link[rel="stylesheet"]')).length,
      };
    });
    
    console.log('現在のベースライン:', baseline);
    
    // 最適化の必要性を判定
    const needsOptimization = baseline.canvasCount === 0 || baseline.hasErrors;
    
    if (needsOptimization) {
      console.log('🔧 最適化が必要です - 背景エフェクトが正常に動作していません');
    } else {
      console.log('✅ 現在の実装は動作しています - 最適化版との比較が可能です');
    }
    
    // 次のステップの推奨事項
    const recommendations = [];
    
    if (baseline.canvasCount === 0) {
      recommendations.push('Three.js/Canvas要素の読み込み修正が必要');
    }
    
    if (baseline.hasErrors) {
      recommendations.push('エラーの修正が必要');
    }
    
    if (baseline.loadedResources < 10) {
      recommendations.push('リソースの読み込み確認が必要');
    }
    
    console.log('推奨事項:', recommendations);
    
    expect(baseline.readyState).toBe('complete');
    console.log('✅ ページの読み込みは完了しています');
  });
});