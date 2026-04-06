import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StepProps } from './types';

export default function Step1BasicInfo({ formData, updateFields }: StepProps) {
  const { t } = useLanguage();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name: string) => {
    return name.trim().split(/\s+/).length >= 2;
  };

  const validatePhone = (phone: string) => {
    // US Phone format: (123) 456-7890 or 123-456-7890 or 1234567890 or +1...
    const usPhoneRegex = /^(?:\+967\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/;
    return usPhoneRegex.test(phone);
  };

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
            className={`w-full bg-header/50 border ${formData.name.trim().length > 0 && !validateName(formData.name) ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`} 
            placeholder={t('namePlaceholder')} 
          />
          {validateName(formData.name) && (
            <div className="absolute end-4 top-10 text-main-text">
              <Check size={18} />
            </div>
          )}
          {formData.name.trim().length > 0 && !validateName(formData.name) && <span className="text-red-500 text-[10px] mt-1 px-1 uppercase">Please enter at least two words</span>}
        </div>
        <div className="relative">
          <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('email')} <span className="text-white/40 lowercase">({t('optional')})</span></label>
          <input 
            type="email" 
            value={formData.email}
            onChange={e => updateFields({ email: e.target.value })}
            className={`w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`}
            placeholder={t('emailPlaceholder')} 
          />
          {formData.email && validateEmail(formData.email) && (
            <div className="absolute end-4 top-10 text-main-text">
              <Check size={18} />
            </div>
          )}
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
          {formData.phone && !validatePhone(formData.phone) && <span className="text-red-500 text-[10px] mt-1 px-1 uppercase">{t('invalidPhone')}</span>}
        </div>
        <div className="relative">
          <label className="block text-white text-xs uppercase tracking-widest mb-2">{t('city')}</label>
          <input 
            type="text" 
            value={formData.city}
            onChange={e => updateFields({ city: e.target.value })}
            className={`w-full bg-header/50 border ${formData.city.trim().length > 0 && formData.city.trim().length < 3 ? 'border-red-500' : 'border-main-text/20'} rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors`} 
            placeholder={t('cityPlaceholder')} 
          />
          {formData.city.trim().length >= 3 && (
            <div className="absolute end-4 top-10 text-main-text">
              <Check size={18} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
