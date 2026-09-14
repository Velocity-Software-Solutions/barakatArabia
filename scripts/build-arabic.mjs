// Run `node scripts/build-arabic.mjs` after editing either English page.
// Arabic output is static HTML and does not depend on JavaScript for translation.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'scripts/arabic-translations.json'), 'utf8'));
const normalize = text => text.replace(/\s+/g, ' ').trim();
const missing = new Set();
function translate(text) {
  const key = normalize(text);
  if (!key || !/[a-z]/i.test(key)) return text;
  if (!Object.hasOwn(dictionary, key)) { missing.add(key); return text; }
  return text.replace(/\S[\s\S]*\S|\S/, dictionary[key]);
}

for (const page of ['index', 'home']) {
  const englishUrl = `https://barakatarabia.com/${page === 'index' ? '' : 'home.html'}`;
  const arabicUrl = `https://barakatarabia.com/${page}-ar.html`;
  let english = fs.readFileSync(path.join(root, `${page}.html`), 'utf8');
  english = english.replace(/<html\b[^>]*>/, '<html class="no-js" lang="en" dir="ltr" data-site-language="en">');
  if (!english.includes('assets/css/languages.css')) english = english.replace('</head>', '<link rel="stylesheet" href="assets/css/languages.css">\n</head>');
  english = english.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>\s*/g, '');
  english = english.replace('</head>', `<link rel="canonical" href="${englishUrl}">\n<link rel="alternate" hreflang="en" href="${englishUrl}">\n<link rel="alternate" hreflang="ar" href="${arabicUrl}">\n<link rel="alternate" hreflang="x-default" href="${englishUrl}">\n</head>`);
  english = english.replace(/<a\b[^>]*class="barakat-language-link"[^>]*>[\s\S]*?<\/a>\s*/g, '');
  const languageLink = `<a class="barakat-language-link" href="${page}-ar.html" lang="ar" hreflang="ar" aria-label="العربية" dir="rtl">العربية</a>`;
  english = english.replace(/(<div class="rs-header-right">)/g, `$1\n                        ${languageLink}`);
  english = english.replace(/(<div class="offcanvas-logo">[\s\S]*?<\/div>)/g, `$1\n                        ${languageLink}`);
  english = english.replace(/<a class="bar-icon" href=/g, '<a class="bar-icon" aria-label="Open menu" href=');
  english = english.replace(/<button class="offcanvas-close-icon animation--flip">/g, '<button class="offcanvas-close-icon animation--flip" aria-label="Close menu" type="button">');
  fs.writeFileSync(path.join(root, `${page}.html`), english);

  // Keep scripts, styles, comments and structural attributes byte-for-byte.
  let arabic = english.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/gi, token => {
    if (/^<(?:script|style)\b|^<!--/i.test(token)) return token;
    if (token.startsWith('<')) {
      token = token.replace(/\b(alt|aria-label|placeholder|title)="([^"]*)"/g, (_, attr, value) => `${attr}="${translate(value)}"`);
      if (/^<meta\b/i.test(token) && /(?:name|property)="(?:description|author|keywords|og:site_name|og:title|og:description|og:image:alt|twitter:title|twitter:description)"/.test(token)) {
        token = token.replace(/content="([^"]*)"/, (_, value) => `content="${translate(value)}"`);
      }
      return token;
    }
    return translate(token);
  });
  arabic = arabic.replace('lang="en" dir="ltr" data-site-language="en"', 'lang="ar" dir="rtl" data-site-language="ar"');
  arabic = arabic.replace('<body class="', '<body class="rtl ');
  arabic = arabic.replace('name="language" content="en"', 'name="language" content="ar"');
  arabic = arabic.replace('property="og:locale" content="en_SA"', 'property="og:locale" content="ar_SA"');
  arabic = arabic.replace(/(<meta property="og:url" content=")[^"]+/, `$1${arabicUrl}`);
  arabic = arabic.replace(/(<link rel="canonical" href=")[^"]+/, `$1${arabicUrl}`);
  arabic = arabic.replace(/<a\b[^>]*class="barakat-language-link"[^>]*>[\s\S]*?<\/a>/g, `<a class="barakat-language-link" href="${page}.html" lang="en" hreflang="en" aria-label="English" dir="ltr">English</a>`);
  arabic = arabic.replace(/href="(index|home)\.html([#?][^"]*)?"/g, (match, target, suffix = '') => target === page && !suffix ? match : `href="${target}-ar.html${suffix}"`);
  arabic = arabic.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
    const data = JSON.parse(json);
    for (const item of data['@graph'] || []) {
      if (item.name) item.name = dictionary[item.name] || item.name;
      if (item['@type'] === 'WebSite') {
        item.url = arabicUrl;
        item.inLanguage = 'ar';
        if (item.potentialAction) item.potentialAction.target = `${arabicUrl}?q={search_term_string}`;
      }
    }
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  });
  // Keep Arabic letter shaping intact instead of splitting headings into characters.
  arabic = arabic.replace(/\brs-split-text-enable\b/g, 'arabic-heading');
  fs.writeFileSync(path.join(root, `${page}-ar.html`), arabic);
  console.log(`Built ${page}-ar.html`);
}
if (missing.size) throw new Error(`Add translations for:\n${[...missing].join('\n')}`);
