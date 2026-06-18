document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

  if (heroSlides.length > 0) {
    var activeSlide = 0;
    var showSlide = function (index) {
      activeSlide = index % heroSlides.length;
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeSlide);
      });
      heroDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeSlide);
      });
    };

    heroDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    showSlide(0);
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5600);
  }

  var filterRoots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));

  filterRoots.forEach(function (root) {
    var targetSelector = root.getAttribute('data-filter-target') || '[data-movie-grid]';
    var grid = document.querySelector(targetSelector);
    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var queryInput = root.querySelector('[data-movie-search]');
    var typeSelect = root.querySelector('[data-filter-type]');
    var regionSelect = root.querySelector('[data-filter-region]');
    var yearSelect = root.querySelector('[data-filter-year]');
    var countNode = root.querySelector('[data-filter-count]');
    var emptyNode = document.querySelector('[data-empty-state="' + targetSelector.replace('#', '') + '"]');

    var apply = function () {
      var query = queryInput ? queryInput.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesType = !type || card.getAttribute('data-type') === type;
        var matchesRegion = !region || card.getAttribute('data-region') === region;
        var matchesYear = !year || card.getAttribute('data-year') === year;
        var show = matchesQuery && matchesType && matchesRegion && matchesYear;

        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = String(visible);
      }

      if (emptyNode) {
        emptyNode.style.display = visible === 0 ? 'block' : 'none';
      }
    };

    [queryInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  });
});
