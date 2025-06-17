// Resend API直接テスト
import { Resend } from 'resend';

async function testResendAPI() {
  console.log('🔍 [RESEND TEST] Testing Resend API directly');
  
  const apiKey = 're_hgnJrhkJ_6ZFZYbP96LKF7ywdLTzUWHP9';
  const resend = new Resend(apiKey);
  
  console.log('📤 [RESEND TEST] API Key:', apiKey.substring(0, 10) + '...');
  
  try {
    // Test simple email send
    const result = await resend.emails.send({
      from: 'contact@deephandai.com',
      to: ['contact@deephandai.com'],
      subject: 'Test Email from Resend API',
      text: 'This is a test email to verify Resend API functionality.',
      html: '<p>This is a test email to verify Resend API functionality.</p>'
    });
    
    console.log('✅ [RESEND TEST] SUCCESS:', result);
    
    if (result.error) {
      console.error('❌ [RESEND TEST] API returned error:', result.error);
    } else {
      console.log('✅ [RESEND TEST] Email sent successfully, ID:', result.data?.id);
    }
    
  } catch (error) {
    console.error('❌ [RESEND TEST] Exception:', error);
    console.error('❌ [RESEND TEST] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

testResendAPI().catch(console.error);