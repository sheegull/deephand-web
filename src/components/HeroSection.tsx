import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { t } from '../lib/i18n';
import { useLanguage } from '../hooks/useLanguage';
import { logError, logInfo } from '../lib/error-handling';
import DitherBackgroundOptimized from './ui/DitherBackgroundOptimized';
import { GlobalHeader } from './GlobalHeader';

interface HeroSectionProps {
  _onRequestClick?: () => void;
  _onNavClick?: (element: string) => void;
  _onLogoClick?: () => void;
  _isLoading?: boolean;
}

export const HeroSection = ({
  _onRequestClick,
  _onNavClick,
  _onLogoClick,
  _isLoading = false,
}: HeroSectionProps) => {
  const { currentLanguage } = useLanguage();
  // 🚀 統一状態管理でReact Fiber競合を完全解消
  const [uiState, setUiState] = React.useState({
    isSubmitting: false,
    submitStatus: 'idle' as 'idle' | 'success' | 'error',
    isClient: false,
    validationErrors: [] as string[],
    messageLength: 0,
    fieldErrors: {} as { [key: string]: string },
  });

  // 🚀 統一状態更新でre-render最小化
  React.useEffect(() => {
    setUiState(prev => ({ ...prev, isClient: true }));
  }, []);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (uiState.isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // レポート推奨：送信関数の先頭で必ずlog
    console.log('🚨 SUBMIT HANDLER START - before preventDefault');

    e.preventDefault();
    console.log('🚨 SUBMIT HANDLER - after preventDefault');

    // 🚀 単一状態更新でre-render最小化
    setUiState(prev => ({
      ...prev,
      isSubmitting: true,
      submitStatus: 'idle',
      validationErrors: [],
    }));

    console.log('🚨 SUBMIT HANDLER - state set complete');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') || '',
      organization: formData.get('organization') || '',
      email: formData.get('email') || '',
      message: formData.get('message') || '',
      language: currentLanguage, // 現在の言語設定を追加
    };

    // 基本的なログ出力
    console.log('フォーム送信開始:', { name: data.name, email: data.email });

    // バリデーション処理
    const errors: string[] = [];

    // 基本的なバリデーション
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

    // APIリクエスト開始
    console.log('フォーム送信 - APIリクエスト開始');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('APIレスポンス受信:', response.status, response.ok);

      const responseText = await response.text();
      console.log('レスポンステキスト:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('パース成功:', result);
      } catch (parseError) {
        console.log('JSON解析エラー:', parseError);
        setUiState(prev => ({
          ...prev,
          submitStatus: 'error',
          isSubmitting: false,
        }));
        return;
      }

      // 成功判定

      // 🔧 Enhanced debugging for success logic
      console.log('🔍 [DETAILED DEBUG] Raw response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      console.log('🔍 [DETAILED DEBUG] Parsed result object:', {
        result: result,
        resultType: typeof result,
        resultKeys: result ? Object.keys(result) : 'null',
        resultSuccess: result?.success,
        resultSuccessType: typeof result?.success,
        resultEmailId: result?.emailId,
        resultEmailIdType: typeof result?.emailId,
        resultMessage: result?.message,
        resultMessageType: typeof result?.message,
      });

      // 🔧 SIMPLIFIED SUCCESS LOGIC (レポート推奨)
      // レスポンスOKなら成功とする（シンプルで確実）
      const isMainFunctionSuccessful = response.ok;

      console.log('🔍 [SIMPLIFIED] Success determination:', {
        responseStatus: response.status,
        responseOk: response.ok,
        isSuccess: isMainFunctionSuccessful,
      });

      console.log('🔍 [FINAL DECISION] isMainFunctionSuccessful:', isMainFunctionSuccessful);

      if (isMainFunctionSuccessful) {
        console.log('✅ [SUCCESS DEBUG] SUCCESS PATH - Setting status to success');
        console.log('🎉 [SUCCESS DEBUG] SUCCESS confirmed - emailId:', result?.emailId);

        // 🚀 単一状態更新で成功処理
        setUiState(prev => ({
          ...prev,
          submitStatus: 'success',
          validationErrors: [],
          messageLength: 0,
          fieldErrors: {},
        }));
        e.currentTarget.reset();

        // 成功ログ
        logInfo('Contact form submitted successfully', {
          operation: 'contact_form_success_frontend',
          timestamp: uiState.isClient ? Date.now() : 0,
          emailId: result?.emailId,
        });
      } else {
        console.log('❌ [SUCCESS DEBUG] ERROR PATH - Setting status to error');
        console.log('❌ [SUCCESS DEBUG] Why error was chosen:', {
          responseStatus: response.status,
          responseOk: response.ok,
          resultSuccess: result?.success,
          resultEmailId: result?.emailId,
          resultMessage: result?.message,
        });

        logError('Contact form submission failed', {
          operation: 'contact_form_submit',
          timestamp: uiState.isClient ? Date.now() : 0,
          status: response.status,
          responseData: result,
          responseOk: response.ok,
          errors: result?.errors || result?.message || 'Unknown error',
        });
        setUiState(prev => ({ ...prev, submitStatus: 'error' }));
      }
    } catch (error) {
      console.log('🚨 [FETCH DEBUG] Exception caught in try block:', error);
      console.log('🚨 [FETCH DEBUG] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });

      logError('Contact form submission exception', {
        operation: 'contact_form_exception',
        timestamp: uiState.isClient ? Date.now() : 0,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      setUiState(prev => ({ ...prev, submitStatus: 'error' }));
    } finally {
      console.log('🔍 [FETCH DEBUG] Finally block - setting isSubmitting to false');
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  };



  return (
    <>
      {/* Dither Background */}
      <DitherBackgroundOptimized
        waveSpeed={0.05}
        waveFrequency={6.0}
        waveAmplitude={0.05}
        waveColor={[0.35, 0.36, 0.37]}
        colorNum={8}
        pixelSize={1}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.1}
        className="fixed inset-0 w-full h-full z-0 opacity-60"
      />

      {/* Global Header with Scroll Blur */}
      <GlobalHeader />
      
      <div className="flex flex-col w-full bg-[#1e1e1e] min-h-screen pt-32 px-4 md:px-8 lg:px-20">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center py-[60px] md:py-[100px] gap-8 lg:gap-16 relative z-10 flex-1">
          {/* Left Content */}
          <motion.div
            className="flex flex-col max-w-[654px] gap-6 lg:gap-8 text-center lg:text-left flex-1 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-alliance font-normal text-white text-3xl md:text-5xl lg:text-[64px] leading-[1.1]"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              {t('hero.title')
                .split('\n')
                .map((line: string, index: number) => (
                  <motion.div
                    key={index}
                    className="block"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                  >
                    {line}
                  </motion.div>
                ))}
            </motion.h1>
            <motion.div
              className="font-alliance font-light text-zinc-400 text-base md:text-lg lg:text-xl leading-[1.6] max-w-[555px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              {t('hero.subtitle')}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit mx-auto lg:mx-0 mt-4 md:mt-6 lg:mt-0"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            >
              <Button
                onClick={() => {
                  const targetUrl = currentLanguage === 'ja' ? '/ja/request' : '/request';
                  handleNavigation(targetUrl);
                }}
                size="lg"
                className="w-40 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] transition-all duration-300 ease-out border-0"
              >
                <span className="relative z-10 text-base font-medium">
                  {t('hero.requestButton')}
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="w-full max-w-[460px] mx-auto lg:mx-0 flex-shrink-0"
          >
            <Card className="w-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md ring-0.5 relative z-20 mt-14 md:mt-16 lg:mt-0">
              <CardHeader className="px-2 pt-2 pb-4">
                <CardTitle className="font-alliance font-normal text-white text-lg md:text-xl leading-[28px] pb-2">
                  {t('contact.title')}
                </CardTitle>
                <CardDescription className="font-alliance font-light text-white text-sm leading-[18px] whitespace-pre-line">
                  {t('contact.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <form className="flex flex-col gap-4" onSubmit={onSubmit} action="">
                  <div className="flex flex-col gap-2">
                    <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                      {t('contact.name')} *
                    </label>
                    <Input
                      name="name"
                      placeholder={t('contact.placeholder.name')}
                      minLength={1}
                      maxLength={50}
                      onChange={_e => {
                        // リアルタイムバリデーション無効化 - 送信時のみエラー表示
                      }}
                      className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                    />
                    {/* リアルタイムエラー表示を無効化 */}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                      {t('contact.organization')}
                    </label>
                    <Input
                      name="organization"
                      placeholder={t('contact.placeholder.organization')}
                      className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
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
                      onChange={_e => {
                        // リアルタイムバリデーション無効化 - 送信時のみエラー表示
                      }}
                      className="h-12 !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                    />
                    {/* リアルタイムエラー表示を無効化 */}
                  </div>

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
                        // 入力時のリアルタイムバリデーションを無効化（送信時のみ表示）
                      }}
                      className="min-h-[120px] h-[120px] max-h-[200px] !bg-[#0F0F0F] !border-gray-500/30 rounded-lg !text-white !placeholder:text-gray-500 font-sans font-light text-sm resize-y focus:!border-[#234ad9] focus:!ring-2 focus:!ring-[#234ad9]/30 transition-all duration-200"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={e => {
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        const fakeEvent = {
                          preventDefault: () => {},
                          currentTarget: form,
                          target: form,
                        } as React.FormEvent<HTMLFormElement>;
                        onSubmit(fakeEvent);
                      }
                    }}
                    disabled={uiState.isSubmitting}
                    className="h-12 font-alliance font-medium text-white text-base bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] transition-all duration-300 ease-out disabled:bg-[#234ad9]/70 flex items-center justify-center gap-2 rounded-lg mt-2 transform hover:scale-[1.05] active:scale-[0.95]"
                  >
                    {uiState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {uiState.isSubmitting ? t('contact.submitting') : t('contact.submit')}
                  </Button>

                  {uiState.submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-emerald-400/30">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.3" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-300 text-sm font-alliance font-normal">
                          {t('contact.success')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {uiState.submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg border border-red-400/30">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.4" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-300 text-sm font-alliance font-normal">
                          {t('contact.error')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {uiState.validationErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 backdrop-blur-md shadow-xl ring-1 ring-amber-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 border border-amber-400/30">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.3" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 16h.01M12 8v4"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm font-medium mb-3 font-alliance">
                            {t('validation.inputError')}
                          </p>
                          <ul className="space-y-2">
                            {uiState.validationErrors.map((error, index) => (
                              <motion.div
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
                              </motion.div>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 mt-auto pt-16 pb-8 z-[100] relative">
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            <a
              role="link"
              href={uiState.isClient ? (currentLanguage === 'ja' ? '/ja/terms' : '/terms') : '#'}
              onClick={(e) => {
                e.preventDefault();
                const termsUrl = currentLanguage === 'ja' ? '/ja/terms' : '/terms';
                handleNavigation(termsUrl);
              }}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 focus:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.termsOfService')}
            </a>
            <a
              role="link"
              href={uiState.isClient ? (currentLanguage === 'ja' ? '/ja/privacy' : '/privacy') : '#'}
              onClick={(e) => {
                e.preventDefault();
                const privacyUrl = currentLanguage === 'ja' ? '/ja/privacy' : '/privacy';
                handleNavigation(privacyUrl);
              }}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 focus:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.privacyPolicy')}
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};
