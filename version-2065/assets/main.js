(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
        dot.setAttribute('aria-pressed', String(dotIndex === current));
      });
    }

    function startCarousel() {
      if (slides.length < 2) {
        return;
      }
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startCarousel();
      });
    });

    showSlide(0);
    startCarousel();

    var searchInput = document.querySelector('[data-search-input]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var emptyPanel = document.querySelector('[data-empty-panel]');

    function getQuery() {
      if (!searchInput) {
        return '';
      }
      return searchInput.value.trim().toLowerCase();
    }

    function getActiveFilter() {
      var active = document.querySelector('.filter-btn.is-active');
      return active ? active.getAttribute('data-filter') : 'all';
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-category') || ''
      ].join(' ').toLowerCase();
    }

    function applyFilters() {
      var query = getQuery();
      var filter = getActiveFilter();
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesFilter = filter === 'all' || text.indexOf(filter.toLowerCase()) !== -1;
        var shouldShow = matchesQuery && matchesFilter;
        card.classList.toggle('hidden-card', !shouldShow);
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyPanel) {
        emptyPanel.classList.toggle('is-visible', visible === 0);
      }
    }

    if (searchInput && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        searchInput.value = q;
      }
      searchInput.addEventListener('input', applyFilters);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        applyFilters();
      });
    });

    if (cards.length && (searchInput || filterButtons.length)) {
      applyFilters();
    }
  });
})();
