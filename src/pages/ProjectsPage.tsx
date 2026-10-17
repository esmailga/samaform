import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CategoryCarousel, { CategoryCarouselSkeleton } from '../components/projects/CategoryCarousel';
import { PROJECT_CATEGORIES, useProjects } from '../api/projects';

export default function ProjectsPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const { projects, status } = useProjects();

  // Categories without projects are hidden once the list has loaded
  const sections = PROJECT_CATEGORIES
    .map((category) => ({ ...category, projects: projects.filter((p) => p.category === category.id) }))
    .filter((section) => status !== 'ready' || section.projects.length > 0);

  // Wait for the projects to load so the anchor (e.g. #commercial) exists before scrolling to it
  useEffect(() => {
    if (status === 'loading') return;
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash, status]);

  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl text-main-text mb-4 md:mb-8">{t('ourProjects')}</h1>
          <p className="text-white text-base md:text-lg max-w-2xl font-light">
            {t('projectsPageDesc2')}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col space-y-16 md:space-y-28 mt-12 md:mt-24">
        {status === 'error' && (
          <p className="text-white/70 text-base md:text-lg">{t('projectsLoadError')}</p>
        )}
        {status !== 'error' && sections.map((section) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full scroll-mt-24 md:scroll-mt-32"
          >
            <h2 className="text-2xl md:text-4xl text-main-text mb-6 md:mb-10 border-b border-main-text/20 pb-3 md:pb-4">{t(section.titleKey)}</h2>
            {status === 'loading' ? <CategoryCarouselSkeleton /> : <CategoryCarousel projects={section.projects} />}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
