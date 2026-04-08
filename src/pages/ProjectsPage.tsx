import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CategoryCarousel from '../components/projects/CategoryCarousel';
import { getProjectCategorie } from '../components/projects/CategoryCarousel';

export default function ProjectsPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const projectCategories = getProjectCategorie(t);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="pt-40 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl  text-main-text mb-8">{t('ourProjects')}</h1>
          <p className="text-white text-lg max-w-2xl font-light">
            {t('projectsPageDesc2')}
          </p>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-32 mt-24">
        {projectCategories.map((category) => (
          <div key={category.id} id={category.id}>
            <h2 className="text-3xl md:text-4xl text-main-text mb-12 border-b border-main-text/20 pb-4">{category.title}</h2>
            <CategoryCarousel category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
