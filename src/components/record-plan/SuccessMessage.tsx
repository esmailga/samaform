import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { GLASS_CLASSES } from '../../constants/styles';
import { useLanguage } from '@/src/context/LanguageContext';

export default function SuccessMessage() {
  const { t } = useLanguage();

  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-6 md:p-12 rounded-2xl md:rounded-3xl ${GLASS_CLASSES} text-center max-w-md`}
      >
        <div className="w-20 h-20 bg-main-text rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-header" />
        </div>
        <h2 className="text-2xl md:text-3xl text-main-text/80 mb-2">{t('planRecorded')}</h2>
        <div className="space-y-4">
          <p className="text-sm md:text-base text-white">{t('planRecordedDesc')}</p>
        </div>
      </motion.div>
    </div>
  );
}
