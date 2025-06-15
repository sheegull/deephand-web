import type { APIRoute } from 'astro';
import { dataRequestFormSchema } from '@/lib/validationSchemas';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate the data
    const result = dataRequestFormSchema.safeParse(body);
    
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

    const data = result.data;

    // In a real implementation, you would:
    // 1. Send detailed proposal email
    // 2. Store request in database
    // 3. Trigger notification workflows
    // 4. Create project tracking entry
    
    console.log('Data request submission:', {
      ...data,
      timestamp: new Date().toISOString(),
      requestId: `DR-${Date.now()}`,
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return new Response(JSON.stringify({
      success: true,
      message: 'データアノテーション依頼を受け付けました。24時間以内に詳細なご提案をお送りいたします。',
      requestId: `DR-${Date.now()}`,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Data request error:', error);
    
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