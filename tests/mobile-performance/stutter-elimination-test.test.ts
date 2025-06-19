/**
 * カクつき完全除去テスト
 * Minimal版でカクつきが解消されるかの確認
 */

import { test, expect } from '@playwright/test';

test.describe('カクつき完全除去確認', () => {
  test('should eliminate all stuttering with minimal background', async ({ page }) => {
    console.log('🧪 Minimal版カクつき除去テスト開始...');
    
    await page.goto('http://localhost:4323/');
    await page.waitForSelector('.absolute.inset-0', { timeout: 3000 });
    
    // フレームレート測定
    const frameData = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames: number[] = [];
        let lastFrame = performance.now();
        let frameCount = 0;
        const targetFrames = 120; // 2秒間測定
        
        const measureFrame = () => {
          const now = performance.now();
          const frameDuration = now - lastFrame;
          frames.push(frameDuration);
          lastFrame = now;
          frameCount++;
          
          if (frameCount < targetFrames) {
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
    const stutterFrames = frameData.filter(f => f > 20).length; // 20ms超過フレーム
    
    console.log('📊 Minimal版パフォーマンス:', {
      averageFPS: fps.toFixed(1),
      averageFrameTime: `${avgFrameTime.toFixed(2)}ms`,
      maxFrameTime: `${maxFrameTime.toFixed(2)}ms`,
      stutterFrames: stutterFrames,
      stutterRate: `${((stutterFrames / frameData.length) * 100).toFixed(1)}%`
    });

    // カクつき除去確認
    expect(fps).toBeGreaterThan(58); // 58fps以上
    expect(maxFrameTime).toBeLessThan(25); // 最大フレーム時間25ms未満
    expect(stutterFrames).toBeLessThan(3); // カクつきフレーム3個未満

    console.log('✅ Minimal版でカクつき完全除去確認');
  });

  test('should identify specific stutter causes in original', async ({ page }) => {
    console.log('🔍 オリジナル版カクつき原因特定...');
    
    // 一時的にオリジナル版に戻す分析用
    const stutterCauses = await page.evaluate(() => {
      const causes = [];
      
      // CSS Animation検出
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      if (animatedElements.length > 0) {
        causes.push(`CSS Animation要素: ${animatedElements.length}個`);
      }
      
      // 複雑背景検出
      const complexBackgrounds = document.querySelectorAll('[style*="radial-gradient"]');
      if (complexBackgrounds.length > 0) {
        causes.push(`複雑背景要素: ${complexBackgrounds.length}個`);
      }
      
      // イベントリスナー検出
      const interactiveElements = document.querySelectorAll('[onclick], [onmouseover]');
      if (interactiveElements.length > 10) {
        causes.push(`インタラクティブ要素: ${interactiveElements.length}個`);
      }
      
      return causes;
    });

    console.log('🎯 特定されたカクつき原因:', stutterCauses);
    
    // 原因が特定されていることを確認
    expect(stutterCauses.length).toBeGreaterThan(0);
  });
});