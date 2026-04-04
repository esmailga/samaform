import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_CLASSES } from '../../constants/styles';
import { getProjectCategories } from '../home/Portfolio';

export default function CategoryCarousel({ category }: { category: ReturnType<typeof getProjectCategories>[0] }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const projects = [1, 2, 3];

  useEffect(() => {
    if (!isInView || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isInView, isHovered, projects.length]);

  return (
    <div className="w-full" ref={ref}>
      <div 
        className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-main-text/10 group bg-secondary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={`${category.image}?random=${projects[currentIndex]}`} 
              alt={`${category.title} ${projects[currentIndex]}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-header/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 inset-x-0 p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className={`p-6 rounded-2xl ${GLASS_CLASSES}`}>
                <h3 className="text-2xl  text-main-text">{category.title} {t('concept')} {projects[currentIndex]}</h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-8 space-x-4">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-main-text scale-125' : 'bg-main-text/30 hover:bg-main-text/60'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
