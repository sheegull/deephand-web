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
  type DataRequestStep3Data,
  type DataRequestFormData,
} from '@/lib/validationSchemas';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { DATA_TYPES } from '@/lib/constants';

const TOTAL_STEPS = 3;

interface StepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

function Step1({ onNext, initialData }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRequestStep1Data>({
    resolver: zodResolver(dataRequestStep1Schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: 基本情報</h2>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-1/3"></div>
        </div>
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
          会社名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('companyName')}
          type="text"
          id="companyName"
          placeholder="株式会社サンプル"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
          担当者名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('contactPerson')}
          type="text"
          id="contactPerson"
          placeholder="山田太郎"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.contactPerson && (
          <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="email@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          電話番号
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          placeholder="+81-90-1234-5678"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        次へ <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );
}

function Step2({ onNext, onBack, initialData }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRequestStep2Data>({
    resolver: zodResolver(dataRequestStep2Schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: プロジェクト詳細</h2>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-2/3"></div>
        </div>
      </div>

      <div>
        <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-2">
          プロジェクト名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('projectTitle')}
          type="text"
          id="projectTitle"
          placeholder="AIビジョンプロジェクト"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.projectTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.projectTitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 mb-2">
          データ種別 <span className="text-red-500">*</span>
        </label>
        <select
          {...register('dataType')}
          id="dataType"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        >
          <option value="">選択してください</option>
          {DATA_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label.ja}
            </option>
          ))}
        </select>
        {errors.dataType && <p className="mt-1 text-sm text-red-600">{errors.dataType.message}</p>}
      </div>

      <div>
        <label htmlFor="dataDescription" className="block text-sm font-medium text-gray-700 mb-2">
          データ説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('dataDescription')}
          id="dataDescription"
          rows={4}
          placeholder="データの詳細な説明を記入してください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
        />
        {errors.dataDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.dataDescription.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="annotationRequirements"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          アノテーション要件 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('annotationRequirements')}
          id="annotationRequirements"
          rows={4}
          placeholder="必要なアノテーションの詳細を記入してください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
        />
        {errors.annotationRequirements && (
          <p className="mt-1 text-sm text-red-600">{errors.annotationRequirements.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dataVolume" className="block text-sm font-medium text-gray-700 mb-2">
          データ量 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('dataVolume')}
          type="text"
          id="dataVolume"
          placeholder="10,000枚の画像"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.dataVolume && (
          <p className="mt-1 text-sm text-red-600">{errors.dataVolume.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
          納期 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('timeline')}
          type="text"
          id="timeline"
          placeholder="4週間"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {errors.timeline && <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>}
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          予算（目安）
        </label>
        <input
          {...register('budget')}
          type="text"
          id="budget"
          placeholder="¥500,000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
      </div>

      <div className="flex gap-4">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1" size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" /> 戻る
        </Button>
        <Button type="submit" className="flex-1" size="lg">
          次へ <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}

function Step3({ onNext, onBack, initialData }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRequestStep3Data>({
    resolver: zodResolver(dataRequestStep3Schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: 確認・送信</h2>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-full"></div>
        </div>
      </div>

      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
          追加要望・備考
        </label>
        <textarea
          {...register('additionalNotes')}
          id="additionalNotes"
          rows={4}
          placeholder="その他ご要望やご質問がございましたらご記入ください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="communicationPreference"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          連絡方法 <span className="text-red-500">*</span>
        </label>
        <select
          {...register('communicationPreference')}
          id="communicationPreference"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        >
          <option value="">選択してください</option>
          <option value="email">メール</option>
          <option value="phone">電話</option>
          <option value="both">メール・電話両方</option>
        </select>
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

      <div className="flex gap-4">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1" size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" /> 戻る
        </Button>
        <Button type="submit" className="flex-1" size="lg">
          送信 <CheckCircle className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}

export function DataRequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DataRequestFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStepNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinalSubmit({ ...formData, ...stepData });
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async (finalData: DataRequestFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/request-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({});
        setCurrentStep(1);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">送信完了</h3>
        <p className="text-green-700 mb-4">
          データリクエストを受け付けました。24時間以内にご返信いたします。
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
          新しいリクエスト
        </Button>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="text-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">送信中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {currentStep === 1 && <Step1 onNext={handleStepNext} initialData={formData} />}
      {currentStep === 2 && (
        <Step2 onNext={handleStepNext} onBack={handleStepBack} initialData={formData} />
      )}
      {currentStep === 3 && (
        <Step3 onNext={handleStepNext} onBack={handleStepBack} initialData={formData} />
      )}
    </div>
  );
}
