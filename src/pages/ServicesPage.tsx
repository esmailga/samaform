import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

import service1Img from '../assets/service1.avif';
import service2Img from '../assets/service2.avif';
import service3Img from '../assets/service3.avif';
import service4Img from '../assets/service4.avif';
import service5Img from '../assets/service5.avif';

export const getServicesList = (t: any) => [
  { id: 'interior-design', title: t('interiorDesign'), description: t('intDesc'), image: service1Img },
  { id: 'architectural-design', title: t('architecturalDesign'), description: t('arcDesc'), image: service2Img },
  { id: 'landscape-design', title: t('landscapeDesign'), description: t('lanDesc'), image: service3Img },
  { id: 'commercial-design', title: t('commercialDesign'), description: t('comDesDesc'), image: service4Img },
  { id: 'objects-design', title: t('objectsDesign'), description: t('objDesc'), image: service5Img },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const services = getServicesList(t);

  // 2. FIX THE SCROLLING: Listen to React Router's location.hash and force the scroll.
  useEffect(() => {
    if (location.hash) {
      // Remove the '#' to get just the ID string
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // A slight timeout ensures the page layout is calculated before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // If no hash, make sure we start at the top of the page
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen max-w-7xl mx-auto relative">
      <div className="max-w-7xl mx-auto px-6 mb-6 md:mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-7xl text-main-text mb-4 md:mb-8">{t('ourServices')}</h1>
        <p className="text-white text-base md:text-lg max-w-2xl mb-10 md:mb-16 font-light">
          {t('servicesPageDesc')}
        </p>
      </motion.div>
      
      <div className="flex flex-col space-y-14 md:space-y-20">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            id={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-20 scroll-mt-24 md:scroll-mt-90"
          >
            {/* Image Left */}
            <div className="w-full md:w-7/12 h-[260px] sm:h-[380px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden relative group border border-main-text/10 shadow-2xl">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-header/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text Right */}
            <div className="w-full md:w-5/12 flex flex-col justify-center items-start">
              <h3 className="text-2xl md:text-4xl text-main-text mb-3 md:mb-6">{service.title}</h3>
              <p className="text-white/80 font-light text-sm md:text-lg md:mb-8 leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}