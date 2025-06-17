import puppeteer from 'puppeteer';

async function testFrontendForm() {
  console.log('🚀 [FRONTEND TEST] Starting RequestData form frontend test');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--disable-web-security']
  });
  
  const page = await browser.newPage();
  
  // Enable request/response logging
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('📥 [API RESPONSE]:', response.status(), response.url());
    }
  });
  
  // Log console messages
  page.on('console', msg => {
    if (msg.text().includes('REQUEST') || msg.text().includes('DEBUG') || msg.text().includes('ERROR') || msg.text().includes('SUCCESS')) {
      console.log('🖥️ [BROWSER LOG]:', msg.text());
    }
  });
  
  try {
    // Navigate to request page
    console.log('🌐 [FRONTEND TEST] Navigating to /request page');
    await page.goto('http://localhost:4321/request', { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('✅ [FRONTEND TEST] Page loaded successfully');
    
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✅ [FRONTEND TEST] Form found');
    
    // Step 1: Fill basic information
    console.log('📝 [FRONTEND TEST] Filling Step 1 - Basic Information');
    
    await page.type('input[name="name"]', 'Frontend Test User');
    await page.type('input[name="organization"]', 'Frontend Test Company');
    await page.type('input[name="email"]', 'contact@deephandai.com');
    await page.type('textarea[name="backgroundPurpose"]', 'Testing frontend form submission');
    
    console.log('✅ [FRONTEND TEST] Step 1 fields filled');
    
    // Find and click Next button
    await page.waitForTimeout(1000);
    
    const buttons = await page.$$('button');
    let nextClicked = false;
    
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        await button.click();
        nextClicked = true;
        console.log('✅ [FRONTEND TEST] Clicked Next button');
        break;
      }
    }
    
    if (!nextClicked) {
      console.log('❌ [FRONTEND TEST] Next button not found');
      await page.screenshot({ path: 'step1_error.png' });
      return;
    }
    
    // Wait for step transition
    await page.waitForTimeout(2000);
    
    // Step 2: Fill project details
    console.log('📝 [FRONTEND TEST] Filling Step 2 - Project Details');
    
    // Select data type checkboxes
    await page.click('input[type="checkbox"][value="image"]');
    await page.click('input[type="checkbox"][value="video"]');
    
    // Fill remaining fields
    await page.type('textarea[name="dataDetails"]', 'Frontend test data details');
    await page.type('input[name="dataVolume"]', '2000 samples');
    await page.type('input[name="deadline"]', 'April 2025');
    await page.type('input[name="budget"]', '$10,000');
    await page.type('textarea[name="otherRequirements"]', 'Frontend test requirements');
    
    console.log('✅ [FRONTEND TEST] Step 2 fields filled');
    
    // Submit the form
    console.log('🚀 [FRONTEND TEST] Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    // Check for success message
    const pageContent = await page.content();
    const bodyText = await page.evaluate(() => document.body.textContent);
    
    if (bodyText.includes('success') || bodyText.includes('成功') || bodyText.includes('受け付けました')) {
      console.log('✅ [FRONTEND TEST] SUCCESS: Form submitted successfully');
      console.log('✅ [FRONTEND TEST] Success indicators found in page');
    } else if (bodyText.includes('failed') || bodyText.includes('Failed') || bodyText.includes('失敗')) {
      console.log('❌ [FRONTEND TEST] ERROR: Form submission failed');
      console.log('❌ [FRONTEND TEST] Body text sample:', bodyText.substring(0, 500));
      await page.screenshot({ path: 'frontend_error.png', fullPage: true });
    } else {
      console.log('⚠️ [FRONTEND TEST] UNKNOWN: No clear success/error indication');
      console.log('⚠️ [FRONTEND TEST] Body text sample:', bodyText.substring(0, 500));
      await page.screenshot({ path: 'frontend_unknown.png', fullPage: true });
    }
    
    // Wait for manual inspection
    console.log('⏳ [FRONTEND TEST] Waiting 5 seconds for final inspection...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ [FRONTEND TEST ERROR]:', error.message);
    await page.screenshot({ path: 'frontend_test_error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('🏁 [FRONTEND TEST] Test completed');
  }
}

testFrontendForm().catch(console.error);