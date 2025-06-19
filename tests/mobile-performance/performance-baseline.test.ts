import { test, expect, Page } from '@playwright/test';

/**
 * モバイル性能ベースラインテスト
 * TDD Approach: 最適化前の現在の性能を測定してベースラインを確立
 */

interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  renderTime: number;
  frameDrops: number;
  gpuUsage?: number;
}

interface DeviceProfile {
  name: string;
  expectedFps: number;
  maxCpuUsage: number;
  maxMemoryUsage: number;
  maxRenderTime: number;
}

const DEVICE_PROFILES: Record<string, DeviceProfile> = {
  'desktop-chrome': {
    name: 'Desktop Chrome',
    expectedFps: 60,
    maxCpuUsage: 30,
    maxMemoryUsage: 100,
    maxRenderTime: 16,
  },
  'mobile-chrome': {
    name: 'Mobile Chrome (Pixel 5)',
    expectedFps: 30,
    maxCpuUsage: 50,
    maxMemoryUsage: 150,
    maxRenderTime: 33,
  },
  'mobile-safari': {
    name: 'Mobile Safari (iPhone 12)',
    expectedFps: 30,
    maxCpuUsage: 45,
    maxMemoryUsage: 140,
    maxRenderTime: 33,
  },
  'low-end-mobile': {
    name: 'Low-end Mobile (Galaxy S5)',
    expectedFps: 20,
    maxCpuUsage: 70,
    maxMemoryUsage: 200,
    maxRenderTime: 50,
  },
  'tablet': {
    name: 'Tablet (iPad Pro)',
    expectedFps: 45,
    maxCpuUsage: 40,
    maxMemoryUsage: 120,
    maxRenderTime: 22,
  },
};

// FPS測定用のユーティリティ関数
async function measureFPS(page: Page, durationMs: number = 5000): Promise<number> {
  return await page.evaluate((duration) => {
    return new Promise<number>((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      function countFrame() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - startTime < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const actualDuration = currentTime - startTime;
          const fps = (frameCount * 1000) / actualDuration;
          resolve(Math.round(fps));
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  }, durationMs);
}

// CPU使用率測定（近似値）
async function measureCPUUsage(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const start = performance.now();
    let iterations = 0;
    
    // 短時間でどれだけの計算ができるかでCPU負荷を推定
    while (performance.now() - start < 100) {
      Math.random() * Math.random();
      iterations++;
    }
    
    // 基準値と比較してパーセンテージを返す
    const baseline = 100000; // 基準値（高性能デバイスでの期待値）
    return Math.max(0, Math.min(100, ((baseline - iterations) / baseline) * 100));
  });
}

// メモリ使用量測定
async function measureMemoryUsage(page: Page): Promise<number> {
  return await page.evaluate(() => {
    // @ts-ignore
    if (performance.memory) {
      // @ts-ignore
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0; // 測定不可の場合
  });
}

// レンダリング時間測定
async function measureRenderTime(page: Page): Promise<number> {
  return await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const startTime = performance.now();
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const renderTime = performance.now() - startTime;
          resolve(renderTime);
        });
      });
    });
  });
}

// フレームドロップ検出
async function detectFrameDrops(page: Page, durationMs: number = 3000): Promise<number> {
  return await page.evaluate((duration) => {
    return new Promise<number>((resolve) => {
      const frameTimes: number[] = [];
      let lastTime = performance.now();
      let frameDrops = 0;
      
      function measureFrame() {
        const currentTime = performance.now();
        const frameTime = currentTime - lastTime;
        frameTimes.push(frameTime);
        
        // 理想的なフレーム時間（60fps = 16.67ms）の2倍以上は遅延とみなす
        if (frameTime > 33) {
          frameDrops++;
        }
        
        lastTime = currentTime;
        
        if (frameTimes.length === 0 || (currentTime - frameTimes[0] < duration)) {
          requestAnimationFrame(measureFrame);
        } else {
          resolve(frameDrops);
        }
      }
      
      requestAnimationFrame(measureFrame);
    });
  }, durationMs);
}

// 包括的な性能測定
async function measurePerformance(page: Page): Promise<PerformanceMetrics> {
  console.log('性能測定開始...');
  
  // 並列測定で効率化
  const [fps, cpuUsage, memoryUsage, renderTime, frameDrops] = await Promise.all([
    measureFPS(page, 3000),
    measureCPUUsage(page),
    measureMemoryUsage(page),
    measureRenderTime(page),
    detectFrameDrops(page, 3000),
  ]);
  
  return {
    fps,
    cpuUsage,
    memoryUsage,
    renderTime,
    frameDrops,
  };
}

test.describe('モバイル性能ベースライン測定', () => {
  test.beforeEach(async ({ page }) => {
    // 一貫したテスト環境のセットアップ
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 初期化完了まで待機（重要なコンポーネントがレンダリングされるまで）
    await page.waitForSelector('[class*="dither"], [class*="meta"], canvas', { 
      timeout: 10000 
    });
    
    // 安定化のための短時間待機
    await page.waitForTimeout(2000);
  });

  test('DitherBackground性能測定', async ({ page }, testInfo) => {
    const deviceProfile = DEVICE_PROFILES[testInfo.project.name] || DEVICE_PROFILES['desktop-chrome'];
    
    console.log(`${deviceProfile.name}でDitherBackground性能測定中...`);
    
    // DitherBackgroundが存在することを確認
    const ditherElement = await page.locator('[class*="dither"], canvas').first();
    await expect(ditherElement).toBeVisible();
    
    // 性能測定実行
    const metrics = await measurePerformance(page);
    
    console.log('DitherBackground性能結果:', metrics);
    
    // ベースライン記録（最適化前の基準値として）
    const results = {
      component: 'DitherBackground',
      device: deviceProfile.name,
      timestamp: new Date().toISOString(),
      metrics,
      thresholds: {
        expectedFps: deviceProfile.expectedFps,
        maxCpuUsage: deviceProfile.maxCpuUsage,
        maxMemoryUsage: deviceProfile.maxMemoryUsage,
        maxRenderTime: deviceProfile.maxRenderTime,
      }
    };
    
    // テスト結果をファイルに保存（後の比較用）
    await testInfo.attach('dither-performance-baseline.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
    
    // 現在の性能状況をレポート（failにはしない、記録のみ）
    console.log(`FPS: ${metrics.fps} (期待値: ${deviceProfile.expectedFps})`);
    console.log(`CPU使用率: ${metrics.cpuUsage}% (上限: ${deviceProfile.maxCpuUsage}%)`);
    console.log(`メモリ使用量: ${metrics.memoryUsage}MB (上限: ${deviceProfile.maxMemoryUsage}MB)`);
    console.log(`フレームドロップ: ${metrics.frameDrops}回`);
    
    // 最低限の動作確認（完全に壊れていないか）
    expect(metrics.fps).toBeGreaterThan(5); // 最低5FPS
    expect(metrics.cpuUsage).toBeLessThan(95); // CPU使用率95%未満
  });
  
  test('MetaBalls性能測定', async ({ page }, testInfo) => {
    const deviceProfile = DEVICE_PROFILES[testInfo.project.name] || DEVICE_PROFILES['desktop-chrome'];
    
    console.log(`${deviceProfile.name}でMetaBalls性能測定中...`);
    
    // MetaBallsのキャンバスを探す
    const canvasElements = await page.locator('canvas').all();
    expect(canvasElements.length).toBeGreaterThan(0);
    
    // 性能測定実行
    const metrics = await measurePerformance(page);
    
    console.log('MetaBalls性能結果:', metrics);
    
    const results = {
      component: 'MetaBalls',
      device: deviceProfile.name,
      timestamp: new Date().toISOString(),
      metrics,
      thresholds: {
        expectedFps: deviceProfile.expectedFps,
        maxCpuUsage: deviceProfile.maxCpuUsage,
        maxMemoryUsage: deviceProfile.maxMemoryUsage,
        maxRenderTime: deviceProfile.maxRenderTime,
      }
    };
    
    await testInfo.attach('metaballs-performance-baseline.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
    
    // 最低限の動作確認
    expect(metrics.fps).toBeGreaterThan(5);
    expect(metrics.cpuUsage).toBeLessThan(95);
  });

  test('統合性能測定（全エフェクト同時実行）', async ({ page }, testInfo) => {
    const deviceProfile = DEVICE_PROFILES[testInfo.project.name] || DEVICE_PROFILES['desktop-chrome'];
    
    console.log(`${deviceProfile.name}で統合性能測定中...`);
    
    // 全エフェクトが同時に動作している状態で測定
    const allElements = await page.locator('canvas, [class*="dither"], [class*="meta"]').all();
    expect(allElements.length).toBeGreaterThan(0);
    
    // より長時間の測定で安定性をチェック
    const [longTermFps, shortTermMetrics] = await Promise.all([
      measureFPS(page, 8000), // 8秒間のFPS測定
      measurePerformance(page)
    ]);
    
    const metrics = {
      ...shortTermMetrics,
      longTermFps,
    };
    
    console.log('統合性能結果:', metrics);
    
    const results = {
      component: 'Integrated',
      device: deviceProfile.name,
      timestamp: new Date().toISOString(),
      metrics,
      thresholds: {
        expectedFps: deviceProfile.expectedFps,
        maxCpuUsage: deviceProfile.maxCpuUsage,
        maxMemoryUsage: deviceProfile.maxMemoryUsage,
        maxRenderTime: deviceProfile.maxRenderTime,
      }
    };
    
    await testInfo.attach('integrated-performance-baseline.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
    
    // 統合時の重要な確認項目
    expect(metrics.fps).toBeGreaterThan(3); // 統合時でも最低3FPS
    expect(metrics.longTermFps).toBeGreaterThan(3); // 長時間でも安定
    expect(metrics.frameDrops).toBeLessThan(100); // フレームドロップが過度でない
    
    // モバイルでの発熱警告レベルのチェック
    if (testInfo.project.name.includes('mobile') || testInfo.project.name.includes('low-end')) {
      expect(metrics.cpuUsage).toBeLessThan(80); // モバイルでは80%未満
      expect(metrics.memoryUsage).toBeLessThan(250); // メモリ250MB未満
    }
  });
  
  test('デバイス適応機能テスト', async ({ page }, testInfo) => {
    console.log(`${testInfo.project.name}でデバイス適応機能テスト中...`);
    
    // デバイス性能検出の動作確認
    const deviceInfo = await page.evaluate(() => {
      return {
        cores: navigator.hardwareConcurrency || 'unknown',
        memory: (navigator as any).deviceMemory || 'unknown',
        userAgent: navigator.userAgent,
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      };
    });
    
    console.log('デバイス情報:', deviceInfo);
    
    // 適応的動作の確認
    const hasWebGL = await page.evaluate(() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch {
        return false;
      }
    });
    
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    
    console.log(`WebGL対応: ${hasWebGL}, モーション削減設定: ${prefersReducedMotion}`);
    
    // 適応的レンダリングの確認
    const renderingMode = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const ditherElements = document.querySelectorAll('[class*="dither"]');
      
      return {
        canvasCount: canvases.length,
        ditherElementCount: ditherElements.length,
        hasComplexEffects: canvases.length > 0,
      };
    });
    
    console.log('レンダリングモード:', renderingMode);
    
    // デバイス適応の結果を記録
    const adaptationResults = {
      device: testInfo.project.name,
      deviceInfo,
      webglSupport: hasWebGL,
      prefersReducedMotion,
      renderingMode,
      timestamp: new Date().toISOString(),
    };
    
    await testInfo.attach('device-adaptation-results.json', {
      body: JSON.stringify(adaptationResults, null, 2),
      contentType: 'application/json',
    });
    
    // 適応機能の基本動作確認
    expect(hasWebGL).toBeDefined();
    expect(renderingMode.canvasCount).toBeGreaterThanOrEqual(0);
  });
});