import type { APIRoute } from 'astro';

// Enable server-side rendering for this endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('🚀 === CONTACT FORM DEBUG START ===');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    step: 'initialization',
    error: null,
    environment: {},
    request: {},
    processing: []
  };

  try {
    // Step 1: Environment Variables Check
    console.log('📋 Step 1: Environment Variables Check');
    debugInfo.step = 'env-check';
    
    const env = locals?.runtime?.env || {};
    const envKeys = Object.keys(env);
    
    debugInfo.environment = {
      localsExists: !!locals,
      runtimeExists: !!locals?.runtime,
      envExists: !!env,
      envKeys: envKeys,
      hasResendKey: !!env.RESEND_API_KEY,
      resendKeyLength: env.RESEND_API_KEY ? env.RESEND_API_KEY.length : 0,
      nodeEnv: env.NODE_ENV || 'undefined'
    };
    
    console.log('🔑 Environment Info:', JSON.stringify(debugInfo.environment, null, 2));
    debugInfo.processing.push('env-check-completed');

    // Step 2: Request Analysis
    console.log('📨 Step 2: Request Analysis');
    debugInfo.step = 'request-analysis';
    
    const contentType = request.headers.get('content-type');
    const method = request.method;
    const url = request.url;
    
    debugInfo.request = {
      method: method,
      url: url,
      contentType: contentType,
      hasBody: !!request.body,
      headers: Object.fromEntries(request.headers.entries())
    };
    
    console.log('🌐 Request Info:', JSON.stringify(debugInfo.request, null, 2));
    debugInfo.processing.push('request-analysis-completed');

    // Step 3: Body Parsing
    console.log('📦 Step 3: Body Parsing');
    debugInfo.step = 'body-parsing';
    
    let requestBody = null;
    try {
      if (contentType?.includes('application/json')) {
        const text = await request.text();
        console.log('📄 Raw text body:', text);
        requestBody = JSON.parse(text);
        console.log('📄 JSON Body parsed successfully:', JSON.stringify(requestBody, null, 2));
      } else {
        console.log('📋 Parsing as form data...');
        const formData = await request.formData();
        requestBody = Object.fromEntries(formData.entries());
        console.log('📋 Form Data parsed successfully:', JSON.stringify(requestBody, null, 2));
      }
      debugInfo.processing.push('body-parsing-completed');
    } catch (bodyError) {
      console.error('❌ Body parsing failed:', bodyError.message);
      console.error('❌ Body parsing stack:', bodyError.stack);
      debugInfo.error = {
        step: 'body-parsing',
        name: bodyError.name,
        message: bodyError.message,
        stack: bodyError.stack
      };
      throw bodyError;
    }

    // Step 4: Basic Validation
    console.log('✅ Step 4: Basic Validation');
    debugInfo.step = 'basic-validation';
    
    if (!requestBody || typeof requestBody !== 'object') {
      throw new Error('Invalid request body format');
    }
    
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !requestBody[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ Basic validation passed');
    debugInfo.processing.push('basic-validation-completed');

    // Step 5: API Key Validation
    console.log('🔐 Step 5: API Key Validation');
    debugInfo.step = 'api-key-validation';
    
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('🚨 CRITICAL: RESEND_API_KEY not found in environment');
      console.error('🔍 Available env keys:', envKeys);
      console.error('🔍 locals structure:', JSON.stringify(locals, null, 2));
      throw new Error('RESEND_API_KEY not configured in Cloudflare Secrets');
    }
    
    console.log('✅ API Key found, length:', apiKey.length);
    console.log('🔑 API Key prefix:', apiKey.substring(0, 8) + '...');
    debugInfo.processing.push('api-key-validation-completed');

    // Step 6: Email Data Preparation
    console.log('📧 Step 6: Email Data Preparation');
    debugInfo.step = 'email-preparation';
    
    const emailData = {
      from: 'contact@deephandai.com',
      to: 'contact@deephandai.com',
      subject: `[DeepHand] Contact Form: ${requestBody.name || 'No Name'}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${requestBody.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${requestBody.email || 'Not provided'}</p>
        <p><strong>Company:</strong> ${requestBody.company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${requestBody.message || 'No message'}</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `
    };
    
    console.log('📮 Email data prepared:', JSON.stringify(emailData, null, 2));
    debugInfo.processing.push('email-preparation-completed');

    // Step 7: Resend API Call
    console.log('🌐 Step 7: Resend API Call');
    debugInfo.step = 'resend-api-call';
    
    console.log('🔗 Making request to Resend API...');
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    console.log('📡 Resend API Response Status:', resendResponse.status);
    console.log('📡 Resend API Response Headers:', Object.fromEntries(resendResponse.headers.entries()));
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ Resend API Error Response:', errorText);
      console.error('❌ Resend API Status:', resendResponse.status);
      console.error('❌ Resend API StatusText:', resendResponse.statusText);
      throw new Error(`Resend API error: ${resendResponse.status} - ${errorText}`);
    }
    
    const resendResult = await resendResponse.json();
    console.log('✅ Resend API Success Response:', JSON.stringify(resendResult, null, 2));
    debugInfo.processing.push('resend-api-call-completed');

    // Success Response
    debugInfo.step = 'success';
    console.log('🎉 === CONTACT FORM DEBUG SUCCESS ===');
    console.log('📊 Final Debug Info:', JSON.stringify(debugInfo, null, 2));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      emailId: resendResult.id,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    // Comprehensive Error Logging
    console.error('🚨 === CRITICAL ERROR DETAILS ===');
    console.error('❌ Error Name:', error.name);
    console.error('❌ Error Message:', error.message);
    console.error('❌ Error Stack:', error.stack);
    console.error('📍 Failed at step:', debugInfo.step);
    console.error('🔍 Processing completed:', debugInfo.processing);
    console.error('🌍 Environment info:', JSON.stringify(debugInfo.environment, null, 2));
    console.error('📨 Request info:', JSON.stringify(debugInfo.request, null, 2));
    console.error('🚨 ================================');

    debugInfo.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      step: debugInfo.step
    };

    return new Response(JSON.stringify({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  console.log('🔧 OPTIONS request received for contact API');
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};