(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var results = document.getElementById("search-results");
    var title = document.getElementById("search-title");
    if (!results || !Array.isArray(window.movieSearchIndex || movieSearchIndex)) {
      return;
    }

    var data = window.movieSearchIndex || movieSearchIndex;
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim().toLowerCase();
    var matches = query ? data.filter(function (movie) {
      var text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        movie.oneLine,
        (movie.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return text.indexOf(query) !== -1;
    }) : data.slice(0, 48);

    if (title) {
      title.textContent = query ? "搜索结果" : "精选影片";
    }

    if (!matches.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配内容，可以尝试输入地区、年份、类型或片名。</div>';
      return;
    }

    results.innerHTML = matches.slice(0, 120).map(function (movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join("");
      return '<a class="movie-card" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">' +
        '<span class="poster" style="background-image: linear-gradient(180deg, rgba(8, 6, 30, 0.05), rgba(8, 6, 30, 0.86)), url(\'' + escapeHtml(movie.cover) + '\');">' +
          '<span class="poster-year">' + escapeHtml(movie.year) + '</span>' +
          '<span class="poster-region">' + escapeHtml(movie.region) + '</span>' +
        '</span>' +
        '<span class="card-content">' +
          '<strong>' + escapeHtml(movie.title) + '</strong>' +
          '<em>' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</em>' +
          '<span class="card-text">' + escapeHtml(movie.oneLine) + '</span>' +
          '<span class="mini-tags">' + tags + '</span>' +
        '</span>' +
      '</a>';
    }).join("");
  });
})();
