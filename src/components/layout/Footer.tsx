import { Instagram, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="py-20 px-6 border-t border-main-text/10 bg-header/80 backdrop-blur-md relative overflow-hidden">
      <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-main-text/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-2">
        <div className="mb-8">
            <Logo noAnim={true} isFooter={true} />
          </div>
          <p className="text-white font-light max-w-sm">
            {t('footerDesc')}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm uppercase tracking-widest font-medium mb-8 text-white">{t('navigation')}</h4>
          <ul className="space-y-4 text-white font-light">
            <li><Link to="/" className="hover:text-main-text transition-colors">{t('home')}</Link></li>
            <li><Link to="/services" className="hover:text-main-text transition-colors">{t('services')}</Link></li>
            <li><Link to="/projects" className="hover:text-main-text transition-colors">{t('ourProjects')}</Link></li>
            <li><Link to="/record-plan" className="hover:text-main-text transition-colors">{t('recordPlan')}</Link></li>
            <li><Link to="/contact" className="hover:text-main-text transition-colors">{t('contactUs')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest font-medium mb-8 text-white">{t('connect')}</h4>
          <div className="flex flex-col space-y-6">
            <a href="https://www.instagram.com/samaform.ye" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-main-text group-hover:text-header group-hover:border-main-text transition-all duration-300">
                <Instagram size={24} />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">Instagram</span>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61586938839749" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-main-text group-hover:text-header group-hover:border-main-text transition-all duration-300">
                <Facebook size={24} />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">Facebook</span>
            </a>
            <a href="mailto:hello@samaform.com" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-main-text group-hover:text-header group-hover:border-main-text transition-all duration-300">
                <Mail size={24} />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">Email</span>
            </a>
          </div>
          <div className="mt-12 pt-8 border-t border-main-text/10 flex flex-row space-x-14">
            <Link to="/terms" className="text-xs text-white/40 hover:text-main-text transition-colors">{t('termsOfService')}</Link>
            <Link to="/privacy" className="text-xs text-white/40 hover:text-main-text transition-colors">{t('privacyPolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
