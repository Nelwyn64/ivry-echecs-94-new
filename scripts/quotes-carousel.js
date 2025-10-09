/**
 * Composant Carrousel de citations — Ivry Échecs 94
 *
 * Accessibilité:
 * - Section avec aria-label="Citations d’échecs".
 * - Boutons précéd./suiv. focusables (Tab), activation au clavier:
 *   Left/Right ou Q/A (clavier FR) quand les boutons ont le focus.
 * - Le blockquote actif possède aria-live="polite" pour lecteurs d’écran.
 *
 * Comportement:
 * - Auto-rotation toutes les 6s (configurable via ROTATION_MS).
 * - Pause au survol et au focus, reprise au mouseleave/blur.
 * - Progressive enhancement: si script non chargé, le conteneur reste vide.
 */

(function () {
  const ROTATION_MS = 6000; // durée d’auto-rotation (modifiable)

  function formatAuthor(q) {
    if (q.author === 'Attribué' || (q.born == null && q.died == null)) {
      return 'Attribué';
    }
    const born = typeof q.born === 'number' ? q.born : '';
    const died = typeof q.died === 'number' ? q.died : '';
    if (born && died) return `${q.author} (${born}–${died})`;
    return q.author;
  }

  function createCarouselElement(quotes) {
    const section = document.createElement('section');
    section.className = 'quotes-carousel';
    section.setAttribute('aria-label', 'Citations d’échecs');

    // Wrapper pour les figures
    const figures = quotes.map((q, i) => {
      const fig = document.createElement('figure');
      fig.className = 'quote' + (i === 0 ? ' is-active' : '');

      const block = document.createElement('blockquote');
      block.setAttribute('aria-live', 'polite');
      block.textContent = `« ${q.text} »`;

      const figcap = document.createElement('figcaption');
      const spanAuthor = document.createElement('span');
      spanAuthor.className = 'author';
      spanAuthor.textContent = formatAuthor(q);

      const sep = document.createTextNode(' — ');

      const spanSource = document.createElement('span');
      spanSource.className = 'source';
      spanSource.textContent = q.source || '';

      figcap.appendChild(spanAuthor);
      figcap.appendChild(sep);
      figcap.appendChild(spanSource);

      fig.appendChild(block);
      fig.appendChild(figcap);
      return fig;
    });

    figures.forEach((f) => section.appendChild(f));

    // Contrôles
    const controls = document.createElement('div');
    controls.className = 'qc-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Contrôles du carrousel');

    const prevBtn = document.createElement('button');
    prevBtn.className = 'qc-prev';
    prevBtn.setAttribute('aria-label', 'Citation précédente');
    prevBtn.textContent = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'qc-next';
    nextBtn.setAttribute('aria-label', 'Citation suivante');
    nextBtn.textContent = '›';

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    section.appendChild(controls);

    // Logic de rotation
    let index = 0;
    let timer = null;
    const all = figures;

    function show(i) {
      all[index].classList.remove('is-active');
      index = (i + all.length) % all.length;
      all[index].classList.add('is-active');
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function start() {
      stop();
      timer = window.setInterval(next, ROTATION_MS);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    // Événements boutons
    prevBtn.addEventListener('click', () => { prev(); });
    nextBtn.addEventListener('click', () => { next(); });

    function onKey(e) {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'q' || k === 'Q') {
        e.preventDefault();
        prev();
      } else if (k === 'ArrowRight' || k === 'a' || k === 'A') {
        e.preventDefault();
        next();
      }
    }

    prevBtn.addEventListener('keydown', onKey);
    nextBtn.addEventListener('keydown', onKey);

    // Pause au survol et au focus dans la section
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', (e) => {
      // Reprend seulement si le focus sort complètement du carrousel
      if (!section.contains(document.activeElement)) start();
    });

    // Démarrage automatique (respecte prefers-reduced-motion si souhaité)
    try {
      const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      if (m && m.matches) {
        // Pas d’auto-rotation si l’utilisateur préfère moins d’animations
      } else {
        start();
      }
    } catch (_) {
      start();
    }

    return section;
  }

  // API publique d’insertion
  window.mountQuotesCarousel = function mountQuotesCarousel(container) {
    if (!container) return; // Pas d’erreur si conteneur nul
    const quotes = (window.QUOTES || []).slice();
    if (!quotes.length) return;

    const el = createCarouselElement(quotes);
    container.innerHTML = '';
    container.appendChild(el);
  };
})();

