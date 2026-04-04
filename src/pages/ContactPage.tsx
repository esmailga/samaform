import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../constants/styles';
import { MapPin, Navigation } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.3369778311962!2d44.23329386111324!3d15.284629640447596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603c53058b229d9%3A0x50c26523f2855d6d!2z2YXYrNmF2Lkg2KfZhNi02YTYp9mEINin2YTYqtis2KfYsdmK!5e0!3m2!1sen!2sus!4v1775172182898!5m2!1sen!2sus" , width="600" , height="450" , style="border:0;" , allowfullscreen="" , loading="eager";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=15.285954,44.236577";

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-7xl mx-auto relative">
      <div className="max-w-7xl mx-auto px-6 mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
      >
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl md:text-7xl  text-main-text mb-8">{t('contactUs')}</h1>
            <p className="text-white text-lg font-light max-w-md">
              {t('contactDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-12">
            <div>
              <h3 className="text-main-text text-sm uppercase tracking-widest mb-4 border-b border-main-text/20 pb-2 inline-block">{t('studio')}</h3>
              <p className="text-white font-light text-lg leading-relaxed">{t('studioAddress')}</p>
            </div>
            <div>
              <h3 className="text-main-text text-sm uppercase tracking-widest mb-4 border-b border-main-text/20 pb-2 inline-block">{t('inquiries')}</h3>
              <div className="text-white font-light text-lg space-y-2">
                <a 
                    href={`mailto:${t('studioEmail')}`}
                    dir="ltr" 
                    className="inline-block hover:text-main-text transition-colors w-fit"
                  >
                    {t('studioEmail')}
                  </a>

                <div className="pt-2 flex flex-col space-y-1 rtl:items-start">
                  <a 
                    href={`tel:${t('studioPhone1')}`} 
                    dir="ltr" 
                    className="inline-block hover:text-main-text transition-colors w-fit"
                  >
                    {t('studioPhone1')}
                  </a>
                  <a 
                    href={`tel:${t('studioPhone2')}`} 
                    dir="ltr" 
                    className="inline-block hover:text-main-text transition-colors w-fit"
                  >
                    {t('studioPhone2')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-10 py-4 rounded-full inline-flex items-center space-x-3 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300 group`}
            >
              <Navigation size={16} className="rtl:rotate-270 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest text-sm font-bold">{t('getDirections')}</span>
            </a>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-main-text/10 flex items-center justify-center">
              <MapPin className="text-main-text" size={20} />
            </div>
            <h2 className="text-2xl  text-white">{t('mapTitle')}</h2>
          </div>
          
          <div className={`w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-main-text/10 shadow-2xl ${GLASS_CLASSES} group`}>
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapIframeTitle')}
              className="group-hover:filter-none transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </motion.div>
    </div>
  );
}