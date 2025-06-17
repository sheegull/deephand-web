// Emergency test for RequestData form input functionality
console.log('🚨 緊急テスト: RequestDataフォームの入力機能確認');

// ブラウザでテストするためのスクリプト
const testScript = `
// ページが読み込まれたらテスト実行
setTimeout(() => {
  console.log('🔍 RequestDataフォームテスト開始');
  
  // 名前フィールドのテスト
  const nameField = document.querySelector('input[name="name"]');
  if (nameField) {
    console.log('✅ 名前フィールド発見');
    nameField.focus();
    nameField.value = 'テスト太郎';
    nameField.dispatchEvent(new Event('input', { bubbles: true }));
    nameField.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      if (nameField.value === 'テスト太郎') {
        console.log('✅ 名前フィールド入力: 成功');
      } else {
        console.log('❌ 名前フィールド入力: 失敗', nameField.value);
      }
    }, 500);
  } else {
    console.log('❌ 名前フィールドが見つかりません');
  }
  
  // メールフィールドのテスト
  const emailField = document.querySelector('input[name="email"]');
  if (emailField) {
    console.log('✅ メールフィールド発見');
    emailField.focus();
    emailField.value = 'test@example.com';
    emailField.dispatchEvent(new Event('input', { bubbles: true }));
    emailField.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      if (emailField.value === 'test@example.com') {
        console.log('✅ メールフィールド入力: 成功');
      } else {
        console.log('❌ メールフィールド入力: 失敗', emailField.value);
      }
    }, 500);
  } else {
    console.log('❌ メールフィールドが見つかりません');
  }
  
  // テキストエリアのテスト
  const backgroundField = document.querySelector('textarea[name="backgroundPurpose"]');
  if (backgroundField) {
    console.log('✅ 背景・目的フィールド発見');
    backgroundField.focus();
    backgroundField.value = 'テスト用の背景・目的です。';
    backgroundField.dispatchEvent(new Event('input', { bubbles: true }));
    backgroundField.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      if (backgroundField.value === 'テスト用の背景・目的です。') {
        console.log('✅ 背景・目的フィールド入力: 成功');
      } else {
        console.log('❌ 背景・目的フィールド入力: 失敗', backgroundField.value);
      }
    }, 500);
  } else {
    console.log('❌ 背景・目的フィールドが見つかりません');
  }
  
}, 2000);
`;

console.log('📋 ブラウザのコンソールで以下のスクリプトを実行してください:');
console.log('1. http://localhost:4321/request にアクセス');
console.log('2. ブラウザの開発者ツールを開く');
console.log('3. コンソールに以下のコードを貼り付けて実行:');
console.log('\\n' + testScript);