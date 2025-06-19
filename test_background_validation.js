import puppeteer from 'puppeteer';

// TDD Test: Background Purpose minimum length validation
async function testBackgroundPurposeValidation() {
  console.log('🧪 [TDD BACKGROUND TEST] Testing minimum length validation');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4321/request', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Test 1: 4 characters (should fail)
    console.log('📝 [TEST 1] Testing 4 characters in background purpose (should fail)');
    
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    // Fill required fields
    await page.type('input[name="name"]', 'Test User');
    await page.type('input[name="email"]', 'contact@deephandai.com');
    await page.type('textarea[name="backgroundPurpose"]', '1234'); // 4 characters
    
    console.log('✅ [TEST 1] Filled form with 4-character background');
    
    // Click Next button
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        await button.click();
        console.log('✅ [TEST 1] Clicked Next button');
        break;
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Check if validation error appears
    const pageText = await page.evaluate(() => document.body.textContent);
    const hasLengthError = pageText.includes('5文字以上') || 
                          pageText.includes('5 characters') ||
                          pageText.includes('最低5文字') ||
                          pageText.includes('minimum 5');
    
    if (hasLengthError) {
      console.log('✅ [TEST 1] PASS: Length validation error shown for 4 characters');
    } else {
      console.log('❌ [TEST 1] FAIL: No length validation error for 4 characters');
      console.log('Page text sample:', pageText.substring(0, 300));
    }
    
    // Test 2: 6 characters (should pass)
    console.log('📝 [TEST 2] Testing 6 characters in background purpose (should pass)');
    
    // Clear and fill with 6 characters
    await page.click('textarea[name="backgroundPurpose"]', { clickCount: 3 });
    await page.type('textarea[name="backgroundPurpose"]', '123456'); // 6 characters
    
    // Click Next button again
    const buttons2 = await page.$$('button');
    for (const button of buttons2) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        await button.click();
        console.log('✅ [TEST 2] Clicked Next button with 6 characters');
        break;
      }
    }
    
    await page.waitForTimeout(3000);
    
    // Check if we progressed to Step 2
    const step2Text = await page.evaluate(() => document.body.textContent);
    const isOnStep2 = step2Text.includes('Project Details') || 
                     step2Text.includes('Data Type') ||
                     step2Text.includes('データタイプ');
    
    if (isOnStep2) {
      console.log('✅ [TEST 2] PASS: 6 characters allowed progression to Step 2');
    } else {
      console.log('❌ [TEST 2] FAIL: 6 characters did not progress to Step 2');
    }
    
    await page.screenshot({ path: 'background_validation_test.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ [BACKGROUND TEST] ERROR:', error.message);
    await page.screenshot({ path: 'background_validation_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testBackgroundPurposeValidation().catch(console.error);