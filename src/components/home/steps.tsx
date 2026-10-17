import { useLanguage } from '../../context/LanguageContext';
import RollingNumber from '../common/RollingNumber';
import { GLASS_CLASSES } from '../../constants/styles';
import { motion } from 'motion/react';

export default function StepsSection() {
  const { t } = useLanguage();

  const steps = [
    { number: 1, title: t('homeStepOne') },
    { number: 2, title: t('homeStepTwo') },
    { number: 3, title: t('homeStepThree') },
    { number: 4, title: t('homeStepFour') }
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`p-5 md:p-10 rounded-2xl md:rounded-3xl ${GLASS_CLASSES} flex items-center`}
          >
            {/* Animated Number */}
            <div className="text-4xl md:text-6xl text-main-text shrink-0">
              <RollingNumber to={step.number} prefix="0" delay={0.2 + index * 0.1} />
            </div>

            {/* Divider Line (Optional for extra flair) */}
            <div className="h-10 md:h-12 w-[1px] bg-main-text/20 mx-4 md:mx-8 shrink-0" />

            {/* Text beside number */}
            <div className="flex flex-col">
              <h3 className="text-sm md:text-lg uppercase tracking-wider md:tracking-widest text-white font-medium leading-snug">
                {step.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}