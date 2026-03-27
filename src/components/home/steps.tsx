import { useLanguage } from '../../context/LanguageContext';
import Counter from '../common/Counter';
import { GLASS_CLASSES } from '../../constants/styles';
import { motion } from 'motion/react';

export default function StepsSection() {
  const { t } = useLanguage();

  const steps = [
    { number: 1, title: t('stepOne') },
    { number: 2, title: t('stepTwo') },
    { number: 3, title: t('stepThree') },
    { number: 4, title: t('stepFour') }
  ];

  return (
    <section className="py-24 px-6 relative border-t border-main-text/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`p-8 md:p-10 rounded-3xl ${GLASS_CLASSES} flex items-center space-x-6 rtl:space-x-reverse`}
          >
            {/* Animated Number */}
            <div className="text-5xl md:text-6xl font-serif text-main-text min-w-[80px]">
              <Counter from={0} to={step.number} prefix="0" />
            </div>

            {/* Divider Line (Optional for extra flair) */}
            <div className="h-12 w-[1px] bg-main-text/20" />

            {/* Text beside number */}
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl uppercase tracking-widest text-white font-medium leading-tight">
                {step.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}