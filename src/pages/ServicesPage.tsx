import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES } from '../constants/styles';

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-7xl mx-auto relative">
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-main-text/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-main-text mb-8">{t('ourServices')}</h1>
        <p className="text-white text-lg max-w-2xl mb-16 font-light">
          {t('servicesPageDesc')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            t('interiorDesign'), 
            t('architecturalDesign'), 
            t('landscapeDesign'),
            t('commercialDesign'),
            t('objectsDesign')
          ].map((service, i) => (
            <div key={i} className={`p-8 rounded-3xl ${GLASS_CLASSES}`}>
              <h3 className="text-2xl font-serif text-main-text mb-4">{service}</h3>
              <p className="text-white font-light">
                {t('serviceDescTemplate', { service: service.toLowerCase() })}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
