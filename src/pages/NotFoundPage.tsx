import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { t, localePath } = useLanguage();
  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
      <p className="text-6xl md:text-8xl text-main-text mb-4">404</p>
      <h1 className="text-2xl md:text-4xl text-white mb-3">{t('notFoundTitle')}</h1>
      <p className="text-white/70 text-base md:text-lg mb-8">{t('notFoundDesc')}</p>
      <Link to={localePath('/')} className="px-6 py-3 rounded-full bg-main-text text-header font-medium hover:bg-main-text/90 transition-colors">
        {t('backHome')}
      </Link>
    </div>
  );
}
