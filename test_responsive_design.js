import puppeteer from 'puppeteer';

// デバイスサイズ設定
const devices = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Small Mobile', width: 320, height: 568 }
];

async function testResponsiveDesign() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // 開発サーバーのURL
    const baseUrl = 'http://localhost:4323';
    
    for (const device of devices) {
      console.log(`\n=== ${device.name} (${device.width}x${device.height}) のテスト開始 ===`);
      
      // ビューポート設定
      await page.setViewport({
        width: device.width,
        height: device.height
      });

      // トップページテスト
      console.log('1. トップページのテスト');
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // フォームとボタンの重なりチェック
      const formOverlapCheck = await page.evaluate(() => {
        const formSection = document.querySelector('form, [class*="form"]');
        const dataRequestButton = document.querySelector('[href*="request"], button[class*="request"], a[class*="request"]');
        
        if (formSection && dataRequestButton) {
          const formRect = formSection.getBoundingClientRect();
          const buttonRect = dataRequestButton.getBoundingClientRect();
          
          // 重なりチェック
          const isOverlapping = !(formRect.right < buttonRect.left || 
                                buttonRect.right < formRect.left || 
                                formRect.bottom < buttonRect.top || 
                                buttonRect.bottom < formRect.top);
          
          return {
            hasOverlap: isOverlapping,
            formPosition: formRect,
            buttonPosition: buttonRect
          };
        }
        return { hasOverlap: false, message: 'Elements not found' };
      });
      
      console.log('フォーム重なりチェック:', formOverlapCheck);

      // ページ全体の高さチェック
      const pageMetrics = await page.evaluate(() => {
        return {
          viewportHeight: window.innerHeight,
          documentHeight: document.documentElement.scrollHeight,
          needsScroll: document.documentElement.scrollHeight > window.innerHeight,
          visibleContentHeight: Math.min(window.innerHeight, document.documentElement.scrollHeight)
        };
      });
      
      console.log('ページメトリクス:', pageMetrics);

      // RequestDataページテスト
      console.log('2. RequestDataページのテスト');
      await page.goto(`${baseUrl}/request-data`, { waitUntil: 'networkidle2' });
      
      // レスポンシブレイアウトチェック
      const layoutCheck = await page.evaluate(() => {
        const container = document.querySelector('.grid, .flex, [class*="grid-cols"]');
        const inputs = document.querySelectorAll('input, textarea, select');
        
        const inputStyles = Array.from(inputs).map(input => {
          const rect = input.getBoundingClientRect();
          const style = window.getComputedStyle(input);
          return {
            width: rect.width,
            height: rect.height,
            overflow: rect.right > window.innerWidth,
            fontSize: style.fontSize,
            padding: style.padding
          };
        });
        
        return {
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          inputCount: inputs.length,
          overflowingInputs: inputStyles.filter(i => i.overflow).length,
          minInputWidth: Math.min(...inputStyles.map(i => i.width)),
          maxInputWidth: Math.max(...inputStyles.map(i => i.width))
        };
      });
      
      console.log('レイアウトチェック:', layoutCheck);

      // スクリーンショット保存
      await page.screenshot({ 
        path: `test_screenshots/${device.name.toLowerCase()}_homepage.png`,
        fullPage: true 
      });
      
      await page.goto(`${baseUrl}/request-data`, { waitUntil: 'networkidle2' });
      await page.screenshot({ 
        path: `test_screenshots/${device.name.toLowerCase()}_requestdata.png`,
        fullPage: true 
      });

      // 短い待機
      await page.waitForTimeout(1000);
    }

    console.log('\n=== レスポンシブデザインテスト完了 ===');
    console.log('スクリーンショットは test_screenshots/ フォルダに保存されました');

  } catch (error) {
    console.error('テスト実行エラー:', error);
  } finally {
    await browser.close();
  }
}

// テスト実行
testResponsiveDesign();