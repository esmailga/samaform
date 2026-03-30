import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../constants/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const getNavigation = (t: any) => [
  {id:'1', page: t('previousPage') },
  {id:'2', page: t('nextPage') },
];

export default function RecordPlanPage() {
  const { t } = useLanguage();
    return(
      <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto relative">
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-main-text/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-white md:text-3xl text-lg mb-4 font-light flex items-center justify-center">{t('basicInfo')}</h1>
        <p className="text-5xl md:text-5xl font-serif text-main-text mb-8 flex items-center justify-center">
          {t('basicInfoDesc')}
        </p>
        <form className={`p-8 md:p-12 rounded-3xl ${GLASS_CLASSES} flex flex-col space-y-6`}>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('name')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('namePlaceholder')} />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('email')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('emailPlaceholder')} />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('phone')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('phonePlaceholder')} />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('city')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('cityPlaceholder')} />
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-100 relative z-10">
          <Link to={`/`} className={`px-8 py-4 rounded-full inline-flex items-center space-x-4 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300`}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span className="uppercase tracking-widest text-xs font-medium">{t('previousPage')}</span>
          </Link>
          <Link to={`/`} className={`px-8 py-4 rounded-full inline-flex items-center space-x-4 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300`}
            >
              <span className="uppercase tracking-widest text-xs font-medium">{t('nextPage')}</span>
              <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>

          </div>
          <div>
          <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('projectType')}</label>
          <select className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors appearance-none">
            <option>{t('apartement')}</option>
            <option>{t('villa')}</option>
            <option>{t('shop')}</option>
            <option>{t('restaurant')}</option>
            <option>{t('office')}</option>
            <option>{t('beautySalon')}</option>
          </select>
        </div>
        <div>
          <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('projectDetails')}</label>
          <textarea rows={4} className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" placeholder={t('visionPlaceholder')}></textarea>
        </div>
        {/* Budget
        Project Area
        Timeline */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-100 relative z-10">

        </div>
        </form>
        </motion.div>
        </div>
 );
}
