import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export default function Logo({ isHero = false, isFooter = false, showText = true, noAnim = false }: { isHero?: boolean; isFooter?: boolean; showText?: boolean; noAnim?: boolean }) {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      layoutId={noAnim ? undefined : "logo"}
      transition={{ duration: 0.3, ease: [0.4, 1.2, 0.33, 1] }}
      // Use space-x-4 to give gap between logo2 and logo3 in the header
      className={`flex items-center ${isHero ? 'flex-col gap-10' : 'flex-row gap-4'}`}
    >
      {/* Icon (logo2) */}
      <motion.div 
        layoutId={noAnim ? undefined : "logo-img"}
        className={`relative ${isHero ? 'w-20 h-20 md:w-30 md:h-30 mb-6' : isFooter ? 'w-12 h-12 md:w-16 md:h-16' : 'w-10 h-10 md:w-10 md:h-10'}`}
      >
        <img src="/logo2.png"
        alt="Icon"
        className="w-full h-full object-contain"

        />
      </motion.div>

      <div className={`flex flex-col ${isHero ? 'items-center' : 'items-start'}`}>
        {/* Title Image (logo3) */}
        {showText && (
          <motion.div 
            layoutId={noAnim ? undefined : "logo-title-img"}
            className={`${isHero ? 'h-10 md:h-18' : isFooter ? 'h-8 md:h-10' : 'h-6 md:md:h-6'}`} // Smaller h-6 for header
          >
            <img src="/logo3.png"
            alt="SAMAFORM"
            className="adjust-center h-full w-auto object-contain"

            />

          </motion.div>
        )}

        {/* Subtitle - Hero Only */}
        {isHero && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-md tracking-[0.4em] mt-4 text-white/80 uppercase pl-[0.4em]"
          >
            {t('architectureAndInterior')}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
