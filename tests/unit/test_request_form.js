import puppeteer from 'puppeteer';

async function testRequestForm() {
  console.log('🚀 [TDD TEST] Starting RequestData form test');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 500,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const page = await browser.newPage();
  
  // Enable request/response logging
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('📤 [API REQUEST]:', request.method(), request.url());
      console.log('📤 [API REQUEST BODY]:', request.postData());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('📥 [API RESPONSE]:', response.status(), response.url());
    }
  });
  
  // Log console messages from the page
  page.on('console', msg => {
    if (msg.text().includes('REQUEST') || msg.text().includes('DEBUG') || msg.text().includes('ERROR')) {
      console.log('🖥️ [BROWSER LOG]:', msg.text());
    }
  });
  
  try {
    // Navigate to request page
    console.log('🌐 [TDD] Navigating to /request page');
    await page.goto('http://localhost:4322/request', { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('✅ [TDD] Page loaded successfully');
    
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✅ [TDD] Form found');
    
    // Step 1: Fill basic information
    console.log('📝 [TDD] Filling Step 1 - Basic Information');
    
    await page.type('input[name="name"]', 'Test User TDD');
    await page.type('input[name="organization"]', 'Test Company');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('textarea[name="backgroundPurpose"]', 'Testing the form submission functionality using TDD approach');
    
    console.log('✅ [TDD] Step 1 fields filled');
    
    // Click Next button to go to Step 2
    const nextButtonSelector = 'button';
    const buttons = await page.$$('button');
    let nextButton = null;
    
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Next') || text.includes('→')) {
        nextButton = button;
        break;
      }
    }
    
    if (nextButton) {
      await nextButton.click();
      console.log('✅ [TDD] Clicked Next button');
    } else {
      console.log('❌ [TDD] Next button not found');
    }
    
    // Wait a moment for step transition
    await page.waitForTimeout(1000);
    
    // Step 2: Fill project details
    console.log('📝 [TDD] Filling Step 2 - Project Details');
    
    // Select data type checkboxes
    await page.click('input[type="checkbox"][value="image"]');
    await page.click('input[type="checkbox"][value="video"]');
    
    // Fill remaining fields
    await page.type('textarea[name="dataDetails"]', 'Image and video data for robot training');
    await page.type('input[name="dataVolume"]', '10,000 samples');
    await page.type('input[name="deadline"]', 'March 2025');
    await page.type('input[name="budget"]', '$15,000');
    await page.type('textarea[name="otherRequirements"]', 'High quality annotations required');
    
    console.log('✅ [TDD] Step 2 fields filled');
    
    // Submit the form
    console.log('🚀 [TDD] Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    // Check for success or error messages
    const successMessage = await page.$('.success');
    const errorMessage = await page.$('.error');
    const bodyText = await page.evaluate(() => document.body.textContent);
    const hasFailed = bodyText.includes('failed') || bodyText.includes('Failed');
    
    if (successMessage) {
      console.log('✅ [TDD] SUCCESS: Form submitted successfully');
    } else if (errorMessage || hasFailed) {
      console.log('❌ [TDD] ERROR: Form submission failed');
      console.log('❌ [TDD] Body text contains:', bodyText.substring(0, 500));
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
      console.log('📸 [TDD] Screenshot saved as error_screenshot.png');
    } else {
      console.log('⚠️ [TDD] UNKNOWN: No clear success/error indication');
      await page.screenshot({ path: 'unknown_state.png', fullPage: true });
    }
    
    // Log final page content for debugging
    const pageContent = await page.content();
    console.log('📄 [TDD] Final page title:', await page.title());
    
    // Wait for manual inspection
    console.log('⏳ [TDD] Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ [TDD ERROR]:', error.message);
    await page.screenshot({ path: 'test_error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('🏁 [TDD] Test completed');
  }
}

testRequestForm().catch(console.error);