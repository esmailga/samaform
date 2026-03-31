import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { GLASS_CLASSES, GLASS_HOVER } from '../../constants/styles';

const assetImages: any = (import.meta as any).glob('../../assets/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});

export const getProjectCategories = (t: any) => [
  { id: 'residential', title: t('residentialProjects'), description: t('resDesc'), image: assetImages[ '../../assets/project1.png'] },
  { id: 'commercial', title: t('commercialProjects'), description: t('comDesc'), image: assetImages[ '../../assets/project2.png'] },
  { id: 'garden-terrace', title: t('gardenTerrace'), description: t('garDesc'), image: assetImages[ '../../assets/project3.png'] },
];

export default function Portfolio() {
  const { t } = useLanguage();
  const projectCategories = getProjectCategories(t);
  
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-main-text/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center md:text-center"
        >
          <h2 className="py-8 text-4xl md:py-12 text-5xl font-serif mb-4 text-main-text">
            {t('ourProjects')}</h2>
            <p className="text-white font-light mx-auto md:text-2xl mx-auto">
            {t('projectsDesc')}
          </p>
        </motion.div>

        <div className="flex flex-col space-y-20">
          {projectCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-20"
            >
              {/* Image Left */}
              <div className="w-full md:w-7/12 h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative group border border-main-text/10 shadow-2xl">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-header/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Text Right */}
              <div className="w-full md:w-5/12 flex flex-col justify-center items-start">
                <h3 className="text-3xl md:text-4xl font-serif text-main-text mb-6">{category.title}</h3>
                <p className="text-white/80 font-light text-lg mb-8 leading-relaxed">
                  {category.description}
                </p>
                <Link 
                  to={`/projects#${category.id}`} 
                  className={`px-8 py-4 rounded-full inline-flex items-center space-x-2 ${GLASS_CLASSES} ${GLASS_HOVER} text-white hover:text-main-text transition-all duration-300`}
                >
                  <span className="uppercase tracking-widest text-xs font-medium">{t('view')} {category.title}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
