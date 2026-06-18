(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("is-open");
        document.body.classList.toggle("is-menu-open", mobileMenu.classList.contains("is-open"));
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var active = 0;

      function setActive(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          setActive(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      window.setInterval(function () {
        setActive(active + 1);
      }, 5200);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-local-filter]"));
    filterInputs.forEach(function (input) {
      var scope = input.closest("[data-filter-scope]");
      var list = scope ? scope.querySelector("[data-filter-list]") : null;
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];

      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
        });
      });
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    Array.prototype.slice.call(document.querySelectorAll("input[name='q']")).forEach(function (input) {
      if (!input.value) {
        input.value = query;
      }
    });
  });
})();
