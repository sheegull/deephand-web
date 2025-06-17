/**
 * 🧪 お問い合わせフォーム日本語テスト
 * 回答内容がメールに含まれているかテスト
 */

const testContactFormJapanese = async () => {
  console.log('🧪 [お問い合わせフォーム 日本語テスト] メール送信テスト開始');
  
  const testData = {
    name: '田中太郎',
    email: 'kiyonomatcha@gmail.com',
    organization: 'ロボティクス株式会社',
    message: 'ロボットの学習データアノテーションについてお聞きしたいです。\n具体的には画像認識用のデータセットを作成したいと考えています。',
    language: 'ja'
  };

  try {
    console.log('📤 [お問い合わせテスト] データ送信中...');
    console.log('📋 送信データ:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:4321/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 [お問い合わせテスト] レスポンス受信 - ステータス:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📥 [お問い合わせテスト] レスポンス内容:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ [お問い合わせテスト] 成功: メール送信完了');
      console.log('📧 メールID:', result.emailId);
      return true;
    } else {
      console.log('❌ [お問い合わせテスト] 失敗:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ [お問い合わせテスト] エラー:', error.message);
    return false;
  }
};

// テスト実行
testContactFormJapanese().then(success => {
  console.log('\n📊 [お問い合わせフォーム 日本語テスト] 結果');
  console.log('お問い合わせフォーム (日本語):', success ? 'PASS ✅' : 'FAIL ❌');
  
  if (!success) {
    process.exit(1);
  }
});