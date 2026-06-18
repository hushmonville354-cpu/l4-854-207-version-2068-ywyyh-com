(function () {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".menu-toggle");

    if (header && toggle) {
        toggle.addEventListener("click", function () {
            var open = header.classList.toggle("open");
            document.body.classList.toggle("nav-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-slide")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    var grid = document.querySelector("[data-filterable]");

    if (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        var input = document.querySelector(".site-search-input");
        var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
        var activeFilter = "all";
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function searchableText(card) {
            return normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" "));
        }

        function applyFilters() {
            var text = normalize(input ? input.value : "");
            var filter = normalize(activeFilter);

            cards.forEach(function (card) {
                var haystack = searchableText(card);
                var matchText = !text || haystack.indexOf(text) !== -1;
                var matchFilter = filter === "all" || haystack.indexOf(filter) !== -1;
                card.classList.toggle("hidden-by-filter", !(matchText && matchFilter));
            });
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove("active");
                });
                button.classList.add("active");
                activeFilter = button.getAttribute("data-filter") || "all";
                applyFilters();
            });
        });

        applyFilters();
    }
})();
