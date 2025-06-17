// 直接APIエンドポイントをテストする
async function testRequestAPI() {
  console.log('🔍 [API TEST] Testing /api/request endpoint directly');
  
  const testData = {
    name: 'Test User',
    organization: 'Test Company',
    email: 'test@example.com',
    backgroundPurpose: 'Testing API endpoint',
    dataType: ['image', 'video'],
    dataDetails: 'Test data details',
    dataVolume: '1000 samples',
    deadline: 'March 2025',
    budget: '$5000',
    otherRequirements: 'Test requirements',
    language: 'ja'
  };
  
  try {
    console.log('📤 [API TEST] Sending request to /api/request');
    console.log('📤 [API TEST] Request data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:4322/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 [API TEST] Response status:', response.status);
    console.log('📥 [API TEST] Response ok:', response.ok);
    console.log('📥 [API TEST] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 [API TEST] Raw response text:', responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('📥 [API TEST] Parsed response:', JSON.stringify(responseData, null, 2));
      
      if (response.ok) {
        console.log('✅ [API TEST] SUCCESS: API responded successfully');
      } else {
        console.log('❌ [API TEST] ERROR: API returned error status');
        console.log('❌ [API TEST] Error details:', responseData);
      }
    } catch (parseError) {
      console.log('❌ [API TEST] JSON Parse Error:', parseError.message);
      console.log('❌ [API TEST] Raw response was:', responseText);
    }
    
  } catch (error) {
    console.error('❌ [API TEST] Fetch error:', error.message);
    console.error('❌ [API TEST] Full error:', error);
  }
}

testRequestAPI().catch(console.error);