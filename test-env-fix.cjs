// 環境変数修正テスト

console.log('🔧 環境変数修正テスト開始...');
console.log('='.repeat(50));

// 1. 修正前状態確認
console.log('📊 修正前 process.env:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY || '❌ undefined');

// 2. 手動dotenv読み込み
console.log('\n🔧 手動dotenv読み込み実行...');
try {
  const { config } = require('dotenv');
  const result = config({ path: '.env.local' });
  
  if (result.error) {
    console.log('❌ dotenv エラー:', result.error);
  } else {
    console.log('✅ dotenv 読み込み成功');
    console.log('読み込まれた変数数:', Object.keys(result.parsed || {}).length);
  }
} catch (error) {
  console.log('❌ dotenv require失敗:', error.message);
}

// 3. 修正後状態確認
console.log('\n📈 修正後 process.env:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ 設定済み' : '❌ 未設定');
console.log('PUBLIC_SITE_URL:', process.env.PUBLIC_SITE_URL || '❌ 未設定');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ 未設定');

// 4. API Key検証
if (process.env.RESEND_API_KEY) {
  console.log('\n🎯 API Key検証:');
  console.log('形式:', process.env.RESEND_API_KEY.startsWith('re_') ? '✅ 正常' : '❌ 不正');
  console.log('長さ:', process.env.RESEND_API_KEY.length, '文字');
  console.log('先頭10文字:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
}

// 5. 手動でのenv.ts import テスト
console.log('\n🧪 env.ts 読み込みテスト:');
try {
  // CommonJSからESModuleの読み込みテスト
  console.log('TypeScript/ESModule環境では別途テストが必要');
  console.log('開発サーバー起動時にenv.tsが正常に動作するかを確認');
} catch (error) {
  console.log('テストエラー:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('✅ 修正テスト完了 - 開発サーバーを再起動してください');