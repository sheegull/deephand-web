/**
 * 微細な引っかかり分析テスト
 * 0.5-1秒は解決したが、残る微細な遅延を特定
 */

import { test, expect } from '@playwright/test';

interface MicroPerformanceMetrics {
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  backgroundRender: number;
  hydrationComplete: number;
  animationStart: number;
  layoutShift: number;
  reflows: number;
  javaScriptExecutionTime: number;
  cssComputedTime: number;
}

class MicroLagAnalyzer {
  constructor(private page: any) {}

  async measureDetailedPerformance(): Promise<MicroPerformanceMetrics> {
    // 高精度タイミング計測を開始
    await this.page.evaluate(() => {
      window.microMetrics = {
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        backgroundRender: 0,
        hydrationComplete: 0,
        animationStart: 0,
        layoutShift: 0,
        reflows: 0,
        javaScriptExecutionTime: 0,
        cssComputedTime: 0
      };

      // Performance Observer for paint metrics
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-paint') {
            window.microMetrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            window.microMetrics.firstContentfulPaint = entry.startTime;
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Layout shift detection
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.microMetrics.layoutShift += entry.value;
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // Measure JavaScript execution time
      const jsStart = performance.now();
      
      // Monitor DOM changes for background rendering
      const observer = new MutationObserver((mutations) => {
        const now = performance.now();
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as Element;
              if (element.classList?.contains('bg-[#1e1e1e]') ||
                  element.style?.backgroundImage?.includes('gradient')) {
                if (!window.microMetrics.backgroundRender) {
                  window.microMetrics.backgroundRender = now;
                }
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Hydration detection
      const checkHydration = () => {
        if (document.querySelector('[data-testid="background-hydrated"]') ||
            document.querySelector('.bg-\\[\\#1e1e1e\\]')) {
          window.microMetrics.hydrationComplete = performance.now();
        } else {
          requestAnimationFrame(checkHydration);
        }
      };
      requestAnimationFrame(checkHydration);

      // Animation detection
      const checkAnimation = () => {
        const elements = document.querySelectorAll('[style*="animation"]');
        if (elements.length > 0) {
          window.microMetrics.animationStart = performance.now();
        } else {
          requestAnimationFrame(checkAnimation);
        }
      };
      requestAnimationFrame(checkAnimation);

      // DOM Content Loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          window.microMetrics.domContentLoaded = performance.now();
        });
      } else {
        window.microMetrics.domContentLoaded = performance.now();
      }

      // CSS computation time
      const cssStart = performance.now();
      const tempDiv = document.createElement('div');
      tempDiv.className = 'bg-[#1e1e1e]';
      tempDiv.style.backgroundImage = `
        radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.05) 0%, transparent 40%)
      `;
      document.body.appendChild(tempDiv);
      const computedStyle = getComputedStyle(tempDiv);
      computedStyle.backgroundColor; // Force computation
      window.microMetrics.cssComputedTime = performance.now() - cssStart;
      document.body.removeChild(tempDiv);

      window.microMetrics.javaScriptExecutionTime = performance.now() - jsStart;
    });

    // Navigate to page
    await this.page.goto('http://localhost:4324/', {
      waitUntil: 'domcontentloaded'
    });

    // Wait for initial rendering
    await this.page.waitForSelector('.bg-\\[\\#1e1e1e\\]', { timeout: 2000 });
    
    // Additional wait to capture all metrics
    await this.page.waitForTimeout(1000);

    // Get final metrics
    const metrics = await this.page.evaluate(() => {
      return window.microMetrics;
    });

    return metrics;
  }

  async analyzeReactRerendering(): Promise<{ rerenderCount: number, rerenderTimes: number[] }> {
    await this.page.goto('http://localhost:4324/');
    
    const rerenderData = await this.page.evaluate(() => {
      let rerenderCount = 0;
      let rerenderTimes: number[] = [];
      
      // Monkey patch React setState to track re-renders
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        if (args[0] && args[0].includes && args[0].includes('render')) {
          rerenderCount++;
          rerenderTimes.push(performance.now());
        }
        return originalConsoleLog.apply(console, args);
      };

      // Monitor DOM updates as proxy for re-renders
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            rerenderCount++;
            rerenderTimes.push(performance.now());
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Simulate wait for component mounting
      setTimeout(() => {
        observer.disconnect();
      }, 2000);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ rerenderCount, rerenderTimes });
        }, 2500);
      });
    });

    return rerenderData;
  }

  async measureMemoryUsage(): Promise<{ initial: number, afterRender: number, peak: number }> {
    await this.page.goto('http://localhost:4324/');
    
    const memoryMetrics = await this.page.evaluate(() => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      return new Promise((resolve) => {
        let peak = initialMemory;
        const checkMemory = () => {
          const current = (performance as any).memory?.usedJSHeapSize || 0;
          if (current > peak) peak = current;
        };

        const interval = setInterval(checkMemory, 50);
        
        setTimeout(() => {
          clearInterval(interval);
          const afterRender = (performance as any).memory?.usedJSHeapSize || 0;
          resolve({
            initial: initialMemory,
            afterRender: afterRender,
            peak: peak
          });
        }, 2000);
      });
    });

    return memoryMetrics;
  }
}

test.describe('微細な引っかかり詳細分析', () => {
  test('should measure detailed micro-performance metrics', async ({ page }) => {
    console.log('🔬 詳細な微細パフォーマンス分析を開始...');
    
    const analyzer = new MicroLagAnalyzer(page);
    const metrics = await analyzer.measureDetailedPerformance();
    
    console.log('📊 詳細パフォーマンスメトリクス:', {
      domContentLoaded: `${metrics.domContentLoaded.toFixed(2)}ms`,
      firstPaint: `${metrics.firstPaint.toFixed(2)}ms`,
      firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(2)}ms`,
      backgroundRender: `${metrics.backgroundRender.toFixed(2)}ms`,
      hydrationComplete: `${metrics.hydrationComplete.toFixed(2)}ms`,
      animationStart: `${metrics.animationStart.toFixed(2)}ms`,
      layoutShift: metrics.layoutShift.toFixed(4),
      javaScriptExecutionTime: `${metrics.javaScriptExecutionTime.toFixed(2)}ms`,
      cssComputedTime: `${metrics.cssComputedTime.toFixed(2)}ms`
    });

    // 微細な引っかかりの原因を特定
    const potentialIssues: string[] = [];

    if (metrics.backgroundRender - metrics.firstContentfulPaint > 10) {
      potentialIssues.push(`背景レンダリング遅延: ${(metrics.backgroundRender - metrics.firstContentfulPaint).toFixed(2)}ms`);
    }

    if (metrics.hydrationComplete - metrics.domContentLoaded > 20) {
      potentialIssues.push(`Hydration遅延: ${(metrics.hydrationComplete - metrics.domContentLoaded).toFixed(2)}ms`);
    }

    if (metrics.animationStart - metrics.backgroundRender > 5) {
      potentialIssues.push(`アニメーション開始遅延: ${(metrics.animationStart - metrics.backgroundRender).toFixed(2)}ms`);
    }

    if (metrics.layoutShift > 0.001) {
      potentialIssues.push(`レイアウトシフト検出: ${metrics.layoutShift.toFixed(4)}`);
    }

    if (metrics.cssComputedTime > 5) {
      potentialIssues.push(`CSS計算時間過多: ${metrics.cssComputedTime.toFixed(2)}ms`);
    }

    if (metrics.javaScriptExecutionTime > 10) {
      potentialIssues.push(`JavaScript実行時間過多: ${metrics.javaScriptExecutionTime.toFixed(2)}ms`);
    }

    console.log('⚠️ 潜在的な問題:', potentialIssues.length > 0 ? potentialIssues : ['問題なし']);

    // 基本的な閾値チェック
    expect(metrics.backgroundRender).toBeLessThan(50); // 50ms以内
    expect(metrics.layoutShift).toBeLessThan(0.1); // CLS閾値
    expect(metrics.cssComputedTime).toBeLessThan(10); // CSS計算時間
  });

  test('should analyze React re-rendering patterns', async ({ page }) => {
    console.log('⚛️ React re-rendering分析...');
    
    const analyzer = new MicroLagAnalyzer(page);
    const rerenderData = await analyzer.analyzeReactRerendering();
    
    console.log('🔄 Re-render分析結果:', {
      rerenderCount: rerenderData.rerenderCount,
      rerenderTimes: rerenderData.rerenderTimes.map(t => `${t.toFixed(2)}ms`)
    });

    // Re-render回数が多すぎないかチェック
    expect(rerenderData.rerenderCount).toBeLessThan(5); // 5回以内に抑制
    
    if (rerenderData.rerenderTimes.length > 1) {
      const intervals = rerenderData.rerenderTimes.slice(1).map((time, i) => 
        time - rerenderData.rerenderTimes[i]
      );
      console.log('📊 Re-render間隔:', intervals.map(i => `${i.toFixed(2)}ms`));
      
      // 短すぎるre-render間隔は問題
      const tooFastRerenders = intervals.filter(interval => interval < 16); // 16ms = 60fps
      expect(tooFastRerenders.length).toBeLessThan(2);
    }
  });

  test('should measure memory usage patterns', async ({ page }) => {
    console.log('💾 メモリ使用量分析...');
    
    const analyzer = new MicroLagAnalyzer(page);
    const memoryMetrics = await analyzer.measureMemoryUsage();
    
    console.log('🧠 メモリ使用量:', {
      initial: `${(memoryMetrics.initial / 1024 / 1024).toFixed(2)}MB`,
      afterRender: `${(memoryMetrics.afterRender / 1024 / 1024).toFixed(2)}MB`,
      peak: `${(memoryMetrics.peak / 1024 / 1024).toFixed(2)}MB`,
      increase: `${((memoryMetrics.afterRender - memoryMetrics.initial) / 1024 / 1024).toFixed(2)}MB`
    });

    // メモリ増加量チェック
    const memoryIncrease = memoryMetrics.afterRender - memoryMetrics.initial;
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // 5MB以内
    
    // メモリピークチェック
    const peakIncrease = memoryMetrics.peak - memoryMetrics.initial;
    expect(peakIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB以内
  });

  test('should identify specific micro-lag sources', async ({ page }) => {
    console.log('🎯 微細引っかかりの具体的原因特定...');
    
    await page.goto('http://localhost:4324/');
    
    // フレームレート監視
    const frameData = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames: number[] = [];
        let lastFrame = performance.now();
        
        const measureFrame = () => {
          const now = performance.now();
          const frameDuration = now - lastFrame;
          frames.push(frameDuration);
          lastFrame = now;
          
          if (frames.length < 60) { // 1秒間分
            requestAnimationFrame(measureFrame);
          } else {
            resolve(frames);
          }
        };
        
        requestAnimationFrame(measureFrame);
      });
    });

    const avgFrameTime = frameData.reduce((a, b) => a + b, 0) / frameData.length;
    const maxFrameTime = Math.max(...frameData);
    const fps = 1000 / avgFrameTime;
    
    console.log('🎬 フレームレート分析:', {
      averageFPS: fps.toFixed(1),
      averageFrameTime: `${avgFrameTime.toFixed(2)}ms`,
      maxFrameTime: `${maxFrameTime.toFixed(2)}ms`,
      droppedFrames: frameData.filter(f => f > 16.67).length // 60fps基準
    });

    // 引っかかりの判定
    expect(fps).toBeGreaterThan(55); // 55fps以上
    expect(maxFrameTime).toBeLessThan(25); // 最大フレーム時間25ms以内
    expect(frameData.filter(f => f > 16.67).length).toBeLessThan(5); // フレーム落ち5回以内
  });
});

test.describe('具体的改善提案', () => {
  test('should provide optimization recommendations', async ({ page }) => {
    console.log('💡 最適化提案の生成...');
    
    await page.goto('http://localhost:4324/');
    
    const optimizationNeeds = await page.evaluate(() => {
      const recommendations: string[] = [];
      
      // CSS animations確認
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      if (animatedElements.length === 0) {
        recommendations.push('CSS animation初期化の遅延が原因の可能性');
      }

      // GPU acceleration確認
      const backgroundElements = document.querySelectorAll('.bg-\\[\\#1e1e1e\\]');
      backgroundElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        if (!computedStyle.transform.includes('translateZ')) {
          recommendations.push('GPU acceleration (translateZ) の追加が必要');
        }
      });

      // Component hierarchy確認
      const nestedDivs = document.querySelectorAll('div div div div div');
      if (nestedDivs.length > 10) {
        recommendations.push('DOM階層の深すぎ - フラット化を推奨');
      }

      // Hydration mismatch確認
      const serverRendered = document.querySelector('[data-reactroot]');
      const clientRendered = document.querySelector('.bg-\\[\\#1e1e1e\\]');
      if (serverRendered && clientRendered) {
        recommendations.push('SSR/CSR不整合によるhydration遅延の可能性');
      }

      return recommendations;
    });

    console.log('🔧 最適化推奨事項:', optimizationNeeds);

    // 最低限の改善項目がないことを確認
    expect(optimizationNeeds.length).toBeLessThan(3);
  });
});