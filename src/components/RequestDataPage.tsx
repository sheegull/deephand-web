import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import MetaBalls from './ui/MetaBalls';
import { t, getCurrentLanguage } from '../lib/i18n';
import { logError } from '../lib/error-handling';

interface RequestDataPageProps {
  onLogoClick?: () => void;
  onFooterClick?: (element: string) => void;
}

export const RequestDataPage = ({ onLogoClick, onFooterClick }: RequestDataPageProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [showValidation, setShowValidation] = React.useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = React.useState<string[]>([]);
  const [otherDataType, setOtherDataType] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [step1Valid, setStep1Valid] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = React.useState<Record<string, boolean>>({});
  const [fieldLengths, setFieldLengths] = React.useState({
    backgroundPurpose: 0,
    dataDetails: 0,
    dataVolume: 0,
    deadline: 0,
    budget: 0,
    otherRequirements: 0,
  });
  const totalSteps = 2;

  // Hydration-safe client detection
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Client-safe navigation functions
  const handleNavigation = (url: string) => {
    if (isClient && typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // Real-time field validation
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return t('validation.nameRequired');
        }
        break;
      case 'email':
        if (!value || value.trim().length === 0) {
          return t('validation.emailRequired');
        }
        if (!value.includes('@') || !value.includes('.')) {
          return t('validation.emailInvalid');
        }
        break;
      case 'backgroundPurpose':
        if (!value || value.trim().length === 0) {
          return t('validation.backgroundRequired');
        }
        break;
      case 'dataVolume':
        if (!value || value.trim().length === 0) {
          return t('validation.dataVolumeRequired');
        }
        break;
      case 'deadline':
        if (!value || value.trim().length === 0) {
          return t('validation.deadlineRequired');
        }
        break;
      case 'budget':
        if (!value || value.trim().length === 0) {
          return t('validation.budgetRequired');
        }
        break;
    }
    return '';
  };

  // Handle field blur for validation
  const handleFieldBlur = (fieldName: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Handle field change for validation
  const handleFieldChange = (fieldName: string, value: string) => {
    if (touchedFields[fieldName]) {
      const error = validateField(fieldName, value);
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  // Validation for step 1 - 最低限のバリデーション
  const validateStep1 = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return false;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value;
    const background = (form.querySelector('[name="backgroundPurpose"]') as HTMLTextAreaElement)
      ?.value;

    // Validate all fields
    const nameError = validateField('name', name || '');
    const emailError = validateField('email', email || '');
    const backgroundError = validateField('backgroundPurpose', background || '');

    setFieldErrors({
      name: nameError,
      email: emailError,
      backgroundPurpose: backgroundError,
    });

    setTouchedFields({
      name: true,
      email: true,
      backgroundPurpose: true,
    });

    const isValid = !nameError && !emailError && !backgroundError;
    setStep1Valid(isValid);
    return isValid;
  };

  React.useEffect(() => {
    if (currentStep === 1) {
      const checkValidation = () => validateStep1();
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('input', checkValidation);
        return () => form.removeEventListener('input', checkValidation);
      }
    }
  }, [currentStep]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowValidation(true);
    setValidationErrors([]);

    const formData = new FormData(e.currentTarget);

    // バリデーション
    const errors: string[] = [];

    // Step 1のバリデーション（多言語対応）
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const backgroundPurpose = formData.get('backgroundPurpose') as string;

    if (!name || name.trim().length === 0) {
      errors.push(t('validation.nameRequired'));
    }
    if (!email || email.trim().length === 0) {
      errors.push(t('validation.emailRequired'));
    } else if (!email.includes('@')) {
      errors.push(t('validation.emailInvalid'));
    }
    if (!backgroundPurpose || backgroundPurpose.trim().length === 0) {
      errors.push(t('validation.backgroundRequired'));
    } else if (backgroundPurpose.trim().length < 5) {
      errors.push(t('validation.backgroundTooShort'));
    }

    // Step 2のバリデーション（多言語対応）
    if (selectedDataTypes.length === 0) {
      errors.push(t('validation.dataTypeRequired'));
    }

    const dataVolume = formData.get('dataVolume') as string;
    const deadline = formData.get('deadline') as string;
    const budget = formData.get('budget') as string;

    if (!dataVolume || dataVolume.trim().length === 0) {
      errors.push(t('validation.dataVolumeRequired'));
    }
    if (!deadline || deadline.trim().length === 0) {
      errors.push(t('validation.deadlineRequired'));
    }
    if (!budget || budget.trim().length === 0) {
      errors.push(t('validation.budgetRequired'));
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const data = {
      name: formData.get('name'),
      organization: formData.get('organization'),
      email: formData.get('email'),
      backgroundPurpose: formData.get('backgroundPurpose'),
      dataType: selectedDataTypes.includes('other')
        ? [...selectedDataTypes.filter(t => t !== 'other'), `other: ${otherDataType}`]
        : selectedDataTypes,
      dataDetails: formData.get('dataDetails'),
      dataVolume: formData.get('dataVolume'),
      deadline: formData.get('deadline'),
      budget: formData.get('budget'),
      otherRequirements: formData.get('otherRequirements'),
      language: getCurrentLanguage(),
    };

    try {
      const response = await fetch('/api/request', {
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
        logError('Data request form JSON parse failed', {
          operation: 'data_request_form_parse_error',
          timestamp: isClient ? Date.now() : 0,
          responseText: responseText.substring(0, 200),
        });
        setSubmitStatus('error');
        return;
      }

      // 🔍 DEBUG: レスポンス詳細ログ
      console.log('🔍 [DATA REQUEST DEBUG] Response details:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      console.log('🔍 [DATA REQUEST DEBUG] Parsed result:', {
        result,
        resultType: typeof result,
        resultSuccess: result?.success,
        resultSuccessType: typeof result?.success,
        resultEmailId: result?.emailId,
        resultMessage: result?.message,
        resultErrors: result?.errors,
      });

      // 簡結かつ確実な成功判定ロジック
      // 1. HTTP 200 OK = サーバー処理成功
      // 2. result.success === true OR emailId存在 = メール送信成功
      const isMainFunctionSuccessful =
        response.status === 200 &&
        response.ok &&
        (result.success === true || (result.emailId && result.emailId.length > 0));

      // 🔍 DEBUG: 成功判定の詳細ログ
      console.log('🔍 [DATA REQUEST DEBUG] Success logic evaluation:', {
        'response.ok': response.ok,
        'result.success === true': result.success === true,
        'result.success !== false': result.success !== false,
        'result.emailId exists': !!result.emailId,
        'response.status === 200': response.status === 200,
        'Final isMainFunctionSuccessful': isMainFunctionSuccessful,
      });

      if (isMainFunctionSuccessful) {
        console.log('✅ [DATA REQUEST DEBUG] Setting status to SUCCESS');
        setSubmitStatus('success');
        e.currentTarget.reset();
        setSelectedDataTypes([]);
        setOtherDataType('');
        setCurrentStep(1); // Reset to first step
        setFieldErrors({});
        setTouchedFields({});
        setFieldLengths({
          backgroundPurpose: 0,
          dataDetails: 0,
          dataVolume: 0,
          deadline: 0,
          budget: 0,
          otherRequirements: 0,
        });

        // 成功ログ
        logError('Data request submitted successfully', {
          operation: 'data_request_success_frontend',
          timestamp: isClient ? Date.now() : 0,
          emailId: result?.emailId,
        });
      } else {
        console.log('❌ [DATA REQUEST DEBUG] Setting status to ERROR');
        // 真のエラー（バリデーション失敗、ネットワークエラー等）のみエラー表示
        logError('Data request form submission failed', {
          operation: 'data_request_form_failed',
          timestamp: isClient ? Date.now() : 0,
          responseStatus: response.status,
          responseData: result,
        });
        setSubmitStatus('error');
      }
    } catch (error) {
      logError('Data request form submission failed', {
        operation: 'data_request_form_exception',
        timestamp: isClient ? Date.now() : 0,
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form field data for mapping
  const formFields = [
    {
      id: 'name',
      label: `${t('request.name')} *`,
      placeholder: t('request.placeholder.name'),
      required: true,
    },
    {
      id: 'organization',
      label: t('request.organization'),
      placeholder: t('request.placeholder.organization'),
      required: false,
    },
    {
      id: 'email',
      label: `${t('request.email')} *`,
      placeholder: t('request.placeholder.email'),
      required: true,
    },
  ];

  const dataTypeOptions = [
    { id: 'text', label: t('request.dataTypeOptions.text') },
    { id: 'image', label: t('request.dataTypeOptions.image') },
    { id: 'video', label: t('request.dataTypeOptions.video') },
    { id: 'audio', label: t('request.dataTypeOptions.audio') },
    { id: 'other', label: t('request.dataTypeOptions.other') },
  ];

  const handleDataTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedDataTypes(prev => [...prev, typeId]);
    } else {
      setSelectedDataTypes(prev => prev.filter(id => id !== typeId));
      if (typeId === 'other') {
        setOtherDataType('');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-[#1e1e1e] min-h-screen">
      {/* Left side with logo */}
      <div className="hidden md:flex w-full md:w-1/2 min-h-screen relative flex-col">
        <div
          className="flex items-center mt-12 ml-4 md:ml-14 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <img className="w-[40px] h-[40px] object-cover" alt="Icon" src="/logo.png" />
          <div className="ml-1 font-alliance font-light text-white text-[32px] leading-[28.8px] whitespace-nowrap">
            DeepHand
          </div>
        </div>

        {/* Meta Balls Animation - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-1 relative">
          <div className="absolute inset-0 z-0">
            <MetaBalls
              color="#ffffff"
              cursorBallColor="#ffffff"
              speed={0.2}
              ballCount={12}
              animationSize={25}
              enableMouseInteraction={true}
              enableTransparency={true}
              hoverSmoothness={0.08}
              clumpFactor={0.8}
              cursorBallSize={2.5}
            />
          </div>
        </div>

        {/* Footer for desktop */}
        <footer className="mb-8 ml-4 md:ml-14 flex flex-col gap-4">
          <div className="flex gap-6">
            <a
              onClick={() => onFooterClick?.('terms-of-service')}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.termsOfService')}
            </a>
            <a
              onClick={() => onFooterClick?.('privacy-policy')}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.privacyPolicy')}
            </a>
          </div>
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
        </footer>
      </div>

      {/* Mobile header */}
      <div
        className="flex justify-center items-center md:hidden mt-6 mb-6 cursor-pointer"
        onClick={() => handleNavigation('/')}
      >
        <img className="w-[24px] h-[24px] object-cover" src="/logo.png" alt="Icon" />
        <div className="ml-0.5 font-alliance font-light text-white text-[24px] leading-[20px] whitespace-nowrap">
          DeepHand
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 bg-white flex-1 relative">
        {/* Background MetaBalls for form area */}
        <div className="absolute inset-0 z-0 opacity-5">
          <MetaBalls
            color="#234ad9"
            cursorBallColor="#234ad9"
            speed={0.05}
            ballCount={6}
            animationSize={15}
            enableMouseInteraction={false}
            enableTransparency={true}
          />
        </div>

        <Card className="border-0 shadow-none h-full rounded-none bg-transparent relative z-10">
          <CardContent className="flex flex-col gap-8 p-6 md:p-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-alliance font-semibold text-gray-900 text-xl md:text-2xl leading-[28.8px]">
                  {t('request.title')}
                </h2>
                <p className="font-alliance font-normal text-gray-500 text-base leading-[19.2px] whitespace-pre-line">
                  {t('request.subtitle')}
                </p>
              </div>

              {/* Step Progress Indicator */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-alliance font-medium ${
                      currentStep >= 1 ? 'bg-[#234ad9] text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`font-alliance text-sm ${
                      currentStep >= 1 ? 'text-[#234ad9] font-medium' : 'text-gray-500'
                    }`}
                  >
                    {t('ui.step1')}
                  </span>
                </div>

                <div
                  className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-[#234ad9]' : 'bg-gray-200'}`}
                ></div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-alliance font-medium ${
                      currentStep >= 2 ? 'bg-[#234ad9] text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`font-alliance text-sm ${
                      currentStep >= 2 ? 'text-[#234ad9] font-medium' : 'text-gray-500'
                    }`}
                  >
                    {t('ui.step2')}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  {/* Map through standard input fields */}
                  {formFields.map(field => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <Label
                        htmlFor={field.id}
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={field.id}
                        name={field.id}
                        placeholder={field.placeholder}
                        minLength={field.id === 'email' ? 0 : 1}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        onBlur={e => handleFieldBlur(field.id, e.target.value)}
                        className={`h-12 rounded-md font-sans text-sm ${
                          touchedFields[field.id] && fieldErrors[field.id]
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                      />
                      {touchedFields[field.id] && fieldErrors[field.id] && (
                        <span className="text-red-500 text-xs font-alliance font-light mt-1">
                          {fieldErrors[field.id]}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Background and Purpose field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="backgroundPurpose"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.backgroundPurpose')} *
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.backgroundPurpose} / 1000
                      </span>
                    </div>
                    <Textarea
                      id="backgroundPurpose"
                      name="backgroundPurpose"
                      placeholder={t('request.placeholder.backgroundPurpose')}
                      minLength={1}
                      maxLength={1000}
                      onChange={e => {
                        setFieldLengths(prev => ({
                          ...prev,
                          backgroundPurpose: e.target.value.length,
                        }));
                        handleFieldChange('backgroundPurpose', e.target.value);
                      }}
                      onBlur={e => handleFieldBlur('backgroundPurpose', e.target.value)}
                      className={`min-h-[120px] h-[120px] max-h-[250px] rounded-md font-sans text-sm resize-y transition-all duration-200 ${
                        touchedFields.backgroundPurpose && fieldErrors.backgroundPurpose
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {touchedFields.backgroundPurpose && fieldErrors.backgroundPurpose && (
                      <span className="text-red-500 text-xs font-alliance font-light mt-1">
                        {fieldErrors.backgroundPurpose}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  {/* Data type checkboxes */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]">
                      {t('request.dataType')} *
                    </Label>
                    <div className="flex flex-col gap-3">
                      {dataTypeOptions.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={selectedDataTypes.includes(option.id)}
                            onCheckedChange={checked => handleDataTypeChange(option.id, checked)}
                          />
                          <Label
                            htmlFor={option.id}
                            className="font-alliance font-normal text-gray-700 text-sm cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                      {selectedDataTypes.includes('other') && (
                        <Input
                          placeholder={t('ui.otherSpecify')}
                          value={otherDataType}
                          onChange={e => setOtherDataType(e.target.value)}
                          className="ml-6 h-10 rounded-md font-sans text-sm"
                        />
                      )}
                    </div>
                    {selectedDataTypes.length === 0 && showValidation && (
                      <span className="text-red-500 text-sm">
                        {t('validation.dataTypeRequired')}
                      </span>
                    )}
                  </div>

                  {/* Data details field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="dataDetails"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.dataDetails')}
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.dataDetails} / 1000
                      </span>
                    </div>
                    <Textarea
                      id="dataDetails"
                      name="dataDetails"
                      placeholder={t('request.placeholder.dataDetails')}
                      maxLength={1000}
                      onChange={e =>
                        setFieldLengths(prev => ({ ...prev, dataDetails: e.target.value.length }))
                      }
                      className="min-h-[120px] h-[120px] max-h-[250px] rounded-md font-sans text-sm resize-y transition-all duration-200"
                    />
                  </div>

                  {/* Data volume field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="dataVolume"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.dataVolume')} *
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.dataVolume} / 500
                      </span>
                    </div>
                    <Textarea
                      id="dataVolume"
                      name="dataVolume"
                      placeholder={t('request.placeholder.dataVolume')}
                      minLength={1}
                      maxLength={500}
                      onChange={e => {
                        setFieldLengths(prev => ({ ...prev, dataVolume: e.target.value.length }));
                        handleFieldChange('dataVolume', e.target.value);
                      }}
                      onBlur={e => handleFieldBlur('dataVolume', e.target.value)}
                      className={`min-h-[100px] h-[100px] max-h-[200px] rounded-md font-sans text-sm resize-y transition-all duration-200 ${
                        touchedFields.dataVolume && fieldErrors.dataVolume
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {touchedFields.dataVolume && fieldErrors.dataVolume && (
                      <span className="text-red-500 text-xs font-alliance font-light mt-1">
                        {fieldErrors.dataVolume}
                      </span>
                    )}
                  </div>

                  {/* Deadline field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="deadline"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.deadline')} *
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.deadline} / 500
                      </span>
                    </div>
                    <Textarea
                      id="deadline"
                      name="deadline"
                      placeholder={t('request.placeholder.deadline')}
                      minLength={1}
                      maxLength={500}
                      onChange={e => {
                        setFieldLengths(prev => ({ ...prev, deadline: e.target.value.length }));
                        handleFieldChange('deadline', e.target.value);
                      }}
                      onBlur={e => handleFieldBlur('deadline', e.target.value)}
                      className={`min-h-[100px] h-[100px] max-h-[200px] rounded-md font-sans text-sm resize-y transition-all duration-200 ${
                        touchedFields.deadline && fieldErrors.deadline
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {touchedFields.deadline && fieldErrors.deadline && (
                      <span className="text-red-500 text-xs font-alliance font-light mt-1">
                        {fieldErrors.deadline}
                      </span>
                    )}
                  </div>

                  {/* Budget field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="budget"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.budget')} *
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.budget} / 500
                      </span>
                    </div>
                    <Textarea
                      id="budget"
                      name="budget"
                      placeholder={t('request.placeholder.budget')}
                      minLength={1}
                      maxLength={500}
                      onChange={e => {
                        setFieldLengths(prev => ({ ...prev, budget: e.target.value.length }));
                        handleFieldChange('budget', e.target.value);
                      }}
                      onBlur={e => handleFieldBlur('budget', e.target.value)}
                      className={`min-h-[100px] h-[100px] max-h-[200px] rounded-md font-sans text-sm resize-y transition-all duration-200 ${
                        touchedFields.budget && fieldErrors.budget
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {touchedFields.budget && fieldErrors.budget && (
                      <span className="text-red-500 text-xs font-alliance font-light mt-1">
                        {fieldErrors.budget}
                      </span>
                    )}
                  </div>

                  {/* Other requirements field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="otherRequirements"
                        className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                      >
                        {t('request.otherRequirements')}
                      </Label>
                      <span className="text-xs text-gray-500 font-alliance font-light">
                        {fieldLengths.otherRequirements} / 1000
                      </span>
                    </div>
                    <Textarea
                      id="otherRequirements"
                      name="otherRequirements"
                      placeholder={t('request.placeholder.otherRequirements')}
                      maxLength={1000}
                      onChange={e =>
                        setFieldLengths(prev => ({
                          ...prev,
                          otherRequirements: e.target.value.length,
                        }))
                      }
                      className="min-h-[120px] h-[120px] max-h-[250px] rounded-md font-sans text-sm resize-y transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col gap-4">
                {currentStep === 1 && (
                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Button
                        type="button"
                        onClick={() => {
                          if (validateStep1()) {
                            setCurrentStep(2);
                          }
                        }}
                        disabled={!step1Valid}
                        className="px-12 py-3 h-11 bg-[#234ad9] text-white hover:bg-[#1e3eb8] active:bg-[#183099] disabled:bg-gray-300 disabled:text-gray-500 font-alliance font-medium text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                      >
                        {t('ui.nextButton')}
                      </Button>
                    </motion.div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full h-11 bg-gray-400 text-white hover:bg-gray-500 active:bg-gray-600 font-alliance font-medium text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {t('ui.prevButton')}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex-1"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 bg-[#234ad9] text-white hover:bg-[#1e3eb8] active:bg-[#183099] disabled:bg-gray-300 font-alliance font-medium text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                      >
                        {isSubmitting ? t('request.submitting') : t('request.submit')}
                      </Button>
                    </motion.div>
                  </div>
                )}

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-emerald-700 text-sm font-alliance font-medium">
                        {t('request.success')}
                      </p>
                    </div>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <p className="text-red-700 text-sm font-alliance font-medium">
                        {t('request.error')}
                      </p>
                    </div>
                  </motion.div>
                )}
                {validationErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-200 rounded-xl p-5 shadow-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-amber-800 text-sm font-medium mb-3 font-alliance">
                          {t('validation.inputError')}
                        </p>
                        <ul className="space-y-2">
                          {validationErrors.map((error, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-amber-700 text-sm font-alliance font-light leading-relaxed">
                                {error}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </form>

            {/* Mobile footer */}
            <footer className="flex flex-col md:hidden gap-4 mt-12 mb-8">
              <div className="flex justify-center gap-6">
                <a
                  onClick={() => onFooterClick?.('terms-of-service')}
                  className="font-alliance font-light text-gray-400 text-[10px] leading-[16.8px] hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {t('footer.termsOfService')}
                </a>
                <a
                  onClick={() => onFooterClick?.('privacy-policy')}
                  className="font-alliance font-light text-gray-400 text-[10px] leading-[16.8px] hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {t('footer.privacyPolicy')}
                </a>
              </div>
              <div className="font-alliance font-light text-gray-400 text-[10px] leading-[16.8px] text-center">
                {t('footer.copyright')}
              </div>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
