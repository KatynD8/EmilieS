// Navigation et gestion des sections
document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const footerLinks = document.querySelectorAll(".footer-links a");

  // Toggle menu mobile avec animation douce
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Animation séquentielle des items du menu mobile
    if (navMenu.classList.contains("active")) {
      const menuItems = navMenu.querySelectorAll("li");
      menuItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.animation = `fadeInUp 0.5s ease-out both`;
        }, index * 100);
      });
    }
  });

  // Navigation entre sections avec animation douce
  const navigateTo = (sectionId) => {
    // Masquer toutes les sections avec fade out
    sections.forEach((section) => {
      if (section.classList.contains("active")) {
        section.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
          section.classList.remove("active");
          section.style.animation = "";
        }, 300);
      }
    });

    // Afficher la section cible après un délai
    setTimeout(() => {
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");

        // Scroll doux vers le haut
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // Mettre à jour l'état actif dans la nav
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.dataset.section === sectionId) {
            link.classList.add("active");
          }
        });

        // Fermer le menu mobile si ouvert
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");

        // Mettre à jour l'URL sans recharger la page
        history.pushState({ section: sectionId }, "", `#${sectionId}`);

        // Réinitialiser les animations des éléments
        resetAnimations(targetSection);
      }
    }, 350);
  };

  // Réinitialiser les animations pour une nouvelle section
  const resetAnimations = (section) => {
    const animatedElements = section.querySelectorAll(
      ".feature-item, .service-card, .contact-item, .content-card li"
    );
    animatedElements.forEach((el, index) => {
      el.style.animation = "none";
      setTimeout(() => {
        el.style.animation = "";
      }, 10);
    });
  };

  // Gestion des clics sur les liens de navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      navigateTo(sectionId);
    });
  });

  // Gestion des clics sur les liens du footer
  footerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      navigateTo(sectionId);
    });
  });

  // Gestion du bouton retour du navigateur
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.section) {
      navigateTo(e.state.section);
    } else {
      navigateTo("home");
    }
  });

  // Charger la section depuis l'URL au chargement
  const loadSectionFromURL = () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      // Petit délai pour permettre les animations initiales
      setTimeout(() => {
        navigateTo(hash);
      }, 500);
    } else {
      navigateTo("home");
    }
  };

  // Initialiser l'état
  loadSectionFromURL();

  // Fermer le menu mobile si on clique en dehors
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Parallax doux sur le hero au scroll
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const hero = document.querySelector(".hero");
        if (hero) {
          const scrolled = window.pageYOffset;
          hero.style.transform = `translateY(${scrolled * 0.4}px)`;
          hero.style.opacity = 1 - scrolled / 500;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Observer pour animations au scroll (Intersection Observer)
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        // Animation spéciale pour les icônes
        if (entry.target.classList.contains("feature-item")) {
          const icon = entry.target.querySelector(".feature-icon");
          if (icon) {
            icon.style.animation = "gentleBounce 2s ease-in-out infinite";
          }
        }

        // Animation spéciale pour les items de contact
        if (entry.target.classList.contains("contact-item")) {
          const icon = entry.target.querySelector(".contact-icon");
          if (icon) {
            icon.style.animation = "gentlePulse 2s ease-in-out infinite";
          }
        }
      }
    });
  }, observerOptions);

  // Observer tous les éléments animables visibles
  const observeElements = () => {
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      const animatedElements = activeSection.querySelectorAll(
        ".feature-item, .service-card, .contact-item, .intro-text"
      );
      animatedElements.forEach((el) => {
        animateOnScroll.observe(el);
      });
    }
  };

  // Observer après chaque navigation
  const originalNavigateTo = navigateTo;
  navigateTo = function (sectionId) {
    originalNavigateTo(sectionId);
    setTimeout(observeElements, 400);
  };

  // Observer initial
  setTimeout(observeElements, 500);

  // Effet de typing doux pour le sous-titre du hero (optionnel)
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = "";
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };

    // Démarrer après l'animation du titre
    setTimeout(typeWriter, 1300);
  }

  // Animation douce du curseur sur les liens
  const addCursorEffect = () => {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease, opacity 0.2s ease;
            opacity: 0;
        `;
    document.body.appendChild(cursor);

    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
    });

    // Animation fluide du curseur
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Agrandir le curseur sur les liens
    const interactiveElements = document.querySelectorAll(
      "a, button, .nav-link"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(2)";
        cursor.style.borderColor = "var(--primary-dark)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursor.style.borderColor = "var(--primary)";
      });
    });
  };

  // Activer le curseur personnalisé sur desktop uniquement
  if (window.innerWidth > 768) {
    addCursorEffect();
  }
});
