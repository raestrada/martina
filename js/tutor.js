// tutor.js — App-tutor IA de Martina
// Clave de OpenRouter en localStorage del navegador; peticiones directas a OpenRouter.
// Streaming SSE, HTML en lecciones, progreso tipo "jardín" (sin ansiedad).

(function () {
  'use strict';

  const LS_PROFILE = 'martina-tutor-profile';
  const LS_PROGRESS = 'martina-tutor-progress';
  const SS_MODELS = 'martina-tutor-models-cache';

  const DEFAULT_MODEL = 'deepseek/deepseek-v4-pro';
  const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Conceptos-semilla para el jardín de progreso (sin conteo ansioso).
  const SEED_CONCEPTS = [
    { e: '🌱', t: 'Centro y desarrollo' },
    { e: '🏰', t: 'Enroque y seguridad' },
    { e: '🔒', t: 'Clavada' },
    { e: '🪝', t: 'Desviación' },
    { e: '📦', t: 'Pieza sobrecargada' },
    { e: '💥', t: 'Sacrificio' },
    { e: '🏰', t: 'Ataque al enroque' },
    { e: '⚡', t: 'Iniciativa' },
    { e: '👑', t: 'Peón pasado' },
    { e: '🌋', t: 'Peón aislado' },
    { e: '⚧', t: 'Peones doblados' },
    { e: '🚪', t: 'Columnas abiertas' },
    { e: '🗼', t: 'Puesto avanzado' },
    { e: '🤝', t: 'Oposición' },
    { e: '🧊', t: 'Zugzwang' },
    { e: '🔺', t: 'Triangulación' },
    { e: '⬜', t: 'Regla del cuadrado' },
    { e: '🇮🇹', t: 'Apertura Italiana' },
    { e: '🐉', t: 'Siciliana' },
    { e: '🇪🇸', t: 'Española' },
    { e: '🎁', t: 'Gambito de Dama' },
    { e: '♜', t: 'Finales de torre' }
  ];

  // Etapas suaves (no numéricas, no competitivas).
  const STAGES = ['Primera vez', 'Explorando', 'Practicando', 'Ganando confianza', 'En ritmo'];

  // Emojis de conceptos
  function getConceptEmoji(concept) {
    if (!concept) return '♟️';
    const norm = concept.toLowerCase().trim();
    const match = SEED_CONCEPTS.find(c => {
      const tNorm = c.t.toLowerCase();
      return norm.includes(tNorm) || tNorm.includes(norm);
    });
    return match ? match.e : '♟️';
  }

  // ---- Persistencia ----
  const loadProfile = () => { try { return JSON.parse(localStorage.getItem(LS_PROFILE) || '{}'); } catch { return {}; } };
  const saveProfile = p => localStorage.setItem(LS_PROFILE, JSON.stringify(p));
  const loadProgress = () => { try { return JSON.parse(localStorage.getItem(LS_PROGRESS) || '{"sesiones":[]}'); } catch { return { sesiones: [] }; } };
  const saveProgress = pg => localStorage.setItem(LS_PROGRESS, JSON.stringify(pg));
  const profileValid = p => !!(p && p.openrouter_key && p.openrouter_key.trim());

  // ---- DOM refs ----
  const $ = id => document.getElementById(id);
  const el = {
    onboard: $('tutor-onboard'),
    app: $('tutor-app'),
    statusChip: $('tutor-status-chip'),
    configBtn: $('tutor-config-btn'),
    helpBtn: $('tutor-help-btn'),
    onboardConfig: $('tutor-onboard-config'),
    onboardHelp: $('tutor-onboard-help'),

    configModal: $('tutor-config-modal'),
    helpModal: $('tutor-help-modal'),
    apiKey: $('tutor-api-key'),
    keyToggle: $('tutor-key-toggle'),
    modelSelect: $('tutor-model'),
    modelRefresh: $('tutor-model-refresh'),
    eloChesscom: $('tutor-elo-chesscom'),
    eloFide: $('tutor-elo-fide'),
    desc: $('tutor-desc'),
    btnSave: $('tutor-save'),
    helpBody: $('tutor-help-body'),

    tabs: document.querySelectorAll('.tutor-tab'),
    tabSesion: $('tab-sesion'),
    tabProgreso: $('tab-progreso'),
    tabAyuda: $('tab-ayuda'),

    idle: $('tutor-idle'),
    idleTitle: $('tutor-idle-title'),
    idleText: $('tutor-idle-text'),
    generate: $('tutor-generate'),
    thinking: $('tutor-thinking'),
    thinkingTitle: $('tutor-thinking-title'),
    reason: $('tutor-thinking-reason'),
    thinkingRaw: $('tutor-thinking-raw'),
    thinkingRawText: $('tutor-thinking-raw-text'),
    error: $('tutor-error'),
    lessonHTML: $('tutor-lesson-html'),
    lessonFoot: $('tutor-lesson-foot'),
    next: $('tutor-next'),
    generate: $('tutor-generate'),

    kicker: $('tutor-kicker'),
    sessionTitle: $('tutor-session-title'),
    boardHost: $('tutor-board-host'),
    boardEmpty: $('tutor-board-empty'),
    pgnRaw: $('tutor-pgn-raw'),

    historyList: $('tutor-progress-list'),
    exportBtn: $('tutor-export'),
    clearAll: $('tutor-clear-all'),

    toast: $('tutor-toast')
  };

  // ---- Tabs ----
  function switchTab(name) {
    el.tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.tutor-tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + name);
    if (panel) panel.classList.add('active');
    if (name === 'progreso') renderProgress();
    if (name === 'ayuda') ensureHelp();
  }
  el.tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  // ---- Modales ----
  function openModal(id) { const m = $(id); if (m) m.hidden = false; }
  function closeModal(id) { const m = $(id); if (m) m.hidden = true; }
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.close)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal('tutor-config-modal'); closeModal('tutor-help-modal'); } });

  el.configBtn.addEventListener('click', () => openModal('tutor-config-modal'));
  el.onboardConfig.addEventListener('click', () => openModal('tutor-config-modal'));
  el.helpBtn.addEventListener('click', () => openModal('tutor-help-modal'));
  el.onboardHelp.addEventListener('click', () => openModal('tutor-help-modal'));
  document.querySelectorAll('[data-open-help]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeModal('tutor-config-modal'); openModal('tutor-help-modal'); }));

  el.keyToggle.addEventListener('click', () => {
    el.apiKey.type = el.apiKey.type === 'password' ? 'text' : 'password';
  });

  // ---- Probar clave (sin guardarla todavía) ----
  const testBtn = $('tutor-test-key');
  const testResult = $('tutor-key-test-result');
  testBtn.addEventListener('click', async () => {
    let key = el.apiKey.value.trim().replace(/^\s*Bearer\s+/i, '').replace(/[\s\r\n]+/g, '');
    testResult.hidden = false;
    testResult.className = 'tutor-key-test-result';
    testResult.textContent = 'Probando…';
    testBtn.disabled = true;
    if (!key) {
      testResult.className = 'tutor-key-test-result fail';
      testResult.textContent = '✗ Escribe una clave primero';
      testBtn.disabled = false;
      return;
    }
    try {
      const res = await fetch('https://openrouter.ai/api/v1/credits', {
        headers: { 'Authorization': 'Bearer ' + key }
      });
      if (res.ok) {
        const data = await res.json();
        const total = data.data?.total_balance ?? '?';
        testResult.className = 'tutor-key-test-result ok';
        testResult.textContent = `✓ Clave válida · saldo $${total}`;
      } else if (res.status === 401) {
        testResult.className = 'tutor-key-test-result fail';
        testResult.textContent = '✗ Clave inválida (401)';
      } else {
        testResult.className = 'tutor-key-test-result fail';
        testResult.textContent = `✗ Error ${res.status}`;
      }
    } catch (e) {
      testResult.className = 'tutor-key-test-result fail';
      testResult.textContent = '✗ Sin red: ' + String(e.message || e).slice(0, 60);
    } finally {
      testBtn.disabled = false;
    }
  });

  // ---- Toast ----
  let toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2600);
  }

  // ---- Modo app vs onboarding ----
  function refreshAppMode() {
    const p = loadProfile();
    const ok = profileValid(p);
    el.onboard.hidden = ok;
    el.app.hidden = !ok;
    if (ok) {
      el.configBtn.title = 'Configuración · ' + (p.model || DEFAULT_MODEL);
      el.statusChip.hidden = false;
      el.statusChip.className = 'tutor-status-chip ok';
    } else {
      el.statusChip.hidden = false;
      el.statusChip.className = 'tutor-status-chip warn';
    }
  }

  // ---- Modelos ----
  let modelsFilled = false;
  let modelsList = [];
  // Precargar cache si existe para que modelSupportsStruct() funcione de inmediato
  try { modelsList = JSON.parse(sessionStorage.getItem(SS_MODELS) || '[]'); if (modelsList.length) modelsFilled = true; } catch {}

  function rebuildModelSelect() {
    if (!modelsList.length) return;
    el.modelSelect.innerHTML = modelsList.map(m =>
      `<option value="${m.id}">${m.name} (${m.id}${m.ctx ? ' · ctx ' + m.ctx : ''})</option>`).join('');
    modelsFilled = true;
    preselectModel(loadProfile().model || DEFAULT_MODEL);
  }
  async function fetchModels() {
    const cached = sessionStorage.getItem(SS_MODELS);
    if (cached) { try { return JSON.parse(cached); } catch {} }
    const res = await fetch('https://openrouter.ai/api/v1/models');
    if (!res.ok) throw new Error('No se pudo listar modelos');
    const json = await res.json();
    const list = (json.data || []).map(m => ({
      id: m.id, name: m.name || m.id, ctx: m.context_length,
      supports_struct: (m.supported_parameters || []).includes('structured_outputs'),
      supports_json: (m.supported_parameters || []).includes('response_format')
    }));
    sessionStorage.setItem(SS_MODELS, JSON.stringify(list));
    return list;
  }
  async function ensureModels() {
    if (modelsFilled && modelsList.length) { rebuildModelSelect(); return; }
    el.modelSelect.innerHTML = '<option value="">Cargando modelos…</option>';
    try {
      modelsList = await fetchModels();
      rebuildModelSelect();
    } catch {
      el.modelSelect.innerHTML = `<option value="${DEFAULT_MODEL}">${DEFAULT_MODEL}</option>`;
      modelsFilled = true;
    }
  }
  function modelSupportsStruct(id) {
    const m = modelsList.find(x => x.id === id);
    return !!(m && m.supports_struct);
  }
  function modelSupportsJson(id) {
    const m = modelsList.find(x => x.id === id);
    return !!(m && m.supports_json);
  }
  function preselectModel(target) {
    if (!modelsFilled) return;
    const opts = [...el.modelSelect.options].map(o => o.value);
    if (opts.includes(target)) el.modelSelect.value = target;
    else if (opts.length) el.modelSelect.value = opts[0];
  }
  el.modelRefresh.addEventListener('click', () => { modelsFilled = false; sessionStorage.removeItem(SS_MODELS); ensureModels(); });

  // ---- Ayuda (embebida) ----
  let helpFilled = false;
  function ensureHelp() {
    if (helpFilled) return;
    helpFilled = true;
    el.helpBody.innerHTML = `
      <p><strong>OpenRouter</strong> es un agregador de modelos de IA (ChatGPT, Claude, Gemini, DeepSeek y muchos más) con una sola clave. Pagas solo lo que usas, recargando crédito como una tarjeta telefónica.</p>
      <div class="tutor-help-perks">
        <div class="tutor-help-perk"><strong>💵 Crédito limitado</strong>Puedes poner un tope de gasto (ej. $1) y la app se detiene al llegar. Ideal para calma.</div>
        <div class="tutor-help-perk"><strong>🔐 Tu clave es tuya</strong>Se guarda solo en este navegador. No pasa por nuestros servidores: es 100% local.</div>
        <div class="tutor-help-perk"><strong>🧠 Elige el modelo</strong>DeepSeek V4 Pro por defecto; puedes cambiar a cualquier modelo de la lista.</div>
        <div class="tutor-help-perk"><strong>♟️ Sesiones incrementales</strong>Martina recuerda lo que ya practicaste (en tu navegador) y avanza sin repetir.</div>
      </div>
      <h3>¿Cómo consigo una clave?</h3>
      <ol>
        <li>Ve a <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a> y crea una cuenta.</li>
        <li>Pulsa <em>"Create Key"</em> y copia el código <code>sk-or-v1-…</code>.</li>
        <li>(Opcional pero recomendado) En <em>Credits → Add credits</em> recarga el mínimo que quieras, y en <em>Keys → Limits</em> fija un tope de gasto.</li>
        <li>Vuelve aquí, abre ⚙️ Configuración y pega la clave.</li>
      </ol>
      <div class="tutor-help-card">💡 Consejo: para niños, un tope de <strong>$1–$2</strong> da varias sesiones y se detiene solo. Ninguna sorpresa.</div>
      <div class="tutor-help-cta"><button class="btn btn-primary" id="tutor-help-go-config">⚙️ Configurar mi clave</button></div>
    `;
    const g = $('tutor-help-go-config');
    if (g) g.addEventListener('click', () => { closeModal('tutor-help-modal'); openModal('tutor-config-modal'); });
  }

  // ---- Cargar config en form ----
  function fillConfigForm() {
    const p = loadProfile();
    el.apiKey.value = p.openrouter_key || '';
    el.eloChesscom.value = p.elo_chesscom || '';
    el.eloFide.value = p.elo_fide || '';
    el.desc.value = p.descripcion || '';
    preselectModel(p.model || DEFAULT_MODEL);
  }
  el.configBtn.addEventListener('click', () => { fillConfigForm(); });

  function saveFromForm() {
    let key = el.apiKey.value.trim();
    // Sanitizar: algunos usuarios pegan "Bearer sk-or-..." o con espacios/saltos.
    key = key.replace(/^\s*Bearer\s+/i, '').replace(/[\s\r\n]+/g, '');
    const p = {
      openrouter_key: key,
      model: el.modelSelect.value || DEFAULT_MODEL,
      elo_chesscom: el.eloChesscom.value.trim(),
      elo_fide: el.eloFide.value.trim(),
      descripcion: el.desc.value.trim()
    };
    saveProfile(p);
    refreshAppMode();
    closeModal('tutor-config-modal');
    toast('Configuración guardada ✓');
  }
  el.btnSave.addEventListener('click', saveFromForm);

  el.exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ profile: loadProfile(), progress: loadProgress() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `martina-tutor-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Progreso exportado ✓');
  });
  el.clearAll.addEventListener('click', () => {
    if (!confirm('¿Borrar TODO el progreso y la clave? No se puede deshacer.')) return;
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_PROGRESS);
    refreshAppMode();
    fillConfigForm();
    el.lessonHTML.hidden = true;
    el.lessonFoot.hidden = true;
    el.idle.hidden = false;
    el.boardHost.innerHTML = '';
    el.boardHost.appendChild(el.boardEmpty);
    el.boardEmpty.hidden = false;
    el.pgnRaw.textContent = '';
    renderProgress();
    toast('Listo para empezar de nuevo');
    switchTab('sesion');
  });

  // ---- Idle dinámico según progreso ----
  function updateIdle() {
    const n = (loadProgress().sesiones || []).length;
    if (n === 0) {
      el.idleTitle.textContent = '¿Empezamos?';
      el.idleText.textContent = 'Martina preparará una lección a tu medida, con un tablero para reproducir la partida jugada por jugada.';
      el.generate.textContent = '✨ Empezar mi primera sesión';
    } else {
      el.idleTitle.textContent = `Ya llevas ${n} ${n === 1 ? 'sesión' : 'sesiones'}`;
      el.idleText.textContent = 'Pulsa para generar la siguiente lección. Martina recordará por dónde vas y avanzará sin repetir.';
      el.generate.textContent = '▶ Generar siguiente sesión';
    }
  }

  // ---- Progreso: lista lineal de sesiones generadas ----
  function renderProgress() {
    const pg = loadProgress();
    const ses = pg.sesiones || [];
    if (!ses.length) {
      el.historyList.innerHTML = '<li class="tutor-progress-empty">Aún no has generado sesiones.</li>';
      return;
    }
    el.historyList.innerHTML = ses.slice().reverse().map((s, idx) => {
      const i = ses.length - idx;
      const realIdx = ses.length - idx - 1;
      
      let fbBadge = '';
      if (s.feedback === 'Lo entendí') {
        fbBadge = `<span class="tutor-session-badge ok">✅ Entendido</span>`;
      } else if (s.feedback === 'Más difícil') {
        fbBadge = `<span class="tutor-session-badge hard">🔥 Más difícil</span>`;
      } else if (s.feedback === 'Repetir el concepto') {
        fbBadge = `<span class="tutor-session-badge repeat">🔁 Reforzar</span>`;
      }

      const conceptEmoji = getConceptEmoji(s.concepto);
      const isMagic = s.mundo === 'mágico';
      const worldClass = isMagic ? 'magic' : 'real';
      const worldLabel = isMagic ? 'Reino Mágico' : 'Mundo Real';

      const hasContent = !!s.leccion_html;
      const fecha = s.fecha ? new Date(s.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';
      return `<li class="tutor-session-item ${worldClass} ${hasContent ? 'clickable' : ''}" data-revisit="${realIdx}">
        <div class="tutor-session-left">
          <span class="tutor-session-num">#${i}</span>
          <span class="tutor-session-emoji" title="${s.concepto || ''}">${conceptEmoji}</span>
        </div>
        <div class="tutor-session-info">
          <div class="tutor-session-row1">
            <span class="tutor-session-concept">${s.concepto || 'Concepto'}</span>
            <span class="tutor-session-world-badge ${worldClass}">${worldLabel}</span>
          </div>
          <span class="tutor-session-title">${(s.titulo || '').slice(0, 64)}</span>
          <div class="tutor-session-row2">
            <span class="tutor-session-meta">${fecha}</span>
            ${fbBadge}
          </div>
        </div>
        ${hasContent ? '<span class="tutor-session-open">Reestudiar ↺</span>' : ''}
      </li>`;
    }).join('');
    el.historyList.querySelectorAll('[data-revisit]').forEach(li => {
      li.addEventListener('click', () => {
         const idx = parseInt(li.dataset.revisit, 10);
         revisitSession(idx);
      });
    });
  }

  function revisitSession(idx) {
    const pg = loadProgress();
    const s = pg.sesiones[idx];
    if (!s) return;
    switchTab('sesion');
    const v = validarPGN(s.pgn, s.start_fen);
    currentSession = s;
    renderSession(s, v.ok ? v : { ok: false, sans: [], fen: s.start_fen || INITIAL_FEN });
  }

  // ---- Esquema de la sesión (leccion como HTML) ----
  const SCHEMA = {
    name: 'martina_tutor_session',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['titulo', 'concepto', 'mundo', 'leccion_html', 'recomendaciones', 'pgn', 'start_fen', 'jugada_clave_san', 'referencia_idolo'],
      properties: {
        titulo: { type: 'string' },
        concepto: { type: 'string' },
        mundo: { type: 'string', enum: ['mágico', 'real'] },
        leccion_html: { type: 'string', description: 'HTML de la lección. Usa tags h2,h3,p,ul,ol,li,strong,em,blockquote,code,span. Clases Martina permitidas: martina-callout, martina-move, martina-concept, martina-idol, martina-reco. Estilo Martina: humor absurdo, emoción genuina. En español.' },
        recomendaciones: { type: 'array', items: { type: 'string' } },
        pgn: { type: 'string', description: 'PGN en notación algebraica estándar, jugadas legales desde start_fen. Sin cabeceras.' },
        start_fen: { type: 'string', description: 'FEN de inicio. Vacío = posición inicial estándar.' },
        jugada_clave_san: { type: 'string', description: 'Jugada clave SAN que debe aparecer en pgn.' },
        referencia_idolo: { type: 'string', enum: ['Polgar', 'Tal'] }
      }
    }
  };

  function buildMessages(profile, progress, override) {
    const sesiones = progress.sesiones || [];
    const conceptosVistos = sesiones.map(s => s.concepto).filter(Boolean);
    const nivel = [
      profile.elo_chesscom ? `Chess.com: ${profile.elo_chesscom}` : null,
      profile.elo_fide ? `FIDE: ${profile.elo_fide}` : null,
      profile.descripcion ? `Descripción: ${profile.descripcion}` : null
    ].filter(Boolean).join(' · ') || 'Nivel no especificado';

    const feedbackHint = override?.feedback
      ? `El usuario marcó la sesión anterior como "${override.feedback}". ${override.feedback === 'Más difícil' ? 'Sube profundidad/complejidad.' : override.feedback === 'Repetir el concepto' ? 'Refuerza el mismo concepto con otro ejemplo.' : 'Avanza a un concepto nuevo.'}`
      : '';

    const conceptosHint = conceptosVistos.length
      ? `Conceptos ya cubiertos en sesiones anteriores (evita repetir salvo feedback "Repetir"): ${conceptosVistos.slice(-12).join(', ')}.`
      : 'Primera sesión: empieza con un concepto fundacional.';

    // Historial compacto de las últimas sesiones (concepto + feedback) para continuidad.
    const historial = sesiones.slice(-8).map((s, i) => {
      const n = i + 1;
      return `${n}. ${s.concepto || '?'} [${s.feedback || 'sin feedback'}]`;
    }).join('\n');
    const historialHint = historial
      ? `Resumen de las últimas sesiones (para continuar donde quedaste y progresar de forma natural):\n${historial}`
      : '';

    const system = [
      'Eres el Tutor de Martina, de la web "Martina · Cuentos de Ajedrez".',
      'Martina: niña ajedrecista de 9 años, valiente, irónica, surrealista, AMA las tácticas (sobre todo clavadas).',
      'Estilo: humor absurdo con lógica interna, emociones y enseñanza genuinas. Tercera persona. Español. Oraciones cortas.',
      'Dos mundos: "mágico" (Reino de las 64 Casillas: Peoncito, Torreta, Reina Negra alérgica al mate, Caballo de Ŋ) y "real" (torneos, reloj, rivales, análisis).',
      'Genera UNA sesión corta incremental que enseñe un solo concepto de ajedrez real.',
      'Debes responder SIEMPRE con un único objeto JSON válido (sin texto fuera del JSON) con esta forma:',
      '{"titulo": string, "concepto": string, "mundo": "mágico"|"real", "leccion_html": string, "recomendaciones": string[], "pgn": string, "start_fen": string, "jugada_clave_san": string, "referencia_idolo": "Polgar"|"Tal"}',
      'Reglas del JSON:',
      '- "leccion_html": HTML (no markdown). Tags permitidos: h2,h3,p,ul,ol,li,strong,em,blockquote,code,span,div. Clases Martina permitidas: martina-callout, martina-move, martina-concept, martina-idol, martina-reco. Ej: <span class="martina-concept">Clavada</span>, <span class="martina-move">Cxd5</span>, <div class="martina-callout">…</div>, <div class="martina-idol"><strong>Judith Polgar</strong> …</div>, <div class="martina-reco"><h4>…</h4><ul>…</ul></div>.',
      '- "pgn": notación algebraica estándar, 100% legal desde "start_fen" (vacío = posición inicial). Puedes basarte en partidas famosas (Morphy, Tal, Polgar, Fischer, Kasparov…). Sin cabeceras.',
      '- "jugada_clave_san": jugada clave SAN que debe aparecer literalmente en "pgn".',
      '- "referencia_idolo": intégrala de forma natural (Polgar = precisión/ataque calculado; Tal = caos/sacrificio/imaginación).',
      '- "start_fen": FEN de inicio. Vacío = posición inicial estándar.'
    ].join('\n');

    const user = [
      `Nivel del usuario: ${nivel}.`,
      conceptosHint,
      historialHint,
      feedbackHint,
      'Genera la siguiente sesión. Continúa el aprendizaje de forma incremental. Devuelve SOLO el JSON, nada más.'
    ].filter(Boolean).join('\n');

    return [{ role: 'system', content: system }, { role: 'user', content: user }];
  }

  // ---- Sanitización HTML lección (allowlist) ----
  function sanitizeHTML(html) {
    const ALLOWED = new Set(['H2','H3','P','UL','OL','LI','STRONG','EM','BLOCKQUOTE','CODE','SPAN','DIV','BR']);
    const ALLOWED_CLASS = /^martina-(callout|move|concept|idol|reco)$/i;
    const tpl = document.createElement('template');
    tpl.innerHTML = String(html || '');
    const walk = (node) => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) return; // text ok
        if (child.nodeType === 1) {
          if (!ALLOWED.has(child.tagName)) { child.replaceWith(...child.childNodes); return walk(node); }
          // Limpiar atributos
          [...child.attributes].forEach(a => {
            if (a.name === 'class') { if (!ALLOWED_CLASS.test(a.value)) child.removeAttribute('class'); }
            else if (a.name === 'style') { child.removeAttribute('style'); }
            else child.removeAttribute(a.name);
          });
          walk(child);
        } else {
          node.removeChild(child);
        }
      });
    };
    walk(tpl.content);
    return tpl.innerHTML;
  }

  // ---- Streaming chat completion ----
  async function chatStream(profile, messages, onReason) {
    const key = (profile.openrouter_key || '').trim();
    // Diagnóstico en consola (sin exponer la clave completa)
    console.log('[tutor] petición a OpenRouter', {
      modelo: profile.model || DEFAULT_MODEL,
      longitudClave: key.length,
      prefijo: key.slice(0, 8),
      sufijo: key.slice(-4),
      mensajes: messages.length,
      streaming: true
    });
    if (!key) {
      const e = new Error('Falta la clave de OpenRouter. Ábrela en ⚙️ Configuración.');
      e.code = 401; throw e;
    }

    const modelId = profile.model || DEFAULT_MODEL;
    const useStruct = modelSupportsStruct(modelId);
    const useJson = modelSupportsJson(modelId);
    const response_format = useStruct
      ? { type: 'json_schema', json_schema: SCHEMA }
      : (useJson ? { type: 'json_object' } : undefined);

    console.log('[tutor] formato respuesta', {
      modelo: modelId,
      json_schema: useStruct,
      json_object: useJson && !useStruct
    });

    const body = {
      model: modelId,
      messages,
      temperature: 0.7,
      stream: true
    };
    if (response_format) body.response_format = response_format;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin + '/tutor.html',
        'X-Title': 'Martina Tutor'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => '');
      let msg = `OpenRouter ${res.status}`;
      try { msg += ': ' + (JSON.parse(txt).error?.message || txt.slice(0, 160)); } catch { msg += ': ' + txt.slice(0, 160); }
      console.warn('[tutor] error OpenRouter', res.status, msg);
      if (res.status === 401) {
        const err = new Error('Clave de OpenRouter inválida o no reconocida. Verifica que sea sk-or-v1-... y que la cuenta esté activa.');
        err.code = 401;
        err.raw = msg;
        throw err;
      }
      const err = new Error(msg);
      err.code = res.status;
      throw err;
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '', content = '', reason = '';
    let firstChunk = true;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (!t || !t.startsWith('data:')) continue;
        const data = t.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const j = JSON.parse(data);
          const delta = j.choices?.[0]?.delta;
          if (delta?.reasoning) { reason += delta.reasoning; onReason(reason); }
          if (delta?.content) {
            if (firstChunk) { firstChunk = false; }
            content += delta.content;
          }
        } catch {}
      }
    }
    if (!content) throw new Error('Respuesta vacía del modelo');
    return content;
  }

  // ---- Validar PGN (auto-trunca en la primera jugada ilegal) ----
  // Devuelve { ok, fen, sans, uciMap, truncated }
  // Si la jugada N es ilegal, se conserva el prefijo [0..N-1].
  function validarPGN(pgn, startFen) {
    if (!pgn || !pgn.trim()) return { ok: false, error: 'PGN vacío' };
    const fen = (startFen || '').trim() || INITIAL_FEN;
    try {
      const sans = ChessEngine.pgnToMoves(pgn);
      if (!sans.length) return { ok: false, error: 'No se parsearon jugadas' };
      let current = fen, uciMap = [], validSans = [], truncated = false;
      for (const san of sans) {
        const uci = ChessEngine.sanToUCI(current, san);
        if (!uci) { truncated = true; break; }
        current = ChessEngine.executeMoveRaw(current, uci);
        uciMap.push({ san, uci }); validSans.push(san);
      }
      if (!validSans.length) return { ok: false, error: 'Ninguna jugada válida' };
      return { ok: true, fen, sans: validSans, uciMap, truncated };
    } catch (e) { return { ok: false, error: String(e.message || e) }; }
  }

  // PGN de la parte válida (para mostrar al usuario)
  function buildPGN(sans) {
    let out = '';
    for (let i = 0; i < sans.length; i++) {
      if (i % 2 === 0) out += `${Math.floor(i / 2) + 1}. `;
      out += sans[i] + ' ';
    }
    return out.trim();
  }

  // ---- Estado de sesión actual ----
  let currentSession = null;

  // Frases pre-armadas para mostrar progreso mientras se genera.
  const THINKING_PHRASES = [
    'Peoncito afina su bigote…',
    'Torreta hornea una empanada de apertura…',
    'El Alfil Exiliado reinventa la geometría…',
    'La Reina Negra estornuda lejos del mate…',
    'Martina consulta a Tal en el bosque oscuro…',
    'Judith Polgar calcula una línea quirúrgica…',
    'Buscando la partida perfecta en el archivo…',
    'El Caballo de Ŋ ensaya un salto prohibido…',
    'Clavadas, desvíaciones, piezas sobrecargadas…',
    'Cruzando el Gran Río Central…'
  ];
  let thinkingTimer = null;
  let thinkingIdx = 0;

  function startThinkingPhrases() {
    thinkingIdx = 0;
    if (!el.reason) return;
    el.reason.hidden = false;
    el.reason.textContent = THINKING_PHRASES[0];
    clearInterval(thinkingTimer);
    thinkingTimer = setInterval(() => {
      thinkingIdx = (thinkingIdx + 1) % THINKING_PHRASES.length;
      if (!el.thinking.hidden) el.reason.textContent = THINKING_PHRASES[thinkingIdx];
    }, 1600);
  }
  function stopThinkingPhrases() {
    clearInterval(thinkingTimer);
    thinkingTimer = null;
  }

  // Estado de sesión actual (declarado arriba)
  function setThinking() {
    el.idle.hidden = true;
    el.error.hidden = true;
    el.lessonHTML.hidden = true;
    el.lessonFoot.hidden = true;
    el.boardEmpty.hidden = true;
    el.boardHost.innerHTML = '';
    el.pgnRaw.textContent = '';
    el.thinking.hidden = false;
    el.reason.hidden = true;
    el.reason.textContent = '';
    el.thinkingRaw.hidden = true;
    el.thinkingRawText.textContent = '';
    el.thinkingTitle.textContent = 'Martina está pensando…';
    el.next.disabled = true;
    el.generate.disabled = true;
    startThinkingPhrases();
  }

  async function generateSession(override) {
    const profile = loadProfile();
    if (!profileValid(profile)) { openModal('tutor-config-modal'); return; }

    setThinking();

    const progress = loadProgress();
    let messages = buildMessages(profile, progress, override);
    let lastErr = null, session = null;

    // Bucle de reintentos: se reinicia solo si el JSON llegó pero el PGN es inválido.
    // Máximo 3 intentos (incluyendo el inicial).
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (attempt > 1) {
        // Ya añadimos el mensaje de corrección al final del intento anterior.
      }
      // Indicador visible de intento
      stopThinkingPhrases();
      if (attempt === 1) {
        startThinkingPhrases();
      } else {
        el.thinkingTitle.textContent = `Corrigiendo el PGN…`;
        el.reason.hidden = false;
        el.reason.textContent = `Intento ${attempt}/3`;
      }

      try {
        const raw = await chatStream(profile, messages, r => {
          // Mostrar el razonamiento crudo en un details colapsado, sin expandirlo
          // automáticamente: el usuario decide abrirlo si quiere.
          el.thinkingRaw.hidden = false;
          el.thinkingRawText.textContent = (r || '').slice(-1200);
        });

        let parsed;
        try { parsed = JSON.parse(raw); }
        catch { const m = raw.match(/\{[\s\S]*\}/); if (!m) throw new Error('No es JSON válido'); parsed = JSON.parse(m[0]); }

        const v = validarPGN(parsed.pgn, parsed.start_fen);
        if (!v.ok) {
          //PGN inválido: pedir corrección específica y reintentar.
          lastErr = `PGN inválido: ${v.error}`;
          messages.push({ role: 'assistant', content: raw });
          messages.push({ role: 'user', content: `[ERROR ${attempt}/3] Tu PGN falló: ${v.error}. Reenvía el JSON con el PGN corregido (jugadas legales desde start_fen o la posición inicial). Mantén todo lo demás igual.` });
          continue;
        }
        // ¡Éxito!
        session = parsed;
        session._validated = v;
        session.pgn = buildPGN(v.sans);
        if (v.truncated && !v.sans.includes(parsed.jugada_clave_san || '')) {
          session.jugada_clave_san = v.sans[v.sans.length - 1] || '';
          session._truncated = true;
        }
        break;
      } catch (e) {
        lastErr = String(e.message || e);
        if (e.code === 401) {
          // Credenciales: no reintentes, abre config.
          break;
        }
        // Otro error de red: no reintentar JSON-vacío.
        break;
      }
    }

    stopThinkingPhrases();
    el.thinking.hidden = true;
    el.reason.hidden = true;
    el.generate.disabled = false;
    el.next.disabled = false;

    if (!session) {
      el.error.hidden = false;
      let hint = '';
      if (lastErr && lastErr.includes('401')) {
        hint = '<br><span style="font-size:.85rem">Abriendo configuración para que revises tu clave…</span>';
        setTimeout(() => openModal('tutor-config-modal'), 1500);
      }
      el.error.innerHTML = `<strong>No se pudo generar la sesión.</strong><br><span style="font-size:.85rem">${(lastErr || 'Intenta de nuevo.').replace(/</g,'&lt;')}</span>${hint}`;
      return;
    }

    const pg = loadProgress();
    pg.sesiones.push({
      titulo: session.titulo, concepto: session.concepto, mundo: session.mundo,
      model: profile.model || DEFAULT_MODEL, fecha: new Date().toISOString(),
      // Guardar contenido completo para poder revisitar la sesión
      leccion_html: session.leccion_html || '',
      recomendaciones: session.recomendaciones || [],
      pgn: session.pgn || '',
      start_fen: session.start_fen || '',
      jugada_clave_san: session.jugada_clave_san || '',
      referencia_idolo: session.referencia_idolo || ''
    });
    saveProgress(pg);
    currentSession = session;
    renderSession(session, session._validated);
    renderProgress();
  }

  function renderSession(session, v) {
    // Lección
    el.idle.hidden = true;
    el.kicker.textContent = (session.mundo === 'real' ? '🌍 Mundo Real' : '✨ Reino Mágico') + ' · ' + (session.concepto || '');
    el.sessionTitle.textContent = session.titulo || 'Sesión';
    const recoHTML = (session.recomendaciones || []).length
      ? `<div class="martina-reco"><h4>📌 Recomendaciones</h4><ul>${session.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul></div>`
      : '';
    const idol = session.referencia_idolo
      ? `<div class="martina-idol"><strong>${session.referencia_idolo}</strong> — ${session.referencia_idolo === 'Tal' ? 'imaginación y sacrificio: llevar al rival a un bosque donde 2+2=5.' : 'precisión quirúrgica y ataque calculado: romper barreras.'}</div>`
      : '';
    el.lessonHTML.innerHTML = sanitizeHTML((session.leccion_html || '') + idol + recoHTML);
    el.lessonHTML.hidden = false;
    el.lessonFoot.hidden = false;

    // Tablero
    el.boardHost.innerHTML = '';
    const ok = ChessReplayer.fromPGN(el.boardHost, {
      pgn: session.pgn, startFen: session.start_fen,
      lightColor: '#dfd0b8', darkColor: '#3c5c4e', accentColor: '#fbbf24'
    });
    if (!ok) {
      el.boardHost.innerHTML = '<p class="tutor-error">No se pudo cargar el tablero para este PGN.</p>';
    } else {
      try {
        const clave = (session.jugada_clave_san || '').trim();
        if (clave && v && v.ok) {
          const idx = v.sans.findIndex(s => s === clave);
          if (idx >= 0) ok.goToStep(idx + 1);
        }
      } catch {}
    }
    el.pgnRaw.textContent = session.pgn || '';
  }

  // ---- Feedback ----
  function feedback(type) {
    if (!currentSession) return;
    const pg = loadProgress();
    const last = pg.sesiones[pg.sesiones.length - 1];
    if (last) { last.feedback = type; saveProgress(pg); }
    renderProgress();
    toast('¡Gracias! Preparando la siguiente…');
    generateSession({ feedback: type });
  }
  $('tutor-fb-ok').addEventListener('click', () => feedback('Lo entendí'));
  $('tutor-fb-hard').addEventListener('click', () => feedback('Más difícil'));
  $('tutor-fb-repeat').addEventListener('click', () => feedback('Repetir el concepto'));
  el.generate.addEventListener('click', () => generateSession(null));
  el.next.addEventListener('click', () => generateSession(null));

  // ---- Init ----
  ensureModels();
  fillConfigForm();
  refreshAppMode();
  
  const pg = loadProgress();
  const ses = pg.sesiones || [];
  if (profileValid(loadProfile()) && ses.length > 0) {
    revisitSession(ses.length - 1);
  } else {
    updateIdle();
  }
  renderProgress();
})();