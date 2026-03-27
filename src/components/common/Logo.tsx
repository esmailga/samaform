import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export default function Logo({ isHero = false, showText = true, noAnim = false }: { isHero?: boolean; showText?: boolean; noAnim?: boolean }) {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      layoutId={noAnim ? undefined : "logo"}
      transition={{ duration: 0.8, ease: [0.16, 1.2, 0.2, 1] }}
      // Use space-x-4 to give gap between logo2 and logo3 in the header
      className={`flex items-center ${isHero ? 'flex-col' : 'flex-row space-x-2 rtl:space-x-reverse'}`}
    >
      {/* Icon (logo2) */}
      <motion.div 
        layoutId={noAnim ? undefined : "logo-img"}
        className={`relative ${isHero ? 'w-48 h-48 md:w-64 md:h-64 mb-6' : 'w-20 h-20'}`}
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
            className={`${isHero ? 'h-12 md:h-20' : 'h-8'}`} // Smaller h-6 for header
          >
            <img src="/logo3.png"
            alt="SAMAFORM"
            className="h-full w-auto object-contain"

            />

          </motion.div>
        )}

        {/* Subtitle - Hero Only */}
        {isHero && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs tracking-[0.3em] mt-4 text-white/80 uppercase"
          >
            {t('architectureAndInterior')}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
