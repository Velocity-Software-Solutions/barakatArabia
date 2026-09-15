/* Barakat Arabia — site behaviour (shared by all pages) */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isAr = document.documentElement.lang === 'ar';
  var hasIO = 'IntersectionObserver' in window;
  var T = isAr ? {
    sending: 'جارٍ الإرسال…',
    sent: 'شكراً لك! تم إرسال رسالتك.',
    invalid: 'يرجى استكمال النموذج والتحقق من البريد الإلكتروني ثم المحاولة مجدداً.',
    failed: 'تعذر إرسال رسالتك. يرجى المحاولة مجدداً لاحقاً.',
    notConfigured: 'خدمة البريد الإلكتروني غير مهيأة حالياً. يرجى المحاولة لاحقاً.',
    open: 'فتح القائمة', close: 'إغلاق القائمة'
  } : {
    sending: 'Sending…',
    sent: 'Thank you! Your message has been sent.',
    invalid: 'Please complete the form and check your email address, then try again.',
    failed: 'Your message could not be sent. Please try again later.',
    notConfigured: 'The email service is not configured yet. Please try again later.',
    open: 'Open menu', close: 'Close menu'
  };

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header state + scroll indicator, updated once per frame */
  var header = $('#header'), toTop = $('#to-top'), lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      header.classList.toggle('hide', y > 600 && y > lastY && !document.body.classList.contains('menu-open'));
    }
    if (toTop) {
      toTop.classList.toggle('show', y > 420);
      toTop.style.setProperty('--p', max > 0 ? Math.min(100, (y / max) * 100).toFixed(1) : 0);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Mobile menu */
  var burger = $('#burger'), menu = $('#mobile-menu');
  function setMenu(open) {
    if (!burger) return;
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? T.close : T.open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    $$('#mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* Reveal on scroll */
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* Decorative section backgrounds load only when their section approaches */
  var bgs = $$('.sectors, .contact');
  if (hasIO) {
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('bg-in'); bo.unobserve(e.target); } });
    }, { rootMargin: '600px 0px' });
    bgs.forEach(function (el) { bo.observe(el); });
  } else {
    bgs.forEach(function (el) { el.classList.add('bg-in'); });
  }

  /* Count-up numbers */
  if (hasIO && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, target = +el.getAttribute('data-count'), start = null;
        (function step(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / 1800, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; co.observe(el); });
  }

  /* Active nav link */
  var links = $$('.nav a[href^="#"]');
  if (hasIO && links.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) so.observe(s); });
  }

  /* Service card spotlight */
  $$('.svc').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Portfolio filter */
  var filters = $$('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      $$('#proj-grid .proj').forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-country') === f;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('in');
      });
    });
  });

  /* Partner marquee: duplicate each set for a seamless loop */
  $$('.mq-row').forEach(function (row) {
    var set = $('.mq-set', row);
    if (!set) return;
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('img', clone).forEach(function (i) { i.alt = ''; });
    row.appendChild(clone);
  });

  /* Lightbox */
  var lb = $('#lb');
  if (lb) {
    var lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lbCount = $('#lb-count');
    var group = [], index = 0, lastFocus = null;
    var show = function (i) {
      index = (i + group.length) % group.length;
      var a = group[index], img = a.querySelector('img');
      lbImg.src = a.getAttribute('href');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = a.getAttribute('data-caption') || '';
      lbCount.textContent = (index + 1) + ' / ' + group.length;
    };
    var closeLb = function () {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    $$('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        group = $$('[data-lightbox="' + a.getAttribute('data-lightbox') + '"]').filter(function (x) { return !x.closest('.is-hidden'); });
        lastFocus = a;
        show(group.indexOf(a));
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        $('.lb-close', lb).focus();
      });
    });
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { show(index - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(index + (isAr ? 1 : -1));
      if (e.key === 'ArrowRight') show(index + (isAr ? -1 : 1));
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });

  /* Contact form (posts to assets/mailer.php) */
  var form = $('#contact-form');
  if (form) {
    var out = $('.ajax-response'), submit = $('button[type="submit"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      out.className = 'ajax-response';
      if (!form.checkValidity()) {
        out.classList.add('error');
        out.textContent = T.invalid;
        var bad = form.querySelector(':invalid'); if (bad) bad.focus();
        return;
      }
      submit.disabled = true;
      out.textContent = T.sending;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        return res.text().then(function (text) {
          if (!res.ok) {
            var err = new Error(text);
            err.server = true;
            throw err;
          }
          out.classList.add('success');
          out.textContent = isAr ? T.sent : (text || T.sent);
          form.reset();
        });
      }).catch(function (err) {
        out.classList.add('error');
        var msg = err && err.server ? err.message : '';
        if (/not configured/i.test(msg)) out.textContent = T.notConfigured;
        else if (/complete the form/i.test(msg)) out.textContent = T.invalid;
        else out.textContent = (!isAr && msg) ? msg : T.failed;
      }).then(function () { submit.disabled = false; });
    });
  }
})();
