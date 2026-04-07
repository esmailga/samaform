import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl text-main-text mb-12">{t('termsOfService')}</h1>
      <div className="prose prose-invert max-w-none text-white/70 font-light space-y-8">
        <p className="text-lg leading-relaxed">{t('termsIntro')}</p>
        
        <div>
          <h2 className="text-2xl text-white mb-4">{t('termsSection1Title')}</h2>
          <p className="leading-relaxed">{t('termsSection1Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('termsSection2Title')}</h2>
          <p className="leading-relaxed">{t('termsSection2Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('termsSection3Title')}</h2>
          <p className="leading-relaxed">{t('termsSection3Content')}</p>
        </div>

        <div>
          <h2 className="text-2xl text-white mb-4">{t('termsSection4Title')}</h2>
          <p className="leading-relaxed">{t('termsSection4Content')}</p>
        </div>
      </div>
    </div>
  );
}
