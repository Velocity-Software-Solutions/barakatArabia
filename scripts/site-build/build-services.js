// Builds the bilingual service landing pages (services/*.html), their share images and sitemap.xml.
// Styles, icons and page behaviour are taken from a live project page so the design stays in sync.
//
//   node scripts/site-build/build-services.js            pages + sitemap
//   node scripts/site-build/build-services.js --og       also (re)generate share images (needs sharp)
//
// Set SITE_ROOT to build against a copy of the site instead of this checkout.

const fs = require('fs');
const path = require('path');
const { PROJECTS, TAGS, PLACES, STATUS } = require('./content');
const { HUB, SERVICES } = require('./services-content');

const ROOT = process.env.SITE_ROOT ? path.resolve(process.env.SITE_ROOT) : path.resolve(__dirname, '../..');
const SITE = 'https://barakatarabia.com';
const TEMPLATE = { en: 'projects/hilton-garden-inn-new-cairo.html', ar: 'projects/hilton-garden-inn-new-cairo-ar.html' };
const PHONE = '+966544126721';
const PHONE_TXT = '+966 54 412 6721';
const EMAIL = 'info@barakatarabia.com';
const TODAY = new Date().toISOString().slice(0, 10);

const L = {
  en: {
    dir: 'ltr', locale: 'en_SA', altLocale: 'ar_SA', brand: 'Barakat Arabia', skip: 'Skip to content',
    home: 'Home', about: 'About', services: 'Services', projects: 'Projects', contact: 'Contact',
    discuss: 'Discuss a Project', openMenu: 'Open menu', primary: 'Primary', mobile: 'Mobile', crumbs: 'Breadcrumb',
    langName: 'العربية', langCode: 'ar',
    overview: 'Service overview', glance: 'At a glance', proposal: 'Request a proposal',
    how: 'How we deliver', howTitle: 'From drawings <em>to handover</em>',
    howLead: 'One accountable team manages design, procurement, installation and commissioning — so every system is coordinated on site.',
    svcEy: 'Our services', svcTitle: 'Every system, <em>one contractor</em>',
    svcLead: 'Explore each MEP service in detail, or talk to us about the complete package.',
    moreEy: 'More services', moreTitle: 'Explore our <em>MEP services</em>',
    moreLead: 'Most projects combine several systems — we deliver them together.',
    learn: 'Learn more',
    hubCard: 'The complete MEP package, from procurement and design to facility management.',
    faqEy: 'FAQ', faqTitle: 'Questions, <em>answered</em>',
    faqLead: `Can’t find what you need? Call <a class="ltr" href="tel:${PHONE}">${PHONE_TXT}</a> or <a href="https://wa.me/966544126721" target="_blank" rel="noopener">message us on WhatsApp</a>.`,
    relEy: 'Project experience', relTitle: 'Selected <em>projects</em>', viewAll: 'View all projects',
    scope: 'Scope', year: 'Year', value: 'Reported value', viewProject: 'View project',
    ctaTitle: 'Built with purpose. <em>Ready when you are.</em>', ctaBtn: 'Start a Project',
    footDesc: 'Barakat Arabia combines contracting discipline with coordinated technical delivery for construction and MEP-led projects across Saudi Arabia and the region.',
    company: 'Company', whyUs: 'Why Barakat Arabia', org: 'Organization', standards: 'Standards', featured: 'Featured projects',
    rights: 'Barakat Arabia General Contracting. All rights reserved.', credit: 'Designed by',
  },
  ar: {
    dir: 'rtl', locale: 'ar_SA', altLocale: 'en_SA', brand: 'البركات العربية', skip: 'تخطي إلى المحتوى',
    home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا', projects: 'المشاريع', contact: 'تواصل معنا',
    discuss: 'ناقش مشروعك', openMenu: 'فتح القائمة', primary: 'القائمة الرئيسية', mobile: 'قائمة الجوال', crumbs: 'مسار التنقل',
    langName: 'English', langCode: 'en',
    overview: 'نظرة عامة على الخدمة', glance: 'لمحة سريعة', proposal: 'اطلب عرض سعر',
    how: 'آلية التنفيذ', howTitle: 'من المخططات <em>حتى التسليم</em>',
    howLead: 'فريق واحد مسؤول يدير التصميم والتوريد والتركيب والتشغيل التجريبي، لتكون جميع الأنظمة منسقة في الموقع.',
    svcEy: 'خدماتنا', svcTitle: 'كل الأنظمة، <em>مقاول واحد</em>',
    svcLead: 'تعرّف على كل خدمة من خدماتنا الكهروميكانيكية بالتفصيل، أو تواصل معنا بشأن الحزمة الكاملة.',
    moreEy: 'خدمات أخرى', moreTitle: 'اكتشف <em>خدماتنا الكهروميكانيكية</em>',
    moreLead: 'تجمع معظم المشاريع بين عدة أنظمة، ونحن ننفذها معاً.',
    learn: 'اعرف المزيد',
    hubCard: 'حزمة الأعمال الكهروميكانيكية الكاملة، من المشتريات والتصميم إلى إدارة المرافق.',
    faqEy: 'الأسئلة الشائعة', faqTitle: 'أسئلة <em>وإجابات</em>',
    faqLead: `لم تجد ما تبحث عنه؟ اتصل بنا على <a class="ltr" href="tel:${PHONE}">${PHONE_TXT}</a> أو <a href="https://wa.me/966544126721" target="_blank" rel="noopener">راسلنا عبر واتساب</a>.`,
    relEy: 'خبراتنا في المشاريع', relTitle: 'مشاريع <em>مختارة</em>', viewAll: 'عرض كل المشاريع',
    scope: 'النطاق', year: 'السنة', value: 'القيمة', viewProject: 'عرض المشروع',
    ctaTitle: 'نبني بهدف. <em>وجاهزون متى شئت.</em>', ctaBtn: 'ابدأ مشروعك',
    footDesc: 'تجمع البركات العربية بين الانضباط في المقاولات والتنسيق الفني لتنفيذ مشاريع البناء والأعمال الكهروميكانيكية في المملكة العربية السعودية والمنطقة.',
    company: 'الشركة', whyUs: 'لماذا البركات العربية', org: 'الهيكل التنظيمي', standards: 'المعايير', featured: 'مشاريع مميزة',
    rights: 'البركات العربية للمقاولات العامة. جميع الحقوق محفوظة.', credit: 'تصميم وتطوير',
  },
};

const EXTRA_CSS = `
.svc-grid.four{grid-template-columns:repeat(4,1fr)}
.svc h3{margin-top:36px}
a.sec{color:inherit}
a.sec h3{transition:color .3s}
a.sec:hover h3{color:var(--red)}
.sec .go{grid-column:2;margin-top:12px;display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:.88rem;color:var(--red)}
.sec .go .i{width:16px;height:16px}
[dir="rtl"] .sec .go .i{transform:scaleX(-1)}
.acc summary{grid-template-columns:1fr auto}
.acc details>p{padding:0 4px 28px;color:var(--muted);line-height:1.8;max-width:72ch}
.ref-aside .lead a{color:var(--red);font-weight:700}
.p-scope li a{transition:color .25s}
.p-scope li a:hover{color:var(--red)}
.p-hero .lead{margin-top:22px}
.proj{color:#fff}
@media (max-width:1180px){.svc-grid.four{grid-template-columns:repeat(2,1fr)}}
@media (max-width:680px){.svc-grid.four{grid-template-columns:1fr}}
`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));
const icon = id => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;

const svcFile = (slug, lang) => `${slug}${lang === 'ar' ? '-ar' : ''}.html`;
const svcUrl = (slug, lang) => `${SITE}/services/${svcFile(slug, lang)}`;
const homeHref = lang => (lang === 'ar' ? '../index-ar.html' : '../');
const homeUrl = lang => (lang === 'ar' ? `${SITE}/index-ar.html` : `${SITE}/`);
const anchor = (lang, id) => `${homeHref(lang)}#${id}`;
const projHref = (slug, lang) => `../projects/${slug}${lang === 'ar' ? '-ar' : ''}.html`;

// ---- pieces shared with the project pages -------------------------------------------------
function templateParts(lang) {
  const html = read(TEMPLATE[lang]);
  const grab = (re, what) => { const m = html.match(re); if (!m) throw new Error(`Template ${TEMPLATE[lang]}: ${what} not found`); return m[0]; };
  const fonts = (html.match(/<link rel="preload" as="font"[^>]*>/g) || []).join('\n');
  const style = grab(/<style>[\s\S]*?<\/style>/, 'style block').replace(/<\/style>$/, `${EXTRA_CSS}</style>`);
  let sprite = grab(/<svg width="0" height="0"[\s\S]*?<\/svg>/, 'icon sprite');
  const tail = grab(/<button class="to-top"[\s\S]*<\/html>/, 'page tail');
  // Add the system icons used on the homepage that project pages don't carry
  const home = read('index.html');
  const extra = ['fan', 'flame', 'bolt', 'drop', 'chip', 'shield', 'solar', 'battery', 'wrench', 'gear']
    .filter(id => !sprite.includes(`id="i-${id}"`))
    .map(id => {
      const m = home.match(new RegExp(`<symbol id="i-${id}"[\\s\\S]*?</symbol>`));
      if (!m) throw new Error(`Icon i-${id} not found in index.html`);
      return m[0].replace(/\s*\n\s*/g, ' ').replace(/\s+\/>/g, '/>').replace(/>\s+</g, '><');
    });
  sprite = sprite.replace(/<\/svg>$/, `${extra.join('\n')}\n</svg>`);
  return { fonts, style, sprite, tail };
}

function imgSet(img) {
  const files = img.widths.map(w => `../assets/v2/${img.base}-${w}.webp`);
  return {
    src: files[0],
    srcset: files.map((f, i) => `${f} ${img.widths[i]}w`).join(', '),
    large: `${SITE}/assets/v2/${img.base}-${img.widths[img.widths.length - 1]}.webp`,
  };
}

const ORG_NODE = {
  '@type': 'GeneralContractor', '@id': `${SITE}/#organization`, name: 'Barakat Arabia',
  alternateName: ['البركات العربية', 'Barakat Arabia General Contracting', 'البركات العربية للمقاولات العامة'],
  url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/assets/v2/img/icon-512.png`, width: 512, height: 512 },
  image: `${SITE}/assets/v2/img/og-image.jpg`, email: EMAIL, telephone: PHONE,
  address: { '@type': 'PostalAddress', addressCountry: 'SA' },
  areaServed: [{ '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'Egypt' }, { '@type': 'Country', name: 'Kenya' }],
  contactPoint: { '@type': 'ContactPoint', telephone: PHONE, email: EMAIL, contactType: 'sales', availableLanguage: ['English', 'Arabic'], areaServed: 'SA' },
};

// ---- page sections -------------------------------------------------------------------------
function header(s, lang, t) {
  const other = svcFile(s.slug, t.langCode);
  const cur = s.hub ? ' class="active" aria-current="page"' : '';
  const links = [[anchor(lang, 'about'), t.about, ''], [svcFile(HUB, lang), t.services, cur], [anchor(lang, 'projects'), t.projects, ''], [anchor(lang, 'contact'), t.contact, '']];
  return `<header class="header" id="header">
  <div class="wrap header-inner">
    <a class="logo" href="${homeHref(lang)}" aria-label="${t.brand}"><img src="../assets/v2/img/logo-light-320.webp" srcset="../assets/v2/img/logo-light-320.webp 320w, ../assets/v2/img/logo-light-480.webp 480w" sizes="144px" width="144" height="48" alt="${t.brand}"></a>
    <nav class="nav" aria-label="${t.primary}">
${links.map(([h, n, a]) => `      <a href="${h}"${a}>${n}</a>`).join('\n')}
    </nav>
    <div class="header-actions">
      <a class="lang" href="${other}" hreflang="${t.langCode}" lang="${t.langCode}"${t.langCode === 'ar' ? ' dir="rtl"' : ''}>${t.langName}</a>
      <a class="btn" href="${anchor(lang, 'contact')}">${t.discuss} <span class="ico">${icon('arrow')}</span></a>
      <button class="burger" id="burger" aria-label="${t.openMenu}" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="${t.mobile}">
${links.map(([h, n], i) => `    <a href="${h}"><small>${pad(i + 1)}</small>${n}</a>`).join('\n')}
  </nav>
  <div class="mm-foot">
    <a href="tel:${PHONE}" class="ltr">${PHONE_TXT}</a>
    <a href="mailto:${EMAIL}">${EMAIL}</a>
    <a href="${other}" hreflang="${t.langCode}" lang="${t.langCode}">${t.langName}</a>
  </div>
</div>`;
}

function hero(s, lang, t) {
  const im = imgSet(s.img);
  const crumbTail = s.hub
    ? `<span aria-current="page">${t.services}</span>`
    : `<a href="${svcFile(HUB, lang)}">${t.services}</a><span class="sep">/</span><span aria-current="page">${esc(s.name[lang])}</span>`;
  return `<section class="p-hero hero">
  <div class="hero-media"><img src="${im.src}" srcset="${im.srcset}" sizes="100vw" width="1000" height="700" alt="${esc(s.imgAlt[lang])}" fetchpriority="high"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="${t.crumbs}" data-in="1"><a href="${homeHref(lang)}">${t.home}</a><span class="sep">/</span>${crumbTail}</nav>
    <h1 data-in="2">${s.h1[lang]}</h1>
    <p class="lead" data-in="3">${esc(s.lead[lang])}</p>
    <div class="p-tags" data-in="4">${s.chips.map((c, i) => `<span class="chip${i === 0 && s.hub ? ' status' : ''}">${esc(c[lang])}</span>`).join('')}</div>
  </div>
</section>`;
}

function overview(s, lang, t) {
  const systems = SERVICES.filter(x => !x.hub);
  const items = s.scope.map((it, i) => {
    const label = esc(it[lang]);
    return `<li>${icon('check')}${s.hub ? `<a href="${svcFile(systems[i].slug, lang)}">${label}</a>` : label}</li>`;
  }).join('');
  return `<section class="section">
  <div class="wrap p-body">
    <div class="p-overview rv">
      <span class="eyebrow">${t.overview}</span>
      <p class="lead" style="margin-top:22px">${esc(s.overview[0][lang])}</p>
      <p class="lead">${esc(s.overview[1][lang])}</p>
      <div class="p-scope">
        <h2>${esc(s.scopeTitle[lang])}</h2>
        <ul>${items}</ul>
      </div>
    </div>
    <aside class="p-facts rv" style="--d:.1s">
      <h2>${t.glance}</h2>
      <dl>${s.facts.map(([k, v]) => `<div><dt>${esc(k[lang])}</dt><dd>${esc(v[lang])}</dd></div>`).join('')}</dl>
      <a class="btn" href="${anchor(lang, 'contact')}">${t.proposal} <span class="ico">${icon('arrow')}</span></a>
    </aside>
  </div>
</section>`;
}

function steps(s, lang, t) {
  const title = s.processTitle ? s.processTitle[lang] : t.howTitle;
  const lead = s.processLead ? esc(s.processLead[lang]) : t.howLead;
  const four = s.process.length === 4 ? ' four' : '';
  return `<section class="section dark services" aria-labelledby="how-title">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${t.how}</span><h2 class="title" id="how-title">${title}</h2></div>
      <p class="lead rv" style="--d:.1s">${lead}</p>
    </div>
    <div class="svc-grid${four}">
${s.process.map((p, i) => `      <article class="svc rv" style="--d:${((i % 4) * 0.08).toFixed(2)}s"><span class="svc-num">${pad(i + 1)}</span><h3>${esc(p.t[lang])}</h3><p>${esc(p.d[lang])}</p><span class="bar"></span></article>`).join('\n')}
    </div>
  </div>
</section>`;
}

function serviceCards(s, lang, t) {
  const hub = SERVICES.find(x => x.hub);
  const list = s.hub ? SERVICES.filter(x => !x.hub) : [...SERVICES.filter(x => !x.hub && x.slug !== s.slug), hub];
  const card = (x, i) => `      <a class="sec rv" href="${svcFile(x.slug, lang)}" style="--d:${((i % 3) * 0.08).toFixed(2)}s"><span class="n">${pad(i + 1)}</span><h3>${esc(x.name[lang])}</h3><p>${x.hub ? t.hubCard : esc(x.card[lang])}</p><span class="go">${t.learn} ${icon('arrow')}</span></a>`;
  return `<section class="section sectors" aria-labelledby="svc-title">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${s.hub ? t.svcEy : t.moreEy}</span><h2 class="title" id="svc-title">${s.hub ? t.svcTitle : t.moreTitle}</h2></div>
      <p class="lead rv" style="--d:.1s">${s.hub ? t.svcLead : t.moreLead}</p>
    </div>
    <div class="sec-grid">
${list.map(card).join('\n')}
    </div>
  </div>
</section>`;
}

function faq(s, lang, t) {
  return `<section class="section paper-2" aria-labelledby="faq-title">
  <div class="wrap ref-grid">
    <div class="ref-aside rv">
      <span class="eyebrow">${t.faqEy}</span>
      <h2 class="title" id="faq-title">${t.faqTitle}</h2>
      <p class="lead">${t.faqLead}</p>
    </div>
    <div class="acc rv" style="--d:.1s">
${s.faq.map((f, i) => `      <details${i === 0 ? ' open' : ''}><summary>${esc(f.q[lang])}<span class="pm" aria-hidden="true"></span></summary><p>${esc(f.a[lang])}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;
}

function related(s, lang, t) {
  const cards = s.related.map((slug, i) => {
    const idx = PROJECTS.findIndex(p => p.slug === slug);
    if (idx < 0) throw new Error(`${s.slug}: unknown related project ${slug}`);
    const p = PROJECTS[idx];
    const place = PLACES[p.place];
    const widths = [600, 1100, 1800].filter(w => exists(`assets/v2/projects/${p.slug}-1-${w}.webp`));
    const srcset = widths.map(w => `../assets/v2/projects/${p.slug}-1-${w}.webp ${w}w`).join(', ');
    const live = p.status === 'progress' ? ' live' : '';
    const value = p.value ? `<dt>${t.value}</dt><dd>${esc(p.value[lang])}</dd>` : '';
    return `      <article class="proj rv" data-country="${place.country}" style="--d:${(i * 0.08).toFixed(2)}s">
        <div class="proj-media"><img src="../assets/v2/projects/${p.slug}-1-600.webp" srcset="${srcset}" sizes="(max-width: 680px) 92vw, (max-width: 991px) 46vw, 410px" width="600" height="600" alt="${esc(p.title[lang])}" loading="lazy" decoding="async"><span class="tag${live}">${STATUS[p.status][lang]}</span><span class="loc">${icon('pin')}${esc(place[lang])}</span></div>
        <div class="proj-body"><span class="idx">${pad(idx + 1)}</span><h3><a href="${projHref(p.slug, lang)}">${esc(p.title[lang])}</a></h3>
          <dl><dt>${t.scope}</dt><dd>${p.tags.map(k => esc(TAGS[k][lang])).join(' · ')}</dd><dt>${t.year}</dt><dd>${p.year}</dd>${value}</dl>
          <span class="more">${t.viewProject} ${icon('arrow')}</span>
        </div>
      </article>`;
  });
  return `<section class="section related">
  <div class="wrap">
    <div class="head-row">
      <div class="rv"><span class="eyebrow">${t.relEy}</span><h2 class="title">${t.relTitle}</h2></div>
      <div class="rv" style="--d:.1s"><a class="link-arrow" href="${anchor(lang, 'projects')}">${t.viewAll} ${icon('arrow')}</a></div>
    </div>
    <div class="proj-grid">
${cards.join('\n')}
    </div>
  </div>
</section>`;
}

// Footer "Services" column. prefix is the path from the page to services/.
function footerServiceLinks(lang, prefix) {
  return ['hvac-systems', 'firefighting-fire-alarm-systems', 'electrical-power-lighting', 'bms-automation-smart-metering', 'mep-facility-management', HUB]
    .map(slug => `<li><a href="${prefix}${svcFile(slug, lang)}">${esc(SERVICES.find(v => v.slug === slug).short[lang])}</a></li>`).join('');
}

function footer(s, lang, t) {
  const other = svcFile(s.slug, t.langCode);
  const company = [['about', t.about], ['why-title', t.whyUs], ['org-title', t.org], ['clients-title', t.standards], ['contact', t.contact]];
  const featured = ['misk-city-mobility-hub', 'dental-center-king-saud-medical-city', 'hilton-garden-inn-new-cairo', 'wilma-towers-nairobi', 'grand-premiere-towers-nairobi']
    .map(slug => `<li><a href="${projHref(slug, lang)}">${esc(PROJECTS.find(x => x.slug === slug).title[lang])}</a></li>`).join('');
  return `<footer class="footer">
  <div class="wrap">
    <div class="foot-cta">
      <h2>${t.ctaTitle}</h2>
      <a class="btn" href="${anchor(lang, 'contact')}">${t.ctaBtn} <span class="ico">${icon('arrow')}</span></a>
    </div>
    <div class="foot-grid">
      <div>
        <img src="../assets/v2/img/logo-light-320.webp" srcset="../assets/v2/img/logo-light-320.webp 320w, ../assets/v2/img/logo-light-480.webp 480w" sizes="156px" width="156" height="52" alt="${t.brand}" loading="lazy" decoding="async">
        <p class="desc">${t.footDesc}</p>
      </div>
      <div><h4>${t.company}</h4><ul>${company.map(([id, n]) => `<li><a href="${anchor(lang, id)}">${n}</a></li>`).join('')}</ul></div>
      <div><h4>${t.services}</h4><ul>${footerServiceLinks(lang, '')}</ul></div>
      <div><h4>${t.featured}</h4><ul>${featured}</ul></div>
    </div>
    <div class="foot-bottom">
      <span>&copy; <span id="year">${new Date().getFullYear()}</span> ${t.rights}</span>
      <span><a href="tel:${PHONE}" class="ltr">${PHONE_TXT}</a> &nbsp;·&nbsp; <a href="mailto:${EMAIL}">${EMAIL}</a></span>
      <a class="lang" href="${other}" hreflang="${t.langCode}" lang="${t.langCode}">${t.langName}</a>
    </div>
  </div>
  <div class="foot-word" aria-hidden="true">BARAKAT</div>
  <div class="credit"><div class="wrap"><span class="credit-line"></span><p>${t.credit} <b lang="en" dir="ltr">Velocity Software Solutions</b></p><span class="credit-line"></span></div></div>
</footer>`;
}

function jsonLd(s, lang, t) {
  const url = svcUrl(s.slug, lang);
  const crumbs = [{ name: t.home, item: homeUrl(lang) }, { name: t.services, item: svcUrl(HUB, lang) }];
  if (!s.hub) crumbs.push({ name: s.name[lang], item: url });
  const graph = [
    {
      '@type': 'WebPage', '@id': `${url}#webpage`, url, name: s.seoTitle[lang], description: s.desc[lang], inLanguage: lang,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Barakat Arabia' },
      primaryImageOfPage: { '@type': 'ImageObject', url: imgSet(s.img).large },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      about: { '@id': `${url}#service` },
    },
    {
      '@type': 'Service', '@id': `${url}#service`, name: s.name[lang], serviceType: s.name.en, description: s.desc[lang],
      provider: { '@id': `${SITE}/#organization` },
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: s.scopeTitle[lang],
        itemListElement: s.scope.map(it => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: it[lang] } })),
      },
    },
    ORG_NODE,
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })) },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: s.faq.map(f => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })) },
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function page(s, lang, parts) {
  const t = L[lang];
  const url = svcUrl(s.slug, lang);
  const im = imgSet(s.img);
  const og = `${SITE}/assets/v2/services/${s.slug}-og.jpg`;
  const title = esc(s.seoTitle[lang]);
  const desc = esc(s.desc[lang]);
  const body = s.hub
    ? [hero(s, lang, t), overview(s, lang, t), serviceCards(s, lang, t), steps(s, lang, t), related(s, lang, t), faq(s, lang, t)]
    : [hero(s, lang, t), overview(s, lang, t), steps(s, lang, t), faq(s, lang, t), related(s, lang, t), serviceCards(s, lang, t)];
  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${svcUrl(s.slug, 'en')}">
<link rel="alternate" hreflang="ar" href="${svcUrl(s.slug, 'ar')}">
<link rel="alternate" hreflang="x-default" href="${svcUrl(s.slug, 'en')}">
<meta name="theme-color" content="#0b0d11">
<meta name="format-detection" content="telephone=no">
<meta name="geo.region" content="SA">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Barakat Arabia">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(s.name[lang])}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${t.altLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="../favicon.ico" sizes="48x48">
<link rel="icon" href="../assets/v2/img/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../assets/v2/img/apple-touch-icon.png">
<link rel="manifest" href="../site.webmanifest">
<link rel="preload" as="image" href="${im.src}" imagesrcset="${im.srcset}" imagesizes="100vw" fetchpriority="high">
${parts.fonts}
${parts.style}
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${jsonLd(s, lang, t)}</script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
${parts.sprite}
${header(s, lang, t)}
<main id="main">
${body.join('\n\n')}
</main>
${footer(s, lang, t)}
${parts.tail}
`;
}

// ---- sitemap -------------------------------------------------------------------------------
function sitemap() {
  const pairs = [[`${SITE}/`, `${SITE}/index-ar.html`, '1.0']];
  for (const s of SERVICES) pairs.push([svcUrl(s.slug, 'en'), svcUrl(s.slug, 'ar'), s.hub ? '0.9' : '0.8']);
  const projects = fs.readdirSync(path.join(ROOT, 'projects')).filter(f => f.endsWith('.html') && !f.endsWith('-ar.html')).sort();
  for (const f of projects) pairs.push([`${SITE}/projects/${f}`, `${SITE}/projects/${f.replace(/\.html$/, '-ar.html')}`, '0.6']);
  const entry = (loc, en, ar, pri) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
    <lastmod>${TODAY}</lastmod>
    <priority>${pri}</priority>
  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pairs.flatMap(([en, ar, pri]) => [entry(en, en, ar, pri), entry(ar, en, ar, pri)]).join('\n')}
</urlset>
`;
}

// ---- share images --------------------------------------------------------------------------
async function shareImages() {
  const sharp = require('sharp');
  const outDir = path.join(ROOT, 'assets/v2/services');
  fs.mkdirSync(outDir, { recursive: true });
  for (const s of SERVICES) {
    const rel = `assets/v2/${s.img.base}-${s.img.widths[s.img.widths.length - 1]}.webp`;
    let buf = exists(rel) ? fs.readFileSync(path.join(ROOT, rel)) : Buffer.alloc(0);
    if (!buf.length) buf = Buffer.from(await (await fetch(`${SITE}/${rel}`)).arrayBuffer()); // ftp placeholder: use the live copy
    const jpg = await sharp(buf).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    fs.writeFileSync(path.join(outDir, `${s.slug}-og.jpg`), jpg); // fs handles long Windows paths that libvips can't open
  }
}

async function main() {
  const parts = { en: templateParts('en'), ar: templateParts('ar') };
  fs.mkdirSync(path.join(ROOT, 'services'), { recursive: true });
  for (const s of SERVICES) {
    for (const lang of ['en', 'ar']) fs.writeFileSync(path.join(ROOT, 'services', svcFile(s.slug, lang)), page(s, lang, parts[lang]));
  }
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap());
  const og = process.argv.includes('--og');
  if (og) await shareImages();
  console.log(`Built ${SERVICES.length * 2} service pages and sitemap.xml${og ? ' + share images' : ''}.`);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });

module.exports = { footerServiceLinks, svcFile, SERVICES, HUB };
