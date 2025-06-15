import type { APIRoute } from 'astro';
import { contactFormSchema } from '@/lib/validationSchemas';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate the data
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        errors: result.error.flatten().fieldErrors,
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { name, email, company, subject, message, privacyConsent } = result.data;

    // In a real implementation, you would:
    // 1. Send email via service like Resend
    // 2. Store in database
    // 3. Send notifications
    
    console.log('Contact form submission:', {
      name,
      email,
      company,
      subject,
      message,
      privacyConsent,
      timestamp: new Date().toISOString(),
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify({
      success: true,
      message: 'お問い合わせを受け付けました。24時間以内にご返信いたします。',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};