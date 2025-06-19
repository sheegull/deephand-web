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

export const RequestDataSectionOriginal = ({ 
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
      errors.push(t('request.validation.nameRequired') || 'お名前を入力してください');
      fieldErrors.name = t('request.validation.nameRequired') || 'お名前を入力してください';
    }
    
    if (!formData.organization.trim()) {
      errors.push(t('request.validation.organizationRequired') || '組織名を入力してください');
      fieldErrors.organization = t('request.validation.organizationRequired') || '組織名を入力してください';
    }
    
    if (!formData.email.trim()) {
      errors.push(t('request.validation.emailRequired') || 'メールアドレスを入力してください');
      fieldErrors.email = t('request.validation.emailRequired') || 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push(t('request.validation.emailInvalid') || '有効なメールアドレスを入力してください');
      fieldErrors.email = t('request.validation.emailInvalid') || '有効なメールアドレスを入力してください';
    }
    
    if (selectedDataTypes.length === 0) {
      errors.push(t('request.validation.dataTypesRequired') || 'データ種別を選択してください');
      fieldErrors.dataTypes = t('request.validation.dataTypesRequired') || 'データ種別を選択してください';
    }
    
    if (selectedDataTypes.includes('other') && !otherDataType.trim()) {
      errors.push(t('request.validation.otherDataTypeRequired') || 'その他のデータ種別を入力してください');
      fieldErrors.otherDataType = t('request.validation.otherDataTypeRequired') || 'その他のデータ種別を入力してください';
    }
    
    setValidationErrors(errors);
    setFieldErrors(fieldErrors);
    const isValid = errors.length === 0;
    setStep1Valid(isValid);
    return isValid;
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};
    
    if (!formData.backgroundPurpose.trim()) {
      errors.push(t('request.validation.backgroundRequired') || '背景・目的を入力してください');
      fieldErrors.backgroundPurpose = t('request.validation.backgroundRequired') || '背景・目的を入力してください';
    } else if (formData.backgroundPurpose.length < 50) {
      errors.push(t('request.validation.backgroundMinLength') || '背景・目的は50文字以上で入力してください');
      fieldErrors.backgroundPurpose = t('request.validation.backgroundMinLength') || '背景・目的は50文字以上で入力してください';
    }
    
    if (!formData.dataDetails.trim()) {
      errors.push(t('request.validation.dataDetailsRequired') || 'データの詳細を入力してください');
      fieldErrors.dataDetails = t('request.validation.dataDetailsRequired') || 'データの詳細を入力してください';
    } else if (formData.dataDetails.length < 30) {
      errors.push(t('request.validation.dataDetailsMinLength') || 'データの詳細は30文字以上で入力してください');
      fieldErrors.dataDetails = t('request.validation.dataDetailsMinLength') || 'データの詳細は30文字以上で入力してください';
    }
    
    if (!formData.dataVolume.trim()) {
      errors.push(t('request.validation.dataVolumeRequired') || 'データ量を入力してください');
      fieldErrors.dataVolume = t('request.validation.dataVolumeRequired') || 'データ量を入力してください';
    }
    
    if (!formData.deadline.trim()) {
      errors.push(t('request.validation.deadlineRequired') || '希望納期を入力してください');
      fieldErrors.deadline = t('request.validation.deadlineRequired') || '希望納期を入力してください';
    }
    
    if (!formData.budget.trim()) {
      errors.push(t('request.validation.budgetRequired') || '予算を入力してください');
      fieldErrors.budget = t('request.validation.budgetRequired') || '予算を入力してください';
    }
    
    setValidationErrors(errors);
    setFieldErrors(fieldErrors);
    return errors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // リアルタイム文字数カウント
    if (field in fieldLengths) {
      setFieldLengths(prev => ({ 
        ...prev, 
        [field]: value.length 
      }));
    }
    
    // エラーをクリア
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDataTypeChange = (dataTypeId: string, checked: boolean) => {
    setSelectedDataTypes(prev => {
      if (checked) {
        return [...prev, dataTypeId];
      } else {
        return prev.filter(id => id !== dataTypeId);
      }
    });
    
    // エラーをクリア
    if (fieldErrors.dataTypes) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dataTypes;
        return newErrors;
      });
    }
  };

  const handleOtherDataTypeChange = (value: string) => {
    setOtherDataType(value);
    
    // エラーをクリア
    if (fieldErrors.otherDataType) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.otherDataType;
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setShowValidation(false);
        setValidationErrors([]);
        setFieldErrors({});
      } else {
        setShowValidation(true);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setShowValidation(false);
      setValidationErrors([]);
      setFieldErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      setShowValidation(true);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const submitData = {
        ...formData,
        dataTypes: selectedDataTypes,
        otherDataType: selectedDataTypes.includes('other') ? otherDataType : '',
        timestamp: new Date().toISOString(),
        language: currentLanguage,
      };
      
      // TODO: 実際のAPI送信処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      
      // フォームデータをクリア
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
      setFieldLengths({
        backgroundPurpose: 0,
        dataDetails: 0,
        dataVolume: 0,
        deadline: 0,
        budget: 0,
        otherRequirements: 0,
      });
      
      // ローカルストレージをクリア
      localStorage.removeItem('requestFormData');
      
    } catch (error) {
      logError('Form submission failed', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
    setSubmitStatus('idle');
    setShowValidation(false);
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
    
    // ローカルストレージをクリア
    localStorage.removeItem('requestFormData');
  };

  if (!isClient) {
    return (
      <div className={`min-h-screen bg-[#1e1e1e] ${className}`} data-testid={testId}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#1e1e1e] relative overflow-hidden ${className}`} data-testid={testId}>
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <MetaBalls />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <h1 className="font-alliance font-normal text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              {t('request.title') || 'データアノテーション依頼'}
            </h1>
            <p className="font-alliance font-light text-xl text-zinc-400 leading-relaxed mb-6">
              {t('request.subtitle') || 'お客様のプロジェクトに最適なアノテーションサービスをご提案いたします'}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300'
              }`}>
                1
              </div>
              <div className={`h-0.5 w-16 ${currentStep === 2 ? 'bg-blue-600' : 'bg-zinc-700'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300'
              }`}>
                2
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <Card className="!bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md">
              <CardContent className="p-8 lg:p-12">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-8">
                        {t('request.step1.title') || '基本情報・データ種別'}
                      </h2>
                      
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-zinc-300 font-alliance font-light">
                            {t('request.step1.name') || 'お名前'} <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20"
                            placeholder={t('request.step1.namePlaceholder') || '田中太郎'}
                          />
                          {touchedFields.name && fieldErrors.name && (
                            <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.name}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="organization" className="text-zinc-300 font-alliance font-light">
                            {t('request.step1.organization') || '組織名'} <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => handleInputChange('organization', e.target.value)}
                            className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20"
                            placeholder={t('request.step1.organizationPlaceholder') || '株式会社サンプル'}
                          />
                          {touchedFields.organization && fieldErrors.organization && (
                            <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.organization}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-8">
                        <Label htmlFor="email" className="text-zinc-300 font-alliance font-light">
                          {t('request.step1.email') || 'メールアドレス'} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20"
                          placeholder={t('request.step1.emailPlaceholder') || 'sample@example.com'}
                        />
                        {touchedFields.email && fieldErrors.email && (
                          <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.email}</p>
                        )}
                      </div>
                      
                      {/* Data Types */}
                      <div className="space-y-4 mb-8">
                        <Label className="text-zinc-300 font-alliance font-light">
                          {t('request.step1.dataTypes') || 'データ種別'} <span className="text-red-400">*</span>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dataTypes.map((dataType) => (
                            <div key={dataType.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={dataType.id}
                                checked={selectedDataTypes.includes(dataType.id)}
                                onCheckedChange={(checked) => handleDataTypeChange(dataType.id, checked as boolean)}
                                className="border-gray-600 text-blue-600 focus:ring-blue-500/20"
                              />
                              <Label 
                                htmlFor={dataType.id} 
                                className="text-zinc-300 font-alliance font-light cursor-pointer"
                              >
                                {dataType.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {fieldErrors.dataTypes && (
                          <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.dataTypes}</p>
                        )}
                        
                        {selectedDataTypes.includes('other') && (
                          <div className="mt-4 space-y-2">
                            <Label htmlFor="otherDataType" className="text-zinc-300 font-alliance font-light">
                              {t('request.step1.otherDataType') || 'その他のデータ種別を詳しく教えてください'} <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id="otherDataType"
                              value={otherDataType}
                              onChange={(e) => handleOtherDataTypeChange(e.target.value)}
                              className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20"
                              placeholder={t('request.step1.otherDataTypePlaceholder') || '例：3Dポイントクラウドデータ'}
                            />
                            {fieldErrors.otherDataType && (
                              <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.otherDataType}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Validation Errors */}
                      {showValidation && validationErrors.length > 0 && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h3 className="text-red-400 font-alliance font-medium mb-2">
                            {t('request.validation.errors') || '入力内容をご確認ください'}
                          </h3>
                          <ul className="space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="text-red-400 text-sm font-alliance font-light">
                                • {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Next Button */}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium px-8 py-3 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                        >
                          {t('request.step1.next') || '次へ進む'}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-8">
                        {t('request.step2.title') || 'プロジェクト詳細'}
                      </h2>
                      
                      {/* Background Purpose */}
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="backgroundPurpose" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                          <span>
                            {t('request.step2.backgroundPurpose') || '背景・目的'} <span className="text-red-400">*</span>
                          </span>
                          <span className="text-zinc-500 text-sm">
                            {fieldLengths.backgroundPurpose}/500 ({fieldLengths.backgroundPurpose >= 50 ? '✓' : '50文字以上'})
                          </span>
                        </Label>
                        <Textarea
                          id="backgroundPurpose"
                          value={formData.backgroundPurpose}
                          onChange={(e) => handleInputChange('backgroundPurpose', e.target.value)}
                          className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[120px] resize-none"
                          placeholder={t('request.step2.backgroundPurposePlaceholder') || 'AI学習データの作成プロジェクトで、高品質なアノテーションデータが必要です...'}
                          maxLength={500}
                        />
                        {touchedFields.backgroundPurpose && fieldErrors.backgroundPurpose && (
                          <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.backgroundPurpose}</p>
                        )}
                      </div>
                      
                      {/* Data Details */}
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="dataDetails" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                          <span>
                            {t('request.step2.dataDetails') || 'データの詳細'} <span className="text-red-400">*</span>
                          </span>
                          <span className="text-zinc-500 text-sm">
                            {fieldLengths.dataDetails}/400 ({fieldLengths.dataDetails >= 30 ? '✓' : '30文字以上'})
                          </span>
                        </Label>
                        <Textarea
                          id="dataDetails"
                          value={formData.dataDetails}
                          onChange={(e) => handleInputChange('dataDetails', e.target.value)}
                          className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[100px] resize-none"
                          placeholder={t('request.step2.dataDetailsPlaceholder') || '商品画像にバウンディングボックスのアノテーションを行い...'}
                          maxLength={400}
                        />
                        {touchedFields.dataDetails && fieldErrors.dataDetails && (
                          <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.dataDetails}</p>
                        )}
                      </div>
                      
                      {/* Project Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="dataVolume" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                            <span>
                              {t('request.step2.dataVolume') || 'データ量'} <span className="text-red-400">*</span>
                            </span>
                            <span className="text-zinc-500 text-sm">{fieldLengths.dataVolume}/100</span>
                          </Label>
                          <Textarea
                            id="dataVolume"
                            value={formData.dataVolume}
                            onChange={(e) => handleInputChange('dataVolume', e.target.value)}
                            className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[80px] resize-none"
                            placeholder={t('request.step2.dataVolumePlaceholder') || '画像10,000枚程度'}
                            maxLength={100}
                          />
                          {touchedFields.dataVolume && fieldErrors.dataVolume && (
                            <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.dataVolume}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deadline" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                            <span>
                              {t('request.step2.deadline') || '希望納期'} <span className="text-red-400">*</span>
                            </span>
                            <span className="text-zinc-500 text-sm">{fieldLengths.deadline}/100</span>
                          </Label>
                          <Textarea
                            id="deadline"
                            value={formData.deadline}
                            onChange={(e) => handleInputChange('deadline', e.target.value)}
                            className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[80px] resize-none"
                            placeholder={t('request.step2.deadlinePlaceholder') || '2024年3月末まで'}
                            maxLength={100}
                          />
                          {touchedFields.deadline && fieldErrors.deadline && (
                            <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.deadline}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="budget" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                          <span>
                            {t('request.step2.budget') || '予算'} <span className="text-red-400">*</span>
                          </span>
                          <span className="text-zinc-500 text-sm">{fieldLengths.budget}/100</span>
                        </Label>
                        <Textarea
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[80px] resize-none"
                          placeholder={t('request.step2.budgetPlaceholder') || '100万円程度（相談可）'}
                          maxLength={100}
                        />
                        {touchedFields.budget && fieldErrors.budget && (
                          <p className="text-red-400 text-sm font-alliance font-light">{fieldErrors.budget}</p>
                        )}
                      </div>
                      
                      {/* Other Requirements */}
                      <div className="space-y-2 mb-8">
                        <Label htmlFor="otherRequirements" className="text-zinc-300 font-alliance font-light flex items-center justify-between">
                          <span>{t('request.step2.otherRequirements') || 'その他ご要望'}</span>
                          <span className="text-zinc-500 text-sm">{fieldLengths.otherRequirements}/300</span>
                        </Label>
                        <Textarea
                          id="otherRequirements"
                          value={formData.otherRequirements}
                          onChange={(e) => handleInputChange('otherRequirements', e.target.value)}
                          className="bg-[#0F0F0F]/50 border-gray-600/50 text-white placeholder-zinc-500 font-alliance font-light focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[100px] resize-none"
                          placeholder={t('request.step2.otherRequirementsPlaceholder') || 'セキュリティ要件やその他のご要望があればお聞かせください'}
                          maxLength={300}
                        />
                      </div>
                      
                      {/* Validation Errors */}
                      {showValidation && validationErrors.length > 0 && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h3 className="text-red-400 font-alliance font-medium mb-2">
                            {t('request.validation.errors') || '入力内容をご確認ください'}
                          </h3>
                          <ul className="space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="text-red-400 text-sm font-alliance font-light">
                                • {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Navigation Buttons */}
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="border-gray-600/50 text-zinc-300 font-alliance font-medium px-8 py-3 rounded-lg hover:bg-gray-800/50"
                        >
                          {t('request.step2.prev') || '前に戻る'}
                        </Button>
                        
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium px-8 py-3 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t('request.step2.submitting') || '送信中...'}
                            </>
                          ) : (
                            t('request.step2.submit') || '依頼を送信'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="!bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md max-w-md w-full mx-4">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-alliance font-normal text-xl mb-2">
                    {t('request.success.title') || '送信完了'}
                  </h3>
                  <p className="text-zinc-400 font-alliance font-light mb-6">
                    {t('request.success.message') || 'ご依頼を受け付けました。担当者より追ってご連絡いたします。'}
                  </p>
                  <Button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium px-6 py-2 rounded-lg"
                  >
                    {t('request.success.close') || '閉じる'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="!bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md max-w-md w-full mx-4">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-white font-alliance font-normal text-xl mb-2">
                    {t('request.error.title') || '送信エラー'}
                  </h3>
                  <p className="text-zinc-400 font-alliance font-light mb-6">
                    {t('request.error.message') || '送信中にエラーが発生しました。しばらくしてから再度お試しください。'}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setSubmitStatus('idle')}
                      variant="outline"
                      className="border-gray-600/50 text-zinc-300 font-alliance font-medium px-4 py-2 rounded-lg hover:bg-gray-800/50 flex-1"
                    >
                      {t('request.error.close') || '閉じる'}
                    </Button>
                    <Button
                      onClick={resetForm}
                      className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium px-4 py-2 rounded-lg flex-1"
                    >
                      {t('request.error.reset') || 'リセット'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};