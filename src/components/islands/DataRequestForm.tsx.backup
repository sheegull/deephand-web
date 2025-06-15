import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common';
import { 
  dataRequestStep1Schema, 
  dataRequestStep2Schema, 
  dataRequestStep3Schema,
  type DataRequestStep1Data,
  type DataRequestStep2Data,
  type DataRequestStep3Data 
} from '@/lib/validationSchemas';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { DATA_TYPES } from '@/lib/constants';

const TOTAL_STEPS = 3;

export function DataRequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 1: return dataRequestStep1Schema;
      case 2: return dataRequestStep2Schema;
      case 3: return dataRequestStep3Schema;
      default: return dataRequestStep1Schema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(getSchemaForStep(currentStep)),
  });

  const nextStep = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      reset();
    } else {
      handleFinalSubmit({ ...formData, ...data });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      reset();
    }
  };

  const handleFinalSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Data request submitted:', data);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          依頼を受け付けました
        </h2>
        <p className="text-lg text-green-700 mb-8">
          ありがとうございます。24時間以内に詳細なご提案をお送りいたします。
        </p>
        <Button onClick={() => window.location.href = '/'}>
          ホームに戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            ステップ {currentStep} / {TOTAL_STEPS}
          </h2>
          <span className="text-sm text-gray-600">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% 完了
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>
            基本情報
          </span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>
            プロジェクト詳細
          </span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>
            確認・送信
          </span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(nextStep)} className="p-8">
        {currentStep === 1 && <Step1 register={register} errors={errors} />}
        {currentStep === 2 && <Step2 register={register} errors={errors} watch={watch} />}
        {currentStep === 3 && <Step3 register={register} errors={errors} formData={formData} />}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                送信中...
              </>
            ) : currentStep === TOTAL_STEPS ? (
              '送信する'
            ) : (
              <>
                次へ
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Step1({ register, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">基本情報</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            会社名 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('companyName')}
            type="text"
            placeholder="株式会社サンプル"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            担当者名 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('contactPerson')}
            type="text"
            placeholder="山田太郎"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.contactPerson && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電話番号
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="03-1234-5678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function Step2({ register, errors, watch }: any) {
  const dataType = watch('dataType');
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">プロジェクト詳細</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プロジェクトタイトル <span className="text-red-500">*</span>
        </label>
        <input
          {...register('projectTitle')}
          type="text"
          placeholder="自動運転システム開発プロジェクト"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.projectTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.projectTitle.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          データタイプ <span className="text-red-500">*</span>
        </label>
        <select
          {...register('dataType')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">選択してください</option>
          {DATA_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label.ja}
            </option>
          ))}
        </select>
        {errors.dataType && (
          <p className="mt-1 text-sm text-red-600">{errors.dataType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          データ概要 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('dataDescription')}
          rows={4}
          placeholder="アノテーション対象となるデータの詳細をご記入ください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        {errors.dataDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.dataDescription.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アノテーション要件 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('annotationRequirements')}
          rows={4}
          placeholder="必要なアノテーション作業の詳細（物体検出、セグメンテーション等）"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        {errors.annotationRequirements && (
          <p className="mt-1 text-sm text-red-600">{errors.annotationRequirements.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            データ量 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('dataVolume')}
            type="text"
            placeholder="10,000枚"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.dataVolume && (
            <p className="mt-1 text-sm text-red-600">{errors.dataVolume.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            希望納期 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('timeline')}
            type="text"
            placeholder="2ヶ月"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.timeline && (
            <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            予算
          </label>
          <input
            {...register('budget')}
            type="text"
            placeholder="100万円"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function Step3({ register, errors, formData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">確認・送信</h3>
      </div>
      
      {/* Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">入力内容確認</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-700">会社名</dt>
            <dd className="text-gray-900">{formData.companyName || '-'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">担当者名</dt>
            <dd className="text-gray-900">{formData.contactPerson || '-'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">メールアドレス</dt>
            <dd className="text-gray-900">{formData.email || '-'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">プロジェクトタイトル</dt>
            <dd className="text-gray-900">{formData.projectTitle || '-'}</dd>
          </div>
        </dl>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          追加情報・備考
        </label>
        <textarea
          {...register('additionalNotes')}
          rows={4}
          placeholder="その他ご要望があればお聞かせください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          連絡方法 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              {...register('communicationPreference')}
              type="radio"
              value="email"
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-gray-700">メール</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              {...register('communicationPreference')}
              type="radio"
              value="phone"
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-gray-700">電話</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              {...register('communicationPreference')}
              type="radio"
              value="both"
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-gray-700">両方</span>
          </label>
        </div>
        {errors.communicationPreference && (
          <p className="mt-1 text-sm text-red-600">{errors.communicationPreference.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          {...register('privacyConsent')}
          type="checkbox"
          id="privacyConsent"
          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <label htmlFor="privacyConsent" className="text-sm text-gray-700">
          <span className="text-red-500">*</span> プライバシーポリシーに同意します
        </label>
      </div>
      {errors.privacyConsent && (
        <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
      )}
    </div>
  );
}