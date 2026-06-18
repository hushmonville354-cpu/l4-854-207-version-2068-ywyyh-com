(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      button.textContent = menu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function setupGlobalSearch() {
    var forms = document.querySelectorAll('[data-global-search]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        var base = form.getAttribute('data-search-prefix') || '';
        var path = base + 'search.html';
        if (!base) {
          var marker = form.closest('header') || form.closest('main');
          if (marker && location.pathname.indexOf('/movie/') !== -1 || location.pathname.indexOf('/category/') !== -1) {
            path = '../search.html';
          }
        }
        location.href = path + (value ? '?q=' + encodeURIComponent(value) : '');
      });
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function start() {
      stop();
      timer = setInterval(function () {
        show(index + 1);
      }, 4800);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupCardFilter() {
    var forms = document.querySelectorAll('[data-card-filter]');
    forms.forEach(function (form) {
      var input = form.querySelector('input');
      var list = document.querySelector('[data-card-list]');
      if (!input || !list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
      function apply() {
        var q = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
          card.classList.toggle('is-hidden', q && text.indexOf(q) === -1);
        });
      }
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });
      input.addEventListener('input', apply);
      if (form.hasAttribute('data-query-sync')) {
        var params = new URLSearchParams(location.search);
        var q = params.get('q') || '';
        if (q) {
          input.value = q;
          apply();
        }
      }
    });
  }

  ready(function () {
    setupMenu();
    setupGlobalSearch();
    setupHero();
    setupCardFilter();
  });
})();
