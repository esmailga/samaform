import { useLanguage } from '../../context/LanguageContext';
import Counter from '../common/Counter';
import { GLASS_CLASSES } from '../../constants/styles';

export default function StatsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-12 px-4 md:px-6 relative">
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 sm:gap-8 md:gap-22 text-center relative z-10">
        <div className={`p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl ${GLASS_CLASSES}`}>
          <div className="text-4xl sm:text-5xl md:text-7xl text-main-text mb-2 md:mb-4">
            <Counter from={0} to={99} suffix="%" />
          </div>
          <h3 className="text-xs sm:text-sm md:text-lg uppercase tracking-wider md:tracking-widest text-white font-medium">{t('executionPrecision')}</h3>
        </div>
        <div className={`p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl ${GLASS_CLASSES}`}>
          <div className="text-4xl sm:text-5xl md:text-7xl text-main-text mb-2 md:mb-4">
            <Counter from={0} to={15} prefix="+" />
          </div>
          <h3 className="text-xs sm:text-sm md:text-lg uppercase tracking-wider md:tracking-widest text-white font-medium">{t('happyClients')}</h3>
        </div>
      </div>
    </section>
  );
}
