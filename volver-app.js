/* ===== VOLVER — tema, favoritos, progresso e splash de abertura ===== */
(function(){
  var STORAGE_VISITED = 'volver_visited';
  var STORAGE_FAV = 'volver_favorites';
  var STORAGE_THEME = 'volver_theme';
  var STORAGE_INTRO = 'volver_intro_seen';

  var STAR_ICON = '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2 L12.5 7.5 L18.5 8.3 L14 12.4 L15.2 18.3 L10 15.3 L4.8 18.3 L6 12.4 L1.5 8.3 L7.5 7.5 Z" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8.5 L6 12.5 L14 3.5" stroke="#12162A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SUN_ICON = '<svg class="icon-sun" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke-width="1.4"/><path d="M10 1.5V4M10 16v2.5M2.5 10H5M15 10h2.5M4.6 4.6l1.8 1.8M13.6 13.6l1.8 1.8M4.6 15.4l1.8-1.8M13.6 6.4l1.8-1.8" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var MOON_ICON = '<svg class="icon-moon" viewBox="0 0 20 20" fill="none"><path d="M17 12.5A7.5 7.5 0 1 1 7.5 3 6 6 0 0 0 17 12.5Z" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var BOAT_SVG = '<svg class="intro-boat" viewBox="0 0 52 52" fill="none">' +
      '<path d="M9 24 L15.5 37 H36.5 L43 24" stroke="#2C3459" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M8 24 Q26 18.5 44 24" stroke="#D9A441" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M26 23 V9" stroke="#D9A441" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M26 9 L38.5 16.5 L26 21 Z" fill="#D9A441"/>' +
    '</svg>';

  function readJSON(key){
    try{ return JSON.parse(localStorage.getItem(key)) || {}; }catch(e){ return {}; }
  }
  function writeJSON(key, obj){
    try{ localStorage.setItem(key, JSON.stringify(obj)); }catch(e){}
  }
  function escapeHtml(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function pathParts(){
    var segs = location.pathname.split('/').filter(Boolean);
    var file = segs[segs.length - 1] || 'index.html';
    var folder = segs.length > 1 ? segs[segs.length - 2] : null;
    return { file: file, folder: folder };
  }

  // ---------------- theme ----------------
  function applyTheme(){
    var t = localStorage.getItem(STORAGE_THEME);
    if(t === 'light'){ document.documentElement.setAttribute('data-theme', 'light'); }
    else{ document.documentElement.removeAttribute('data-theme'); }
  }
  function toggleTheme(){
    var cur = localStorage.getItem(STORAGE_THEME) === 'light' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_THEME, cur === 'light' ? 'dark' : 'light');
    applyTheme();
  }
  function injectThemeToggle(){
    var bar = document.querySelector('.brand-bar');
    if(!bar || document.getElementById('volverThemeToggle')) return;
    var btn = document.createElement('button');
    btn.id = 'volverThemeToggle';
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Alternar tema claro/escuro');
    btn.innerHTML = SUN_ICON + MOON_ICON;
    btn.addEventListener('click', toggleTheme);
    var track = bar.querySelector('.brand-track');
    if(track){ bar.insertBefore(btn, track); } else { bar.appendChild(btn); }
  }

  // ---------------- storage helpers ----------------
  function keyOf(category, slug){ return category + '/' + slug; }

  function recordVisit(entry){
    var data = readJSON(STORAGE_VISITED);
    data[keyOf(entry.category, entry.slug)] = {
      title: entry.title, ref: entry.ref, href: entry.href, category: entry.category, ts: Date.now()
    };
    writeJSON(STORAGE_VISITED, data);
  }
  function isVisited(category, slug){
    return !!readJSON(STORAGE_VISITED)[keyOf(category, slug)];
  }
  function toggleFavorite(entry){
    var data = readJSON(STORAGE_FAV);
    var k = keyOf(entry.category, entry.slug);
    if(data[k]){ delete data[k]; }
    else{ data[k] = { title: entry.title, ref: entry.ref, href: entry.href, category: entry.category, ts: Date.now() }; }
    writeJSON(STORAGE_FAV, data);
    return !!data[k];
  }
  function isFavorite(category, slug){
    return !!readJSON(STORAGE_FAV)[keyOf(category, slug)];
  }
  function categoryFromHref(href){
    var segs = href.split('/');
    return segs.length > 1 ? segs[segs.length - 2] : (pathParts().folder || 'geral');
  }

  // ---------------- card enhancement: index.html .show-card rows ----------------
  function enhanceShowCards(scope){
    var cards = (scope || document).querySelectorAll('a.show-card[href]');
    var visited = 0, total = 0;
    cards.forEach(function(card){
      var href = card.getAttribute('href');
      if(!href) return;
      var file = href.split('/').pop();
      if(file.indexOf('licao-') !== 0) return;
      var slug = file.replace(/\.html$/, '');
      var category = categoryFromHref(href);
      total++;
      var thumb = card.querySelector('.show-thumb');
      if(!thumb) return;
      if(!thumb.querySelector('.fav-star-card')){
        var titleEl = card.querySelector('.show-title');
        var refEl = card.querySelector('.show-ref');
        var starBtn = document.createElement('button');
        starBtn.type = 'button';
        starBtn.className = 'fav-star-card';
        starBtn.setAttribute('aria-label', 'Favoritar');
        if(isFavorite(category, slug)) starBtn.classList.add('active');
        starBtn.innerHTML = STAR_ICON;
        starBtn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var now = toggleFavorite({
            category: category, slug: slug,
            title: titleEl ? titleEl.textContent.trim() : slug,
            ref: refEl ? refEl.textContent.trim() : '', href: href
          });
          starBtn.classList.toggle('active', now);
        });
        thumb.appendChild(starBtn);
      }
      if(isVisited(category, slug)){
        visited++;
        if(!thumb.querySelector('.visited-badge')){
          var badge = document.createElement('div');
          badge.className = 'visited-badge';
          badge.innerHTML = CHECK_ICON;
          thumb.appendChild(badge);
        }
      }
    });
    return { visited: visited, total: total };
  }

  // ---------------- card enhancement: hub .p-card grids ----------------
  function enhancePCards(scope){
    var cards = (scope || document).querySelectorAll('a.p-card.available[href]');
    var visited = 0, total = 0;
    var category = pathParts().folder;
    cards.forEach(function(card){
      var href = card.getAttribute('href');
      var slug = href.replace(/\.html$/, '').split('/').pop();
      total++;
      var refElx = card.querySelector('.p-ref');
      if(refElx && !refElx.querySelector('.fav-star-card')){
        var titleEl = card.querySelector('.p-title');
        var starBtn = document.createElement('button');
        starBtn.type = 'button';
        starBtn.className = 'fav-star-card';
        starBtn.setAttribute('aria-label', 'Favoritar');
        if(isFavorite(category, slug)) starBtn.classList.add('active');
        starBtn.innerHTML = STAR_ICON;
        starBtn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var now = toggleFavorite({
            category: category, slug: slug,
            title: titleEl ? titleEl.textContent.trim() : slug,
            ref: refElx.childNodes[0] ? refElx.childNodes[0].textContent.trim() : '', href: category + '/' + href
          });
          starBtn.classList.toggle('active', now);
        });
        refElx.appendChild(starBtn);
      }
      if(isVisited(category, slug)){
        visited++;
        if(refElx && !refElx.querySelector('.visited-tag')){
          var tag = document.createElement('span');
          tag.className = 'visited-tag';
          tag.textContent = 'Assistido';
          refElx.appendChild(tag);
        }
      }
    });
    return { visited: visited, total: total };
  }

  // ---------------- lesson page ----------------
  function enhanceLessonPage(){
    var p = pathParts();
    var category = p.folder;
    if(!category) return;
    var slug = p.file.replace(/\.html$/, '');
    var h1 = document.querySelector('h1');
    var refEl = document.querySelector('.ref-tag');
    var title = h1 ? h1.textContent.trim() : document.title;
    var ref = refEl ? refEl.textContent.trim() : '';
    var href = category + '/' + p.file;
    recordVisit({ category: category, slug: slug, title: title, ref: ref, href: href });

    var bar = document.querySelector('.brand-bar');
    if(bar && !document.getElementById('volverFavBtn')){
      var active = isFavorite(category, slug);
      var favBtn = document.createElement('button');
      favBtn.id = 'volverFavBtn';
      favBtn.type = 'button';
      favBtn.className = 'fav-star-inline' + (active ? ' active' : '');
      favBtn.innerHTML = STAR_ICON + '<span>' + (active ? 'Favoritado' : 'Favoritar') + '</span>';
      favBtn.addEventListener('click', function(){
        var now = toggleFavorite({ category: category, slug: slug, title: title, ref: ref, href: href });
        favBtn.classList.toggle('active', now);
        favBtn.querySelector('span').textContent = now ? 'Favoritado' : 'Favoritar';
      });
      var track = bar.querySelector('.brand-track');
      if(track){ bar.insertBefore(favBtn, track); } else { bar.appendChild(favBtn); }
    }
  }

  // ---------------- hub page ----------------
  function enhanceHubPage(){
    var stats = enhancePCards(document);
    if(stats.total === 0) return;
    var statsRow = document.querySelector('.stats-row');
    if(statsRow && !statsRow.querySelector('.stat-visited')){
      var stat = document.createElement('div');
      stat.className = 'stat stat-visited';
      stat.innerHTML = '<b>' + stats.visited + '</b>vistas';
      statsRow.appendChild(stat);
    }
  }

  // ---------------- homepage: rows, dynamic "continuar"/"favoritos" ----------------
  function buildDynamicRow(cfg){
    var data = readJSON(cfg.storageKey);
    var items = Object.keys(data).map(function(k){ return data[k]; });
    items.sort(function(a, b){ return b.ts - a.ts; });
    if(cfg.limit) items = items.slice(0, cfg.limit);
    if(items.length === 0) return;
    var hero = document.querySelector('.hero-feature');
    if(!hero || document.getElementById(cfg.id)) return;

    var cardsHtml = items.map(function(it){
      return '<a class="show-card" href="' + escapeHtml(it.href) + '">' +
        '<div class="show-thumb">' +
          '<svg class="show-icon" viewBox="0 0 34 34" fill="none">' + cfg.iconInner + '</svg>' +
          '<div class="mini-play"><svg width="8" height="10" viewBox="0 0 8 10" fill="none"><polygon points="0,0 8,5 0,10" fill="#D9A441"/></svg></div>' +
        '</div>' +
        '<div class="show-info">' +
          '<div class="show-title">' + escapeHtml(it.title) + '</div>' +
          '<div class="show-ref">' + escapeHtml(it.ref || '') + '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    var section = document.createElement('section');
    section.className = 'row';
    section.id = cfg.id;
    section.setAttribute('data-has-content', 'true');
    section.innerHTML =
      '<div class="row-head">' +
        '<svg class="row-icon" viewBox="0 0 34 34" fill="none">' + cfg.iconInner + '</svg>' +
        '<h2 class="row-title">' + cfg.title + '</h2>' +
        '<span class="row-count">' + items.length + ' ' + cfg.countSuffix + '</span>' +
      '</div>' +
      '<div class="row-scroll">' + cardsHtml + '</div>';
    hero.insertAdjacentElement('afterend', section);
  }

  function enhanceIndexPage(){
    var rows = document.querySelectorAll('.row[data-has-content="true"]');
    rows.forEach(function(row){
      var stats = enhanceShowCards(row);
      var countEl = row.querySelector('.row-count');
      if(stats.visited > 0 && countEl && countEl.dataset.volverDone !== '1'){
        countEl.textContent += ' · ' + stats.visited + ' vistas';
        countEl.dataset.volverDone = '1';
      }
    });

    buildDynamicRow({
      id: 'rowFavoritos', title: 'Favoritos', storageKey: STORAGE_FAV, countSuffix: 'favoritos',
      iconInner: '<path d="M17 3 L20.5 13 L31 13 L22.5 19.5 L26 30 L17 23.5 L8 30 L11.5 19.5 L3 13 L13.5 13 Z" stroke-width="1.4"/>'
    });
    buildDynamicRow({
      id: 'rowContinuar', title: 'Continuar assistindo', storageKey: STORAGE_VISITED, countSuffix: 'recentes', limit: 10,
      iconInner: '<circle cx="17" cy="17" r="14" stroke-width="1.4"/><path d="M17 9 V17 L23 21" stroke-width="1.4" stroke-linecap="round"/>'
    });
  }

  function buildIntroSplash(){
    if(localStorage.getItem(STORAGE_INTRO) === '1') return;
    var el = document.createElement('div');
    el.className = 'intro-splash';
    el.id = 'volverIntroSplash';
    el.innerHTML = BOAT_SVG + '<div class="intro-word">Volver</div><div class="intro-wake"></div>';
    document.body.insertBefore(el, document.body.firstChild);

    function dismiss(){
      if(el.classList.contains('fade-out')) return;
      el.classList.add('fade-out');
      localStorage.setItem(STORAGE_INTRO, '1');
      setTimeout(function(){ el.remove(); }, 650);
    }
    el.addEventListener('click', dismiss);
    setTimeout(dismiss, 2200);
  }

  // ---------------- boot ----------------
  function init(){
    applyTheme();
    injectThemeToggle();
    var p = pathParts();
    if(p.folder === null && p.file === 'index.html'){
      buildIntroSplash();
      enhanceIndexPage();
    } else if(p.file.indexOf('licao-') === 0){
      enhanceLessonPage();
    } else if(p.file.indexOf('biblioteca-') === 0){
      enhanceHubPage();
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
