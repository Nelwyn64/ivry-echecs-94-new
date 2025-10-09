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
