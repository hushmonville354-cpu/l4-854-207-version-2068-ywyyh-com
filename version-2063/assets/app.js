(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuButton.textContent = isOpen ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;
  var heroTimer = null;

  function setHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    heroTimer = window.setInterval(function () {
      setHeroSlide(currentSlide + 1);
    }, 5600);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      window.clearInterval(heroTimer);
      setHeroSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      startHero();
    });
  });

  startHero();

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function fillFilterOptions(panel) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var typeSelect = panel.querySelector('.filter-type');
    var yearSelect = panel.querySelector('.filter-year');
    var types = [];
    var years = [];

    cards.forEach(function (card) {
      var type = card.getAttribute('data-type') || '';
      var year = card.getAttribute('data-year') || '';

      if (type && types.indexOf(type) === -1) {
        types.push(type);
      }

      if (year && years.indexOf(year) === -1) {
        years.push(year);
      }
    });

    types.sort();
    years.sort().reverse();

    if (typeSelect) {
      types.forEach(function (type) {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
    }

    if (yearSelect) {
      years.forEach(function (year) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }
  }

  function applyFilters(panel) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var input = panel.querySelector('.filter-input');
    var typeSelect = panel.querySelector('.filter-type');
    var yearSelect = panel.querySelector('.filter-year');
    var count = panel.querySelector('[data-result-count]');
    var keyword = normalize(input ? input.value : '');
    var type = typeSelect ? typeSelect.value : '';
    var year = yearSelect ? yearSelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchedType = !type || card.getAttribute('data-type') === type;
      var matchedYear = !year || card.getAttribute('data-year') === year;
      var matched = matchedKeyword && matchedType && matchedYear;

      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = String(visible);
    }
  }

  var filterPanel = document.querySelector('.page-filter');

  if (filterPanel) {
    fillFilterOptions(filterPanel);

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = filterPanel.querySelector('.filter-input');

    if (input && query) {
      input.value = query;
    }

    filterPanel.addEventListener('input', function () {
      applyFilters(filterPanel);
    });

    filterPanel.addEventListener('change', function () {
      applyFilters(filterPanel);
    });

    applyFilters(filterPanel);
  }

  var video = document.getElementById('movieVideo');
  var trigger = document.querySelector('[data-play-trigger]');
  var playerReady = false;
  var hlsInstance = null;

  function initPlayer() {
    if (!video || playerReady) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    }

    playerReady = true;
  }

  function hideCover() {
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  }

  function showCover() {
    if (trigger && video && video.paused) {
      trigger.classList.remove('is-hidden');
    }
  }

  if (video) {
    initPlayer();

    video.addEventListener('play', hideCover);
    video.addEventListener('pause', showCover);
    video.addEventListener('ended', showCover);
  }

  if (trigger && video) {
    trigger.addEventListener('click', function () {
      initPlayer();
      hideCover();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          showCover();
        });
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
})();
