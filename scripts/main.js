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
})()

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
    return loadScript('/scripts/quotes-data.js').then(() => loadScript('/scripts/hero-quotes.js'));
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
