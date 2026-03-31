import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';

export default function Hero() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-6 w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-y-12 md:gap-y-24">
      <div className="h-90 md:h-7o mt-24 flex items-center justify-center">
          <AnimatePresence>
            {!isScrolled && (
              <motion.div
                key="hero-logo-wrapper"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Logo isHero={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="max-w-4xl w-full"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight text-main-text">
            {t('heroTitle1')}
          </h1>
          <h2 className="text-xl md:text-3xl text-white font-light max-w-2xl mx-auto">
            {t('heroTitle2')}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
