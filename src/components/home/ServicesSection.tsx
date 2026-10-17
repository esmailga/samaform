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
  { id: 'interior-design', title: t('interiorDesign'), description: t('intDesc'), image: assetImages['../../assets/service1.avif'] },
  { id: 'architectural-design', title: t('architecturalDesign'), description: t('arcDesc'), image: assetImages['../../assets/service2.avif'] },
  { id: 'landscape-design', title: t('landscapeDesign'), description: t('lanDesc'), image: assetImages['../../assets/service3.avif'] },
  { id: 'commercial-design', title: t('commercialDesign'), description: t('comDesDesc'), image: assetImages['../../assets/service4.avif'] },
  { id: 'objects-design', title: t('objectsDesign'), description: t('objDesc'), image: assetImages['../../assets/service5.avif'] },
];

export default function ServicesSection() {
  const { t, localePath } = useLanguage();
  const servicesList = getServicesList(t);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="py-8 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto px-6 mb-6 md:mb-12" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-8 md:mb-16 text-center">
          <h2 className="py-4 md:py-12 text-3xl sm:text-4xl md:text-6xl font-bold mb-2 md:mb-4 text-main-text">
            {t('services')}
          </h2>
        </div>

        {/* STACK CONTAINER */}
        <div ref={containerRef} className="relative md:h-[320vh]">

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
                className="sticky top-20 md:top-32 mb-10 will-change-transform"
              >
                <div className="bg-primary rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-lg border-2 border-main-text">

                  {/* Image */}
                  <div className="w-full md:w-5/12 h-[220px] sm:h-[300px] md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden group">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-5/12 px-2 pb-2 md:p-0 flex flex-col justify-center items-start">
                    <h3 className="text-2xl md:text-4xl text-main-text mb-3 md:mb-6">
                      {service.title}
                    </h3>
                    <p className="text-white/80 font-light text-sm md:text-lg mb-5 md:mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <Link 
                      to={localePath(`/services#${service.id}`)} 
                      className={`px-6 py-3 md:px-8 md:py-4 rounded-full inline-flex items-center gap-2 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300`}
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