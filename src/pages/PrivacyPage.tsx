import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl  text-main-text mb-12">{t('privacyPolicy')}</h1>
      <div className="prose prose-invert max-w-none text-white/70 font-light space-y-6">
        <p>Your privacy is important to us. This policy outlines how we handle your personal information.</p>
        <h2 className="text-2xl  text-white mt-8">1. Information Collection</h2>
        <p>We collect information you provide through our contact forms and plan recording features.</p>
        <h2 className="text-2xl  text-white mt-8">2. Data Usage</h2>
        <p>Your data is used solely to provide and improve our architectural services and communication.</p>
      </div>
    </div>
  );
}
