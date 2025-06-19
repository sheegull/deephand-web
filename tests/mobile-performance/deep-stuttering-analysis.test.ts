/**
 * 残存カクつき根本原因分析
 * 軽量化・パフォーマンス維持したまま、カクつきの原因を完全特定
 */

import { test, expect } from '@playwright/test';

interface DeepPerformanceMetrics {
  // ブラウザレンダリングパイプライン
  layoutTime: number;
  paintTime: number;
  compositeTime: number;
  scriptTime: number;
  
  // メインスレッド分析
  mainThreadBlocking: number;
  longTasks: number[];
  taskCategories: { [key: string]: number };
  
  // メモリ・GC分析  
  heapUsed: number;
  gcPauses: number[];
  memoryPressure: boolean;
  
  // ネットワーク・リソース
  resourceLoadTime: number;
  cacheHitRate: number;
  
  // フレーム詳細分析
  frameTimings: number[];
  stutterEvents: Array<{
    timestamp: number;
    duration: number;
    cause: string;
  }>;
}

class DeepStutteringAnalyzer {
  constructor(private page: any) {}

  async enablePerformanceObserver(): Promise<void> {
    await this.page.evaluate(() => {
      window.performanceData = {
        layoutTime: 0,
        paintTime: 0,
        compositeTime: 0,
        scriptTime: 0,
        mainThreadBlocking: 0,
        longTasks: [],
        taskCategories: {},
        heapUsed: 0,
        gcPauses: [],
        memoryPressure: false,
        resourceLoadTime: 0,
        cacheHitRate: 0,
        frameTimings: [],
        stutterEvents: []
      };

      // Long Task API でメインスレッドブロッキングを検出
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const duration = entry.duration;
          window.performanceData.longTasks.push(duration);
          window.performanceData.mainThreadBlocking += duration;
          
          if (duration > 50) { // 50ms以上でカクつき
            window.performanceData.stutterEvents.push({
              timestamp: entry.startTime,
              duration: duration,
              cause: 'long-task'
            });
          }
        }
      }).observe({ entryTypes: ['longtask'] });

      // Layout/Paint/Composite 時間測定
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          switch (entry.name) {
            case 'layout':
              window.performanceData.layoutTime += entry.duration;
              break;
            case 'paint':
              window.performanceData.paintTime += entry.duration;
              break;
            case 'composite':
              window.performanceData.compositeTime += entry.duration;
              break;
          }
        }
      }).observe({ entryTypes: ['measure'] });

      // スクリプト実行時間測定
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name.includes('script') || entry.name.includes('javascript')) {
            window.performanceData.scriptTime += entry.duration;
          }
        }
      }).observe({ entryTypes: ['navigation', 'resource'] });

      // フレームタイミング詳細測定
      let lastFrameTime = performance.now();
      const measureFrame = () => {
        const now = performance.now();
        const frameDuration = now - lastFrameTime;
        window.performanceData.frameTimings.push(frameDuration);
        
        // 16.67ms (60fps) より大幅に遅い場合はカクつき
        if (frameDuration > 25) {
          window.performanceData.stutterEvents.push({
            timestamp: now,
            duration: frameDuration,
            cause: 'slow-frame'
          });
        }
        
        lastFrameTime = now;
        requestAnimationFrame(measureFrame);
      };
      requestAnimationFrame(measureFrame);

      // メモリ使用量監視
      if ((performance as any).memory) {
        setInterval(() => {
          const memInfo = (performance as any).memory;
          window.performanceData.heapUsed = memInfo.usedJSHeapSize;
          
          // メモリ圧迫検出
          const memoryPressure = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize > 0.9;
          if (memoryPressure !== window.performanceData.memoryPressure) {
            window.performanceData.memoryPressure = memoryPressure;
            if (memoryPressure) {
              window.performanceData.stutterEvents.push({
                timestamp: performance.now(),
                duration: 0,
                cause: 'memory-pressure'
              });
            }
          }
        }, 100);
      }
    });
  }

  async analyzeMainThreadTasks(): Promise<any> {
    return await this.page.evaluate(() => {
      // タスク分類分析
      const entries = performance.getEntriesByType('navigation');
      const resourceEntries = performance.getEntriesByType('resource');
      
      let scriptExecutionTime = 0;
      let styleRecalcTime = 0;
      let layoutTime = 0;
      let paintTime = 0;
      
      // Resource timing からスクリプト実行時間を推定
      resourceEntries.forEach(entry => {
        if (entry.name.includes('.js')) {
          scriptExecutionTime += entry.duration || 0;
        } else if (entry.name.includes('.css')) {
          styleRecalcTime += entry.duration || 0;
        }
      });

      return {
        scriptExecution: scriptExecutionTime,
        styleRecalc: styleRecalcTime,
        layout: layoutTime,
        paint: paintTime,
        longTaskCount: window.performanceData.longTasks.length,
        avgLongTaskDuration: window.performanceData.longTasks.length > 0 
          ? window.performanceData.longTasks.reduce((a, b) => a + b, 0) / window.performanceData.longTasks.length 
          : 0
      };
    });
  }

  async detectSpecificStutterCauses(): Promise<any> {
    return await this.page.evaluate(() => {
      const causes = {
        cssAnimationJank: 0,
        javascriptExecution: 0,
        layoutThrashing: 0,
        memoryGC: 0,
        networkStalls: 0
      };

      // CSS Animation カクつき検出
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      if (animatedElements.length > 0) {
        animatedElements.forEach(element => {
          const computedStyle = getComputedStyle(element);
          if (!computedStyle.transform.includes('translate3d')) {
            causes.cssAnimationJank++;
          }
        });
      }

      // Layout thrashing 検出
      const elementCount = document.querySelectorAll('*').length;
      if (elementCount > 1000) {
        causes.layoutThrashing = Math.floor(elementCount / 1000);
      }

      // JavaScript実行時間によるカクつき
      if (window.performanceData.scriptTime > 100) {
        causes.javascriptExecution = Math.floor(window.performanceData.scriptTime / 50);
      }

      // メモリ・GC関連
      if (window.performanceData.memoryPressure) {
        causes.memoryGC = 1;
      }

      return {
        causes,
        stutterEvents: window.performanceData.stutterEvents,
        frameTimings: window.performanceData.frameTimings.slice(-60), // 最新60フレーム
        mainThreadBlocking: window.performanceData.mainThreadBlocking
      };
    });
  }

  async measureRealTimePerformance(): Promise<DeepPerformanceMetrics> {
    await this.enablePerformanceObserver();
    
    // 5秒間のリアルタイム測定
    await this.page.waitForTimeout(5000);
    
    const mainThreadData = await this.analyzeMainThreadTasks();
    const stutterData = await this.detectSpecificStutterCauses();
    
    const metrics = await this.page.evaluate(() => {
      return window.performanceData;
    });

    return {
      ...metrics,
      ...mainThreadData,
      ...stutterData
    };
  }

  async analyzeCurrentImplementation(): Promise<any> {
    return await this.page.evaluate(() => {
      const analysis = {
        backgroundElements: 0,
        animationCount: 0,
        transformElements: 0,
        gpuAccelerated: 0,
        layoutConstraints: 0,
        eventListeners: 0
      };

      // 背景要素分析
      const backgrounds = document.querySelectorAll('.bg-\\[\\#1e1e1e\\], [class*="background"]');
      analysis.backgroundElements = backgrounds.length;

      backgrounds.forEach(element => {
        const computedStyle = getComputedStyle(element);
        
        // アニメーション検出
        if (computedStyle.animationName !== 'none') {
          analysis.animationCount++;
        }
        
        // Transform検出
        if (computedStyle.transform !== 'none') {
          analysis.transformElements++;
        }
        
        // GPU加速検出
        if (computedStyle.transform.includes('translate3d') || 
            computedStyle.transform.includes('translateZ')) {
          analysis.gpuAccelerated++;
        }
        
        // Layout制約検出
        if (computedStyle.contain !== 'none') {
          analysis.layoutConstraints++;
        }
      });

      // イベントリスナー数推定
      analysis.eventListeners = document.querySelectorAll('[onclick], [onmouseover], [onscroll]').length;

      return analysis;
    });
  }
}

test.describe('残存カクつき根本原因分析', () => {
  test('should identify remaining stutter causes', async ({ page }) => {
    console.log('🔍 残存カクつきの根本原因分析を開始...');
    
    const analyzer = new DeepStutteringAnalyzer(page);
    
    // ページ読み込み
    await page.goto('http://localhost:4323/');
    await page.waitForSelector('.bg-\\[\\#1e1e1e\\]', { timeout: 3000 });
    
    // 詳細パフォーマンス測定
    const metrics = await analyzer.measureRealTimePerformance();
    
    console.log('📊 詳細パフォーマンス分析結果:', {
      mainThreadBlocking: `${metrics.mainThreadBlocking.toFixed(2)}ms`,
      longTasks: `${metrics.longTasks.length}個`,
      stutterEvents: `${metrics.stutterEvents.length}個`,
      avgFrameTime: metrics.frameTimings.length > 0 
        ? `${(metrics.frameTimings.reduce((a, b) => a + b, 0) / metrics.frameTimings.length).toFixed(2)}ms`
        : '0ms',
      heapUsed: `${(metrics.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      memoryPressure: metrics.memoryPressure
    });

    // カクつき原因の詳細分析
    if (metrics.stutterEvents.length > 0) {
      console.log('⚠️ 検出されたカクつきイベント:');
      metrics.stutterEvents.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.cause}: ${event.duration.toFixed(2)}ms @ ${event.timestamp.toFixed(2)}ms`);
      });
    }

    // フレームレート分析
    const avgFrameTime = metrics.frameTimings.reduce((a, b) => a + b, 0) / metrics.frameTimings.length;
    const targetFrameTime = 16.67; // 60fps
    const frameDrops = metrics.frameTimings.filter(t => t > targetFrameTime).length;
    
    console.log('🎬 フレーム分析:', {
      averageFrameTime: `${avgFrameTime.toFixed(2)}ms`,
      targetFrameTime: `${targetFrameTime}ms`,
      frameDrops: frameDrops,
      frameDropRate: `${((frameDrops / metrics.frameTimings.length) * 100).toFixed(1)}%`
    });

    // 現在の実装状況確認
    const implementation = await analyzer.analyzeCurrentImplementation();
    console.log('🔧 現在の実装状況:', implementation);

    // カクつきの根本原因特定
    const rootCauses: string[] = [];
    
    if (metrics.mainThreadBlocking > 100) {
      rootCauses.push(`メインスレッドブロッキング: ${metrics.mainThreadBlocking.toFixed(2)}ms`);
    }
    
    if (metrics.longTasks.length > 3) {
      rootCauses.push(`長時間タスク: ${metrics.longTasks.length}個`);
    }
    
    if (frameDrops > metrics.frameTimings.length * 0.1) {
      rootCauses.push(`フレーム落ち率: ${((frameDrops / metrics.frameTimings.length) * 100).toFixed(1)}%`);
    }
    
    if (implementation.animationCount > implementation.gpuAccelerated) {
      rootCauses.push(`GPU非最適化アニメーション: ${implementation.animationCount - implementation.gpuAccelerated}個`);
    }
    
    if (metrics.memoryPressure) {
      rootCauses.push('メモリ圧迫検出');
    }

    console.log('🎯 特定された根本原因:', rootCauses.length > 0 ? rootCauses : ['原因を更に調査中...']);

    // 期待値チェック（カクつきが残っている場合は意図的に失敗）
    expect(metrics.stutterEvents.length).toBeLessThan(3); // カクつきイベント3個未満
    expect(avgFrameTime).toBeLessThan(20); // 平均フレーム時間20ms未満
    expect(frameDrops).toBeLessThan(metrics.frameTimings.length * 0.05); // フレーム落ち5%未満
  });

  test('should analyze specific technical bottlenecks', async ({ page }) => {
    console.log('🔬 技術的ボトルネック詳細分析...');
    
    await page.goto('http://localhost:4323/');
    await page.waitForSelector('.bg-\\[\\#1e1e1e\\]', { timeout: 3000 });
    
    // CSS パフォーマンス分析
    const cssAnalysis = await page.evaluate(() => {
      const results = {
        complexSelectors: 0,
        expensiveProperties: 0,
        reflows: 0,
        repaints: 0,
        animationPerformance: []
      };

      // 複雑なCSSセレクタ検出
      const stylesheets = Array.from(document.styleSheets);
      stylesheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach(rule => {
            if (rule.selectorText && rule.selectorText.includes('*')) {
              results.complexSelectors++;
            }
          });
        } catch (e) {
          // CORS制限などでアクセスできない場合はスキップ
        }
      });

      // 高負荷CSSプロパティ検出
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        
        // レイアウトを引き起こすプロパティ
        if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') {
          results.reflows++;
        }
        
        // 再描画を引き起こすプロパティ
        if (computedStyle.boxShadow !== 'none' || 
            computedStyle.borderRadius !== '0px' ||
            computedStyle.opacity !== '1') {
          results.repaints++;
        }
      });

      return results;
    });

    // JavaScript パフォーマンス分析
    const jsAnalysis = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        let operationCount = 0;
        
        // DOM操作パフォーマンステスト
        const testDiv = document.createElement('div');
        for (let i = 0; i < 1000; i++) {
          testDiv.style.transform = `translateX(${i}px)`;
          operationCount++;
        }
        
        const endTime = performance.now();
        document.body.removeChild(testDiv);
        
        resolve({
          domOperationTime: endTime - startTime,
          operationCount: operationCount,
          avgOperationTime: (endTime - startTime) / operationCount
        });
      });
    });

    console.log('💄 CSS分析結果:', cssAnalysis);
    console.log('📜 JavaScript分析結果:', jsAnalysis);

    // ボトルネック特定
    const bottlenecks: string[] = [];
    
    if (cssAnalysis.complexSelectors > 10) {
      bottlenecks.push(`複雑CSSセレクタ: ${cssAnalysis.complexSelectors}個`);
    }
    
    if (cssAnalysis.reflows > 20) {
      bottlenecks.push(`レイアウト再計算要素: ${cssAnalysis.reflows}個`);
    }
    
    if (cssAnalysis.repaints > 50) {
      bottlenecks.push(`再描画要素: ${cssAnalysis.repaints}個`);
    }
    
    if (jsAnalysis.avgOperationTime > 0.1) {
      bottlenecks.push(`DOM操作平均時間: ${jsAnalysis.avgOperationTime.toFixed(3)}ms`);
    }

    console.log('🎯 特定された技術ボトルネック:', bottlenecks.length > 0 ? bottlenecks : ['最適化済み']);

    // 技術的期待値
    expect(cssAnalysis.reflows).toBeLessThan(10);
    expect(jsAnalysis.avgOperationTime).toBeLessThan(0.05);
  });

  test('should provide optimization recommendations', async ({ page }) => {
    console.log('💡 最適化提案生成...');
    
    await page.goto('http://localhost:4323/');
    await page.waitForSelector('.bg-\\[\\#1e1e1e\\]', { timeout: 3000 });
    
    const analyzer = new DeepStutteringAnalyzer(page);
    const metrics = await analyzer.measureRealTimePerformance();
    const implementation = await analyzer.analyzeCurrentImplementation();
    
    const recommendations: string[] = [];
    
    // 具体的な最適化提案
    if (metrics.stutterEvents.length > 0) {
      recommendations.push('Virtual DOM最適化：React.memo()とuseMemo()の追加適用');
    }
    
    if (metrics.mainThreadBlocking > 50) {
      recommendations.push('Web Workers活用：重い処理のバックグラウンド実行');
    }
    
    if (implementation.animationCount > implementation.gpuAccelerated) {
      recommendations.push('CSS Transform最適化：全アニメーションのGPU層移行');
    }
    
    if (metrics.frameTimings.some(t => t > 25)) {
      recommendations.push('レンダリング最適化：contain:layoutとwill-changeの拡張適用');
    }
    
    if (metrics.heapUsed > 50 * 1024 * 1024) { // 50MB以上
      recommendations.push('メモリ最適化：オブジェクトプーリングとガベージコレクション調整');
    }

    console.log('🚀 推奨最適化項目:', recommendations.length > 0 ? recommendations : ['現在の実装で最適化済み']);
    
    // 最適化が必要な場合は失敗させる
    expect(recommendations.length).toBeLessThan(3);
  });
});