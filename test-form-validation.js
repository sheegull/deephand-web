// フォームバリデーションテスト

import { contactFormSchema } from './src/lib/validationSchemas.js';

console.log('🔍 DeepHand フォームバリデーションテスト');
console.log('=' * 50);

// テストケース1: 正常なデータ
const validData = {
  name: '山田太郎',
  email: 'test@example.com',
  company: 'テスト株式会社',
  subject: 'お問い合わせテスト',
  message:
    'これはフォームの動作確認用テストメッセージです。\n\n内容:\n- バリデーション機能\n- 必須項目チェック\n- データ形式確認',
};

console.log('\n✅ テストケース1: 正常データ');
try {
  const result = contactFormSchema.safeParse(validData);
  console.log('結果:', result.success ? '成功' : '失敗');
  if (!result.success) {
    console.log('エラー:', result.error.flatten().fieldErrors);
  } else {
    console.log('パースされたデータ:', result.data);
  }
} catch (error) {
  console.log('エラー:', error.message);
}

// テストケース2: 必須項目不足
const invalidData = {
  name: '',
  email: 'invalid-email',
  subject: '',
  message: '',
};

console.log('\n❌ テストケース2: 不正データ');
try {
  const result = contactFormSchema.safeParse(invalidData);
  console.log('結果:', result.success ? '成功' : '失敗');
  if (!result.success) {
    console.log('エラー詳細:', result.error.flatten().fieldErrors);
  }
} catch (error) {
  console.log('エラー:', error.message);
}

// テストケース3: 境界値テスト
const boundaryData = {
  name: 'A'.repeat(100), // 長い名前
  email: 'test@example.com',
  company: 'A'.repeat(200), // 長い会社名
  subject: 'A'.repeat(200), // 長い件名
  message: 'A'.repeat(2000), // 長いメッセージ
};

console.log('\n⚠️  テストケース3: 境界値データ');
try {
  const result = contactFormSchema.safeParse(boundaryData);
  console.log('結果:', result.success ? '成功' : '失敗');
  if (!result.success) {
    console.log('エラー:', result.error.flatten().fieldErrors);
  }
} catch (error) {
  console.log('エラー:', error.message);
}

console.log('\n🎯 フォーム動作確認手順:');
console.log('1. ローカルサーバー起動: npm run dev');
console.log('2. ブラウザで http://localhost:4321/contact にアクセス');
console.log('3. フォームに以下のテストデータを入力:');
console.log('   名前: テストユーザー');
console.log('   メール: your-email@example.com');
console.log('   会社: テスト会社');
console.log('   件名: フォーム動作確認');
console.log('   メッセージ: これはテストメッセージです');
console.log('4. 送信ボタンをクリック');
console.log('5. contact@deephandai.com でメール受信確認');
