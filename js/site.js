/* HexLogic — site interactions (vanilla, no deps) */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme (persisted) ---- */
  var saved = localStorage.getItem('hx-theme');
  if (saved) root.setAttribute('data-theme', saved);
  function syncThemeUI() {
    var dark = root.getAttribute('data-theme') !== 'light';
    document.querySelectorAll('[data-theme-icon]').forEach(function (i) {
      i.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    });
  }
  syncThemeUI();
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('hx-theme', next);
      syncThemeUI();
    });
  });

  /* ---- Nav: glass + auto-hide on scroll down ---- */
  var nav = document.querySelector('.nav');
  var lastY = window.scrollY, ticking = false;
  function navScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 12);
      if (y > 240 && y > lastY + 6) nav.classList.add('nav-hidden');
      else if (y < lastY - 6 || y < 120) nav.classList.remove('nav-hidden');
    }
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(navScroll); ticking = true; }
  }, { passive: true });
  navScroll();

  /* ---- Scroll progress bar ---- */
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var updBar = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updBar, { passive: true });
    window.addEventListener('resize', updBar); updBar();
  }

  /* ---- Mobile menu ---- */
  var menu = document.querySelector('.mobile-menu');
  document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { if (menu) menu.classList.toggle('open'); });
  });
  if (menu) menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });

  /* ---- Reveal on scroll + count-up ---- */
  function runCount(el) {
    var raw = el.getAttribute('data-count');
    var m = raw.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) { el.textContent = raw; return; }
    var pre = m[1], end = parseFloat(m[2]), suf = m[3];
    var dec = (m[2].split('.')[1] || '').length;
    if (reduce) { el.textContent = raw; return; }
    var t0 = null, dur = 1300;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (end * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }
  var revealEls = document.querySelectorAll('.reveal:not(.in)');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('b[data-count]').forEach(runCount);
        if (e.target.matches('b[data-count]')) runCount(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('b[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---- 3D cursor tilt on cards ---- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card-interactive').forEach(function (card) {
      card.addEventListener('mouseenter', function () { card.classList.remove('tilt-reset'); });
      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (px * 6) + 'deg) rotateX(' + (-py * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.classList.add('tilt-reset');
        card.style.transform = '';
      });
    });

    /* ---- Magnetic buttons ---- */
    document.querySelectorAll('.btn-primary, .btn-lg').forEach(function (btn) {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', function (ev) {
        var r = btn.getBoundingClientRect();
        var x = (ev.clientX - r.left - r.width / 2) * 0.3;
        var y = (ev.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });

    /* ---- Hero pointer parallax ---- */
    var hero = document.querySelector('.hero');
    if (hero) {
      var g1 = hero.querySelector('.glow'), g2 = hero.querySelector('.glow-2'),
          hp = hero.querySelector('.hero-panel');
      hero.addEventListener('mousemove', function (ev) {
        var cx = ev.clientX / window.innerWidth - 0.5, cy = ev.clientY / window.innerHeight - 0.5;
        if (g1) g1.style.transform = 'translateX(-50%) translate(' + cx * 36 + 'px,' + cy * 26 + 'px)';
        if (g2) g2.style.transform = 'translate(' + cx * -40 + 'px,' + cy * -30 + 'px)';
        if (hp) hp.style.transform = 'translate(' + cx * 16 + 'px,' + cy * 12 + 'px)';
      });
      hero.addEventListener('mouseleave', function () {
        [g1, g2, hp].forEach(function (el) { if (el) el.style.transform = ''; });
      });
    }
  }

  /* ---- Contact / report-request modal ---- */
  var scrim = document.querySelector('[data-modal]');
  function openModal(report) {
    if (!scrim) return;
    var form = scrim.querySelector('[data-modal-form]');
    var ok = scrim.querySelector('[data-modal-success]');
    if (form) form.style.display = '';
    if (ok) ok.style.display = 'none';
    var rep = scrim.querySelector('[name="report"]');
    var scope = scrim.querySelector('[name="scope"]');
    var title = scrim.querySelector('[data-modal-title]');
    if (report) {
      if (rep) rep.value = report;
      if (scope) scope.value = report;
      if (title) title.textContent = 'Request the ' + report + ' report';
    } else {
      if (rep) rep.value = 'General inquiry';
      if (title) title.textContent = 'Request an assessment';
    }
    scrim.classList.add('open');
  }
  function closeModal() { if (scrim) scrim.classList.remove('open'); }

  document.querySelectorAll('[data-open-contact]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openModal(b.getAttribute('data-report')); });
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (b) {
    b.addEventListener('click', closeModal);
  });
  if (scrim) {
    scrim.addEventListener('click', function (e) { if (e.target === scrim) closeModal(); });
    var mform = scrim.querySelector('[data-modal-form]');
    if (mform) mform.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = mform.querySelector('button[type="submit"]');
      var orig = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      fetch(mform.action, {
        method: 'POST',
        body: new FormData(mform),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function () { showSuccess(); })
        .catch(function () { showSuccess(); })
        .finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = orig; } });
    });
  }
  function showSuccess() {
    var form = scrim.querySelector('[data-modal-form]');
    var ok = scrim.querySelector('[data-modal-success]');
    if (form) form.style.display = 'none';
    if (ok) ok.style.display = 'block';
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---- Year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
