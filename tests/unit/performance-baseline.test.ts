import { test, expect } from '@playwright/test';

/**
 * Performance baseline tests for refactoring validation
 * These tests establish performance metrics before refactoring
 */

test.describe('Performance Baseline Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:4321');
  });

  test('measure initial page load performance', async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now();
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Log baseline metrics
    console.log(`Baseline load time: ${loadTime}ms`);
    
    // Measure Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        if (typeof PerformanceObserver !== 'undefined') {
          const observer = new PerformanceObserver(list => {
            const entries = list.getEntries();
            const metrics = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'navigation') {
                // @ts-ignore
                metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
                // @ts-ignore
                metrics.loadComplete = entry.loadEventEnd - entry.loadEventStart;
              }
            });
            
            resolve(metrics);
          });
          
          observer.observe({ entryTypes: ['navigation'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        } else {
          resolve({});
        }
      });
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    // Assert reasonable load time (current baseline)
    expect(loadTime).toBeLessThan(10000); // 10 seconds baseline
  });

  test('measure HeroSection rendering time', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for HeroSection to be visible
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 30000 });
    
    const renderTime = Date.now() - startTime;
    console.log(`HeroSection render time: ${renderTime}ms`);
    
    // Current baseline - should improve after refactoring
    expect(renderTime).toBeLessThan(8000);
  });

  test('measure DitherBackground loading time', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for canvas element (DitherBackground)
    await page.waitForSelector('canvas', { timeout: 30000 });
    
    const canvasLoadTime = Date.now() - startTime;
    console.log(`DitherBackground load time: ${canvasLoadTime}ms`);
    
    // Current baseline - should improve significantly with lazy loading
    expect(canvasLoadTime).toBeLessThan(15000);
  });

  test('measure bundle size impact', async ({ page }) => {
    // Measure network requests
    const requests = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script' || request.resourceType() === 'stylesheet') {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType()
        });
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`Total script/CSS requests: ${requests.length}`);
    console.log('Resource requests:', requests);
    
    // Log for baseline comparison
    expect(requests.length).toBeGreaterThan(0);
  });
});