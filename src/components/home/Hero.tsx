import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrolledPast, LOGO_HANDOFF_SCROLL } from '../../hooks/useScrolledPast';
import Logo from '../common/Logo';
import heroBg from '../../assets/hero.avif';


export default function Hero() {
  const { t, lang } = useLanguage();
  // Past this point the navbar renders the logo; the shared layoutIds make it fly up there
  const logoInNavbar = useScrolledPast(LOGO_HANDOFF_SCROLL);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col overflow-hidden bg-black">
      {/* Background Wrapper */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        <img 
          src={heroBg} 
          alt="Hero Background" 
          className="w-full h-full object-cover object-center" 
          loading="eager"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-6 pt-20 md:pt-24 pb-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* An invisible copy holds the space while the logo lives in the navbar */}
          {logoInNavbar ? (
            <div className="invisible" aria-hidden="true">
              <Logo isHero noAnim />
            </div>
          ) : (
            <Logo isHero />
          )}
          <motion.span
            animate={{ opacity: logoInNavbar ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className={`mt-4 text-white/80 uppercase ${lang === 'ar' ? 'text-sm md:text-lg' : 'text-[10px] sm:text-xs md:text-base tracking-[0.4em] ps-[0.4em]'}`}
          >
            {t('architectureAndInterior')}
          </motion.span>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-4xl w-full mt-12 md:mt-20"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight text-main-text drop-shadow-2xl">
            {t('heroTitle1')}
          </h1>
          <h2 className="mt-4 md:mt-6 text-base sm:text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {t('heroTitle2')}
          </h2>
        </motion.div>
      </div>
      </div>

      {/* Scroll Indicator: in normal flow below the content so the two can never overlap */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative z-20 self-center mb-10 md:mb-12 text-white/50"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}