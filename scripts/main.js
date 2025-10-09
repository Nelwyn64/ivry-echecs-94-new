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
// Injection automatique du carrousel APRÈS le header (toutes pages)
// - Ne touche pas aux formulaires (Netlify compris)
// - Charge quotes-data.js puis quotes-carousel.js et monte dans #insertion-citations
// ------------------------------------------------------------
(function () {
  if (window.__ivryQuotesInjected) return; // éviter double-injection
  window.__ivryQuotesInjected = true;

  function ensureScriptsLoaded() {
    return new Promise((resolve, reject) => {
      if (window.mountQuotesCarousel && window.QUOTES) return resolve();
      function load(src) {
        return new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = src; s.defer = true;
          s.onload = () => res(); s.onerror = () => rej(new Error('load fail '+src));
          document.head.appendChild(s);
        });
      }
      load('/scripts/quotes-data.js')
        .then(() => load('/scripts/quotes-carousel.js'))
        .then(resolve)
        .catch(reject);
    });
  }

  function insertAfter(ref, node) {
    if (ref && ref.parentNode) {
      if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
      else ref.parentNode.appendChild(node);
    }
  }

  function placeSlotAfterHeader() {
    const header = document.querySelector('header[role="banner"], .site-header');
    const include = document.querySelector('[data-include="/header.html"], [data-include]');
    const anchorRef = header || include;
    if (!anchorRef) return null;

    let slot = document.getElementById('insertion-citations');
    if (slot && slot.parentNode) return slot;

    const startC = document.createComment(' CITATIONS-START ');
    slot = document.createElement('div');
    slot.id = 'insertion-citations';
    const endC = document.createComment(' CITATIONS-END ');

    insertAfter(anchorRef, startC);
    insertAfter(startC, slot);
    insertAfter(slot, endC);
    return slot;
  }

  function mountIfReady() {
    const slot = placeSlotAfterHeader();
    if (!slot) return false;
    if (window.mountQuotesCarousel) {
      window.mountQuotesCarousel(slot);
      return true;
    }
    return false;
  }

  function waitForHeaderAndMount() {
    if (mountIfReady()) return;
    const obs = new MutationObserver(() => {
      if (mountIfReady()) {
        obs.disconnect();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureScriptsLoaded()
      .then(waitForHeaderAndMount)
      .catch((e) => console.warn('[Citations] non chargé', e));
  });
})();
