import puppeteer from 'puppeteer';

// 言語切り替えとフォント読み込みパフォーマンステスト
async function testLanguageSwitchingPerformance() {
  console.log('🧪 Starting Language & Font Performance Tests');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Performance monitoring setup
    await page.setCacheEnabled(false); // Force fresh loads
    
    // Test Case 1: Initial Page Load Performance
    console.log('\n=== Test 1: Initial Page Load ===');
    const loadStartTime = Date.now();
    
    await page.goto('http://localhost:4323', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    const loadEndTime = Date.now();
    console.log(`Page load time: ${loadEndTime - loadStartTime}ms`);
    
    // Test Case 2: Font Loading Detection
    console.log('\n=== Test 2: Font Loading ===');
    
    const fontLoadTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        
        // Check if Alliance font is loaded
        function checkFontLoaded() {
          const testElement = document.createElement('div');
          testElement.style.fontFamily = '"Alliance No.2", sans-serif';
          testElement.style.fontSize = '16px';
          testElement.style.position = 'absolute';
          testElement.style.left = '-9999px';
          testElement.textContent = 'Test';
          document.body.appendChild(testElement);
          
          const computedStyle = window.getComputedStyle(testElement);
          const fontFamily = computedStyle.fontFamily;
          
          document.body.removeChild(testElement);
          
          if (fontFamily.includes('Alliance')) {
            const endTime = performance.now();
            resolve(endTime - startTime);
          } else {
            setTimeout(checkFontLoaded, 10);
          }
        }
        
        checkFontLoaded();
      });
    });
    
    console.log(`Font load time: ${fontLoadTime}ms`);
    
    // Test Case 3: Language Switch Detection & Performance
    console.log('\n=== Test 3: Language Switch Performance ===');
    
    // Take initial screenshot for Japanese
    await page.screenshot({ path: 'test_screenshots/ja_initial.png' });
    
    // Find and click language toggle
    const languageToggle = await page.waitForSelector('[data-testid="language-toggle"], .language-toggle, button:has-text("EN")');
    
    // Monitor language switch performance
    const switchStartTime = Date.now();
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      languageToggle.click()
    ]);
    
    const switchEndTime = Date.now();
    console.log(`Language switch time: ${switchEndTime - switchStartTime}ms`);
    
    // Test specific request page navigation
    console.log('\n=== Test 3.1: Request Page Navigation from EN Mode ===');
    
    // Get Startedボタンを探してクリック
    const getStartedButton = await page.waitForSelector('button:has-text("Get Started"), button:has-text("Request Data"), [data-testid="request-button"]');
    
    const requestNavStartTime = Date.now();
    
    // スクリーンショットを撮ってページ遷移をモニタリング
    let frameCount = 0;
    const frameInterval = setInterval(async () => {
      frameCount++;
      try {
        await page.screenshot({ path: `test_screenshots/request_nav_frame_${frameCount}.png` });
      } catch (e) {
        console.log(`Screenshot ${frameCount} failed:`, e.message);
      }
      
      if (frameCount >= 10) { // 1秒間（100ms間隔で10フレーム）
        clearInterval(frameInterval);
      }
    }, 100);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      getStartedButton.click()
    ]);
    
    clearInterval(frameInterval);
    
    const requestNavEndTime = Date.now();
    console.log(`Request page navigation time: ${requestNavEndTime - requestNavStartTime}ms`);
    
    // /en/request または /request にいることを確認
    const currentUrl = page.url();
    console.log(`Current URL after navigation: ${currentUrl}`);
    
    // ページ内容が英語かどうかをチェック
    const pageContent = await page.evaluate(() => {
      const textElements = Array.from(document.querySelectorAll('h1, h2, p, span, button, label'));
      const texts = textElements.map(el => el.textContent).filter(text => text && text.trim().length > 0);
      
      let japaneseCount = 0;
      let englishCount = 0;
      
      texts.forEach(text => {
        if (/[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(text)) {
          japaneseCount++;
        }
        if (/[a-zA-Z]/.test(text) && !/[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(text)) {
          englishCount++;
        }
      });
      
      return {
        totalTexts: texts.length,
        japaneseTexts: japaneseCount,
        englishTexts: englishCount,
        sampleTexts: texts.slice(0, 5)
      };
    });
    
    console.log('Page content analysis:', pageContent);
    
    // 日本語テキストがあるかどうかでラグを判定
    const hasLanguageLag = pageContent.japaneseTexts > 0;
    console.log(`Language lag detected: ${hasLanguageLag}`);
    
    await page.screenshot({ path: 'test_screenshots/request_page_final.png' });
    
    // Test Case 4: Text Flash Detection
    console.log('\n=== Test 4: Text Flash Detection ===');
    
    const textFlashData = await page.evaluate(() => {
      const textElements = Array.from(document.querySelectorAll('h1, h2, p, span, button'));
      const flashingElements = [];
      
      textElements.forEach(element => {
        const textContent = element.textContent;
        if (textContent) {
          // Check if element contains mix of Japanese and English characters
          const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(textContent);
          const hasEnglish = /[a-zA-Z]/.test(textContent);
          
          if (hasJapanese && hasEnglish) {
            flashingElements.push({
              text: textContent.substring(0, 50),
              className: element.className,
              tagName: element.tagName
            });
          }
        }
      });
      
      return {
        totalElements: textElements.length,
        flashingElements: flashingElements
      };
    });
    
    console.log('Text flash analysis:', textFlashData);
    
    // Take final screenshot for English
    await page.screenshot({ path: 'test_screenshots/en_final.png' });
    
    // Test Case 5: Repeated Language Switching
    console.log('\n=== Test 5: Repeated Language Switching ===');
    
    const switchTimes = [];
    
    for (let i = 0; i < 3; i++) {
      // Switch back to Japanese
      const backButton = await page.waitForSelector('[data-testid="language-toggle"], .language-toggle, button:has-text("JA")');
      
      const switchBackStart = Date.now();
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        backButton.click()
      ]);
      const switchBackEnd = Date.now();
      
      switchTimes.push(switchBackEnd - switchBackStart);
      
      // Wait a bit before next switch
      await page.waitForTimeout(500);
      
      // Switch back to English
      const enButton = await page.waitForSelector('[data-testid="language-toggle"], .language-toggle, button:has-text("EN")');
      
      const switchEnStart = Date.now();
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        enButton.click()
      ]);
      const switchEnEnd = Date.now();
      
      switchTimes.push(switchEnEnd - switchEnStart);
      
      await page.waitForTimeout(500);
    }
    
    const avgSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
    console.log(`Average switch time: ${avgSwitchTime}ms`);
    console.log(`Switch times: ${switchTimes.join(', ')}ms`);
    
    // Test Case 6: Performance Metrics
    console.log('\n=== Test 6: Performance Metrics ===');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    // Generate Test Report
    const testReport = {
      timestamp: new Date().toISOString(),
      results: {
        pageLoadTime: loadEndTime - loadStartTime,
        fontLoadTime: fontLoadTime,
        languageSwitchTime: switchEndTime - switchStartTime,
        averageSwitchTime: avgSwitchTime,
        textFlashElements: textFlashData.flashingElements.length,
        performanceMetrics: performanceMetrics
      },
      thresholds: {
        pageLoadTime: { target: 2000, status: (loadEndTime - loadStartTime) < 2000 ? 'PASS' : 'FAIL' },
        fontLoadTime: { target: 100, status: fontLoadTime < 100 ? 'PASS' : 'FAIL' },
        languageSwitchTime: { target: 1000, status: (switchEndTime - switchStartTime) < 1000 ? 'PASS' : 'FAIL' },
        textFlash: { target: 0, status: textFlashData.flashingElements.length === 0 ? 'PASS' : 'FAIL' }
      }
    };
    
    console.log('\n=== Test Report ===');
    console.log(JSON.stringify(testReport, null, 2));
    
    return testReport;
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Export for use in other files
export { testLanguageSwitchingPerformance };

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testLanguageSwitchingPerformance();
}