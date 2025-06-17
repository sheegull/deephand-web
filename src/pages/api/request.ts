import type { APIRoute } from 'astro';
import { currentDataRequestFormSchema } from '@/lib/validationSchemas';
import { sendDataRequestEmail, validateEmailConfig } from '@/lib/email';
import type { CurrentDataRequestFormData } from '@/lib/validationSchemas';
import { logError, logInfo } from '@/lib/error-handling';

// Enable server-side rendering for this endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('🚀 === DATA REQUEST FORM DEBUG START ===');
  
  try {
    console.log('📋 Step 1: Environment Variables Check');
    
    // Cloudflare Workers環境変数アクセス（locals.runtime.env）
    const env = locals.runtime?.env;
    console.log('=== Cloudflare Runtime Environment ===');
    console.log('locals.runtime exists:', !!locals.runtime);
    console.log('locals.runtime.env exists:', !!env);
    if (env) {
      console.log('env.RESEND_API_KEY present:', !!env.RESEND_API_KEY);
      console.log('env.PUBLIC_SITE_URL:', env.PUBLIC_SITE_URL || 'NOT SET');
      console.log('env.ADMIN_EMAIL:', env.ADMIN_EMAIL || 'NOT SET');
      console.log('env.FROM_EMAIL:', env.FROM_EMAIL || 'NOT SET');
      console.log('env.NOREPLY_EMAIL:', env.NOREPLY_EMAIL || 'NOT SET');
    }
    
    // 従来のimport.meta.env（比較用）
    console.log('=== import.meta.env (build-time) ===');
    console.log('import.meta.env.RESEND_API_KEY present:', !!import.meta.env.RESEND_API_KEY);
    console.log('import.meta.env.PUBLIC_SITE_URL:', import.meta.env.PUBLIC_SITE_URL || 'NOT SET');
    
    console.log('📋 Step 2: Request Analysis');
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    // Validate Content-Type
    if (!contentType?.includes('application/json')) {
      console.log('❌ Invalid Content-Type');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Content-Type must be application/json',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('📋 Step 3: Body Parsing');
    // Safe JSON parsing
    let body;
    try {
      const text = await request.text();
      console.log('Request body length:', text.length);
      if (!text.trim()) {
        console.log('❌ Empty request body');
        return new Response(
          JSON.stringify({
            success: false,
            message: 'リクエストボディが空です。',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      body = JSON.parse(text);
      console.log('✅ JSON parsed successfully');
    } catch (jsonError) {
      console.log('❌ JSON parsing failed:', jsonError);
      logError('JSON parsing error in data request form', {
        operation: 'data_request_parse',
        timestamp: Date.now(),
        url: '/api/request'
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: '不正なJSONフォーマットです。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('📋 Step 4: Basic Validation');
    // Validate the data
    const result = currentDataRequestFormSchema.safeParse(body);

    if (!result.success) {
      console.log('❌ Schema validation failed:', result.error.flatten().fieldErrors);
      return new Response(
        JSON.stringify({
          success: false,
          errors: result.error.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Schema validation passed');

    console.log('📋 Step 5: API Key Validation');
    // Validate email configuration using Cloudflare runtime env
    const emailConfig = validateEmailConfig(env);
    console.log('Email config validation result:', emailConfig);
    if (!emailConfig.isValid) {
      console.log('❌ Email config validation failed:', emailConfig.errors);
      logError('Email configuration invalid for data request', {
        operation: 'data_request_email_config',
        timestamp: Date.now(),
        url: '/api/request'
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メール送信設定に問題があります。管理者にお問い合わせください。',
          debug: emailConfig.errors, // Debug info
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Email config validation passed');

    console.log('📋 Step 6: Email Data Preparation');
    console.log('Request data:', JSON.stringify(result.data, null, 2));
    
    console.log('📋 Step 7: Resend API Call');
    // Send email with Cloudflare runtime environment
    const emailResult = await sendDataRequestEmail(result.data, env);
    console.log('Email sending result:', emailResult);

    if (!emailResult.success) {
      console.log('❌ Email sending failed:', emailResult.error);
      logError('Data request email sending failed', {
        operation: 'data_request_email_send',
        timestamp: Date.now(),
        url: '/api/request'
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メール送信に失敗しました。しばらくしてから再度お試しください。',
          debug: emailResult.error, // Debug info
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Email sent successfully');

    // Log successful submission (without sensitive data)
    const requestId = `DR-${Date.now()}`;
    logInfo('Data request submitted successfully', {
      operation: 'data_request_success',
      timestamp: Date.now(),
      url: '/api/request'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'データアノテーション依頼を受け付けました。24時間以内に詳細なご提案をお送りいたします。',
        requestId,
        emailId: emailResult.emailId,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.log('🔥 === UNEXPECTED ERROR ===');
    console.log('Error type:', typeof error);
    console.log('Error message:', error instanceof Error ? error.message : String(error));
    console.log('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    console.log('🔥 === END ERROR ===');
    
    logError('Unexpected error in data request', {
      operation: 'data_request_exception',
      timestamp: Date.now(),
      url: '/api/request'
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
        debug: error instanceof Error ? error.message : String(error), // Debug info
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    console.log('🏁 === DATA REQUEST FORM DEBUG END ===');
  }
};
