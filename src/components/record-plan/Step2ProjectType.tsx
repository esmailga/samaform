import { motion } from 'motion/react';
import { Home, Building, ShoppingBag, Utensils, Briefcase, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_HOVER } from '../../constants/styles';
import { StepProps, ProjectType } from './types';

export default function Step2ProjectType({ formData, updateFields }: StepProps) {
  const { t } = useLanguage();

  const projectTypes = [
    { id: 'apartement', icon: Home, title: t('apartement'), subtitle: t('apartmentSubtitle') },
    { id: 'villa', icon: Building, title: t('villa'), subtitle: t('villaSubtitle') },
    { id: 'shop', icon: ShoppingBag, title: t('shop'), subtitle: t('shopSubtitle') },
    { id: 'restaurant', icon: Utensils, title: t('restaurant'), subtitle: t('restaurantSubtitle') },
    { id: 'office', icon: Briefcase, title: t('office'), subtitle: t('officeSubtitle') },
    { id: 'beautySalon', icon: Sparkles, title: t('beautySalon'), subtitle: t('beautySalonSubtitle') },
  ];

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
        <p className="text-2xl md:text-4xl text-main-text mb-6 md:mb-12">{t('stepTwoDesc')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => updateFields({ projectType: formData.projectType === type.id ? '' as ProjectType : type.id as ProjectType })}
            className={`p-6 rounded-2xl border transition-all duration-300 text-start flex flex-col items-start space-y-4 ${
              formData.projectType === type.id 
                ? 'bg-main-text border-main-text text-header' 
                : `bg-header/30 border-main-text/10 text-white ${GLASS_HOVER}`
            }`}
          >
            <type.icon size={32} strokeWidth={1.5} />
            <div>
              <h3 className="font-medium text-base md:text-lg">{type.title}</h3>
              <p className={`text-xs opacity-70 ${formData.projectType === type.id ? 'text-header' : 'text-white'}`}>{type.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
