import puppeteer from 'puppeteer';

async function testRequestPageFixes() {
  console.log('🧪 RequestDataページの修正内容をテスト開始...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 500,
    defaultViewport: { width: 1280, height: 1024 }
  });
  const page = await browser.newPage();

  try {
    // RequestDataページに移動
    await page.goto('http://localhost:4321/request', { waitUntil: 'networkidle2' });
    console.log('✅ RequestDataページに移動完了');

    // テスト1: フォームデータの永続化テスト
    console.log('🔍 テスト1: フォームデータの永続化');
    
    // Step1でデータを入力
    await page.fill('[name="name"]', 'テスト太郎');
    await page.fill('[name="organization"]', 'テスト会社');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="backgroundPurpose"]', 'テスト用の背景と目的を記載します。これは最低5文字以上必要です。');
    
    console.log('✅ Step1にデータ入力完了');
    
    // 次へボタンをクリック
    await page.click('button:has-text("次へ →")');
    await page.waitForTimeout(1000);
    
    // Step2に移動していることを確認
    const step2Visible = await page.isVisible('text=プロジェクト詳細');
    if (step2Visible) {
      console.log('✅ Step2に正常に移動');
    }
    
    // 戻るボタンをクリック
    await page.click('button:has-text("← 前へ")');
    await page.waitForTimeout(1000);
    
    // Step1のデータが保持されているかチェック
    const nameValue = await page.inputValue('[name="name"]');
    const emailValue = await page.inputValue('[name="email"]');
    const backgroundValue = await page.inputValue('[name="backgroundPurpose"]');
    
    if (nameValue === 'テスト太郎' && emailValue === 'test@example.com' && backgroundValue.length > 0) {
      console.log('✅ フォームデータの永続化: 成功');
    } else {
      console.log('❌ フォームデータの永続化: 失敗');
      console.log(`- 名前: ${nameValue}`);
      console.log(`- メール: ${emailValue}`);
      console.log(`- 背景: ${backgroundValue.substring(0, 50)}...`);
    }

    // テスト2: Otherテキストボックスのレイアウトテスト
    console.log('🔍 テスト2: Otherテキストボックスのレイアウト');
    
    // Step2に再度移動
    await page.click('button:has-text("次へ →")');
    await page.waitForTimeout(1000);
    
    // Otherチェックボックスをクリック
    await page.check('input[type="checkbox"][id="other"]');
    await page.waitForTimeout(500);
    
    // Otherテキストボックスが表示されることを確認
    const otherTextbox = await page.isVisible('input[placeholder*="具体的な内容"]');
    if (otherTextbox) {
      console.log('✅ Otherテキストボックス表示: 成功');
      
      // テキストボックスの位置を確認
      const textboxBounds = await page.boundingBox('input[placeholder*="具体的な内容"]');
      const parentBounds = await page.boundingBox('div:has(input[placeholder*="具体的な内容"])');
      
      if (textboxBounds && parentBounds) {
        const rightAlign = Math.abs((textboxBounds.x + textboxBounds.width) - (parentBounds.x + parentBounds.width)) < 10;
        if (rightAlign) {
          console.log('✅ Otherテキストボックスの右端配置: 正常');
        } else {
          console.log('❌ Otherテキストボックスの右端配置: 要調整');
        }
      }
    } else {
      console.log('❌ Otherテキストボックス表示: 失敗');
    }

    // テスト3: バリデーション表示タイミングテスト
    console.log('🔍 テスト3: バリデーション表示タイミング');
    
    // データを全て削除
    await page.fill('[name="dataVolume"]', '');
    await page.fill('[name="deadline"]', '');
    await page.fill('[name="budget"]', '');
    
    // 入力中にエラーメッセージが表示されないことを確認
    await page.waitForTimeout(1000);
    const errorMessages = await page.$$('text=/.*は.*してください/');
    
    if (errorMessages.length === 0) {
      console.log('✅ 入力中バリデーション非表示: 正常');
    } else {
      console.log('❌ 入力中バリデーション非表示: 失敗 - エラーメッセージが表示されています');
    }
    
    // 送信ボタンを押してバリデーションをテスト
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // バリデーションエラーが表示されることを確認
    const validationErrors = await page.$$('text=/.*は.*してください|.*を.*してください/');
    
    if (validationErrors.length > 0) {
      console.log('✅ 送信時バリデーション表示: 正常');
    } else {
      console.log('❌ 送信時バリデーション表示: 失敗');
    }

    console.log('🎉 全テスト完了');

  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  } finally {
    await browser.close();
  }
}

// テスト実行
testRequestPageFixes().catch(console.error);