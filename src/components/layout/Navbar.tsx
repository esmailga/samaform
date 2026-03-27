import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbarLogo, setShowNavbarLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Navbar gets background when scrolled past 50px
      setIsScrolled(scrollY > 80);
      // Logo appears in navbar when scrolled past 100px (when hero logo hides)
      setShowNavbarLogo(scrollY > 97);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const smoothSpring = {
    type: "spring",
    stiffness: 300,
    damping: 40,
    mass: 1
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0,
        opacity: 1,
        backgroundColor: isScrolled ? 'rgba(38, 58, 64, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        borderBottom: isScrolled ? '1px solid rgba(10, 34, 41, 0.2)' : '1px solid transparent'
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 h-24 flex items-center"    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
      <motion.div 
          layout 
          transition={smoothSpring}
          className={`flex items-center w-full ${showNavbarLogo || !isHome ? 'justify-between' : 'justify-center'}`} 
        >    
        <AnimatePresence>
              {(showNavbarLogo || !isHome) && (
                <motion.div
                  layout
                  key="navbar-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={smoothSpring}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
                    <Logo showText={true} noAnim={!isHome} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          <motion.div className="flex items-center">
          {/* ADDED layout PROP HERE SO IT GLIDES SMOOTHLY */}
          <motion.div layout transition={smoothSpring} className="flex items-center"></motion.div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-white">
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link to="/services" className="flex items-center space-x-1 hover:text-main-text transition-colors py-2">
                <span>{t('services')}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full start-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl overflow-hidden bg-header/95 backdrop-blur-md border border-main-text/20 shadow-xl"
                  >
                    <div className="flex flex-col py-2">
                      {[
                        { key: 'interiorDesign', path: '/services' },
                        { key: 'architecturalDesign', path: '/services' },
                        { key: 'landscapeDesign', path: '/services' },
                        { key: 'commercialDesign', path: '/services' },
                        { key: 'objectsDesign', path: '/services' }
                      ].map((item) => (
                        <Link 
                          key={item.key} 
                          to={item.path} 
                          className="px-4 py-2 hover:bg-secondary/50 transition-colors text-sm text-white hover:text-main-text"
                        >
                          {t(item.key as any)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Projects Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
            >
              <Link to="/projects" className="flex items-center space-x-1 hover:text-main-text transition-colors py-2">
                <span>{t('ourProjects')}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${projectsDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              <AnimatePresence>
                {projectsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full start-0 mt-2 w-48 rounded-xl overflow-hidden bg-header/95 backdrop-blur-md border border-main-text/20 shadow-xl"
                  >
                    <div className="flex flex-col py-2">
                      {[
                        { name: t('residentialProjects'), id: 'residential' },
                        { name: t('commercialProjects'), id: 'commercial' },
                        { name: t('gardenTerrace'), id: 'garden-terrace' }
                      ].map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/projects#${item.id}`} 
                          className="px-4 py-2 hover:bg-secondary/50 transition-colors text-sm text-white hover:text-main-text"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/record-plan" className="hover:text-main-text transition-colors">{t('recordPlan')}</Link>
            <Link to="/contact" className="hover:text-main-text transition-colors">{t('contactUs')}</Link>
            
            {/* Language Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setLangDropdownOpen(true)}
              onMouseLeave={() => setLangDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 hover:text-main-text transition-colors py-2">
                <Globe size={16} />
                <span className="uppercase text-xs">{lang === 'en' ? 'English' : 'العربية'}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full end-0 mt-2 w-32 rounded-xl overflow-hidden bg-header/95 backdrop-blur-md border border-main-text/20 shadow-xl"
                  >
                    <div className="flex flex-col py-2">
                      <button 
                        onClick={() => setLang('en')}
                        className={`px-4 py-2 text-start hover:bg-secondary/50 transition-colors text-sm ${lang === 'en' ? 'text-main-text' : 'text-white hover:text-main-text'}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => setLang('ar')}
                        className={`px-4 py-2 text-start hover:bg-secondary/50 transition-colors text-sm ${lang === 'ar' ? 'text-main-text' : 'text-white hover:text-main-text'}`}
                      >
                        العربية
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white ms-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </motion.div>
      </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 mt-4"
          >
            <div className={`flex flex-col space-y-4 p-6 rounded-2xl bg-header/95 backdrop-blur-md border border-main-text/20`}>
              <Link to="/services" className="text-lg text-white hover:text-main-text">{t('services')}</Link>
              <Link to="/projects" className="text-lg text-white hover:text-main-text">{t('ourProjects')}</Link>
              <Link to="/record-plan" className="text-lg text-white hover:text-main-text">{t('recordPlan')}</Link>
              <Link to="/contact" className="text-lg text-white hover:text-main-text">{t('contactUs')}</Link>
              <div className="pt-4 border-t border-main-text/20 flex space-x-4">
                <button onClick={() => setLang('en')} className={`text-sm ${lang === 'en' ? 'text-main-text' : 'text-white'}`}>English</button>
                <button onClick={() => setLang('ar')} className={`text-sm ${lang === 'ar' ? 'text-main-text' : 'text-white'}`}>العربية</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
