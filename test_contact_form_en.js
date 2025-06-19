/**
 * 🧪 Contact Form English Test
 * Test if response content is included in emails
 */

const testContactFormEnglish = async () => {
  console.log('🧪 [Contact Form English Test] Email sending test started');
  
  const testData = {
    name: 'John Smith',
    email: 'kiyonomatcha@gmail.com',
    organization: 'Robotics Corp',
    message: 'I would like to inquire about robot training data annotation services.\nSpecifically, I want to create datasets for computer vision applications.',
    language: 'en'
  };

  try {
    console.log('📤 [Contact Test] Sending data...');
    console.log('📋 Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:4321/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 [Contact Test] Response received - Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📥 [Contact Test] Response content:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ [Contact Test] Success: Email sent successfully');
      console.log('📧 Email ID:', result.emailId);
      return true;
    } else {
      console.log('❌ [Contact Test] Failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ [Contact Test] Error:', error.message);
    return false;
  }
};

// Run test
testContactFormEnglish().then(success => {
  console.log('\n📊 [Contact Form English Test] Result');
  console.log('Contact Form (English):', success ? 'PASS ✅' : 'FAIL ❌');
  
  if (!success) {
    process.exit(1);
  }
});