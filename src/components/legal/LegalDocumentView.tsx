import { motion } from 'motion/react';
import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { legal, type LegalBlock } from '../../data/legal';
import { convertArabicToWestern, convertWesternToArabic } from '../../utils/numbers';
import { GLASS_CLASSES } from '../../constants/styles';

// The site uses hash routing (#/terms), so in-page links scroll in code instead of using #anchors
const scrollToSection = (id: string) => {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <p className="leading-relaxed">{block}</p>;
  return (
    <ul className="space-y-2 ps-5 list-disc marker:text-main-text">
      {block.list.map((item, i) => <li key={i} className="leading-relaxed ps-1">{item}</li>)}
    </ul>
  );
}

export default function LegalDocumentView({ doc }: { doc: 'terms' | 'privacy' }) {
  const { lang, t } = useLanguage();
  const content = legal[lang];
  const { intro, sections } = content[doc];
  const num = (n: number) => (lang === 'ar' ? convertWesternToArabic(String(n)) : String(n));

  const contents = (
    <ol className="space-y-1">
      {sections.map((section, i) => (
        <li key={section.id}>
          <button
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="w-full text-start flex gap-2 py-1.5 text-sm text-white/60 hover:text-main-text transition-colors"
          >
            <span className="text-main-text/70 tabular-nums">{num(i + 1)}.</span>
            <span>{section.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-32 px-4 md:px-6 min-h-screen max-w-6xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mb-8 md:mb-14"
      >
        <h1 className="text-3xl md:text-5xl text-main-text mb-3 md:mb-4">{t(doc === 'terms' ? 'termsOfService' : 'privacyPolicy')}</h1>
        <p className="text-xs md:text-sm text-white/50">{content.labels.updated}: {content.updated}</p>
        <div className="mt-6 md:mt-8 space-y-4 text-base md:text-lg text-white/80 font-light">
          {intro.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-14 items-start">
        {/* Table of contents: collapsible on small screens, sticky alongside the text on large ones */}
        <aside className="lg:sticky lg:top-28">
          <details className={`lg:hidden rounded-2xl ${GLASS_CLASSES} group`}>
            <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none text-sm text-white [&::-webkit-details-marker]:hidden">
              {content.labels.contents}
              <ChevronDown size={18} className="text-main-text transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4">{contents}</div>
          </details>
          <nav className="hidden lg:block" aria-label={content.labels.contents}>
            <p className="text-xs uppercase tracking-widest text-main-text mb-3">{content.labels.contents}</p>
            {contents}
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl space-y-10 md:space-y-12 text-sm md:text-base text-white/75 font-light">
          {sections.map((section, i) => (
            <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24 md:scroll-mt-28">
              <h2 className="text-lg md:text-2xl text-white font-normal mb-3 md:mb-4 flex gap-2 md:gap-3">
                <span className="text-main-text tabular-nums">{num(i + 1)}.</span>
                <span>{section.title}</span>
              </h2>
              <div className="space-y-3 md:space-y-4">
                {section.body.map((block, j) => <Block key={j} block={block} />)}
              </div>
            </section>
          ))}

          <div className={`rounded-2xl md:rounded-3xl p-5 md:p-8 ${GLASS_CLASSES}`}>
            <h2 className="text-lg md:text-xl text-main-text mb-1">{content.labels.questions}</h2>
            <p className="text-white/60 mb-5 md:mb-6">{content.labels.questionsDesc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/85">
              <a href={`mailto:${t('studioEmail')}`} className="flex items-center gap-3 hover:text-main-text transition-colors">
                <Mail size={18} className="text-main-text shrink-0" />
                <span dir="ltr">{t('studioEmail')}</span>
              </a>
              <a href={`tel:${convertArabicToWestern(t('studioPhone1')).replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-main-text transition-colors">
                <Phone size={18} className="text-main-text shrink-0" />
                <span dir="ltr">{t('studioPhone1')}</span>
              </a>
              <p className="flex items-start gap-3 sm:col-span-2">
                <MapPin size={18} className="text-main-text shrink-0 mt-0.5" />
                <span>{t('studioAddress')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
