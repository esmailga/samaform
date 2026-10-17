import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { projectName, type Project } from '../../api/projects';
import { GLASS_CLASSES } from '../../constants/styles';

// 1.2 cards on phones, 2 on tablets, 3 on desktop
const CARD_WIDTH = 'w-[80%] sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]';

export default function CategoryCarousel({ projects }: { projects: Project[] }) {
  const { lang, t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  // Touch screens have no hover, so tapping a card toggles its name instead
  const [activeId, setActiveId] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    // scrollLeft is negative in RTL, so compare distances
    const scrolled = Math.abs(track.scrollLeft);
    setAtStart(scrolled < 4);
    setAtEnd(scrolled + track.clientWidth >= track.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [projects.length, lang]);

  // direction: 1 = towards the end of the list, -1 = back towards the start
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-card]');
    if (!track || !card) return;
    const styles = getComputedStyle(track);
    const step = card.offsetWidth + parseFloat(styles.columnGap || '0');
    const rtl = styles.direction === 'rtl';
    track.scrollBy({ left: direction * step * (rtl ? -1 : 1), behavior: 'smooth' });
  };

  const arrowClass = `hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full ${GLASS_CLASSES} text-white hover:text-main-text transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none`;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => {
          const name = projectName(project, lang);
          const active = activeId === project.id;
          return (
            <button
              key={project.id}
              type="button"
              data-card
              onClick={() => setActiveId(active ? null : project.id)}
              aria-pressed={active}
              className={`group relative shrink-0 snap-start ${CARD_WIDTH} aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border border-main-text/10 bg-secondary/30 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-main-text`}
            >
              <img
                src={project.image}
                alt={name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              <div className={`absolute inset-x-0 bottom-0 p-4 md:p-6 transition-all duration-500 ease-out ${active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                <h3 className="text-lg md:text-2xl text-main-text leading-snug">{name}</h3>
              </div>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={() => scrollByCard(-1)} disabled={atStart} aria-label={t('previousPage')} className={`${arrowClass} start-3`}>
        <ChevronLeft size={22} className="rtl:rotate-180" />
      </button>
      <button type="button" onClick={() => scrollByCard(1)} disabled={atEnd} aria-label={t('nextPage')} className={`${arrowClass} end-3`}>
        <ChevronRight size={22} className="rtl:rotate-180" />
      </button>
    </div>
  );
}

export function CategoryCarouselSkeleton() {
  return (
    <div className="flex gap-4 md:gap-6 overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`shrink-0 ${CARD_WIDTH} aspect-[4/5] rounded-2xl md:rounded-3xl bg-secondary/40 animate-pulse`} />
      ))}
    </div>
  );
}
