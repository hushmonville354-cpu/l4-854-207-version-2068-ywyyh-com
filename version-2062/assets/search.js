(() => {
  const movies = window.MOVIES_INDEX || [];
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const summary = document.getElementById('searchSummary');

  if (!input || !results || !summary) {
    return;
  }

  input.value = initialQuery;

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const card = (movie) => {
    const tags = (movie.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
    return `
      <article class="movie-card">
        <a class="poster" href="${escapeHtml(movie.detail)}" aria-label="查看${escapeHtml(movie.title)}详情">
          <img class="poster-img" src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}封面" loading="lazy" onerror="this.closest('.poster').classList.add('poster-missing'); this.remove();" />
          <span class="play-float">▶</span>
        </a>
        <div class="movie-card-body">
          <div class="movie-meta">
            <span>${escapeHtml(movie.region)}</span>
            <span>${escapeHtml(movie.year)}</span>
          </div>
          <h3><a href="${escapeHtml(movie.detail)}">${escapeHtml(movie.title)}</a></h3>
          <p>${escapeHtml(movie.oneLine || '')}</p>
          <div class="tag-row">${tags}</div>
        </div>
      </article>`;
  };

  const render = () => {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      summary.textContent = '请输入关键词开始搜索。';
      results.innerHTML = '';
      return;
    }

    const words = query.split(/\s+/).filter(Boolean);
    const matched = movies.filter((movie) => {
      const haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine,
      ].join(' ').toLowerCase();
      return words.every((word) => haystack.includes(word));
    }).slice(0, 120);

    summary.textContent = `关键词“${input.value.trim()}”匹配到 ${matched.length} 部影片${matched.length === 120 ? '，当前显示前 120 部' : ''}。`;
    results.innerHTML = matched.map(card).join('');
  };

  input.addEventListener('input', render);
  render();
})();
