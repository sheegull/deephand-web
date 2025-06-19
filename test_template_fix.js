// TDD Test: Template System Fix
async function testTemplateSystem() {
  console.log('🧪 [TDD TEMPLATE TEST] Testing email template generation');
  
  try {
    // Test the new template system by making an API call
    const testData = {
      name: 'Template Test User',
      organization: 'Template Test Company',
      email: 'contact@deephandai.com',
      backgroundPurpose: 'Testing template system fix',
      dataType: ['image'],
      dataDetails: 'Template test details',
      dataVolume: '1000 samples',
      deadline: 'March 2025',
      budget: '$5000',
      otherRequirements: 'None',
      language: 'ja'
    };
    
    console.log('📤 [TEMPLATE TEST] Sending request to test template generation...');
    
    const response = await fetch('http://localhost:4321/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const responseText = await response.text();
    console.log('📥 [TEMPLATE TEST] Response status:', response.status);
    console.log('📥 [TEMPLATE TEST] Response text:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [TEMPLATE TEST] JSON parse error:', parseError);
      return false;
    }
    
    // Test success criteria
    if (response.ok && result.success && result.emailId) {
      console.log('✅ [TEMPLATE TEST] PASS: Template system working correctly');
      console.log('✅ [TEMPLATE TEST] Email sent with ID:', result.emailId);
      return true;
    } else {
      console.log('❌ [TEMPLATE TEST] FAIL: Template system still has issues');
      console.log('❌ [TEMPLATE TEST] Result:', result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ [TEMPLATE TEST] ERROR:', error.message);
    return false;
  }
}

// Run template test
testTemplateSystem().then(result => {
  console.log('\n📊 [TDD TEMPLATE RESULT]');
  console.log('Template system test:', result ? 'PASS ✅' : 'FAIL ❌');
  
  if (!result) {
    console.log('\n🔧 [TDD] Template system needs fixing');
  }
}).catch(console.error);