import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { StepProps, BudgetTier, AreaTier, TimeLine } from './types';
import { convertArabicToWestern } from '../../utils/numbers';

export default function Step3ProjectDetails({ formData, updateFields }: StepProps) {
  const { t } = useLanguage();

  const budgetTiers = [
    { id: 'economy', tier: t('economy') },
    { id: 'standard', tier: t('standard') },
    { id: 'premium', tier: t('premium') },
    { id: 'luxury', tier: t('luxury') },
  ];
  const areaTiers = [
    { id: 'small', label: t('areaSmall') },
    { id: 'medium', label: t('areaMedium') },
    { id: 'large', label: t('areaLarge') },
    { id: 'veryLarge', label: t('areaVeryLarge') }
  ];
  const timelines = [
    { id: 'urgent', label: t('urgent') },
    { id: 'normal', label: t('normal') },
    { id: 'relaxed', label: t('relaxed') },
    { id: 'flexible', label: t('flexible') }
  ];

  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 md:space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-white text-sm md:text-lg uppercase tracking-widest mb-2">{t('stepThree')}</h2>
        <p className="text-2xl md:text-4xl text-main-text">{t('stepThreeDesc')}</p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Budget Section */}
        <div className="md:col-span-2">
          <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('budget') || 'Budget'}</label>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {budgetTiers.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => updateFields({ 
                  budgetTier: formData.budgetTier === type.id ? '' as BudgetTier : type.id as BudgetTier,
                  budgetExact: ''
                })}
                className={`p-4 rounded-xl border transition-all duration-300 text-center text-sm ${
                  formData.budgetTier === type.id 
                    ? 'bg-main-text border-main-text text-header' 
                    : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                }`}
              >
                <h3 className="font-medium text-base md:text-lg">{type.tier}</h3>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={formData.budgetExact}
            onChange={(e) => {
              const val = convertArabicToWestern(e.target.value).replace(/\D/g, '');
              const num = parseInt(val);
              if (val === '' || (!isNaN(num) && num <= 999999)) {
                updateFields({ 
                  budgetExact: val,
                  budgetTier: ''
                });
              }
            }}
            className="w-full bg-header/50 border border-main-text/20 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors mt-2"
            placeholder={t('exactBudgetPlaceholder') || 'Or enter exact budget...'}
          />
        </div>

        {/* Area Section */}
        <div className="md:col-span-2">
          <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('projectArea') || 'Project Area'}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {areaTiers.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => updateFields({ 
                  areaTier: formData.areaTier === type.id ? '' as AreaTier : type.id as AreaTier,
                  areaExact: ''
                })}
                className={`p-4 rounded-xl border transition-all duration-300 text-center text-sm ${
                  formData.areaTier === type.id 
                    ? 'bg-main-text border-main-text text-header' 
                    : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                }`}
              >
                <h3 className="font-medium text-md">{type.label}</h3>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={formData.areaExact}
            onChange={(e) => {
              const val = convertArabicToWestern(e.target.value).replace(/\D/g, '');
              const num = parseInt(val);
              if (val === '' || (!isNaN(num) && num <= 9999)) {
                updateFields({ areaExact: val, areaTier: '' });
              }
            }}
            className="w-full bg-header/50 border border-main-text/5 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors mt-2"
            placeholder={t('exactAreaPlaceholder') || 'Or enter exact area in sqm...'}

          />
        </div>

        {/* Timeline Section */}
        <div className="md:col-span-2">
          <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1">{t('timeline') || 'Timeline'}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timelines.map((time) => (
              <button
                key={time.id}
                type="button"
                onClick={() => updateFields({ timeline: formData.timeline === time.id ? '' as TimeLine : time.id as TimeLine })}
                className={`p-4 rounded-xl border transition-all duration-300 text-center text-xs md:text-sm flex items-center justify-center ${
                  formData.timeline === time.id 
                    ? 'bg-main-text border-main-text text-header' 
                    : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Details Section */}
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
}
