import { motion } from 'motion/react';

// Shared by every piece of the hero <-> navbar logo morph so they move as one.
export const LOGO_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const;

export default function Logo({ isHero = false, isFooter = false, showText = true, noAnim = false }: { isHero?: boolean; isFooter?: boolean; showText?: boolean; noAnim?: boolean }) {
  const layoutId = (id: string) => (noAnim ? undefined : id);

  return (
    // The lockup is a brand mark, so it keeps the same LTR arrangement in both languages.
    // w-fit keeps the box as wide as the logo so it still sits at the start edge of RTL layouts.
    <div dir="ltr" className={`w-fit flex items-center ${isHero ? 'flex-col' : 'flex-row gap-3 md:gap-4'}`}>
      {/* Icon (logo2) */}
      <motion.div
        layoutId={layoutId('logo-img')}
        transition={LOGO_TRANSITION}
        className={`relative shrink-0 ${isHero ? 'w-16 h-16 md:w-28 md:h-28 mb-8 md:mb-14' : isFooter ? 'w-12 h-12 md:w-16 md:h-16' : 'w-8 h-8 md:w-10 md:h-10'}`}
      >
        <img src="/logo2.png" alt="Icon" className="w-full h-full object-contain" />
      </motion.div>

      {/* Title Image (logo3) */}
      {showText && (
        <motion.div
          layoutId={layoutId('logo-title-img')}
          transition={LOGO_TRANSITION}
          className={`shrink-0 ${isHero ? 'h-8 md:h-16' : isFooter ? 'h-8 md:h-10' : 'h-5 md:h-6'}`}
        >
          <img src="/logo3.png" alt="SAMAFORM" className="h-full w-auto object-contain" />
        </motion.div>
      )}
    </div>
  );
}
