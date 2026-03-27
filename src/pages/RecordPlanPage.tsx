import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../constants/styles';

export default function RecordPlanPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto relative">
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-main-text/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-main-text mb-8">{t('recordPlan')}</h1>
        <p className="text-white text-lg mb-12 font-light">
          {t('shareVision')}
        </p>
        
        <form className={`p-8 md:p-12 rounded-3xl ${GLASS_CLASSES} flex flex-col space-y-6`}>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('projectName')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('projectPlaceholder')} />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('projectType')}</label>
            <select className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors appearance-none">
              <option>{t('residential')}</option>
              <option>{t('commercial')}</option>
              <option>{t('cultural')}</option>
              <option>{t('urbanDesign')}</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('projectDetails')}</label>
            <textarea rows={5} className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('visionPlaceholder')}></textarea>
          </div>
          <button type="button" className={`py-4 rounded-xl text-main-text font-medium tracking-widest uppercase ${GLASS_CLASSES} ${GLASS_HOVER} mt-4`}>
            {t('submitPlan')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
