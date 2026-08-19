/* ===== VOLVER — tema, tamanho de texto, idioma, favoritos, progresso e splash de abertura ===== */
(function(){
  var STORAGE_VISITED = 'volver_visited';
  var STORAGE_COMPLETED = 'volver_completed';
  var STORAGE_STAGE = 'volver_stage';
  var STORAGE_FAV = 'volver_favorites';
  var STORAGE_THEME = 'volver_theme';
  var STORAGE_FONTSIZE = 'volver_fontsize';
  var STORAGE_LANG = 'volver_lang';
  var STORAGE_SESSION_SHOWN = 'volver_session_shown';

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

  // ---------------- font size (5-level scale) ----------------
  var FONT_SIZE_ZOOM = [0.9, 0.95, 1, 1.12, 1.25];
  var FONT_SIZE_DEFAULT = 2;
  var FONT_SIZE_KEYS = ['fontsize_0', 'fontsize_1', 'fontsize_2', 'fontsize_3', 'fontsize_4'];

  function getFontSizeIndex(){
    var raw = localStorage.getItem(STORAGE_FONTSIZE);
    if(raw === 'large') return 3; // migrate old binary value
    if(raw === 'normal') return FONT_SIZE_DEFAULT;
    var n = parseInt(raw, 10);
    return (n >= 0 && n < FONT_SIZE_ZOOM.length) ? n : FONT_SIZE_DEFAULT;
  }
  function applyFontSize(){
    document.documentElement.setAttribute('data-fontsize', String(getFontSizeIndex()));
  }
  function setFontSizeIndex(n){
    n = Math.max(0, Math.min(FONT_SIZE_ZOOM.length - 1, n));
    localStorage.setItem(STORAGE_FONTSIZE, String(n));
    applyFontSize();
    return n;
  }
  function increaseFontSize(){ return setFontSizeIndex(getFontSizeIndex() + 1); }
  function decreaseFontSize(){ return setFontSizeIndex(getFontSizeIndex() - 1); }
  function getFontSizeLabel(n){ return t(FONT_SIZE_KEYS[n]); }

  // ---------------- language / i18n ----------------
  var CATEGORY_NAMES = {
    pt: {
      parabolas: 'Parábolas', livros: 'Livros', salmos: 'Salmos', proverbios: 'Provérbios',
      personagens: 'Personagens', 'fruto-do-espirito': 'Fruto do Espírito',
      'disciplinas-espirituais': 'Disciplinas Espirituais', trindade: 'Trindade',
      'mordomia-crista': 'Mordomia Cristã', 'bem-aventurancas': 'Bem-aventuranças',
      'sinais-milagrosos': '7 Sinais Milagrosos', 'eu-sou': '7 Discursos "Eu Sou"',
      'pai-nosso': 'A Oração do Pai Nosso', 'armadura-de-deus': 'A Armadura de Deus'
    },
    en: {
      parabolas: 'Parables', livros: 'Books', salmos: 'Psalms', proverbios: 'Proverbs',
      personagens: 'Characters', 'fruto-do-espirito': 'Fruit of the Spirit',
      'disciplinas-espirituais': 'Spiritual Disciplines', trindade: 'Trinity',
      'mordomia-crista': 'Christian Stewardship', 'bem-aventurancas': 'Beatitudes',
      'sinais-milagrosos': '7 Miraculous Signs', 'eu-sou': '7 "I Am" Statements',
      'pai-nosso': "The Lord's Prayer", 'armadura-de-deus': 'The Armor of God'
    },
    es: {
      parabolas: 'Parábolas', livros: 'Libros', salmos: 'Salmos', proverbios: 'Proverbios',
      personagens: 'Personajes', 'fruto-do-espirito': 'Fruto del Espíritu',
      'disciplinas-espirituais': 'Disciplinas Espirituales', trindade: 'Trinidad',
      'mordomia-crista': 'Mayordomía Cristiana', 'bem-aventurancas': 'Bienaventuranzas',
      'sinais-milagrosos': '7 Señales Milagrosas', 'eu-sou': '7 Discursos "Yo Soy"',
      'pai-nosso': 'El Padre Nuestro', 'armadura-de-deus': 'La Armadura de Dios'
    }
  };

  // Strings for UI Volver builds itself in JS (sidebar, buttons, modals, onboarding).
  // Needs pt/en/es explicitly — there is no static DOM to fall back to for these.
  var I18N_JS = {
    pt: {
      menu_btn_aria: 'Abrir menu', sidebar_close_aria: 'Fechar menu', sidebar_home: 'Início',
      sidebar_favoritos: 'Favoritos', sidebar_continue: 'Continue a Volver', sidebar_perfil: 'Perfil',
      sidebar_config: 'Configurações', sidebar_theme_label: 'Tema', theme_toggle_aria: 'Alternar tema claro/escuro',
      back_btn: 'Voltar', back_btn_aria: 'Voltar',
      methodology_strong: 'Antes de refletir:',
      methodology_text: 'a Volver é um complemento da Bíblia, não um substituto — entenda como usar a plataforma da maneira certa.',
      methodology_link: 'Como usar a Volver →',
      favorite_off: 'Favoritar', favorite_on: 'Favoritado', favorite_aria: 'Favoritar',
      finish_btn: 'Finalizar reflexão', finish_btn_done: 'Reflexão concluída ✓',
      share_title: 'Compartilhar', pdf_title: 'Baixar como PDF', copied_title: 'Copiado!',
      back_to_prefix: 'Voltar para ',
      celebrate_title: 'Reflexão concluída!', celebrate_close_aria: 'Fechar',
      share_text: 'Acabei de concluir "{title}"{ref} no Volver.',
      outcome_worry_tag: 'Padrão a evitar', outcome_calm_tag: 'Padrão a seguir',
      onb_back: 'Voltar', onb_next: 'Avançar', onb_enter: 'Entrar na Volver',
      fontsize_0: 'Pequeno', fontsize_1: 'Reduzido', fontsize_2: 'Padrão', fontsize_3: 'Grande', fontsize_4: 'Muito grande',
      stat_completed: 'Concluídas', stat_progress: 'Em andamento', stat_favorites: 'Favoritas',
      list_completed_empty: 'Nenhuma reflexão concluída ainda.',
      list_progress_empty: 'Nenhuma reflexão em andamento.',
      list_favorites_empty: 'Nenhuma reflexão favoritada ainda.',
      cfg_theme_dark: 'Escuro', cfg_theme_light: 'Claro',
      cfg_fontsize_dec_aria: 'Diminuir tamanho do texto', cfg_fontsize_inc_aria: 'Aumentar tamanho do texto',
      cfg_clear_manage: 'Gerenciar', cfg_clear_close: 'Fechar',
      cfg_clear_erase_all: 'Apagar todos', cfg_clear_erase_selected_n: 'Apagar selecionadas ({n})',
      cfg_clear_confirm: 'Confirmar (clique de novo)', cfg_clear_done: 'Apagado ✓',
      onb: [
        { eyebrow: '1 de 6 · Sobre a Volver', title: 'O que é a Volver',
          body: '<p>A Volver é uma metodologia para ajudar sua mente a se encontrar com os ensinamentos bíblicos, de um jeito visual e interativo.</p>' +
                '<p>Mas isso <strong>não</strong> significa que os textos bíblicos foram escritos para uma aplicação pessoal simples — como uma fórmula pronta para qualquer situação da sua vida.</p>' },
        { eyebrow: '2 de 6 · Um aviso necessário', title: 'Não é sobre se sentir bem',
          body: '<p>Cada texto bíblico foi escrito por inspiração divina, em épocas, culturas, línguas e contextos muito diferentes dos nossos — com história, personagens reais e propósitos teológicos específicos para o que estava sendo descrito.</p>' +
                '<p>Não foram escritos apenas para que alguém, hoje, se sinta bem ou compare o texto diretamente com um problema pessoal.</p>' },
        { eyebrow: '3 de 6 · O propósito', title: 'Conhecer a Deus de verdade',
          body: '<p>A Bíblia existe para revelar quem Deus é — do jeito que Ele mesmo escolheu se revelar aqui na Terra.</p>' +
                '<p>É por meio dessa revelação que podemos estudar, conhecer a Deus verdadeiramente, e viver o nosso dia a dia com obediência e sabedoria a partir do que Ele mostrou de si mesmo.</p>' },
        { eyebrow: '4 de 6 · Contexto importa', title: 'Microvisão x macrovisão',
          body: '<p><strong>Microvisão</strong> é ler só o versículo solto. <strong>Macrovisão</strong> é ler o texto dentro do seu contexto: quem escreveu, para quem, quando e por quê.</p>' +
                '<p>Ex.: Jeremias 29:11 citado sozinho vira "promessa de sucesso pessoal" — no contexto (Jr 29:1-14), é uma promessa à nação exilada, cumprida só depois de setenta anos.</p>' +
                '<p><a href="como-usar.html#exemplo">Veja o exemplo completo →</a></p>' },
        { eyebrow: '5 de 6 · Como usar', title: 'Um complemento, não um substituto',
          body: '<p>A Volver não substitui a leitura da Bíblia — ela serve para trazer reflexão <strong>depois</strong> dela.</p>' +
                '<p>O ideal é ler a passagem primeiro, conhecer o contexto, e só então abrir a reflexão como um fechamento — nunca como a única fonte do que o texto significa.</p>' +
                '<p><a href="como-usar.html#uso">Veja exemplos certos e errados →</a></p>' },
        { eyebrow: '6 de 6 · Pronto', title: 'Por isso, "reflexão"',
          body: '<p>Essas páginas se chamam <strong>reflexão</strong>, não "lição": não é uma aula que ensina o que o texto significa, é um espaço para pensar sobre o que você já leu.</p>' +
                '<p>Leia a Bíblia, conheça o contexto, depois reflita com a Volver.</p>' }
      ]
    },
    en: {
      menu_btn_aria: 'Open menu', sidebar_close_aria: 'Close menu', sidebar_home: 'Home',
      sidebar_favoritos: 'Favorites', sidebar_continue: 'Continue in Volver', sidebar_perfil: 'Profile',
      sidebar_config: 'Settings', sidebar_theme_label: 'Theme', theme_toggle_aria: 'Toggle light/dark theme',
      back_btn: 'Back', back_btn_aria: 'Back',
      methodology_strong: 'Before you reflect:',
      methodology_text: 'Volver is a complement to the Bible, not a substitute — learn how to use the platform the right way.',
      methodology_link: 'How to use Volver →',
      favorite_off: 'Favorite', favorite_on: 'Favorited', favorite_aria: 'Favorite',
      finish_btn: 'Finish reflection', finish_btn_done: 'Reflection completed ✓',
      share_title: 'Share', pdf_title: 'Download as PDF', copied_title: 'Copied!',
      back_to_prefix: 'Back to ',
      celebrate_title: 'Reflection completed!', celebrate_close_aria: 'Close',
      share_text: 'I just completed "{title}"{ref} on Volver.',
      outcome_worry_tag: 'Pattern to avoid', outcome_calm_tag: 'Pattern to follow',
      onb_back: 'Back', onb_next: 'Next', onb_enter: 'Enter Volver',
      fontsize_0: 'Small', fontsize_1: 'Reduced', fontsize_2: 'Default', fontsize_3: 'Large', fontsize_4: 'Extra large',
      stat_completed: 'Completed', stat_progress: 'In progress', stat_favorites: 'Favorites',
      list_completed_empty: 'No reflections completed yet.',
      list_progress_empty: 'No reflection in progress.',
      list_favorites_empty: 'No reflection favorited yet.',
      cfg_theme_dark: 'Dark', cfg_theme_light: 'Light',
      cfg_fontsize_dec_aria: 'Decrease text size', cfg_fontsize_inc_aria: 'Increase text size',
      cfg_clear_manage: 'Manage', cfg_clear_close: 'Close',
      cfg_clear_erase_all: 'Erase all', cfg_clear_erase_selected_n: 'Erase selected ({n})',
      cfg_clear_confirm: 'Confirm (click again)', cfg_clear_done: 'Erased ✓',
      onb: [
        { eyebrow: '1 of 6 · About Volver', title: 'What Volver is',
          body: '<p>Volver is a methodology to help your mind engage with biblical teaching, in a visual and interactive way.</p>' +
                '<p>But that does <strong>not</strong> mean the biblical texts were written for simple personal application — like a ready-made formula for any situation in your life.</p>' },
        { eyebrow: '2 of 6 · A necessary warning', title: "It's not about feeling good",
          body: '<p>Every biblical text was written by divine inspiration, in times, cultures, languages, and contexts very different from ours — with history, real people, and specific theological purposes behind what was being described.</p>' +
                '<p>They were not written just so that someone, today, would feel good or compare the text directly to a personal problem.</p>' },
        { eyebrow: '3 of 6 · The purpose', title: 'Truly knowing God',
          body: '<p>The Bible exists to reveal who God is — in the way He Himself chose to reveal Himself here on Earth.</p>' +
                '<p>It is through this revelation that we can study, truly know God, and live our daily lives with obedience and wisdom based on what He showed of Himself.</p>' },
        { eyebrow: '4 of 6 · Context matters', title: 'Micro-view vs. macro-view',
          body: '<p><strong>Micro-view</strong> is reading just the isolated verse. <strong>Macro-view</strong> is reading the text within its context: who wrote it, to whom, when, and why.</p>' +
                '<p>Ex.: Jeremiah 29:11 quoted alone becomes a "promise of personal success" — in context (Jer 29:1-14), it is a promise to the exiled nation, fulfilled only after seventy years.</p>' +
                '<p><a href="como-usar.html#exemplo">See the full example →</a></p>' },
        { eyebrow: '5 of 6 · How to use it', title: 'A complement, not a substitute',
          body: '<p>Volver does not replace reading the Bible — it exists to bring reflection <strong>after</strong> it.</p>' +
                '<p>The ideal is to read the passage first, understand its context, and only then open the reflection as a closing — never as the only source of what the text means.</p>' +
                '<p><a href="como-usar.html#uso">See right and wrong examples →</a></p>' },
        { eyebrow: '6 of 6 · Ready', title: 'That\'s why "reflection"',
          body: '<p>These pages are called a <strong>reflection</strong>, not a "lesson": it is not a class that teaches what the text means, it is a space to think about what you have already read.</p>' +
                '<p>Read the Bible, understand the context, then reflect with Volver.</p>' }
      ]
    },
    es: {
      menu_btn_aria: 'Abrir menú', sidebar_close_aria: 'Cerrar menú', sidebar_home: 'Inicio',
      sidebar_favoritos: 'Favoritos', sidebar_continue: 'Continuar en Volver', sidebar_perfil: 'Perfil',
      sidebar_config: 'Configuración', sidebar_theme_label: 'Tema', theme_toggle_aria: 'Alternar tema claro/oscuro',
      back_btn: 'Volver', back_btn_aria: 'Volver',
      methodology_strong: 'Antes de reflexionar:',
      methodology_text: 'Volver es un complemento de la Biblia, no un sustituto — entiende cómo usar la plataforma de la manera correcta.',
      methodology_link: 'Cómo usar Volver →',
      favorite_off: 'Favorito', favorite_on: 'En favoritos', favorite_aria: 'Favorito',
      finish_btn: 'Finalizar reflexión', finish_btn_done: 'Reflexión concluida ✓',
      share_title: 'Compartir', pdf_title: 'Descargar como PDF', copied_title: '¡Copiado!',
      back_to_prefix: 'Volver a ',
      celebrate_title: '¡Reflexión concluida!', celebrate_close_aria: 'Cerrar',
      share_text: 'Acabo de completar "{title}"{ref} en Volver.',
      outcome_worry_tag: 'Patrón a evitar', outcome_calm_tag: 'Patrón a seguir',
      onb_back: 'Atrás', onb_next: 'Siguiente', onb_enter: 'Entrar a Volver',
      fontsize_0: 'Pequeño', fontsize_1: 'Reducido', fontsize_2: 'Predeterminado', fontsize_3: 'Grande', fontsize_4: 'Muy grande',
      stat_completed: 'Concluidas', stat_progress: 'En curso', stat_favorites: 'Favoritas',
      list_completed_empty: 'Aún no hay reflexiones concluidas.',
      list_progress_empty: 'Ninguna reflexión en curso.',
      list_favorites_empty: 'Ninguna reflexión marcada como favorita todavía.',
      cfg_theme_dark: 'Oscuro', cfg_theme_light: 'Claro',
      cfg_fontsize_dec_aria: 'Disminuir tamaño del texto', cfg_fontsize_inc_aria: 'Aumentar tamaño del texto',
      cfg_clear_manage: 'Gestionar', cfg_clear_close: 'Cerrar',
      cfg_clear_erase_all: 'Borrar todos', cfg_clear_erase_selected_n: 'Borrar seleccionadas ({n})',
      cfg_clear_confirm: 'Confirmar (haz clic de nuevo)', cfg_clear_done: 'Borrado ✓',
      onb: [
        { eyebrow: '1 de 6 · Sobre Volver', title: 'Qué es Volver',
          body: '<p>Volver es una metodología para ayudar a tu mente a encontrarse con las enseñanzas bíblicas, de una manera visual e interactiva.</p>' +
                '<p>Pero eso <strong>no</strong> significa que los textos bíblicos fueron escritos para una aplicación personal simple — como una fórmula lista para cualquier situación de tu vida.</p>' },
        { eyebrow: '2 de 6 · Una advertencia necesaria', title: 'No se trata de sentirse bien',
          body: '<p>Cada texto bíblico fue escrito por inspiración divina, en épocas, culturas, lenguas y contextos muy diferentes de los nuestros — con historia, personajes reales y propósitos teológicos específicos para lo que se estaba describiendo.</p>' +
                '<p>No fueron escritos solo para que alguien, hoy, se sienta bien o compare el texto directamente con un problema personal.</p>' },
        { eyebrow: '3 de 6 · El propósito', title: 'Conocer a Dios de verdad',
          body: '<p>La Biblia existe para revelar quién es Dios — de la manera en que Él mismo eligió revelarse aquí en la Tierra.</p>' +
                '<p>Es por medio de esa revelación que podemos estudiar, conocer a Dios verdaderamente, y vivir nuestro día a día con obediencia y sabiduría a partir de lo que Él mostró de sí mismo.</p>' },
        { eyebrow: '4 de 6 · El contexto importa', title: 'Microvisión frente a macrovisión',
          body: '<p><strong>Microvisión</strong> es leer solo el versículo aislado. <strong>Macrovisión</strong> es leer el texto dentro de su contexto: quién lo escribió, para quién, cuándo y por qué.</p>' +
                '<p>Ej.: Jeremías 29:11 citado solo se convierte en "promesa de éxito personal" — en contexto (Jer 29:1-14), es una promesa a la nación exiliada, cumplida solo después de setenta años.</p>' +
                '<p><a href="como-usar.html#exemplo">Ver el ejemplo completo →</a></p>' },
        { eyebrow: '5 de 6 · Cómo usarla', title: 'Un complemento, no un sustituto',
          body: '<p>Volver no sustituye la lectura de la Biblia — existe para traer reflexión <strong>después</strong> de ella.</p>' +
                '<p>Lo ideal es leer el pasaje primero, conocer el contexto, y solo entonces abrir la reflexión como un cierre — nunca como la única fuente de lo que el texto significa.</p>' +
                '<p><a href="como-usar.html#uso">Ver ejemplos correctos e incorrectos →</a></p>' },
        { eyebrow: '6 de 6 · Listo', title: 'Por eso, "reflexión"',
          body: '<p>Estas páginas se llaman <strong>reflexión</strong>, no "lección": no es una clase que enseña lo que el texto significa, es un espacio para pensar sobre lo que ya leíste.</p>' +
                '<p>Lee la Biblia, conoce el contexto, luego reflexiona con Volver.</p>' }
      ]
    }
  };

  // Strings for elements already authored in Portuguese in the static HTML pages.
  // Only en/es are needed — pt is read straight from the DOM the first time applyLanguage runs.
  var I18N_STATIC = { en: {}, es: {} };
  ['en', 'es'].forEach(function(lang){
    Object.keys(CATEGORY_NAMES[lang]).forEach(function(slug){
      I18N_STATIC[lang]['cat_' + slug] = CATEGORY_NAMES[lang][slug];
    });
  });
  Object.assign(I18N_STATIC.en, {
    search_placeholder: 'Search reflection, reference, or theme…',
    hero_eyebrow: 'Platform introduction',
    hero_title: 'What does "Volver" mean?',
    hero_hook: 'A rare verb in Portuguese, borrowed from Spanish, with a Latin root — and a purpose behind the choice: understanding why this platform exists to help you return, again and again, to the Word.',
    hero_cta: 'Discover the origin of the name',
    how_eyebrow: 'The format', how_title: 'How each reflection works',
    how_step1_h: 'Choose a category',
    how_step1_p: 'Parables, Books, Psalms, Proverbs, Characters, Fruit of the Spirit, Spiritual Disciplines, Trinity, Christian Stewardship, Beatitudes, 7 Miraculous Signs, 7 "I Am" Statements, the Lord’s Prayer, or the Armor of God — each one gathers the same kind of short, interactive reflection.',
    how_step2_h: 'Move through the timeline',
    how_step2_p: 'Each stage opens in the order the story itself happened — no skipping ahead, no revealing before its time.',
    how_step3_h: 'See the pattern revealed',
    how_step3_p: 'At the end, the story’s automatic mental pattern is named and compared to the pattern that grace interrupts.',
    footer_blurb: 'Short reflections that use biblical texts — in chronological order — to name automatic mental patterns before naming the virtue that interrupts them.',
    footer_explore: 'Explore',
    footer_bottom: 'Volver · the mind, in the light of the Word',
    cfg_eyebrow: 'Preferences', cfg_title: 'Settings',
    cfg_sub: 'Settings saved in this browser — theme, text size, language, and the progress data stored locally.',
    cfg_theme_title: 'Theme', cfg_theme_desc: 'Switches between light and dark mode across the whole site.',
    cfg_theme_dark: 'Dark', cfg_theme_light: 'Light',
    cfg_fontsize_title: 'Text size', cfg_fontsize_desc: 'Increases or decreases the text size of reflections and pages, in 5 levels, for more comfortable reading.',
    cfg_fontsize_dec_aria: 'Decrease text size', cfg_fontsize_inc_aria: 'Increase text size',
    cfg_lang_title: 'Language', cfg_lang_desc: 'Translates the platform’s menus, buttons, and fixed text. The reflections themselves remain in Portuguese for now.',
    cfg_clear_title: 'Erase progress', cfg_clear_desc: 'Choose which completed reflections should have their progress erased. They will appear as not started again.',
    cfg_clear_manage: 'Manage',
    cfg_clear_warning: 'Warning: erasing a reflection’s progress means you will need to redo it from the beginning.',
    cfg_clear_empty: 'No reflections completed yet.',
    cfg_clear_select_all: 'Select all', cfg_clear_erase_all: 'Erase all',
    cfg_clear_erase_selected: 'Erase selected', cfg_clear_erase_selected_n: 'Erase selected ({n})',
    cfg_clear_confirm: 'Confirm (click again)', cfg_clear_done: 'Erased ✓', cfg_clear_close: 'Close',
    footer_cfg: 'Volver · settings · interactive reflection',
    profile_eyebrow: 'Your journey', profile_title: 'Profile',
    profile_sub: 'A summary of what you have completed, what is in progress, and what you have favorited — all saved in this browser.',
    stat_completed: 'Completed', stat_progress: 'In progress', stat_favorites: 'Favorites',
    list_completed_empty: 'No reflections completed yet.',
    list_progress_empty: 'No reflection in progress.',
    list_favorites_empty: 'No reflection favorited yet.',
    footer_profile: 'Volver · local profile · interactive reflection',
    fav_title: 'Favorites', fav_sub: 'All the reflections you starred, saved in this browser.',
    fav_empty: 'No reflection favorited yet. Tap the star on any reflection to save it here.',
    footer_fav: 'Volver · favorites · interactive reflection',
    continue_title: 'Continue in Volver',
    continue_sub: 'The reflections you started and haven’t finished yet, so you can pick up where you left off.',
    continue_empty: 'No reflection in progress right now.',
    footer_continue: 'Volver · continue in Volver · interactive reflection'
  });
  Object.assign(I18N_STATIC.es, {
    search_placeholder: 'Buscar reflexión, referencia o tema…',
    hero_eyebrow: 'Presentación de la plataforma',
    hero_title: '¿Qué significa "Volver"?',
    hero_hook: 'Un verbo poco común en portugués, tomado del español, con raíz latina — y un propósito detrás de la elección: entender por qué esta plataforma existe para ayudarte a volver, una y otra vez, a la Palabra.',
    hero_cta: 'Descubrir el origen del nombre',
    how_eyebrow: 'El formato', how_title: 'Cómo funciona cada reflexión',
    how_step1_h: 'Elige una categoría',
    how_step1_p: 'Parábolas, Libros, Salmos, Proverbios, Personajes, Fruto del Espíritu, Disciplinas Espirituales, Trinidad, Mayordomía Cristiana, Bienaventuranzas, 7 Señales Milagrosas, 7 Discursos "Yo Soy", el Padre Nuestro o la Armadura de Dios — cada una reúne el mismo tipo de reflexión breve e interactiva.',
    how_step2_h: 'Avanza por la línea de tiempo',
    how_step2_p: 'Cada etapa se abre en el orden en que la propia historia sucedió — sin saltar hacia adelante, sin revelar antes de tiempo.',
    how_step3_h: 'Ve el patrón revelado',
    how_step3_p: 'Al final, el patrón mental automático de la historia se nombra y se compara con el patrón que la gracia interrumpe.',
    footer_blurb: 'Reflexiones breves que usan textos bíblicos — en orden cronológico — para nombrar patrones mentales automáticos antes de nombrar la virtud que los interrumpe.',
    footer_explore: 'Explorar',
    footer_bottom: 'Volver · la mente, a la luz de la Palabra',
    cfg_eyebrow: 'Preferencias', cfg_title: 'Configuración',
    cfg_sub: 'Ajustes guardados en este navegador — tema, tamaño del texto, idioma y los datos de progreso guardados localmente.',
    cfg_theme_title: 'Tema', cfg_theme_desc: 'Alterna entre los modos claro y oscuro en todo el sitio.',
    cfg_theme_dark: 'Oscuro', cfg_theme_light: 'Claro',
    cfg_fontsize_title: 'Tamaño del texto', cfg_fontsize_desc: 'Aumenta o disminuye el tamaño del texto de las reflexiones y páginas, en 5 niveles, para una lectura más cómoda.',
    cfg_fontsize_dec_aria: 'Disminuir tamaño del texto', cfg_fontsize_inc_aria: 'Aumentar tamaño del texto',
    cfg_lang_title: 'Idioma', cfg_lang_desc: 'Traduce los menús, botones y textos fijos de la plataforma. Las reflexiones en sí permanecen en portugués por ahora.',
    cfg_clear_title: 'Borrar progreso', cfg_clear_desc: 'Elige qué reflexiones concluidas tendrán su progreso borrado. Volverán a aparecer como no iniciadas.',
    cfg_clear_manage: 'Gestionar',
    cfg_clear_warning: 'Atención: borrar el progreso de una reflexión significa que tendrás que rehacerla desde el principio.',
    cfg_clear_empty: 'Aún no hay reflexiones concluidas.',
    cfg_clear_select_all: 'Seleccionar todas', cfg_clear_erase_all: 'Borrar todos',
    cfg_clear_erase_selected: 'Borrar seleccionadas', cfg_clear_erase_selected_n: 'Borrar seleccionadas ({n})',
    cfg_clear_confirm: 'Confirmar (haz clic de nuevo)', cfg_clear_done: 'Borrado ✓', cfg_clear_close: 'Cerrar',
    footer_cfg: 'Volver · configuración · reflexión interactiva',
    profile_eyebrow: 'Tu camino', profile_title: 'Perfil',
    profile_sub: 'Un resumen de lo que ya completaste, lo que está en curso y lo que marcaste como favorito — todo guardado en este navegador.',
    stat_completed: 'Concluidas', stat_progress: 'En curso', stat_favorites: 'Favoritas',
    list_completed_empty: 'Aún no hay reflexiones concluidas.',
    list_progress_empty: 'Ninguna reflexión en curso.',
    list_favorites_empty: 'Ninguna reflexión marcada como favorita todavía.',
    footer_profile: 'Volver · perfil local · reflexión interactiva',
    fav_title: 'Favoritos', fav_sub: 'Todas las reflexiones que marcaste con estrella, guardadas en este navegador.',
    fav_empty: 'Ninguna reflexión marcada como favorita todavía. Toca la estrella en cualquier reflexión para guardarla aquí.',
    footer_fav: 'Volver · favoritos · reflexión interactiva',
    continue_title: 'Continuar en Volver',
    continue_sub: 'Las reflexiones que empezaste y aún no terminaste, para retomarlas donde las dejaste.',
    continue_empty: 'Ninguna reflexión en curso en este momento.',
    footer_continue: 'Volver · continuar en Volver · reflexión interactiva'
  });

  function getLang(){
    var l = localStorage.getItem(STORAGE_LANG);
    return (l === 'en' || l === 'es') ? l : 'pt';
  }
  function setLang(l){
    localStorage.setItem(STORAGE_LANG, (l === 'en' || l === 'es') ? l : 'pt');
    applyLanguage();
  }
  function t(key){
    var lang = getLang();
    var dict = I18N_JS[lang] || I18N_JS.pt;
    if(dict[key] !== undefined) return dict[key];
    return I18N_JS.pt[key] !== undefined ? I18N_JS.pt[key] : key;
  }
  function categoryLabel(slug){
    var lang = getLang();
    return (CATEGORY_NAMES[lang] && CATEGORY_NAMES[lang][slug]) || (CATEGORY_NAMES.pt[slug] || slug);
  }
  var LANG_TAG = { pt: 'pt-BR', en: 'en', es: 'es' };

  function applyLanguage(){
    var lang = getLang();
    document.documentElement.setAttribute('lang', LANG_TAG[lang]);
    var dict = I18N_STATIC[lang] || {};

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var useHtml = el.hasAttribute('data-i18n-html');
      if(el.dataset.i18nPt === undefined){ el.dataset.i18nPt = useHtml ? el.innerHTML : el.textContent; }
      var val = (lang === 'pt' || dict[key] === undefined) ? el.dataset.i18nPt : dict[key];
      if(useHtml){ el.innerHTML = val; } else { el.textContent = val; }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var key = el.getAttribute('data-i18n-ph');
      if(el.dataset.i18nPhPt === undefined){ el.dataset.i18nPhPt = el.getAttribute('placeholder') || ''; }
      el.setAttribute('placeholder', (lang === 'pt' || dict[key] === undefined) ? el.dataset.i18nPhPt : dict[key]);
    });

    document.dispatchEvent(new CustomEvent('volver:lang', { detail: { lang: lang } }));
  }

  // ---------------- selective progress clearing ----------------
  function clearProgressForKeys(keys){
    var completedMap = readJSON(STORAGE_COMPLETED);
    var visitedMap = readJSON(STORAGE_VISITED);
    var stageMap = readJSON(STORAGE_STAGE);
    keys.forEach(function(k){
      delete completedMap[k];
      delete visitedMap[k];
      delete stageMap[k];
    });
    writeJSON(STORAGE_COMPLETED, completedMap);
    writeJSON(STORAGE_VISITED, visitedMap);
    writeJSON(STORAGE_STAGE, stageMap);
  }

  function getSummary(){
    var completedMap = readJSON(STORAGE_COMPLETED);
    var visitedMap = readJSON(STORAGE_VISITED);
    var favMap = readJSON(STORAGE_FAV);
    var completedKeys = Object.keys(completedMap);
    function toList(map, excludeKeys){
      return Object.keys(map)
        .filter(function(k){ return !excludeKeys || excludeKeys.indexOf(k) === -1; })
        .map(function(k){ var e = Object.assign({}, map[k]); e.key = k; return e; })
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

    var categorySlugs = ['parabolas', 'livros', 'salmos', 'proverbios', 'personagens',
      'fruto-do-espirito', 'disciplinas-espirituais', 'trindade', 'mordomia-crista',
      'bem-aventurancas', 'sinais-milagrosos', 'eu-sou', 'pai-nosso', 'armadura-de-deus'];
    var hubHref = {
      parabolas: 'parabolas/biblioteca-parabolas.html', livros: 'livros/biblioteca-livros.html',
      salmos: 'salmos/biblioteca-salmos.html', proverbios: 'proverbios/biblioteca-proverbios.html',
      personagens: 'personagens/biblioteca-personagens.html',
      'fruto-do-espirito': 'fruto-do-espirito/biblioteca-fruto-do-espirito.html',
      'disciplinas-espirituais': 'disciplinas-espirituais/biblioteca-disciplinas-espirituais.html',
      trindade: 'trindade/biblioteca-trindade.html', 'mordomia-crista': 'mordomia-crista/biblioteca-mordomia-crista.html',
      'bem-aventurancas': 'bem-aventurancas/biblioteca-bem-aventurancas.html',
      'sinais-milagrosos': 'sinais-milagrosos/biblioteca-sinais-milagrosos.html',
      'eu-sou': 'eu-sou/biblioteca-eu-sou.html', 'pai-nosso': 'pai-nosso/biblioteca-pai-nosso.html',
      'armadura-de-deus': 'armadura-de-deus/biblioteca-armadura-de-deus.html'
    };

    var nav = document.createElement('nav');
    nav.id = 'volverSidebar';
    nav.className = 'volver-sidebar';

    function renderNav(){
      nav.innerHTML =
        '<div class="sidebar-head">' +
          '<a class="sidebar-brand" href="' + root + 'index.html">' + brandBoat + '<span>Volver</span></a>' +
          '<button id="volverSidebarClose" class="sidebar-close" type="button" aria-label="' + t('sidebar_close_aria') + '">&times;</button>' +
        '</div>' +
        '<div class="sidebar-nav">' +
          '<button id="sidebarHomeToggle" class="sidebar-toggle" type="button">' +
            '<span>' + t('sidebar_home') + '</span>' +
            '<svg class="chev" viewBox="0 0 10 10" fill="none"><path d="M3 1 L7 5 L3 9" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<div class="sidebar-lessons" id="sidebarLessons">' +
            categorySlugs.map(function(slug){
              return '<a class="sidebar-sublink" href="' + root + hubHref[slug] + '">' + categoryLabel(slug) + '</a>';
            }).join('') +
          '</div>' +
          '<a class="sidebar-link" href="' + root + 'favoritos.html">' + t('sidebar_favoritos') + '</a>' +
          '<a class="sidebar-link" href="' + root + 'continue-a-volver.html">' + t('sidebar_continue') + '</a>' +
          '<a class="sidebar-link" href="' + root + 'perfil.html">' + t('sidebar_perfil') + '</a>' +
          '<a class="sidebar-link" href="' + root + 'configuracoes.html">' + t('sidebar_config') + '</a>' +
        '</div>' +
        '<div class="sidebar-foot"></div>';

      var themeBtn = document.createElement('button');
      themeBtn.type = 'button';
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', t('theme_toggle_aria'));
      themeBtn.innerHTML = SUN_ICON + MOON_ICON;
      themeBtn.addEventListener('click', toggleTheme);
      var foot = nav.querySelector('.sidebar-foot');
      foot.appendChild(themeBtn);
      var themeLabel = document.createElement('span');
      themeLabel.textContent = t('sidebar_theme_label');
      foot.appendChild(themeLabel);

      nav.querySelector('#volverSidebarClose').addEventListener('click', closeSidebar);
      var homeToggle = nav.querySelector('#sidebarHomeToggle');
      var lessonsPanel = nav.querySelector('#sidebarLessons');
      homeToggle.addEventListener('click', function(){
        homeToggle.classList.toggle('open');
        lessonsPanel.classList.toggle('open');
      });
    }

    var backdrop = document.createElement('div');
    backdrop.id = 'volverSidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';

    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(nav, document.body.firstChild);
    renderNav();
    document.addEventListener('volver:lang', renderNav);

    function openSidebar(){ nav.classList.add('open'); backdrop.classList.add('open'); }
    function closeSidebar(){ nav.classList.remove('open'); backdrop.classList.remove('open'); }
    backdrop.addEventListener('click', closeSidebar);

    var bar = document.querySelector('.brand-bar');
    if(bar && !document.getElementById('volverMenuBtn')){
      var menuBtn = document.createElement('button');
      menuBtn.id = 'volverMenuBtn';
      menuBtn.type = 'button';
      menuBtn.className = 'menu-btn';
      menuBtn.setAttribute('aria-label', t('menu_btn_aria'));
      menuBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke-width="1.6" stroke-linecap="round"/></svg>';
      menuBtn.addEventListener('click', openSidebar);
      bar.insertBefore(menuBtn, bar.firstChild);
      document.addEventListener('volver:lang', function(){ menuBtn.setAttribute('aria-label', t('menu_btn_aria')); });
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
    function render(){
      btn.setAttribute('aria-label', t('back_btn_aria'));
      btn.innerHTML = BACK_ICON + '<span>' + t('back_btn') + '</span>';
    }
    render();
    document.addEventListener('volver:lang', render);
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
    function render(){
      banner.innerHTML =
        INFO_ICON +
        '<p><strong>' + t('methodology_strong') + '</strong> ' + t('methodology_text') + '</p>' +
        '<a href="' + root + 'como-usar.html">' + t('methodology_link') + '</a>';
    }
    render();
    document.addEventListener('volver:lang', render);
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
        starBtn.setAttribute('aria-label', t('favorite_aria'));
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
        starBtn.setAttribute('aria-label', t('favorite_aria'));
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
      var favBtn = document.createElement('button');
      favBtn.id = 'volverFavBtn';
      favBtn.type = 'button';
      function renderFav(){
        var active = isFavorite(category, slug);
        favBtn.className = 'fav-star-inline' + (active ? ' active' : '');
        favBtn.innerHTML = STAR_ICON + '<span>' + (active ? t('favorite_on') : t('favorite_off')) + '</span>';
      }
      renderFav();
      document.addEventListener('volver:lang', renderFav);
      favBtn.addEventListener('click', function(){
        toggleFavorite(entry);
        renderFav();
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
    var categoryLabelText = brandTrack ? brandTrack.textContent.trim() : 'a categoria';

    var row = document.createElement('div');
    row.className = 'finish-row';

    var btn = document.createElement('button');
    btn.id = 'volverFinishBtn';
    btn.type = 'button';
    function renderBtn(){
      btn.className = 'continue-btn' + (btn.disabled ? ' done' : '');
      btn.textContent = btn.disabled ? t('finish_btn_done') : t('finish_btn');
    }
    btn.disabled = done;
    renderBtn();
    document.addEventListener('volver:lang', renderBtn);
    row.appendChild(btn);
    body.appendChild(row);

    function renderInlineActions(){
      if(document.getElementById('inlineCompleteIcons')) return;
      var icons = document.createElement('div');
      icons.className = 'inline-complete-icons';
      icons.id = 'inlineCompleteIcons';
      function renderIcons(){
        icons.innerHTML =
          '<button class="celebrate-icon-btn" id="inlineShareBtn" type="button" title="' + t('share_title') + '" aria-label="' + t('share_title') + '">' + SHARE_ICON + '</button>' +
          '<button class="celebrate-icon-btn" id="inlinePdfBtn" type="button" title="' + t('pdf_title') + '" aria-label="' + t('pdf_title') + '">' + DOWNLOAD_ICON + '</button>';
        bindShareButton(document.getElementById('inlineShareBtn'), entry);
        bindPdfButton(document.getElementById('inlinePdfBtn'));
      }
      renderIcons();
      document.addEventListener('volver:lang', renderIcons);
      row.appendChild(icons);

      var backBtn = document.createElement('a');
      backBtn.className = 'celebrate-btn primary inline-complete-back';
      backBtn.href = hubHref;
      function renderBack(){ backBtn.textContent = t('back_to_prefix') + categoryLabelText; }
      renderBack();
      document.addEventListener('volver:lang', renderBack);
      body.insertBefore(backBtn, row.nextSibling);
    }

    if(done){ renderInlineActions(); }

    btn.addEventListener('click', function(){
      markCompleted(entry);
      btn.disabled = true;
      renderBtn();
      renderInlineActions();
      celebrateCompletion(entry, hubHref, categoryLabelText);
    });
  }

  function bindShareButton(btn, entry){
    if(!btn) return;
    btn.addEventListener('click', function(){
      var shareText = t('share_text')
        .replace('{title}', entry.title)
        .replace('{ref}', entry.ref ? ' (' + entry.ref + ')' : '');
      var shareUrl = location.href;
      if(navigator.share){
        navigator.share({ title: entry.title, text: shareText, url: shareUrl }).catch(function(){});
      } else if(navigator.clipboard){
        navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(function(){
          var original = btn.innerHTML;
          btn.innerHTML = CHECK_ICON;
          btn.setAttribute('title', t('copied_title'));
          setTimeout(function(){ btn.innerHTML = original; btn.setAttribute('title', t('share_title')); }, 1800);
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
      '<div class="print-outcome-block worry"><span class="poc-tag">' + t('outcome_worry_tag') + '</span><h3>' + worryTitle + '</h3><p>' + worryText + '</p></div>' +
      '<div class="print-outcome-block calm"><span class="poc-tag">' + t('outcome_calm_tag') + '</span><h3>' + calmTitle + '</h3><p>' + calmText + '</p></div>';
    outcomeCard.insertAdjacentElement('afterend', dual);
  }

  function celebrateCompletion(entry, hubHref, categoryLabelText){
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
      '<button class="celebrate-close" id="celebrateClose" type="button" aria-label="' + t('celebrate_close_aria') + '">&times;</button>' +
      '<div class="celebrate-head">' +
        '<div class="celebrate-title">' + t('celebrate_title') + '</div>' +
        '<div class="celebrate-icons">' +
          '<button class="celebrate-icon-btn" id="celebrateShare" type="button" title="' + t('share_title') + '" aria-label="' + t('share_title') + '">' + SHARE_ICON + '</button>' +
          '<button class="celebrate-icon-btn" id="celebratePdf" type="button" title="' + t('pdf_title') + '" aria-label="' + t('pdf_title') + '">' + DOWNLOAD_ICON + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="celebrate-sub">' + entry.title + (entry.ref ? ' · ' + entry.ref : '') + '</div>' +
      '<a class="celebrate-btn primary celebrate-back" href="' + hubHref + '">' + t('back_to_prefix') + categoryLabelText + '</a>';

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
    var el = document.getElementById('volverIntroSplash');
    if(!el) return;

    function dismiss(){
      if(el.classList.contains('fade-out')) return;
      el.classList.add('fade-out');
      sessionStorage.setItem(STORAGE_SESSION_SHOWN, '1');
      setTimeout(function(){ el.remove(); buildOnboardingCarousel(); }, 650);
    }
    el.addEventListener('click', dismiss);
    setTimeout(dismiss, 2200);
  }

  function buildOnboardingCarousel(){
    var i = 0;
    var backdrop = document.createElement('div');
    backdrop.className = 'onboard-backdrop';
    backdrop.id = 'volverOnboard';
    var slides = (I18N_JS[getLang()] || I18N_JS.pt).onb;
    var dotsHtml = slides.map(function(_, idx){ return '<span class="onboard-dot' + (idx === 0 ? ' active' : '') + '"></span>'; }).join('');
    backdrop.innerHTML =
      '<div class="onboard-modal">' +
        '<div class="onboard-dots">' + dotsHtml + '</div>' +
        '<div class="onboard-eyebrow" id="onbEyebrow"></div>' +
        '<h2 class="onboard-title" id="onbTitle"></h2>' +
        '<div class="onboard-body" id="onbBody"></div>' +
        '<div class="onboard-nav">' +
          '<button id="onbBack" class="onboard-btn ghost" type="button"></button>' +
          '<button id="onbNext" class="onboard-btn primary" type="button"></button>' +
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
      slides = (I18N_JS[getLang()] || I18N_JS.pt).onb;
      var s = slides[i];
      eyebrowEl.textContent = s.eyebrow;
      titleEl.textContent = s.title;
      bodyEl.innerHTML = s.body;
      dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
      backBtn.textContent = t('onb_back');
      backBtn.classList.toggle('is-hidden', i === 0);
      nextBtn.textContent = i === slides.length - 1 ? t('onb_enter') : t('onb_next');
      modalEl.scrollTop = 0;
    }
    render();

    backBtn.addEventListener('click', function(){
      if(i > 0){ i--; render(); }
    });
    nextBtn.addEventListener('click', function(){
      if(i < slides.length - 1){ i++; render(); return; }
      backdrop.classList.remove('open');
      setTimeout(function(){ backdrop.remove(); }, 300);
    });
  }

  // ---------------- boot ----------------
  function init(){
    applyTheme();
    applyFontSize();
    applyLanguage();
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
    getFontSizeIndex: getFontSizeIndex,
    setFontSizeIndex: setFontSizeIndex,
    increaseFontSize: increaseFontSize,
    decreaseFontSize: decreaseFontSize,
    getFontSizeLabel: getFontSizeLabel,
    fontSizeLevelCount: FONT_SIZE_ZOOM.length,
    getLang: getLang,
    setLang: setLang,
    t: t,
    categoryLabel: categoryLabel,
    clearProgressForKeys: clearProgressForKeys,
    getSummary: getSummary
  };
})();
