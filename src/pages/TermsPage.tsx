import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl  text-main-text mb-12">{t('termsOfService')}</h1>
      <div className="prose prose-invert max-w-none text-white/70 font-light space-y-6">
        <p>Welcome to SAMAFORM. By accessing our services, you agree to be bound by the following terms and conditions.</p>
        <h2 className="text-2xl  text-white mt-8">1. Intellectual Property</h2>
        <p>All architectural designs, concepts, and materials presented on this website are the exclusive property of SAMAFORM.</p>
        <h2 className="text-2xl  text-white mt-8">2. Use of Services</h2>
        <p>Our services are provided for informational and collaborative purposes. Any unauthorized use of our designs is strictly prohibited.</p>
      </div>
    </div>
  );
}
