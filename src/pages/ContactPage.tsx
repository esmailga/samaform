import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../constants/styles';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-7xl mx-auto relative">
      <div className="max-w-7xl mx-auto px-6 mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16"
      >
        <div>
          <h1 className="text-5xl md:text-7xl font-serif text-main-text mb-8">{t('contactUs')}</h1>
          <p className="text-white text-lg mb-12 font-light">
            {t('contactDesc')}
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-white text-sm uppercase tracking-widest mb-2">{t('studio')}</h3>
              <p className="text-white font-light">6th floor, Alshalal Tower<br/>Al Asbahi St, Sana'a</p>
            </div>
            <div>
              <h3 className="text-white text-sm uppercase tracking-widest mb-2">{t('inquiries')}</h3>
              <p className="text-white font-light">info@samaform.com<br/>+967 78 411411 1<br/>+967 78 411411 2</p>
            </div>
          </div>
        </div>
        
        <form className={`p-8 md:p-12 rounded-3xl ${GLASS_CLASSES} flex flex-col space-y-6`}>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('name')}</label>
            <input type="text" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('email')}</label>
            <input type="email" className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors" />
          </div>
          <div>
            <label className="block text-white text-sm uppercase tracking-widest mb-2">{t('message')}</label>
            <textarea rows={4} className="w-full bg-header/50 border border-main-text/20 rounded-xl p-4 text-white focus:outline-none focus:border-main-text transition-colors"></textarea>
          </div>
          <button type="button" className={`py-4 rounded-xl text-main-text font-medium tracking-widest uppercase ${GLASS_CLASSES} ${GLASS_HOVER} mt-4`}>
            {t('sendMessage')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
