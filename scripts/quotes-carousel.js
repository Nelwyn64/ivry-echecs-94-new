/**
 * Carrousel de citations (fond transparent, sans boutons) — Ivry Échecs 94
 *
 * Timings: DISPLAY_MS = 10000 (10s), TRANSITION_MS = 500ms (fondu)
 * A11y: section focusable (tabindex=0), flèches ←/→ ou Q/A (FR) pour naviguer
 *       blockquote actif: aria-live="polite"
 * Pause au survol/focus, reprise à la sortie. Aucun fond ajouté (hérite couleur).
 */
(function () {
  const DISPLAY_MS = 10000;
  const TRANSITION_MS = 500;

  function formatAuthor(q) {
    if (!q) return '';
    const born = typeof q.born === 'number' ? q.born : '';
    const died = typeof q.died === 'number' ? q.died : '';
    if (born && died) return `${q.author} (${born}–${died})`;
    return q.author || '';
  }

  function createCarousel(quotes) {
    const section = document.createElement('section');
    section.className = 'quotes-carousel';
    section.setAttribute('aria-label', "Citations d'échecs");
    section.setAttribute('tabindex', '0');

    const figures = quotes.map((q, i) => {
      const fig = document.createElement('figure');
      fig.className = 'quote' + (i === 0 ? ' is-active' : '');

      const block = document.createElement('blockquote');
      block.textContent = `« ${q.text} »`;
      block.setAttribute('aria-live', 'polite');

      const cap = document.createElement('figcaption');
      cap.textContent = `— ${formatAuthor(q)}`;

      fig.appendChild(block);
      fig.appendChild(cap);
      return fig;
    });

    figures.forEach((f) => section.appendChild(f));

    let index = 0;
    let timer = null;
    const prefersReduced = (() => {
      try {
        const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
        return !!(m && m.matches);
      } catch (_) { return false; }
    })();

    function show(nextIndex) {
      if (nextIndex === index) return;
      const current = figures[index];
      const next = figures[(nextIndex + figures.length) % figures.length];

      current.classList.remove('is-active');
      if (!prefersReduced) {
        current.classList.add('is-leaving');
        window.setTimeout(() => current.classList.remove('is-leaving'), TRANSITION_MS);
      }
      index = (nextIndex + figures.length) % figures.length;
      next.classList.add('is-active');
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function start() {
      stop();
      if (!prefersReduced) {
        timer = window.setInterval(next, DISPLAY_MS);
      }
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer); timer = null;
      }
    }

    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', (e) => {
      if (!section.contains(document.activeElement)) start();
    });

    section.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'q' || k === 'Q') { e.preventDefault(); prev(); }
      else if (k === 'ArrowRight' || k === 'a' || k === 'A') { e.preventDefault(); next(); }
    });

    if (!prefersReduced) start();
    return section;
  }

  // API publique
  window.mountQuotesCarousel = function mountQuotesCarousel(container) {
    if (!container) return; // sécurité
    const quotes = (window.QUOTES || []).slice(0);
    if (!quotes.length) return;
    const el = createCarousel(quotes);
    container.innerHTML = '';
    container.appendChild(el);
  };
})();

