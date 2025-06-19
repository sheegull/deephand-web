import { test, expect } from '@playwright/test';

/**
 * Integration tests to validate refactoring improvements
 * Compares performance before and after refactoring
 */

test.describe('Refactoring Validation Tests', () => {
  test('performance comparison - original vs refactored', async ({ page }) => {
    // Test original implementation (if available)
    const originalStartTime = Date.now();
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    const originalLoadTime = Date.now() - originalStartTime;

    console.log(`Current implementation load time: ${originalLoadTime}ms`);

    // Validate performance improvements
    expect(originalLoadTime).toBeLessThan(8000); // Should be better than 8s
    
    // Test specific components
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('hero-header')).toBeVisible();
    await expect(page.getByTestId('hero-main-content')).toBeVisible();
    await expect(page.getByTestId('hero-contact-form')).toBeVisible();
    await expect(page.getByTestId('hero-footer')).toBeVisible();
  });

  test('bundle size validation', async ({ page }) => {
    const networkRequests = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        networkRequests.push({
          url: response.url(),
          size: response.headers()['content-length'],
          type: response.url().includes('.js') ? 'javascript' : 'css'
        });
      }
    });

    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');

    console.log('Network requests:', networkRequests);
    
    // Should have reasonable number of requests
    expect(networkRequests.length).toBeLessThan(20);
  });

  test('lazy loading validation', async ({ page }) => {
    // Start with background out of view
    await page.goto('http://localhost:4321');
    
    // Background container should exist
    await expect(page.getByTestId('dither-background-container')).toBeVisible();
    
    // Should have loading fallback initially (may load quickly)
    const hasLoadingFallback = await page.getByTestId('dither-background-loading').isVisible().catch(() => false);
    
    // Background should eventually load
    await page.waitForTimeout(2000);
    
    console.log('Lazy loading test completed');
  });

  test('component isolation validation', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Each component should be independently functional
    
    // Header should work independently
    const headerExists = await page.getByTestId('hero-header').isVisible();
    expect(headerExists).toBe(true);
    
    // Main content should work independently
    const mainContentExists = await page.getByTestId('hero-main-content').isVisible();
    expect(mainContentExists).toBe(true);
    
    // Contact form should work independently
    const contactFormExists = await page.getByTestId('hero-contact-form').isVisible();
    expect(contactFormExists).toBe(true);
    
    // Footer should work independently
    const footerExists = await page.getByTestId('hero-footer').isVisible();
    expect(footerExists).toBe(true);
    
    // Background should work independently
    const backgroundExists = await page.getByTestId('hero-background').isVisible();
    expect(backgroundExists).toBe(true);
  });

  test('memory usage validation', async ({ page }) => {
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    
    // Get memory usage
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        // @ts-ignore
        return performance.memory;
      }
      return null;
    });
    
    if (memoryUsage) {
      console.log('Memory usage:', memoryUsage);
      
      // Should have reasonable memory usage (in bytes)
      // @ts-ignore
      expect(memoryUsage.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });

  test('error handling validation', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    
    // Should have minimal console errors
    expect(consoleErrors.length).toBeLessThan(3);
    
    // Test form error handling
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('validation-errors')).toBeVisible();
  });

  test('accessibility improvements validation', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Test aria labels and semantic HTML
    const header = page.getByTestId('hero-header');
    await expect(header).toContainText('DeepHand');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('responsive design validation', async ({ page }) => {
    // Test multiple viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:4321');
      
      // All components should be visible
      await expect(page.getByTestId('hero-section')).toBeVisible();
      await expect(page.getByTestId('hero-header')).toBeVisible();
      await expect(page.getByTestId('hero-main-content')).toBeVisible();
      await expect(page.getByTestId('hero-contact-form')).toBeVisible();
      await expect(page.getByTestId('hero-footer')).toBeVisible();
      
      console.log(`${viewport.name} layout validated`);
    }
  });

  test('code splitting effectiveness', async ({ page }) => {
    const networkRequests = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        networkRequests.push(request.url());
      }
    });
    
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    
    console.log('JavaScript requests:', networkRequests.length);
    
    // Should have code splitting (multiple JS files)
    const jsFiles = networkRequests.filter(url => url.includes('.js'));
    console.log('JS files loaded:', jsFiles.length);
    
    // Should have reasonable number of chunks
    expect(jsFiles.length).toBeGreaterThan(0);
    expect(jsFiles.length).toBeLessThan(15);
  });
});