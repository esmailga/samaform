import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';
import heroBg from '../../assets/hero.jpg'; // Import fix from previous step

export default function Hero() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Wrapper */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        <img 
          src={heroBg} 
          alt="Hero Background" 
          className="w-full h-full object-cover object-center" 
          loading="eager"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 px-6 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Logo Container */}
        <div className="h-72 mt-24 flex items-center justify-center">
          <AnimatePresence>
            {!isScrolled && (
              <motion.div
                key="hero-logo-wrapper"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Logo isHero={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-4xl w-full mt-12"
        >
          <h1 className="text-3xl md:text-7xl lg:text-8xl leading-tight text-main-text drop-shadow-2xl">
            {t('heroTitle1')}
          </h1>
          <h2 className="mt-6 text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {t('heroTitle2')}
          </h2>
        </motion.div>
      </div>
      
      {/* Optional: Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}