import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../constants/styles';
import { ArrowLeft, ArrowRight, Check, Upload, Home, Building, ShoppingBag, Utensils, Briefcase, Sparkles, X, Image as ImageIcon, Divide } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type ProjectType = 'apartement' | 'villa' | 'shop' | 'restaurant' | 'office' | 'beautySalon';
type BudgetTier = 'economy' | 'standard' | 'premium' | 'luxury';
type AreaTier = 'small' | 'medium' | 'large' | 'veryLarge';
type TimeLine = 'urgent' | 'normal' | 'relaxed' | 'flexible';
type DesignType = 'modern' | 'arabic' | 'classic' | 'contemporary';
type PriorityType = 'smartHome' | 'ecoFriendly' | 'storageSolution' | 'naturalLight';
type OutdoorType = 'landscaping' | 'poolArea' | 'terrace' | 'parking';
type ArchitecturalStyle = 'modeCont' | 'mediterranean' | 'islamic' | 'palatial';
type BalconyAns = 'Yes' | 'No';
type RoomCount = '1 - 2' | '3 - 4' | '5+';
type ShopType = 'fashion' | 'electronics' | 'grocery' | 'otherShop';
type FeaturesType = 'displayWindows' | 'storageRoom' | 'fittingRoom' | 'cashierCounter';
type Atmoshpere = 'premiumL' | 'trendy' | 'welcoming' | 'minimal';


interface FormData {
  // Section 1: Basic Info
  name: string;
  email: string;
  phone: string;
  city: string;
  // Section 2: Project Type
  projectType: ProjectType | '';
  // Section 3: Project Details
  vision: string;
  budget: string;
  timeline: TimeLine | '';
  designType: DesignType | '';
  priorityType: PriorityType | '';
  outdoorType: OutdoorType | '';
  architecturalStyle: ArchitecturalStyle | '';
  budgetTier: BudgetTier | '';
  budgetExact: '';
  areaTier: AreaTier | '';
  areaExact: '';
  balconyAns: BalconyAns | '';
  roomCount: RoomCount | '';
  projectDetails: '';
  apartmentDetails: '';
  villaDetails: '';
  shopType: ShopType | '';
  atmoshpere: Atmoshpere | '';
  shopDetails: '';
  spaceDetails: '';
  officeDetails: '';
  salonDetails: '';
  featuresType: FeaturesType | '';
  // Section 4: Project Specifics
  specifics: Record<string, string>;
  // Section 5: Images
  inspirationImages: File[];
  currentSpaceImages: File[];
}

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
  shopType: '',
  featuresType: '',
};

export default function RecordPlanPage() {
  const { t, lang } = useLanguage();
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
        return formData.budgetTier !== '' && formData.areaTier !== '' && formData.timeline !== '';
      case 4:
        if (formData.projectType === 'apartement') {
          return (
            formData.roomCount !== '' && formData.designType !== '' && formData.balconyAns !== ''
          );
        }
        if (formData.projectType === 'villa') {
          return (
            formData.specifics.floors !== '' && 
            formData.outdoorType !== ''
          );
        }
        if (formData.projectType === 'shop') {
          return (
            formData.shopType !== '' && 
            formData.atmosphere !== ''
          );
        }
        if (formData.projectType === 'restaurant') {
          return !!formData.specifics.capacity && !!formData.specifics.cuisine;
        }
        if (formData.projectType === 'office') {
          return !!formData.specifics.employees && !!formData.specifics.meetingRooms;
        }
        if (formData.projectType === 'beautySalon') {
          return !!formData.specifics.services && !!formData.specifics.stations;
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

  const projectTypes = [
    { id: 'apartement', icon: Home, title: t('apartement'), subtitle: t('apartmentSubtitle') },
    { id: 'villa', icon: Building, title: t('villa'), subtitle: t('villaSubtitle') },
    { id: 'shop', icon: ShoppingBag, title: t('shop'), subtitle: t('shopSubtitle') },
    { id: 'restaurant', icon: Utensils, title: t('restaurant'), subtitle: t('restaurantSubtitle') },
    { id: 'office', icon: Briefcase, title: t('office'), subtitle: t('officeSubtitle') },
    { id: 'beautySalon', icon: Sparkles, title: t('beautySalon'), subtitle: t('beautySalonSubtitle') },
  ];

  const budgetTier = [
    { id: 'economy', tier: t('economy') },
    { id: 'standard', tier: t('standard') },
    { id: 'premium', tier: t('premium') },
    { id: 'luxury', tier: t('luxury') },
  ];
  const areaTier = [
    { id: 'small', label: t('areaSmall') },
    { id: 'medium', label: t('areaMedium') },
    { id: 'large', label: t('areaLarge') },
    { id: 'veryLarge', label: t('areaVeryLarge') }
  ];
  const timeline = [
    { id: 'urgent', label: t('urgent') },
    { id: 'normal', label: t('normal') },
    { id: 'relaxed', label: t('relaxed') },
    { id: 'flexible', label: t('flexible') }
  ]

  const designType = [
    { id: 'modern', label: t('modern') },
    { id: 'arabic', label: t('arabic') },
    { id: 'classic', label: t('classic') },
    { id: 'contemporary', label: t('contemporary') }
  ]

  const priorityType = [
    { id: 'smartHome', label: t('smartHome') },
    { id: 'ecoFriendly', label: t('ecoFriendly') },
    { id: 'storageSolution', label: t('storageSolution') },
    { id: 'naturalLight', label: t('naturalLight') }
  ]

  const outdoorType = [
    { id: 'landscaping', label: t('landscaping') },
    { id: 'poolArea', label: t('poolArea') },
    { id: 'terrace', label: t('terrace') },
    { id: 'parking', label: t('parking') }
  ]

  const architecturalStyle = [
    { id: 'modeCont', label: t('modeCont') },
    { id: 'mediterranean', label: t('mediterranean') },
    { id: 'islamic', label: t('islamic') },
    { id: 'palatial', label: t('palatial') }
  ]
  
  const balconyAns = [
    { id: 'yes', label: t('yes') },
    { id: 'no', label: t('no') }
  ]

  const roomCount = [
    { id: '1', label: t('roomc') },
    { id: '2', label: t('roomcc') },
    { id: '3', label: t('roomccc') }

  ]

  const shopType = [
    { id: 'fashion', label: t('fashion') },
    { id: 'electronics', label: t('electronics') },
    { id: 'grocery', label: t('grocery') },
    { id: 'otherShop', label: t('otherShop') }
  ]

  const featuresType = [
    { id: 'displayWindows', label: t('displayWindows') },
    { id: 'storageRoom', label: t('storageRoom') },
    { id: 'fittingRoom', label: t('fittingRoom') },
    { id: 'cashierCounter', label: t('cashierCounter') }
  ]

  const atmoshpere = [
    { id: 'premiumL', label: t('premiumL') },
    { id: 'trendy', label: t('trendy') },
    { id: 'welcoming', label: t('welcoming') },
    { id: 'minimal', label: t('minimal') }
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-white text-sm uppercase tracking-widest mb-2">{t('stepOne')}</h2>
              <p className="text-4xl font-serif text-main-text">{t('stepOneDesc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('name')}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => updateFields({ name: e.target.value })}
                  className={`w-full bg-header/50 border ${formData.name.trim().length > 0 && formData.name.trim().length < 6 ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`} 
                  placeholder={t('namePlaceholder')} 
                />
                {formData.name.trim().length >= 6 && (
                  <div className="absolute end-4 top-10 text-main-text">
                    <Check size={18} />
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('email')}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => updateFields({ email: e.target.value })}
                  className={`w-full bg-header/50 border ${formData.email && !validateEmail(formData.email) ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`}
                  placeholder={t('emailPlaceholder')} 
                />
                {validateEmail(formData.email) && (
                  <div className="absolute end-4 top-10 text-main-text">
                    <Check size={18} />
                  </div>
                )}
                {formData.email && !validateEmail(formData.email) && <span className="text-red-500 text-[10px] mt-1 px-1 uppercase tracking-tighter">{t('invalidEmail')}</span>}
              </div>
              <div className="relative">
                <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('phone')}</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => updateFields({ phone: e.target.value })}
                  className={`w-full bg-header/50 border ${formData.phone && !validatePhone(formData.phone) ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`}
                  placeholder={t('phonePlaceholder')} 
                />
                {validatePhone(formData.phone) && (
                  <div className="absolute end-4 top-10 text-main-text">
                    <Check size={18} />
                  </div>
                )}
                {formData.phone && !validatePhone(formData.phone) && <span className="text-red-500 text-[10px] mt-1 px-1 uppercase tracking-tighter">{t('invalidPhone')}</span>}
              </div>
              <div className="relative">
                <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('city')}</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => updateFields({ city: e.target.value })}
                  className={`w-full bg-header/50 border ${formData.city.trim().length > 0 && formData.city.trim().length < 2 ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`} 
                  placeholder={t('cityPlaceholder')} 
                />
                {formData.city.trim().length >= 2 && (
                  <div className="absolute end-4 top-10 text-main-text">
                    <Check size={18} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-white text-sm uppercase tracking-widest mb-2">{t('stepTwo')}</h2>
              <p className="text-4xl font-serif text-main-text mb-12">{t('stepTwoDesc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updateFields({ projectType: type.id as ProjectType })}
                  className={`p-6 rounded-2xl border transition-all duration-300 text-start flex flex-col items-start space-y-4 ${
                    formData.projectType === type.id 
                      ? 'bg-main-text border-main-text text-header' 
                      : `bg-header/30 border-main-text/10 text-white ${GLASS_HOVER}`
                  }`}
                >
                  <type.icon size={32} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-lg">{type.title}</h3>
                    <p className={`text-xs opacity-70 ${formData.projectType === type.id ? 'text-header' : 'text-white'}`}>{type.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
        case 3:
          return (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-white text-lg uppercase tracking-widest mb-2">{t('stepThree')}</h2>
                <p className="text-4xl font-serif text-main-text">{t('stepThreeDesc')}</p>
              </div>
  
              <div className="space-y-8">
                
                {/* 1. Budget Section */}
                <div className="md:col-span-2">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('budget') || 'Budget'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {budgetTier.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateFields({ budgetTier: type.id as BudgetTier })}
                        className={`p-4 rounded-xl border transition-all duration-300 text-center text-sm ${
                          formData.budgetTier === type.id 
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                        }`}
                      >
                        <div>
                        <h3 className="font-medium text-lg">{type.tier}</h3>
                        </div>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={t('exactBudgetPlaceholder') || 'Or enter exact budget...'}
                    value={formData.budgetExact || ''}
                    onChange={(e) => updateFields({ budgetExact: e.target.value })}
                    className="w-full bg-header/50 border border-main-text/5 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors mt-2"
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('projectArea') || 'Project Area'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {areaTier.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateFields({ areaTier: type.id as AreaTier })}
                        className={`p-4 rounded-xl border transition-all duration-300 text-center text-sm ${
                          formData.areaTier === type.id 
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                        }`}
                      >
                        <div>
                        <h3 className="font-medium text-md">{type.label}</h3>
                        </div>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={t('exactAreaPlaceholder') || 'Or enter exact area in sqm...'}
                    value={formData.areaExact || ''}
                    onChange={(e) => updateFields({ areaExact: e.target.value })}
                    className="w-full bg-header/50 border border-main-text/5 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors mt-2"
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('timeline') || 'Timeline'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeline.map((time) => (
                      <button
                        key={time.id}
                        type="button"
                        onClick={() => updateFields({ timeline: time.id  as TimeLine})}
                        className={`p-4 rounded-xl border transition-all duration-300 text-center text-xs md:text-sm flex items-center justify-center ${
                          formData.timeline === time.id 
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                        }`}
                      >
                        {t(time.id) || time.label}
                      </button>
                    ))}
                  </div>
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-white text-md tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                    {t('projectDetails') || 'Project Details'} 
                    <span className="text-white/50 text-xs font-normal">({t('optional') || 'Optional'})</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('projectDetailsPlaceholder') || 'Tell us more about your vision, specific requirements, or any constraints...'}
                    value={formData.projectDetails || ''}
                    onChange={(e) => updateFields({ projectDetails: e.target.value })}
                    className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
                  />
                </div>
  
              </div>
            </motion.div>
          );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-white text-lg uppercase tracking-widest mb-2">{t('stepFour')}</h2>
              <p className="text-4xl font-serif text-main-text">
                {t('stepFourDesc', { type: t(formData.projectType as any) })}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {formData.projectType === 'apartement' && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('roomsCount')}</label>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      {roomCount.map((num) => (
                        <button
                          key={num.id}
                          type="button"
                          onClick={() => updateFields({roomCount: num.id as RoomCount})}
                          className={`flex-1 py-3 rounded-xl border transition-all ${
                            formData.roomCount === num.id 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                          }`}
                        >
                        <h3 className="font-medium text-md">{num.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('interiorDesign')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {designType.map((design) => (
                        <button
                          key={design.id}
                          type="button"
                          onClick={() => updateFields({designType: design.id as DesignType})}
                          className={`p-4 text-lg text-center rounded-xl border transition-all ${
                            formData.designType === design.id 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                          }`}
                        >
                        <h3 className="font-medium text-md">{design.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                  <div>
                    <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('priorities')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {priorityType.map((priority) => (
                        <button
                        key={priority.id}
                        type="button"
                        onClick={() => {
                          // 1. Get the current array of selected priorities (fallback to empty array if undefined)
                          const currentPriorities = formData.priorityType || [];
                          
                          // 2. Check if the clicked priority is already in the array
                          const isSelected = currentPriorities.includes(priority.id);
                          
                          // 3. If selected, filter it out. If not, add it to the array.
                          const newPriorities = isSelected
                            ? currentPriorities.filter((id) => id !== priority.id) 
                            : [...currentPriorities, priority.id];
                            
                          // 4. Update the form data
                          updateFields({ priorityType: newPriorities });
                        }}
                        className={`p-4 text-lg text-center rounded-xl border transition-all ${
                          // Update the condition to check if the array includes this ID
                          (formData.priorityType || []).includes(priority.id)
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                        }`}
                      >
                        <h3 className="font-medium text-md">{priority.label}</h3>
                      </button>
                      ))}
                    </div>
                  </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('balcony')}</label>
                    <div className="flex gap-4">
                      {balconyAns.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateFields({balconyAns: opt.id as BalconyAns})}
                          className={`flex-1 py-3 rounded-xl border transition-all ${
                            formData.balconyAns === opt.id
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                          }`}
                        >
                        <h3 className="font-medium text-md">{opt.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                    {t('apartmentDetails') || 'Apartment Details'} 
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('apartmentDetailsPlaceholder') || 'Tell us more about your dream apartment...'}
                    value={formData.apartmentDetails || ''}
                    onChange={(e) => updateFields({ apartmentDetails: e.target.value })}
                    className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
                  />
                  </div>
                </>
              )}
              {formData.projectType === 'villa' && (
                <>
                <div className="md:col-span-2">
                  <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('floorsCount')}</label>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    {['1', '2', '3+'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateSpecifics('floors', num)}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          formData.specifics.floors === num 
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('outdoorArea')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {outdoorType.map((outdoor) => (
                        <button
                        key={outdoor.id}
                        type="button"
                        onClick={() => {
                          // 1. Get the current array of selected priorities (fallback to empty array if undefined)
                          const currentOutdoor = formData.outdoorType || [];
                          
                          // 2. Check if the clicked priority is already in the array
                          const isSelected = currentOutdoor.includes(outdoor.id);
                          
                          // 3. If selected, filter it out. If not, add it to the array.
                          const newOutdoor = isSelected
                            ? currentOutdoor.filter((id) => id !== outdoor.id) 
                            : [...currentOutdoor, outdoor.id];
                            
                          // 4. Update the form data
                          updateFields({ outdoorType: newOutdoor });
                        }}
                        className={`p-4 text-lg text-center rounded-xl border transition-all ${
                          // Update the condition to check if the array includes this ID
                          (formData.outdoorType || []).includes(outdoor.id)
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                        }`}
                      >
                        <h3 className="font-medium text-md">{outdoor.label}</h3>
                      </button>
                      ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('architectural')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    {architecturalStyle.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => updateFields({architecturalStyle: style.id as ArchitecturalStyle})}
                        className={`p-4 text-lg text-center rounded-xl border transition-all ${
                          formData.architecturalStyle === style.id 
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                        }`}
                      >
                      <h3 className="font-medium text-md">{style.label}</h3>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                    {t('villaDetails') || 'House Details'} 
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('villaDetailsPlaceholder') || 'Tell us more about your dream home...'}
                    value={formData.villaDetails || ''}
                    onChange={(e) => updateFields({ villaDetails: e.target.value })}
                    className="w-full bg-header/30 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
                  />
                  </div>               
              </>
              )}
              {formData.projectType === 'shop' && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('businessType')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {shopType.map((shop) => (
                        <button
                          key={shop.id}
                          type="button"
                          onClick={() => updateFields({shopType: shop.id as ShopType})}
                          className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                            formData.shopType === shop.id 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                          }`}
                        >
                        <h3 className="font-medium text-md">{shop.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                  <div>
                    <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('features')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {featuresType.map((features) => (
                        <button
                        key={features.id}
                        type="button"
                        onClick={() => {
                          // 1. Get the current array of selected priorities (fallback to empty array if undefined)
                          const currentFeatures = formData.featuresType || [];
                          
                          // 2. Check if the clicked priority is already in the array
                          const isSelected = currentFeatures.includes(features.id);
                          
                          // 3. If selected, filter it out. If not, add it to the array.
                          const newFeatures = isSelected
                            ? currentFeatures.filter((id) => id !== features.id) 
                            : [...currentFeatures, features.id];
                            
                          // 4. Update the form data
                          updateFields({ featuresType: newFeatures });
                        }}
                        className={`p-4 text-lg text-center rounded-xl border transition-all ${
                          // Update the condition to check if the array includes this ID
                          (formData.featuresType || []).includes(features.id)
                            ? 'bg-main-text border-main-text text-header' 
                            : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                        }`}
                      >
                        <h3 className="font-medium text-md">{features.label}</h3>
                      </button>
                      ))}
                    </div>
                  </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('atmoshpere')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {atmoshpere.map((atom) => (
                        <button
                          key={atom.id}
                          type="button"
                          onClick={() => updateFields({atmoshpere: atom.id as Atmoshpere})}
                          className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                            formData.atmoshpere === atom.id 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                          }`}
                        >
                        <h3 className="font-medium text-md">{atom.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                  <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                    {t('shopDetails') || 'Shop Details'} 
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('shopDetailsPlaceholder') || 'Tell us more about your dream shop...'}
                    value={formData.shopDetails || ''}
                    onChange={(e) => updateFields({ shopDetails: e.target.value })}
                    className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
                  />
                  </div>
                </>
              )}
              {formData.projectType === 'restaurant' && (
                <>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('seatingCapacity')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.capacity || ''}
                      onChange={e => updateSpecifics('capacity', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('cuisineType')}</label>
                    <input 
                      type="text" 
                      value={formData.specifics.cuisine || ''}
                      onChange={e => updateSpecifics('cuisine', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                      placeholder="e.g. Italian, Japanese"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('kitchenSize')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.kitchenSize || ''}
                      onChange={e => updateSpecifics('kitchenSize', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('outdoorSeating')}</label>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateSpecifics('outdoor', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${
                            formData.specifics.outdoor === opt 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                          }`}
                        >
                          {t(opt as any)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {formData.projectType === 'office' && (
                <>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('employeeCount')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.employees || ''}
                      onChange={e => updateSpecifics('employees', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('meetingRooms')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.meetingRooms || ''}
                      onChange={e => updateSpecifics('meetingRooms', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('privateOffices')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.privateOffices || ''}
                      onChange={e => updateSpecifics('privateOffices', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('pantry')}</label>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateSpecifics('pantry', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${
                            formData.specifics.pantry === opt 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                          }`}
                        >
                          {t(opt as any)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {formData.projectType === 'beautySalon' && (
                <>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('serviceTypes')}</label>
                    <input 
                      type="text" 
                      value={formData.specifics.services || ''}
                      onChange={e => updateSpecifics('services', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                      placeholder="e.g. Hair, Nails, Spa"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('stationsCount')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.stations || ''}
                      onChange={e => updateSpecifics('stations', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('waitingArea')}</label>
                    <input 
                      type="number" 
                      value={formData.specifics.waitingArea || ''}
                      onChange={e => updateSpecifics('waitingArea', e.target.value)}
                      className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('vipRoom')}</label>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateSpecifics('vipRoom', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${
                            formData.specifics.vipRoom === opt 
                              ? 'bg-main-text border-main-text text-header' 
                              : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                          }`}
                        >
                          {t(opt as any)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-white text-sm uppercase tracking-widest mb-2">{t('stepFive')}</h2>
              <p className="text-4xl font-serif text-main-text">{t('stepFiveDesc')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inspiration Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-white text-xs uppercase tracking-widest">{t('inspirationImages')} <span className="text-white/40 lowercase">{t('optional')}</span></label>
                  <span className="text-[10px] text-white/40">{formData.inspirationImages.length}/5</span>
                </div>
                <div 
                  onClick={() => inspirationInputRef.current?.click()}
                  className={`border-2 border-dashed border-main-text/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-main-text/40 bg-header/20`}
                >
                  <Upload className="text-main-text mb-2" size={32} />
                  <span className="text-white/60 text-sm">{t('uploadLimit')}</span>
                  <input 
                    ref={inspirationInputRef}
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'inspiration')}
                    className="hidden" 
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {formData.inspirationImages.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-header/50 group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeFile(i, 'inspiration')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Space Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-white text-xs uppercase tracking-widest">{t('currentSpaceImages')} <span className="text-white/40 lowercase">{t('optional')}</span></label>
                  <span className="text-[10px] text-white/40">{formData.currentSpaceImages.length}/5</span>
                </div>
                <div 
                  onClick={() => currentSpaceInputRef.current?.click()}
                  className={`border-2 border-dashed border-main-text/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-main-text/40 bg-header/20`}
                >
                  <ImageIcon className="text-main-text mb-2" size={32} />
                  <span className="text-white/60 text-sm">{t('uploadLimit')}</span>
                  <input 
                    ref={currentSpaceInputRef}
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'current')}
                    className="hidden" 
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {formData.currentSpaceImages.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-header/50 group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeFile(i, 'current')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-32 px-6 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-12 rounded-3xl ${GLASS_CLASSES} text-center max-w-md`}
        >
          <div className="w-20 h-20 bg-main-text rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-header" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">Plan Recorded!</h2>
          <p className="text-white/60">Thank you for sharing your vision. Our team will review your plan and get back to you shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-5xl mx-auto relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 start-1/4 w-[500px] h-[500px] bg-main-text/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
                  step <= currentStep ? 'bg-main-text text-header' : 'bg-header/50 text-white/40 border border-white/10'
                }`}
              >
                {step < currentStep ? <Check size={14} /> : step}
              </div>
            ))}
          </div>
          <div className="h-1 bg-header/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-main-text"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <form className={`p-8 md:p-12 rounded-3xl ${GLASS_CLASSES} relative`} onSubmit={e => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-main-text/10">
            <button
              type="button"
              onClick={handleBack}
              className={`px-8 py-4 rounded-full inline-flex items-center space-x-3 rtl:space-x-reverse ${GLASS_CLASSES} ${GLASS_HOVER} text-white transition-all duration-300`}
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

