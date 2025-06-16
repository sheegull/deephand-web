import React, { useState } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { t, getCurrentLanguage, setCurrentLanguage } from '../lib/i18n';
import { LanguageToggle } from './ui/language-toggle';
import { logError, logInfo } from '../lib/error-handling';
import DitherBackground from './ui/DitherBackground';

interface HeroSectionProps {
  onRequestClick?: () => void;
  onNavClick?: (element: string) => void;
  onLogoClick?: () => void;
  isLoading?: boolean;
}

export const HeroSection = ({
  onRequestClick,
  onNavClick,
  onLogoClick,
  isLoading = false,
}: HeroSectionProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [messageLength, setMessageLength] = React.useState(0);
  const [fieldErrors, setFieldErrors] = React.useState<{ [key: string]: string }>({});

  // Hydration-safe client detection
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const handleReload = () => {
    if (isClient && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationErrors([]);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      organization: formData.get('organization'),
      email: formData.get('email'),
      message: formData.get('message'),
      language: getCurrentLanguage(), // 現在の言語設定を追加
    };

    // 改善されたバリデーション（多言語対応）
    const errors: string[] = [];

    // 名前のバリデーション
    if (!data.name || (data.name as string).trim().length === 0) {
      errors.push(t('validation.nameRequired'));
    } else if ((data.name as string).length > 50) {
      errors.push(t('validation.nameTooLong'));
    }

    // 組織名のバリデーション（オプション）
    if (data.organization && (data.organization as string).length > 100) {
      errors.push(t('validation.organizationTooLong'));
    }

    // メールアドレスのバリデーション
    if (!data.email || (data.email as string).trim().length === 0) {
      errors.push(t('validation.emailRequired'));
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.email as string)) {
        errors.push(t('validation.emailInvalid'));
      }
    }

    // メッセージのバリデーション
    if (!data.message || (data.message as string).trim().length === 0) {
      errors.push(t('validation.messageRequired'));
    } else if ((data.message as string).trim().length < 10) {
      errors.push(t('validation.messageTooShort'));
    } else if ((data.message as string).length > 1000) {
      errors.push(t('validation.messageTooLong'));
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // レスポンステキストを先に取得して確認
      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        logError('Contact form JSON parse failed', {
          operation: 'contact_form_parse_error',
          timestamp: isClient ? Date.now() : 0,
          responseText: responseText.substring(0, 200),
        });
        setSubmitStatus('error');
        return;
      }

      // 🔍 DEBUG: レスポンス詳細ログ
      console.log('🔍 [CONTACT FORM DEBUG] Response details:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      console.log('🔍 [CONTACT FORM DEBUG] Parsed result:', {
        result,
        resultType: typeof result,
        resultSuccess: result?.success,
        resultSuccessType: typeof result?.success,
        resultEmailId: result?.emailId,
        resultMessage: result?.message,
        resultErrors: result?.errors,
      });

      // 改善された成功判定：主要機能（問い合わせ送信）の成功を優先
      // 1. HTTP 200 レスポンス = サーバーが正常に処理完了
      // 2. result.success !== false = 明示的な失敗でない
      // 3. emailId存在 = メール送信成功の証拠
      const isMainFunctionSuccessful =
        response.ok &&
        (result.success === true ||
          (result.success !== false && result.emailId) ||
          response.status === 200);

      // 🔍 DEBUG: 成功判定の詳細ログ
      console.log('🔍 [CONTACT FORM DEBUG] Success logic evaluation:', {
        'response.ok': response.ok,
        'result.success === true': result.success === true,
        'result.success !== false': result.success !== false,
        'result.emailId exists': !!result.emailId,
        'response.status === 200': response.status === 200,
        'Final isMainFunctionSuccessful': isMainFunctionSuccessful,
      });

      if (isMainFunctionSuccessful) {
        console.log('✅ [CONTACT FORM DEBUG] Setting status to SUCCESS');
        setSubmitStatus('success');
        e.currentTarget.reset();

        // 成功ログ
        logError('Contact form submitted successfully', {
          operation: 'contact_form_success_frontend',
          timestamp: isClient ? Date.now() : 0,
          emailId: result?.emailId,
        });
      } else {
        console.log('❌ [CONTACT FORM DEBUG] Setting status to ERROR');
        // 真のエラー（バリデーション失敗、ネットワークエラー等）のみエラー表示
        logError('Contact form submission failed', {
          operation: 'contact_form_submit',
          timestamp: isClient ? Date.now() : 0,
          status: response.status,
          responseData: result,
          errors: result?.errors || result?.message || 'Unknown error',
        });
        setSubmitStatus('error');
      }
    } catch (error) {
      logError('Contact form submission exception', {
        operation: 'contact_form_exception',
        timestamp: isClient ? Date.now() : 0,
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation links data
  const navLinks = [
    { text: t('nav.solutions'), href: '#solutions' },
    { text: t('nav.resources'), href: '#resources' },
    { text: t('nav.pricing'), href: '#pricing' },
    { text: t('nav.aboutUs'), href: '#about' },
  ];

  // Footer links data
  const footerLinks = [
    { text: t('footer.termsOfService'), href: '#terms' },
    { text: t('footer.privacyPolicy'), href: '#privacy' },
  ];

  return (
    <div className="flex flex-col w-full items-start bg-[#1e1e1e] min-h-screen relative">
      {/* Dither Background Animation */}
      <DitherBackground
        waveSpeed={0.05}
        waveFrequency={6.0}
        waveAmplitude={0.05}
        waveColor={[0.35, 0.36, 0.37]} // High brightness
        colorNum={8}
        pixelSize={1}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.1}
        className="absolute inset-0 z-0 opacity-60"
      />

      {/* Navigation Bar */}
      <header className="fixed top-0 z-50 w-full h-20 flex items-center justify-between px-4 md:px-20">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <img className="w-8 h-8 object-cover" alt="Icon" src="/logo.png" />
            <div className="font-alliance font-light text-white text-xl md:text-2xl leading-[28.8px]">
              DeepHand
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex items-center gap-2">
              <Menu className="w-6 h-6" />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block mx-auto">
            <ul className="flex gap-4 lg:gap-8">
              {navLinks.map((link, index) => (
                <li
                  key={index}
                  onClick={() => onNavClick?.(link.text.toLowerCase())}
                  className="cursor-pointer"
                >
                  <span className="font-alliance font-light text-white text-[13px] lg:text-[15px] leading-[19.2px] hover:text-gray-300 transition-colors">
                    {link.text}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <LanguageToggle
              currentLanguage={getCurrentLanguage()}
              onLanguageChange={lang => {
                setCurrentLanguage(lang);
                handleReload();
              }}
            />
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 8px 25px rgba(35, 74, 217, 0.4)',
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                transition: { duration: 0.1 },
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <Button
                onClick={() => {
                  handleNavigation('/request');
                }}
                className="w-[120px] md:w-[150px] h-9 md:h-11 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-xs md:text-sm transition-all duration-300 hover:bg-[#234ad9] hover:border-[#234ad9]"
              >
                <span className="relative z-10">{t('nav.getStarted')}</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-20 left-0 right-0 bg-[#1e1e1e] transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } md:hidden border-t border-gray-700 shadow-lg`}
        >
          <nav className="flex flex-col py-3">
            {navLinks.map((link, index) => (
              <a
                key={index}
                onClick={() => onNavClick?.(link.text.toLowerCase())}
                className="py-2 px-4 text-white hover:bg-white/20 active:bg-white/30 transition-colors text-sm cursor-pointer"
              >
                {link.text}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-2 p-2 border-t border-gray-700">
              <div className="mb-2">
                <LanguageToggle
                  currentLanguage={getCurrentLanguage()}
                  onLanguageChange={lang => {
                    setCurrentLanguage(lang);
                    handleReload();
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  handleNavigation('/request');
                }}
                className="w-full h-9 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-sm transition-all duration-300 ease-out hover:bg-[#234ad9] hover:border-[#234ad9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#234ad9]/25 hover:scale-105 active:scale-95 active:translate-y-0 active:bg-[#1e3eb8] active:border-[#1e3eb8] active:shadow-md"
              >
                {t('nav.getStarted')}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative w-full px-4 md:px-[92px] flex-1 shadow-[0px_4px_4px_#00000040] mt-20 z-10">
        <div className="flex flex-wrap justify-center md:justify-between py-[100px] md:py-[219px] gap-16 relative z-10">
          {/* Left Content */}
          <motion.div
            className="flex flex-col max-w-[654px] gap-10 text-center md:text-left"
            style={{ y: textY }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-alliance font-normal text-white text-4xl md:text-[64px] leading-[1.1] mt-[65px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              {t('hero.title')
                .split('\n')
                .map((line: string, index: number) => (
                  <motion.span
                    key={index}
                    className="block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                  >
                    {line}
                  </motion.span>
                ))}
            </motion.h1>
            <motion.p
              className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-[30px] max-w-[555px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <Button
              onClick={() => {
                handleNavigation('/request');
              }}
              size="lg"
              className="w-40 mx-auto md:mx-0 transition-transform hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              <span className="relative z-10">{t('hero.requestButton')}</span>
            </Button>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Card className="w-full md:w-[460px] !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md ring-0.5">
              <CardHeader className="px-2 pt-2 pb-8">
                <CardTitle className="font-alliance font-normal text-white text-xl md:text-2xl leading-[28px] pb-2">
                  {t('contact.title')}
                </CardTitle>
                <CardDescription className="font-alliance font-light text-white text-sm leading-[18px] whitespace-pre-line">
                  {t('contact.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                      {t('contact.name')} *
                    </label>
                    <Input
                      name="name"
                      placeholder={t('contact.placeholder.name')}
                      minLength={1}
                      maxLength={50}
                      onChange={e => {
                        if (e.target.value.length > 50) {
                          setFieldErrors(prev => ({ ...prev, name: t('validation.nameTooLong') }));
                        } else {
                          setFieldErrors(prev => {
                            const { name, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className={`h-12 !bg-[#0F0F0F] !border-gray-700/70 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200 shadow-inner ${fieldErrors.name ? '!border-red-500' : ''}`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-500 font-alliance font-light">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                      {t('contact.organization')}
                    </label>
                    <Input
                      name="organization"
                      placeholder={t('contact.placeholder.organization')}
                      className="h-12 !bg-[#0F0F0F] !border-gray-700/70 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200 shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                      {t('contact.email')} *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder={t('contact.placeholder.email')}
                      onChange={e => {
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        if (e.target.value && !emailRegex.test(e.target.value)) {
                          setFieldErrors(prev => ({
                            ...prev,
                            email: t('validation.emailInvalid'),
                          }));
                        } else {
                          setFieldErrors(prev => {
                            const { email, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className={`h-12 !bg-[#0F0F0F] !border-gray-700/70 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200 shadow-inner ${fieldErrors.email ? '!border-red-500' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500 font-alliance font-light">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                        {t('contact.message')} *
                      </label>
                      <span className="text-xs text-gray-400 font-alliance font-light">
                        {messageLength} / 1000
                      </span>
                    </div>
                    <Textarea
                      name="message"
                      placeholder={t('contact.placeholder.message')}
                      minLength={1}
                      maxLength={1000}
                      onChange={e => {
                        setMessageLength(e.target.value.length);
                        // リアルタイムバリデーション
                        if (e.target.value.trim().length > 0 && e.target.value.trim().length < 10) {
                          setFieldErrors(prev => ({
                            ...prev,
                            message: t('validation.messageTooShort'),
                          }));
                        } else if (e.target.value.length > 1000) {
                          setFieldErrors(prev => ({
                            ...prev,
                            message: t('validation.messageTooLong'),
                          }));
                        } else {
                          setFieldErrors(prev => {
                            const { message, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className={`min-h-[150px] h-[150px] max-h-[300px] !bg-[#0F0F0F] !border-gray-700/70 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm resize-y focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200 shadow-inner ${fieldErrors.message ? '!border-red-500' : ''}`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-red-500 font-alliance font-light mt-1">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 font-alliance font-medium text-white text-base bg-[#234ad9] hover:bg-[#1e3eb8] active:bg-[#183099] transition-colors disabled:bg-[#234ad9]/70 flex items-center justify-center gap-2 rounded-lg mt-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                  </Button>

                  {submitStatus === 'success' && (
                    <p className="text-green-400 text-sm text-center font-alliance font-light">
                      {t('contact.success')}
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center font-alliance font-light">
                      {t('contact.error')}
                    </p>
                  )}
                  {validationErrors.length > 0 && (
                    <div className="bg-red-950/20 border border-red-800/50 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-red-400 text-sm font-medium mb-3 font-alliance">
                        {t('validation.inputError')}
                      </p>
                      <ul className="text-red-300 text-sm space-y-2">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2 mt-0.5">•</span>
                            <span className="font-alliance font-light">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-between w-full mt-20 gap-4 md:gap-0 pb-8">
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                onClick={() => onNavClick?.(link.text.toLowerCase().replace(/\s+/g, '-'))}
                className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
              >
                {link.text}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};
