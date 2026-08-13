/* ===== VOLVER — tema, favoritos, progresso e splash de abertura ===== */
(function(){
  var STORAGE_VISITED = 'volver_visited';
  var STORAGE_COMPLETED = 'volver_completed';
  var STORAGE_STAGE = 'volver_stage';
  var STORAGE_FAV = 'volver_favorites';
  var STORAGE_THEME = 'volver_theme';
  var STORAGE_INTRO = 'volver_intro_seen';
  var STORAGE_FONTSIZE = 'volver_fontsize';

  var STAR_ICON = '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2 L12.5 7.5 L18.5 8.3 L14 12.4 L15.2 18.3 L10 15.3 L4.8 18.3 L6 12.4 L1.5 8.3 L7.5 7.5 Z" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8.5 L6 12.5 L14 3.5" stroke="#12162A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CLOCK_ICON = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#12162A" stroke-width="1.6"/><path d="M8 5 V8 L10.5 9.5" stroke="#12162A" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var SUN_ICON = '<svg class="icon-sun" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke-width="1.4"/><path d="M10 1.5V4M10 16v2.5M2.5 10H5M15 10h2.5M4.6 4.6l1.8 1.8M13.6 13.6l1.8 1.8M4.6 15.4l1.8-1.8M13.6 6.4l1.8-1.8" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var MOON_ICON = '<svg class="icon-moon" viewBox="0 0 20 20" fill="none"><path d="M17 12.5A7.5 7.5 0 1 1 7.5 3 6 6 0 0 0 17 12.5Z" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var BACK_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M10 3 L4 8 L10 13" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var BOAT_SVG = '<svg class="intro-boat" viewBox="0 0 52 52" fill="none">' +
      '<path d="M9 25 L20 35 L32 35 L43 25" stroke="#2C3459" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M9 25 L26 8 L43 25 Z" fill="#D9A441"/>' +
      '<path d="M26 8 L26 25" stroke="#2C3459" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>';

  function readJSON(key){
    try{ return JSON.parse(localStorage.getItem(key)) || {}; }catch(e){ return {}; }
  }
  function writeJSON(key, obj){
    try{ localStorage.setItem(key, JSON.stringify(obj)); }catch(e){}
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
  function applyFontSize(){
    var f = localStorage.getItem(STORAGE_FONTSIZE);
    if(f === 'large'){ document.documentElement.setAttribute('data-fontsize', 'large'); }
    else{ document.documentElement.removeAttribute('data-fontsize'); }
  }
  function toggleFontSize(){
    var cur = localStorage.getItem(STORAGE_FONTSIZE) === 'large' ? 'large' : 'normal';
    localStorage.setItem(STORAGE_FONTSIZE, cur === 'large' ? 'normal' : 'large');
    applyFontSize();
  }

  function clearProgress(){
    localStorage.removeItem(STORAGE_VISITED);
    localStorage.removeItem(STORAGE_COMPLETED);
    localStorage.removeItem(STORAGE_STAGE);
    localStorage.removeItem(STORAGE_FAV);
  }

  function getSummary(){
    var completedMap = readJSON(STORAGE_COMPLETED);
    var visitedMap = readJSON(STORAGE_VISITED);
    var favMap = readJSON(STORAGE_FAV);
    var completedKeys = Object.keys(completedMap);
    function toList(map, excludeKeys){
      return Object.keys(map)
        .filter(function(k){ return !excludeKeys || excludeKeys.indexOf(k) === -1; })
        .map(function(k){ return map[k]; })
        .sort(function(a, b){ return b.ts - a.ts; });
    }
    return {
      completed: toList(completedMap),
      inProgress: toList(visitedMap, completedKeys),
      favorites: toList(favMap)
    };
  }

  function injectSidebar(){
    if(document.getElementById('volverSidebar')) return;
    var root = pathParts().folder ? '../' : '';
    var brandBoat = BOAT_SVG.replace('class="intro-boat"', '');

    var nav = document.createElement('nav');
    nav.id = 'volverSidebar';
    nav.className = 'volver-sidebar';
    nav.innerHTML =
      '<div class="sidebar-head">' +
        '<a class="sidebar-brand" href="' + root + 'index.html">' + brandBoat + '<span>Volver</span></a>' +
        '<button id="volverSidebarClose" class="sidebar-close" type="button" aria-label="Fechar menu">&times;</button>' +
      '</div>' +
      '<div class="sidebar-nav">' +
        '<button id="sidebarHomeToggle" class="sidebar-toggle" type="button">' +
          '<span>Início</span>' +
          '<svg class="chev" viewBox="0 0 10 10" fill="none"><path d="M3 1 L7 5 L3 9" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<div class="sidebar-lessons" id="sidebarLessons">' +
          '<a class="sidebar-sublink" href="' + root + 'parabolas/biblioteca-parabolas.html">Parábolas</a>' +
          '<a class="sidebar-sublink" href="' + root + 'livros/biblioteca-livros.html">Livros</a>' +
          '<a class="sidebar-sublink" href="' + root + 'index.html">Salmos</a>' +
          '<a class="sidebar-sublink" href="' + root + 'proverbios/biblioteca-proverbios.html">Provérbios</a>' +
          '<a class="sidebar-sublink" href="' + root + 'personagens/biblioteca-personagens.html">Personagens</a>' +
          '<a class="sidebar-sublink" href="' + root + 'fruto-do-espirito/biblioteca-fruto-do-espirito.html">Fruto do Espírito</a>' +
          '<a class="sidebar-sublink" href="' + root + 'disciplinas-espirituais/biblioteca-disciplinas-espirituais.html">Disciplinas Espirituais</a>' +
          '<a class="sidebar-sublink" href="' + root + 'trindade/biblioteca-trindade.html">Trindade</a>' +
        '</div>' +
        '<a class="sidebar-link" href="' + root + 'favoritos.html">Favoritos</a>' +
        '<a class="sidebar-link" href="' + root + 'continue-a-volver.html">Continue a Volver</a>' +
        '<a class="sidebar-link" href="' + root + 'perfil.html">Perfil</a>' +
        '<a class="sidebar-link" href="' + root + 'configuracoes.html">Configurações</a>' +
      '</div>' +
      '<div class="sidebar-foot"></div>';

    var backdrop = document.createElement('div');
    backdrop.id = 'volverSidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';

    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(nav, document.body.firstChild);

    var themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Alternar tema claro/escuro');
    themeBtn.innerHTML = SUN_ICON + MOON_ICON;
    themeBtn.addEventListener('click', toggleTheme);
    var foot = nav.querySelector('.sidebar-foot');
    foot.appendChild(themeBtn);
    var themeLabel = document.createElement('span');
    themeLabel.textContent = 'Tema';
    foot.appendChild(themeLabel);

    function openSidebar(){ nav.classList.add('open'); backdrop.classList.add('open'); }
    function closeSidebar(){ nav.classList.remove('open'); backdrop.classList.remove('open'); }
    backdrop.addEventListener('click', closeSidebar);
    nav.querySelector('#volverSidebarClose').addEventListener('click', closeSidebar);

    var homeToggle = nav.querySelector('#sidebarHomeToggle');
    var lessonsPanel = nav.querySelector('#sidebarLessons');
    homeToggle.addEventListener('click', function(){
      homeToggle.classList.toggle('open');
      lessonsPanel.classList.toggle('open');
    });

    var bar = document.querySelector('.brand-bar');
    if(bar && !document.getElementById('volverMenuBtn')){
      var menuBtn = document.createElement('button');
      menuBtn.id = 'volverMenuBtn';
      menuBtn.type = 'button';
      menuBtn.className = 'menu-btn';
      menuBtn.setAttribute('aria-label', 'Abrir menu');
      menuBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke-width="1.6" stroke-linecap="round"/></svg>';
      menuBtn.addEventListener('click', openSidebar);
      bar.insertBefore(menuBtn, bar.firstChild);
    }
  }

  function injectBackButton(){
    var bar = document.querySelector('.brand-bar');
    if(!bar || document.getElementById('volverBackBtn')) return;
    var brandWord = bar.querySelector('.brand-word');
    var fallback = brandWord ? brandWord.getAttribute('href') : 'index.html';
    var btn = document.createElement('button');
    btn.id = 'volverBackBtn';
    btn.type = 'button';
    btn.className = 'back-btn';
    btn.setAttribute('aria-label', 'Voltar');
    btn.innerHTML = BACK_ICON + '<span>Voltar</span>';
    btn.addEventListener('click', function(){
      if(history.length > 1){ history.back(); }
      else{ location.href = fallback; }
    });
    bar.insertBefore(btn, bar.firstChild);
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
  function markCompleted(entry){
    var data = readJSON(STORAGE_COMPLETED);
    data[keyOf(entry.category, entry.slug)] = {
      title: entry.title, ref: entry.ref, href: entry.href, category: entry.category, ts: Date.now()
    };
    writeJSON(STORAGE_COMPLETED, data);
  }
  function isCompleted(category, slug){
    return !!readJSON(STORAGE_COMPLETED)[keyOf(category, slug)];
  }
  function saveStage(category, slug, n){
    var data = readJSON(STORAGE_STAGE);
    data[keyOf(category, slug)] = n;
    writeJSON(STORAGE_STAGE, data);
  }
  function getStage(category, slug){
    return readJSON(STORAGE_STAGE)[keyOf(category, slug)] || 0;
  }
  function categoryFromHref(href){
    var segs = href.split('/');
    return segs.length > 1 ? segs[segs.length - 2] : (pathParts().folder || 'geral');
  }

  // ---------------- card enhancement: index.html .show-card rows ----------------
  function enhanceShowCards(scope){
    var cards = (scope || document).querySelectorAll('a.show-card[href]');
    var completed = 0, total = 0;
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
      if(isCompleted(category, slug)){
        completed++;
        if(!thumb.querySelector('.completed-badge') && !thumb.querySelector('.progress-badge')){
          var badge = document.createElement('div');
          badge.className = 'completed-badge';
          badge.innerHTML = CHECK_ICON;
          thumb.appendChild(badge);
        }
      } else if(isVisited(category, slug)){
        if(!thumb.querySelector('.progress-badge') && !thumb.querySelector('.completed-badge')){
          var pbadge = document.createElement('div');
          pbadge.className = 'progress-badge';
          pbadge.innerHTML = CLOCK_ICON;
          thumb.appendChild(pbadge);
        }
      }
    });
    return { completed: completed, total: total };
  }

  // ---------------- card enhancement: hub .p-card grids ----------------
  function enhancePCards(scope){
    var cards = (scope || document).querySelectorAll('a.p-card.available[href]');
    var completed = 0, total = 0;
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
      if(isCompleted(category, slug)){
        completed++;
        if(refElx && !refElx.querySelector('.completed-tag') && !refElx.querySelector('.progress-tag')){
          var tag = document.createElement('span');
          tag.className = 'completed-tag';
          tag.textContent = 'Concluído';
          refElx.appendChild(tag);
        }
      } else if(isVisited(category, slug)){
        if(refElx && !refElx.querySelector('.progress-tag') && !refElx.querySelector('.completed-tag')){
          var ptag = document.createElement('span');
          ptag.className = 'progress-tag';
          ptag.textContent = 'Em andamento';
          refElx.appendChild(ptag);
        }
      }
    });
    return { completed: completed, total: total };
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
    var entry = { category: category, slug: slug, title: title, ref: ref, href: href };
    recordVisit(entry);

    var bar = document.querySelector('.brand-bar');
    if(bar && !document.getElementById('volverFavBtn')){
      var active = isFavorite(category, slug);
      var favBtn = document.createElement('button');
      favBtn.id = 'volverFavBtn';
      favBtn.type = 'button';
      favBtn.className = 'fav-star-inline' + (active ? ' active' : '');
      favBtn.innerHTML = STAR_ICON + '<span>' + (active ? 'Favoritado' : 'Favoritar') + '</span>';
      favBtn.addEventListener('click', function(){
        var now = toggleFavorite(entry);
        favBtn.classList.toggle('active', now);
        favBtn.querySelector('span').textContent = now ? 'Favoritado' : 'Favoritar';
      });
      var track = bar.querySelector('.brand-track');
      if(track){ bar.insertBefore(favBtn, track); } else { bar.appendChild(favBtn); }
    }

    injectFinishButton(entry);
    resumeAndTrackStage(entry);
  }

  function resumeAndTrackStage(entry){
    if(typeof window.openStage !== 'function' || isCompleted(entry.category, entry.slug)) return;
    var orig = window.openStage;
    window.openStage = function(n){
      orig(n);
      if(!isCompleted(entry.category, entry.slug)){
        saveStage(entry.category, entry.slug, n);
      }
    };
    var saved = getStage(entry.category, entry.slug);
    if(saved > 1){
      try{ if(typeof currentMax !== 'undefined'){ currentMax = saved; } }catch(e){}
      window.openStage(saved);
    }
  }

  function injectFinishButton(entry){
    var items = document.querySelectorAll('.tl-item');
    if(items.length === 0 || document.getElementById('volverFinishBtn')) return;
    var body = items[items.length - 1].querySelector('.tl-body');
    if(!body) return;
    var done = isCompleted(entry.category, entry.slug);
    var btn = document.createElement('button');
    btn.id = 'volverFinishBtn';
    btn.type = 'button';
    btn.className = 'continue-btn' + (done ? ' done' : '');
    btn.disabled = done;
    btn.textContent = done ? 'Lição concluída ✓' : 'Finalizar lição';
    btn.addEventListener('click', function(){
      markCompleted(entry);
      btn.classList.add('done');
      btn.disabled = true;
      btn.textContent = 'Lição concluída ✓';
      var brandWord = document.querySelector('.brand-word');
      var brandTrack = document.querySelector('.brand-track');
      var hubHref = brandWord ? brandWord.getAttribute('href') : 'index.html';
      var categoryLabel = brandTrack ? brandTrack.textContent.trim() : 'a categoria';
      celebrateCompletion(entry, hubHref, categoryLabel);
    });
    body.appendChild(btn);
  }

  function celebrateCompletion(entry, hubHref, categoryLabel){
    var old = document.getElementById('volverCelebrate');
    if(old) old.remove();

    var backdrop = document.createElement('div');
    backdrop.className = 'celebrate-backdrop';
    backdrop.id = 'volverCelebrate';

    var burst = document.createElement('div');
    burst.className = 'celebrate-burst';
    burst.innerHTML =
      '<div class="celebrate-ring r1"></div>' +
      '<div class="celebrate-ring r2"></div>' +
      '<div class="celebrate-check">' + CHECK_ICON + '</div>';

    var colors = ['#D9A441', '#7C9A78', '#A85C6B'];
    for(var i = 0; i < 12; i++){
      var p = document.createElement('div');
      p.className = 'confetti-piece';
      var angle = Math.random() * Math.PI * 2;
      var dist = 70 + Math.random() * 70;
      p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
      p.style.setProperty('--dy', (Math.sin(angle) * dist - 20) + 'px');
      p.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.18) + 's';
      burst.appendChild(p);
    }

    var modal = document.createElement('div');
    modal.className = 'celebrate-modal';
    modal.innerHTML =
      '<button class="celebrate-close" id="celebrateClose" type="button" aria-label="Fechar">&times;</button>' +
      '<div class="celebrate-title">Lição concluída!</div>' +
      '<div class="celebrate-sub">' + entry.title + (entry.ref ? ' · ' + entry.ref : '') + '</div>' +
      '<div class="celebrate-actions">' +
        '<button class="celebrate-btn primary" id="celebrateShare" type="button">Compartilhar</button>' +
        '<button class="celebrate-btn" id="celebratePdf" type="button">Baixar como PDF</button>' +
        '<a class="celebrate-btn" href="' + hubHref + '">Voltar para ' + categoryLabel + '</a>' +
      '</div>';

    backdrop.appendChild(burst);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    requestAnimationFrame(function(){ backdrop.classList.add('open'); });

    function close(){
      backdrop.classList.remove('open');
      setTimeout(function(){ backdrop.remove(); }, 300);
    }
    backdrop.addEventListener('click', function(e){ if(e.target === backdrop) close(); });
    modal.querySelector('#celebrateClose').addEventListener('click', close);

    modal.querySelector('#celebrateShare').addEventListener('click', function(){
      var shareText = 'Acabei de concluir "' + entry.title + '"' + (entry.ref ? ' (' + entry.ref + ')' : '') + ' no Volver.';
      var shareUrl = location.href;
      var shareBtn = modal.querySelector('#celebrateShare');
      if(navigator.share){
        navigator.share({ title: entry.title, text: shareText, url: shareUrl }).catch(function(){});
      } else if(navigator.clipboard){
        navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(function(){
          var original = shareBtn.textContent;
          shareBtn.textContent = 'Copiado!';
          setTimeout(function(){ shareBtn.textContent = original; }, 1800);
        });
      }
    });

    modal.querySelector('#celebratePdf').addEventListener('click', function(){
      close();
      setTimeout(function(){ window.print(); }, 250);
    });
  }

  // ---------------- hub page ----------------
  function enhanceHubPage(){
    var stats = enhancePCards(document);
    if(stats.total === 0) return;
    var statsRow = document.querySelector('.stats-row');
    if(statsRow && !statsRow.querySelector('.stat-completed')){
      var stat = document.createElement('div');
      stat.className = 'stat stat-completed';
      stat.innerHTML = '<b>' + stats.completed + '</b>concluídas';
      statsRow.appendChild(stat);
    }
  }

  // ---------------- homepage ----------------
  function enhanceIndexPage(){
    var rows = document.querySelectorAll('.row[data-has-content="true"]');
    rows.forEach(function(row){
      var stats = enhanceShowCards(row);
      var countEl = row.querySelector('.row-count');
      if(stats.completed > 0 && countEl && countEl.dataset.volverDone !== '1'){
        countEl.textContent += ' · ' + stats.completed + ' concluídas';
        countEl.dataset.volverDone = '1';
      }
    });
  }

  function buildIntroSplash(){
    if(localStorage.getItem(STORAGE_INTRO) === '1') return;
    var el = document.createElement('div');
    el.className = 'intro-splash';
    el.id = 'volverIntroSplash';
    el.innerHTML =
      '<div class="intro-boat-wrap">' +
        '<svg class="intro-ripples" viewBox="0 0 140 40" fill="none">' +
          '<ellipse class="ring r1" cx="70" cy="24" rx="26" ry="6"/>' +
          '<ellipse class="ring r2" cx="70" cy="24" rx="26" ry="6"/>' +
          '<ellipse class="ring r3" cx="70" cy="24" rx="26" ry="6"/>' +
        '</svg>' +
        BOAT_SVG +
      '</div>' +
      '<div class="intro-word">Volver</div>';
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
    applyFontSize();
    var p = pathParts();
    if(p.folder === null && p.file === 'index.html'){
      buildIntroSplash();
      enhanceIndexPage();
      injectSidebar();
    } else if(p.file.indexOf('licao-') === 0){
      injectBackButton();
      enhanceLessonPage();
    } else if(p.file.indexOf('biblioteca-') === 0){
      injectBackButton();
      enhanceHubPage();
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Volver = {
    toggleTheme: toggleTheme,
    isLightTheme: function(){ return localStorage.getItem(STORAGE_THEME) === 'light'; },
    toggleFontSize: toggleFontSize,
    isLargeFont: function(){ return localStorage.getItem(STORAGE_FONTSIZE) === 'large'; },
    clearProgress: clearProgress,
    getSummary: getSummary
  };
})();
