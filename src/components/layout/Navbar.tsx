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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);
      setShowNavbarLogo(scrollY > 97);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileProjectsOpen(false);
  }, [location.pathname]);

  const smoothSpring = {
    type: "spring" as const,
    stiffness: 280,
    damping: 45,
    mass: 1,
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0,
        opacity: 1,
        backgroundColor: isScrolled || mobileMenuOpen ? 'rgba(38, 58, 64, 0.95)' : 'transparent',
        borderBottom: isScrolled || mobileMenuOpen ? '1px solid rgba(10, 34, 41, 0.2)' : '1px solid transparent'
      }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col"
    >
      <div className="h-24 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            layout="position"
            transition={smoothSpring}
            className={`flex items-center w-full ${showNavbarLogo || !isHome || mobileMenuOpen ? 'justify-between' : 'justify-start md:justify-center'}`}
          >
                
            <AnimatePresence>
            {(showNavbarLogo || !isHome || mobileMenuOpen) && (
                <motion.div
                  layout
                  key="navbar-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={smoothSpring}
                  className="overflow-hidden whitespace-nowrap shrink-0"
                >
                  <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
                    <Logo showText={true} noAnim={!isHome} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout transition={smoothSpring} className="flex items-center">
              <div className="hidden md:flex items-center gap-3 lg:gap-10 text-xs lg:text-sm font-medium tracking-wide text-white whitespace-nowrap">
                
                {/* Desktop Services Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link to="/services" className="flex items-center gap-1 hover:text-main-text transition-colors py-2">
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
                        className="absolute top-full start-0 mt-2 w-56 rounded-xl overflow-hidden bg-header/95 border border-main-text/20 shadow-xl"
                      >
                        <div className="flex flex-col py-2">
                          {/* UPDATED: Changed 'id' values to specific anchor tags instead of '/services' */}
                          {([
                            { key: 'interiorDesign', id: 'interior-design' },
                            { key: 'architecturalDesign', id: 'architectural-design' },
                            { key: 'landscapeDesign', id: 'landscape-design' },
                            { key: 'commercialDesign', id: 'commercial-design' },
                            { key: 'objectsDesign', id: 'objects-design' }
                          ] as const).map((item) => (
                            <Link 
                              key={item.id} 
                              to={`/services#${item.id}`} 
                              className="px-4 py-2 hover:bg-secondary/50 transition-colors text-sm text-white hover:text-main-text"
                            >
                              {t(item.key)}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop Projects Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setProjectsDropdownOpen(true)}
                  onMouseLeave={() => setProjectsDropdownOpen(false)}
                >
                  <Link to="/projects" className="flex items-center gap-1 hover:text-main-text transition-colors py-2">
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
                        className="absolute top-full start-0 mt-2 w-48 rounded-xl overflow-hidden bg-header/95 border border-main-text/20 shadow-xl"
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
                  <button className="flex items-center gap-1 hover:text-main-text transition-colors py-2">
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
                        className="absolute top-full end-0 mt-2 w-32 rounded-xl overflow-hidden bg-header/95 border border-main-text/20 shadow-xl"
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
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-header/95 border-t border-main-text/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {/* Mobile Services */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between text-xl text-white hover:text-main-text transition-colors py-2"
                  aria-expanded={mobileServicesOpen}
                >
                  <span>{t('services')}</span>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col space-y-3 ps-4 mt-2 border-s border-main-text/20"
                    >
                      {/* UPDATED: Changed 'path' to 'id' to dynamically link to hashes */}
                      {([
                        { key: 'interiorDesign', id: 'interior-design' },
                        { key: 'architecturalDesign', id: 'architectural-design' },
                        { key: 'landscapeDesign', id: 'landscape-design' },
                        { key: 'commercialDesign', id: 'commercial-design' },
                        { key: 'objectsDesign', id: 'objects-design' }
                      ] as const).map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/services#${item.id}`}
                          onClick={() => setMobileMenuOpen(false)} 
                          className="text-white/80 hover:text-main-text transition-colors py-1"
                        >
                          {t(item.key)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Projects */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                  className="flex items-center justify-between text-xl text-white hover:text-main-text transition-colors py-2"
                  aria-expanded={mobileProjectsOpen}
                >
                  <span>{t('ourProjects')}</span>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${mobileProjectsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileProjectsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col space-y-3 ps-4 mt-2 border-s border-main-text/20"
                    >
                      {[
                        { name: t('residentialProjects'), id: 'residential' },
                        { name: t('commercialProjects'), id: 'commercial' },
                        { name: t('gardenTerrace'), id: 'garden-terrace' }
                      ].map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/projects#${item.id}`} 
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white/80 hover:text-main-text transition-colors py-1"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/record-plan" onClick={() => setMobileMenuOpen(false)} className="text-xl text-white hover:text-main-text transition-colors py-2">{t('recordPlan')}</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xl text-white hover:text-main-text transition-colors py-2">{t('contactUs')}</Link>
              
              <div className="pt-6 border-t border-main-text/20 flex items-center justify-between">
                <div dir="ltr" className="flex justify-between w-full px-4">
                  <button 
                    onClick={() => setLang('en')} 
                    className={`text-sm font-medium transition-colors ${lang === 'en' ? 'text-main-text' : 'text-white/60 hover:text-white'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLang('ar')} 
                    className={`text-sm font-medium transition-colors ${lang === 'ar' ? 'text-main-text' : 'text-white/60 hover:text-white'}`}
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}