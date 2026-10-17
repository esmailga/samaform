// Shared by the app (updates <head> on every navigation) and scripts/seo-build.mjs (writes one HTML file per
// page so crawlers and link previews that don't run JavaScript still get the right title and description).
// Plain JS so Node can import it without a build step.

/** Arabic lives at the root (/services), English under /en (/en/services, /en/ for the home page). */
export function splitLocale(pathname) {
  if (pathname === '/en' || pathname.startsWith('/en/')) return { lang: 'en', path: pathname.slice(3) || '/' };
  return { lang: 'ar', path: pathname || '/' };
}

/** '/services#x' -> '/en/services#x' for English; unchanged for Arabic. The English home page is '/en/'. */
export function localizedPath(path, lang) {
  return lang === 'en' ? `/en${path}` : path;
}

export function findPage(site, path) {
  const clean = path.split('#')[0].replace(/\/+$/, '') || '/';
  return site.pages.find((p) => p.path === clean);
}

/** The <head> tags for one page in one language, as [tag, attributes, text?] tuples. */
export function headTags(site, page, lang) {
  const url = (l) => site.siteUrl + localizedPath(page.path, l);
  const title = page.title[lang];
  const description = page.description[lang];
  const image = site.siteUrl + site.image;
  return [
    ['title', {}, title],
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['link', { rel: 'canonical', href: url(lang) }],
    ['link', { rel: 'alternate', hreflang: 'ar', href: url('ar') }],
    ['link', { rel: 'alternate', hreflang: 'en', href: url('en') }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: url('ar') }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: site.siteName[lang] }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url(lang) }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: site.siteName[lang] }],
    ['meta', { property: 'og:locale', content: lang === 'ar' ? 'ar_YE' : 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: lang === 'ar' ? 'en_US' : 'ar_YE' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
  ];
}

/** Tags for pages that must stay out of search results (admin, unknown URLs). */
export function noindexTags(title) {
  return [
    ['title', {}, title],
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
  ];
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialises tags for static HTML. data-seo marks them so the app can replace them on navigation. */
export function renderHeadTags(tags) {
  return tags
    .map(([tag, attrs, text]) => {
      const attributes = Object.entries(attrs).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('');
      return tag === 'title' ? `<title>${escapeHtml(text)}</title>` : `<${tag} data-seo${attributes} />`;
    })
    .join('\n    ');
}

/** Replaces the page's SEO tags in the live document. */
export function applyHeadTags(tags) {
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  for (const [tag, attrs, text] of tags) {
    if (tag === 'title') {
      document.title = text;
      continue;
    }
    const el = document.createElement(tag);
    el.setAttribute('data-seo', '');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
}
