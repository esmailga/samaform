import { useLanguage } from '../../context/LanguageContext';
import Counter from '../common/Counter';
import { GLASS_CLASSES } from '../../constants/styles';

export default function StatsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-22 text-center relative z-10">
        <div className={`p-12 rounded-3xl ${GLASS_CLASSES}`}>
          <div className="text-6xl md:text-7xl  text-main-text mb-4">
            <Counter from={0} to={99} suffix="%" />
          </div>
          <h3 className="text-lg uppercase tracking-widest text-white font-medium">{t('executionPrecision')}</h3>
        </div>
        <div className={`p-12 rounded-3xl ${GLASS_CLASSES}`}>
          <div className="text-6xl md:text-7xl  text-main-text mb-4">
            <Counter from={0} to={15} prefix="+" />
          </div>
          <h3 className="text-lg uppercase tracking-widest text-white font-medium">{t('happyClients')}</h3>
        </div>
      </div>
    </section>
  );
}
