import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { t } from '../lib/i18n';

interface RequestDataPageProps {
  onLogoClick?: () => void;
  onFooterClick?: (element: string) => void;
}

export const RequestDataPage = ({
  onLogoClick,
  onFooterClick,
}: RequestDataPageProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [showValidation, setShowValidation] = React.useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = React.useState<string[]>([]);
  const [otherDataType, setOtherDataType] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [step1Valid, setStep1Valid] = React.useState(false);
  const totalSteps = 2;

  // Validation for step 1
  const validateStep1 = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return false;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value;
    const background = (form.querySelector('[name="backgroundPurpose"]') as HTMLTextAreaElement)
      ?.value;

    const isValid =
      name &&
      name.length >= 2 &&
      email &&
      email.includes('@') &&
      background &&
      background.length >= 10;

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

    // Validate data types selection
    if (selectedDataTypes.length === 0) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
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
    };

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        e.currentTarget.reset();
        setSelectedDataTypes([]);
        setOtherDataType('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Data request form submission failed:', error);
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
          onClick={() => (window.location.href = '/')}
        >
          <img className="w-[40px] h-[40px] object-cover" alt="Icon" src="/logo.png" />
          <div className="ml-1 font-alliance font-light text-white text-[32px] leading-[28.8px] whitespace-nowrap">
            DeepHand
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1"></div>

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
        onClick={() => (window.location.href = '/')}
      >
        <img className="w-[24px] h-[24px] object-cover" src="/logo.png" alt="Icon" />
        <div className="ml-0.5 font-alliance font-light text-white text-[24px] leading-[20px] whitespace-nowrap">
          DeepHand
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 bg-white flex-1">
        <Card className="border-0 shadow-none h-full rounded-none bg-white">
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
                        required={field.required}
                        className="h-12 rounded-md font-sans text-sm"
                      />
                    </div>
                  ))}

                  {/* Background and Purpose field */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="backgroundPurpose"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.backgroundPurpose')} *
                    </Label>
                    <Textarea
                      id="backgroundPurpose"
                      name="backgroundPurpose"
                      placeholder={t('request.placeholder.backgroundPurpose')}
                      required
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
                    />
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
                    <Label
                      htmlFor="dataDetails"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.dataDetails')}
                    </Label>
                    <Textarea
                      id="dataDetails"
                      name="dataDetails"
                      placeholder={t('request.placeholder.dataDetails')}
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Data volume field */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="dataVolume"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.dataVolume')} *
                    </Label>
                    <Textarea
                      id="dataVolume"
                      name="dataVolume"
                      placeholder={t('request.placeholder.dataVolume')}
                      required
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Deadline field */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="deadline"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.deadline')} *
                    </Label>
                    <Textarea
                      id="deadline"
                      name="deadline"
                      placeholder={t('request.placeholder.deadline')}
                      required
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Budget field */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="budget"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.budget')} *
                    </Label>
                    <Textarea
                      id="budget"
                      name="budget"
                      placeholder={t('request.placeholder.budget')}
                      required
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Other requirements field */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="otherRequirements"
                      className="font-alliance font-normal text-gray-700 text-sm leading-[16.8px]"
                    >
                      {t('request.otherRequirements')}
                    </Label>
                    <Textarea
                      id="otherRequirements"
                      name="otherRequirements"
                      placeholder={t('request.placeholder.otherRequirements')}
                      className="h-[100px] rounded-md font-sans text-sm resize-none"
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
                        className="w-full h-11 bg-[#234ad9] text-white hover:bg-[#1e3eb8] active:bg-[#183099] disabled:bg-gray-300 font-alliance font-medium text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                      >
                        {isSubmitting ? t('request.submitting') : t('request.submit')}
                      </Button>
                    </motion.div>
                  </div>
                )}

                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm text-center font-alliance font-light">
                    {t('request.success')}
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center font-alliance font-light">
                    {t('request.error')}
                  </p>
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
