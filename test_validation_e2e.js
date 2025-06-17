import puppeteer from 'puppeteer';

// Simple E2E test for validation timing
async function testValidationE2E() {
  console.log('🧪 [E2E TEST] Testing Step1 validation timing fix');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1500,
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  try {
    console.log('🌐 [E2E] Navigating to request page...');
    await page.goto('http://localhost:4321/request', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log('✅ [E2E] Page loaded');
    
    // Wait for form elements
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    console.log('✅ [E2E] Form elements found');
    
    // Test 1: Empty form validation
    console.log('📝 [E2E] Test 1: Click Next without filling form');
    
    // Find and click Next button without filling form
    const nextButton = await page.$('button');
    if (nextButton) {
      const buttonText = await page.evaluate(el => el.textContent, nextButton);
      console.log('Found button with text:', buttonText);
      
      if (buttonText && (buttonText.includes('Next') || buttonText.includes('→'))) {
        await nextButton.click();
        console.log('✅ [E2E] Clicked Next button');
        
        // Wait and check for validation errors
        await page.waitForTimeout(2000);
        
        const pageText = await page.evaluate(() => document.body.textContent);
        const hasValidationError = pageText.includes('required') || 
                                  pageText.includes('必須') || 
                                  pageText.includes('入力してください');
        
        if (hasValidationError) {
          console.log('✅ [E2E] Test 1 PASS: Validation errors shown');
        } else {
          console.log('❌ [E2E] Test 1 FAIL: No validation errors shown');
        }
      }
    }
    
    // Test 2: Fill form and progress
    console.log('📝 [E2E] Test 2: Fill form and progress to Step 2');
    
    await page.type('input[name="name"]', 'E2E Test User');
    await page.type('input[name="email"]', 'contact@deephandai.com');
    await page.type('textarea[name="backgroundPurpose"]', 'E2E testing background purpose for validation');
    
    console.log('✅ [E2E] Filled Step 1 fields');
    
    // Click Next again
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        await button.click();
        console.log('✅ [E2E] Clicked Next with valid data');
        break;
      }
    }
    
    await page.waitForTimeout(3000);
    
    // Check if we're on Step 2
    const step2Text = await page.evaluate(() => document.body.textContent);
    const isOnStep2 = step2Text.includes('Project Details') || 
                     step2Text.includes('Data Type') ||
                     step2Text.includes('データタイプ');
    
    if (isOnStep2) {
      console.log('✅ [E2E] Test 2 PASS: Progressed to Step 2');
    } else {
      console.log('❌ [E2E] Test 2 FAIL: Did not progress to Step 2');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'e2e_final_state.png', fullPage: true });
    console.log('📸 [E2E] Screenshot saved');
    
  } catch (error) {
    console.error('❌ [E2E] ERROR:', error.message);
    await page.screenshot({ path: 'e2e_error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('🏁 [E2E] Test completed');
  }
}

testValidationE2E().catch(console.error);