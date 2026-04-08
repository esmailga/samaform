import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_CLASSES } from '../../constants/styles';

const assetImages: any = (import.meta as any).glob('../../assets/*.{png,jpg,jpeg,svg,avif}', { 
  eager: true, 
  import: 'default' 
});

export const getProjectCategorie = (t: any) => [
  { 
    id: 'residential', 
    title: t('residentialProjects'), 
    images: [
      assetImages['../../assets/resProject.avif'],
      assetImages['../../assets/resProject2.avif'],
      assetImages['../../assets/resProject3.avif']
    ]
  },
  { 
    id: 'commercial', 
    title: t('commercialProjects'), 
    images: [
      assetImages['../../assets/comProject.avif'],
      assetImages['../../assets/comProject2.avif'],
      assetImages['../../assets/comProject3.avif']
    ]
  },
  { 
    id: 'garden-terrace', 
    title: t('gardenTerrace'), 
    images: [
      assetImages['../../assets/project3.avif'],
      assetImages['../../assets/garProject2.avif'],
      assetImages['../../assets/garProject3.avif'],
    ]
  },
];
export default function CategoryCarousel({ category }: { category: ReturnType<typeof getProjectCategorie>[0] }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (!isInView || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % category.images.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isInView, isHovered, category.images.length]);

  return (
    <div className="w-[300px] md:w-[900px]" ref={ref}>
      <div 
        className="relative h-[400px] md:h-[900px] rounded-3xl overflow-hidden border border-main-text/10 group bg-secondary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={category.images[currentIndex]} 
              alt={`${category.title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-header/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 inset-x-0 p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className={`p-6 rounded-2xl ${GLASS_CLASSES}`}>
                <h3 className="text-2xl text-main-text">
                  {category.title} {currentIndex + 1}
                </h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-8 space-x-4">
        {category.images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === idx 
                ? 'bg-main-text scale-125' 
                : 'bg-main-text/30 hover:bg-main-text/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
