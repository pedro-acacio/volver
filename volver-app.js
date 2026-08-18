/* ===== VOLVER — tema, favoritos, progresso e splash de abertura ===== */
(function(){
  var STORAGE_VISITED = 'volver_visited';
  var STORAGE_COMPLETED = 'volver_completed';
  var STORAGE_STAGE = 'volver_stage';
  var STORAGE_FAV = 'volver_favorites';
  var STORAGE_THEME = 'volver_theme';
  var STORAGE_FONTSIZE = 'volver_fontsize';
  var STORAGE_ONBOARDING = 'volver_onboarding_seen';

  var STAR_ICON = '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2 L12.5 7.5 L18.5 8.3 L14 12.4 L15.2 18.3 L10 15.3 L4.8 18.3 L6 12.4 L1.5 8.3 L7.5 7.5 Z" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8.5 L6 12.5 L14 3.5" stroke="#12162A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CLOCK_ICON = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#12162A" stroke-width="1.6"/><path d="M8 5 V8 L10.5 9.5" stroke="#12162A" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var SUN_ICON = '<svg class="icon-sun" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke-width="1.4"/><path d="M10 1.5V4M10 16v2.5M2.5 10H5M15 10h2.5M4.6 4.6l1.8 1.8M13.6 13.6l1.8 1.8M4.6 15.4l1.8-1.8M13.6 6.4l1.8-1.8" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var MOON_ICON = '<svg class="icon-moon" viewBox="0 0 20 20" fill="none"><path d="M17 12.5A7.5 7.5 0 1 1 7.5 3 6 6 0 0 0 17 12.5Z" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var BACK_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M10 3 L4 8 L10 13" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SHARE_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M8 10.5V2M8 2L5 5M8 2L11 5M3 8V12.5C3 13.05 3.45 13.5 4 13.5H12C12.55 13.5 13 13.05 13 12.5V8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOWNLOAD_ICON = '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2V10.5M8 10.5L5 7.5M8 10.5L11 7.5M3 13H13" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var INFO_ICON = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke-width="1.4"/><path d="M8 7.2V11.3" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="4.9" r="0.9" fill="currentColor" stroke="none"/></svg>';
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
          '<a class="sidebar-sublink" href="' + root + 'salmos/biblioteca-salmos.html">Salmos</a>' +
          '<a class="sidebar-sublink" href="' + root + 'proverbios/biblioteca-proverbios.html">Provérbios</a>' +
          '<a class="sidebar-sublink" href="' + root + 'personagens/biblioteca-personagens.html">Personagens</a>' +
          '<a class="sidebar-sublink" href="' + root + 'fruto-do-espirito/biblioteca-fruto-do-espirito.html">Fruto do Espírito</a>' +
          '<a class="sidebar-sublink" href="' + root + 'disciplinas-espirituais/biblioteca-disciplinas-espirituais.html">Disciplinas Espirituais</a>' +
          '<a class="sidebar-sublink" href="' + root + 'trindade/biblioteca-trindade.html">Trindade</a>' +
          '<a class="sidebar-sublink" href="' + root + 'mordomia-crista/biblioteca-mordomia-crista.html">Mordomia Cristã</a>' +
          '<a class="sidebar-sublink" href="' + root + 'bem-aventurancas/biblioteca-bem-aventurancas.html">Bem-aventuranças</a>' +
          '<a class="sidebar-sublink" href="' + root + 'sinais-milagrosos/biblioteca-sinais-milagrosos.html">7 Sinais Milagrosos</a>' +
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
      location.href = fallback;
    });
    bar.insertBefore(btn, bar.firstChild);
  }

  function injectMethodologyBanner(target, beforeEl){
    if(!target || document.getElementById('volverMethBanner')) return;
    var root = pathParts().folder ? '../' : '';
    var banner = document.createElement('div');
    banner.className = 'methodology-banner';
    banner.id = 'volverMethBanner';
    banner.innerHTML =
      INFO_ICON +
      '<p><strong>Antes de refletir:</strong> a Volver é um complemento da Bíblia, não um substituto — entenda como usar a plataforma da maneira certa.</p>' +
      '<a href="' + root + 'como-usar.html">Como usar a Volver →</a>';
    if(beforeEl){ target.insertBefore(banner, beforeEl); } else { target.appendChild(banner); }
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

    var brandWord = document.querySelector('.brand-word');
    var brandTrack = document.querySelector('.brand-track');
    var hubHref = brandWord ? brandWord.getAttribute('href') : 'index.html';
    var categoryLabel = brandTrack ? brandTrack.textContent.trim() : 'a categoria';

    var row = document.createElement('div');
    row.className = 'finish-row';

    var btn = document.createElement('button');
    btn.id = 'volverFinishBtn';
    btn.type = 'button';
    btn.className = 'continue-btn' + (done ? ' done' : '');
    btn.disabled = done;
    btn.textContent = done ? 'Reflexão concluída ✓' : 'Finalizar reflexão';
    row.appendChild(btn);
    body.appendChild(row);

    function renderInlineActions(){
      if(document.getElementById('inlineCompleteIcons')) return;
      var icons = document.createElement('div');
      icons.className = 'inline-complete-icons';
      icons.id = 'inlineCompleteIcons';
      icons.innerHTML =
        '<button class="celebrate-icon-btn" id="inlineShareBtn" type="button" title="Compartilhar" aria-label="Compartilhar">' + SHARE_ICON + '</button>' +
        '<button class="celebrate-icon-btn" id="inlinePdfBtn" type="button" title="Baixar como PDF" aria-label="Baixar como PDF">' + DOWNLOAD_ICON + '</button>';
      row.appendChild(icons);

      var backBtn = document.createElement('a');
      backBtn.className = 'celebrate-btn primary inline-complete-back';
      backBtn.href = hubHref;
      backBtn.textContent = 'Voltar para ' + categoryLabel;
      body.insertBefore(backBtn, row.nextSibling);

      bindShareButton(document.getElementById('inlineShareBtn'), entry);
      bindPdfButton(document.getElementById('inlinePdfBtn'));
    }

    if(done){ renderInlineActions(); }

    btn.addEventListener('click', function(){
      markCompleted(entry);
      btn.classList.add('done');
      btn.disabled = true;
      btn.textContent = 'Reflexão concluída ✓';
      renderInlineActions();
      celebrateCompletion(entry, hubHref, categoryLabel);
    });
  }

  function bindShareButton(btn, entry){
    if(!btn) return;
    btn.addEventListener('click', function(){
      var shareText = 'Acabei de concluir "' + entry.title + '"' + (entry.ref ? ' (' + entry.ref + ')' : '') + ' no Volver.';
      var shareUrl = location.href;
      if(navigator.share){
        navigator.share({ title: entry.title, text: shareText, url: shareUrl }).catch(function(){});
      } else if(navigator.clipboard){
        navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(function(){
          var original = btn.innerHTML;
          btn.innerHTML = CHECK_ICON;
          btn.setAttribute('title', 'Copiado!');
          setTimeout(function(){ btn.innerHTML = original; btn.setAttribute('title', 'Compartilhar'); }, 1800);
        });
      }
    });
  }

  function bindPdfButton(btn, beforePrint){
    if(!btn) return;
    btn.addEventListener('click', function(){
      buildPrintOutcomeDual();
      if(beforePrint) beforePrint();
      setTimeout(function(){ window.print(); }, 250);
    });
  }

  function buildPrintOutcomeDual(){
    if(document.getElementById('printOutcomeDual')) return;
    var outcomeCard = document.getElementById('outcomeCard');
    if(!outcomeCard || typeof window.showOutcome !== 'function') return;

    window.showOutcome('worry');
    var worryTitle = (document.getElementById('outcomeTitle') || {}).textContent || '';
    var worryText = (document.getElementById('outcomeText') || {}).textContent || '';

    window.showOutcome('calm');
    var calmTitle = (document.getElementById('outcomeTitle') || {}).textContent || '';
    var calmText = (document.getElementById('outcomeText') || {}).textContent || '';

    if(!worryTitle || !calmTitle) return;

    var dual = document.createElement('div');
    dual.id = 'printOutcomeDual';
    dual.className = 'print-outcome-dual';
    dual.innerHTML =
      '<div class="print-outcome-block worry"><span class="poc-tag">Padrão a evitar</span><h3>' + worryTitle + '</h3><p>' + worryText + '</p></div>' +
      '<div class="print-outcome-block calm"><span class="poc-tag">Padrão a seguir</span><h3>' + calmTitle + '</h3><p>' + calmText + '</p></div>';
    outcomeCard.insertAdjacentElement('afterend', dual);
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
      '<div class="celebrate-head">' +
        '<div class="celebrate-title">Reflexão concluída!</div>' +
        '<div class="celebrate-icons">' +
          '<button class="celebrate-icon-btn" id="celebrateShare" type="button" title="Compartilhar" aria-label="Compartilhar">' + SHARE_ICON + '</button>' +
          '<button class="celebrate-icon-btn" id="celebratePdf" type="button" title="Baixar como PDF" aria-label="Baixar como PDF">' + DOWNLOAD_ICON + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="celebrate-sub">' + entry.title + (entry.ref ? ' · ' + entry.ref : '') + '</div>' +
      '<a class="celebrate-btn primary celebrate-back" href="' + hubHref + '">Voltar para ' + categoryLabel + '</a>';

    modal.insertBefore(burst, modal.firstChild);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    requestAnimationFrame(function(){ backdrop.classList.add('open'); });

    function close(){
      backdrop.classList.remove('open');
      setTimeout(function(){ backdrop.remove(); }, 300);
    }
    backdrop.addEventListener('click', function(e){ if(e.target === backdrop) close(); });
    modal.querySelector('#celebrateClose').addEventListener('click', close);

    bindShareButton(modal.querySelector('#celebrateShare'), entry);
    bindPdfButton(modal.querySelector('#celebratePdf'), close);
  }

  // ---------------- hub page ----------------
  function enhanceHubPage(){
    var stats = enhancePCards(document);
    injectMethodologyBanner(document.querySelector('.hero'));
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
    var wrap = document.querySelector('.wrap');
    var heroFeature = document.querySelector('.hero-feature');
    if(wrap && heroFeature){ injectMethodologyBanner(wrap, heroFeature); }
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
      setTimeout(function(){ el.remove(); maybeShowOnboarding(); }, 650);
    }
    el.addEventListener('click', dismiss);
    setTimeout(dismiss, 2200);
  }

  // ---------------- onboarding carousel ----------------
  function maybeShowOnboarding(){
    if(localStorage.getItem(STORAGE_ONBOARDING) === '1') return;
    buildOnboardingCarousel();
  }

  function buildOnboardingCarousel(){
    var slides = [
      {
        eyebrow: '1 de 6 · Sobre a Volver',
        title: 'O que é a Volver',
        body: '<p>A Volver é uma metodologia para ajudar sua mente a se encontrar com os ensinamentos bíblicos, de um jeito visual e interativo.</p>' +
              '<p>Mas isso <strong>não</strong> significa que os textos bíblicos foram escritos para uma aplicação pessoal simples — como uma fórmula pronta para qualquer situação da sua vida.</p>'
      },
      {
        eyebrow: '2 de 6 · Um aviso necessário',
        title: 'Não é sobre se sentir bem',
        body: '<p>Cada texto bíblico foi escrito por inspiração divina, em épocas, culturas, línguas e contextos muito diferentes dos nossos — com história, personagens reais e propósitos teológicos específicos para o que estava sendo descrito.</p>' +
              '<p>Não foram escritos apenas para que alguém, hoje, se sinta bem ou compare o texto diretamente com um problema pessoal.</p>'
      },
      {
        eyebrow: '3 de 6 · O propósito',
        title: 'Conhecer a Deus de verdade',
        body: '<p>A Bíblia existe para revelar quem Deus é — do jeito que Ele mesmo escolheu se revelar aqui na Terra.</p>' +
              '<p>É por meio dessa revelação que podemos estudar, conhecer a Deus verdadeiramente, e viver o nosso dia a dia com obediência e sabedoria a partir do que Ele mostrou de si mesmo.</p>'
      },
      {
        eyebrow: '4 de 6 · Contexto importa',
        title: 'Microvisão x macrovisão',
        body: '<p><strong>Microvisão</strong> é ler só o versículo solto. <strong>Macrovisão</strong> é ler o texto dentro do seu contexto: quem escreveu, para quem, quando e por quê.</p>' +
              '<p>Ex.: Jeremias 29:11 citado sozinho vira "promessa de sucesso pessoal" — no contexto (Jr 29:1-14), é uma promessa à nação exilada, cumprida só depois de setenta anos.</p>' +
              '<p><a href="como-usar.html#exemplo">Veja o exemplo completo →</a></p>'
      },
      {
        eyebrow: '5 de 6 · Como usar',
        title: 'Um complemento, não um substituto',
        body: '<p>A Volver não substitui a leitura da Bíblia — ela serve para trazer reflexão <strong>depois</strong> dela.</p>' +
              '<p>O ideal é ler a passagem primeiro, conhecer o contexto, e só então abrir a reflexão como um fechamento — nunca como a única fonte do que o texto significa.</p>' +
              '<p><a href="como-usar.html#uso">Veja exemplos certos e errados →</a></p>'
      },
      {
        eyebrow: '6 de 6 · Pronto',
        title: 'Por isso, "reflexão"',
        body: '<p>Essas páginas se chamam <strong>reflexão</strong>, não "lição": não é uma aula que ensina o que o texto significa, é um espaço para pensar sobre o que você já leu.</p>' +
              '<p>Leia a Bíblia, conheça o contexto, depois reflita com a Volver.</p>'
      }
    ];

    var i = 0;
    var backdrop = document.createElement('div');
    backdrop.className = 'onboard-backdrop';
    backdrop.id = 'volverOnboard';
    var dotsHtml = slides.map(function(_, idx){ return '<span class="onboard-dot' + (idx === 0 ? ' active' : '') + '"></span>'; }).join('');
    backdrop.innerHTML =
      '<div class="onboard-modal">' +
        '<div class="onboard-dots">' + dotsHtml + '</div>' +
        '<div class="onboard-eyebrow" id="onbEyebrow"></div>' +
        '<h2 class="onboard-title" id="onbTitle"></h2>' +
        '<div class="onboard-body" id="onbBody"></div>' +
        '<div class="onboard-nav">' +
          '<button id="onbBack" class="onboard-btn ghost" type="button">Voltar</button>' +
          '<button id="onbNext" class="onboard-btn primary" type="button">Avançar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
    setTimeout(function(){ backdrop.classList.add('open'); }, 20);

    var eyebrowEl = backdrop.querySelector('#onbEyebrow');
    var titleEl = backdrop.querySelector('#onbTitle');
    var bodyEl = backdrop.querySelector('#onbBody');
    var backBtn = backdrop.querySelector('#onbBack');
    var nextBtn = backdrop.querySelector('#onbNext');
    var dots = backdrop.querySelectorAll('.onboard-dot');
    var modalEl = backdrop.querySelector('.onboard-modal');

    function render(){
      var s = slides[i];
      eyebrowEl.textContent = s.eyebrow;
      titleEl.textContent = s.title;
      bodyEl.innerHTML = s.body;
      dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
      backBtn.classList.toggle('is-hidden', i === 0);
      nextBtn.textContent = i === slides.length - 1 ? 'Entrar na Volver' : 'Avançar';
      modalEl.scrollTop = 0;
    }
    render();

    backBtn.addEventListener('click', function(){
      if(i > 0){ i--; render(); }
    });
    nextBtn.addEventListener('click', function(){
      if(i < slides.length - 1){ i++; render(); return; }
      localStorage.setItem(STORAGE_ONBOARDING, '1');
      backdrop.classList.remove('open');
      setTimeout(function(){ backdrop.remove(); }, 300);
    });
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
    } else {
      injectBackButton();
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
