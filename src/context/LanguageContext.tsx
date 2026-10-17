import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations, Language } from '../data/translations';
import { localizedPath, splitLocale } from '../seo/head';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string>) => string;
  /** Adds the /en prefix when the visitor is on the English site: localePath('/services') */
  localePath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (key) => translations['ar'][key] || translations['en'][key],
  localePath: (path) => path,
});

export const useLanguage = () => useContext(LanguageContext);

// The language comes from the URL (Arabic at /, English under /en/) so each language has its own indexable pages
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, path } = splitLocale(location.pathname) as { lang: Language; path: string };

  // Switching language opens the same page (and section) in the other language
  const setLang = (next: Language) => {
    if (next !== lang) navigate(localizedPath(path, next) + location.search + location.hash);
  };
  const localePath = (target: string) => localizedPath(target, lang);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: keyof typeof translations['en'], params?: Record<string, string>) => {
    let text = translations[lang][key] || translations['en'][key];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localePath }}>
      {children}
    </LanguageContext.Provider>
  );
}
