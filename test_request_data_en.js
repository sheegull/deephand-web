/**
 * 🧪 Request Data Form English Test
 * Test if response content is included in emails
 */

const testRequestDataEnglish = async () => {
  console.log('🧪 [Request Data Form English Test] Email sending test started');
  
  const testData = {
    name: 'Emily Johnson',
    email: 'kiyonomatcha@gmail.com',
    organization: 'Autonomous Systems Ltd',
    backgroundPurpose: 'We need data annotation for autonomous vehicle perception systems.\nSpecifically for object detection and tracking in urban environments.',
    dataType: ['video', 'image'],
    dataDetails: 'Driving video footage with pedestrians, vehicles, and traffic signs\nBounding boxes and semantic segmentation annotations required',
    dataVolume: 'Approximately 10,000 hours of video data',
    deadline: 'End of March 2025',
    budget: 'Around $50,000',
    otherRequirements: 'Data privacy compliance with GDPR is required.\nWe need a quality assurance process with multiple reviewer validation.',
    language: 'en'
  };

  try {
    console.log('📤 [Request Data Test] Sending data...');
    console.log('📋 Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:4322/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 [Request Data Test] Response received - Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📥 [Request Data Test] Response content:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ [Request Data Test] Success: Email sent successfully');
      console.log('📧 Email ID:', result.emailId);
      return true;
    } else {
      console.log('❌ [Request Data Test] Failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ [Request Data Test] Error:', error.message);
    return false;
  }
};

// Run test
testRequestDataEnglish().then(success => {
  console.log('\n📊 [Request Data Form English Test] Result');
  console.log('Request Data Form (English):', success ? 'PASS ✅' : 'FAIL ❌');
  
  if (!success) {
    process.exit(1);
  }
});