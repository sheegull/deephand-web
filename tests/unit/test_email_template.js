// メールテンプレート生成テスト
import { readFileSync } from 'fs';
import { join } from 'path';

async function testEmailTemplate() {
  console.log('🔍 [EMAIL TEMPLATE TEST] Testing email template generation');
  
  const testData = {
    name: 'Test User',
    organization: 'Test Company',
    email: 'test@example.com',
    backgroundPurpose: 'Testing template',
    dataType: ['image'],
    dataDetails: 'Test details',
    dataVolume: '1000',
    deadline: 'March 2025',
    budget: '$5000',
    otherRequirements: 'None',
    language: 'ja'
  };
  
  try {
    // Test translation function
    console.log('📄 [TEMPLATE TEST] Testing translation loading...');
    
    const translationPath = join(process.cwd(), 'src', 'i18n', 'locales', 'ja.json');
    console.log('📄 [TEMPLATE TEST] Translation path:', translationPath);
    
    const translationContent = readFileSync(translationPath, 'utf8');
    const translations = JSON.parse(translationContent);
    
    console.log('✅ [TEMPLATE TEST] Translation file loaded successfully');
    console.log('📄 [TEMPLATE TEST] Available email keys:', Object.keys(translations.email || {}));
    
    // Test simple template generation without imports
    const simpleTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Email</title>
</head>
<body>
    <h1>Data Request - DeepHand</h1>
    <p>Name: ${testData.name}</p>
    <p>Email: ${testData.email}</p>
    <p>Organization: ${testData.organization}</p>
    <p>Background: ${testData.backgroundPurpose}</p>
</body>
</html>`;
    
    console.log('✅ [TEMPLATE TEST] Simple template generated successfully');
    console.log('📄 [TEMPLATE TEST] Template length:', simpleTemplate.length);
    
  } catch (error) {
    console.error('❌ [TEMPLATE TEST] Error:', error);
    console.error('❌ [TEMPLATE TEST] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}

testEmailTemplate().catch(console.error);