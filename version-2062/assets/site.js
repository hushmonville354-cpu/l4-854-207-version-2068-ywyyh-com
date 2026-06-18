(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = [...hero.querySelectorAll('[data-hero-slide]')];
    const dots = [...hero.querySelectorAll('[data-hero-dot]')];
    let current = 0;

    const activate = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        activate(Number(dot.dataset.heroDot || '0'));
      });
    });

    if (slides.length > 1) {
      window.setInterval(() => activate(current + 1), 5200);
    }
  }

  document.querySelectorAll('[data-filter-grid]').forEach((grid) => {
    const section = grid.closest('.section') || document;
    const input = section.querySelector('[data-filter-input]');
    const count = section.querySelector('[data-filter-count]');
    const cards = [...grid.querySelectorAll('[data-filter-card]')];

    const update = () => {
      const keyword = (input?.value || '').trim().toLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.year,
        ].join(' ').toLowerCase();
        const matched = !keyword || haystack.includes(keyword);
        card.style.display = matched ? '' : 'none';
        if (matched) visible += 1;
      });

      if (count) {
        count.textContent = `显示 ${visible} / ${cards.length} 部`;
      }
    };

    if (input) {
      input.addEventListener('input', update);
      update();
    }
  });
})();
