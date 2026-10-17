import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import RecordPlanPage from './pages/RecordPlanPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import AssetPreloader from './components/common/AssetPreloader';
import site from './seo/pages.json';
import { applyHeadTags, findPage, headTags, localizedPath, noindexTags, splitLocale } from './seo/head';

// Loaded on demand so public visitors never download the admin code (Excel/PDF export, forms)
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ADMIN_PATH = '/adviechadowsecupor';

// Every public page exists in Arabic (/services) and English (/en/services)
const PAGES: [string, ComponentType][] = [
  ['/', HomePage],
  ['/services', ServicesPage],
  ['/projects', ProjectsPage],
  ['/record-plan', RecordPlanPage],
  ['/contact', ContactPage],
  ['/terms', TermsPage],
  ['/privacy', PrivacyPage],
];

// Keeps the title, description, canonical and language links in <head> in sync with the current page
function SeoHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === ADMIN_PATH) return applyHeadTags(noindexTags('Admin | SAMAFORM'));
    const { lang, path } = splitLocale(pathname);
    const page = findPage(site, path);
    applyHeadTags(page
      ? headTags(site, page, lang)
      : noindexTags(lang === 'en' ? 'Page not found | SAMAFORM' : 'الصفحة غير موجودة | سما فورم'));
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === ADMIN_PATH;

  return (
    <div className="min-h-screen text-white selection:bg-main-text/30 font-sans">
      {!isAdminPage && <Navbar />}
      <main>
        <Suspense fallback={<div className="min-h-screen bg-header" />}>
          <Routes>
            {(['ar', 'en'] as const).flatMap((lang) =>
              PAGES.map(([path, Page]) => <Route key={lang + path} path={localizedPath(path, lang)} element={<Page />} />)
            )}
            <Route path={ADMIN_PATH} element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <SeoHead />
        <ScrollToTop />
        <AssetPreloader />
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}
