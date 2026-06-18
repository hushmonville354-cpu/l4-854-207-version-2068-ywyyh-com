(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-site-nav]');

        if (menuButton && nav) {
            menuButton.addEventListener('click', function () {
                var opened = nav.classList.toggle('is-open');
                menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var index = 0;
            var timer = null;

            function show(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === index);
                });
            }

            function start() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                    start();
                });
            });

            show(0);
            start();
        }

        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-filter-input]');
            var region = panel.querySelector('[data-filter-region]');
            var type = panel.querySelector('[data-filter-type]');
            var category = panel.querySelector('[data-filter-category]');
            var list = panel.parentElement.querySelector('[data-filter-list]');
            var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')) : [];

            function normalize(value) {
                return String(value || '').toLowerCase().replace(/\s+/g, '');
            }

            function apply() {
                var term = normalize(input ? input.value : '');
                var regionValue = region ? region.value : '';
                var typeValue = type ? type.value : '';
                var categoryValue = category ? category.value : '';

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-category'),
                        card.getAttribute('data-tags')
                    ].join(' '));
                    var matchedTerm = !term || haystack.indexOf(term) > -1;
                    var matchedRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                    var matchedType = !typeValue || card.getAttribute('data-type') === typeValue;
                    var matchedCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
                    card.classList.toggle('hidden', !(matchedTerm && matchedRegion && matchedType && matchedCategory));
                });
            }

            [input, region, type, category].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
        });
    });
})();
