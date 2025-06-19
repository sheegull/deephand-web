// TDD テスト: RequestDataフォームの改善内容
console.log('🧪 RequestDataフォーム改善内容のTDDテスト');

const testScript = `
// ページ読み込み後にテスト実行
setTimeout(() => {
  console.log('🔍 RequestDataフォーム改善テスト開始');
  
  // テスト1: バリデーションアイコンの色テスト
  console.log('\\n📋 テスト1: バリデーションアイコンの色');
  
  // 空の状態で送信してバリデーションエラーを発生させる
  const nextButton = document.querySelector('button[type="button"]:has-text("次へ")') || 
                     Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('次へ'));
  
  if (nextButton) {
    console.log('✅ 次へボタン発見');
    nextButton.click();
    
    setTimeout(() => {
      // バリデーションエラーアイコンの色確認
      const validationIcon = document.querySelector('.bg-gradient-to-br.from-amber-500');
      if (validationIcon) {
        console.log('✅ バリデーションアイコン: 黄色 (amber) - 正常');
      } else {
        console.log('❌ バリデーションアイコン: 黄色確認失敗');
      }
    }, 500);
  }
  
  // テスト2: フォーム入力データの保持テスト
  console.log('\\n📋 テスト2: フォーム入力データの保持');
  
  // 名前フィールドに入力
  const nameField = document.querySelector('input[name="name"]');
  if (nameField) {
    nameField.value = 'テスト太郎';
    nameField.dispatchEvent(new Event('input', { bubbles: true }));
    nameField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ 名前入力:', nameField.value);
  }
  
  // メールフィールドに入力
  const emailField = document.querySelector('input[name="email"]');
  if (emailField) {
    emailField.value = 'test@example.com';
    emailField.dispatchEvent(new Event('input', { bubbles: true }));
    emailField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ メール入力:', emailField.value);
  }
  
  // 背景・目的フィールドに入力
  const backgroundField = document.querySelector('textarea[name="backgroundPurpose"]');
  if (backgroundField) {
    backgroundField.value = 'テスト用の背景・目的です。これは10文字以上のテキストです。';
    backgroundField.dispatchEvent(new Event('input', { bubbles: true }));
    backgroundField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ 背景・目的入力:', backgroundField.value);
    
    // 文字数カウンターの確認
    setTimeout(() => {
      const charCounter = document.querySelector('span:has-text("/ 1000")') ||
                          Array.from(document.querySelectorAll('span')).find(span => 
                            span.textContent.includes('/ 1000'));
      if (charCounter) {
        console.log('✅ 文字数カウンター:', charCounter.textContent);
      }
    }, 200);
  }
  
  // テスト3: Step間でのデータ保持確認
  setTimeout(() => {
    console.log('\\n📋 テスト3: Step間でのデータ保持');
    
    // 次へボタンを再度クリック（今度は有効な入力済み）
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
      console.log('✅ Step2に移動試行');
      
      setTimeout(() => {
        // Step2に移動したかチェック
        const step2Indicator = document.querySelector('.bg-\\\\[\\\\#234ad9\\\\].text-white') ||
                              Array.from(document.querySelectorAll('div')).find(div => 
                                div.textContent.includes('2'));
        
        if (step2Indicator) {
          console.log('✅ Step2に正常移動');
          
          // 戻るボタンをクリック
          const prevButton = document.querySelector('button:has-text("← 前へ")') ||
                            Array.from(document.querySelectorAll('button')).find(btn => 
                              btn.textContent.includes('前へ'));
          
          if (prevButton) {
            prevButton.click();
            console.log('✅ Step1に戻る');
            
            setTimeout(() => {
              // データが保持されているかチェック
              const nameCheck = document.querySelector('input[name="name"]').value;
              const emailCheck = document.querySelector('input[name="email"]').value;
              const backgroundCheck = document.querySelector('textarea[name="backgroundPurpose"]').value;
              
              console.log('📊 データ保持確認:');
              console.log('名前:', nameCheck === 'テスト太郎' ? '✅ 保持' : '❌ 失われた');
              console.log('メール:', emailCheck === 'test@example.com' ? '✅ 保持' : '❌ 失われた');
              console.log('背景:', backgroundCheck.length > 10 ? '✅ 保持' : '❌ 失われた');
              
            }, 500);
          }
        }
      }, 1000);
    } else {
      console.log('❌ 次へボタンが無効（バリデーションエラー）');
    }
  }, 2000);
  
}, 2000);
`;

console.log('📋 ブラウザのコンソールで以下のスクリプトを実行してください:');
console.log('1. http://localhost:4321/request にアクセス');
console.log('2. ブラウザの開発者ツールを開く');
console.log('3. コンソールに以下のコードを貼り付けて実行:');
console.log('\\n' + testScript);