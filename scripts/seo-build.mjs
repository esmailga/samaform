// Runs after `vite build`. Writes one HTML file per page and language (dist/services.html,
// dist/en/services.html, ...) with that page's title, description and links in <head>, so search engines and
// link previews (WhatsApp, Facebook, X) that don't run JavaScript see the right information. Also writes
// dist/sitemap.xml. Page details live in src/seo/pages.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { headTags, localizedPath, renderHeadTags } from '../src/seo/head.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/seo/pages.json'), 'utf8'));
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
if (!SEO_BLOCK.test(template)) throw new Error('index.html is missing the <!-- seo:start --> ... <!-- seo:end --> block');

// '/' -> index.html, '/services' -> services.html, '/en/' -> en/index.html, '/en/services' -> en/services.html
const outputFile = (urlPath) => path.join(dist, urlPath.endsWith('/') ? `${urlPath}index.html` : `${urlPath}.html`);

let written = 0;
for (const page of site.pages) {
  for (const lang of ['ar', 'en']) {
    const html = template
      .replace(SEO_BLOCK, `<!-- seo:start -->\n    ${renderHeadTags(headTags(site, page, lang))}\n    <!-- seo:end -->`)
      .replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`);
    const file = outputFile(localizedPath(page.path, lang));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    written++;
  }
}

// Each URL lists its other-language version so search engines treat the pair as translations
const url = (page, lang) => site.siteUrl + localizedPath(page.path, lang);
const entries = site.pages.flatMap((page) =>
  ['ar', 'en'].map((lang) => `  <url>
    <loc>${url(page, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${url(page, 'ar')}" />
    <xhtml:link rel="alternate" hreflang="en" href="${url(page, 'en')}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page, 'ar')}" />
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`)
);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);

console.log(`SEO: wrote ${written} page files and sitemap.xml (${entries.length} URLs)`);
