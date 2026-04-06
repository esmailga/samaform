import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { GLASS_CLASSES, GLASS_HOVER } from "../../constants/styles";

const assetImages: any = (import.meta as any).glob('../../assets/*.{png,jpg,jpeg,svg,avif}', { 
  eager: true, 
  import: 'default' 
});

export const getServicesList = (t: any) => [
  { id: 'service1', title: t('interiorDesign'), description: t('intDesc'), image: assetImages['../../assets/service1.avif'] },
  { id: 'service2', title: t('architecturalDesign'), description: t('arcDesc'), image: assetImages['../../assets/service2.avif'] },
  { id: 'service3', title: t('landscapeDesign'), description: t('lanDesc'), image: assetImages['../../assets/service3.avif'] },
  { id: 'service4', title: t('commercialDesign'), description: t('comDesDesc'), image: assetImages['../../assets/service4.avif'] },
  { id: 'service5', title: t('objectsDesign'), description: t('objDesc'), image: assetImages['../../assets/service5.avif'] },
];

export default function ServicesSection() {
  const { t } = useLanguage();
  const servicesList = getServicesList(t);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="py-8 px-6 relative">
      <div className="max-w-7xl mx-auto px-6 mb-12" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-16 text-center md:text-center">
          <h2 className="py-8 text-4xl md:py-12 text-6xl font-bold mb-4 text-main-text">
            {t('services')}
          </h2>
        </div>

        {/* STACK CONTAINER */}
        <div ref={containerRef} className="relative h-[500vh] md:h-[320vh]">

          {servicesList.map((service, index) => {
            const start = index / servicesList.length;
            const end = (index + 1) / servicesList.length;

            // Scale down previous cards
            const scale = useTransform(scrollYProgress, [start, end], [1, 0.88]);

            // Slight upward shift
            const y = useTransform(scrollYProgress, [start, end], [0, -40]);

            // Fade older cards slightly
            const opacity = 1;

            return (
              <motion.div
                key={service.id}
                style={{ scale, y, opacity}}
                className="sticky top-32 mb-10 will-change-transform"
              >
                <div className="bg-primary/90 rounded-3xl p-4 flex flex-col items-center md:flex-row items-center gap-6 md:gap-6 shadow-lg border-2 border-main-text">

                  {/* Image */}
                  <div className="w-full md:w-5/12 h-[300px] md:h-[400px] rounded-3xl overflow-hidden group">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-5/12 flex flex-col justify-center items-start">
                    <h3 className="text-3xl md:text-4xl  text-main-text mb-6">
                      {service.title}
                    </h3>
                    <p className="text-white/80 font-light text-lg mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <Link 
                      to={`/services`} 
                      className={`px-8 py-4 rounded-full inline-flex items-center space-x-2 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300`}
                    >
                      <span className="uppercase tracking-widest text-xs font-medium">
                        {t('exploreService')}
                      </span>
                      <ArrowRight size={16} className="rtl:rotate-180" />
                    </Link>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}