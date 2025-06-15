// 修正後フォーム動作テスト

const testContactForm = async () => {
  const testData = {
    name: 'TDD修正テスト',
    email: 'test-fixed@example.com',
    company: 'テスト修正会社',
    subject: 'エラー修正確認テスト',
    message:
      'Astro SSR + JSON parsing + i18n修正後のテストメッセージです。\n\n修正内容:\n- prerender = false 追加\n- robust JSON parsing実装\n- useTranslation削除\n\n送信先: contact@deephandai.com',
    privacyConsent: true,
  };

  try {
    console.log('🔧 修正後フォームテスト開始...');
    console.log('📧 送信データ:', testData);

    const response = await fetch('http://localhost:4322/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('\n📊 修正後テスト結果:');
    console.log('Status:', response.status);
    console.log('Response:', result);

    if (response.ok && result.success) {
      console.log('\n✅ エラー修正成功！');
      console.log('📧 メールID:', result.emailId);
      console.log('💌 contact@deephandai.com にメールが送信されました');
      console.log('🎯 修正項目すべて正常動作');
    } else {
      console.log('\n❌ まだ問題があります');
      console.log('エラー:', result.message || result.errors);
    }
  } catch (error) {
    console.log('\n💥 テスト実行エラー:', error.message);
    console.log('💡 開発サーバーが起動していることを確認してください');
  }
};

console.log('🔍 DeepHand エラー修正後フォームテスト');
console.log('='.repeat(60));
console.log('修正内容:');
console.log('✅ Astro SSR設定 (prerender = false)');
console.log('✅ Robust JSON parsing');
console.log('✅ i18next エラー回避');
console.log('='.repeat(60));

testContactForm();
