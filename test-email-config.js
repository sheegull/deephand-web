// Email設定と機能テスト

import { validateEmailConfig } from './src/lib/email.js';

console.log('🔍 DeepHand Email設定テスト');
console.log('='.repeat(50));

// 環境変数の確認
console.log('\n📧 環境変数確認:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '設定済み' : '未設定');
console.log('PUBLIC_SITE_URL:', process.env.PUBLIC_SITE_URL || '未設定');
console.log('NODE_ENV:', process.env.NODE_ENV || 'default');

// メール設定の検証
console.log('\n⚙️ メール設定検証:');
try {
  const validation = validateEmailConfig();
  console.log('設定状態:', validation.isValid ? '✅ 正常' : '❌ 問題あり');

  if (!validation.isValid) {
    console.log('エラー詳細:', validation.errors);
  }
} catch (error) {
  console.log('検証エラー:', error.message);
}

console.log('\n📝 フォーム手動テスト手順:');
console.log('1. 開発サーバー起動: npm run dev');
console.log('2. ブラウザで http://localhost:4322/contact にアクセス');
console.log('3. フォームに以下のテストデータを入力:');
console.log('   ・名前: テストユーザー');
console.log('   ・メール: test@example.com');
console.log('   ・会社: テスト会社');
console.log('   ・件名: フォーム動作確認テスト');
console.log('   ・メッセージ: contact@deephandai.com 宛のテストメッセージです');
console.log('4. 送信ボタンをクリック');
console.log('5. contact@deephandai.com でメール受信確認');

console.log('\n💡 注意:');
console.log('・実際のメール送信には有効なRESEND_API_KEYが必要です');
console.log('・テスト用のAPI keyを使用している場合、メールは送信されません');
console.log('・本番環境では contact@deephandai.com にメールが届きます');
