import { useState, useRef, ChangeEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES } from '../constants/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { FormData, ProjectType, BudgetTier, AreaTier, TimeLine, RoomCount, BalconyAns, ShopType, Atmoshpere, CuisineType, SeatingCapacity, SpaceWanted, EmployeeCount, WorkEnvironment, AmenitiesWanted, SalonServices, StationsCount, Ambiance, ArchitecturalStyle } from '../components/record-plan/types';
import FormProgress from '../components/record-plan/FormProgress';
import Step1BasicInfo from '../components/record-plan/Step1BasicInfo';
import Step2ProjectType from '../components/record-plan/Step2ProjectType';
import Step3ProjectDetails from '../components/record-plan/Step3ProjectDetails';
import Step4ProjectSpecifics from '../components/record-plan/Step4ProjectSpecifics';
import Step5Images from '../components/record-plan/Step5Props';
import SuccessMessage from '../components/record-plan/SuccessMessage';

const INITIAL_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  projectType: '',
  vision: '',
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
};

export default function RecordPlanPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inspirationInputRef = useRef<HTMLInputElement>(null);
  const currentSpaceInputRef = useRef<HTMLInputElement>(null);

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const updateSpecifics = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifics: { ...prev.specifics, [key]: value }
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'inspiration' | 'current') => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => {
        const currentFiles = type === 'inspiration' ? prev.inspirationImages : prev.currentSpaceImages;
        const combined = [...currentFiles, ...newFiles].slice(0, 5);
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s+()-]{7,}$/.test(phone);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name.trim().length >= 6 &&
          validateEmail(formData.email) &&
          validatePhone(formData.phone) &&
          formData.city.trim().length >= 3
        );
      case 2:
        return formData.projectType !== '';
      case 3:
        return formData.budgetTier !== '' &&
        formData.areaTier !== '' &&
        formData.timeline !== '';
      case 4:
        if (formData.projectType === 'apartement') {
          return (
            formData.roomCount !== '' &&
            formData.designType !== '' &&
            formData.balconyAns !== ''
          );
        }
        if (formData.projectType === 'villa') {
          return (
            formData.specifics.floors !== '' && 
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
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form Data Submitted:', formData);
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const renderStep = () => {
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
        return null;
    }
  };

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-5xl mx-auto relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 start-1/4 w-[500px] h-[500px] bg-main-text/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <FormProgress currentStep={currentStep} totalSteps={5} />

        <form className={`p-2 md:p-12 rounded-3xl ${GLASS_CLASSES} relative`} onSubmit={e => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-main-text/10">
            <button
              type="button"
              onClick={handleBack}
              className={`px-8 py-4 rounded-full inline-flex items-center space-x-3 rtl:space-x-reverse ${GLASS_CLASSES} hover:bg-white/10 text-white transition-all duration-300`}
            >
              <ArrowLeft size={18} className="rtl:rotate-180" />
              <span className="uppercase tracking-widest text-[10px] font-bold">{currentStep === 1 ? t('home') : t('previousPage')}</span>
            </button>

            <button
              type="button"
              disabled={!isStepValid() || isSubmitting}
              onClick={handleNext}
              className={`px-10 py-4 rounded-full inline-flex items-center space-x-3 rtl:space-x-reverse transition-all duration-500 ${
                isStepValid() 
                  ? 'bg-main-text text-header hover:scale-105 shadow-lg shadow-main-text/20' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-header/30 border-t-header rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-[10px] font-bold">
                    {currentStep === 5 ? t('submit') : t('nextPage')}
                  </span>
                  {currentStep < 5 && <ArrowRight size={18} className="rtl:rotate-180" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
