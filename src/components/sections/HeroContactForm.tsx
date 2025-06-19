import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import { logError, logInfo } from '../../lib/error-handling';
import {
  MotionDiv,
  useInView,
} from '../ui/motion-optimized';

interface HeroContactFormProps {
  isClient?: boolean;
}

/**
 * HeroContactForm - Contact form extracted from HeroSection
 * Handles form submission, validation, and UI states
 */
export const HeroContactForm: React.FC<HeroContactFormProps> = ({
  isClient = false,
}) => {
  const { currentLanguage } = useLanguage();
  
  // Unified state management for better performance
  const [uiState, setUiState] = useState({
    isSubmitting: false,
    submitStatus: 'idle' as 'idle' | 'success' | 'error',
    validationErrors: [] as string[],
    messageLength: 0,
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Single state update for better performance
    setUiState(prev => ({
      ...prev,
      isSubmitting: true,
      submitStatus: 'idle',
      validationErrors: [],
    }));

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') || '',
      organization: formData.get('organization') || '',
      email: formData.get('email') || '',
      message: formData.get('message') || '',
      language: currentLanguage,
    };

    // Validation
    const errors: string[] = [];

    if (!data.name || String(data.name).trim().length === 0) {
      errors.push(t('validation.nameRequired') || 'お名前を入力してください');
    }
    if (!data.email || String(data.email).trim().length === 0) {
      errors.push(t('validation.emailRequired') || 'メールアドレスを入力してください');
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(String(data.email))) {
        errors.push(t('validation.emailInvalid') || '有効なメールアドレスを入力してください');
      }
    }
    if (!data.message || String(data.message).trim().length === 0) {
      errors.push(t('validation.messageRequired') || 'メッセージを入力してください');
    } else if (String(data.message).trim().length < 10) {
      errors.push(t('validation.messageTooShort') || 'メッセージは10文字以上で入力してください');
    }

    if (errors.length > 0) {
      setUiState(prev => ({
        ...prev,
        validationErrors: errors,
        isSubmitting: false,
      }));
      return;
    }

    // API request
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        setUiState(prev => ({
          ...prev,
          submitStatus: 'error',
          isSubmitting: false,
        }));
        return;
      }

      // Simplified success logic
      const isSuccess = response.ok;

      if (isSuccess) {
        setUiState(prev => ({
          ...prev,
          submitStatus: 'success',
          validationErrors: [],
          messageLength: 0,
        }));
        e.currentTarget.reset();

        logInfo('Contact form submitted successfully', {
          operation: 'contact_form_success_frontend',
          timestamp: isClient ? Date.now() : 0,
          emailId: result?.emailId,
        });
      } else {
        logError('Contact form submission failed', {
          operation: 'contact_form_submit',
          timestamp: isClient ? Date.now() : 0,
          status: response.status,
          responseData: result,
          responseOk: response.ok,
          errors: result?.errors || result?.message || 'Unknown error',
        });
        setUiState(prev => ({ ...prev, submitStatus: 'error' }));
      }
    } catch (error) {
      logError('Contact form submission exception', {
        operation: 'contact_form_exception',
        timestamp: isClient ? Date.now() : 0,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      setUiState(prev => ({ ...prev, submitStatus: 'error' }));
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className="w-full max-w-[460px] mx-auto lg:mx-0 flex-shrink-0"
      data-testid="hero-contact-form"
    >
      <Card className="w-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md ring-0.5 relative z-20 mt-24 lg:mt-0">
        <CardHeader className="px-2 pt-2 pb-4">
          <CardTitle className="font-alliance font-normal text-white text-lg md:text-xl leading-[28px] pb-2">
            {t('contact.title')}
          </CardTitle>
          <CardDescription className="font-alliance font-light text-white text-sm leading-[18px] whitespace-pre-line">
            {t('contact.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                {t('contact.name')} *
              </label>
              <Input
                name="name"
                placeholder={t('contact.placeholder.name')}
                minLength={1}
                maxLength={50}
                className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                data-testid="name-input"
              />
            </div>

            {/* Organization Field */}
            <div className="flex flex-col gap-2">
              <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                {t('contact.organization')}
              </label>
              <Input
                name="organization"
                placeholder={t('contact.placeholder.organization')}
                className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                data-testid="organization-input"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                {t('contact.email')} *
              </label>
              <Input
                name="email"
                type="email"
                placeholder={t('contact.placeholder.email')}
                className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                data-testid="email-input"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                  {t('contact.message')} *
                </label>
                <span className="text-xs text-gray-400 font-alliance font-light">
                  {uiState.messageLength} / 1000
                </span>
              </div>
              <Textarea
                name="message"
                placeholder={t('contact.placeholder.message')}
                minLength={1}
                maxLength={1000}
                onChange={e => {
                  setUiState(prev => ({ ...prev, messageLength: e.target.value.length }));
                }}
                className="min-h-[120px] h-[120px] max-h-[200px] !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm resize-y focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                data-testid="message-input"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={uiState.isSubmitting}
              className="h-12 font-alliance font-medium text-white text-base bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] transition-all duration-300 ease-out disabled:bg-[#234ad9]/70 flex items-center justify-center gap-2 rounded-lg mt-2 transform hover:scale-[1.05] active:scale-[0.95]"
              data-testid="submit-button"
            >
              {uiState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {uiState.isSubmitting ? t('contact.submitting') : t('contact.submit')}
            </Button>

            {/* Status Messages */}
            {uiState.submitStatus === 'success' && (
              <MotionDiv
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg"
                data-testid="success-message"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-emerald-400/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm font-alliance font-normal">
                    {t('contact.success')}
                  </p>
                </div>
              </MotionDiv>
            )}

            {uiState.submitStatus === 'error' && (
              <MotionDiv
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg"
                data-testid="error-message"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg border border-red-400/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm font-alliance font-normal">
                    {t('contact.error')}
                  </p>
                </div>
              </MotionDiv>
            )}

            {uiState.validationErrors.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 backdrop-blur-md shadow-xl ring-1 ring-amber-500/20"
                data-testid="validation-errors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 border border-amber-400/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16h.01M12 8v4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm font-medium mb-3 font-alliance">
                      {t('validation.inputError')}
                    </p>
                    <ul className="space-y-2">
                      {uiState.validationErrors.map((error, index) => (
                        <MotionDiv
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-400 text-sm font-alliance font-light leading-relaxed">
                            {error}
                          </span>
                        </MotionDiv>
                      ))}
                    </ul>
                  </div>
                </div>
              </MotionDiv>
            )}
          </form>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};