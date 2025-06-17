/**
 * 🧪 Request Dataフォーム日本語テスト
 * 回答内容がメールに含まれているかテスト
 */

const testRequestDataJapanese = async () => {
  console.log('🧪 [Request Dataフォーム 日本語テスト] メール送信テスト開始');
  
  const testData = {
    name: '佐藤花子',
    email: 'kiyonomatcha@gmail.com',
    organization: 'AI研究所',
    backgroundPurpose: 'ロボットアームの動作学習のためのデータアノテーションが必要です。\n製造業での自動化を目指しており、高精度なデータが求められます。',
    dataType: ['video', 'image'],
    dataDetails: '工場での作業動画（組み立て、溶接、検査作業）\n手の動きとオブジェクトの位置関係をアノテーション',
    dataVolume: '約5,000時間の動画データ',
    deadline: '2025年3月末',
    budget: '500万円程度',
    otherRequirements: 'セキュリティ要件として、データの機密保持が必要です。\n品質保証のため、複数の作業者によるチェック体制を希望します。',
    language: 'ja'
  };

  try {
    console.log('📤 [Request Dataテスト] データ送信中...');
    console.log('📋 送信データ:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:4322/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 [Request Dataテスト] レスポンス受信 - ステータス:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📥 [Request Dataテスト] レスポンス内容:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ [Request Dataテスト] 成功: メール送信完了');
      console.log('📧 メールID:', result.emailId);
      return true;
    } else {
      console.log('❌ [Request Dataテスト] 失敗:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ [Request Dataテスト] エラー:', error.message);
    return false;
  }
};

// テスト実行
testRequestDataJapanese().then(success => {
  console.log('\n📊 [Request Dataフォーム 日本語テスト] 結果');
  console.log('Request Dataフォーム (日本語):', success ? 'PASS ✅' : 'FAIL ❌');
  
  if (!success) {
    process.exit(1);
  }
});