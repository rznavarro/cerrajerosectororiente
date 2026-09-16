(function () {
  "use strict";

  /* Menú móvil */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Animaciones de entrada + contadores + barras de habilidad */
  var revealTargets = document.querySelectorAll(".reveal, .service-card");
  var counters = document.querySelectorAll("[data-counter-to]");
  var skillFills = document.querySelectorAll(".skill-fill");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter-to"));
    var decimals = el.getAttribute("data-counter-decimals") ? parseInt(el.getAttribute("data-counter-decimals"), 10) : 0;
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });

    var counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });

    var skillObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute("data-skill") + "%";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillFills.forEach(function (el) {
      skillObserver.observe(el);
    });
  } else {
    /* Fallback sin animación para navegadores muy antiguos */
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-counter-to");
    });
    skillFills.forEach(function (el) {
      el.style.width = el.getAttribute("data-skill") + "%";
    });
  }

  /* Año actual en el footer */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
