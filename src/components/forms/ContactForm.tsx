import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common';
import { contactFormSchema, type ContactFormData } from '@/lib/validationSchemas';
import { Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
  // 静的テキスト使用（i18nextエラー回避）
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Contact form submitted successfully:', result);
        setIsSubmitted(true);
        reset();
      } else {
        console.error('Form submission failed:', result);
        alert('送信に失敗しました。しばらくしてから再度お試しください。');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('送信に失敗しました。しばらくしてから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">送信完了</h3>
        <p className="text-green-700">
          お問い合わせありがとうございます。24時間以内にご返信いたします。
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
          新しいお問い合わせ
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-900">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="山田太郎"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900 bg-white"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="email@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900 bg-white"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          会社名
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          placeholder="株式会社サンプル"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900 bg-white"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('subject')}
          type="text"
          id="subject"
          placeholder="お問い合わせの件名"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900 bg-white"
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          メッセージ <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={5}
          placeholder="お問い合わせ内容をご記入ください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none text-gray-900 bg-white"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      {/* Privacy Consent */}
      <div className="flex items-start gap-3">
        <input
          {...register('privacyConsent')}
          type="checkbox"
          id="privacyConsent"
          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <label htmlFor="privacyConsent" className="text-sm text-gray-900">
          <span className="text-red-500">*</span> プライバシーポリシーに同意します
        </label>
      </div>
      {errors.privacyConsent && (
        <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            送信中...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            送信する
          </>
        )}
      </Button>
    </form>
  );
}
