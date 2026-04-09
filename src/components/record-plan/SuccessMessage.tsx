import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { GLASS_CLASSES } from '../../constants/styles';
import { useLanguage } from '@/src/context/LanguageContext';

export default function SuccessMessage() {
  const { t } = useLanguage();

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
        <h2 className="text-3xl text-main-text/80 mb-2">{t('planRecorded')}</h2>
        <div className="space-y-4">
          <p className="text-white" dir="rtl">{t('planRecordedDesc')}</p>
        </div>
      </motion.div>
    </div>
  );
}
