import puppeteer from 'puppeteer';

// TDD Test 1: Step1バリデーションタイミング
async function testStep1ValidationTiming() {
  console.log('🧪 [TDD TEST 1] Step1 Validation Timing Test');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 800
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to request page
    await page.goto('http://localhost:4321/request', { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('📝 [TEST 1] Testing empty form submission (should fail validation)');
    
    // Try to click Next without filling required fields
    await page.waitForSelector('form', { timeout: 5000 });
    
    // Find Next button
    const buttons = await page.$$('button');
    let nextButton = null;
    
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        nextButton = button;
        break;
      }
    }
    
    if (!nextButton) {
      console.log('❌ [TEST 1] FAIL: Next button not found');
      return false;
    }
    
    // Click Next button without filling form
    await nextButton.click();
    await page.waitForTimeout(1000);
    
    // Check if validation errors appear immediately
    const bodyText = await page.evaluate(() => document.body.textContent);
    const hasValidationError = bodyText.includes('required') || 
                              bodyText.includes('必須') || 
                              bodyText.includes('入力してください') ||
                              bodyText.includes('エラー');
    
    if (hasValidationError) {
      console.log('✅ [TEST 1] PASS: Validation triggered on Next button click');
      
      // Check if we're still on Step 1 (not moved to Step 2)
      const isStillStep1 = bodyText.includes('Basic Information') || 
                          bodyText.includes('基本情報') ||
                          !bodyText.includes('Project Details') &&
                          !bodyText.includes('プロジェクト詳細');
      
      if (isStillStep1) {
        console.log('✅ [TEST 1] PASS: User remains on Step 1 after validation error');
        return true;
      } else {
        console.log('❌ [TEST 1] FAIL: User moved to Step 2 despite validation error');
        return false;
      }
    } else {
      console.log('❌ [TEST 1] FAIL: No validation error shown on Next click');
      return false;
    }
    
  } catch (error) {
    console.error('❌ [TEST 1] ERROR:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// TDD Test 2: Valid form progression
async function testValidFormProgression() {
  console.log('🧪 [TDD TEST 2] Valid Form Progression Test');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 800
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4321/request', { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('📝 [TEST 2] Testing valid form progression');
    
    // Fill required Step 1 fields
    await page.type('input[name="name"]', 'Valid Test User');
    await page.type('input[name="email"]', 'valid@test.com');
    await page.type('textarea[name="backgroundPurpose"]', 'Valid test purpose for validation testing');
    
    // Click Next button
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Next') || text.includes('→'))) {
        await button.click();
        break;
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Check if we moved to Step 2
    const bodyText = await page.evaluate(() => document.body.textContent);
    const isStep2 = bodyText.includes('Project Details') || 
                   bodyText.includes('プロジェクト詳細') ||
                   bodyText.includes('Data Type') ||
                   bodyText.includes('データタイプ');
    
    if (isStep2) {
      console.log('✅ [TEST 2] PASS: Valid form progressed to Step 2');
      return true;
    } else {
      console.log('❌ [TEST 2] FAIL: Valid form did not progress to Step 2');
      console.log('Body text sample:', bodyText.substring(0, 300));
      return false;
    }
    
  } catch (error) {
    console.error('❌ [TEST 2] ERROR:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function runStep1ValidationTests() {
  console.log('🚀 [TDD] Starting Step1 Validation Tests');
  
  const test1Result = await testStep1ValidationTiming();
  const test2Result = await testValidFormProgression();
  
  console.log('\n📊 [TDD RESULTS]');
  console.log('Test 1 (Empty form validation):', test1Result ? 'PASS ✅' : 'FAIL ❌');
  console.log('Test 2 (Valid form progression):', test2Result ? 'PASS ✅' : 'FAIL ❌');
  
  if (!test1Result || !test2Result) {
    console.log('\n🔧 [TDD] Tests failing - need to implement fixes');
  } else {
    console.log('\n🎉 [TDD] All tests passing - implementation correct');
  }
}

runStep1ValidationTests().catch(console.error);