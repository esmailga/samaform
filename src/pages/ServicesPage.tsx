import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';


const assetImages: any = (import.meta as any).glob('../../assets/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});

export const getServicesList = (t: any) => [
  { id: 'service1', title: t('interiorDesign'), description: t('intDesc'), image: assetImages['../../assets/service1.jpg'] },
  { id: 'service2', title: t('architecturalDesign'), description: t('arcDesc'), image: assetImages['../../assets/service2.jpg'] },
  { id: 'service3', title: t('landscapeDesign'), description: t('lanDesc'), image: assetImages['../../assets/service3.jpg'] },
  { id: 'service4', title: t('commercialDesign'), description: t('comDesDesc'), image: assetImages['../../assets/service4.jpg'] },
  { id: 'service5', title: t('objectsDesign'), description: t('objDesc'), image: assetImages['../../assets/service5.jpg'] },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  const services = getServicesList(t);

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
        </motion.div>
        <div className="flex flex-col space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-20"
            >
              {/* Image Left */}
              <div className="w-full md:w-7/12 h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative group border border-main-text/10 shadow-2xl">
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
                <h3 className="text-3xl md:text-4xl font-serif text-main-text mb-6">{service.title}</h3>
                <p className="text-white/80 font-light text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
    </div>
  );
}
