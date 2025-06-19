import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import MetaBalls from '../ui/MetaBalls';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';
import { logError } from '../../lib/error-handling';

interface RequestDataSectionProps {
  className?: string;
  'data-testid'?: string;
}

export const RequestDataSection = ({ 
  className = '',
  'data-testid': testId = 'request-data-section' 
}: RequestDataSectionProps) => {
  const { currentLanguage } = useLanguage();
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

  // フォームデータの永続化
  const [formData, setFormData] = React.useState({
    name: '',
    organization: '',
    email: '',
    backgroundPurpose: '',
    dataDetails: '',
    dataVolume: '',
    deadline: '',
    budget: '',
    otherRequirements: '',
    dataTypes: [] as string[],
    otherDataType: '',
  });

  React.useEffect(() => {
    setIsClient(true);
    
    // フォームデータの復元
    const savedData = localStorage.getItem('requestFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setSelectedDataTypes(parsed.dataTypes || []);
        setOtherDataType(parsed.otherDataType || '');
      } catch (error) {
        logError('Failed to parse saved form data', error);
      }
    }
  }, []);

  // フォームデータの保存
  React.useEffect(() => {
    if (isClient) {
      const dataToSave = {
        ...formData,
        dataTypes: selectedDataTypes,
        otherDataType,
      };
      localStorage.setItem('requestFormData', JSON.stringify(dataToSave));
    }
  }, [formData, selectedDataTypes, otherDataType, isClient]);

  const dataTypes = [
    { id: 'text', label: t('request.dataTypes.text') || 'テキストデータ' },
    { id: 'image', label: t('request.dataTypes.image') || '画像データ' },
    { id: 'video', label: t('request.dataTypes.video') || '動画データ' },
    { id: 'audio', label: t('request.dataTypes.audio') || '音声データ' },
    { id: 'sensor', label: t('request.dataTypes.sensor') || 'センサーデータ' },
    { id: 'other', label: t('request.dataTypes.other') || 'その他' },
  ];

  const validateStep1 = () => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.push(t('validation.nameRequired') || '氏名は必須です');
      fieldErrors.name = t('validation.nameRequired') || '氏名は必須です';
    }

    if (!formData.email.trim()) {
      errors.push(t('validation.emailRequired') || 'メールアドレスは必須です');
      fieldErrors.email = t('validation.emailRequired') || 'メールアドレスは必須です';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errors.push(t('validation.emailInvalid') || 'メールアドレスの形式が正しくありません');
      fieldErrors.email = t('validation.emailInvalid') || 'メールアドレスの形式が正しくありません';
    }

    if (!formData.backgroundPurpose.trim()) {
      errors.push(t('validation.backgroundRequired') || '背景・目的は必須です');
      fieldErrors.backgroundPurpose = t('validation.backgroundRequired') || '背景・目的は必須です';
    } else if (formData.backgroundPurpose.trim().length < 10) {
      errors.push(t('validation.backgroundMinLength') || '背景・目的は10文字以上で入力してください');
      fieldErrors.backgroundPurpose = t('validation.backgroundMinLength') || '背景・目的は10文字以上で入力してください';
    }

    if (selectedDataTypes.length === 0) {
      errors.push(t('validation.dataTypesRequired') || 'データ種別を選択してください');
      fieldErrors.dataTypes = t('validation.dataTypesRequired') || 'データ種別を選択してください';
    }

    if (selectedDataTypes.includes('other') && !otherDataType.trim()) {
      errors.push(t('validation.otherDataTypeRequired') || 'その他のデータ種別を入力してください');
      fieldErrors.otherDataType = t('validation.otherDataTypeRequired') || 'その他のデータ種別を入力してください';
    }

    setValidationErrors(errors);
    setFieldErrors(fieldErrors);
    return errors.length === 0;
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};

    if (!formData.dataDetails.trim()) {
      errors.push(t('validation.dataDetailsRequired') || 'データの詳細は必須です');
      fieldErrors.dataDetails = t('validation.dataDetailsRequired') || 'データの詳細は必須です';
    }

    if (!formData.dataVolume.trim()) {
      errors.push(t('validation.dataVolumeRequired') || 'データ量は必須です');
      fieldErrors.dataVolume = t('validation.dataVolumeRequired') || 'データ量は必須です';
    }

    if (!formData.deadline.trim()) {
      errors.push(t('validation.deadlineRequired') || '希望納期は必須です');
      fieldErrors.deadline = t('validation.deadlineRequired') || '希望納期は必須です';
    }

    setValidationErrors(errors);
    setFieldErrors(fieldErrors);
    return errors.length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update character count for specific fields
    if (['backgroundPurpose', 'dataDetails', 'dataVolume', 'deadline', 'budget', 'otherRequirements'].includes(field)) {
      setFieldLengths(prev => ({ ...prev, [field]: value.length }));
    }
  };

  const handleDataTypeChange = (dataTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedDataTypes(prev => [...prev, dataTypeId]);
    } else {
      setSelectedDataTypes(prev => prev.filter(id => id !== dataTypeId));
      if (dataTypeId === 'other') {
        setOtherDataType('');
      }
    }
    
    // Clear validation error when selection changes
    if (fieldErrors.dataTypes) {
      setFieldErrors(prev => ({ ...prev, dataTypes: '' }));
    }
  };

  const handleNextStep = () => {
    setShowValidation(true);
    if (validateStep1()) {
      setCurrentStep(2);
      setShowValidation(false);
      setStep1Valid(true);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setShowValidation(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submitData = {
        ...formData,
        dataTypes: selectedDataTypes,
        otherDataType: selectedDataTypes.includes('other') ? otherDataType : '',
        submittedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear form data from localStorage
      localStorage.removeItem('requestFormData');
      
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        organization: '',
        email: '',
        backgroundPurpose: '',
        dataDetails: '',
        dataVolume: '',
        deadline: '',
        budget: '',
        otherRequirements: '',
        dataTypes: [],
        otherDataType: '',
      });
      setSelectedDataTypes([]);
      setOtherDataType('');
      setCurrentStep(1);
      setStep1Valid(false);
      setValidationErrors([]);
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
    } catch (error) {
      logError('Form submission failed', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setShowValidation(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${className}`} data-testid={testId}>
      {/* MetaBalls Background */}
      <div className="fixed inset-0 z-0">
        <MetaBalls />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-gray-700/30 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t('request.title') || 'データアノテーション依頼'}
                </h1>
                <p className="text-lg text-gray-300">
                  {t('request.subtitle') || '高品質なアノテーションサービスをご提供します'}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    1
                  </div>
                  <div className={`h-1 w-16 ${step1Valid ? 'bg-blue-600' : 'bg-gray-600'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    2
                  </div>
                </div>
              </div>

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {t('request.success.title') || '送信完了'}
                  </h2>
                  <p className="text-gray-300 mb-8">
                    {t('request.success.message') || 'お申し込みありがとうございます。担当者より2営業日以内にご連絡いたします。'}
                  </p>
                  <Button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {t('request.success.newRequest') || '新しい依頼を送信'}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">
                        {t('request.step1.title') || 'ステップ1: 基本情報'}
                      </h2>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            {t('request.fields.name') || '氏名'} <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className={`bg-gray-800/50 border-gray-600 text-white ${
                              showValidation && fieldErrors.name ? 'border-red-500' : ''
                            }`}
                            placeholder={t('request.placeholders.name') || '山田太郎'}
                          />
                          {showValidation && fieldErrors.name && (
                            <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="organization" className="text-white">
                            {t('request.fields.organization') || '組織名'}
                          </Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => handleFieldChange('organization', e.target.value)}
                            className="bg-gray-800/50 border-gray-600 text-white"
                            placeholder={t('request.placeholders.organization') || '株式会社サンプル'}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-white">
                          {t('request.fields.email') || 'メールアドレス'} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          className={`bg-gray-800/50 border-gray-600 text-white ${
                            showValidation && fieldErrors.email ? 'border-red-500' : ''
                          }`}
                          placeholder={t('request.placeholders.email') || 'example@company.com'}
                        />
                        {showValidation && fieldErrors.email && (
                          <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="backgroundPurpose" className="text-white">
                          {t('request.fields.backgroundPurpose') || '背景・目的'} <span className="text-red-400">*</span>
                          <span className="text-gray-400 text-sm ml-2">
                            ({fieldLengths.backgroundPurpose}/500文字)
                          </span>
                        </Label>
                        <Textarea
                          id="backgroundPurpose"
                          value={formData.backgroundPurpose}
                          onChange={(e) => handleFieldChange('backgroundPurpose', e.target.value)}
                          className={`bg-gray-800/50 border-gray-600 text-white min-h-[120px] ${
                            showValidation && fieldErrors.backgroundPurpose ? 'border-red-500' : ''
                          }`}
                          placeholder={t('request.placeholders.backgroundPurpose') || 'プロジェクトの背景や目的をご記入ください...'}
                          maxLength={500}
                        />
                        {showValidation && fieldErrors.backgroundPurpose && (
                          <p className="text-red-400 text-sm mt-1">{fieldErrors.backgroundPurpose}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-white">
                          {t('request.fields.dataTypes') || 'データ種別'} <span className="text-red-400">*</span>
                        </Label>
                        <div className="grid md:grid-cols-3 gap-3 mt-2">
                          {dataTypes.map((type) => (
                            <div key={type.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={type.id}
                                checked={selectedDataTypes.includes(type.id)}
                                onCheckedChange={(checked) => handleDataTypeChange(type.id, checked as boolean)}
                                className="border-gray-600"
                              />
                              <Label htmlFor={type.id} className="text-white text-sm">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedDataTypes.includes('other') && (
                          <div className="mt-3">
                            <Input
                              value={otherDataType}
                              onChange={(e) => setOtherDataType(e.target.value)}
                              className={`bg-gray-800/50 border-gray-600 text-white ${
                                showValidation && fieldErrors.otherDataType ? 'border-red-500' : ''
                              }`}
                              placeholder={t('request.placeholders.otherDataType') || 'その他のデータ種別を入力'}
                            />
                            {showValidation && fieldErrors.otherDataType && (
                              <p className="text-red-400 text-sm mt-1">{fieldErrors.otherDataType}</p>
                            )}
                          </div>
                        )}
                        {showValidation && fieldErrors.dataTypes && (
                          <p className="text-red-400 text-sm mt-1">{fieldErrors.dataTypes}</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                          {t('request.buttons.next') || '次へ進む'}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">
                        {t('request.step2.title') || 'ステップ2: プロジェクト詳細'}
                      </h2>

                      <div>
                        <Label htmlFor="dataDetails" className="text-white">
                          {t('request.fields.dataDetails') || 'データの詳細'} <span className="text-red-400">*</span>
                          <span className="text-gray-400 text-sm ml-2">
                            ({fieldLengths.dataDetails}/1000文字)
                          </span>
                        </Label>
                        <Textarea
                          id="dataDetails"
                          value={formData.dataDetails}
                          onChange={(e) => handleFieldChange('dataDetails', e.target.value)}
                          className={`bg-gray-800/50 border-gray-600 text-white min-h-[120px] ${
                            showValidation && fieldErrors.dataDetails ? 'border-red-500' : ''
                          }`}
                          placeholder={t('request.placeholders.dataDetails') || 'アノテーション対象のデータについて詳しくご記入ください...'}
                          maxLength={1000}
                        />
                        {showValidation && fieldErrors.dataDetails && (
                          <p className="text-red-400 text-sm mt-1">{fieldErrors.dataDetails}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="dataVolume" className="text-white">
                            {t('request.fields.dataVolume') || 'データ量'} <span className="text-red-400">*</span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({fieldLengths.dataVolume}/200文字)
                            </span>
                          </Label>
                          <Textarea
                            id="dataVolume"
                            value={formData.dataVolume}
                            onChange={(e) => handleFieldChange('dataVolume', e.target.value)}
                            className={`bg-gray-800/50 border-gray-600 text-white ${
                              showValidation && fieldErrors.dataVolume ? 'border-red-500' : ''
                            }`}
                            placeholder={t('request.placeholders.dataVolume') || '画像1000枚、動画50本など...'}
                            maxLength={200}
                          />
                          {showValidation && fieldErrors.dataVolume && (
                            <p className="text-red-400 text-sm mt-1">{fieldErrors.dataVolume}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="deadline" className="text-white">
                            {t('request.fields.deadline') || '希望納期'} <span className="text-red-400">*</span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({fieldLengths.deadline}/100文字)
                            </span>
                          </Label>
                          <Textarea
                            id="deadline"
                            value={formData.deadline}
                            onChange={(e) => handleFieldChange('deadline', e.target.value)}
                            className={`bg-gray-800/50 border-gray-600 text-white ${
                              showValidation && fieldErrors.deadline ? 'border-red-500' : ''
                            }`}
                            placeholder={t('request.placeholders.deadline') || '2024年3月末、急ぎなど...'}
                            maxLength={100}
                          />
                          {showValidation && fieldErrors.deadline && (
                            <p className="text-red-400 text-sm mt-1">{fieldErrors.deadline}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="budget" className="text-white">
                          {t('request.fields.budget') || '予算'}
                          <span className="text-gray-400 text-sm ml-2">
                            ({fieldLengths.budget}/200文字)
                          </span>
                        </Label>
                        <Textarea
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => handleFieldChange('budget', e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder={t('request.placeholders.budget') || '予算の目安がございましたらご記入ください...'}
                          maxLength={200}
                        />
                      </div>

                      <div>
                        <Label htmlFor="otherRequirements" className="text-white">
                          {t('request.fields.otherRequirements') || 'その他のご要望'}
                          <span className="text-gray-400 text-sm ml-2">
                            ({fieldLengths.otherRequirements}/500文字)
                          </span>
                        </Label>
                        <Textarea
                          id="otherRequirements"
                          value={formData.otherRequirements}
                          onChange={(e) => handleFieldChange('otherRequirements', e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white min-h-[120px]"
                          placeholder={t('request.placeholders.otherRequirements') || '特別なご要望やご質問がございましたらご記入ください...'}
                          maxLength={500}
                        />
                      </div>

                      {/* Validation Error Summary */}
                      {showValidation && validationErrors.length > 0 && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                          <h3 className="text-red-400 font-semibold mb-2">
                            {t('validation.errorsFound') || '入力エラーがあります:'}
                          </h3>
                          <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={handlePrevStep}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          {t('request.buttons.prev') || '前に戻る'}
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('request.buttons.submitting') || '送信中...'}
                            </>
                          ) : (
                            t('request.buttons.submit') || '送信する'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}

              {/* Error State */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-6"
                >
                  <p className="text-red-400">
                    {t('request.error.message') || '送信中にエラーが発生しました。しばらく時間をおいて再度お試しください。'}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestDataSection;