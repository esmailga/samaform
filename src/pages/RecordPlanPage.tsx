import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES } from '../constants/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { FormData as ProjectFormData, ProjectType, BudgetTier, AreaTier, TimeLine, RoomCount, BalconyAns, ShopType, Atmoshpere, CuisineType, SeatingCapacity, SpaceWanted, EmployeeCount, WorkEnvironment, AmenitiesWanted, SalonServices, StationsCount, Ambiance, ArchitecturalStyle } from '../components/record-plan/types';
import FormProgress from '../components/record-plan/FormProgress';
import Step1BasicInfo from '../components/record-plan/Step1BasicInfo';
import Step2ProjectType from '../components/record-plan/Step2ProjectType';
import Step3ProjectDetails from '../components/record-plan/Step3ProjectDetails';
import Step4ProjectSpecifics from '../components/record-plan/Step4ProjectSpecifics';
import Step5Images from '../components/record-plan/Step5Images';
import DynamicStep from '../components/record-plan/DynamicStep';
import SuccessMessage from '../components/record-plan/SuccessMessage';

import { validateEmail, validatePhone, validateName } from '../utils/validation';
import { convertArabicToWestern } from '../utils/numbers';

const INITIAL_DATA: ProjectFormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  projectType: '',
  budget: '',
  timeline: '',
  designType: '',
  specifics: {},
  inspirationImages: [],
  currentSpaceImages: [],
  budgetTier: '',
  budgetExact: '',
  areaTier: '',
  atmoshpere: '',
  areaExact: '',
  projectDetails: '',
  apartmentDetails: '',
  balconyAns: '',
  villaDetails: '',
  floorsCount: '',
  shopDetails: '',
  spaceDetails: '',
  officeDetails: '',
  salonDetails: '',
  priorityType: '',
  outdoorType: '',
  architecturalStyle: '',
  roomCount: '',
  employeeCount: '',
  shopType: '',
  featuresType: '',
  cuisineType: '',
  seatingCapacity: '',
  spaceWanted: '',
  workEnvironment: '',
  amenitiesWanted: '',
  salonServices: '',
  stationsCount: '',
  ambiance: '',
  roomCountExact: '',
};

export default function RecordPlanPage() {
  const { t, localePath } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    // Form config fetch removed as admin is not currently editing the form
  }, []);

  const inspirationInputRef = useRef<HTMLInputElement>(null);
  const currentSpaceInputRef = useRef<HTMLInputElement>(null);

  const updateFields = (fields: Partial<ProjectFormData>) => {
    const processedFields = { ...fields };
    Object.keys(processedFields).forEach(key => {
      const val = processedFields[key as keyof ProjectFormData];
      if (typeof val === 'string') {
        (processedFields as any)[key] = convertArabicToWestern(val);
      }
    });
    setFormData(prev => ({ ...prev, ...processedFields }));
  };

  const updateSpecifics = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifics: { ...prev.specifics, [key]: convertArabicToWestern(value) }
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'inspiration' | 'current') => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB
      
      const validFiles = newFiles.filter(file => {
        if (file.size > MAX_SIZE) {
          alert(`File "${file.name}" is too large. Max size is 1MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setFormData(prev => {
        const currentFiles = type === 'inspiration' ? prev.inspirationImages : prev.currentSpaceImages;
        const combined = [...currentFiles, ...validFiles].slice(0, 10);
        return {
          ...prev,
          [type === 'inspiration' ? 'inspirationImages' : 'currentSpaceImages']: combined
        };
      });
    }
  };

  const removeFile = (index: number, type: 'inspiration' | 'current') => {
    setFormData(prev => ({
      ...prev,
      [type === 'inspiration' ? 'inspirationImages' : 'currentSpaceImages']: 
        (type === 'inspiration' ? prev.inspirationImages : prev.currentSpaceImages).filter((_, i) => i !== index)
    }));
  };

  const isStepValid = () => {
    if (formConfig && formConfig.steps && formConfig.steps[currentStep - 1]) {
      const step = formConfig.steps[currentStep - 1];
      return step.fields.every((field: any) => {
        if (!field.required) return true;
        const value = formData[field.id as keyof ProjectFormData];
        
        // Use custom validation for specific fields if they are in the config
        if (field.id === 'name') return validateName(String(value || ''));
        if (field.id === 'email') return value === '' || validateEmail(String(value || ''));
        if (field.id === 'phone') return validatePhone(String(value || ''));
        if (field.id === 'city') return String(value || '').trim().length >= 3;
        
        return value !== undefined && value !== '';
      });
    }

    switch (currentStep) {
      case 1:
        return (
          validateName(formData.name) &&
          (formData.email === '' || validateEmail(formData.email)) &&
          validatePhone(formData.phone) &&
          formData.city.trim().length >= 3
        );
      case 2:
        return formData.projectType !== '';
      case 3:
        // Match default config: only timeline is required
        return formData.timeline !== '';
      case 4:
        if (formData.projectType === 'apartement') {
          return (
            (formData.roomCount !== '' || formData.roomCountExact !== '') &&
            formData.designType !== '' &&
            formData.balconyAns !== ''
          );
        }
        if (formData.projectType === 'villa') {
          return (
            formData.floorsCount !== '' && 
            formData.architecturalStyle !== ''
          );
        }
        if (formData.projectType === 'shop') {
          return (
            formData.shopType !== '' && 
            formData.atmoshpere !== ''
          );
        }
        if (formData.projectType === 'restaurant') {
          return (
            formData.cuisineType !== '' && 
            formData.seatingCapacity !== ''
          );
        }
        if (formData.projectType === 'office') {
          return (
            formData.employeeCount !== '' && 
            formData.workEnvironment !== ''
          );
        }
        if (formData.projectType === 'beautySalon') {
          return (
            formData.salonServices !== '' && 
            formData.stationsCount !== '' &&
            formData.ambiance !== ''
          );
        }
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(localePath('/'));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      
      // Append all non-file fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'inspirationImages' && key !== 'currentSpaceImages') {
          const val = formData[key as keyof ProjectFormData];
          if (typeof val === 'object') {
            submitData.append(key, JSON.stringify(val));
          } else {
            submitData.append(key, String(val));
          }
        }
      });

      // Append files with [] for PHP array support
      formData.inspirationImages.forEach((file) => {
        submitData.append('inspirationImages[]', file);
      });
      formData.currentSpaceImages.forEach((file) => {
        submitData.append('currentSpaceImages[]', file);
      });

      const response = await fetch('/api/form/responses', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate(localePath('/')), 3000);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    // If we have a custom form configuration from the admin, we could use it here.
    // However, to keep the form "exactly the same" as requested, we'll use the hardcoded steps
    // while still being fullstack (saving to backend).
    
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFields={updateFields} />;
      case 2:
        return <Step2ProjectType formData={formData} updateFields={updateFields} />;
      case 3:
        return <Step3ProjectDetails formData={formData} updateFields={updateFields} />;
      case 4:
        return <Step4ProjectSpecifics formData={formData} updateFields={updateFields} updateSpecifics={updateSpecifics} />;
      case 5:
        return (
          <Step5Images 
            formData={formData} 
            updateFields={updateFields}
            inspirationInputRef={inspirationInputRef}
            currentSpaceInputRef={currentSpaceInputRef}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />
        );
      default:
        // Fallback to dynamic step if admin added more steps
        if (formConfig && formConfig.steps && formConfig.steps[currentStep - 1]) {
          return <DynamicStep step={formConfig.steps[currentStep - 1]} formData={formData} updateFields={updateFields} />;
        }
        return null;
    }
  };

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen max-w-5xl mx-auto relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 start-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-main-text/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-secondary/5 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <FormProgress currentStep={currentStep} totalSteps={formConfig?.steps?.length || 5} onStepClick={setCurrentStep} />

        <form className={`p-4 sm:p-6 md:p-12 rounded-2xl md:rounded-3xl ${GLASS_CLASSES} relative`} onSubmit={e => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 pt-6 md:pt-8 border-t border-main-text/10">
            <button
              type="button"
              onClick={handleBack}
              className={`px-5 py-3 md:px-8 md:py-4 rounded-full inline-flex items-center gap-2 md:gap-3 ${GLASS_CLASSES} hover:bg-white/10 text-white transition-all duration-300`}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span className="uppercase tracking-widest text-[11px] md:text-xs font-bold">{currentStep === 1 ? t('home') : t('previousPage')}</span>
            </button>

            <button
              type="button"
              disabled={!isStepValid() || isSubmitting}
              onClick={handleNext}
              className={`px-6 py-3 md:px-10 md:py-4 rounded-full inline-flex items-center gap-2 md:gap-3 transition-all duration-500 ${
                isStepValid() 
                  ? 'bg-main-text text-header hover:scale-105 shadow-lg shadow-main-text/20' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-header/30 border-t-header rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-[11px] md:text-xs font-bold">
                    {currentStep === 5 ? t('submit') : t('nextPage')}
                  </span>
                  {currentStep < 5 && <ArrowRight size={16} className="rtl:rotate-180" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
