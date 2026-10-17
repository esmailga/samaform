import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { splitLocale } from '../../seo/head';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  // Ignore the /en prefix so switching language keeps the scroll position
  const page = splitLocale(pathname).path;

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [page, hash]);

  return null;
}
