/**
 * Hero Quotes (overlay sans fond) — Ivry Échecs 94
 * Timings: DISPLAY_MS = 10000, TRANSITION_MS = 500
 * A11y: section focusable (tabindex=0), ←/→ (ou A/Q FR), aria-live="polite" sur la citation active
 */
(function () {
  const DISPLAY_MS = 20000;
  const TRANSITION_MS = 500;

  function authorLabel(q) {
    if (!q) return '';
    const born = typeof q.born === 'number' ? q.born : '';
    const died = typeof q.died === 'number' ? q.died : '';
    return born && died ? `${q.author} (${born}–${died})` : (q.author || '');
  }

  function create(quotes) {
    const section = document.createElement('section');
    section.className = 'hero-quotes';
    section.setAttribute('aria-label', "Citations d'échecs");
    section.setAttribute('tabindex', '0');

    const slides = quotes.map((q, i) => {
      const fig = document.createElement('figure');
      fig.className = 'hq-slide' + (i === 0 ? ' is-active' : '');
      const block = document.createElement('blockquote');
      // Texte sans guillemets, rendu sobre
      block.textContent = `${q.text}`;
      block.setAttribute('aria-live', 'polite');
      const cap = document.createElement('figcaption');
      cap.textContent = `— ${authorLabel(q)}`;
      fig.appendChild(block);
      fig.appendChild(cap);
      return fig;
    });

    slides.forEach((s) => section.appendChild(s));

    let index = 0;
    let timer = null;
    const prefersReduced = (() => {
      try { const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)'); return !!(m && m.matches); } catch (_) { return false; }
    })();

    function show(nextIndex) {
      if (nextIndex === index) return;
      const curr = slides[index];
      const next = slides[(nextIndex + slides.length) % slides.length];
      curr.classList.remove('is-active');
      if (!prefersReduced) {
        curr.classList.add('is-leaving');
        window.setTimeout(() => curr.classList.remove('is-leaving'), TRANSITION_MS);
      }
      index = (nextIndex + slides.length) % slides.length;
      next.classList.add('is-active');
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function start() { stop(); if (slides.length > 1) { timer = window.setInterval(next, DISPLAY_MS); } }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', () => { if (!section.contains(document.activeElement)) start(); });
    section.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'q' || k === 'Q') { e.preventDefault(); prev(); }
      else if (k === 'ArrowRight' || k === 'a' || k === 'A') { e.preventDefault(); next(); }
    });

    if (slides.length > 1) start();
    return section;
  }

  window.mountHeroQuotes = function mountHeroQuotes(container) {
    if (!container) return;
    const quotes = (window.QUOTES || []).slice(0);
    if (!quotes.length) return;
    const el = create(quotes);
    container.innerHTML = '';
    container.appendChild(el);
  };
})();
