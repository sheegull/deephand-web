import type { APIRoute } from 'astro';
import { contactFormSchema } from '@/lib/validationSchemas';
import { sendContactEmail, validateEmailConfig } from '@/lib/email';
import { logError, logInfo } from '@/lib/error-handling';

// Enable server-side rendering for this endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
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

    // Safe JSON parsing
    let body;
    try {
      const text = await request.text();
      if (!text.trim()) {
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
    } catch (jsonError) {
      logError('JSON parsing error in contact form', {
        operation: 'contact_form_parse',
        timestamp: Date.now(),
        url: '/api/contact'
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

    // Validate the data
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
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

    // Validate email configuration
    const emailConfig = validateEmailConfig();
    if (!emailConfig.isValid) {
      logError('Email configuration invalid for contact form', {
        operation: 'contact_form_email_config',
        timestamp: Date.now(),
        url: '/api/contact'
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メール送信設定に問題があります。管理者にお問い合わせください。',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Send email
    const emailResult = await sendContactEmail(result.data);

    if (!emailResult.success) {
      logError('Contact email sending failed', {
        operation: 'contact_form_email_send',
        timestamp: Date.now(),
        url: '/api/contact'
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'メール送信に失敗しました。しばらくしてから再度お試しください。',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Log successful submission (without sensitive data)
    logInfo('Contact form submitted successfully', {
      operation: 'contact_form_success',
      timestamp: Date.now(),
      url: '/api/contact'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'お問い合わせを受け付けました。24時間以内にご返信いたします。',
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
    logError('Unexpected error in contact form', {
      operation: 'contact_form_exception',
      timestamp: Date.now(),
      url: '/api/contact'
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};