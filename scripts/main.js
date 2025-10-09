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
/**
 * Injection automatique du carrousel de citations sur toutes les pages
 * - Sans dépendance externe et sans toucher aux formulaires
 * - Respect des emplacements précisés par page
 */
(function () {
  const PAGE = document.body && document.body.dataset && document.body.dataset.page;
  if (!PAGE) return;

  // Petit helper pour charger un script dynamiquement et chaîner le montage
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Erreur de chargement script: ' + src));
      document.head.appendChild(s);
    });
  }

  function insertSlot() {
    // Si un slot existe déjà, on le réutilise
    let slot = document.getElementById('insertion-citations');
    if (slot) return slot;

    // Création des ancres commentaires (DOM) et du slot
    const startC = document.createComment(' CITATIONS-START ');
    const endC = document.createComment(' CITATIONS-END ');
    slot = document.createElement('section');
    slot.id = 'insertion-citations';
    slot.className = 'insertion-citations';

    // Ciblage par page
    const hero = document.querySelector('.page-hero');
    if (PAGE === 'accueil') {
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(endC, hero.nextSibling);
        hero.parentNode.insertBefore(slot, endC);
        hero.parentNode.insertBefore(startC, slot);
        return slot;
      }
    }

    if (PAGE === 'club') {
      const h1 = document.querySelector('.page-hero .hero-title');
      if (h1 && h1.parentNode) {
        h1.parentNode.insertBefore(endC, h1.nextSibling);
        h1.parentNode.insertBefore(slot, endC);
        h1.parentNode.insertBefore(startC, slot);
        return slot;
      }
    }

    if (PAGE === 'tarifs') {
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(endC, hero.nextSibling);
        hero.parentNode.insertBefore(slot, endC);
        hero.parentNode.insertBefore(startC, slot);
        return slot;
      }
    }

    if (PAGE === 'adhesion') {
      const pre = document.getElementById('preinscription-en-ligne');
      if (pre && pre.parentNode) {
        pre.parentNode.insertBefore(startC, pre);
        pre.parentNode.insertBefore(slot, pre);
        pre.parentNode.insertBefore(endC, pre);
        return slot;
      }
    }

    if (PAGE === 'liens-utiles') {
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(endC, hero.nextSibling);
        hero.parentNode.insertBefore(slot, endC);
        hero.parentNode.insertBefore(startC, slot);
        return slot;
      }
    }

    if (PAGE === 'contact') {
      const form = document.querySelector('form.contact-form');
      if (form && form.parentNode) {
        form.parentNode.insertBefore(startC, form);
        form.parentNode.insertBefore(slot, form);
        form.parentNode.insertBefore(endC, form);
        return slot;
      }
    }

    // Fallback: si rien trouvé, on l’ajoute sous le hero (si dispo) ou en fin de main
    const main = document.querySelector('main') || document.body;
    if (hero && hero.parentNode) {
      hero.parentNode.insertBefore(endC, hero.nextSibling);
      hero.parentNode.insertBefore(slot, endC);
      hero.parentNode.insertBefore(startC, slot);
      return slot;
    }
    main.appendChild(startC);
    main.appendChild(slot);
    main.appendChild(endC);
    return slot;
  }

  function mount() {
    const slot = insertSlot();
    if (!slot) return;
    if (window.mountQuotesCarousel) {
      window.mountQuotesCarousel(slot);
    }
  }

  // Charger les modules (données + composant) puis monter
  document.addEventListener('DOMContentLoaded', () => {
    // Évite tout impact sur Netlify Forms: pas de preventDefault ici.
    Promise.resolve()
      .then(() => loadScript('/scripts/quotes-data.js'))
      .then(() => loadScript('/scripts/quotes-carousel.js'))
      .then(mount)
      .catch((err) => console.warn('[Citations] Non chargé:', err));
  });
})();
