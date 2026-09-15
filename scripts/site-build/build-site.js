// Generates the Barakat Arabia pages (EN + AR home, per-project pages), project images and SEO files.
// Usage: node build-site.js <dist-dir> <project-photo-dir>
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const C = require('./content');

const DIST = process.argv[2];
const PHOTOS = process.argv[3];
const BASE = 'https://barakatarabia.com/';
const HOME = { en: 'index2.html', ar: 'index2-ar.html' };
const V = '20260914';
const TODAY = '2026-09-14';
const PHONE = '+966 54 412 6721', PHONE_TEL = '+966544126721', EMAIL = 'info@barakatarabia.com';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const L = (o, lang) => (o && typeof o === 'object' && 'en' in o ? o[lang] : o);
const projUrl = (p, lang) => `projects/${p.slug}${lang === 'ar' ? '-ar' : ''}.html`;
const pad = n => String(n).padStart(2, '0');
const arCount = n => (n >= 3 && n <= 10 ? `${n} مراجع` : `${n} مرجعاً`);
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const SECTOR_LABEL = {
  commercial: { en: 'Commercial', ar: 'تجاري' }, hospitality: { en: 'Hospitality', ar: 'ضيافة' }, residential: { en: 'Residential', ar: 'سكني' },
  healthcare: { en: 'Healthcare', ar: 'رعاية صحية' }, industrial: { en: 'Industrial', ar: 'صناعي' }, pharma: { en: 'Pharmaceutical', ar: 'صناعات دوائية' },
  infrastructure: { en: 'Infrastructure', ar: 'بنية تحتية' },
};
const SECTOR_PHRASE = {
  commercial: { en: 'commercial projects', ar: 'المشاريع التجارية' }, hospitality: { en: 'hospitality projects', ar: 'المشاريع الفندقية' },
  residential: { en: 'residential projects', ar: 'المشاريع السكنية' }, healthcare: { en: 'healthcare projects', ar: 'مشاريع الرعاية الصحية' },
  industrial: { en: 'industrial projects', ar: 'المشاريع الصناعية' }, pharma: { en: 'pharmaceutical projects', ar: 'مشاريع الصناعات الدوائية' },
  infrastructure: { en: 'infrastructure projects', ar: 'مشاريع البنية التحتية' },
};
const SCOPE_WORD = {
  mep: { en: 'MEP', ar: 'الأعمال الكهروميكانيكية' }, hvac: { en: 'HVAC', ar: 'التكييف والتهوية' }, plumbing: { en: 'plumbing and drainage', ar: 'الأعمال الصحية والصرف' },
  fire: { en: 'firefighting', ar: 'مكافحة الحريق' }, alarm: { en: 'fire alarm', ar: 'إنذار الحريق' }, bms: { en: 'BMS', ar: 'أنظمة إدارة المباني' },
  light: { en: 'light current', ar: 'التيار الخفيف' }, power: { en: 'electrical power', ar: 'القوى الكهربائية' }, pm: { en: 'project management', ar: 'إدارة المشروع' },
  electro: { en: 'electromechanical', ar: 'الأنظمة الكهروميكانيكية' },
};
const joinList = (arr, lang) => arr.length < 2 ? arr.join('') : lang === 'ar'
  ? arr.slice(0, -1).join('، ') + ' و' + arr[arr.length - 1]
  : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];

const T = {
  skip: { en: 'Skip to content', ar: 'تخطي إلى المحتوى' },
  nav: [['homeabout', { en: 'About', ar: 'من نحن' }], ['homeservices', { en: 'Services', ar: 'خدماتنا' }], ['homeportfolio', { en: 'Projects', ar: 'المشاريع' }], ['homegallery', { en: 'Gallery', ar: 'معرض الصور' }], ['homecontact', { en: 'Contact', ar: 'تواصل معنا' }]],
  discuss: { en: 'Discuss a Project', ar: 'ناقش مشروعك' },
  openMenu: { en: 'Open menu', ar: 'فتح القائمة' },
  toTop: { en: 'Back to top', ar: 'العودة إلى الأعلى' },
  brand: { en: 'Barakat Arabia', ar: 'البركات العربية' },
  home: { en: 'Home', ar: 'الرئيسية' },
  projects: { en: 'Projects', ar: 'المشاريع' },
  view: { en: 'View', ar: 'عرض' },
  close: { en: 'Close', ar: 'إغلاق' }, prev: { en: 'Previous image', ar: 'الصورة السابقة' }, next: { en: 'Next image', ar: 'الصورة التالية' },
  viewer: { en: 'Image viewer', ar: 'عارض الصور' },
};

/* ---------------- Icons ---------------- */
const MARK_PATHS = '<path d="M1030 325 1020 487Q1018 494 1012 502L438 1300Q428 1314 446 1314H1188Q1198 1314 1203 1322L1248 1402H385Q368 1402 350 1410L195 1488Z"/><path d="M1103 433 1091 541Q1089 553 1082 563L602 1242Q596 1248 606 1248H698Q707 1248 712 1240L1113 662Q1120 652 1127 662L1592 1450Q1598 1460 1610 1466L1757 1555Z"/><path d="M1100 803 1047 878Q1042 886 1046 894L1382 1492Q1387 1504 1374 1504H334Q318 1504 305 1511L163 1593H1653L1512 1514Q1502 1508 1496 1498Z"/>';
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="logo-mark" viewBox="140 140 1640 1640"><g fill="#9e3238">${MARK_PATHS}</g></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-arrow-up" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-expand" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="i-left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
<symbol id="i-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-briefcase" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></symbol>
<symbol id="i-cpu" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></symbol>
<symbol id="i-hardhat" viewBox="0 0 24 24"><path d="M2 18h20v3H2zM4 18v-3a8 8 0 0 1 16 0v3M10 7V4h4v3"/></symbol>
<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 2.7s-6 6.6-6 11.3a6 6 0 0 0 12 0c0-4.7-6-11.3-6-11.3z"/></symbol>
</svg>`;
const icon = (id, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const btn = (href, label, cls = 'btn') => `<a class="${cls}" href="${href}">${label} <span class="ico">${icon('arrow')}</span></a>`;

/* ---------------- Images ---------------- */
const dimsCache = {};
async function dims(file) {
  if (!dimsCache[file]) { const m = await sharp(fs.readFileSync(file)).metadata(); dimsCache[file] = [m.width, m.height]; }
  return dimsCache[file];
}
const IMG = path.join(DIST, 'assets', 'v2', 'img');
async function imgTag(root, name, alt, { widths, sizes, lazy = true, cls = '', priority = false } = {}) {
  const files = widths ? widths.map(w => `${name}-${w}.webp`) : [`${name}.webp`];
  const [w, h] = await dims(path.join(IMG, files[0]));
  const srcset = widths ? ` srcset="${await Promise.all(files.map(async f => `${root}assets/v2/img/${f} ${(await dims(path.join(IMG, f)))[0]}w`)).then(a => a.join(', '))}" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${root}assets/v2/img/${files[0]}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}${priority ? ' fetchpriority="high"' : ''}>`;
}

const PROJ_DIR = path.join(DIST, 'assets', 'v2', 'projects');
async function buildProjectImages() {
  fs.mkdirSync(PROJ_DIR, { recursive: true });
  for (const p of C.PROJECTS) {
    p.images = [];
    for (const [k, n] of p.photos.entries()) {
      const buf = fs.readFileSync(path.join(PHOTOS, `p${pad(p.src)}-${n}.jpg`));
      const variants = [];
      for (const w of [600, 1100, 1800]) {
        const { data, info } = await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 72, effort: 5, smartSubsample: true }).toBuffer({ resolveWithObject: true });
        if (variants.length && info.width === variants[variants.length - 1].w) continue;
        const file = `${p.slug}-${k + 1}-${w}.webp`;
        fs.writeFileSync(path.join(PROJ_DIR, file), data);
        variants.push({ file, w: info.width, h: info.height });
      }
      p.images.push(variants);
    }
    const og = await sharp(fs.readFileSync(path.join(PHOTOS, `p${pad(p.src)}-${p.photos[0]}.jpg`))).rotate().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    fs.writeFileSync(path.join(PROJ_DIR, `${p.slug}-og.jpg`), og);
  }
}
function projImg(root, p, k, alt, sizes, { lazy = true, priority = false, cls = '' } = {}) {
  const v = p.images[k];
  const first = v[0];
  return `<img${cls ? ` class="${cls}"` : ''} src="${root}assets/v2/projects/${first.file}" srcset="${v.map(x => `${root}assets/v2/projects/${x.file} ${x.w}w`).join(', ')}" sizes="${sizes}" width="${first.w}" height="${first.h}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}${priority ? ' fetchpriority="high"' : ''}>`;
}
const largest = (p, k) => p.images[k][p.images[k].length - 1];

/* ---------------- Shared layout ---------------- */
function head(lang, o) {
  const alt = o.alternates;
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${BASE}${o.url}">
<link rel="alternate" hreflang="en" href="${BASE}${alt.en}">
<link rel="alternate" hreflang="ar" href="${BASE}${alt.ar}">
<link rel="alternate" hreflang="x-default" href="${BASE}${alt.en}">
<meta name="theme-color" content="#0b0d11">
<meta name="format-detection" content="telephone=no">
<meta name="geo.region" content="SA">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:site_name" content="${lang === 'ar' ? 'البركات العربية' : 'Barakat Arabia'}">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${BASE}${o.url}">
<meta property="og:image" content="${BASE}${o.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(o.ogAlt || o.title)}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_SA' : 'en_SA'}">
<meta property="og:locale:alternate" content="${lang === 'ar' ? 'en_SA' : 'ar_SA'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${BASE}${o.ogImage}">
<link rel="icon" href="${o.root}favicon.ico" sizes="48x48">
<link rel="icon" href="${o.root}assets/v2/img/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${o.root}assets/v2/img/apple-touch-icon.png">
<link rel="manifest" href="${o.root}site.webmanifest">
${o.preload || ''}${lang === 'ar'
    ? `<link rel="preload" as="font" type="font/woff2" href="${o.root}assets/v2/fonts/ibm-plex-sans-arabic-normal-700-arabic.woff2" crossorigin>\n<link rel="preload" as="font" type="font/woff2" href="${o.root}assets/v2/fonts/ibm-plex-sans-arabic-normal-400-arabic.woff2" crossorigin>`
    : `<link rel="preload" as="font" type="font/woff2" href="${o.root}assets/v2/fonts/manrope-normal-400-800-latin.woff2" crossorigin>\n<link rel="preload" as="font" type="font/woff2" href="${o.root}assets/v2/fonts/instrument-serif-italic-400-latin.woff2" crossorigin>`}
<link rel="stylesheet" href="${o.root}assets/v2/site.css?v=${V}">
<script>document.documentElement.classList.add('js')</script>
<script defer src="${o.root}assets/v2/site.js?v=${V}"></script>
${ld(o.jsonld)}
</head>
<body>
<a class="skip" href="#main">${L(T.skip, lang)}</a>
${SPRITE}`;
}

function header(lang, o) {
  const navHref = id => (o.isHome ? `#${id}` : `${o.root}${HOME[lang]}#${id}`);
  const other = lang === 'ar' ? 'en' : 'ar';
  const langLink = cls => `<a class="${cls}" href="${o.root}${o.alternates[other]}" hreflang="${other}" lang="${other}"${other === 'ar' ? ' dir="rtl"' : ''}>${other === 'ar' ? 'العربية' : 'English'}</a>`;
  return `
<header class="header" id="header">
  <div class="wrap header-inner">
    <a class="logo" href="${o.isHome ? '#home' : o.root + HOME[lang]}" aria-label="${L(T.brand, lang)}"><img src="${o.root}assets/v2/img/logo-light-320.webp" srcset="${o.root}assets/v2/img/logo-light-320.webp 320w, ${o.root}assets/v2/img/logo-light-480.webp 480w" sizes="144px" width="144" height="48" alt="${L(T.brand, lang)}"></a>
    <nav class="nav" aria-label="${lang === 'ar' ? 'القائمة الرئيسية' : 'Primary'}">
      ${T.nav.map(([id, label]) => `<a href="${navHref(id)}">${L(label, lang)}</a>`).join('\n      ')}
    </nav>
    <div class="header-actions">
      ${langLink('lang')}
      ${btn(navHref('homecontact'), L(T.discuss, lang))}
      <button class="burger" id="burger" aria-label="${L(T.openMenu, lang)}" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="${lang === 'ar' ? 'قائمة الجوال' : 'Mobile'}">
    ${T.nav.map(([id, label], i) => `<a href="${navHref(id)}"><small>${pad(i + 1)}</small>${L(label, lang)}</a>`).join('\n    ')}
  </nav>
  <div class="mm-foot">
    <a href="tel:${PHONE_TEL}" class="ltr">${PHONE}</a>
    <a href="mailto:${EMAIL}">${EMAIL}</a>
    ${langLink('')}
  </div>
</div>`;
}

function footer(lang, o) {
  const navHref = id => (o.isHome ? `#${id}` : `${o.root}${HOME[lang]}#${id}`);
  const other = lang === 'ar' ? 'en' : 'ar';
  const t = {
    cta: { en: 'Built with purpose. <em>Ready when you are.</em>', ar: 'نبني بهدف. <em>وجاهزون متى شئت.</em>' },
    start: { en: 'Start a Project', ar: 'ابدأ مشروعك' },
    desc: { en: 'Barakat Arabia combines contracting discipline with coordinated technical delivery for construction and MEP-led projects across Saudi Arabia and the region.', ar: 'تجمع البركات العربية بين الانضباط في المقاولات والتنسيق الفني لتنفيذ مشاريع البناء والأعمال الكهروميكانيكية في المملكة العربية السعودية والمنطقة.' },
    company: { en: 'Company', ar: 'الشركة' }, services: { en: 'Services', ar: 'الخدمات' }, projects: { en: 'Featured projects', ar: 'مشاريع مميزة' },
    links: [['homeabout', { en: 'About us', ar: 'من نحن' }], ['why', { en: 'Why Barakat Arabia', ar: 'لماذا البركات العربية' }], ['organization', { en: 'Organization', ar: 'الهيكل التنظيمي' }], ['quality', { en: 'Standards', ar: 'المعايير' }], ['homecontact', { en: 'Contact', ar: 'تواصل معنا' }]],
    svc: [['homeservices', { en: 'Procurement & Design', ar: 'المشتريات والتصميم' }], ['homeservices', { en: 'Execution & Project Management', ar: 'التنفيذ وإدارة المشاريع' }], ['homeservices', { en: 'Value Engineering', ar: 'هندسة القيمة' }], ['mep-scope', { en: 'MEP Systems', ar: 'الأنظمة الكهروميكانيكية' }], ['homeservices', { en: 'Facility Management', ar: 'إدارة المرافق' }]],
    rights: { en: 'Barakat Arabia General Contracting. All rights reserved.', ar: 'البركات العربية للمقاولات العامة. جميع الحقوق محفوظة.' },
  };
  return `
<footer class="footer">
  <div class="wrap">
    <div class="foot-cta">
      <h2>${L(t.cta, lang)}</h2>
      ${btn(navHref('homecontact'), L(t.start, lang))}
    </div>
    <div class="foot-grid">
      <div>
        <img src="${o.root}assets/v2/img/logo-light-320.webp" srcset="${o.root}assets/v2/img/logo-light-320.webp 320w, ${o.root}assets/v2/img/logo-light-480.webp 480w" sizes="156px" width="156" height="52" alt="${L(T.brand, lang)}" loading="lazy" decoding="async">
        <p class="desc">${L(t.desc, lang)}</p>
      </div>
      <div><h4>${L(t.company, lang)}</h4><ul>${t.links.map(([id, l]) => `<li><a href="${navHref(id)}">${L(l, lang)}</a></li>`).join('')}</ul></div>
      <div><h4>${L(t.services, lang)}</h4><ul>${t.svc.map(([id, l]) => `<li><a href="${navHref(id)}">${L(l, lang)}</a></li>`).join('')}</ul></div>
      <div><h4>${L(t.projects, lang)}</h4><ul>${C.PROJECTS.slice(0, 5).map(p => `<li><a href="${o.root}${projUrl(p, lang)}">${esc(L(p.title, lang))}</a></li>`).join('')}</ul></div>
    </div>
    <div class="foot-bottom">
      <span>&copy; <span id="year">2026</span> ${L(t.rights, lang)}</span>
      <span><a href="tel:${PHONE_TEL}" class="ltr">${PHONE}</a> &nbsp;·&nbsp; <a href="mailto:${EMAIL}">${EMAIL}</a></span>
      <a class="lang" href="${o.root}${o.alternates[other]}" hreflang="${other}" lang="${other}">${other === 'ar' ? 'العربية' : 'English'}</a>
    </div>
  </div>
  <div class="foot-word" aria-hidden="true">BARAKAT</div>
</footer>
<button class="to-top" id="to-top" type="button" aria-label="${L(T.toTop, lang)}">
  <svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="track" cx="18" cy="18" r="16" pathLength="100"/><circle class="bar" cx="18" cy="18" r="16" pathLength="100"/></svg>
  <svg class="mark" aria-hidden="true"><use href="#logo-mark"/></svg>
  ${icon('arrow-up', 'arrow')}
</button>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="${L(T.viewer, lang)}" aria-hidden="true">
  <span class="lb-count" id="lb-count"></span>
  <figure><img id="lb-img" alt=""><figcaption id="lb-cap"></figcaption></figure>
  <button class="lb-close" type="button" aria-label="${L(T.close, lang)}">${icon('close')}</button>
  <button class="lb-prev" type="button" aria-label="${L(T.prev, lang)}">${icon('left')}</button>
  <button class="lb-next" type="button" aria-label="${L(T.next, lang)}">${icon('right')}</button>
</div>
</body>
</html>
`;
}

const orgLd = lang => ({
  '@type': 'GeneralContractor',
  '@id': `${BASE}#organization`,
  name: 'Barakat Arabia',
  alternateName: ['البركات العربية', 'Barakat Arabia General Contracting', 'البركات العربية للمقاولات العامة'],
  url: BASE,
  logo: { '@type': 'ImageObject', url: `${BASE}assets/v2/img/icon-512.png`, width: 512, height: 512 },
  image: `${BASE}assets/v2/img/og-image.jpg`,
  description: 'General contracting and MEP contractor in Saudi Arabia delivering HVAC, electrical, plumbing, firefighting, BMS and facility management for commercial, healthcare, hospitality, industrial and residential projects.',
  email: EMAIL,
  telephone: PHONE_TEL,
  address: { '@type': 'PostalAddress', addressCountry: 'SA' },
  areaServed: [{ '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'Egypt' }, { '@type': 'Country', name: 'Kenya' }],
  knowsAbout: C.SCOPE.map(s => s.t.en).concat(['General contracting', 'MEP contracting', 'Value engineering', 'Facility management']),
  slogan: 'Building with purpose. Delivering with precision.',
  contactPoint: { '@type': 'ContactPoint', telephone: PHONE_TEL, email: EMAIL, contactType: 'sales', availableLanguage: ['English', 'Arabic'], areaServed: 'SA' },
  sameAs: ['https://www.barakatarabia.com'],
});

/* ---------------- Home page ---------------- */
async function homePage(lang) {
  const root = '';
  const alternates = { en: HOME.en, ar: HOME.ar };
  const counts = { all: C.PROJECTS.length, sa: 0, eg: 0, ke: 0 };
  C.PROJECTS.forEach(p => counts[C.PLACES[p.place].country]++);
  const refTotal = C.REFERENCES.reduce((n, g) => n + g.items.length, 0);
  const S = s => L(s, lang);

  const title = S({ en: 'Barakat Arabia | General Contracting & MEP Contractor in Saudi Arabia', ar: 'البركات العربية | مقاولات عامة وأعمال كهروميكانيكية في السعودية' });
  const desc = S({ en: 'General contracting and MEP contractor in Saudi Arabia: HVAC, electrical, plumbing, firefighting, BMS and facility management, backed by 20+ years of experience.', ar: 'البركات العربية للمقاولات العامة والأعمال الكهروميكانيكية في السعودية: التكييف والكهرباء والسباكة ومكافحة الحريق وأنظمة إدارة المباني وإدارة المرافق بخبرة تتجاوز 20 عاماً.' });

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      Object.assign(orgLd(lang), {
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: C.SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: S(s.t), description: S(s.d) } })) },
      }),
      { '@type': 'WebSite', '@id': `${BASE}#website`, url: BASE, name: 'Barakat Arabia', alternateName: 'البركات العربية', inLanguage: ['en', 'ar'], publisher: { '@id': `${BASE}#organization` } },
      { '@type': 'WebPage', '@id': `${BASE}${HOME[lang]}#webpage`, url: `${BASE}${HOME[lang]}`, name: title, description: desc, inLanguage: lang, isPartOf: { '@id': `${BASE}#website` }, about: { '@id': `${BASE}#organization` }, primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE}assets/v2/img/og-image.jpg` } },
      { '@type': 'ItemList', name: S({ en: 'Project portfolio', ar: 'سجل المشاريع' }), itemListElement: C.PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: BASE + projUrl(p, lang), name: S(p.title) })) },
    ],
  };

  let h = head(lang, {
    root, url: HOME[lang], alternates, title, desc, jsonld, ogImage: 'assets/v2/img/og-image.jpg',
    preload: `<link rel="preload" as="image" href="assets/v2/img/hero-1400.webp" imagesrcset="assets/v2/img/hero-800.webp 800w, assets/v2/img/hero-1400.webp 1316w" imagesizes="100vw" fetchpriority="high">\n`,
  });
  h += header(lang, { root, isHome: true, alternates });

  const heroImg = await imgTag(root, 'hero', '', { widths: [800, 1400], sizes: '100vw', lazy: false, priority: true });
  const ticker = [
    { en: 'General Contracting', ar: 'المقاولات العامة' }, { en: 'Construction Solutions', ar: 'حلول البناء' }, { en: 'MEP Coordination', ar: 'تنسيق الأعمال الكهروميكانيكية' },
    { en: 'Infrastructure Works', ar: 'أعمال البنية التحتية' }, { en: 'Project Delivery', ar: 'تنفيذ المشاريع وتسليمها' }, { en: 'Value Engineering', ar: 'هندسة القيمة' },
  ].map(S);

  h += `
<main id="main">
<section id="home" class="hero">
  <div class="hero-media">${heroImg}</div>
  <div class="wrap hero-inner">
    <h1><span class="kicker" data-in="1">${S({ en: 'General Contracting &amp; MEP Contractor in Saudi Arabia', ar: 'مقاولات عامة وأعمال كهروميكانيكية في المملكة العربية السعودية' })}</span><span class="big" data-in="2">${S({ en: 'Building with purpose. <em>Delivering with precision.</em>', ar: 'نبني بهدف. <em>وننجز بدقة.</em>' })}</span></h1>
    <p class="lead" data-in="3">${S({ en: 'Barakat Arabia brings general contracting, construction and coordinated MEP expertise together to move demanding projects from concept to completion.', ar: 'تجمع البركات العربية بين المقاولات العامة والبناء وخبرات الأعمال الكهروميكانيكية المتكاملة، لتحويل المشاريع الطموحة من الفكرة إلى الإنجاز.' })}</p>
    <div class="hero-actions" data-in="4">
      ${btn('#homecontact', S({ en: 'Discuss Your Project', ar: 'ناقش مشروعك معنا' }))}
      <a class="btn btn-ghost" href="#homeportfolio">${S({ en: 'Explore Projects', ar: 'استكشف مشاريعنا' })}</a>
    </div>
  </div>
  <div class="wrap">
    <div class="hero-stats" data-in="5">
      ${C.STATS.map(s => `<div class="stat"><b><span data-count="${s.n}">${s.n}</span>${s.plus ? '<sup>+</sup>' : ''}</b><span>${S(s.label)}</span></div>`).join('\n      ')}
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true">${S({ en: 'Scroll', ar: 'مرر' })}</div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker-track">${ticker.concat(ticker).map(t => `<span>${t}</span>`).join('')}</div></div>

<section id="homeabout" class="section">
  <div class="wrap about-grid">
    <div class="about-visual rv">
      <div class="frame">${await imgTag(root, 'about', S({ en: 'Hilton Garden Inn, New Cairo — MEP works by Barakat Arabia', ar: 'فندق هيلتون جاردن إن بالقاهرة الجديدة — أعمال كهروميكانيكية من البركات العربية' }), { widths: [700, 1100], sizes: '(max-width: 991px) 92vw, 44vw' })}</div>
      <div class="about-badge"><b>20+ <em>${S({ en: 'years', ar: 'عاماً' })}</em></b><span>${S({ en: 'of engineering and delivery experience across Saudi Arabia, Egypt and Kenya', ar: 'من الخبرة الهندسية والتنفيذية في السعودية ومصر وكينيا' })}</span></div>
    </div>
    <div>
      <div class="rv">
        <span class="eyebrow">${S({ en: 'About Barakat Arabia', ar: 'عن البركات العربية' })}</span>
        <h2 class="title">${S({ en: 'A practical partner for <em>demanding</em> construction projects', ar: 'شريك عملي <em>للمشاريع الإنشائية</em> ذات المتطلبات العالية' })}</h2>
        <p class="lead">${S({ en: 'Barakat Arabia specializes in supplying, installing and maintaining electromechanical systems. We also provide facility management, project management, technical design services and general construction — delivering innovative, reliable solutions tailored to our clients’ needs.', ar: 'تتخصص البركات العربية في توريد وتركيب وصيانة الأنظمة الكهروميكانيكية، كما نقدم خدمات إدارة المرافق وإدارة المشاريع والتصميم الفني والمقاولات العامة، لنقدم حلولاً مبتكرة وموثوقة مصممة لتلبية احتياجات عملائنا.' })}</p>
      </div>
      <div class="mv">
        <article class="card-soft rv" style="--d:.05s"><h3><i class="dot"></i>${S({ en: 'Our Mission', ar: 'رسالتنا' })}</h3><p>${S({ en: 'To deliver high-quality solutions, reliable services and superior materials with professionalism and the highest standards of customer satisfaction.', ar: 'تقديم حلول عالية الجودة وخدمات موثوقة ومواد متميزة باحترافية وبأعلى معايير رضا العملاء.' })}</p></article>
        <article class="card-soft rv" style="--d:.15s"><h3><i class="dot"></i>${S({ en: 'Our Vision', ar: 'رؤيتنا' })}</h3><p>${S({ en: 'To be a leading, trusted first choice for clients by driving innovation, delivering excellence and building lasting trust.', ar: 'أن نكون الخيار الأول والموثوق للعملاء من خلال قيادة الابتكار وتقديم التميز وبناء ثقة دائمة.' })}</p></article>
      </div>
      <div class="values rv">
        <h3>${S({ en: 'Our Values', ar: 'قيمنا' })}</h3>
        <ul class="chips">${[['Leadership', 'الريادة'], ['Transparency', 'الشفافية'], ['Integrity', 'النزاهة'], ['Reliability', 'الموثوقية'], ['Innovation', 'الابتكار'], ['Customer Satisfaction', 'رضا العملاء']].map(([e, a]) => `<li class="chip">${lang === 'ar' ? a : e}</li>`).join('')}</ul>
      </div>
      <div class="how rv">
        <p><strong>${S({ en: 'How we work', ar: 'كيف نعمل' })}</strong>${S({ en: 'Clear responsibilities, coordinated technical teams and practical decisions keep each stage moving toward a successful handover.', ar: 'مسؤوليات واضحة وفرق فنية متكاملة وقرارات عملية تدفع كل مرحلة نحو تسليم ناجح.' })}</p>
        <a class="link-arrow" href="#homecontact">${S({ en: 'Request Company Information', ar: 'اطلب معلومات الشركة' })} ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section id="homeservices" class="section dark services">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Our Services', ar: 'خدماتنا' })}</span><h2 class="title">${S({ en: 'Engineering excellence &amp; <em>turnkey MEP</em> solutions', ar: 'تميز هندسي <em>وحلول كهروميكانيكية</em> متكاملة' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'From procurement and design through execution, commissioning and long-term maintenance, every discipline is coordinated under one accountable team.', ar: 'من المشتريات والتصميم إلى التنفيذ والتشغيل والصيانة طويلة الأمد، ننسق جميع التخصصات تحت مسؤولية فريق واحد.' })}</p>
    </div>
    <div class="svc-grid">
      ${C.SERVICES.map((s, i) => `<article class="svc rv" style="--d:${(i % 3) * 0.08}s"><span class="svc-num">${pad(i + 1)}</span><h3>${esc(S(s.t))}</h3><p>${esc(S(s.d))}</p><i class="bar"></i></article>`).join('\n      ')}
    </div>
    <div class="value-row rv">
      <strong>${S({ en: 'Where we add value', ar: 'مجالات نضيف فيها قيمة' })}</strong>
      <ul class="chips">${C.SECTOR_CARDS.map(s => `<li class="chip">${S(s.t)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section id="mep-scope" class="section paper-2">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Scope of Work', ar: 'نطاق الأعمال' })}</span><h2 class="title">${S({ en: 'Integrated electromechanical systems to <em>world‑class standards</em>', ar: 'أنظمة كهروميكانيكية متكاملة <em>بمعايير عالمية</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'From core building services to connected controls and resilient power, our technical scope covers twelve disciplines.', ar: 'من خدمات المباني الأساسية إلى أنظمة التحكم المتصلة والطاقة الموثوقة، يغطي نطاقنا الفني اثني عشر تخصصاً.' })}</p>
    </div>
    <div class="scope-grid rv">
      ${C.SCOPE.map((s, i) => `<article class="scope"><span class="n">${pad(i + 1)}</span><h3>${esc(S(s.t))}</h3><p>${esc(S(s.d))}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="homeportfolio" class="section dark">
  <div class="wrap">
    <div class="head-row">
      <div class="rv">
        <span class="eyebrow">${S({ en: 'Project Portfolio', ar: 'سجل المشاريع' })}</span>
        <h2 class="title">${S({ en: 'Selected work <em>across three countries</em>', ar: 'أعمال مختارة <em>في ثلاث دول</em>' })}</h2>
        <p class="lead">${S({ en: 'Healthcare, hospitality, industrial, commercial and residential projects across Saudi Arabia, Egypt and Kenya. Open any project for photos and full details.', ar: 'مشاريع في قطاعات الرعاية الصحية والضيافة والصناعة والتجارة والسكن في السعودية ومصر وكينيا. افتح أي مشروع لمشاهدة الصور والتفاصيل الكاملة.' })}</p>
      </div>
      <div class="filters rv" role="group" aria-label="${S({ en: 'Filter projects by country', ar: 'تصفية المشاريع حسب الدولة' })}" style="--d:.1s">
        <button class="filter" type="button" aria-pressed="true" data-filter="all">${S({ en: 'All', ar: 'الكل' })}<sup>${counts.all}</sup></button>
        ${['sa', 'eg', 'ke'].map(c => `<button class="filter" type="button" aria-pressed="false" data-filter="${c}">${S(C.COUNTRIES[c])}<sup>${counts[c]}</sup></button>`).join('\n        ')}
      </div>
    </div>
    <div class="proj-grid" id="proj-grid">
      ${C.PROJECTS.map((p, i) => card(p, i, lang, root)).join('\n      ')}
    </div>
    <p class="note">${S({ en: 'Project values are shown as reported in company records.', ar: 'تُعرض قيم المشاريع كما وردت في سجلات الشركة.' })}</p>
  </div>
</section>

<section id="project-references" class="section">
  <div class="wrap ref-grid">
    <aside class="ref-aside rv">
      <span class="eyebrow">${S({ en: 'Experience Across Sectors', ar: 'خبرات عبر القطاعات' })}</span>
      <h2 class="title">${S({ en: 'Project &amp; consultant <em>reference directory</em>', ar: 'دليل مراجع <em>المشاريع والاستشاريين</em>' })}</h2>
      <p class="lead">${S({ en: 'A selection of project and consultant references, grouped by sector. Some entries appear in more than one category.', ar: 'مجموعة من مراجع المشاريع والاستشاريين مصنفة حسب القطاع، وقد يتكرر بعضها في أكثر من فئة.' })}</p>
      <div class="ref-total"><b data-count="${refTotal}">${refTotal}</b><span>${S({ en: `references across ${C.REFERENCES.length === 9 ? 'nine' : C.REFERENCES.length} categories`, ar: 'مرجعاً في تسع فئات' })}</span></div>
    </aside>
    <div class="acc rv" style="--d:.1s">
      ${C.REFERENCES.map((g, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(S(g.t))} <span class="count">${lang === 'ar' ? arCount(g.items.length) : `${g.items.length} references`}</span><i class="pm"></i></summary><ul>${g.items.map(it => `<li>${esc(lang === 'ar' ? it[1] : it[0])}</li>`).join('')}</ul></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="why" class="section dark">
  <div class="wrap why-grid">
    <div class="rv">
      <span class="eyebrow">${S({ en: 'Why Barakat Arabia', ar: 'لماذا البركات العربية' })}</span>
      <h2 class="title">${S({ en: 'Built on experience. <em>Trusted to deliver.</em>', ar: 'خبرة راسخة. <em>وتنفيذ موثوق.</em>' })}</h2>
      <ol class="why-list">${C.WHY.map(w => `<li>${S(w)}</li>`).join('')}</ol>
    </div>
    <div class="presence rv" style="--d:.12s">
      <h3>${S({ en: 'A vision <em>without borders</em>', ar: 'رؤية <em>بلا حدود</em>' })}</h3>
      <p>${S({ en: 'Our journey began in Egypt and flourished in Saudi Arabia. Today we bridge distances with engineering excellence, delivering world-class solutions wherever our clients build.', ar: 'بدأت رحلتنا في مصر وازدهرت في المملكة العربية السعودية، واليوم نختصر المسافات بالتميز الهندسي لنقدم حلولاً عالمية المستوى أينما يبني عملاؤنا.' })}</p>
      <div class="hubs">${C.HUBS.map(hb => `<div class="hub"><div><i class="pin"></i><b>${S(hb.t)}</b></div><span>${S(hb.d)}</span></div>`).join('')}</div>
    </div>
  </div>
</section>

<section id="organization" class="section white">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Organization &amp; Delivery', ar: 'الهيكل التنظيمي والتنفيذ' })}</span><h2 class="title">${S({ en: 'Technical teams supported <em>from office to site</em>', ar: 'فرق فنية مدعومة <em>من المكتب إلى الموقع</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'Leadership, engineering and site teams organized to keep every project coordinated from the first drawing to final handover.', ar: 'فرق قيادية وهندسية وميدانية منظمة للحفاظ على تنسيق كل مشروع من أول مخطط حتى التسليم النهائي.' })}</p>
    </div>
    <div class="org-grid">
      ${C.ORG.map((o, i) => `<article class="org rv" style="--d:${i * 0.08}s"><span class="n">${pad(i + 1)}</span><span class="ic">${icon(o.icon)}</span><h3>${esc(S(o.t))}</h3><p>${esc(S(o.d))}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="homegallery" class="section dark">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Inside the Work', ar: 'من قلب العمل' })}</span><h2 class="title">${S({ en: 'Worksites, systems <em>&amp; spaces</em>', ar: 'مواقع العمل <em>والأنظمة والمساحات</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'A closer look at the environments behind coordinated construction and technical delivery.', ar: 'نظرة أقرب إلى البيئات التي تنفذ فيها أعمال البناء والخدمات الفنية المتكاملة.' })}</p>
    </div>
    <div class="bento">
      ${(await Promise.all(C.GALLERY.map(async (g, i) => {
        const n = pad(i + 1), big = /w2|h2/.test(g.cls);
        const tag = await imgTag(root, `gallery-${n}`, S(g.alt), { widths: [600, 1000], sizes: big ? '(max-width: 680px) 92vw, 640px' : '(max-width: 680px) 46vw, 320px' });
        return `<a class="${g.cls ? g.cls + ' ' : ''}rv" href="assets/v2/img/gallery-${n}-1800.webp" data-lightbox="gallery" data-caption="${esc(S(g.alt))}">${tag}<span class="zoom">${icon('expand')}${S(T.view)}</span></a>`;
      }))).join('\n      ')}
    </div>
  </div>
</section>

<section id="quality" class="section">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Standards &amp; References', ar: 'المعايير والمراجع' })}</span><h2 class="title">${S({ en: 'Quality considered <em>at every stage</em>', ar: 'الجودة <em>في كل مرحلة</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'Our technical approach is guided by recognized international references, documented inspections and clear acceptance criteria.', ar: 'يسترشد نهجنا الفني بالمراجع الدولية المعترف بها، والفحوصات الموثقة، ومعايير القبول الواضحة.' })}</p>
    </div>
    <div class="q-grid rv">
      ${(await Promise.all(C.QUALITY.map(async (q, i) => `<div class="q">${await imgTag(root, `quality-${pad(i + 1)}`, q)}<span>${q}</span></div>`))).join('\n      ')}
    </div>
    <p class="note note-light">${S({ en: 'The logos above identify industry references; they do not represent a claim of company certification.', ar: 'تشير الشعارات أعلاه إلى مراجع القطاع، ولا تعني حصول الشركة على شهادات اعتماد.' })}</p>
  </div>
</section>

<section id="sectors" class="section sectors">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Sectors We Serve', ar: 'القطاعات التي نخدمها' })}</span><h2 class="title">${S({ en: 'Built around the needs <em>of each environment</em>', ar: 'حلول تلائم <em>احتياجات كل بيئة</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'Every sector brings different operational, safety and coordination priorities. Our delivery approach adapts to the space, its users and the way it must perform.', ar: 'لكل قطاع أولويات مختلفة في التشغيل والسلامة والتنسيق، ويتكيف نهجنا في التنفيذ مع طبيعة المكان ومستخدميه ومتطلبات أدائه.' })}</p>
    </div>
    <div class="sec-grid">
      ${C.SECTOR_CARDS.map((s, i) => `<article class="sec rv" style="--d:${(i % 3) * 0.08}s"><span class="n">${pad(i + 1)}</span><h3>${S(s.t)}</h3><p>${esc(S(s.d))}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section dark partners" aria-labelledby="partners-title">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Clients &amp; Partners', ar: 'العملاء والشركاء' })}</span><h2 class="title" id="partners-title">${S({ en: 'Trusted by names <em>that set the standard</em>', ar: 'ثقة أسماء <em>تصنع المعايير</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${S({ en: 'Proud of the trust of our clients and partners across hospitality, energy, banking, retail and industry.', ar: 'نفخر بثقة عملائنا وشركائنا في قطاعات الضيافة والطاقة والبنوك والتجزئة والصناعة.' })}</p>
    </div>
  </div>
  <div class="marquee" role="group" aria-label="${S({ en: 'Clients and partners', ar: 'العملاء والشركاء' })}">
    ${(await Promise.all(C.PARTNERS.map(async (row, r) => `<div class="mq-row${r ? ' rev' : ''}"><div class="mq-set">${(await Promise.all(row.map(async ([f, en, ar, dark]) => `<div class="logo-tile${dark ? ' on-dark' : ''}">${await imgTag(root, `partner-${f}`, lang === 'ar' ? ar : en)}</div>`))).join('')}</div></div>`))).join('\n    ')}
  </div>
</section>

<section id="homecontact" class="section contact">
  <div class="wrap contact-grid">
    <div>
      <div class="rv">
        <span class="eyebrow">${S({ en: 'Let’s Build What’s Next', ar: 'لنبنِ المستقبل معاً' })}</span>
        <h2 class="title">${S({ en: 'Bring your next project <em>into focus</em>', ar: 'لنحدد ملامح <em>مشروعك القادم</em>' })}</h2>
        <p class="lead">${S({ en: 'Share your scope, priorities and timeline. Our team will review the requirements and help define a practical route from planning to delivery.', ar: 'شاركنا نطاق مشروعك وأولوياتك وجدولك الزمني. سيراجع فريقنا المتطلبات ويساعدك على تحديد مسار عملي من التخطيط إلى التسليم.' })}</p>
      </div>
      <div class="c-list rv" style="--d:.1s">
        <a class="c-item" href="tel:${PHONE_TEL}"><span class="ic">${icon('phone')}</span><span><small>${S({ en: 'Call us', ar: 'اتصل بنا' })}</small><b class="ltr">${PHONE}</b></span></a>
        <a class="c-item" href="mailto:${EMAIL}"><span class="ic">${icon('mail')}</span><span><small>${S({ en: 'Email', ar: 'البريد الإلكتروني' })}</small><b>${EMAIL}</b></span></a>
        <a class="c-item" href="https://www.barakatarabia.com" target="_blank" rel="noopener"><span class="ic">${icon('globe')}</span><span><small>${S({ en: 'Website', ar: 'الموقع الإلكتروني' })}</small><b>www.barakatarabia.com</b></span></a>
      </div>
      <div class="principles rv" style="--d:.15s">
        ${[[{ en: 'Early Review', ar: 'المراجعة المبكرة' }, { en: 'Align technical requirements before they become site constraints.', ar: 'مواءمة المتطلبات الفنية قبل أن تتحول إلى تحديات في الموقع.' }], [{ en: 'Clear Coordination', ar: 'التنسيق الواضح' }, { en: 'Keep commercial, programme and engineering decisions connected.', ar: 'ربط القرارات التجارية والزمنية والهندسية ببعضها.' }], [{ en: 'Responsive Delivery', ar: 'الاستجابة أثناء التنفيذ' }, { en: 'Practical communication from first discussion through handover.', ar: 'تواصل عملي ومستمر من اللقاء الأول حتى التسليم.' }]].map(([a, b]) => `<div><strong>${S(a)}</strong><p>${S(b)}</p></div>`).join('\n        ')}
      </div>
    </div>
    <div class="form-card rv" style="--d:.1s">
      <h3>${S({ en: 'Start a <em>conversation</em>', ar: 'ابدأ <em>الحوار</em>' })}</h3>
      <p>${S({ en: 'Tell us what you are planning and what the project needs to achieve.', ar: 'أخبرنا بما تخطط له وما ترغب في تحقيقه من المشروع.' })}</p>
      <form id="contact-form" action="assets/mailer.php" method="POST" novalidate>
        <div class="fields">
          <div class="field"><input id="f-name" name="name" type="text" placeholder=" " autocomplete="name" required><label for="f-name">${S({ en: 'Full name', ar: 'الاسم الكامل' })}</label></div>
          <div class="field"><input id="f-email" name="email" type="email" placeholder=" " autocomplete="email" dir="ltr" required><label for="f-email">${S({ en: 'Email', ar: 'البريد الإلكتروني' })}</label></div>
          <div class="field full"><input id="f-phone" name="phone" type="tel" placeholder=" " autocomplete="tel" dir="ltr"><label for="f-phone">${S({ en: 'Phone (optional)', ar: 'رقم الهاتف (اختياري)' })}</label></div>
          <div class="field full"><textarea id="f-msg" name="message" placeholder=" " required></textarea><label for="f-msg">${S({ en: 'Tell us about your project', ar: 'أخبرنا عن مشروعك' })}</label></div>
        </div>
        <div class="form-foot">
          <small>${S({ en: 'We review every enquiry and reply promptly.', ar: 'نراجع كل استفسار ونرد عليه في أسرع وقت.' })}</small>
          <button type="submit" class="btn">${S({ en: 'Send Message', ar: 'إرسال الرسالة' })} <span class="ico">${icon('arrow')}</span></button>
        </div>
      </form>
      <p class="ajax-response" role="status" aria-live="polite"></p>
    </div>
  </div>
</section>
</main>`;
  h += footer(lang, { root, isHome: true, alternates });
  return h;
}

function card(p, i, lang, root) {
  const S = s => L(s, lang);
  const place = C.PLACES[p.place];
  return `<article class="proj rv" data-country="${place.country}" style="--d:${(i % 3) * 0.08}s">
        <div class="proj-media">${projImg(root, p, 0, S(p.title), '(max-width: 680px) 92vw, (max-width: 991px) 46vw, 410px')}<span class="tag${p.status === 'progress' ? ' live' : ''}">${S(C.STATUS[p.status])}</span><span class="loc">${icon('pin')}${S(place)}</span></div>
        <div class="proj-body"><span class="idx">${pad(i + 1)}</span><h3><a href="${root}${projUrl(p, lang)}">${esc(S(p.title))}</a></h3>
          <dl><dt>${S({ en: 'Scope', ar: 'النطاق' })}</dt><dd>${p.tags.map(t => esc(S(C.TAGS[t]))).join(' · ')}</dd><dt>${S({ en: 'Year', ar: 'السنة' })}</dt><dd>${p.year}</dd>${p.value ? `<dt>${S({ en: 'Reported value', ar: 'القيمة' })}</dt><dd>${S(p.value)}</dd>` : ''}</dl>
          <span class="more">${S({ en: 'View project', ar: 'عرض المشروع' })} ${icon('arrow')}</span>
        </div>
      </article>`;
}

/* ---------------- Project page ---------------- */
function projectPage(p, idx, lang) {
  const root = '../';
  const S = s => L(s, lang);
  const place = C.PLACES[p.place];
  const alternates = { en: projUrl(p, 'en'), ar: projUrl(p, 'ar') };
  const t = S(p.title);
  const tagsText = p.tags.map(k => S(C.TAGS[k]));
  const title = lang === 'ar' ? `${t} – ${tagsText.join('، ')} | البركات العربية` : `${t} – ${tagsText.join(', ')} | Barakat Arabia`;
  const scopeWords = joinList(p.tags.map(k => S(SCOPE_WORD[k])), lang);
  const city = S(place);
  const second = lang === 'ar'
    ? (p.status === 'done'
      ? `يُعد ${t} أحد ${S(SECTOR_PHRASE[p.sector])} لشركة البركات العربية في ${city}. نفذت فرقنا الهندسية والميدانية نطاق ${scopeWords} بدءاً من الاعتمادات والمخططات التنفيذية وحتى التركيب والاختبار والتشغيل، واكتمل المشروع عام ${p.year}.`
      : `يُعد ${t} أحد ${S(SECTOR_PHRASE[p.sector])} لشركة البركات العربية في ${city}. تعمل فرقنا الهندسية والميدانية على تنفيذ نطاق ${scopeWords}، بما يشمل الاعتمادات والمخططات التنفيذية والتركيب والتنسيق مع فريق المشروع.`)
    : (p.status === 'done'
      ? `${t} is one of Barakat Arabia’s ${S(SECTOR_PHRASE[p.sector])} in ${city}. Our engineering and site teams delivered the ${scopeWords} scope — from submittals and shop drawings through installation, testing and commissioning — with the project completed in ${p.year}.`
      : `${t} is one of Barakat Arabia’s ${S(SECTOR_PHRASE[p.sector])} in ${city}. Our engineering and site teams are delivering the ${scopeWords} scope, covering submittals, shop drawings, installation and coordination with the wider project team.`);
  const desc = `${S(p.overview)} ${lang === 'ar' ? `${S(C.STATUS[p.status])} – ${p.year}.` : `${S(C.STATUS[p.status])}, ${p.year}.`}`.slice(0, 300);

  const others = C.PROJECTS.filter(x => x !== p);
  const related = others.filter(x => x.sector === p.sector)
    .concat(others.filter(x => x.sector !== p.sector && C.PLACES[x.place].country === place.country))
    .concat(others).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const prev = C.PROJECTS[(idx - 1 + C.PROJECTS.length) % C.PROJECTS.length];
  const next = C.PROJECTS[(idx + 1) % C.PROJECTS.length];

  const url = projUrl(p, lang);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${BASE}${url}#webpage`, url: `${BASE}${url}`, name: title, description: desc, inLanguage: lang, isPartOf: { '@type': 'WebSite', '@id': `${BASE}#website`, url: BASE, name: 'Barakat Arabia' },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE}assets/v2/projects/${largest(p, 0).file}`, width: largest(p, 0).w, height: largest(p, 0).h },
        about: { '@type': 'Place', name: t, address: { '@type': 'PostalAddress', addressLocality: city.split(/[،,]/)[0], addressCountry: place.country.toUpperCase() } },
        publisher: orgLd(lang) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: S(T.home), item: `${BASE}${HOME[lang]}` },
        { '@type': 'ListItem', position: 2, name: S(T.projects), item: `${BASE}${HOME[lang]}#homeportfolio` },
        { '@type': 'ListItem', position: 3, name: t, item: `${BASE}${url}` },
      ] },
    ],
  };

  let h = head(lang, {
    root, url, alternates, title, desc, jsonld, ogType: 'article', ogTitle: `${t} | ${S(T.brand)}`, ogAlt: t,
    ogImage: `assets/v2/projects/${p.slug}-og.jpg`,
    preload: `<link rel="preload" as="image" href="${root}assets/v2/projects/${p.images[0][0].file}" imagesrcset="${p.images[0].map(x => `${root}assets/v2/projects/${x.file} ${x.w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">\n`,
  });
  h += header(lang, { root, isHome: false, alternates });
  const facts = [
    [{ en: 'Location', ar: 'الموقع' }, S(place)],
    [{ en: 'Year', ar: 'السنة' }, p.year],
    [{ en: 'Status', ar: 'الحالة' }, S(C.STATUS[p.status])],
    [{ en: 'Sector', ar: 'القطاع' }, S(SECTOR_LABEL[p.sector])],
    p.client && [{ en: 'Client / Partner', ar: 'العميل / الشريك' }, esc(S(p.client))],
    p.value && [{ en: 'Reported value', ar: 'القيمة' }, S(p.value)],
  ].filter(Boolean);

  h += `
<main id="main">
<section class="p-hero hero">
  <div class="hero-media">${projImg(root, p, 0, t, '100vw', { lazy: false, priority: true })}</div>
  <div class="wrap">
    <nav class="crumbs" aria-label="${S({ en: 'Breadcrumb', ar: 'مسار التنقل' })}" data-in="1"><a href="${root}${HOME[lang]}">${S(T.home)}</a><span class="sep">/</span><a href="${root}${HOME[lang]}#homeportfolio">${S(T.projects)}</a><span class="sep">/</span><span aria-current="page">${esc(t)}</span></nav>
    <h1 data-in="2">${esc(t)}</h1>
    <div class="p-tags" data-in="3"><span class="chip status">${S(C.STATUS[p.status])}</span><span class="chip">${icon('pin')} ${S(place)}</span><span class="chip">${p.year}</span>${tagsText.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap p-body">
    <div class="p-overview rv">
      <span class="eyebrow">${S({ en: 'Project overview', ar: 'نظرة عامة على المشروع' })}</span>
      <p class="lead" style="margin-top:22px">${esc(S(p.overview))}</p>
      <p class="lead">${esc(second)}</p>
      ${p.features ? `<p class="lead"><strong>${S({ en: 'Development features:', ar: 'مزايا المشروع:' })}</strong> ${esc(S(p.features))}</p>` : ''}
      <div class="p-scope">
        <h2>${S({ en: 'Scope of works', ar: 'نطاق الأعمال' })}</h2>
        <ul>${tagsText.map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      </div>
    </div>
    <aside class="p-facts rv" style="--d:.1s">
      <h2>${S({ en: 'Project details', ar: 'تفاصيل المشروع' })}</h2>
      <dl>${facts.map(([k, v]) => `<div><dt>${S(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>
      ${btn(`${root}${HOME[lang]}#homecontact`, S({ en: 'Discuss a similar project', ar: 'ناقش مشروعاً مماثلاً' }))}
    </aside>
  </div>
</section>

<section class="section dark" aria-labelledby="gallery-title">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'Project gallery', ar: 'معرض صور المشروع' })}</span><h2 class="title" id="gallery-title">${S({ en: 'On site at <em>' + esc(t) + '</em>', ar: 'من موقع <em>' + esc(t) + '</em>' })}</h2></div>
      <p class="lead rv" style="--d:.1s">${lang === 'ar' ? `${p.images.length} ${p.images.length > 2 && p.images.length < 11 ? 'صور' : 'صورة'} من المشروع. اضغط على أي صورة لعرضها بالحجم الكامل.` : `${p.images.length} photo${p.images.length > 1 ? 's' : ''} from the project. Select any image to view it full size.`}</p>
    </div>
    <div class="p-gallery count-${Math.min(p.images.length, 5)}">
      ${p.images.map((v, k) => {
        const alt = `${t} — ${S({ en: 'photo', ar: 'صورة' })} ${k + 1}`;
        return `<a class="rv" href="${root}assets/v2/projects/${largest(p, k).file}" data-lightbox="project" data-caption="${esc(alt)}">${projImg(root, p, k, alt, k === 0 ? '(max-width: 991px) 92vw, 860px' : '(max-width: 991px) 46vw, 430px')}<span class="zoom">${icon('expand')}</span></a>`;
      }).join('\n      ')}
    </div>
  </div>
</section>

<section class="section related">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${S({ en: 'More projects', ar: 'مشاريع أخرى' })}</span><h2 class="title">${S({ en: 'Related <em>projects</em>', ar: 'مشاريع <em>ذات صلة</em>' })}</h2></div>
      <div class="rv" style="--d:.1s"><a class="link-arrow" href="${root}${HOME[lang]}#homeportfolio">${S({ en: 'View all projects', ar: 'عرض كل المشاريع' })} ${icon('arrow')}</a></div>
    </div>
    <div class="proj-grid">
      ${related.map(r => card(r, C.PROJECTS.indexOf(r), lang, root)).join('\n      ')}
    </div>
    <nav class="p-nav rv" style="margin-top:48px" aria-label="${S({ en: 'Project navigation', ar: 'التنقل بين المشاريع' })}">
      <a class="prev" href="${root}${projUrl(prev, lang)}"><small>${icon('arrow', 'flip-back')} ${S({ en: 'Previous project', ar: 'المشروع السابق' })}</small><b>${esc(S(prev.title))}</b></a>
      <a class="next" href="${root}${projUrl(next, lang)}"><small>${S({ en: 'Next project', ar: 'المشروع التالي' })} ${icon('arrow', 'flip')}</small><b>${esc(S(next.title))}</b></a>
    </nav>
  </div>
</section>
</main>`;
  h += footer(lang, { root, isHome: false, alternates });
  return h;
}

/* ---------------- SEO files ---------------- */
function sitemap() {
  const alt = (en, ar) => `\n    <xhtml:link rel="alternate" hreflang="en" href="${BASE}${en}"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="${BASE}${ar}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${en}"/>`;
  const entry = (loc, en, ar, prio, images = []) => `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${prio}</priority>${alt(en, ar)}${images.map(i => `\n    <image:image><image:loc>${BASE}${i}</image:loc></image:image>`).join('')}\n  </url>`;
  const out = [];
  out.push(entry(HOME.en, HOME.en, HOME.ar, '1.0', ['assets/v2/img/hero-1400.webp']));
  out.push(entry(HOME.ar, HOME.en, HOME.ar, '1.0', ['assets/v2/img/hero-1400.webp']));
  for (const p of C.PROJECTS) {
    const imgs = p.images.map((v, k) => `assets/v2/projects/${largest(p, k).file}`);
    out.push(entry(projUrl(p, 'en'), projUrl(p, 'en'), projUrl(p, 'ar'), '0.8', imgs));
    out.push(entry(projUrl(p, 'ar'), projUrl(p, 'en'), projUrl(p, 'ar'), '0.8', imgs));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${out.join('\n')}\n</urlset>\n`;
}

const ROBOTS = `User-agent: *
Allow: /
Disallow: /scripts/
Disallow: /.profile-review/

Sitemap: ${BASE}sitemap.xml
`;

const HTACCESS = `# Barakat Arabia — performance, security and canonical-domain rules
# If the site ever shows a server error right after uploading this file, delete it and let us know.

<IfModule mod_rewrite.c>
  RewriteEngine On

  # One canonical address: https://barakatarabia.com (no www, always HTTPS)
  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https
  RewriteCond %{SERVER_PORT} !=443
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Keep internal working folders private
  RewriteRule ^(\\.git|\\.profile-review|scripts)(/|$) - [F,L]
</IfModule>

# Correct types for modern assets
<IfModule mod_mime.c>
  AddType image/webp .webp
  AddType image/svg+xml .svg
  AddType font/woff2 .woff2
  AddType application/manifest+json .webmanifest
</IfModule>

# Compression
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 7 days"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/xml "access plus 1 hour"
  ExpiresByType application/xml "access plus 1 hour"
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  # Files in /assets/v2/ are versioned, so browsers may keep them for a year
  <If "%{REQUEST_URI} =~ m#^/assets/v2/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Strict-Transport-Security "max-age=31536000" env=HTTPS
</IfModule>
`;

/* ---------------- Build ---------------- */
(async () => {
  await buildProjectImages();
  fs.mkdirSync(path.join(DIST, 'projects'), { recursive: true });
  for (const lang of ['en', 'ar']) {
    fs.writeFileSync(path.join(DIST, HOME[lang]), await homePage(lang));
    C.PROJECTS.forEach((p, i) => fs.writeFileSync(path.join(DIST, projUrl(p, lang)), projectPage(p, i, lang)));
  }
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap());
  fs.writeFileSync(path.join(DIST, 'robots.txt'), ROBOTS);
  fs.writeFileSync(path.join(DIST, '.htaccess'), HTACCESS);
  console.log('built', 2 + C.PROJECTS.length * 2, 'pages');
})().catch(e => { console.error(e); process.exit(1); });
