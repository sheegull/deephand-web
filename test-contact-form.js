// フォームテスト用スクリプト

const testContactForm = async () => {
  const testData = {
    name: 'テストユーザー',
    email: 'test@example.com',
    company: 'テスト会社',
    subject: 'フォーム動作テスト',
    message:
      'これはDeepHandのお問い合わせフォームの動作確認テストです。\n\n項目:\n- フォーム送信機能\n- メール配信機能\n- エラーハンドリング\n\n送信日時: ' +
      new Date().toLocaleString('ja-JP'),
  };

  try {
    console.log('🧪 フォームテスト開始...');
    console.log('📧 送信データ:', testData);

    const response = await fetch('http://localhost:4322/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('\n📊 テスト結果:');
    console.log('Status:', response.status);
    console.log('Response:', result);

    if (response.ok && result.success) {
      console.log('\n✅ フォームテスト成功！');
      console.log('📧 メールID:', result.emailId);
      console.log('💌 contact@deephandai.com にメールが送信されました');
    } else {
      console.log('\n❌ フォームテスト失敗');
      console.log('エラー:', result.message || result.errors);
    }
  } catch (error) {
    console.log('\n💥 テスト実行エラー:', error.message);
    console.log('💡 開発サーバーが起動していることを確認してください');
  }
};

// サーバー起動確認
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:4322');
    if (response.ok) {
      console.log('🚀 開発サーバー確認OK');
      await testContactForm();
    } else {
      console.log('❌ 開発サーバーにアクセスできません');
    }
  } catch (error) {
    console.log('❌ 開発サーバーが起動していません');
    console.log('💡 まず "npm run dev" で開発サーバーを起動してください');
  }
};

console.log('🔍 DeepHand フォーム動作テスト');
console.log('=' * 50);
checkServer();
