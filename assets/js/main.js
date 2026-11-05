(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    var close = function () {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.global-nav a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 880) close(); });
  }

  // Before / After slider
  document.querySelectorAll('.compare').forEach(function (el) {
    var input = el.querySelector('input[type="range"]');
    if (!input) return;
    var update = function () { el.style.setProperty('--pos', input.value + '%'); };
    input.addEventListener('input', update);
    update();
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Works filter
  var filter = document.querySelector('.filter');
  if (filter) {
    var rows = document.querySelectorAll('.works-row[data-cat]');
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filter.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var cat = btn.getAttribute('data-filter');
      rows.forEach(function (r) {
        r.hidden = !(cat === 'all' || r.getAttribute('data-cat').split(' ').indexOf(cat) !== -1);
      });
    });
  }

  // Contact form (Formspree, async with graceful fallback)
  var form = document.querySelector('form[data-async]');
  if (form && window.fetch) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = '送信中…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('send failed');
          form.reset();
          status.className = 'form-status show ok';
          status.textContent = 'お問い合わせを送信しました。内容を確認のうえ、担当者よりご連絡いたします。';
        })
        .catch(function () {
          status.className = 'form-status show ng';
          status.textContent = '送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お電話（0985-66-0794）にてご連絡ください。';
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = '送信する';
        });
    });
  }

  // Footer year
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
