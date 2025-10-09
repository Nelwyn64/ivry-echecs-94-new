(() => {
  const root = document.documentElement;
  root.classList.add("js");

  const includeElements = document.querySelectorAll("[data-include]");

  if (includeElements.length) {
    includeElements.forEach(async (element) => {
      const src = element.getAttribute("data-include");
      if (!src) {
        return;
      }

      try {
        const response = await fetch(src, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`Inclusion impossible (${response.status})`);
        }
        const markup = await response.text();
        element.innerHTML = markup;
        initializeNav(element);
        updateYear(element);
        highlightActiveLink(element);
      } catch (error) {
        console.warn("Impossible de charger le fragment", src, error);
      }
    });
  }

  function initializeNav(scope) {
    const toggle = scope.querySelector(".nav-toggle");
    const navigation = scope.querySelector(".primary-nav");
    if (!toggle || !navigation) {
      return;
    }

    const closeNav = () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("is-open", !isExpanded);
      if (!isExpanded) {
        const firstLink = navigation.querySelector("a");
        if (firstLink) {
          firstLink.focus({ preventScroll: true });
        }
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  function highlightActiveLink(scope) {
    const currentPage = document.body.dataset.page;
    if (!currentPage) {
      return;
    }
    const activeLink = scope.querySelector(`[data-nav="${currentPage}"]`);
    if (activeLink) {
      activeLink.setAttribute("aria-current", "page");
      activeLink.classList.add("is-active");
    }
  }

  function updateYear(scope) {
    const yearElement = scope.querySelector("[data-current-year]");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Amélioration du formulaire de contact (construction d'un mailto)
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const statusElement = contactForm.querySelector("[data-form-status]");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const lastname = (formData.get("lastname") || "").toString().trim();
      const firstname = (formData.get("firstname") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const type = (formData.get("type") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      if (!lastname || !firstname || !email || !message) {
        notify(statusElement, "Merci de renseigner tous les champs obligatoires.", true);
        return;
      }

      const subject = encodeURIComponent(`[Ivry Échecs 94] Demande ${type || "de renseignement"}`);
      const body = encodeURIComponent(`Nom : ${firstname} ${lastname}\nEmail : ${email}\nSujet : ${type}\n\n${message}`);
      const mailtoUrl = `mailto:ivryechecs@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;
      notify(statusElement, "Votre client mail va s'ouvrir pour finaliser l'envoi.", false);
      contactForm.reset();
    });
  }

  function notify(element, message, isError) {
    if (!element) {
      return;
    }
    element.textContent = message;
    element.classList.toggle("form-status--error", Boolean(isError));
    element.classList.toggle("form-status--success", !isError);
  }
})();

// ------------------------------------------------------------
// Hero Quotes — injection automatique après le header (overlay)
// Ne modifie pas les formulaires; insère un slot dans le hero
// et charge dynamiquement les scripts nécessaires.
(function () {
  if (window.__ivryHeroQuotesInjected) return;
  window.__ivryHeroQuotesInjected = true;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some(s => s.src.endsWith(src))) return resolve();
      const s = document.createElement('script'); s.src = src; s.defer = true;
      s.onload = () => resolve(); s.onerror = () => reject(new Error('load fail '+src));
      document.head.appendChild(s);
    });
  }

  function ensureDeps() {
    if (window.QUOTES && window.mountHeroQuotes) return Promise.resolve();
    // Tentative de chargement des scripts dédiés
    return loadScript('/scripts/quotes-data.js')
      .catch((e) => { console.warn('[HeroQuotes] quotes-data failed, using inline fallback', e); })
      .then(() => loadScript('/scripts/hero-quotes.js'))
      .catch((e) => { console.warn('[HeroQuotes] hero-quotes failed, will define inline', e); })
      .then(() => {
        // Fallbacks inline si nécessaire
        if (!window.QUOTES) {
          window.QUOTES = [
            { text: "Pour progresser, il faut étudier les finales avant toute chose.", author: "José Raúl Capablanca", born: 1888, died: 1942 },
            { text: "Quand vous voyez un bon coup, cherchez-en un meilleur.", author: "Emanuel Lasker", born: 1868, died: 1941 },
            { text: "Aidez vos pièces, elles vous aideront.", author: "Paul Morphy", born: 1837, died: 1884 },
            { text: "Il y a plus d'aventures sur un échiquier que sur toutes les mers du monde.", author: "Pierre Mac Orlan", born: 1882, died: 1970 },
            { text: "La tactique, c'est ce que vous faites quand il y a quelque chose à faire ; la stratégie, c'est ce que vous faites quand il n'y a rien à faire.", author: "Savielly Tartakower", born: 1887, died: 1956 },
          ];
        }
        if (!window.mountHeroQuotes) {
          (function(){
            const DISPLAY_MS = 10000, TRANSITION_MS = 500;
            function authorLabel(q){const b=typeof q.born==='number'?q.born:'';const d=typeof q.died==='number'?q.died:'';return b&&d?`${q.author} (${b}–${d})`:(q.author||'');}
            window.mountHeroQuotes = function(container){
              if(!container) return; const quotes=(window.QUOTES||[]).slice(0); if(!quotes.length) return;
              const section=document.createElement('section'); section.className='hero-quotes'; section.setAttribute('aria-label',"Citations d'échecs"); section.tabIndex=0;
              const slides=quotes.map((q,i)=>{const f=document.createElement('figure'); f.className='hq-slide'+(i===0?' is-active':''); const b=document.createElement('blockquote'); b.textContent=`« ${q.text} »`; b.setAttribute('aria-live','polite'); const c=document.createElement('figcaption'); c.textContent=`— ${authorLabel(q)}`; f.appendChild(b); f.appendChild(c); return f;});
              slides.forEach(s=>section.appendChild(s));
              let index=0, timer=null; const prefersReduced=(()=>{try{const m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');return !!(m&&m.matches);}catch(_){return false;}})();
              function show(n){if(n===index) return; const cur=slides[index]; const nxt=slides[(n+slides.length)%slides.length]; cur.classList.remove('is-active'); if(!prefersReduced){cur.classList.add('is-leaving'); setTimeout(()=>cur.classList.remove('is-leaving'), TRANSITION_MS);} index=(n+slides.length)%slides.length; nxt.classList.add('is-active');}
              function next(){show(index+1);} function prev(){show(index-1);} function start(){stop(); if(!prefersReduced) timer=setInterval(next, DISPLAY_MS);} function stop(){if(timer){clearInterval(timer); timer=null;}}
              section.addEventListener('mouseenter', stop); section.addEventListener('mouseleave', start); section.addEventListener('focusin', stop); section.addEventListener('focusout', ()=>{ if(!section.contains(document.activeElement)) start(); });
              section.addEventListener('keydown', (e)=>{const k=e.key; if(k==='ArrowLeft'||k==='q'||k==='Q'){e.preventDefault(); prev();} else if(k==='ArrowRight'||k==='a'||k==='A'){e.preventDefault(); next();}});
              if(!prefersReduced) start(); container.innerHTML=''; container.appendChild(section);
            };
          })();
        }
      });
  }

  function findHeroContainer() {
    let el = document.querySelector('.hero');
    if (el) return el;
    el = document.querySelector('.masthead, .page-hero, .banner');
    if (el) return el;
    const header = document.querySelector('header[role="banner"], .site-header');
    if (header) {
      let n = header.nextElementSibling;
      while (n) { if (n.tagName === 'SECTION') return n; n = n.nextElementSibling; }
    }
    return document.querySelector('main') || document.body;
  }

  function insertSlot(anchorHero) {
    if (!anchorHero) return null;
    anchorHero.classList.add('hero');
    // Insertion préférentielle dans .hero-content pour hériter de sa couleur (souvent blanche)
    const inner = anchorHero.querySelector('.hero-content') || anchorHero;
    let slot = document.getElementById('hero-quotes-slot');
    if (slot && slot.parentNode === inner) return slot;
    if (slot && slot.parentNode) slot.parentNode.removeChild(slot);
    const startC = document.createComment(' HERO-QUOTES-START ');
    slot = document.createElement('div'); slot.id = 'hero-quotes-slot';
    const endC = document.createComment(' HERO-QUOTES-END ');
    inner.insertBefore(endC, inner.firstChild);
    inner.insertBefore(slot, endC);
    inner.insertBefore(startC, slot);
    return slot;
  }

  function mount() {
    const hero = findHeroContainer();
    const slot = insertSlot(hero);
    if (!slot) { console.warn('[HeroQuotes] pas de slot'); return; }
    if (window.mountHeroQuotes) {
      try {
        console.log('[HeroQuotes] mounting with', (window.QUOTES||[]).length, 'quotes');
        window.mountHeroQuotes(slot);
        console.log('[HeroQuotes] mounted');
      } catch (e) {
        console.warn('[HeroQuotes] mount error', e);
      }
    } else {
      console.warn('[HeroQuotes] API mountHeroQuotes manquante');
    }
  }

  function init() {
    ensureDeps().then(mount).catch((e) => console.warn('[HeroQuotes] non chargé', e));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((list, obs) => {
      const hasHeader = document.querySelector('header[role="banner"], .site-header');
      if (hasHeader) { obs.disconnect(); init(); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // init immédiat + relance de sécurité après 1s au cas où
    init();
    setTimeout(init, 1000);
  });
})();
