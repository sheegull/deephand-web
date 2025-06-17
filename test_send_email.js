// sendDataRequestEmail関数を直接テスト
import { Resend } from 'resend';

const ENV = {
  RESEND_API_KEY: 're_hgnJrhkJ_6ZFZYbP96LKF7ywdLTzUWHP9',
  REQUESTS_EMAIL: 'requests@deephandai.com',
  ADMIN_EMAIL: 'contact@deephandai.com',
  TEST_EMAIL_RECIPIENT: 'contact@deephandai.com',
  NOREPLY_EMAIL: 'noreply@deephandai.com'
};

// Simple template generator
function generateSimpleHtml(data, language) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Data Request - DeepHand</title>
</head>
<body>
    <h1>データリクエスト - DeepHand</h1>
    <h2>お客様情報</h2>
    <p><strong>お名前:</strong> ${data.name}</p>
    <p><strong>メールアドレス:</strong> ${data.email}</p>
    <p><strong>組織名:</strong> ${data.organization || '未入力'}</p>
    
    <h2>プロジェクト詳細</h2>
    <p><strong>背景・目的:</strong> ${data.backgroundPurpose}</p>
    <p><strong>データタイプ:</strong> ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}</p>
    <p><strong>データ詳細:</strong> ${data.dataDetails || '未入力'}</p>
    <p><strong>データ量:</strong> ${data.dataVolume || '未入力'}</p>
    <p><strong>締切:</strong> ${data.deadline || '未入力'}</p>
    <p><strong>予算:</strong> ${data.budget || '未入力'}</p>
    <p><strong>その他要件:</strong> ${data.otherRequirements || '未入力'}</p>
</body>
</html>`;
}

function generateSimpleText(data, language) {
  return `
データリクエスト - DeepHand

お客様情報:
お名前: ${data.name}
メールアドレス: ${data.email}
組織名: ${data.organization || '未入力'}

プロジェクト詳細:
背景・目的: ${data.backgroundPurpose}
データタイプ: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}
データ詳細: ${data.dataDetails || '未入力'}
データ量: ${data.dataVolume || '未入力'}
締切: ${data.deadline || '未入力'}
予算: ${data.budget || '未入力'}
その他要件: ${data.otherRequirements || '未入力'}
`;
}

async function testSendDataRequestEmail() {
  console.log('🔍 [SEND EMAIL TEST] Testing sendDataRequestEmail function');
  
  const testData = {
    name: 'Test User',
    organization: 'Test Company',
    email: 'test@example.com',
    backgroundPurpose: 'Testing email sending',
    dataType: ['image', 'video'],
    dataDetails: 'Test data details',
    dataVolume: '1000 samples',
    deadline: 'March 2025',
    budget: '$5000',
    otherRequirements: 'Test requirements',
    language: 'ja'
  };
  
  try {
    console.log('📤 [SEND EMAIL TEST] Creating Resend client...');
    const resend = new Resend(ENV.RESEND_API_KEY);
    
    console.log('📤 [SEND EMAIL TEST] Generating email templates...');
    const htmlContent = generateSimpleHtml(testData, 'ja');
    const textContent = generateSimpleText(testData, 'ja');
    
    console.log('📤 [SEND EMAIL TEST] HTML content length:', htmlContent.length);
    console.log('📤 [SEND EMAIL TEST] Text content length:', textContent.length);
    
    console.log('📤 [SEND EMAIL TEST] Sending sales email...');
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: testData.email,
      subject: 'データリクエスト - DeepHand',
      html: htmlContent,
      text: textContent,
    });
    
    console.log('📥 [SEND EMAIL TEST] Sales email result:', salesEmailResult);
    
    if (salesEmailResult.error) {
      console.error('❌ [SEND EMAIL TEST] Sales email failed:', salesEmailResult.error);
      return;
    }
    
    console.log('📤 [SEND EMAIL TEST] Sending user confirmation email...');
    const userEmailResult = await resend.emails.send({
      from: ENV.NOREPLY_EMAIL,
      to: testData.email,
      subject: 'データリクエストを受け付けました - DeepHand',
      html: '<p>データリクエストを受け付けました。24時間以内にご連絡いたします。</p>',
      text: 'データリクエストを受け付けました。24時間以内にご連絡いたします。',
    });
    
    console.log('📥 [SEND EMAIL TEST] User email result:', userEmailResult);
    
    if (userEmailResult.error) {
      console.error('❌ [SEND EMAIL TEST] User email failed:', userEmailResult.error);
    }
    
    console.log('✅ [SEND EMAIL TEST] All emails sent successfully!');
    
  } catch (error) {
    console.error('❌ [SEND EMAIL TEST] Exception:', error);
    console.error('❌ [SEND EMAIL TEST] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}

testSendDataRequestEmail().catch(console.error);