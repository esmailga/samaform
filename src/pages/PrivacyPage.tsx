import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl text-main-text mb-12">{t('privacyPolicy')}</h1>
      <div className="prose prose-invert max-w-none text-white/70 font-light space-y-8">
        <p className="text-lg leading-relaxed">{t('privacyIntro')}</p>
        
        <div>
          <h2 className="text-2xl text-white mb-4">{t('privacySection1Title')}</h2>
          <p className="leading-relaxed">{t('privacySection1Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('privacySection2Title')}</h2>
          <p className="leading-relaxed">{t('privacySection2Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('privacySection3Title')}</h2>
          <p className="leading-relaxed">{t('privacySection3Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('privacySection4Title')}</h2>
          <p className="leading-relaxed">{t('privacySection4Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('privacySection5Title')}</h2>
          <p className="leading-relaxed">{t('privacySection5Content')}</p>
        </div>
      </div>
    </div>
  );
}
