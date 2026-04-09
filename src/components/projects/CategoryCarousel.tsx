import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_CLASSES } from '../../constants/styles';
import { getProjectCategories } from '../home/Portfolio';

export default function CategoryCarousel({ category }: { category: ReturnType<typeof getProjectCategories>[0] }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const projects = [1, 2, 3];

  useEffect(() => {
    if (!isInView || isHovered || isAutoPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isInView, isHovered, isAutoPaused, projects.length]);

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
      setIsAutoPaused(false);
      setShowDetails(false);
    } else if (info.offset.x > swipeThreshold) {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      setIsAutoPaused(false);
      setShowDetails(false);
    }
  };

  return (
    <div className="w-full" ref={ref}>
      <div 
        className="relative h-[600px] md:h-[800px] rounded-3xl overflow-hidden border border-main-text/10 group bg-secondary/20 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onClick={() => {
          setShowDetails(!showDetails);
          setIsAutoPaused(true);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 touch-none"
          >
            <img 
              src={`${category.image}?random=${projects[currentIndex]}`} 
              alt={`${category.title} ${projects[currentIndex]}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              referrerPolicy="no-referrer"
              draggable={false}
            />
            <div className={`absolute inset-0 bg-header/40 transition-opacity duration-500 ${showDetails || isHovered ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute bottom-0 inset-x-0 p-6 transition-all duration-500 ${showDetails || isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className={`p-6 rounded-2xl ${GLASS_CLASSES}`}>
                <h3 className="text-2xl font-serif text-main-text">{category.title} {t('concept')} {projects[currentIndex]}</h3>
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
