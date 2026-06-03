// === JUEGO: SUPER MARTINA · EL SALTO MÁGICO ===
// Minijuego estrella de plataformas en 2D al estilo retro.
// Desarrollado con el potente motor Phaser 3 (cargado dinámicamente)
// y con los assets de ilustración oficiales de Martina para una fidelidad total.

class MarioGame {
  constructor(container) {
    this.container = container;
    this.container.style.position = 'relative';
    
    // Core game state
    this.currentLevelIndex = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.gameState = 'welcome'; // 'welcome', 'playing', 'gameover', 'victory'
    this.musicEnabled = localStorage.getItem('martina_mario_mute') !== 'true';
    
    // Chapters levels information
    this.levels = [
      { num: 1, name: "El Primer Movimiento", icon: "👣", biome: "grass", unlocked: true, desc: "Pradera del Centro. El tablero mágico despierta entre campos verdes." },
      { num: 2, name: "Tic, Tac, Jaque Mate", icon: "⏱️", biome: "clockwork", unlocked: false, desc: "El Reloj del Torneo. Engranajes de madera y pasillos mecánicos." },
      { num: 3, name: "La Clavada del Alfil Exiliado", icon: "📐", biome: "neon", unlocked: false, desc: "La Diagonal del Exilio. Una cuadrícula de rayos de neón púrpuras." },
      { num: 4, name: "El Caballo Salvaje", icon: "🐴", biome: "stable", unlocked: false, desc: "Puesto Avanzado de Ŋ. Bosque espeso y plataformas de madera silvestre." },
      { num: 5, name: "La Coronación de Peoncito", icon: "👑", biome: "castle", unlocked: false, desc: "La Octava Fila. El majestuoso castillo de oro y coronas." },
      { num: 6, name: "La Jugada Invisible", icon: "🐉", biome: "volcano", unlocked: false, desc: "Siciliana Dragón. Cueva volcánica de plataformas ardientes." },
      { num: 7, name: "El Pescador y el Elegante", icon: "🌉", biome: "river", unlocked: false, desc: "Oposición en el Río. Deslizamientos sobre puentes de agua cristalina." },
      { num: 8, name: "El Relámpago y el Vikingo", icon: "⛵", biome: "ocean", unlocked: false, desc: "Blitz Escandinavo. El mar embravecido y las cubiertas del barco vikingo." },
      { num: 9, name: "La Sombra que Jugaba", icon: "👥", biome: "mirror", unlocked: false, desc: "El Laberinto de la Sombra. Un mundo en espejo con reflejos oscuros." },
      { num: 10, name: "Lo que no se ve en el Tablero", icon: "🌫️", biome: "swamp", unlocked: false, desc: "Niebla de la Frustración. Un pantano cubierto de misteriosa bruma." },
      { num: 11, name: "La Última Grieta", icon: "🏜️", biome: "canyon", unlocked: false, desc: "Columnas Abiertas. Desfiladeros y cañones rocosos agrietados." },
      { num: 12, name: "El Peón que Bailaba", icon: "💃", biome: "temple", unlocked: false, desc: "Fianchetto Rítmico. Un templo de plataformas musicales danzantes." },
      { num: 13, name: "Lo que estaba Escrito", icon: "🏺", biome: "desert", unlocked: false, desc: "Diagonales Sagradas. Dunas de arena y ruinas ancestrales de ajedrez." },
      { num: 14, name: "Hielo que Quema", icon: "❄️", biome: "glacier", unlocked: false, desc: "Glaciar del Norte. Bloques helados sumamente resbaladizos." },
      { num: 15, name: "El Último Capítulo", icon: "☁️", biome: "sky", unlocked: false, desc: "El Enroque Celestial. Nubes flotantes en la cima del reino." },
      { num: 16, name: "Fuego contra Todos", icon: "🌋", biome: "lava", unlocked: false, desc: "El Volcán del Final. El desafío definitivo en el cráter de fuego." }
    ];

    // Unlocked levels progress tracking
    this.unlockedLevels = JSON.parse(localStorage.getItem('martina_mario_unlocked')) || [true];
    while (this.unlockedLevels.length < this.levels.length) {
      this.unlockedLevels.push(false);
    }

    // Best score per level tracking (for trophies & completion %)
    this.bestScores = JSON.parse(localStorage.getItem('martina_mario_bestscores')) || {};
    // Max possible score per level
    this.maxScores = (window.MartinaLevels && window.MartinaLevels.maxScore) || { 0: 9900 };

    // Audio sequencer loops
    this.musicInterval = null;
    this.synthNotes = [];
    
    // Phaser game instance reference
    this.phaserGame = null;
    this.touchInputs = { left: false, right: false, jump: false, dash: false };
  }

  // --- WELCOME LEVEL SELECTOR SCREEN ---
  showWelcomeScreen() {
    this.gameState = 'welcome';
    this.stopMusic();
    
    // Load unlocked levels from localStorage (persist across sessions)
    this.unlockedLevels = JSON.parse(localStorage.getItem('martina_mario_unlocked')) || [true];
    while (this.unlockedLevels.length < this.levels.length) {
      this.unlockedLevels.push(false);
    }
    
    // Ensure level 1 is always unlocked
    this.unlockedLevels[0] = true;
    
    // Cap unlocked levels to only those that actually exist in MartinaLevels
    const maxImplemented = (window.MartinaLevels && window.MartinaLevels.levels) ? window.MartinaLevels.levels.length : 1;
    for (let i = maxImplemented; i < this.unlockedLevels.length; i++) {
      this.unlockedLevels[i] = false;
    }
    
    // Calculate overall completion
    let totalPct = 0;
    let completedCount = 0;
    
    let levelGridHTML = '';
    
    this.levels.forEach((level, idx) => {
      const isUnlocked = this.unlockedLevels[idx] === true;
      const maxScore = this.maxScores[idx] || 9900;
      const best = this.bestScores[idx] || 0;
      const pct = maxScore ? Math.min(100, Math.round((best / maxScore) * 100)) : 0;
      
      if (best > 0) {
        totalPct += pct;
        completedCount++;
      }
      
      const trophy = best > 0 
        ? (pct >= 100 ? '🏆' : pct >= 75 ? '🥇' : pct >= 50 ? '🥈' : pct >= 25 ? '🥉' : '👣')
        : '';
      
      const displayDesc = idx < maxImplemented ? level.desc : `${level.desc} (Próximamente)`;
      
      const statsHTML = isUnlocked ? `
        <div class="mario-level-progress">
          ${best > 0 ? `
          <div class="mario-level-bar-bg">
            <div class="mario-level-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="mario-level-stats">
            <span class="mario-level-score">🏅 ${best.toLocaleString()} pts</span>
            <span class="mario-level-pct">${pct}%</span>
          </div>
          ` : `
          <span class="mario-level-cta">¡Sin jugar aún!</span>
          `}
        </div>
      ` : '';
      
      const trophyBadge = trophy ? `<span class="mario-node-trophy">${trophy}</span>` : '';
      
      levelGridHTML += `
        <div class="mario-stage-node ${isUnlocked ? 'unlocked' : ''}" data-level="${idx}">
          <div class="mario-node-lock">${isUnlocked ? '🔓' : '🔒'}</div>
          <div class="mario-node-badge">${isUnlocked ? level.icon : '❓'}${trophyBadge}</div>
          <div class="mario-node-num">Nivel ${level.num}</div>
          <div class="mario-node-name">${level.name}</div>
          <div class="mario-node-desc">${displayDesc}</div>
          ${statsHTML}
          <div class="mario-node-status">${isUnlocked ? 'Disponible' : 'Bloqueado'}</div>
          <button class="mario-node-play-btn">Jugar ➔</button>
        </div>
      `;
    });
    
    const overallPct = completedCount > 0 ? Math.round(totalPct / completedCount) : 0;
    const overallTrophy = overallPct >= 100 ? '🏆' : overallPct >= 75 ? '🥇' : overallPct >= 50 ? '🥈' : overallPct >= 25 ? '🥉' : '🔰';
    
    this.container.innerHTML = `
      <div class="mario-outer-container">
        <div class="mario-map-container">
          <div class="mario-map-header">
            <h2>⭐️ Super Martina: El Salto Mágico ⭐️</h2>
            <p>¡Explora el primer capítulo del reino! Corre, salta sobre plataformas y despierta el tablero mágico.</p>
            ${completedCount > 0 ? `
            <div class="mario-overall-stats">
              <div class="mario-overall-trophy">${overallTrophy}</div>
              <div class="mario-overall-info">
                <span class="mario-overall-label">Progreso total — ${completedCount} nivel(es) completado(s)</span>
                <div class="mario-overall-bar-bg">
                  <div class="mario-overall-bar-fill" style="width:${overallPct}%"></div>
                </div>
                <span class="mario-overall-pct">${overallPct}% promedio</span>
              </div>
            </div>
            ` : ''}
          </div>
          <div class="mario-map-grid">
            ${levelGridHTML}
          </div>
        </div>
      </div>
    `;

    // Add event listeners to stages
    const nodes = this.container.querySelectorAll('.mario-stage-node.unlocked');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-level'));
        this.currentLevelIndex = idx;
        window.GameAudio.playMove();
        this.startLevel();
      });
    });
  }

  // --- START ACTIVE LEVEL (PHASER DYNAMIC LOADING) ---
  startLevel() {
    this.gameState = 'playing';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;

    this.setupLevelLayout();
    this.loadBase64Images().then(() => {
      this.loadPhaser(() => {
        this.initPhaserEngine();
        this.startMusic();
      });
    });
  }

  loadBase64Images() {
    return Promise.resolve();
  }

  // --- DYNAMIC PHASER SCRIPT LOAD ---
  loadPhaser(callback) {
    if (window.Phaser) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.id = 'phaser-cdn-script';
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js';
    script.onload = callback;
    script.onerror = () => {
      const parent = document.getElementById('phaser-game-parent');
      if (parent) {
        parent.innerHTML = `
          <div class="game-screen">
            <h2>Error de Conexión</h2>
            <p>No se pudo cargar el motor Phaser 3 desde la red. Verifica tu conexión.</p>
          </div>
        `;
      }
    };
    document.body.appendChild(script);
  }

  // --- SETUP HTML STRUCTURE OF ACTIVE LEVEL ---
  setupLevelLayout() {
    this.container.innerHTML = `
      <div class="mario-outer-container">
        <div class="mario-game-wrapper">
          
          <!-- Retro NES Status HUD -->
          <div class="mario-hud-bar">
            <div class="mario-hud-group">
              <div class="mario-hud-item">
                <span class="mario-hud-label">Martina</span>
                <span class="mario-hud-val" id="hud-score">00000</span>
              </div>
              <div class="mario-hud-item">
                <span class="mario-hud-label">Monedas</span>
                <span class="mario-hud-val" id="hud-coins">🪙 x00</span>
              </div>
            </div>
            <div class="mario-hud-group">
              <div class="mario-hud-item">
                <span class="mario-hud-label">Mundo</span>
                <span class="mario-hud-val" id="hud-chapter">${this.currentLevelIndex + 1}-1</span>
              </div>
              <div class="mario-hud-item">
                <span class="mario-hud-label">Vidas</span>
                <span class="mario-hud-val" id="hud-lives">❤️ x3</span>
              </div>
            </div>
            <div class="mario-hud-group">
              <button class="mario-hud-btn" id="mario-btn-mute">
                ${this.musicEnabled ? '🔊 Sonido' : '🔇 Mute'}
              </button>
              <button class="mario-hud-btn" id="mario-btn-quit" style="background: rgba(231,111,81,0.2); border-color: rgba(231,111,81,0.4); color: #ff9e80;">
                Salir 📋
              </button>
            </div>
          </div>

          <!-- Active Canvas Container -->
          <div class="mario-canvas-container" id="phaser-game-parent">
            <!-- Phaser canvas will be dynamically injected here -->
            
            <!-- Mobile Translucent Touch Gamepad -->
            <div class="mario-touch-pad">
              <div class="touch-group touch-group-left">
                <div class="touch-btn left" id="touch-left">◀</div>
                <div class="touch-btn right" id="touch-right">▶</div>
                <div class="touch-btn dash" id="touch-dash" style="background:rgba(245,158,11,0.2);border-color:rgba(245,158,11,0.4);color:#fef08a;">B</div>
              </div>
              <div class="touch-group touch-group-right">
                <div class="touch-btn jump" id="touch-jump">A</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Attach HUD control events
    document.getElementById('mario-btn-quit').addEventListener('click', () => {
      this.destroy();
      this.showWelcomeScreen();
    });

    // Bind mobile gamepad touch controls
    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      
      const setInput = (val) => {
        this.touchInputs[key] = val;
        if (val) el.classList.add('active');
        else el.classList.remove('active');
      };
      
      el.addEventListener('touchstart', (e) => { e.preventDefault(); setInput(true); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); setInput(false); }, { passive: false });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); setInput(true); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); setInput(false); });
      el.addEventListener('mouseleave', (e) => { e.preventDefault(); setInput(false); });
    };

    bindTouch('touch-left', 'left');
    bindTouch('touch-right', 'right');
    bindTouch('touch-jump', 'jump');
    bindTouch('touch-dash', 'dash');
  }

  // === RUNNER GAME MODE (Level 5 — La Coronación de Peoncito) ===

  setupRunner(scene, levelDef) {
    const self = this;

    // === SHARED TEXTURES (normally in platformer create, needed here too) ===

    // Sparkle particles
    if (!scene.textures.exists('sparkle')) {
      const drawSparkle = (r1, g1, b1, r2, g2, b2) => {
        const c = document.createElement('canvas');
        c.width = 16; c.height = 16;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        g.addColorStop(0.3, `rgba(${r1},${g1},${b1},0.9)`);
        g.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(8, 0); ctx.lineTo(10, 6); ctx.lineTo(16, 8);
        ctx.lineTo(10, 10); ctx.lineTo(8, 16);
        ctx.lineTo(6, 10); ctx.lineTo(0, 8);
        ctx.lineTo(6, 6); ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.arc(8, 8, 2.2, 0, Math.PI*2); ctx.fill();
        return c;
      };
      scene.textures.addCanvas('sparkle', drawSparkle(255, 223, 0, 255, 180, 0));
      scene.textures.addCanvas('sparkle_cyan', drawSparkle(34, 211, 238, 56, 189, 248));
      scene.textures.addCanvas('sparkle_purple', drawSparkle(167, 139, 250, 139, 92, 246));
    }

    // Coin frames + animation
    if (!scene.textures.exists('coin_0')) {
      const drawCoin = (squash) => {
        const c = document.createElement('canvas');
        c.width = 24; c.height = 24;
        const ctx = c.getContext('2d');
        const cx = 12, cy = 12;
        const g = ctx.createLinearGradient(cx-8, cy-8, cx+8, cy+8);
        g.addColorStop(0, '#fef3c7'); g.addColorStop(0.3, '#fbbf24');
        g.addColorStop(0.6, '#f59e0b'); g.addColorStop(1, '#b45309');
        ctx.fillStyle = g;
        ctx.beginPath();
        const or = 9, ir = 3.5;
        for (let i = 0; i < 5; i++) {
          const ao = (i*72-90)*Math.PI/180, ai = (i*72-90+36)*Math.PI/180;
          const ox = cx+Math.cos(ao)*or*(1-squash*.3), oy = cy+Math.sin(ao)*or;
          const ix = cx+Math.cos(ai)*ir*(1-squash*.3), iy = cy+Math.sin(ai)*ir;
          if (i===0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(cx-2, cy-2, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, Math.PI*2); ctx.fill();
        return c;
      };
      scene.textures.addCanvas('coin_0', drawCoin(0));
      scene.textures.addCanvas('coin_1', drawCoin(0.4));
      scene.textures.addCanvas('coin_2', drawCoin(0.8));
      scene.textures.addCanvas('coin_3', drawCoin(0.5));
      scene.anims.create({
        key: 'coin-spin',
        frames: [{key:'coin_0'},{key:'coin_1'},{key:'coin_2'},{key:'coin_3'},{key:'coin_1'}],
        frameRate: 10, repeat: -1
      });
    }

    // Crown
    if (!scene.textures.exists('crown_gold')) {
      const cr = document.createElement('canvas');
      cr.width = 36; cr.height = 36;
      const ctx = cr.getContext('2d');
      const g = ctx.createLinearGradient(6, 6, 30, 30);
      g.addColorStop(0, '#fef3c7'); g.addColorStop(0.3, '#fbbf24');
      g.addColorStop(0.7, '#f59e0b'); g.addColorStop(1, '#b45309');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(5, 30); ctx.lineTo(31, 30);
      ctx.lineTo(29, 14); ctx.lineTo(23, 20);
      ctx.lineTo(18, 7); ctx.lineTo(13, 20);
      ctx.lineTo(7, 14); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#78350f'; ctx.fillRect(4, 29, 28, 4);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(4, 29, 28, 1.5);
      const rg = ctx.createRadialGradient(18, 6, 0, 18, 6, 4);
      rg.addColorStop(0, '#ffffff'); rg.addColorStop(0.3, '#fca5a5'); rg.addColorStop(1, '#ef4444');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(18, 6, 3, 0, Math.PI*2); ctx.fill();
      const sg = ctx.createRadialGradient(7, 12, 0, 7, 12, 2.5);
      sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.3, '#93c5fd'); sg.addColorStop(1, '#3b82f6');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(7, 12, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(29, 12, 2, 0, Math.PI*2); ctx.fill();
      scene.textures.addCanvas('crown_gold', cr);
    }

    // Portal
    if (!scene.textures.exists('portal_texture')) {
      const po = document.createElement('canvas');
      po.width = 160; po.height = 160;
      const ctx = po.getContext('2d');
      const pg = ctx.createRadialGradient(80, 80, 5, 80, 80, 80);
      pg.addColorStop(0, '#090514'); pg.addColorStop(0.6, '#1e1b4b');
      pg.addColorStop(0.9, '#312e81'); pg.addColorStop(1, '#4338ca');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(80, 80, 80, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(251,191,36,0.25)'; ctx.lineWidth = 1;
      for (let i = 0; i < 24; i++) {
        const a = (i*15)*Math.PI/180;
        ctx.beginPath(); ctx.moveTo(80, 80);
        for (let r = 0; r <= 80; r += 4)
          ctx.lineTo(80+Math.cos(a+r*0.025)*r, 80+Math.sin(a+r*0.025)*r);
        ctx.stroke();
      }
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(80, 80, 77, 0, Math.PI*2); ctx.stroke();
      scene.textures.addCanvas('portal_texture', po);
    }

    // Enemy (shadow peoncito for chasers)
    if (!scene.textures.exists('enemy')) {
      const ec = document.createElement('canvas');
      ec.width = 32; ec.height = 42;
      const ctx = ec.getContext('2d');
      const eg = ctx.createLinearGradient(8, 20, 24, 38);
      eg.addColorStop(0, '#c084fc'); eg.addColorStop(0.5, '#6b21a8'); eg.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.moveTo(12, 19); ctx.lineTo(20, 19);
      ctx.quadraticCurveTo(23, 29, 24, 38); ctx.lineTo(8, 38);
      ctx.quadraticCurveTo(9, 29, 12, 19);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#1e1b4b'; ctx.fillRect(6, 38, 20, 3);
      ctx.fillStyle = '#a855f7'; ctx.fillRect(6, 38, 20, 1);
      const hg = ctx.createRadialGradient(14, 11, 1, 16, 12, 8);
      hg.addColorStop(0, '#f3e8ff'); hg.addColorStop(0.3, '#d8b4fe');
      hg.addColorStop(0.8, '#6b21a8'); hg.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(16, 12, 7.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(13, 11, 1.5, 0, Math.PI*2); ctx.arc(19, 11, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(13, 11, 0.6, 0, Math.PI*2); ctx.arc(19, 11, 0.6, 0, Math.PI*2); ctx.fill();
      // Mustache
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(16, 15);
      ctx.bezierCurveTo(12, 14, 7, 16, 5, 19);
      ctx.bezierCurveTo(6, 22, 11, 19, 16, 16.5);
      ctx.moveTo(16, 15);
      ctx.bezierCurveTo(20, 14, 25, 16, 27, 19);
      ctx.bezierCurveTo(26, 22, 21, 19, 16, 16.5);
      ctx.closePath(); ctx.fill();
      scene.textures.addCanvas('enemy', ec);
    }

    // === MARTINA FROM BEHIND (runner sprite) ===
    const drawMartinaBehind = (frame) => {
      const c = document.createElement('canvas');
      c.width = 48; c.height = 64;
      const ctx = c.getContext('2d');

      // Hair — larger, flows behind
      ctx.fillStyle = '#3f1d0b';
      ctx.beginPath();
      ctx.arc(24, 18, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(11, 18, 26, 26);
      // Ponytail bouncing
      ctx.beginPath();
      ctx.moveTo(24, 30);
      const bounce = frame % 2 === 0 ? 0 : 3;
      ctx.bezierCurveTo(30, 24, 36, 30-bounce, 34, 38-bounce);
      ctx.bezierCurveTo(36, 34-bounce, 40, 42, 36, 48);
      ctx.bezierCurveTo(34, 50, 30, 44, 28, 40);
      ctx.fill();

      // Polo shirt back
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 30, 20, 12);
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(24, 30); ctx.lineTo(24, 42); ctx.stroke();

      // Blue shorts
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(14, 42, 10, 10);
      ctx.fillRect(24, 42, 10, 10);

      // Legs running
      ctx.fillStyle = '#fed7aa';
      const legOff = frame === 0 || frame === 2 ? 0 : 2;
      ctx.fillRect(16-legOff, 52, 4, 8);
      ctx.fillRect(28+legOff, 52, 4, 8);

      // Sneakers
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(15-legOff, 58, 5, 4);
      ctx.fillRect(27+legOff, 58, 5, 4);

      // Arms pumping
      ctx.fillStyle = '#ffffff';
      if (frame === 0) {
        ctx.fillRect(11, 32, 3, 6);
        ctx.fillRect(34, 34, 3, 6);
      } else if (frame === 1) {
        ctx.fillRect(10, 30, 3, 6);
        ctx.fillRect(35, 36, 3, 6);
      } else if (frame === 2) {
        ctx.fillRect(13, 34, 3, 6);
        ctx.fillRect(32, 30, 3, 6);
      }
      ctx.fillStyle = '#fed7aa';
      if (frame === 0) {
        ctx.fillRect(10, 37, 4, 2); ctx.fillRect(34, 39, 4, 2);
      } else if (frame === 1) {
        ctx.fillRect(9, 35, 4, 2); ctx.fillRect(35, 41, 4, 2);
      } else {
        ctx.fillRect(12, 39, 4, 2); ctx.fillRect(32, 35, 4, 2);
      }

      return c;
    };

    if (!scene.textures.exists('runner-martina-0')) {
      scene.textures.addCanvas('runner-martina-0', drawMartinaBehind(0));
      scene.textures.addCanvas('runner-martina-1', drawMartinaBehind(1));
      scene.textures.addCanvas('runner-martina-2', drawMartinaBehind(2));
      scene.textures.addCanvas('runner-martina-3', drawMartinaBehind(1));
      scene.anims.create({
        key: 'runner-run',
        frames: [{key:'runner-martina-0'},{key:'runner-martina-1'},{key:'runner-martina-2'},{key:'runner-martina-3'}],
        frameRate: 10, repeat: -1
      });
    }

    // === BACKGROUND — Open-Air Castle Bridge with depth ===
    if (!scene.textures.exists('runner-bg')) {
      const bg = document.createElement('canvas');
      bg.width = 800; bg.height = 450;
      const ctx = bg.getContext('2d');

      // 1. Sky Gradient (magical starry night with warm fuchsia sunset glow at the horizon)
      const sky = ctx.createLinearGradient(0, 0, 0, 220);
      sky.addColorStop(0, '#04020a'); // Space black
      sky.addColorStop(0.3, '#0f0729'); // Midnight blue
      sky.addColorStop(0.6, '#280c42'); // Indigo/Purple
      sky.addColorStop(0.85, '#581c77'); // Magenta glow
      sky.addColorStop(1, '#86198f'); // Bright fuchsia horizon
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 800, 450);

      // Radial Nebulae
      const drawNebula = (x, y, r, color1, color2) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color1);
        g.addColorStop(1, color2);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      };
      drawNebula(250, 100, 150, 'rgba(219, 39, 119, 0.15)', 'rgba(0,0,0,0)'); // Pink nebula
      drawNebula(550, 80, 180, 'rgba(79, 70, 229, 0.12)', 'rgba(0,0,0,0)');  // Blue nebula
      drawNebula(400, 150, 100, 'rgba(253, 186, 116, 0.1)', 'rgba(0,0,0,0)'); // Golden horizon bloom

      // Starry sky
      for (let i = 0; i < 60; i++) {
        const sx = Math.random() * 800;
        const sy = Math.random() * 220;
        const radius = Math.random() * 1.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        ctx.beginPath(); ctx.arc(sx, sy, radius, 0, Math.PI * 2); ctx.fill();
        
        if (i % 12 === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - 5, sy); ctx.lineTo(sx + 5, sy);
          ctx.moveTo(sx, sy - 5); ctx.lineTo(sx, sy + 5);
          ctx.stroke();
        }
      }

      // Large Glowing Moon
      const mx = 650, my = 60, mr = 32;
      const mg = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 2.5);
      mg.addColorStop(0, 'rgba(254, 240, 138, 0.2)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mx, my, mr*2.5, 0, Math.PI*2); ctx.fill();

      const mgrad = ctx.createLinearGradient(mx - mr, my - mr, mx + mr, my + mr);
      mgrad.addColorStop(0, '#fffbeb');
      mgrad.addColorStop(0.5, '#fef08a');
      mgrad.addColorStop(1, '#facc15');
      ctx.fillStyle = mgrad;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2); ctx.fill();

      // Moon textures
      ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.beginPath(); ctx.arc(mx - 8, my - 6, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(mx + 10, my + 8, 8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(mx - 12, my + 10, 4, 0, Math.PI*2); ctx.fill();

      // Distant mountain ranges for deep parallax landscape
      ctx.fillStyle = '#120724';
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(0, 130);
      ctx.quadraticCurveTo(150, 90, 300, 140);
      ctx.lineTo(400, 150);
      ctx.quadraticCurveTo(550, 100, 800, 130);
      ctx.lineTo(800, 160);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#190a33';
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(0, 145);
      ctx.lineTo(100, 130);
      ctx.lineTo(250, 155);
      ctx.lineTo(350, 140);
      ctx.lineTo(450, 150);
      ctx.lineTo(600, 125);
      ctx.lineTo(700, 145);
      ctx.lineTo(800, 140);
      ctx.lineTo(800, 160);
      ctx.closePath();
      ctx.fill();

      // 3. Majestic Castle Silhouette at the Horizon (large and high quality)
      ctx.fillStyle = '#0a0514'; // Dark shadow base
      ctx.fillRect(290, 125, 220, 35);

      const stoneGrad = ctx.createLinearGradient(290, 0, 510, 0);
      stoneGrad.addColorStop(0, '#1a0d36');
      stoneGrad.addColorStop(0.5, '#2e195e');
      stoneGrad.addColorStop(1, '#110926');
      ctx.fillStyle = stoneGrad;
      ctx.fillRect(310, 80, 30, 45);  // Left tower
      ctx.fillRect(460, 80, 30, 45);  // Right tower
      ctx.fillRect(345, 70, 110, 55); // Center keep
      ctx.fillRect(385, 45, 30, 25);  // Center spire

      const roofGrad = ctx.createLinearGradient(290, 0, 510, 0);
      roofGrad.addColorStop(0, '#c026d3');
      roofGrad.addColorStop(1, '#701a75');
      ctx.fillStyle = roofGrad;
      // Left conical roof
      ctx.beginPath();
      ctx.moveTo(307, 80); ctx.lineTo(325, 45); ctx.lineTo(343, 80); ctx.closePath(); ctx.fill();
      // Right conical roof
      ctx.beginPath();
      ctx.moveTo(457, 80); ctx.lineTo(475, 45); ctx.lineTo(493, 80); ctx.closePath(); ctx.fill();
      // Central spire roof
      ctx.beginPath();
      ctx.moveTo(380, 45); ctx.lineTo(400, 15); ctx.lineTo(420, 45); ctx.closePath(); ctx.fill();

      // Waving gold flags
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(324, 38, 1, 7);
      ctx.beginPath(); ctx.moveTo(325, 38); ctx.lineTo(332, 40); ctx.lineTo(325, 42); ctx.closePath(); ctx.fill();
      ctx.fillRect(474, 38, 1, 7);
      ctx.beginPath(); ctx.moveTo(475, 38); ctx.lineTo(482, 40); ctx.lineTo(475, 42); ctx.closePath(); ctx.fill();
      ctx.fillRect(399, 8, 1, 9);
      ctx.beginPath(); ctx.moveTo(400, 8); ctx.lineTo(409, 11); ctx.lineTo(400, 14); ctx.closePath(); ctx.fill();

      // Glowing castle windows & main gate glow
      ctx.fillStyle = '#67e8f9'; // Cyan window glows
      ctx.fillRect(320, 95, 10, 15);
      ctx.fillRect(470, 95, 10, 15);
      ctx.fillStyle = '#f472b6'; // Rose window glows
      ctx.fillRect(370, 85, 12, 18);
      ctx.fillRect(418, 85, 12, 18);

      const gateGlow = ctx.createRadialGradient(400, 160, 2, 400, 160, 30);
      gateGlow.addColorStop(0, '#fef08a');
      gateGlow.addColorStop(0.4, '#facc15');
      gateGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gateGlow;
      ctx.beginPath(); ctx.arc(400, 160, 30, Math.PI, 0); ctx.fill();

      // 4. Ground/Road Polygon (wide perspective chess bridge)
      ctx.fillStyle = '#160d2e'; // Dark road base
      ctx.beginPath();
      ctx.moveTo(350, 160);
      ctx.lineTo(450, 160);
      ctx.lineTo(750, 450);
      ctx.lineTo(50, 450);
      ctx.closePath();
      ctx.fill();

      // Road perspective lines (grid)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)'; // Soft purple grid lines
      ctx.lineWidth = 2;
      for (let i = 0; i <= 6; i++) {
        const ratio = i / 6;
        const rx_horizon = 350 + (450 - 350) * ratio;
        const rx_bottom = 50 + (750 - 50) * ratio;
        ctx.beginPath();
        ctx.moveTo(rx_horizon, 160);
        ctx.lineTo(rx_bottom, 450);
        ctx.stroke();
      }
      
      // Horizontal lines in perspective (exponential spacing)
      for (let i = 0; i <= 15; i++) {
        const ratio = Math.pow(i / 15, 2.5); // Spaced closer at horizon
        const ry = 160 + (450 - 160) * ratio;
        const w_horizon = 450 - 350;
        const w_bottom = 750 - 50;
        const w = w_horizon + (w_bottom - w_horizon) * ratio;
        const rx_left = 400 - w / 2;
        ctx.beginPath();
        ctx.moveTo(rx_left, ry);
        ctx.lineTo(rx_left + w, ry);
        ctx.stroke();
      }

      // 5. Side Parapets (Low 3D stone guardrail walls narrowing in perspective)
      // Left Parapet Wall
      const leftWallGrad = ctx.createLinearGradient(0, 360, 350, 150);
      leftWallGrad.addColorStop(0, '#1c1917');
      leftWallGrad.addColorStop(1, '#292524');
      ctx.fillStyle = leftWallGrad;
      ctx.beginPath();
      ctx.moveTo(350, 160);
      ctx.lineTo(50, 450);
      ctx.lineTo(0, 450);
      ctx.lineTo(0, 320); // Goes off-screen
      ctx.lineTo(350, 150);
      ctx.closePath();
      ctx.fill();

      // Left wall top surface (cap) to give a 3D bevel/thickness
      ctx.fillStyle = '#44403c';
      ctx.beginPath();
      ctx.moveTo(350, 150);
      ctx.lineTo(0, 320);
      ctx.lineTo(0, 310);
      ctx.lineTo(350, 148);
      ctx.closePath();
      ctx.fill();

      // Right Parapet Wall
      const rightWallGrad = ctx.createLinearGradient(800, 320, 450, 150);
      rightWallGrad.addColorStop(0, '#1c1917');
      rightWallGrad.addColorStop(1, '#292524');
      ctx.fillStyle = rightWallGrad;
      ctx.beginPath();
      ctx.moveTo(450, 160);
      ctx.lineTo(750, 450);
      ctx.lineTo(800, 450);
      ctx.lineTo(800, 320);
      ctx.lineTo(450, 150);
      ctx.closePath();
      ctx.fill();

      // Right wall top surface (cap)
      ctx.fillStyle = '#44403c';
      ctx.beginPath();
      ctx.moveTo(450, 150);
      ctx.lineTo(800, 320);
      ctx.lineTo(800, 310);
      ctx.lineTo(450, 148);
      ctx.closePath();
      ctx.fill();

      // 6. Glowing Torches in Perspective
      const drawTorch = (tx, ty, size) => {
        // Torch bracket
        ctx.fillStyle = '#451a03'; // Dark iron/wood
        ctx.fillRect(tx - 2 * size, ty, 4 * size, 14 * size);
        
        // Torch flame
        const flameGlow = ctx.createRadialGradient(tx, ty - 4 * size, 1 * size, tx, ty - 4 * size, 40 * size);
        flameGlow.addColorStop(0, 'rgba(251, 146, 60, 0.8)'); // Bright orange core
        flameGlow.addColorStop(0.3, 'rgba(239, 68, 68, 0.4)'); // Red outer flame
        flameGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = flameGlow;
        ctx.beginPath(); ctx.arc(tx, ty - 4 * size, 40 * size, 0, Math.PI * 2); ctx.fill();
        
        // Inner hot core
        ctx.fillStyle = '#fef08a'; // Bright yellow center
        ctx.beginPath(); ctx.arc(tx, ty - 4 * size, 3 * size, 0, Math.PI * 2); ctx.fill();
      };
      
      // Draw 6 torches scaling with depth
      drawTorch(120, 370, 1.0);  // Close Left
      drawTorch(680, 370, 1.0);  // Close Right
      drawTorch(230, 260, 0.65); // Mid Left
      drawTorch(570, 260, 0.65); // Mid Right
      drawTorch(310, 195, 0.4);  // Far Left
      drawTorch(490, 195, 0.4);  // Far Right

      scene.textures.addCanvas('runner-bg', bg);
    }

    // === OBSTACLE TEXTURES ===
    if (!scene.textures.exists('runner-rock')) {
      // Rock
      const rc = document.createElement('canvas');
      rc.width = 44; rc.height = 44;
      const ctx = rc.getContext('2d');
      const rg = ctx.createLinearGradient(4, 4, 40, 40);
      rg.addColorStop(0, '#6b5340'); rg.addColorStop(0.5, '#4a3728'); rg.addColorStop(1, '#2d1f14');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(8, 36);
      ctx.bezierCurveTo(2, 24, 6, 10, 16, 6);
      ctx.bezierCurveTo(26, 2, 36, 10, 38, 22);
      ctx.bezierCurveTo(40, 28, 36, 36, 30, 40);
      ctx.bezierCurveTo(22, 44, 12, 40, 8, 36);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath(); ctx.arc(18, 18, 12, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#1a0f08'; ctx.lineWidth = 2; ctx.stroke();
      scene.textures.addCanvas('runner-rock', rc);

      // Crystal
      const cc = document.createElement('canvas');
      cc.width = 44; cc.height = 44;
      const cctx = cc.getContext('2d');
      const cg = cctx.createLinearGradient(4, 4, 40, 40);
      cg.addColorStop(0, '#c084fc'); cg.addColorStop(0.5, '#7c3aed'); cg.addColorStop(1, '#3b0764');
      cctx.fillStyle = cg;
      cctx.beginPath();
      cctx.moveTo(22, 2); cctx.lineTo(36, 14);
      cctx.lineTo(42, 28); cctx.lineTo(34, 42);
      cctx.lineTo(10, 42); cctx.lineTo(2, 28);
      cctx.lineTo(8, 14); cctx.closePath();
      cctx.fill();
      cctx.strokeStyle = '#1a0030'; cctx.lineWidth = 2; cctx.stroke();
      cctx.fillStyle = 'rgba(255,255,255,0.25)';
      cctx.beginPath(); cctx.arc(22, 20, 8, 0, Math.PI*2); cctx.fill();
      // Inner glow lines
      cctx.strokeStyle = 'rgba(255,255,255,0.15)';
      cctx.lineWidth = 0.8;
      cctx.beginPath(); cctx.moveTo(22, 8); cctx.lineTo(22, 36); cctx.stroke();
      cctx.beginPath(); cctx.moveTo(10, 22); cctx.lineTo(34, 22); cctx.stroke();
      scene.textures.addCanvas('runner-crystal', cc);

      // Retro Chess Clock obstacle texture
      const cl = document.createElement('canvas');
      cl.width = 64; cl.height = 64;
      const ctx_cl = cl.getContext('2d');
      // Body (brown wood)
      ctx_cl.fillStyle = '#78350f';
      ctx_cl.fillRect(4, 16, 56, 40);
      ctx_cl.strokeStyle = '#451a03'; ctx_cl.lineWidth = 2;
      ctx_cl.strokeRect(4, 16, 56, 40);
      // Dual white dials
      ctx_cl.fillStyle = '#ffffff';
      ctx_cl.beginPath(); ctx_cl.arc(20, 36, 11, 0, Math.PI*2); ctx_cl.arc(44, 36, 11, 0, Math.PI*2); ctx_cl.fill();
      ctx_cl.strokeStyle = '#000000'; ctx_cl.lineWidth = 1.2;
      ctx_cl.beginPath(); ctx_cl.arc(20, 36, 11, 0, Math.PI*2); ctx_cl.stroke();
      ctx_cl.beginPath(); ctx_cl.arc(44, 36, 11, 0, Math.PI*2); ctx_cl.stroke();
      // Hands
      ctx_cl.beginPath(); ctx_cl.moveTo(20, 36); ctx_cl.lineTo(20, 28); ctx_cl.moveTo(20, 36); ctx_cl.lineTo(25, 36); ctx_cl.stroke();
      ctx_cl.beginPath(); ctx_cl.moveTo(44, 36); ctx_cl.lineTo(40, 32); ctx_cl.stroke();
      // Buttons
      ctx_cl.fillStyle = '#94a3b8';
      ctx_cl.fillRect(14, 8, 12, 8); // Up button
      ctx_cl.fillStyle = '#475569';
      ctx_cl.fillRect(38, 12, 12, 4); // Down button
      scene.textures.addCanvas('runner-clock', cl);

      // Majestic Gothic Chess Rook Pillar Column
      const pc = document.createElement('canvas');
      pc.width = 48; pc.height = 120;
      const pctx = pc.getContext('2d');
      
      // Column Base/Pedestal
      const baseGrad = pctx.createLinearGradient(0, 100, 48, 100);
      baseGrad.addColorStop(0, '#1e1b4b');
      baseGrad.addColorStop(0.5, '#4c1d95');
      baseGrad.addColorStop(1, '#090514');
      pctx.fillStyle = baseGrad;
      pctx.fillRect(4, 100, 40, 20); // base block
      pctx.fillRect(8, 90, 32, 10);  // base molding
      
      // Column Shaft (tapering slightly towards the top)
      const shaftGrad = pctx.createLinearGradient(0, 40, 48, 40);
      shaftGrad.addColorStop(0, '#2e1065');
      shaftGrad.addColorStop(0.5, '#6d28d9');
      shaftGrad.addColorStop(1, '#1e1b4b');
      pctx.fillStyle = shaftGrad;
      pctx.beginPath();
      pctx.moveTo(12, 30);
      pctx.lineTo(36, 30);
      pctx.lineTo(38, 90);
      pctx.lineTo(10, 90);
      pctx.closePath();
      pctx.fill();
      
      // Column Capital & Rook Top (Crenellated Battlements)
      pctx.fillStyle = baseGrad;
      pctx.fillRect(8, 15, 32, 15); // Rook platform
      // Crenellations (3 battlements)
      pctx.fillRect(8, 5, 8, 10);
      pctx.fillRect(20, 5, 8, 10);
      pctx.fillRect(32, 5, 8, 10);
      
      // Golden Bands/Details
      pctx.fillStyle = '#eab308'; // Gold accent
      pctx.fillRect(10, 30, 28, 3); // top band
      pctx.fillRect(10, 87, 28, 3); // bottom band
      
      // Glowing Fire in the Rook Top center
      const fireGlow = pctx.createRadialGradient(24, 8, 1, 24, 8, 12);
      fireGlow.addColorStop(0, '#fef08a');
      fireGlow.addColorStop(0.4, '#f97316');
      fireGlow.addColorStop(1, 'rgba(0,0,0,0)');
      pctx.fillStyle = fireGlow;
      pctx.beginPath(); pctx.arc(24, 8, 12, 0, Math.PI * 2); pctx.fill();
      
      // Highlight/Strokelines for 3D stone look
      pctx.strokeStyle = '#c084fc';
      pctx.lineWidth = 1;
      pctx.strokeRect(4, 100, 40, 20);
      pctx.strokeRect(8, 15, 32, 15);
      pctx.beginPath();
      pctx.moveTo(12, 30); pctx.lineTo(10, 90);
      pctx.moveTo(36, 30); pctx.lineTo(38, 90);
      pctx.stroke();

      scene.textures.addCanvas('runner-pillar', pc);
    }

    // === SETUP SCENE ===

    // Background
    scene.add.image(400, 225, 'runner-bg').setDepth(-10);

    // Scrolling ground tiles with perspective
    scene.runnerPathTiles = [];
    const laneX_player = [240, 400, 560];
    for (let row = 0; row < 12; row++) {
      for (let l = 0; l < 3; l++) {
        // Create a rectangle representing the road tile
        const tile = scene.add.rectangle(400, 225, 120, 30, 0xfbbf24, 0.08);
        tile.setStrokeStyle(1.5, 0xfbbf24, 0.25);
        tile.setDepth(-5);
        tile.baseY = row * (800 / 12); // space them out along the 800-unit loop
        tile.lane = l;
        scene.runnerPathTiles.push(tile);
      }
    }

    // Martina — ZOOMED IN, larger, center-bottom (placed at y = 360)
    scene.runnerPlayer = scene.physics.add.sprite(400, 360, 'runner-martina-0');
    scene.runnerPlayer.setDisplaySize(64, 84); // bigger!
    scene.runnerPlayer.body.setSize(36, 68);
    scene.runnerPlayer.body.setOffset(6, 4);
    scene.runnerPlayer.body.allowGravity = false;
    scene.runnerPlayer.play('runner-run');
    scene.runnerPlayer.invincibility = 0;
    scene.runnerPlayer.setDepth(10);

    // Dynamic shadow under player's feet
    scene.runnerPlayerShadow = scene.add.ellipse(400, 360, 48, 12, 0x000000, 0.35);
    scene.runnerPlayerShadow.setDepth(9);

    // Runner state
    scene.runnerDistance = 0;
    scene.runnerSpeed = levelDef.baseScrollSpeed || 1.8;
    scene.runnerTargetLane = 1.0;
    scene.runnerCurrentLane = 1.0;

    // Obstacles
    scene.runnerObstacles = scene.physics.add.group({allowGravity:false,immovable:true});
    levelDef.obstacles.forEach(o => {
      const tex = o.type==='crystal'?'runner-crystal':(o.type==='giant_clock'?'runner-clock':'runner-rock');
      const obs = scene.physics.add.sprite(400, 225, tex);
      obs.setDisplaySize(40, 40);
      obs.body.setSize(36, 36);
      obs.body.allowGravity = false;
      obs.body.setImmovable(true);
      obs.runnerY = o.y; obs.lane = o.lane; obs.setDepth(5);
      obs.used = false;
      obs.setVisible(false);
      obs.obstacleType = o.type; // Save type for custom behavior
      scene.runnerObstacles.add(obs);
    });

    // Coins (need physics bodies for overlap)
    scene.runnerCoins = scene.physics.add.group({allowGravity:false,immovable:true});
    levelDef.coinsData.forEach(c => {
      const coin = scene.physics.add.sprite(400, 225, 'coin_0');
      coin.play('coin-spin');
      coin.setDisplaySize(22, 22);
      coin.body.setSize(22, 22);
      coin.body.allowGravity = false;
      coin.body.setImmovable(true);
      coin.setDepth(5);
      coin.runnerY = c.y;
      coin.runnerX = c.x;
      coin.lane = (c.x < 300) ? 0 : (c.x > 500) ? 2 : 1;
      coin.collected = false;
      coin.setVisible(false);
      scene.runnerCoins.add(coin);
    });

    // Crowns (need physics bodies for overlap)
    scene.runnerCrowns = scene.physics.add.group({allowGravity:false,immovable:true});
    levelDef.crownsData.forEach(c => {
      const crown = scene.physics.add.sprite(400, 225, 'crown_gold');
      crown.setDisplaySize(26, 26);
      crown.body.setSize(26, 26);
      crown.body.allowGravity = false;
      crown.body.setImmovable(true);
      crown.setDepth(5);
      crown.runnerY = c.y;
      crown.runnerX = c.x;
      crown.lane = (c.x < 300) ? 0 : (c.x > 500) ? 2 : 1;
      crown.collected = false;
      crown.setVisible(false);
      scene.runnerCrowns.add(crown);
    });

    // Chasers (enemy shadow peoncitos — off-screen until triggered)
    scene.runnerChasers = [];
    (levelDef.chasers||[]).forEach(ch => {
      const chaser = scene.physics.add.sprite(400, 460, 'enemy');
      chaser.setDisplaySize(48, 63);
      chaser.setDepth(9);
      chaser.triggerDistance = ch.y;
      chaser.chaserSpeed = ch.speed || 2.0;
      chaser.worldY = ch.y - 300;
      chaser.active = false;
      chaser.lane = 1;
      chaser.currentLane = 1;
      chaser.body.allowGravity = false;
      chaser.setVisible(false);
      scene.runnerChasers.push(chaser);
    });

    // Bind Keyboard runner inputs (Arrows + WASD + Space/Up/W for jumping)
    scene.runnerKeys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W
    });
    scene.runnerKeys.leftWasDown = false;
    scene.runnerKeys.rightWasDown = false;
    scene.runnerJumping = false;
    scene.runnerJumpTime = 0;

    // Obstacle collision
    scene.physics.add.overlap(scene.runnerPlayer, scene.runnerObstacles, (pl, obs) => {
      if (pl.invincibility>0||obs.used) return;
      
      // If player is jumping, she leaps over the obstacle safely!
      if (scene.runnerJumping) {
        return; // Safe jump!
      }

      obs.used = true;
      self.lives--; pl.invincibility = 60;
      pl.setTint(0xff4444);
      scene.time.delayedCall(300, () => {if(pl.active)pl.clearTint();});
      self.synthesizeSound('damage');
      document.getElementById('hud-lives').textContent=`❤️ x${self.lives}`;
      scene.tweens.add({targets:obs,alpha:0,scale:0.3,duration:300,onComplete:()=>obs.destroy()});
      scene.cameras.main.shake(100, 0.005);
      if (self.lives<=0){self.stopMusic();self.gameOver();}
    });

    // Coin collection
    scene.physics.add.overlap(scene.runnerPlayer, scene.runnerCoins, (pl, coin) => {
      if (coin.collected) return;
      coin.collected = true;
      self.coins++; self.score += 100;
      self.synthesizeSound('coin');
      document.getElementById('hud-coins').textContent=`🪙 x${self.coins.toString().padStart(2,'0')}`;
      document.getElementById('hud-score').textContent=self.score.toString().padStart(5,'0');
      scene.tweens.add({targets:coin,alpha:0,scale:0.1,angle:360,duration:300,onComplete:()=>coin.destroy()});
    });

    // Crown collection
    scene.physics.add.overlap(scene.runnerPlayer, scene.runnerCrowns, (pl, crown) => {
      if (crown.collected) return;
      crown.collected = true;
      self.score += 1000;
      self.synthesizeSound('victory');
      document.getElementById('hud-score').textContent=self.score.toString().padStart(5,'0');
      for (let i=0;i<16;i++){
        const a=(i/16)*Math.PI*2;
        const sp=scene.add.circle(crown.x,crown.y,2,0xfacc15,0.8);
        scene.tweens.add({targets:sp,x:crown.x+Math.cos(a)*40,y:crown.y+Math.sin(a)*40,alpha:0,scale:0.1,duration:400,onComplete:()=>sp.destroy()});
      }
      scene.tweens.add({targets:crown,alpha:0,scale:2.5,angle:360,duration:400,onComplete:()=>crown.destroy()});
    });

    // Input
    scene.keysWASD = {
      left: scene.input.keyboard.addKey('LEFT'),
      right: scene.input.keyboard.addKey('RIGHT')
    };

    // Portal (hidden until close)
    scene.runnerPortal = scene.add.sprite(400, -60, 'portal_texture');
    scene.runnerPortal.setDisplaySize(80, 80);
    scene.runnerPortal.setDepth(4);
    scene.runnerPortal.visible = false;

    // Side Pillars (Towers on the sides of the road for deep 3D castle hallway effect)
    scene.runnerPillars = scene.add.group();
    for (let y = 0; y < 6000; y += 300) {
      // Left side pillar
      const lPillar = scene.add.sprite(400, 225, 'runner-pillar');
      lPillar.worldY = y;
      lPillar.baseX = 80;
      lPillar.setDepth(6);
      scene.runnerPillars.add(lPillar);

      // Right side pillar
      const rPillar = scene.add.sprite(400, 225, 'runner-pillar');
      rPillar.worldY = y;
      rPillar.baseX = 720;
      rPillar.setDepth(6);
      scene.runnerPillars.add(rPillar);
    }

    self.startMusic();
  }

  updateRunner(scene, levelDef) {
    const self = this;
    const laneX_player = [240, 400, 560];
    const horizonY = 160;
    const playerY = 360;
    const roadBottomY = 450;
    const maxD = 900;

    // Auto-scroll — speed increases slightly as we progress
    scene.runnerSpeed = levelDef.baseScrollSpeed + (scene.runnerDistance / levelDef.runDistance) * 0.6;
    scene.runnerDistance += scene.runnerSpeed;

    // HUD progress percentage
    const pct = Math.min(100, Math.round((scene.runnerDistance / levelDef.runDistance) * 100));
    document.getElementById('hud-score').textContent = `${pct}%`.padStart(5, ' ');

    // Scroll ground tiles with perspective!
    scene.runnerPathTiles.forEach(tile => {
      // The tile's world Y position wraps around in an 800 unit loop
      const worldY = (tile.baseY - scene.runnerDistance) % 800;
      const dy = (worldY + 800) % 800; // Map to positive range [0, 800]
      
      const z = dy / 800;
      const p = Math.pow(1 - z, 2); // 1 at player, 0 at horizon
      
      tile.y = horizonY + (roadBottomY - horizonY) * p;
      tile.x = 400 + (laneX_player[tile.lane] - 400) * p;
      tile.setScale(p * 1.5, p * 0.8);
      tile.setAlpha(p * 0.5);
    });

    // Move side pillars with perspective
    scene.runnerPillars.getChildren().forEach(pillar => {
      const dy = pillar.worldY - scene.runnerDistance;
      
      // Wrap around or hide if out of bounds
      if (dy < -150) {
        pillar.worldY += 6000; // loop back to the end of Stage 5 length
        return;
      }
      
      const onScreen = dy >= 0 && dy <= maxD;
      pillar.setVisible(onScreen);
      
      if (onScreen) {
        const z = dy / maxD;
        const p = Math.pow(1 - z, 2.5);
        pillar.x = 400 + (pillar.baseX - 400) * p;
        pillar.y = horizonY + (roadBottomY - horizonY) * p;
        pillar.setScale(p * 2.5); // Starts tiny and gets huge!
        pillar.setAlpha(p * 0.85);
        pillar.setDepth(6);
      }
    });

    // Player lane switching (discrete lane changes on key press)
    const leftDown = (scene.runnerKeys.left.isDown || scene.runnerKeys.a.isDown || self.touchInputs.left);
    const rightDown = (scene.runnerKeys.right.isDown || scene.runnerKeys.d.isDown || self.touchInputs.right);

    if (leftDown && !scene.runnerKeys.leftWasDown) {
      scene.runnerTargetLane = Math.max(0, scene.runnerTargetLane - 1);
    }
    if (rightDown && !scene.runnerKeys.rightWasDown) {
      scene.runnerTargetLane = Math.min(2, scene.runnerTargetLane + 1);
    }
    scene.runnerKeys.leftWasDown = leftDown;
    scene.runnerKeys.rightWasDown = rightDown;

    scene.runnerCurrentLane += (scene.runnerTargetLane - scene.runnerCurrentLane) * 0.15;
    
    // Project Martina's X target (player is at playerY = 360, p = 1)
    scene.runnerPlayer.x += (laneX_player[Math.round(scene.runnerCurrentLane)] - scene.runnerPlayer.x) * 0.25;

    // Player jump mechanic!
    const jumpPressed = (scene.runnerKeys.up.isDown || scene.runnerKeys.w.isDown || scene.runnerKeys.space.isDown || self.touchInputs.jump);
    if (jumpPressed && !scene.runnerJumping) {
      scene.runnerJumping = true;
      scene.runnerJumpTime = 70; // 70 frames (~1.16s) for longer/higher float
      self.synthesizeSound('jump');
    }

    let jumpYOffset = 0;
    if (scene.runnerJumping) {
      scene.runnerJumpTime--;
      const progress = (70 - scene.runnerJumpTime) / 70;
      jumpYOffset = Math.sin(progress * Math.PI) * 180; // Peak height of 180px
      
      // Stop running animation and freeze frame on jump
      scene.runnerPlayer.stop();
      scene.runnerPlayer.setTexture('runner-martina-0');
      
      if (scene.runnerJumpTime <= 0) {
        scene.runnerJumping = false;
        scene.runnerPlayer.play('runner-run');
      }
    }
    scene.runnerPlayer.y = playerY - jumpYOffset;

    // Update dynamic player shadow
    if (scene.runnerPlayerShadow) {
      scene.runnerPlayerShadow.x = scene.runnerPlayer.x;
      const shadowScale = 1 - (jumpYOffset / 180) * 0.5;
      scene.runnerPlayerShadow.setScale(shadowScale);
      scene.runnerPlayerShadow.setAlpha(0.35 * shadowScale);
    }

    // Invincibility flash timer
    if (scene.runnerPlayer.invincibility > 0) {
      scene.runnerPlayer.invincibility--;
      scene.runnerPlayer.setAlpha(Math.sin(scene.runnerPlayer.invincibility * 0.4) > 0 ? 0.4 : 1.0);
    } else {
      scene.runnerPlayer.setAlpha(1.0);
    }

    // Move obstacles — project and scale them
    scene.runnerObstacles.getChildren().forEach(obs => {
      if (obs.used) return;
      const dy = obs.runnerY - scene.runnerDistance;

      // Crucial fix: as soon as the obstacle passes the player (dy < 0), disable its physics body
      // to prevent phantom/invisible collisions when landing.
      if (dy < 0) {
        obs.used = true;
        obs.setVisible(false);
        obs.body.reset(-999, -999);
        return;
      }

      const onScreen = dy >= 0 && dy <= maxD;
      obs.setVisible(onScreen);

      if (onScreen) {
        const z = dy / maxD;
        const p = Math.pow(1 - z, 2.5);
        
        obs.x = 400 + (laneX_player[obs.lane] - 400) * p;
        obs.y = horizonY + (playerY - horizonY) * p;
        obs.setDepth(8 - Math.round(z * 4));

        // Custom behavior for the giant retro chess clock obstacle!
        if (obs.obstacleType === 'giant_clock') {
          obs.setScale(p * 3.5); // Much bigger!
          obs.body.reset(obs.x, obs.y);
          obs.body.setSize(55, 45); // Larger physics footprint

          // Trigger E = mc2 shout and camera shake when close
          if (!obs.shouted && dy < 450) {
            obs.shouted = true;
            self.synthesizeSound('damage'); // Warning alert sound
            
            // Comic/dream shout bubble
            const shoutText = scene.add.text(obs.x, obs.y - 70, '¡E = mc²!', {
              fontFamily: "'Outfit',sans-serif", fontSize: '24px', fontStyle: 'bold',
              fill: '#ef4444', stroke: '#ffffff', strokeThickness: 5
            }).setOrigin(0.5).setDepth(15);
            
            scene.tweens.add({
              targets: shoutText,
              y: shoutText.y - 60,
              alpha: 0,
              duration: 1500,
              onComplete: () => shoutText.destroy()
            });

            // Minor rumble of the screen as the giant clock rolls down
            scene.cameras.main.shake(200, 0.003);
          }
        } else {
          obs.setScale(p * 1.5);
          obs.body.reset(obs.x, obs.y);
        }
      }
    });

    // Move coins — project and scale them
    scene.runnerCoins.getChildren().forEach(coin => {
      if (coin.collected) return;
      const dy = coin.runnerY - scene.runnerDistance;

      if (dy < 0) {
        coin.collected = true;
        coin.setVisible(false);
        coin.body.reset(-999, -999);
        return;
      }

      const onScreen = dy >= 0 && dy <= maxD;
      coin.setVisible(onScreen);

      if (onScreen) {
        const z = dy / maxD;
        const p = Math.pow(1 - z, 2.5);
        
        coin.x = 400 + (laneX_player[coin.lane] - 400) * p;
        coin.y = horizonY + (playerY - horizonY) * p;
        coin.setScale(p * 1.2);
        coin.setDepth(8 - Math.round(z * 4));
        coin.body.reset(coin.x, coin.y);
      }
    });

    // Move crowns
    scene.runnerCrowns.getChildren().forEach(crown => {
      if (crown.collected) return;
      const dy = crown.runnerY - scene.runnerDistance;

      if (dy < 0) {
        crown.collected = true;
        crown.setVisible(false);
        crown.body.reset(-999, -999);
        return;
      }

      const onScreen = dy >= 0 && dy <= maxD;
      crown.setVisible(onScreen);

      if (onScreen) {
        const z = dy / maxD;
        const p = Math.pow(1 - z, 2.5);
        
        crown.x = 400 + (laneX_player[crown.lane] - 400) * p;
        crown.y = horizonY + (playerY - horizonY) * p;
        crown.setScale(p * 1.3);
        crown.setDepth(8 - Math.round(z * 4));
        crown.body.reset(crown.x, crown.y);
      }
    });

    // Update chasers (shadow pawns)
    scene.runnerChasers.forEach(chaser => {
      if (!chaser.active && scene.runnerDistance >= chaser.triggerDistance) {
        chaser.active = true;
        chaser.worldY = scene.runnerDistance - 300; // Place 300 units behind player
        chaser.currentLane = scene.runnerCurrentLane;
      }

      if (chaser.active) {
        chaser.worldY += scene.runnerSpeed * chaser.chaserSpeed;
        const dy = chaser.worldY - scene.runnerDistance; // Negative (behind)

        if (dy >= 0) {
          // Passed player
          const laneDiff = Math.abs(chaser.currentLane - scene.runnerCurrentLane);
          if (laneDiff < 0.6 && scene.runnerPlayer.invincibility === 0) {
            self.lives--;
            scene.runnerPlayer.invincibility = 90;
            scene.runnerPlayer.setTint(0xff4444);
            scene.time.delayedCall(300, () => { if (scene.runnerPlayer.active) scene.runnerPlayer.clearTint(); });
            self.synthesizeSound('damage');
            document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
            if (self.lives <= 0) { self.stopMusic(); self.gameOver(); return; }
          }
          if (dy > 100) {
            chaser.active = false;
            chaser.setVisible(false);
          }
        }

        if (chaser.active) {
          chaser.setVisible(true);

          if (dy < 0) {
            // Behind player
            const z = -dy / 300; // 1 to 0
            const p = 1.0 - Math.min(1.0, z); // 0 to 1
            const screenY = playerY + (roadBottomY - playerY) * (1.0 - p);
            
            // Follow player lane
            chaser.currentLane += (scene.runnerCurrentLane - chaser.currentLane) * 0.05;
            
            const scale = 1.0 + (1.0 - p) * 0.8;
            const screenX = 400 + (laneX_player[Math.round(chaser.currentLane)] - 400) * scale;

            chaser.x = screenX;
            chaser.y = screenY;
            chaser.setScale(scale);
            chaser.setDepth(11);
          } else {
            // Ahead of player
            const z = dy / maxD;
            const p = Math.pow(1 - z, 2.5);
            const screenY = horizonY + (playerY - horizonY) * p;
            const screenX = 400 + (laneX_player[Math.round(chaser.currentLane)] - 400) * p;

            chaser.x = screenX;
            chaser.y = screenY;
            chaser.setScale(p);
            chaser.setDepth(8);
          }

          chaser.body.reset(chaser.x, chaser.y);
        }
      }
    });

    // Goal detection and victory screen
    if (scene.runnerDistance >= levelDef.runDistance) {
      if (!scene.runnerFinished) {
        scene.runnerFinished = true;
        self.completeLevel();
        const vt = scene.add.text(400, 200, '¡CORONACIÓN!\nPeoncito ha llegado', {
          fontFamily: "'Outfit',sans-serif", fontSize: '26px', fontStyle: 'bold',
          fill: '#fbbf24', stroke: '#0d0620', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(20);

        for (let i = 0; i < 35; i++) {
          scene.time.delayedCall(i * 40, () => {
            if (!scene.runnerPlayer.active) return;
            const a = i * 0.3, r = 25 - i * 0.2;
            scene.add.circle(scene.runnerPlayer.x + Math.cos(a) * Math.max(3, r),
              scene.runnerPlayer.y + Math.sin(a) * Math.max(3, r), Math.random() * 2 + 1.5, 0xfbbf24, 0.9)
              .setDepth(20);
          });
        }

        scene.tweens.add({
          targets: scene.runnerPlayer, angle: 720, scaleX: 0.05, scaleY: 0.05, alpha: 0,
          duration: 2000, ease: 'Quad.easeOut',
          onComplete: () => { vt.destroy(); self.showVictoryScreen(true); }
        });
      }
      return;
    }

    // Portal approaching
    if (scene.runnerDistance > levelDef.runDistance - 900) {
      scene.runnerPortal.setVisible(true);
      const dy = levelDef.runDistance - scene.runnerDistance;
      const z = Math.max(0, dy) / 900;
      const p = Math.pow(1 - z, 2.5);
      
      scene.runnerPortal.y = horizonY + (playerY - horizonY) * p;
      scene.runnerPortal.x = 400;
      scene.runnerPortal.setScale(p * 2.0);
    }
  }

  // --- INITIALIZE PHASER GAME ENGINE ---
  initPhaserEngine() {
    const parentEl = document.getElementById('phaser-game-parent');
    if (!parentEl) return;

    const self = this;
    
    // Get current level definition from data module
    const levelDef = (window.MartinaLevels && window.MartinaLevels.levels[self.currentLevelIndex]) || null;
    if (!levelDef) {
      console.error('No level definition found for index', self.currentLevelIndex);
      return;
    }
    
    const biome = levelDef.biome;
    const platformsData = levelDef.platformsData;
    const coinsData = levelDef.coinsData;
    const enemiesData = levelDef.enemiesData;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 450,
      parent: 'phaser-game-parent',
      backgroundColor: levelDef.backgroundColor,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 700 },
          debug: false
        }
      },
      scene: {
        key: 'game',
        preload: function() {
          const scene = this;
          scene.load.crossOrigin = undefined;
        },
        create: function() {
          const scene = this;
          
          // Runner game mode — completely different setup
          if (levelDef.gameMode === 'runner') {
            self.setupRunner(scene, levelDef);
            return;
          }
          
          // Generate a smooth particle sparkle texture — dual color variant for variety
          const sparkleCanvas = document.createElement('canvas');
          sparkleCanvas.width = 16;
          sparkleCanvas.height = 16;
          const sctx = sparkleCanvas.getContext('2d');
          // 4-pointed star sparkle
          const sgrad = sctx.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad.addColorStop(0, 'rgba(255, 255, 220, 1)');
          sgrad.addColorStop(0.4, 'rgba(255, 223, 0, 0.9)');
          sgrad.addColorStop(1, 'rgba(255, 180, 0, 0)');
          sctx.fillStyle = sgrad;
          sctx.beginPath();
          sctx.moveTo(8, 0); sctx.lineTo(10, 6); sctx.lineTo(16, 8);
          sctx.lineTo(10, 10); sctx.lineTo(8, 16);
          sctx.lineTo(6, 10); sctx.lineTo(0, 8);
          sctx.lineTo(6, 6); sctx.closePath();
          sctx.fill();
          // Central bright core
          sctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          sctx.beginPath();
          sctx.arc(8, 8, 2.5, 0, Math.PI*2);
          sctx.fill();
          scene.textures.addCanvas('sparkle', sparkleCanvas);
          
          // Cyan variant sparkle
          const sparkleCyan = document.createElement('canvas');
          sparkleCyan.width = 16;
          sparkleCyan.height = 16;
          const sctx2 = sparkleCyan.getContext('2d');
          const sgrad2 = sctx2.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad2.addColorStop(0, 'rgba(220, 255, 255, 1)');
          sgrad2.addColorStop(0.4, 'rgba(34, 211, 238, 0.9)');
          sgrad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
          sctx2.fillStyle = sgrad2;
          sctx2.beginPath();
          sctx2.moveTo(8, 0); sctx2.lineTo(10, 6); sctx2.lineTo(16, 8);
          sctx2.lineTo(10, 10); sctx2.lineTo(8, 16);
          sctx2.lineTo(6, 10); sctx2.lineTo(0, 8);
          sctx2.lineTo(6, 6); sctx2.closePath();
          sctx2.fill();
          sctx2.fillStyle = 'rgba(255, 255, 255, 0.7)';
          sctx2.beginPath();
          sctx2.arc(8, 8, 2.2, 0, Math.PI*2);
          sctx2.fill();
          scene.textures.addCanvas('sparkle_cyan', sparkleCyan);
          
          // Purple variant sparkle
          const sparklePurple = document.createElement('canvas');
          sparklePurple.width = 16;
          sparklePurple.height = 16;
          const sctx3 = sparklePurple.getContext('2d');
          const sgrad3 = sctx3.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad3.addColorStop(0, 'rgba(240, 220, 255, 1)');
          sgrad3.addColorStop(0.4, 'rgba(167, 139, 250, 0.9)');
          sgrad3.addColorStop(1, 'rgba(139, 92, 246, 0)');
          sctx3.fillStyle = sgrad3;
          sctx3.beginPath();
          sctx3.moveTo(8, 0); sctx3.lineTo(10, 6); sctx3.lineTo(16, 8);
          sctx3.lineTo(10, 10); sctx3.lineTo(8, 16);
          sctx3.lineTo(6, 10); sctx3.lineTo(0, 8);
          sctx3.lineTo(6, 6); sctx3.closePath();
          sctx3.fill();
          sctx3.fillStyle = 'rgba(255, 255, 255, 0.7)';
          sctx3.beginPath();
          sctx3.arc(8, 8, 2.2, 0, Math.PI*2);
          sctx3.fill();
          scene.textures.addCanvas('sparkle_purple', sparklePurple);
          
          if (!scene.textures.exists('player')) {
            // 1. Martina Canvas (size 32x48)
            const pCanvas = document.createElement('canvas');
            pCanvas.width = 32;
            pCanvas.height = 48;
            const pCtx = pCanvas.getContext('2d');
            
            // Hair back (behind the face)
             const drawMartinaFrame = (frameType) => {
               const pCanvas = document.createElement('canvas');
               pCanvas.width = 32;
               pCanvas.height = 48;
               const pCtx = pCanvas.getContext('2d');
               const isDiving = (biome === 'river');
               
               // Hair back (behind the face)
               pCtx.fillStyle = '#3f1d0b'; // Dark brown
               pCtx.beginPath();
               pCtx.arc(16, 17, 9, Math.PI, 0); // top half
               pCtx.rect(7, 17, 18, 13); // back locks
               pCtx.fill();

               // Oxygen tank on back (if diving, drawn behind body but in front of back hair)
               if (isDiving) {
                 pCtx.fillStyle = '#94a3b8'; // Slate gray tank
                 pCtx.fillRect(4, 21, 5, 14);
                 pCtx.fillStyle = '#64748b'; // tank top
                 pCtx.fillRect(4, 18, 4, 3);
                 pCtx.fillStyle = '#eab308'; // strap details
                 pCtx.fillRect(5, 23, 3, 1.5);
                 pCtx.fillRect(5, 29, 3, 1.5);
               }
               
               // Head (skin tone)
               pCtx.fillStyle = '#fed7aa'; // Soft peach skin
               pCtx.beginPath();
               pCtx.arc(16, 16, 7, 0, Math.PI * 2);
               pCtx.fill();
               
               // Hair bangs (front)
               pCtx.fillStyle = '#3f1d0b';
               pCtx.beginPath();
               pCtx.arc(16, 13, 7, Math.PI * 1.1, Math.PI * 1.9);
               pCtx.fill();
               
               if (isDiving) {
                 // Draw mask skirt (translucent cyan)
                 pCtx.fillStyle = 'rgba(34, 211, 238, 0.45)';
                 pCtx.beginPath();
                 pCtx.ellipse(16, 16, 8, 4, 0, 0, Math.PI * 2);
                 pCtx.fill();

                 // Mask frame (cyan-blue)
                 pCtx.strokeStyle = '#0891b2';
                 pCtx.lineWidth = 1.2;
                 pCtx.beginPath();
                 pCtx.ellipse(16, 16, 8, 4, 0, 0, Math.PI * 2);
                 pCtx.stroke();

                 // Eyes behind mask
                 pCtx.fillStyle = '#1e293b';
                 pCtx.beginPath();
                 pCtx.arc(12.5, 16, 0.8, 0, Math.PI * 2);
                 pCtx.arc(19.5, 16, 0.8, 0, Math.PI * 2);
                 pCtx.fill();

                 // Glare reflections on glass
                 pCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                 pCtx.beginPath();
                 pCtx.arc(13.5, 15.2, 0.6, 0, Math.PI * 2);
                 pCtx.arc(18.5, 15.2, 0.4, 0, Math.PI * 2);
                 pCtx.fill();

                 // Snorkel tube (orange, right side)
                 pCtx.strokeStyle = '#ea580c';
                 pCtx.lineWidth = 1.8;
                 pCtx.beginPath();
                 pCtx.moveTo(19, 18);
                 pCtx.quadraticCurveTo(24, 20, 25, 14);
                 pCtx.lineTo(25, 6);
                 pCtx.stroke();
                 pCtx.fillStyle = '#ea580c';
                 pCtx.fillRect(24, 5, 2, 2);
               } else {
                 // Glasses (Black frames, signature Martina - rounder and thinner to avoid mask effect!)
                 pCtx.lineWidth = 0.6; // Extra thin frame
                 pCtx.strokeStyle = '#1e293b'; // Dark slate frame
                 
                 // Draw small cute eyes behind the glass lenses first!
                 pCtx.fillStyle = '#1e293b';
                 pCtx.beginPath();
                 pCtx.arc(12.5, 16, 0.75, 0, Math.PI * 2);
                 pCtx.arc(19.5, 16, 0.75, 0, Math.PI * 2);
                 pCtx.fill();
                 
                 // Left eye lens (round)
                 pCtx.beginPath();
                 pCtx.arc(12.5, 16, 2.2, 0, Math.PI * 2);
                 pCtx.stroke();
                 // Right eye lens (round)
                 pCtx.beginPath();
                 pCtx.arc(19.5, 16, 2.2, 0, Math.PI * 2);
                 pCtx.stroke();
                 // Bridge (curve bridge)
                 pCtx.beginPath();
                 pCtx.moveTo(14.7, 16);
                 pCtx.quadraticCurveTo(16, 15.2, 17.3, 16);
                 pCtx.stroke();
                 // Temple arms (thin frames going to the sides)
                 pCtx.beginPath();
                 pCtx.moveTo(10.3, 16);
                 pCtx.lineTo(8.5, 16);
                 pCtx.moveTo(21.7, 16);
                 pCtx.lineTo(23.5, 16);
                 pCtx.stroke();
                 // Glare lens reflections (small cute white sparkles)
                 pCtx.fillStyle = '#ffffff';
                 pCtx.beginPath();
                 pCtx.arc(13.3, 15.2, 0.5, 0, Math.PI*2);
                 pCtx.arc(20.3, 15.2, 0.5, 0, Math.PI*2);
                 pCtx.fill();
               }
               
               if (isDiving) {
                 // Sleek wetsuit (dark navy blue with neon green lines)
                 pCtx.fillStyle = '#0f172a';
                 pCtx.beginPath();
                 pCtx.moveTo(12, 23);
                 pCtx.lineTo(20, 23);
                 pCtx.lineTo(22, 33);
                 pCtx.lineTo(10, 33);
                 pCtx.closePath();
                 pCtx.fill();

                 pCtx.strokeStyle = '#22c55e'; // neon green details
                 pCtx.lineWidth = 1;
                 pCtx.beginPath();
                 pCtx.moveTo(14, 23); pCtx.lineTo(13, 33);
                 pCtx.moveTo(18, 23); pCtx.lineTo(19, 33);
                 pCtx.stroke();

                 // Yellow belt
                 pCtx.fillStyle = '#eab308';
                 pCtx.fillRect(10, 33, 12, 1.5);
               } else {
                 // White Polo Shirt (Body)
                 pCtx.fillStyle = '#ffffff';
                 pCtx.beginPath();
                 pCtx.moveTo(12, 23);
                 pCtx.lineTo(20, 23);
                 pCtx.lineTo(22, 33);
                 pCtx.lineTo(10, 33);
                 pCtx.closePath();
                 pCtx.fill();
                 
                 // Red emblem on chest
                 pCtx.fillStyle = '#ef4444';
                 pCtx.fillRect(15, 26, 2, 2);
                 
                 // Blue Voley Shorts
                 pCtx.fillStyle = '#1d4ed8'; // Royal blue
                 pCtx.fillRect(10, 33, 12, 5);
               }
               
               // Draw Arms
               if (isDiving) {
                 pCtx.fillStyle = '#0f172a'; // long wetsuit sleeves
                 pCtx.fillRect(8, 23, 2, 5);
                 pCtx.fillRect(22, 23, 2, 5);
                 pCtx.fillStyle = '#06b6d4'; // cyan gloves
                 pCtx.beginPath();
                 pCtx.arc(9, 29, 2, 0, Math.PI*2);
                 pCtx.arc(23, 29, 2, 0, Math.PI*2);
                 pCtx.fill();
               } else {
                 pCtx.fillStyle = '#ffffff'; // Sleeves
                 pCtx.fillRect(8, 23, 2, 4);
                 pCtx.fillRect(22, 23, 2, 4);
                 pCtx.fillStyle = '#fed7aa'; // Hands
                 pCtx.beginPath();
                 pCtx.arc(9, 28, 2, 0, Math.PI*2);
                 pCtx.arc(23, 28, 2, 0, Math.PI*2);
                 pCtx.fill();
               }
               
               // --- ANCHOR DYNAMIC LEGS DRAWING BASED ON FRAMES ---
               if (isDiving) {
                 pCtx.fillStyle = '#0f172a'; // wetsuit legs
                 pCtx.fillRect(12, 38, 3, 5);
                 pCtx.fillRect(17, 38, 3, 5);

                 // Flippers / Fins (Vivid yellow/orange)
                 pCtx.fillStyle = '#eab308';
                 pCtx.beginPath();
                 if (frameType === 'idle') {
                   pCtx.moveTo(12, 42); pCtx.lineTo(6, 47); pCtx.lineTo(15, 47);
                   pCtx.moveTo(19, 42); pCtx.lineTo(16, 47); pCtx.lineTo(25, 47);
                 } else if (frameType === 'run1') {
                   // flutter 1
                   pCtx.moveTo(10, 42); pCtx.lineTo(4, 47); pCtx.lineTo(13, 47);
                   pCtx.moveTo(20, 42); pCtx.lineTo(15, 47); pCtx.lineTo(24, 47);
                 } else if (frameType === 'run2') {
                   // flutter 2 (neutral overlap)
                   pCtx.moveTo(13, 42); pCtx.lineTo(7, 47); pCtx.lineTo(16, 47);
                   pCtx.moveTo(16, 42); pCtx.lineTo(13, 47); pCtx.lineTo(22, 47);
                 } else if (frameType === 'run3') {
                   // flutter 3
                   pCtx.moveTo(20, 42); pCtx.lineTo(15, 47); pCtx.lineTo(24, 47);
                   pCtx.moveTo(10, 42); pCtx.lineTo(4, 47); pCtx.lineTo(13, 47);
                 } else if (frameType === 'jump') {
                   pCtx.moveTo(11, 40); pCtx.lineTo(5, 46); pCtx.lineTo(14, 46);
                   pCtx.moveTo(18, 40); pCtx.lineTo(14, 46); pCtx.lineTo(23, 46);
                 }
                 pCtx.closePath();
                 pCtx.fill();
               } else {
                 pCtx.fillStyle = '#fed7aa'; // Skin tone legs
                 if (frameType === 'idle') {
                   pCtx.fillRect(12, 38, 3, 6);
                   pCtx.fillRect(17, 38, 3, 6);
                   pCtx.fillStyle = '#ffffff'; // Socks
                   pCtx.fillRect(12, 42, 3, 2);
                   pCtx.fillRect(17, 42, 3, 2);
                   pCtx.fillStyle = '#dc2626'; // Sneakers
                   pCtx.fillRect(11, 44, 4, 3);
                   pCtx.fillRect(17, 44, 4, 3);
                   pCtx.fillStyle = '#000000'; // Sole
                   pCtx.fillRect(10, 47, 5, 1);
                   pCtx.fillRect(16, 47, 5, 1);
                 } else if (frameType === 'run1') {
                   pCtx.fillRect(10, 38, 3, 6);
                   pCtx.fillRect(19, 38, 3, 6);
                   pCtx.fillStyle = '#ffffff'; // Socks
                   pCtx.fillRect(10, 42, 3, 2);
                   pCtx.fillRect(19, 42, 3, 2);
                   pCtx.fillStyle = '#dc2626'; // Sneakers
                   pCtx.fillRect(9, 44, 4, 3);
                   pCtx.fillRect(19, 44, 4, 3);
                   pCtx.fillStyle = '#000000'; // Sole
                   pCtx.fillRect(8, 47, 5, 1);
                   pCtx.fillRect(18, 47, 5, 1);
                 } else if (frameType === 'run2') {
                   pCtx.fillRect(13, 38, 3, 6);
                   pCtx.fillRect(16, 38, 3, 6);
                   pCtx.fillStyle = '#ffffff'; // Socks
                   pCtx.fillRect(13, 42, 3, 2);
                   pCtx.fillRect(16, 42, 3, 2);
                   pCtx.fillStyle = '#dc2626'; // Sneakers
                   pCtx.fillRect(12, 44, 4, 3);
                   pCtx.fillRect(16, 44, 4, 3);
                   pCtx.fillStyle = '#000000'; // Sole
                   pCtx.fillRect(11, 47, 5, 1);
                   pCtx.fillRect(15, 47, 5, 1);
                 } else if (frameType === 'run3') {
                   pCtx.fillRect(19, 38, 3, 6);
                   pCtx.fillRect(10, 38, 3, 6);
                   pCtx.fillStyle = '#ffffff'; // Socks
                   pCtx.fillRect(19, 42, 3, 2);
                   pCtx.fillRect(10, 42, 3, 2);
                   pCtx.fillStyle = '#dc2626'; // Sneakers
                   pCtx.fillRect(19, 44, 4, 3);
                   pCtx.fillRect(9, 44, 4, 3);
                   pCtx.fillStyle = '#000000'; // Sole
                   pCtx.fillRect(18, 47, 5, 1);
                   pCtx.fillRect(8, 47, 5, 1);
                 } else if (frameType === 'jump') {
                   pCtx.fillRect(11, 38, 3, 4);
                   pCtx.fillRect(18, 38, 3, 4);
                   pCtx.fillStyle = '#ffffff'; // Socks
                   pCtx.fillRect(11, 40, 3, 2);
                   pCtx.fillRect(18, 40, 3, 2);
                   pCtx.fillStyle = '#dc2626'; // Sneakers
                   pCtx.fillRect(10, 42, 4, 3);
                   pCtx.fillRect(18, 42, 4, 3);
                   pCtx.fillStyle = '#000000'; // Sole
                   pCtx.fillRect(9, 45, 5, 1);
                   pCtx.fillRect(17, 45, 5, 1);
                 }
               }
               
               return pCanvas;
             };

            
            // Register 5 individual frame textures
            scene.textures.addCanvas('player-idle', drawMartinaFrame('idle'));
            scene.textures.addCanvas('player-run-1', drawMartinaFrame('run1'));
            scene.textures.addCanvas('player-run-2', drawMartinaFrame('run2'));
            scene.textures.addCanvas('player-run-3', drawMartinaFrame('run3'));
            scene.textures.addCanvas('player-jump', drawMartinaFrame('jump'));
            
            // Map the base 'player' texture key to the idle frame for seamless compatibility!
            scene.textures.addCanvas('player', drawMartinaFrame('idle'));

            // 2. Shadow Peoncito Canvas (size 32x42) - Kingdom of Shadows!
            const eCanvas = document.createElement('canvas');
            eCanvas.width = 32;
            eCanvas.height = 42;
            const eCtx = eCanvas.getContext('2d');
            
            // Draw obsidian / deep purple shiny crystal body (Gradient)
            const enemyBodyGrad = eCtx.createLinearGradient(8, 20, 24, 38);
            enemyBodyGrad.addColorStop(0, '#c084fc'); // Glowing purple core
            enemyBodyGrad.addColorStop(0.5, '#6b21a8'); // Shadow purple
            enemyBodyGrad.addColorStop(1, '#1e1b4b'); // Deep obsidian indigo-black
            eCtx.fillStyle = enemyBodyGrad;
            
            eCtx.beginPath();
            eCtx.moveTo(12, 19);
            eCtx.lineTo(20, 19);
            eCtx.quadraticCurveTo(23, 29, 24, 38);
            eCtx.lineTo(8, 38);
            eCtx.quadraticCurveTo(9, 29, 12, 19);
            eCtx.closePath();
            eCtx.fill();
            
            // Base plate (Dark obsidian gold-trimmed)
            eCtx.fillStyle = '#1e1b4b';
            eCtx.fillRect(6, 38, 20, 3);
            eCtx.fillStyle = '#a855f7'; // purple shine line
            eCtx.fillRect(6, 38, 20, 1);
            
            // Head ring
            eCtx.fillStyle = '#581c87';
            eCtx.beginPath();
            eCtx.ellipse(16, 19, 5, 1.5, 0, 0, Math.PI*2);
            eCtx.fill();
            
            // Pawn Head (Obsidian Crystal Sphere with Glowing center)
            const enemyHeadGrad = eCtx.createRadialGradient(14, 11, 1, 16, 12, 8);
            enemyHeadGrad.addColorStop(0, '#f3e8ff'); // Light core glow
            enemyHeadGrad.addColorStop(0.3, '#d8b4fe'); // Soft purple shine
            enemyHeadGrad.addColorStop(0.8, '#6b21a8'); // Body shadow purple
            enemyHeadGrad.addColorStop(1, '#1e1b4b'); // Deep obsidian black
            eCtx.fillStyle = enemyHeadGrad;
            eCtx.beginPath();
            eCtx.arc(16, 12, 7.5, 0, Math.PI * 2);
            eCtx.fill();
            
            // Mischievous glowing red eyes
            // Eye sockets red glow
            eCtx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            eCtx.beginPath();
            eCtx.arc(13, 11, 2.8, 0, Math.PI*2);
            eCtx.arc(19, 11, 2.8, 0, Math.PI*2);
            eCtx.fill();
            
            // Red eyes
            eCtx.fillStyle = '#ef4444';
            eCtx.beginPath();
            eCtx.arc(13, 11, 1.5, 0, Math.PI*2);
            eCtx.arc(19, 11, 1.5, 0, Math.PI*2);
            eCtx.fill();
            
            // Small sharp pupil (obsidian black)
            eCtx.fillStyle = '#000000';
            eCtx.beginPath();
            eCtx.arc(13, 11, 0.6, 0, Math.PI*2);
            eCtx.arc(19, 11, 0.6, 0, Math.PI*2);
            eCtx.fill();
            
            // THE BIGOTE (Curly dark charcoal mustache, Peoncito's signature!)
            eCtx.fillStyle = '#1e293b'; // Slate dark charcoal mustache
            eCtx.beginPath();
            // Left curl
            eCtx.moveTo(16, 15);
            eCtx.bezierCurveTo(12, 14, 7, 16, 5, 19);
            eCtx.bezierCurveTo(6, 22, 11, 19, 16, 16.5);
            // Right curl
            eCtx.moveTo(16, 15);
            eCtx.bezierCurveTo(20, 14, 25, 16, 27, 19);
            eCtx.bezierCurveTo(26, 22, 21, 19, 16, 16.5);
            eCtx.closePath();
            eCtx.fill();
            // Center mustache dot
            eCtx.beginPath();
            eCtx.arc(16, 15.5, 1, 0, Math.PI*2);
            eCtx.fill();
            
            scene.textures.addCanvas('enemy', eCanvas);

            // 3. Castle Canvas (size 120x160)
            const cCanvas = document.createElement('canvas');
            cCanvas.width = 120;
            cCanvas.height = 160;
            const cCtx = cCanvas.getContext('2d');
            
            // Gold gradient
            const castGrad = cCtx.createLinearGradient(20, 20, 100, 160);
            castGrad.addColorStop(0, '#fbbf24'); // Yellow Amber
            castGrad.addColorStop(0.5, '#f59e0b'); // Warm Gold
            castGrad.addColorStop(1, '#b45309'); // Warm bronze gold
            
            cCtx.fillStyle = castGrad;
            cCtx.beginPath();
            cCtx.moveTo(30, 40);
            cCtx.lineTo(90, 40);
            cCtx.lineTo(98, 150);
            cCtx.lineTo(22, 150);
            cCtx.closePath();
            cCtx.fill();
            
            // Base pedestal
            cCtx.fillStyle = '#78350f';
            cCtx.fillRect(14, 150, 92, 10);
            cCtx.fillStyle = '#fbbf24';
            cCtx.fillRect(14, 150, 92, 2);
            
            // Ramparts
            cCtx.fillStyle = castGrad;
            cCtx.fillRect(26, 20, 14, 20);
            cCtx.fillRect(53, 20, 14, 20);
            cCtx.fillRect(80, 20, 14, 20);
            cCtx.fillRect(26, 35, 68, 8);
            
            // Door
            cCtx.fillStyle = '#1e3a8a';
            cCtx.beginPath();
            cCtx.moveTo(48, 150);
            cCtx.lineTo(48, 110);
            cCtx.arc(60, 110, 12, Math.PI, 0);
            cCtx.lineTo(72, 150);
            cCtx.closePath();
            cCtx.fill();
            
            // Golden door frame
            cCtx.strokeStyle = '#facc15';
            cCtx.lineWidth = 3;
            cCtx.stroke();
            
            // Windows
            cCtx.fillStyle = '#1e3a8a';
            cCtx.fillRect(44, 60, 8, 14);
            cCtx.fillRect(68, 60, 8, 14);
            
            // Flagpole and white flag
            cCtx.fillStyle = '#d1d5db';
            cCtx.fillRect(59, 0, 3, 20);
            cCtx.fillStyle = '#ffffff';
            cCtx.beginPath();
            cCtx.moveTo(62, 2);
            cCtx.lineTo(82, 8);
            cCtx.lineTo(62, 14);
            cCtx.closePath();
            cCtx.fill();
            cCtx.fillStyle = '#fbbf24'; // crown symbol
            cCtx.beginPath();
            cCtx.arc(68, 8, 2, 0, Math.PI*2);
            cCtx.fill();
            
            scene.textures.addCanvas('castle', cCanvas);

            // 3.5. Highly Refined Majestic White Queen Canvas (size 64x128)
            const qCanvas = document.createElement('canvas');
            qCanvas.width = 64;
            qCanvas.height = 128;
            const qCtx = qCanvas.getContext('2d');
            
            // Royal Purple & Indigo Cloak behind the Queen (adds depth and royal stature!)
            const cloakGrad = qCtx.createLinearGradient(0, 32, 64, 116);
            cloakGrad.addColorStop(0, '#8b5cf6'); // Royal violet
            cloakGrad.addColorStop(0.5, '#6d28d9'); // Solid violet
            cloakGrad.addColorStop(1, '#3b0764'); // Deep purple shadow
            qCtx.fillStyle = cloakGrad;
            qCtx.beginPath();
            qCtx.moveTo(32, 34); // starts under the head
            qCtx.bezierCurveTo(10, 30, 2, 70, 4, 116); // left flare
            qCtx.lineTo(60, 116); // bottom edge
            qCtx.bezierCurveTo(62, 70, 54, 30, 32, 34); // right flare
            qCtx.closePath();
            qCtx.fill();
            
            // Golden embroidery on cloak edges
            qCtx.strokeStyle = '#fbbf24';
            qCtx.lineWidth = 1.8;
            qCtx.beginPath();
            qCtx.moveTo(32, 34);
            qCtx.bezierCurveTo(10, 30, 2, 70, 4, 116);
            qCtx.moveTo(32, 34);
            qCtx.bezierCurveTo(62, 70, 54, 30, 32, 34);
            qCtx.stroke();
            
            // High Imperial Collar framing the head
            qCtx.fillStyle = '#a78bfa'; // Lilac velvet collar
            qCtx.beginPath();
            qCtx.moveTo(22, 34);
            qCtx.quadraticCurveTo(14, 14, 24, 12);
            qCtx.lineTo(40, 12);
            qCtx.quadraticCurveTo(50, 14, 42, 34);
            qCtx.closePath();
            qCtx.fill();
            
            // Gold trim on collar
            qCtx.strokeStyle = '#fbbf24';
            qCtx.lineWidth = 1;
            qCtx.stroke();
            
            // Shaded silver base plate of the chess piece
            const baseGrad = qCtx.createLinearGradient(8, 108, 56, 128);
            baseGrad.addColorStop(0, '#ffffff');
            baseGrad.addColorStop(0.5, '#cbd5e1'); // silver shading
            baseGrad.addColorStop(1, '#64748b');
            qCtx.fillStyle = baseGrad;
            qCtx.fillRect(8, 116, 48, 12);
            qCtx.fillStyle = '#fbbf24'; // rich gold trim on base
            qCtx.fillRect(8, 112, 48, 4);
            
            // Torso and gown (glowing white crystal with royal gold borders)
            const queenBodyGrad = qCtx.createLinearGradient(16, 42, 48, 112);
            queenBodyGrad.addColorStop(0, '#ffffff'); // Glare top
            queenBodyGrad.addColorStop(0.4, '#f8fafc'); // Soft white
            queenBodyGrad.addColorStop(0.8, '#e2e8f0'); // Silver-grey folds
            queenBodyGrad.addColorStop(1, '#cbd5e1'); // Bottom shadow
            qCtx.fillStyle = queenBodyGrad;
            qCtx.beginPath();
            qCtx.moveTo(16, 112);
            qCtx.quadraticCurveTo(18, 58, 24, 42); // left curve
            qCtx.lineTo(40, 42);
            qCtx.quadraticCurveTo(46, 58, 48, 112); // right curve
            qCtx.closePath();
            qCtx.fill();
            
            // Gold corset / bodice trim
            qCtx.fillStyle = '#fbbf24';
            qCtx.beginPath();
            qCtx.moveTo(24, 42);
            qCtx.lineTo(40, 42);
            qCtx.lineTo(36, 52);
            qCtx.lineTo(28, 52);
            qCtx.closePath();
            qCtx.fill();
            
            // Elegant red ruby jewel on center bodice
            qCtx.fillStyle = '#ef4444';
            qCtx.beginPath();
            qCtx.arc(32, 47, 2, 0, Math.PI*2);
            qCtx.fill();
            
            // Draw elegant vertical folds on the gown
            qCtx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
            qCtx.lineWidth = 1.5;
            for (let offset = -8; offset <= 8; offset += 4) {
              qCtx.beginPath();
              qCtx.moveTo(32 + offset * 0.4, 54);
              qCtx.lineTo(32 + offset * 1.5, 112);
              qCtx.stroke();
            }
            
            // Gold lace hem at the bottom of gown
            qCtx.fillStyle = '#fbbf24';
            qCtx.fillRect(16, 110, 32, 2);
            
            // Golden hair flowing on the sides
            qCtx.fillStyle = '#fbbf24'; // Rich gold hair
            qCtx.beginPath();
            qCtx.arc(23, 27, 4, 0, Math.PI*2); // Left hair lock
            qCtx.arc(41, 27, 4, 0, Math.PI*2); // Right hair lock
            qCtx.rect(19, 27, 4, 15);
            qCtx.rect(41, 27, 4, 15);
            qCtx.fill();
            
            // Queen's head (spherical skin gradient)
            const queenHeadGrad = qCtx.createRadialGradient(30, 24, 1, 32, 26, 8);
            queenHeadGrad.addColorStop(0, '#ffffff'); // Highlight
            queenHeadGrad.addColorStop(0.6, '#fed7aa'); // Soft peach skin
            queenHeadGrad.addColorStop(1, '#fdba74'); // Warm shadow
            qCtx.fillStyle = queenHeadGrad;
            qCtx.beginPath();
            qCtx.arc(32, 26, 8, 0, Math.PI * 2);
            qCtx.fill();
            
            // Gentle closed eyes (smiling face)
            qCtx.strokeStyle = '#7c2d12'; // Warm dark outline
            qCtx.lineWidth = 1;
            qCtx.beginPath();
            qCtx.arc(29, 25, 1.5, Math.PI, 0); // left closed eye
            qCtx.moveTo(36.5, 25);
            qCtx.arc(35, 25, 1.5, Math.PI, 0); // right closed eye
            qCtx.stroke();
            
            // Sweet rosy cheeks
            qCtx.fillStyle = 'rgba(244, 63, 94, 0.4)'; // translucent rose
            qCtx.beginPath();
            qCtx.arc(27, 28, 1.5, 0, Math.PI*2);
            qCtx.arc(37, 28, 1.5, 0, Math.PI*2);
            qCtx.fill();
            
            // Exquisite crown with 5 sharp golden points and rubies
            qCtx.fillStyle = '#fbbf24';
            qCtx.beginPath();
            qCtx.moveTo(21, 21);
            qCtx.lineTo(23, 8); // Point 1
            qCtx.lineTo(27, 15);
            qCtx.lineTo(32, 3);  // Tall center point
            qCtx.lineTo(37, 15);
            qCtx.lineTo(41, 8); // Point 3
            qCtx.lineTo(43, 21);
            qCtx.closePath();
            qCtx.fill();
            
            // Red gems on crown points
            qCtx.fillStyle = '#ef4444';
            qCtx.beginPath();
            qCtx.arc(23, 8, 1.5, 0, Math.PI*2);
            qCtx.arc(32, 3, 2.0, 0, Math.PI*2);
            qCtx.arc(41, 8, 1.5, 0, Math.PI*2);
            qCtx.fill();
            
            // Crown top cross ornament
            qCtx.fillStyle = '#fbbf24';
            qCtx.fillRect(31, -2, 2, 4);
            qCtx.fillRect(30, -1, 4, 2);
            
            scene.textures.addCanvas('white_queen', qCanvas);

            // 3.6. Translucent Crystal Peoncito Goal Canvas (size 32x42)
            const fCanvas = document.createElement('canvas');
            fCanvas.width = 32;
            fCanvas.height = 42;
            const fCtx = fCanvas.getContext('2d');
            
            // Translucent crystal body (cyan-white turquoise gradient)
            const fBodyGrad = fCtx.createLinearGradient(8, 20, 24, 38);
            fBodyGrad.addColorStop(0, '#e0f2fe'); // crystal white-blue
            fBodyGrad.addColorStop(0.5, '#38bdf8'); // Sky blue crystal
            fBodyGrad.addColorStop(1, '#0284c7'); // Deep cyan crystal
            fCtx.fillStyle = fBodyGrad;
            
            fCtx.beginPath();
            fCtx.moveTo(12, 19);
            fCtx.lineTo(20, 19);
            fCtx.quadraticCurveTo(23, 29, 24, 38);
            fCtx.lineTo(8, 38);
            fCtx.quadraticCurveTo(9, 29, 12, 19);
            fCtx.closePath();
            fCtx.fill();
            
            // Crystal base plate
            fCtx.fillStyle = '#0ea5e9';
            fCtx.fillRect(6, 38, 20, 3);
            fCtx.fillStyle = '#bae6fd';
            fCtx.fillRect(6, 38, 20, 1);
            
            // Head ring
            fCtx.fillStyle = '#0284c7';
            fCtx.beginPath();
            fCtx.ellipse(16, 19, 5, 1.5, 0, 0, Math.PI*2);
            fCtx.fill();
            
            // Crystal sphere head (High definition radial shine)
            const fHeadGrad = fCtx.createRadialGradient(14, 11, 1, 16, 12, 8);
            fHeadGrad.addColorStop(0, '#ffffff'); // Glare spot
            fHeadGrad.addColorStop(0.4, '#bae6fd'); // Light blue
            fHeadGrad.addColorStop(0.8, '#0ea5e9'); // Cyan crystal
            fHeadGrad.addColorStop(1, '#0369a1'); // Border dark cyan
            fCtx.fillStyle = fHeadGrad;
            fCtx.beginPath();
            fCtx.arc(16, 12, 7.5, 0, Math.PI * 2);
            fCtx.fill();
            
            // Big cute anime-style eyes
            fCtx.fillStyle = '#ffffff';
            fCtx.beginPath();
            fCtx.arc(12.5, 11, 2.2, 0, Math.PI*2);
            fCtx.arc(19.5, 11, 2.2, 0, Math.PI*2);
            fCtx.fill();
            
            // Slate blue pupils
            fCtx.fillStyle = '#0f172a';
            fCtx.beginPath();
            fCtx.arc(12.5, 11, 1.2, 0, Math.PI*2);
            fCtx.arc(19.5, 11, 1.2, 0, Math.PI*2);
            fCtx.fill();
            
            // Cute double lens reflections (gleams of friendship)
            fCtx.fillStyle = '#ffffff';
            fCtx.beginPath();
            fCtx.arc(11.8, 10.2, 0.6, 0, Math.PI*2);
            fCtx.arc(18.8, 10.2, 0.6, 0, Math.PI*2);
            fCtx.arc(13.2, 11.8, 0.3, 0, Math.PI*2);
            fCtx.arc(20.2, 11.8, 0.3, 0, Math.PI*2);
            fCtx.fill();
            
            // Friendly wide smile
            fCtx.strokeStyle = '#0f172a';
            fCtx.lineWidth = 1;
            fCtx.beginPath();
            fCtx.arc(16, 14, 1.5, 0, Math.PI); // cute curved smile!
            fCtx.stroke();
            
            // Rosy cheeks
            fCtx.fillStyle = 'rgba(244, 63, 94, 0.5)';
            fCtx.beginPath();
            fCtx.arc(9.5, 13, 1, 0, Math.PI*2);
            fCtx.arc(22.5, 13, 1, 0, Math.PI*2);
            fCtx.fill();
            
            // Peoncito's big false mustache! (torcido/crooked for comic relief!)
            fCtx.fillStyle = '#1e293b'; // slate dark mustache
            fCtx.beginPath();
            // Left lobe (slightly higher at angle!)
            fCtx.moveTo(16, 16.5);
            fCtx.bezierCurveTo(12, 15, 6, 16.5, 4, 19.5);
            fCtx.bezierCurveTo(5.5, 22.5, 11, 20.5, 16, 18);
            // Right lobe (slightly lower)
            fCtx.moveTo(16, 16.5);
            fCtx.bezierCurveTo(20, 16, 25, 18.5, 27, 21.5);
            fCtx.bezierCurveTo(26, 24.5, 21, 21.5, 16, 18);
            fCtx.closePath();
            fCtx.fill();
            
            // Mustache center nose pin dot
            fCtx.fillStyle = '#1e293b';
            fCtx.beginPath();
            fCtx.arc(16, 17.2, 1, 0, Math.PI*2);
            fCtx.fill();
            
            scene.textures.addCanvas('peoncito_friendly', fCanvas);

            const drawBishopFrame = (wingState) => {
              const aCanvas = document.createElement('canvas');
              aCanvas.width = 32;
              aCanvas.height = 48;
              const aCtx = aCanvas.getContext('2d');
              
              // Shaded dark purple Bishop body
              const bGrad = aCtx.createLinearGradient(8, 20, 24, 44);
              bGrad.addColorStop(0, '#a855f7'); // Purple
              bGrad.addColorStop(0.5, '#7e22ce');
              bGrad.addColorStop(1, '#4c1d95'); // Deep purple
              aCtx.fillStyle = bGrad;
              
              aCtx.beginPath();
              aCtx.moveTo(12, 16);
              aCtx.lineTo(20, 16);
              aCtx.quadraticCurveTo(24, 28, 24, 42);
              aCtx.lineTo(8, 42);
              aCtx.quadraticCurveTo(8, 28, 12, 16);
              aCtx.closePath();
              aCtx.fill();
              
              // Bishop mitre head
              const bHeadGrad = aCtx.createRadialGradient(14, 10, 1, 16, 12, 6);
              bHeadGrad.addColorStop(0, '#c084fc');
              bHeadGrad.addColorStop(0.8, '#7e22ce');
              bHeadGrad.addColorStop(1, '#4c1d95');
              aCtx.fillStyle = bHeadGrad;
              aCtx.beginPath();
              aCtx.arc(16, 12, 6, 0, Math.PI*2);
              aCtx.fill();
              
              // Mitre slice slot (the bishop cut!)
              aCtx.strokeStyle = '#2e1065';
              aCtx.lineWidth = 1.2;
              aCtx.beginPath();
              aCtx.moveTo(16, 6);
              aCtx.lineTo(16, 18);
              aCtx.moveTo(13, 9);
              aCtx.lineTo(19, 15);
              aCtx.stroke();
              
              // Little cross/ball on top of mitre
              aCtx.fillStyle = '#fbbf24'; // Golden ball
              aCtx.beginPath();
              aCtx.arc(16, 5, 2, 0, Math.PI*2);
              aCtx.fill();
              
              // Glowing energy wings! (flapping positions)
              aCtx.fillStyle = 'rgba(192, 132, 252, 0.7)'; // Translucent glowing lilac
              
              aCtx.beginPath();
              aCtx.moveTo(8, 24);
              if (wingState === 'up') {
                aCtx.quadraticCurveTo(1, 8, 0, 14); // Wing pointed UP
                aCtx.quadraticCurveTo(3, 26, 8, 26);
              } else {
                aCtx.quadraticCurveTo(1, 28, 0, 32); // Wing pointed DOWN
                aCtx.quadraticCurveTo(3, 26, 8, 26);
              }
              aCtx.closePath();
              aCtx.fill();
              
              aCtx.beginPath();
              aCtx.moveTo(24, 24);
              if (wingState === 'up') {
                aCtx.quadraticCurveTo(31, 8, 32, 14); // Wing pointed UP
                aCtx.quadraticCurveTo(29, 26, 24, 26);
              } else {
                aCtx.quadraticCurveTo(31, 28, 32, 32); // Wing pointed DOWN
                aCtx.quadraticCurveTo(29, 26, 24, 26);
              }
              aCtx.closePath();
              aCtx.fill();
              
              return aCanvas;
            };
            
            scene.textures.addCanvas('flying_bishop_0', drawBishopFrame('up'));
            scene.textures.addCanvas('flying_bishop_1', drawBishopFrame('down'));
            scene.textures.addCanvas('flying_bishop', drawBishopFrame('up'));

            // 3.8. Portal Vórtice Canvas (size 160x160) - Spinning Vortex of 64 Squares!
            const poCanvas = document.createElement('canvas');
            poCanvas.width = 160;
            poCanvas.height = 160;
            const poCtx = poCanvas.getContext('2d');
            
            // Base radial black-blue indigo void
            const poGrad = poCtx.createRadialGradient(80, 80, 5, 80, 80, 80);
            poGrad.addColorStop(0, '#090514');
            poGrad.addColorStop(0.6, '#1e1b4b');
            poGrad.addColorStop(0.9, '#312e81');
            poGrad.addColorStop(1, '#4338ca');
            poCtx.fillStyle = poGrad;
            poCtx.beginPath();
            poCtx.arc(80, 80, 80, 0, Math.PI*2);
            poCtx.fill();
            
            // Draw swirling grid / chessboard spiral pattern
            poCtx.strokeStyle = 'rgba(34, 211, 238, 0.45)'; // glowing cyan
            poCtx.lineWidth = 1.5;
            for (let i = 0; i < 24; i++) {
              const angle = (i * 15) * Math.PI / 180;
              poCtx.beginPath();
              poCtx.moveTo(80, 80);
              // Spiral path outward
              for (let r = 0; r <= 80; r += 4) {
                const spiralAngle = angle + (r * 0.025);
                poCtx.lineTo(80 + Math.cos(spiralAngle) * r, 80 + Math.sin(spiralAngle) * r);
              }
              poCtx.stroke();
            }
            
            // Draw swirling chess square indicators
            poCtx.fillStyle = 'rgba(250, 204, 21, 0.15)'; // faint gold
            for (let i = 0; i < 8; i++) {
              const angle = (i * 45) * Math.PI / 180;
              poCtx.beginPath();
              poCtx.moveTo(80, 80);
              const spiralAngle1 = angle + (30 * 0.025);
              const spiralAngle2 = angle + 15 * Math.PI/180 + (50 * 0.025);
              poCtx.lineTo(80 + Math.cos(spiralAngle1) * 30, 80 + Math.sin(spiralAngle1) * 30);
              poCtx.lineTo(80 + Math.cos(spiralAngle2) * 50, 80 + Math.sin(spiralAngle2) * 50);
              poCtx.arc(80, 80, 50, spiralAngle2, spiralAngle1, true);
              poCtx.closePath();
              poCtx.fill();
            }
            
            // Golden outer ring with elegant tick marks (like a magic clockwork chess board)
            poCtx.strokeStyle = '#fbbf24';
            poCtx.lineWidth = 3.5;
            poCtx.beginPath();
            poCtx.arc(80, 80, 77, 0, Math.PI*2);
            poCtx.stroke();
            
            poCtx.strokeStyle = '#22d3ee'; // cyan inner highlight ring
            poCtx.lineWidth = 1.2;
            poCtx.beginPath();
            poCtx.arc(80, 80, 73, 0, Math.PI*2);
            poCtx.stroke();
            
            scene.textures.addCanvas('portal_texture', poCanvas);

            // 4. Background Sky Canvas — biome-specific (size 800x450)
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = 800;
            bgCanvas.height = 450;
            const bgCtx = bgCanvas.getContext('2d');
            
            if (biome === 'clockwork') {
              // --- CLOCKWORK BACKGROUND: Dark mechanical, gears, clock faces ---
              const cwGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              cwGrad.addColorStop(0, '#0a0810');
              cwGrad.addColorStop(0.3, '#14101e');
              cwGrad.addColorStop(0.6, '#1a1425');
              cwGrad.addColorStop(0.85, '#241f2e');
              cwGrad.addColorStop(1, '#1a1020');
              bgCtx.fillStyle = cwGrad;
              bgCtx.fillRect(0, 0, 800, 450);
              
              const ambGlow = bgCtx.createRadialGradient(400, 40, 10, 400, 220, 420);
              ambGlow.addColorStop(0, 'rgba(200,170,120,0.07)');
              ambGlow.addColorStop(1, 'transparent');
              bgCtx.fillStyle = ambGlow;
              bgCtx.fillRect(0, 0, 800, 450);
              
              const drawBgGear = (cx, cy, outerR, innerR, teeth, alpha) => {
                bgCtx.save();
                bgCtx.globalAlpha = alpha;
                bgCtx.strokeStyle = '#c9a84c';
                bgCtx.lineWidth = 1.5;
                bgCtx.beginPath(); bgCtx.arc(cx, cy, outerR, 0, Math.PI*2); bgCtx.stroke();
                bgCtx.beginPath(); bgCtx.arc(cx, cy, innerR, 0, Math.PI*2); bgCtx.stroke();
                for (let t = 0; t < teeth; t++) {
                  const a = (t/teeth)*Math.PI*2;
                  bgCtx.beginPath();
                  bgCtx.moveTo(cx+Math.cos(a)*innerR, cy+Math.sin(a)*innerR);
                  bgCtx.lineTo(cx+Math.cos(a)*outerR, cy+Math.sin(a)*outerR);
                  bgCtx.stroke();
                }
                bgCtx.fillStyle = '#c9a84c';
                bgCtx.beginPath(); bgCtx.arc(cx, cy, 4, 0, Math.PI*2); bgCtx.fill();
                bgCtx.restore();
              };
              drawBgGear(150, 120, 85, 55, 12, 0.08);
              drawBgGear(550, 90, 110, 70, 16, 0.06);
              drawBgGear(380, 200, 75, 45, 10, 0.07);
              drawBgGear(700, 160, 95, 60, 14, 0.05);
              drawBgGear(250, 280, 65, 40, 8, 0.06);
              
              const drawBgClock = (cx, cy, r, alpha) => {
                bgCtx.save();
                bgCtx.globalAlpha = alpha;
                bgCtx.strokeStyle = '#b8963c';
                bgCtx.lineWidth = 2;
                bgCtx.beginPath(); bgCtx.arc(cx, cy, r, 0, Math.PI*2); bgCtx.stroke();
                bgCtx.lineWidth = 0.8;
                bgCtx.beginPath(); bgCtx.arc(cx, cy, r-4, 0, Math.PI*2); bgCtx.stroke();
                for (let i=0; i<12; i++) {
                  const a = (i/12)*Math.PI*2 - Math.PI/2;
                  const inner = i%3===0 ? r-10 : r-6;
                  bgCtx.beginPath();
                  bgCtx.moveTo(cx+Math.cos(a)*inner, cy+Math.sin(a)*inner);
                  bgCtx.lineTo(cx+Math.cos(a)*(r-2), cy+Math.sin(a)*(r-2));
                  bgCtx.stroke();
                }
                bgCtx.strokeStyle = '#c9a84c';
                bgCtx.lineWidth = 2;
                bgCtx.beginPath(); bgCtx.moveTo(cx, cy); bgCtx.lineTo(cx, cy-r*0.55); bgCtx.stroke();
                bgCtx.lineWidth = 1.2;
                bgCtx.beginPath(); bgCtx.moveTo(cx, cy); bgCtx.lineTo(cx+r*0.35, cy); bgCtx.stroke();
                bgCtx.fillStyle = '#e2c868';
                bgCtx.beginPath(); bgCtx.arc(cx, cy, 2.5, 0, Math.PI*2); bgCtx.fill();
                bgCtx.restore();
              };
              drawBgClock(650, 60, 35, 0.1);
              drawBgClock(120, 180, 28, 0.08);
              drawBgClock(500, 260, 32, 0.07);
              
              bgCtx.strokeStyle = 'rgba(180,150,120,0.04)';
              bgCtx.lineWidth = 0.5;
              for (let i=0; i<14; i++) {
                const y = 260 + Math.pow(i/14, 2)*190;
                bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(800, y); bgCtx.stroke();
              }
              for (let a=-6; a<=6; a++) {
                bgCtx.beginPath();
                bgCtx.moveTo(400, 260); bgCtx.lineTo(400+a*100, 450); bgCtx.stroke();
              }
              
            } else if (biome === 'neon') {
              // --- NEON BACKGROUND ---
              const nGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              nGrad.addColorStop(0, '#050010'); nGrad.addColorStop(0.4, '#0a0020');
              nGrad.addColorStop(0.7, '#120835'); nGrad.addColorStop(1, '#0a0025');
              bgCtx.fillStyle = nGrad; bgCtx.fillRect(0, 0, 800, 450);
              bgCtx.strokeStyle = 'rgba(139,92,246,0.06)'; bgCtx.lineWidth = 0.5;
              for (let i=0;i<20;i++) {
                bgCtx.beginPath();bgCtx.moveTo(i*40,0);bgCtx.lineTo(i*40,450);bgCtx.stroke();
                bgCtx.beginPath();bgCtx.moveTo(0,i*22.5);bgCtx.lineTo(800,i*22.5);bgCtx.stroke();
              }
              const rad=Math.PI/4;
              const diag=(x,y,a,l,c,al)=>{bgCtx.save();bgCtx.globalAlpha=al;bgCtx.strokeStyle=c;bgCtx.lineWidth=2.5;bgCtx.shadowColor=c;bgCtx.shadowBlur=15;bgCtx.beginPath();bgCtx.moveTo(x,y);bgCtx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);bgCtx.stroke();bgCtx.shadowBlur=0;bgCtx.restore();};
              diag(50,60,rad,350,'#7c3aed',0.15);diag(400,30,rad,380,'#8b5cf6',0.12);
              diag(150,200,rad,400,'#6d28d9',0.10);diag(500,150,-rad,350,'#a855f7',0.10);
              diag(250,320,rad,300,'#7c3aed',0.08);diag(600,280,-rad,320,'#8b5cf6',0.09);
              const frz=(px,py,tp)=>{bgCtx.fillStyle='rgba(139,92,246,0.08)';bgCtx.strokeStyle='rgba(167,139,250,0.15)';bgCtx.lineWidth=1;if(tp==='pawn'){bgCtx.beginPath();bgCtx.arc(px,py-6,5,0,Math.PI*2);bgCtx.fill();bgCtx.stroke();bgCtx.beginPath();bgCtx.moveTo(px-4,py-1);bgCtx.lineTo(px+4,py-1);bgCtx.lineTo(px+5,py+12);bgCtx.lineTo(px-5,py+12);bgCtx.closePath();bgCtx.fill();bgCtx.stroke();}else{bgCtx.beginPath();bgCtx.arc(px,py-8,5,0,Math.PI*2);bgCtx.fill();bgCtx.stroke();bgCtx.beginPath();bgCtx.moveTo(px-4,py-3);bgCtx.lineTo(px+4,py-3);bgCtx.lineTo(px+5,py+14);bgCtx.lineTo(px-5,py+14);bgCtx.closePath();bgCtx.fill();bgCtx.stroke();bgCtx.beginPath();bgCtx.moveTo(px,py-13);bgCtx.lineTo(px,py-3);bgCtx.stroke();}};
              frz(180,150,'pawn');frz(350,100,'bishop');frz(550,180,'pawn');frz(700,130,'bishop');
              for(let i=0;i<12;i++){const nx=Math.random()*800,ny=Math.random()*400;const ng=bgCtx.createRadialGradient(nx,ny,0,nx,ny,20);ng.addColorStop(0,'rgba(168,85,247,0.06)');ng.addColorStop(1,'transparent');bgCtx.fillStyle=ng;bgCtx.beginPath();bgCtx.arc(nx,ny,20,0,Math.PI*2);bgCtx.fill();}
              
            } else if (biome === 'prairie') {
              // --- PRAIRIE BACKGROUND: Blue sky, green hills, sun, clouds, wooden fences ---
              const pGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              pGrad.addColorStop(0, '#4a90d9');
              pGrad.addColorStop(0.35, '#87CEEB');
              pGrad.addColorStop(0.55, '#b0d4f1');
              pGrad.addColorStop(1, '#c8e6c9');
              bgCtx.fillStyle = pGrad;
              bgCtx.fillRect(0, 0, 800, 450);
              
              // Sun
              const sunGrad = bgCtx.createRadialGradient(650, 70, 10, 650, 70, 90);
              sunGrad.addColorStop(0, 'rgba(255,255,200,0.9)');
              sunGrad.addColorStop(0.3, 'rgba(255,240,180,0.5)');
              sunGrad.addColorStop(0.7, 'rgba(255,220,150,0.1)');
              sunGrad.addColorStop(1, 'rgba(255,200,100,0)');
              bgCtx.fillStyle = sunGrad;
              bgCtx.beginPath(); bgCtx.arc(650, 70, 90, 0, Math.PI*2); bgCtx.fill();
              bgCtx.fillStyle = '#fffde7';
              bgCtx.beginPath(); bgCtx.arc(650, 70, 28, 0, Math.PI*2); bgCtx.fill();
              
              // Clouds
              const drawCloud = (x, y, s) => {
                bgCtx.fillStyle = 'rgba(255,255,255,0.7)';
                bgCtx.beginPath(); bgCtx.arc(x, y, s*12, 0, Math.PI*2); bgCtx.fill();
                bgCtx.beginPath(); bgCtx.arc(x+s*14, y-s*3, s*10, 0, Math.PI*2); bgCtx.fill();
                bgCtx.beginPath(); bgCtx.arc(x+s*25, y, s*13, 0, Math.PI*2); bgCtx.fill();
                bgCtx.beginPath(); bgCtx.arc(x-s*10, y+s*2, s*8, 0, Math.PI*2); bgCtx.fill();
              };
              drawCloud(100, 60, 1.2);
              drawCloud(350, 40, 1.0);
              drawCloud(500, 90, 0.8);
              
              // Rolling green hills
              bgCtx.fillStyle = '#5a8f3c';
              bgCtx.beginPath(); bgCtx.moveTo(0, 450);
              bgCtx.bezierCurveTo(100, 300, 250, 320, 400, 340);
              bgCtx.bezierCurveTo(550, 360, 650, 310, 800, 280);
              bgCtx.lineTo(800, 450); bgCtx.closePath(); bgCtx.fill();
              bgCtx.fillStyle = '#4a7c2e';
              bgCtx.beginPath(); bgCtx.moveTo(0, 450);
              bgCtx.bezierCurveTo(200, 350, 400, 370, 600, 360);
              bgCtx.bezierCurveTo(700, 355, 750, 340, 800, 330);
              bgCtx.lineTo(800, 450); bgCtx.closePath(); bgCtx.fill();
              
              // Fence posts
              bgCtx.fillStyle = '#6B4226';
              for (let fx=20; fx<780; fx+=50) {
                bgCtx.fillRect(fx, 325, 4, 30);
                bgCtx.fillRect(fx-3, 328, 10, 3);
              }
              
              // Grass tufts
              bgCtx.strokeStyle = '#3d6b24';
              bgCtx.lineWidth = 1.2;
              for (let gx=10; gx<790; gx+=15) {
                const gh = 330 + Math.sin(gx*0.1)*5;
                bgCtx.beginPath();
                bgCtx.moveTo(gx, gh); bgCtx.lineTo(gx-2, gh-6);
                bgCtx.moveTo(gx, gh); bgCtx.lineTo(gx+3, gh-8);
                bgCtx.stroke();
              }
              
            } else if (biome === 'dragon') {
              // --- DRAGON BACKGROUND: Vibrant volcanic cavern, Sicilian Dragon ---
              const dGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              dGrad.addColorStop(0, '#020608');
              dGrad.addColorStop(0.2, '#051010');
              dGrad.addColorStop(0.5, '#0a2018');
              dGrad.addColorStop(0.75, '#0d2d18');
              dGrad.addColorStop(1, '#0a2812');
              bgCtx.fillStyle = dGrad;
              bgCtx.fillRect(0, 0, 800, 450);
              // Bright green magma pool glow
              const magmaGlow = bgCtx.createRadialGradient(400, 400, 30, 400, 420, 380);
              magmaGlow.addColorStop(0, 'rgba(74,222,128,0.25)');
              magmaGlow.addColorStop(0.3, 'rgba(34,197,94,0.15)');
              magmaGlow.addColorStop(0.6, 'rgba(22,163,74,0.06)');
              magmaGlow.addColorStop(1, 'transparent');
              bgCtx.fillStyle = magmaGlow;
              bgCtx.fillRect(0, 0, 800, 450);
              // Hot core glow
              const mgCore = bgCtx.createRadialGradient(400, 430, 5, 400, 420, 150);
              mgCore.addColorStop(0, 'rgba(134,239,172,0.3)');
              mgCore.addColorStop(0.4, 'rgba(74,222,128,0.12)');
              mgCore.addColorStop(1, 'transparent');
              bgCtx.fillStyle = mgCore;
              bgCtx.fillRect(0, 0, 800, 450);
              // Cave stalactites with glow
              bgCtx.fillStyle = '#060a0a';
              for (let i=0;i<30;i++){
                const sx=i*28+Math.random()*15, sh=18+Math.random()*50;
                bgCtx.beginPath();bgCtx.moveTo(sx-3,0);bgCtx.lineTo(sx+5,sh);bgCtx.lineTo(sx+13,0);bgCtx.closePath();bgCtx.fill();
              }
              // Emerald light reflection on ceiling
              bgCtx.fillStyle = 'rgba(74,222,128,0.04)';
              bgCtx.fillRect(0, 0, 800, 60);
              // Distant dragon silhouette — larger, more detailed
              bgCtx.fillStyle = 'rgba(4,15,10,0.55)';
              // Body
              bgCtx.beginPath();
              bgCtx.moveTo(30, 340);
              bgCtx.bezierCurveTo(80, 220, 200, 170, 380, 185);
              bgCtx.bezierCurveTo(500, 195, 650, 160, 720, 190);
              bgCtx.bezierCurveTo(760, 210, 780, 250, 760, 310);
              bgCtx.lineTo(30, 340);
              bgCtx.closePath();
              bgCtx.fill();
              // Wings spread
              bgCtx.fillStyle = 'rgba(4,12,8,0.35)';
              bgCtx.beginPath();
              bgCtx.moveTo(300, 195);
              bgCtx.bezierCurveTo(320, 130, 400, 80, 480, 100);
              bgCtx.bezierCurveTo(450, 130, 400, 160, 380, 195);
              bgCtx.closePath();
              bgCtx.fill();
              bgCtx.beginPath();
              bgCtx.moveTo(400, 190);
              bgCtx.bezierCurveTo(430, 120, 520, 70, 600, 95);
              bgCtx.bezierCurveTo(560, 130, 500, 165, 470, 190);
              bgCtx.closePath();
              bgCtx.fill();
              // Dragon eye — bright golden
              const eyeGlow = bgCtx.createRadialGradient(710, 218, 1, 710, 218, 10);
              eyeGlow.addColorStop(0, 'rgba(251,191,36,0.9)');
              eyeGlow.addColorStop(0.3, 'rgba(251,191,36,0.5)');
              eyeGlow.addColorStop(1, 'transparent');
              bgCtx.fillStyle = eyeGlow;
              bgCtx.beginPath();bgCtx.arc(710, 218, 10, 0, Math.PI*2);bgCtx.fill();
              bgCtx.fillStyle = '#fef3c7';
              bgCtx.beginPath();bgCtx.arc(710, 218, 3, 0, Math.PI*2);bgCtx.fill();
              // Flying dragon silhouettes in distance
              const drawFlyingDragon = (x, y, s, alpha) => {
                bgCtx.save();
                bgCtx.globalAlpha = alpha;
                bgCtx.fillStyle = '#041008';
                // Body
                bgCtx.beginPath();
                bgCtx.ellipse(x, y, s*18, s*5, -0.1, 0, Math.PI*2);
                bgCtx.fill();
                // Tail
                bgCtx.beginPath();
                bgCtx.moveTo(x + s*16, y);
                bgCtx.bezierCurveTo(x+s*26, y-s*4, x+s*32, y+s*8, x+s*40, y+s*2);
                bgCtx.bezierCurveTo(x+s*36, y+s*5, x+s*28, y+s*2, x+s*18, y+s*1);
                bgCtx.closePath();
                bgCtx.fill();
                // Wing top
                bgCtx.beginPath();
                bgCtx.moveTo(x - s*3, y - s*3);
                bgCtx.bezierCurveTo(x - s*2, y - s*18, x + s*10, y - s*14, x + s*14, y - s*4);
                bgCtx.bezierCurveTo(x + s*8, y - s*6, x + s*2, y - s*4, x - s*3, y - s*3);
                bgCtx.fill();
                // Eye glow
                bgCtx.fillStyle = `rgba(251,191,36,${alpha*1.2})`;
                bgCtx.beginPath();bgCtx.arc(x - s*10, y - s*1, s*2, 0, Math.PI*2);bgCtx.fill();
                bgCtx.restore();
              };
              drawFlyingDragon(120, 80, 0.8, 0.25);
              drawFlyingDragon(350, 50, 0.6, 0.3);
              drawFlyingDragon(580, 95, 0.7, 0.2);
              drawFlyingDragon(700, 40, 0.5, 0.22);
              // Green smoke wisps — more intense
              for (let i=0;i<15;i++){
                const sx=Math.random()*800, sy=80+Math.random()*300;
                const smoke=bgCtx.createRadialGradient(sx,sy,0,sx,sy,35+Math.random()*50);
                smoke.addColorStop(0,'rgba(74,222,128,0.06)');
                smoke.addColorStop(0.5,'rgba(34,197,94,0.03)');
                smoke.addColorStop(1,'transparent');
                bgCtx.fillStyle=smoke;bgCtx.beginPath();bgCtx.arc(sx,sy,40,0,Math.PI*2);bgCtx.fill();
              }
              // Emerald sparkles
              for (let i=0;i<40;i++){
                bgCtx.fillStyle=`rgba(134,239,172,${Math.random()*0.3+0.05})`;
                bgCtx.beginPath();bgCtx.arc(Math.random()*800,40+Math.random()*380,Math.random()*2.5+0.5,0,Math.PI*2);bgCtx.fill();
              }
            } else if (biome === 'castle') {
              // --- CASTLE BACKGROUND: Golden coronation realm ---
              const cstGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              cstGrad.addColorStop(0, '#0d0620');
              cstGrad.addColorStop(0.25, '#1a0a35');
              cstGrad.addColorStop(0.5, '#2d1050');
              cstGrad.addColorStop(0.7, '#4a2068');
              cstGrad.addColorStop(0.85, '#6b3080');
              cstGrad.addColorStop(1, '#1a0a2e');
              bgCtx.fillStyle = cstGrad;
              bgCtx.fillRect(0, 0, 800, 450);
              // Golden ambient glow from above
              const cstGlow = bgCtx.createRadialGradient(400, 60, 10, 400, 200, 450);
              cstGlow.addColorStop(0, 'rgba(251,191,36,0.08)');
              cstGlow.addColorStop(0.5, 'rgba(217,119,6,0.04)');
              cstGlow.addColorStop(1, 'transparent');
              bgCtx.fillStyle = cstGlow;
              bgCtx.fillRect(0, 0, 800, 450);
              // Distant castle spires silhouettes
              const drawSpire = (cx, baseY, h, w, alpha) => {
                bgCtx.save();
                bgCtx.globalAlpha = alpha;
                bgCtx.fillStyle = '#1a0a30';
                bgCtx.beginPath();
                bgCtx.moveTo(cx - w/2, baseY);
                bgCtx.lineTo(cx, baseY - h);
                bgCtx.lineTo(cx + w/2, baseY);
                bgCtx.closePath();
                bgCtx.fill();
                bgCtx.strokeStyle = 'rgba(180,130,50,0.3)';
                bgCtx.lineWidth = 0.5;
                bgCtx.stroke();
                // Flag on top
                bgCtx.fillStyle = 'rgba(251,191,36,0.4)';
                bgCtx.fillRect(cx - 0.5, baseY - h - 4, 1, 4);
                bgCtx.beginPath();
                bgCtx.moveTo(cx + 0.5, baseY - h - 3);
                bgCtx.lineTo(cx + 6, baseY - h);
                bgCtx.lineTo(cx + 0.5, baseY - h + 2);
                bgCtx.closePath();
                bgCtx.fill();
                bgCtx.restore();
              };
              drawSpire(80, 280, 160, 24, 0.5);
              drawSpire(180, 280, 200, 18, 0.4);
              drawSpire(260, 280, 140, 22, 0.45);
              drawSpire(380, 280, 250, 30, 0.35);
              drawSpire(480, 280, 180, 20, 0.4);
              drawSpire(580, 280, 220, 26, 0.45);
              drawSpire(700, 280, 170, 22, 0.38);
              // Warm golden clouds
              const drawGoldCloud = (cx, cy, s, alpha) => {
                bgCtx.save();
                bgCtx.globalAlpha = alpha;
                bgCtx.fillStyle = 'rgba(251,191,36,0.12)';
                bgCtx.beginPath();
                bgCtx.arc(cx, cy, s*14, 0, Math.PI*2); bgCtx.fill();
                bgCtx.beginPath();
                bgCtx.arc(cx+s*16, cy-s*4, s*12, 0, Math.PI*2); bgCtx.fill();
                bgCtx.beginPath();
                bgCtx.arc(cx+s*28, cy, s*15, 0, Math.PI*2); bgCtx.fill();
                bgCtx.restore();
              };
              drawGoldCloud(50, 80, 1.0, 0.3);
              drawGoldCloud(300, 55, 1.2, 0.25);
              drawGoldCloud(550, 90, 0.9, 0.28);
              drawGoldCloud(700, 45, 0.8, 0.22);
              // Stars
              for (let i = 0; i < 50; i++) {
                const sx = Math.random() * 800, sy = Math.random() * 250;
                if (sy > 200 && Math.random() < 0.6) continue;
                bgCtx.fillStyle = `rgba(255,255,255,${Math.random()*0.4+0.1})`;
                bgCtx.beginPath();
                bgCtx.arc(sx, sy, Math.random()*1.2+0.3, 0, Math.PI*2);
                bgCtx.fill();
              }
              // Golden scattered highlights
              for (let i = 0; i < 15; i++) {
                const gx = Math.random() * 800, gy = Math.random() * 280;
                bgCtx.fillStyle = `rgba(251,191,36,${Math.random()*0.15+0.05})`;
                bgCtx.beginPath();
                bgCtx.arc(gx, gy, 1.5, 0, Math.PI*2);
                bgCtx.fill();
              }
            } else if (biome === 'river') {
              // --- RIVER BACKGROUND: Beautiful bright coral reef ocean depths ---
              const rGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              rGrad.addColorStop(0, '#0e7490');   // Bright turquoise ocean surface
              rGrad.addColorStop(0.3, '#06b6d4'); // Cyan water column
              rGrad.addColorStop(0.7, '#0891b2'); // Soft cyan-teal
              rGrad.addColorStop(1, '#0e5a70');   // Deep ocean teal
              bgCtx.fillStyle = rGrad;
              bgCtx.fillRect(0, 0, 800, 450);

              // Sun rays penetrating the water from top-left to bottom-right
              bgCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
              bgCtx.beginPath();
              bgCtx.moveTo(0, 0);
              bgCtx.lineTo(150, 0);
              bgCtx.lineTo(550, 450);
              bgCtx.lineTo(350, 450);
              bgCtx.closePath();
              bgCtx.fill();

              bgCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
              bgCtx.beginPath();
              bgCtx.moveTo(80, 0);
              bgCtx.lineTo(260, 0);
              bgCtx.lineTo(800, 420);
              bgCtx.lineTo(650, 450);
              bgCtx.closePath();
              bgCtx.fill();

              // Ethereal sun rays
              bgCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
              bgCtx.beginPath();
              bgCtx.moveTo(0, 50);
              bgCtx.lineTo(0, 180);
              bgCtx.lineTo(270, 450);
              bgCtx.lineTo(150, 450);
              bgCtx.closePath();
              bgCtx.fill();

              // Far background coral and reef rock silhouettes (soft teal-blue shadows)
              bgCtx.fillStyle = '#065466'; // deep silhouette tone
              bgCtx.beginPath();
              bgCtx.moveTo(0, 450);
              bgCtx.lineTo(0, 380);
              bgCtx.quadraticCurveTo(150, 320, 250, 390);
              bgCtx.quadraticCurveTo(380, 450, 500, 360);
              bgCtx.quadraticCurveTo(620, 280, 720, 370);
              bgCtx.quadraticCurveTo(770, 410, 800, 390);
              bgCtx.lineTo(800, 450);
              bgCtx.closePath();
              bgCtx.fill();

              // Another layer of far background coral silhouettes
              bgCtx.fillStyle = '#0a4252';
              bgCtx.beginPath();
              bgCtx.moveTo(0, 450);
              bgCtx.lineTo(0, 420);
              bgCtx.quadraticCurveTo(80, 390, 160, 410);
              bgCtx.quadraticCurveTo(300, 340, 420, 410);
              bgCtx.quadraticCurveTo(550, 380, 680, 420);
              bgCtx.lineTo(800, 410);
              bgCtx.lineTo(800, 450);
              bgCtx.closePath();
              bgCtx.fill();
            } else {
              // --- GRASS BACKGROUND: Magical realm dreamscape ---
              const skyGrad = bgCtx.createLinearGradient(0, 0, 0, 450);
              skyGrad.addColorStop(0, '#020113');   // Near-black void
              skyGrad.addColorStop(0.15, '#0a0525'); // Deep indigo
              skyGrad.addColorStop(0.35, '#170b3b'); // Twilight purple
              skyGrad.addColorStop(0.55, '#1e1050'); // Rich violet
              skyGrad.addColorStop(0.75, '#2d1b69'); // Magical lilac
              skyGrad.addColorStop(0.9, '#4c1d95');  // Bright horizon
              skyGrad.addColorStop(1, '#1e0b3b');    // Deep magical base
              bgCtx.fillStyle = skyGrad;
              bgCtx.fillRect(0, 0, 800, 450);
              
              // Nebula patches — soft color blends
              bgCtx.globalAlpha = 0.04;
              const drawNebula = (x, y, r, color) => {
                const ng = bgCtx.createRadialGradient(x, y, 0, x, y, r);
                ng.addColorStop(0, color);
                ng.addColorStop(1, 'transparent');
                bgCtx.fillStyle = ng;
                bgCtx.beginPath();
                bgCtx.arc(x, y, r, 0, Math.PI * 2);
                bgCtx.fill();
              };
              drawNebula(200, 100, 160, '#22d3ee');
              drawNebula(550, 180, 190, '#a855f7');
              drawNebula(100, 250, 140, '#fbbf24');
              drawNebula(700, 80, 130, '#38bdf8');
              drawNebula(380, 130, 100, '#f472b6');
              bgCtx.globalAlpha = 1;
              
              // Dense star field — 3 tiers of brightness
              for (let r = 0; r < 16; r++) {
                for (let c = 0; c < 26; c++) {
                  const sx = c * 31 + (Math.random() * 20 - 10);
                  const sy = r * 29 + (Math.random() * 20 - 10);
                  if (sy > 260) continue;
                  const dice = Math.random();
                  if (dice < 0.42) {
                    const sz = dice < 0.08 ? 1.0 : dice < 0.22 ? 0.7 : 0.45;
                    bgCtx.fillStyle = dice < 0.08 ? 'rgba(255,255,255,0.85)'
                      : dice < 0.22 ? 'rgba(255,255,255,0.55)'
                      : 'rgba(200,210,255,0.35)';
                    bgCtx.beginPath();
                    bgCtx.arc(sx, sy, sz, 0, Math.PI * 2);
                    bgCtx.fill();
                  }
                }
              }
              
              // Golden scattered stars (rarer, brighter, with cross sparkle)
              const goldStars = [
                {x:90,y:30},{x:210,y:60},{x:320,y:22},{x:430,y:55},
                {x:178,y:95},{x:560,y:40},{x:620,y:85},{x:720,y:35},
                {x:380,y:18},{x:660,y:58}
              ];
              goldStars.forEach((gs, i) => {
                bgCtx.fillStyle = '#fbbf24';
                bgCtx.shadowColor = 'rgba(251,191,36,0.7)';
                bgCtx.shadowBlur = 3;
                bgCtx.beginPath();
                bgCtx.arc(gs.x, gs.y, 1.8, 0, Math.PI * 2);
                bgCtx.fill();
                bgCtx.shadowBlur = 0;
                if (i % 3 === 0) {
                  bgCtx.strokeStyle = 'rgba(251,191,36,0.35)';
                  bgCtx.lineWidth = 0.6;
                  bgCtx.beginPath();
                  bgCtx.moveTo(gs.x - 5, gs.y);
                  bgCtx.lineTo(gs.x + 5, gs.y);
                  bgCtx.moveTo(gs.x, gs.y - 5);
                  bgCtx.lineTo(gs.x, gs.y + 5);
                  bgCtx.stroke();
                }
              });
              
              // Multi-layer auroras — dream energy waves
              const drawAurora = (y0, y1, y2, y3, color, width, alpha) => {
                bgCtx.globalAlpha = alpha;
                bgCtx.strokeStyle = color;
                bgCtx.lineWidth = width;
                bgCtx.beginPath();
                bgCtx.moveTo(0, y0);
                bgCtx.bezierCurveTo(200, y1, 400, y2, 800, y3);
                bgCtx.stroke();
                bgCtx.globalAlpha = 1;
              };
              drawAurora(160, 40, 260, 90, 'rgba(34,211,238,0.07)', 22, 1);
              drawAurora(120, 200, 30, 160, 'rgba(167,139,250,0.06)', 28, 1);
              drawAurora(190, 110, 180, 140, 'rgba(251,191,36,0.04)', 16, 1);
              drawAurora(70, 170, 90, 50, 'rgba(244,114,182,0.04)', 20, 1);
              drawAurora(220, 150, 300, 170, 'rgba(56,189,248,0.03)', 18, 1);

              // 3D Perspective Chessboard Grid stretching to the horizon Y=270 — refined lines
              bgCtx.strokeStyle = 'rgba(139, 92, 246, 0.10)';
              bgCtx.lineWidth = 0.7;
              const horizonY = 270;
              const vanishingX = 400;
              for (let angle = -8; angle <= 8; angle++) {
                bgCtx.beginPath();
                bgCtx.moveTo(vanishingX, horizonY);
                bgCtx.lineTo(vanishingX + angle * 120, 450);
                bgCtx.stroke();
              }
              for (let i = 0; i < 20; i++) {
                const y = horizonY + Math.pow(i / 20, 2.5) * (450 - horizonY);
                bgCtx.strokeStyle = `rgba(139,92,246,${0.06 + (20-i)*0.005})`;
                bgCtx.beginPath();
                bgCtx.moveTo(0, y);
                bgCtx.lineTo(800, y);
                bgCtx.stroke();
              }
              
              // Square clouds — more ethereal, faint
              bgCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
              const drawSquareCloud = (cx, cy, cw, ch) => {
                bgCtx.fillRect(cx, cy, cw, ch);
                bgCtx.fillRect(cx + cw * 0.2, cy - ch * 0.3, cw * 0.6, ch * 0.3);
                bgCtx.fillRect(cx - cw * 0.15, cy + ch * 0.2, cw * 0.3, ch * 0.6);
                bgCtx.fillRect(cx + cw * 0.85, cy + ch * 0.2, cw * 0.3, ch * 0.6);
              };
              drawSquareCloud(60, 60, 90, 18);
              drawSquareCloud(420, 100, 110, 22);
              drawSquareCloud(670, 45, 75, 15);
              drawSquareCloud(240, 38, 65, 13);
              drawSquareCloud(520, 170, 80, 16);
            } // end biome background if/else
            scene.textures.addCanvas('background', bgCanvas);

            // 5. Midground Parallax Canvas — biome-specific (size 800x450)
            const midCanvas = document.createElement('canvas');
            midCanvas.width = 800;
            midCanvas.height = 450;
            const midCtx = midCanvas.getContext('2d');
            
            if (biome === 'clockwork') {
              // Mechanical floating gear-islands for clockwork biome
              midCtx.fillStyle = 'rgba(30,20,40,0.0)';
              midCtx.fillRect(0, 0, 800, 450);
              
              const drawMechIsland = (x, y, w, h, underH) => {
                const topGrad = midCtx.createLinearGradient(x, y, x, y+h);
                topGrad.addColorStop(0, 'rgba(120,90,50,0.4)');
                topGrad.addColorStop(1, 'rgba(60,40,25,0.25)');
                midCtx.fillStyle = topGrad;
                midCtx.beginPath();
                midCtx.moveTo(x, y); midCtx.lineTo(x+w, y);
                midCtx.lineTo(x+w-15, y+h); midCtx.lineTo(x+15, y+h);
                midCtx.closePath();
                midCtx.fill();
                midCtx.strokeStyle = 'rgba(200,160,80,0.3)';
                midCtx.lineWidth = 1.2;
                midCtx.stroke();
                // Gear teeth on top
                midCtx.fillStyle = 'rgba(200,160,80,0.2)';
                for (let gx=x+6; gx<x+w-6; gx+=12) {
                  midCtx.fillRect(gx, y-2, 6, 4);
                }
                // Underside
                const underGrad = midCtx.createLinearGradient(0, y+h, 0, y+h+underH);
                underGrad.addColorStop(0, 'rgba(40,25,15,0.45)');
                underGrad.addColorStop(1, 'rgba(20,10,8,0.1)');
                midCtx.fillStyle = underGrad;
                midCtx.beginPath();
                midCtx.moveTo(x+15, y+h); midCtx.lineTo(x+w-15, y+h);
                midCtx.lineTo(x+w/2, y+h+underH);
                midCtx.closePath();
                midCtx.fill();
              };
              
              drawMechIsland(60, 320, 200, 20, 55);
              drawMechIsland(440, 275, 250, 22, 55);
              drawMechIsland(260, 198, 144, 16, 30);
              
              // Floating clock faces in midground
              midCtx.fillStyle = 'rgba(200,160,80,0.12)';
              midCtx.beginPath(); midCtx.arc(180, 280, 14, 0, Math.PI*2); midCtx.fill();
              midCtx.beginPath(); midCtx.arc(550, 235, 18, 0, Math.PI*2); midCtx.fill();
              midCtx.strokeStyle = 'rgba(200,160,80,0.2)';
              midCtx.lineWidth = 1;
              midCtx.beginPath(); midCtx.arc(180, 280, 14, 0, Math.PI*2); midCtx.stroke();
              midCtx.beginPath(); midCtx.arc(550, 235, 18, 0, Math.PI*2); midCtx.stroke();
              // Clock hands
              midCtx.strokeStyle = 'rgba(200,160,80,0.18)';
              midCtx.lineWidth = 1.2;
              midCtx.beginPath(); midCtx.moveTo(180, 280); midCtx.lineTo(180, 268); midCtx.stroke();
              midCtx.beginPath(); midCtx.moveTo(550, 235); midCtx.lineTo(560, 235); midCtx.stroke();
              
              // Mechanical spark dots
              for (let i=0; i<40; i++) {
                const mx = Math.random()*800, my = Math.random()*400;
                midCtx.fillStyle = `rgba(200,160,80,${Math.random()*0.15+0.05})`;
                midCtx.beginPath(); midCtx.arc(mx, my, Math.random()*1.2+0.3, 0, Math.PI*2); midCtx.fill();
              }
              
            } else if (biome === 'neon') {
              // Neon midground — floating geometric crystals and diagonal beams
              // Dark crystal platforms
              const drawCrystalPlatform = (x, y, w, h) => {
                const grad = midCtx.createLinearGradient(x, y, x, y+h);
                grad.addColorStop(0, 'rgba(109, 40, 217, 0.35)');
                grad.addColorStop(1, 'rgba(30, 10, 60, 0.15)');
                midCtx.fillStyle = grad;
                midCtx.beginPath();
                midCtx.moveTo(x, y); midCtx.lineTo(x+w, y);
                midCtx.lineTo(x+w-10, y+h); midCtx.lineTo(x+10, y+h);
                midCtx.closePath();
                midCtx.fill();
                midCtx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
                midCtx.lineWidth = 1;
                midCtx.stroke();
                // Neon edge glow
                midCtx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
                midCtx.lineWidth = 2;
                midCtx.beginPath(); midCtx.moveTo(x, y); midCtx.lineTo(x+w, y); midCtx.stroke();
              };
              drawCrystalPlatform(80, 330, 160, 18);
              drawCrystalPlatform(420, 280, 200, 18);
              drawCrystalPlatform(280, 200, 130, 14);
              
              // Floating neon diamonds
              for (let i=0; i<8; i++) {
                const dx = 100 + Math.random()*600;
                const dy = 60 + Math.random()*280;
                const ds = 3 + Math.random()*5;
                midCtx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                midCtx.beginPath();
                midCtx.moveTo(dx, dy-ds); midCtx.lineTo(dx+ds, dy);
                midCtx.lineTo(dx, dy+ds); midCtx.lineTo(dx-ds, dy);
                midCtx.closePath();
                midCtx.fill();
                midCtx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
                midCtx.lineWidth = 0.7;
                midCtx.stroke();
              }
              
              // Diagonal beam hints
              midCtx.strokeStyle = 'rgba(139, 92, 246, 0.06)';
              midCtx.lineWidth = 6;
              for (let i=0; i<5; i++) {
                const bx = i*180;
                midCtx.beginPath();
                midCtx.moveTo(bx, 0); midCtx.lineTo(bx+300, 400); midCtx.stroke();
              }
              
            } else if (biome === 'prairie') {
              // Prairie midground — trees, stable, horses
              // Oak trees
              const drawTree = (x, y, s) => {
                midCtx.fillStyle = '#5c3a1e';
                midCtx.fillRect(x-3, y-10, s*3, s*20);
                midCtx.fillStyle = '#3d7a28';
                midCtx.beginPath(); midCtx.arc(x, y-20, s*14, 0, Math.PI*2); midCtx.fill();
                midCtx.fillStyle = '#4a8f34';
                midCtx.beginPath(); midCtx.arc(x+s*5, y-15, s*10, 0, Math.PI*2); midCtx.fill();
                midCtx.fillStyle = '#2d6b1e';
                midCtx.beginPath(); midCtx.arc(x-s*6, y-10, s*9, 0, Math.PI*2); midCtx.fill();
              };
              drawTree(100, 350, 1.0);
              drawTree(350, 340, 1.2);
              drawTree(600, 355, 0.9);
              drawTree(750, 345, 1.1);
              
              // Horse silhouettes
              const drawHorse = (hx, hy, flip) => {
                midCtx.fillStyle = 'rgba(60,30,10,0.25)';
                const f = flip ? -1 : 1;
                midCtx.beginPath();
                midCtx.moveTo(hx, hy-25);
                midCtx.quadraticCurveTo(hx+f*8, hy-32, hx+f*12, hy-22);
                midCtx.lineTo(hx+f*10, hy-12);
                midCtx.quadraticCurveTo(hx+f*4, hy-14, hx+f*6, hy-8);
                midCtx.lineTo(hx+f*8, hy);
                midCtx.lineTo(hx+f*6, hy+6);
                midCtx.lineTo(hx-f*2, hy+6);
                midCtx.lineTo(hx-f*2, hy-8);
                midCtx.lineTo(hx-f*4, hy-14);
                midCtx.lineTo(hx-f*6, hy-12);
                midCtx.lineTo(hx-1, hy-22);
                midCtx.closePath();
                midCtx.fill();
              };
              drawHorse(200, 370, false);
              drawHorse(450, 368, true);
              
              // Stable/barn silhouette
              midCtx.fillStyle = 'rgba(80,40,15,0.3)';
              midCtx.fillRect(550, 290, 80, 60);
              midCtx.fillStyle = 'rgba(60,30,10,0.3)';
              midCtx.beginPath(); midCtx.moveTo(540, 290); midCtx.lineTo(590, 250); midCtx.lineTo(640, 290); midCtx.closePath(); midCtx.fill();
              midCtx.fillStyle = 'rgba(20,10,5,0.3)';
              midCtx.fillRect(575, 310, 30, 40);
              
            } else if (biome === 'dragon') {
              // Dragon midground — green magma pools and smoke
              for (let i=0;i<8;i++){
                const mx=80+Math.random()*640,my=340+Math.random()*80;
                const pool=midCtx.createRadialGradient(mx,my,5,mx,my,35+Math.random()*30);
                pool.addColorStop(0,'rgba(74,222,128,0.15)');pool.addColorStop(1,'transparent');
                midCtx.fillStyle=pool;midCtx.beginPath();midCtx.arc(mx,my,40,0,Math.PI*2);midCtx.fill();
                const core=midCtx.createRadialGradient(mx,my,2,mx,my,12);
                core.addColorStop(0,'rgba(134,239,172,0.2)');core.addColorStop(1,'transparent');
                midCtx.fillStyle=core;midCtx.beginPath();midCtx.arc(mx,my,12,0,Math.PI*2);midCtx.fill();
              }
              for (let i=0;i<10;i++){
                const sx=60+Math.random()*680,sy=280+Math.random()*150;
                const smoke=midCtx.createLinearGradient(sx,sy,sx,sy-80);
                smoke.addColorStop(0,'rgba(34,197,94,0.06)');smoke.addColorStop(1,'transparent');
                midCtx.fillStyle=smoke;midCtx.beginPath();midCtx.moveTo(sx-15,sy);
                midCtx.lineTo(sx+15,sy);midCtx.lineTo(sx+25,sy-80);midCtx.lineTo(sx-25,sy-80);
                midCtx.closePath();midCtx.fill();
              }
              for (let row=0;row<10;row++){
                for(let col=0;col<15;col++){
                  const sx=(col*55)+(row%2)*27,sy=60+row*38;
                  if(sx>750)continue;
                  midCtx.strokeStyle='rgba(34,197,94,0.06)';midCtx.lineWidth=0.8;
                  midCtx.beginPath();midCtx.moveTo(sx,sy);
                  midCtx.bezierCurveTo(sx+14,sy-8,sx+28,sy-8,sx+42,sy);midCtx.stroke();
                }
              }
            } else if (biome === 'castle') {
              // Castle midground — golden columns and archways
              const drawColumn = (cx, baseY, w, h, alpha) => {
                midCtx.save();
                midCtx.globalAlpha = alpha;
                const colGrad = midCtx.createLinearGradient(cx, baseY-h, cx, baseY);
                colGrad.addColorStop(0, 'rgba(180, 130, 50, 0.5)');
                colGrad.addColorStop(0.5, 'rgba(140, 90, 30, 0.4)');
                colGrad.addColorStop(1, 'rgba(100, 60, 20, 0.25)');
                midCtx.fillStyle = colGrad;
                midCtx.fillRect(cx - w/2, baseY - h, w, h);
                // Capital (top ornament)
                midCtx.fillStyle = 'rgba(200, 150, 60, 0.5)';
                midCtx.fillRect(cx - w/2 - 3, baseY - h - 6, w + 6, 6);
                midCtx.fillRect(cx - w/2 - 1, baseY - h - 8, w + 2, 2);
                // Base
                midCtx.fillStyle = 'rgba(160, 110, 40, 0.45)';
                midCtx.fillRect(cx - w/2 - 4, baseY - 4, w + 8, 4);
                midCtx.restore();
              };
              drawColumn(80, 380, 20, 140, 0.45);
              drawColumn(200, 380, 16, 160, 0.38);
              drawColumn(340, 380, 22, 130, 0.42);
              drawColumn(500, 380, 18, 150, 0.4);
              drawColumn(640, 380, 20, 135, 0.35);
              drawColumn(760, 380, 16, 145, 0.38);
              // Golden archways connecting columns
              const drawArch = (x1, x2, topY, alpha) => {
                midCtx.save();
                midCtx.globalAlpha = alpha;
                midCtx.strokeStyle = 'rgba(200, 150, 50, 0.3)';
                midCtx.lineWidth = 2;
                midCtx.beginPath();
                const cx = (x1 + x2) / 2;
                midCtx.moveTo(x1, topY);
                midCtx.quadraticCurveTo(cx, topY - 40, x2, topY);
                midCtx.stroke();
                midCtx.restore();
              };
              drawArch(80, 200, 240, 0.25);
              drawArch(200, 340, 220, 0.2);
              drawArch(340, 500, 250, 0.22);
              drawArch(500, 640, 230, 0.18);
              // Floating golden particles
              for (let i = 0; i < 20; i++) {
                const px = Math.random() * 800, py = 100 + Math.random() * 260;
                midCtx.fillStyle = `rgba(251,191,36,${Math.random()*0.2+0.05})`;
                midCtx.beginPath();
                midCtx.arc(px, py, Math.random()*2+0.5, 0, Math.PI*2);
                midCtx.fill();
              }
            } else if (biome === 'river') {
              // --- RIVER MIDGROUND: Colorful waving kelp, corals, and parallax fish schools ---
              // Translucent water overlay
              midCtx.fillStyle = 'rgba(6, 182, 212, 0.03)';
              midCtx.fillRect(0, 0, 800, 450);

              // 1. Draw waving kelp/seaweed (multiple columns at random positions)
              const drawKelp = (x, h, color, offset) => {
                midCtx.strokeStyle = color;
                midCtx.lineWidth = 6;
                midCtx.lineCap = 'round';
                midCtx.beginPath();
                midCtx.moveTo(x, 450);
                
                // Draw waving bezier curve
                const wave = Math.sin(scene.time.now * 0.002 + offset) * 15;
                midCtx.bezierCurveTo(x - 10 + wave, 350, x + 10 - wave, 250, x + wave, 450 - h);
                midCtx.stroke();
              };

              // Green, purple, and orange kelp plants
              drawKelp(100, 200, 'rgba(16, 185, 129, 0.35)', 0);
              drawKelp(120, 240, 'rgba(52, 211, 153, 0.30)', 1.5);
              drawKelp(250, 180, 'rgba(168, 85, 247, 0.30)', 3);
              drawKelp(380, 220, 'rgba(236, 72, 153, 0.30)', 0.5);
              drawKelp(520, 250, 'rgba(16, 185, 129, 0.35)', 2);
              drawKelp(650, 190, 'rgba(251, 146, 60, 0.30)', 4);
              drawKelp(720, 230, 'rgba(139, 92, 246, 0.30)', 1);

              // 2. Draw glowing coral clusters on the seafloor
              const drawCoral = (cx, cy, scale, color) => {
                midCtx.fillStyle = color;
                midCtx.beginPath();
                midCtx.arc(cx, cy, 14 * scale, 0, Math.PI*2);
                midCtx.arc(cx - 10 * scale, cy + 8 * scale, 10 * scale, 0, Math.PI*2);
                midCtx.arc(cx + 10 * scale, cy + 8 * scale, 10 * scale, 0, Math.PI*2);
                midCtx.fill();
                // highlights
                midCtx.fillStyle = 'rgba(255,255,255,0.3)';
                midCtx.beginPath();
                midCtx.arc(cx - 3, cy - 3, 3 * scale, 0, Math.PI*2);
                midCtx.fill();
              };
              drawCoral(80, 440, 1.2, 'rgba(244, 114, 182, 0.4)');
              drawCoral(300, 442, 0.9, 'rgba(251, 146, 60, 0.4)');
              drawCoral(450, 445, 1.4, 'rgba(52, 211, 153, 0.4)');
              drawCoral(600, 439, 1.0, 'rgba(167, 139, 250, 0.4)');

              // 3. Parallax fish schools swimming across the midground
              midCtx.fillStyle = 'rgba(251, 243, 60, 0.35)'; // translucent yellow fish
              const fishTime = scene.time.now * 0.0015;
              for (let i = 0; i < 6; i++) {
                // School 1
                const fx = (150 + i * 25 - fishTime * 40) % 900 - 50;
                const fy = 120 + Math.sin(fishTime + i) * 12 + i * 10;
                midCtx.beginPath();
                midCtx.ellipse(fx, fy, 6, 3, 0, 0, Math.PI*2);
                midCtx.fill();
                // small tail
                midCtx.beginPath();
                midCtx.moveTo(fx - 6, fy);
                midCtx.lineTo(fx - 10, fy - 3);
                midCtx.lineTo(fx - 10, fy + 3);
                midCtx.closePath();
                midCtx.fill();
              }
            } else {
              const drawIsland = (x, y, w, h, underH) => {
                // Island top surface with checkered pattern
                const topGrad = midCtx.createLinearGradient(x, y, x, y + h);
                topGrad.addColorStop(0, 'rgba(109,40,217,0.55)');
                topGrad.addColorStop(1, 'rgba(76,29,149,0.35)');
                midCtx.fillStyle = topGrad;
                midCtx.beginPath();
                midCtx.moveTo(x, y);
                midCtx.lineTo(x + w, y);
                midCtx.lineTo(x + w - 20, y + h);
                midCtx.lineTo(x + 20, y + h);
                midCtx.closePath();
                midCtx.fill();
                
                // Chess checkers on surface
                midCtx.fillStyle = 'rgba(139,92,246,0.25)';
                for (let cx = x + 4; cx < x + w - 4; cx += 28) {
                  midCtx.fillRect(cx, y + 2, 14, 12);
                  midCtx.fillRect(cx + 14, y + 14, 14, 12);
                }
                
                // Gold trim on edge
                midCtx.strokeStyle = 'rgba(251,191,36,0.25)';
                midCtx.lineWidth = 1;
                midCtx.beginPath();
                midCtx.moveTo(x, y);
                midCtx.lineTo(x + w, y);
                midCtx.stroke();
                
                // Underside shadow
                const underGrad = midCtx.createLinearGradient(0, y + h, 0, y + h + underH);
                underGrad.addColorStop(0, 'rgba(58,20,112,0.55)');
                underGrad.addColorStop(1, 'rgba(30,10,60,0.15)');
                midCtx.fillStyle = underGrad;
                midCtx.beginPath();
                midCtx.moveTo(x + 20, y + h);
                midCtx.lineTo(x + w - 20, y + h);
                midCtx.lineTo(x + w / 2, y + h + underH);
                midCtx.closePath();
                midCtx.fill();
              };
              
              // Island 1 — Torreta Rook Shop
              drawIsland(60, 320, 200, 20, 55);
              midCtx.fillStyle = 'rgba(109, 40, 217, 0.5)';
              midCtx.fillRect(135, 258, 30, 62);
              midCtx.fillRect(130, 248, 40, 10);
              // Crenellations with gold dots
              midCtx.clearRect(140, 248, 4, 6);
              midCtx.clearRect(156, 248, 4, 6);
              midCtx.fillStyle = 'rgba(251,191,36,0.5)';
              midCtx.beginPath();
              midCtx.arc(142, 250, 1.2, 0, Math.PI*2);
              midCtx.arc(158, 250, 1.2, 0, Math.PI*2);
              midCtx.fill();
              // Canopy
              midCtx.fillStyle = 'rgba(167,139,250,0.55)';
              midCtx.beginPath();
              midCtx.moveTo(120, 278);
              midCtx.lineTo(150, 272);
              midCtx.lineTo(180, 278);
              midCtx.lineTo(170, 286);
              midCtx.lineTo(130, 286);
              midCtx.closePath();
              midCtx.fill();
              // Empanada sign with glow
              midCtx.fillStyle = 'rgba(251,191,36,0.55)';
              midCtx.beginPath();
              midCtx.arc(115, 290, 5, 0, Math.PI, true);
              midCtx.closePath();
              midCtx.fill();
              midCtx.fillStyle = 'rgba(251,191,36,0.25)';
              midCtx.beginPath();
              midCtx.arc(115, 290, 8, 0, Math.PI*2);
              midCtx.fill();
              
              // Island 2 — Giant Knight statue
              drawIsland(450, 278, 230, 22, 55);
              midCtx.fillStyle = 'rgba(109, 40, 217, 0.5)';
              midCtx.beginPath();
              midCtx.moveTo(560, 278);
              midCtx.quadraticCurveTo(554, 235, 570, 212);
              midCtx.quadraticCurveTo(558, 185, 564, 174);
              midCtx.lineTo(572, 164);
              midCtx.lineTo(576, 185);
              midCtx.quadraticCurveTo(594, 188, 598, 202);
              midCtx.quadraticCurveTo(608, 214, 598, 226);
              midCtx.lineTo(584, 226);
              midCtx.quadraticCurveTo(574, 238, 574, 260);
              midCtx.lineTo(594, 278);
              midCtx.closePath();
              midCtx.fill();
              // Knight eye glow
              midCtx.fillStyle = 'rgba(34,211,238,0.45)';
              midCtx.beginPath();
              midCtx.arc(586, 202, 2.5, 0, Math.PI*2);
              midCtx.fill();
              
              // Island 3 — Peoncito & giant mustache
              drawIsland(275, 198, 130, 16, 30);
              midCtx.fillStyle = 'rgba(109, 40, 217, 0.5)';
              midCtx.beginPath();
              midCtx.arc(340, 170, 7.5, 0, Math.PI*2);
              midCtx.fill();
              midCtx.beginPath();
              midCtx.moveTo(331, 198);
              midCtx.quadraticCurveTo(333, 179, 340, 174);
              midCtx.quadraticCurveTo(347, 179, 349, 198);
              midCtx.closePath();
              midCtx.fill();
              // Giant mustache with highlight
              midCtx.fillStyle = 'rgba(167,139,250,0.5)';
              midCtx.beginPath();
              midCtx.moveTo(340, 159);
              midCtx.quadraticCurveTo(318, 148, 312, 165);
              midCtx.quadraticCurveTo(323, 177, 340, 169);
              midCtx.quadraticCurveTo(357, 177, 368, 165);
              midCtx.quadraticCurveTo(362, 148, 340, 159);
              midCtx.closePath();
              midCtx.fill();
              midCtx.fillStyle = 'rgba(251,191,36,0.15)';
              midCtx.beginPath();
              midCtx.arc(340, 162, 4, 0, Math.PI*2);
              midCtx.fill();
              
              // Floating crystal decorations
              midCtx.fillStyle = 'rgba(34,211,238,0.12)';
              midCtx.beginPath();
              midCtx.arc(180, 280, 4, 0, Math.PI*2);
              midCtx.arc(530, 238, 3.5, 0, Math.PI*2);
              midCtx.arc(400, 160, 5, 0, Math.PI*2);
              midCtx.fill();
              midCtx.strokeStyle = 'rgba(34,211,238,0.2)';
              midCtx.lineWidth = 0.6;
              midCtx.beginPath();
              midCtx.moveTo(176, 286);
              midCtx.lineTo(184, 278);
              midCtx.moveTo(526, 244);
              midCtx.lineTo(534, 236);
              midCtx.moveTo(396, 166);
              midCtx.lineTo(404, 158);
              midCtx.stroke();
            } // end biome midground if/else
            scene.textures.addCanvas('bg_middle', midCanvas);

            // 5.5. Foreground Decorative Canvas — floating magical particles & chess silhouettes
            const fgCanvas = document.createElement('canvas');
            fgCanvas.width = 2400;
            fgCanvas.height = 450;
            const fgCtx = fgCanvas.getContext('2d');
            
            // Semi-transparent chess piece silhouettes scattered across the level
            const fgSilhouettes = [
              {x:180, y:350, type:'pawn'}, {x:420, y:280, type:'knight'},
              {x:700, y:340, type:'bishop'}, {x:960, y:260, type:'rook'},
              {x:1200, y:330, type:'pawn'}, {x:1450, y:290, type:'pawn'},
              {x:1700, y:350, type:'knight'}, {x:1950, y:270, type:'bishop'},
              {x:2200, y:340, type:'rook'}
            ];
            fgSilhouettes.forEach(s => {
              fgCtx.fillStyle = 'rgba(109,40,217,0.08)';
              fgCtx.beginPath();
              if (s.type === 'pawn') {
                fgCtx.arc(s.x, s.y, 9, 0, Math.PI*2);
                fgCtx.moveTo(s.x - 7, s.y);
                fgCtx.quadraticCurveTo(s.x - 7, s.y + 18, s.x - 8, s.y + 24);
                fgCtx.lineTo(s.x + 8, s.y + 24);
                fgCtx.quadraticCurveTo(s.x + 7, s.y + 18, s.x + 7, s.y);
              } else if (s.type === 'knight') {
                fgCtx.moveTo(s.x + 5, s.y + 20);
                fgCtx.quadraticCurveTo(s.x + 5, s.y + 5, s.x + 2, s.y - 4);
                fgCtx.lineTo(s.x + 6, s.y - 8);
                fgCtx.lineTo(s.x + 8, s.y - 4);
                fgCtx.quadraticCurveTo(s.x + 14, s.y, s.x + 16, s.y + 6);
                fgCtx.lineTo(s.x + 10, s.y + 24);
              } else if (s.type === 'bishop') {
                fgCtx.arc(s.x, s.y - 8, 6, 0, Math.PI*2);
                fgCtx.moveTo(s.x - 5, s.y - 2);
                fgCtx.quadraticCurveTo(s.x - 6, s.y + 10, s.x - 8, s.y + 24);
                fgCtx.lineTo(s.x + 8, s.y + 24);
                fgCtx.quadraticCurveTo(s.x + 6, s.y + 10, s.x + 5, s.y - 2);
              } else if (s.type === 'rook') {
                fgCtx.fillRect(s.x - 8, s.y - 4, 16, 28);
                fgCtx.fillRect(s.x - 10, s.y - 10, 20, 6);
                fgCtx.clearRect(s.x - 6, s.y - 10, 3, 4);
                fgCtx.clearRect(s.x, s.y - 10, 3, 4);
                fgCtx.clearRect(s.x + 5, s.y - 10, 3, 4);
              }
              fgCtx.fill();
            });
            
            // Magical floating spark dots across the level
            for (let i = 0; i < 80; i++) {
              const fx = Math.random() * 2400;
              const fy = Math.random() * 400;
              const fs = Math.random() * 1.5 + 0.4;
              fgCtx.fillStyle = `rgba(167,139,250,${Math.random() * 0.2 + 0.05})`;
              fgCtx.beginPath();
              fgCtx.arc(fx, fy, fs, 0, Math.PI*2);
              fgCtx.fill();
            }
            
            scene.textures.addCanvas('bg_foreground', fgCanvas);

            // 6. Knight Double Jump Shockwave Canvas (size 64x64)
            const kCanvas = document.createElement('canvas');
            kCanvas.width = 64;
            kCanvas.height = 64;
            const kCtx = kCanvas.getContext('2d');
            kCtx.fillStyle = '#22d3ee'; // Cian
            kCtx.beginPath();
            kCtx.moveTo(20, 52);
            kCtx.quadraticCurveTo(18, 40, 24, 30); // neck back
            kCtx.quadraticCurveTo(20, 20, 22, 16); // ear back
            kCtx.lineTo(26, 12); // ear top
            kCtx.lineTo(29, 20);
            kCtx.lineTo(32, 16); // second ear
            kCtx.lineTo(35, 12);
            kCtx.lineTo(37, 20);
            kCtx.quadraticCurveTo(46, 22, 48, 28); // snout forehead
            kCtx.quadraticCurveTo(52, 32, 48, 36); // mouth
            kCtx.lineTo(40, 36); // jaw
            kCtx.quadraticCurveTo(34, 40, 34, 46); // chest
            kCtx.lineTo(44, 52);
            kCtx.closePath();
            kCtx.fill();
            
            kCtx.fillStyle = '#ffffff';
            kCtx.beginPath();
            kCtx.arc(36, 24, 2.5, 0, Math.PI*2); // Eye
            kCtx.fill();
            
            scene.textures.addCanvas('knight_burst', kCanvas);

            // 7. Gold Crown Secret Collectible Canvas (size 36x36 — enlarged for detail)
            const crCanvas = document.createElement('canvas');
            crCanvas.width = 36;
            crCanvas.height = 36;
            const crCtx = crCanvas.getContext('2d');
            // Rich gold gradient body
            const crGrad = crCtx.createLinearGradient(6, 6, 30, 30);
            crGrad.addColorStop(0, '#fef3c7');
            crGrad.addColorStop(0.3, '#fbbf24');
            crGrad.addColorStop(0.7, '#f59e0b');
            crGrad.addColorStop(1, '#b45309');
            crCtx.fillStyle = crGrad;
            crCtx.beginPath();
            crCtx.moveTo(5, 30);
            crCtx.lineTo(31, 30);
            crCtx.lineTo(29, 14);
            crCtx.lineTo(23, 20);
            crCtx.lineTo(18, 7); // center crown peak (taller)
            crCtx.lineTo(13, 20);
            crCtx.lineTo(7, 14);
            crCtx.closePath();
            crCtx.fill();
            // Golden outline
            crCtx.strokeStyle = '#92400e';
            crCtx.lineWidth = 1;
            crCtx.stroke();
            // Inner highlight
            crCtx.strokeStyle = '#fef3c7';
            crCtx.lineWidth = 0.8;
            crCtx.beginPath();
            crCtx.moveTo(18, 8);
            crCtx.lineTo(18, 28);
            crCtx.stroke();
            // Base rim
            crCtx.fillStyle = '#78350f';
            crCtx.fillRect(4, 29, 28, 4);
            crCtx.fillStyle = '#fbbf24';
            crCtx.fillRect(4, 29, 28, 1.5);
            // Center ruby — larger and glowing
            const rubyGlow = crCtx.createRadialGradient(18, 6, 0, 18, 6, 4);
            rubyGlow.addColorStop(0, '#ffffff');
            rubyGlow.addColorStop(0.3, '#fca5a5');
            rubyGlow.addColorStop(1, '#ef4444');
            crCtx.fillStyle = rubyGlow;
            crCtx.beginPath();
            crCtx.arc(18, 6, 3, 0, Math.PI*2);
            crCtx.fill();
            // Side sapphires
            const sapGlow = crCtx.createRadialGradient(7, 12, 0, 7, 12, 2.5);
            sapGlow.addColorStop(0, '#ffffff');
            sapGlow.addColorStop(0.3, '#93c5fd');
            sapGlow.addColorStop(1, '#3b82f6');
            crCtx.fillStyle = sapGlow;
            crCtx.beginPath();
            crCtx.arc(7, 12, 2, 0, Math.PI*2);
            crCtx.fill();
            crCtx.beginPath();
            crCtx.arc(29, 12, 2, 0, Math.PI*2);
            crCtx.fill();
            // Jewel sparkle highlights
            crCtx.fillStyle = 'rgba(255,255,255,0.7)';
            crCtx.beginPath();
            crCtx.arc(17.5, 5, 1, 0, Math.PI*2);
            crCtx.fill();
            
            scene.textures.addCanvas('crown_gold', crCanvas);

            // 7.5. Spin Coin Collectible Canvas (4 frames for rotation animation, size 24x24)
            if (!scene.textures.exists('coin_0')) {
              const drawCoinFrame = (squash) => {
                const coCanvas = document.createElement('canvas');
                coCanvas.width = 24;
                coCanvas.height = 24;
                const coCtx = coCanvas.getContext('2d');
                const cx = 12, cy = 12;
                // Metallic gold gradient
                const coinGrad = coCtx.createLinearGradient(cx - 8, cy - 8, cx + 8, cy + 8);
                coinGrad.addColorStop(0, '#fef3c7');
                coinGrad.addColorStop(0.3, '#fbbf24');
                coinGrad.addColorStop(0.6, '#f59e0b');
                coinGrad.addColorStop(1, '#b45309');
                coCtx.fillStyle = coinGrad;
                coCtx.beginPath();
                // Draw a smooth 5-pointed star coin
                const outerR = 9, innerR = 3.5;
                for (let i = 0; i < 5; i++) {
                  const aOuter = (i * 72 - 90) * Math.PI / 180;
                  const aInner = (i * 72 - 90 + 36) * Math.PI / 180;
                  const ox = cx + Math.cos(aOuter) * outerR * (1 - squash * 0.3);
                  const oy = cy + Math.sin(aOuter) * outerR;
                  const ix = cx + Math.cos(aInner) * innerR * (1 - squash * 0.3);
                  const iy = cy + Math.sin(aInner) * innerR;
                  if (i === 0) coCtx.moveTo(ox, oy);
                  else coCtx.lineTo(ox, oy);
                  coCtx.lineTo(ix, iy);
                }
                coCtx.closePath();
                coCtx.fill();
                // Dark gold border
                coCtx.strokeStyle = '#92400e';
                coCtx.lineWidth = 1.2;
                coCtx.stroke();
                // Bright highlight on top-left
                coCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                coCtx.beginPath();
                coCtx.arc(cx - 2, cy - 2, 3, 0, Math.PI*2);
                coCtx.fill();
                // Central shine dot
                coCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                coCtx.beginPath();
                coCtx.arc(cx, cy, 1.5, 0, Math.PI*2);
                coCtx.fill();
                return coCanvas;
              };
              // 4 frames: head-on, 1/4 turn, edge-on, 3/4 turn
              scene.textures.addCanvas('coin_0', drawCoinFrame(0));   // full face
              scene.textures.addCanvas('coin_1', drawCoinFrame(0.4)); // slight turn
              scene.textures.addCanvas('coin_2', drawCoinFrame(0.8)); // almost edge
              scene.textures.addCanvas('coin_3', drawCoinFrame(0.5)); // mid turn
              // Coin spin animation
              scene.anims.create({
                key: 'coin-spin',
                frames: [
                  { key: 'coin_0' }, { key: 'coin_1' },
                  { key: 'coin_2' }, { key: 'coin_3' },
                  { key: 'coin_1' }
                ],
                frameRate: 10,
                repeat: -1
              });
            }
            
            // 7.9. Tournament Trophy canvas (size 56x80) — for clockwork/real-world levels
            if (!scene.textures.exists('trophy')) {
              const tCanvas = document.createElement('canvas');
              tCanvas.width = 56;
              tCanvas.height = 80;
              const tCtx = tCanvas.getContext('2d');
              // Trophy cup body
              const tGrad = tCtx.createLinearGradient(18, 10, 38, 70);
              tGrad.addColorStop(0, '#fef3c7');
              tGrad.addColorStop(0.3, '#fbbf24');
              tGrad.addColorStop(0.7, '#d97706');
              tGrad.addColorStop(1, '#92400e');
              tCtx.fillStyle = tGrad;
              tCtx.beginPath();
              tCtx.moveTo(20, 8);
              tCtx.lineTo(36, 8);
              tCtx.quadraticCurveTo(40, 20, 42, 35);
              tCtx.lineTo(42, 50);
              tCtx.quadraticCurveTo(42, 56, 38, 56);
              tCtx.lineTo(18, 56);
              tCtx.quadraticCurveTo(14, 56, 14, 50);
              tCtx.lineTo(14, 35);
              tCtx.quadraticCurveTo(16, 20, 20, 8);
              tCtx.closePath();
              tCtx.fill();
              // Handles
              tCtx.strokeStyle = '#d97706';
              tCtx.lineWidth = 3;
              tCtx.beginPath();
              tCtx.arc(15, 30, 9, Math.PI*0.7, Math.PI*1.3);
              tCtx.stroke();
              tCtx.beginPath();
              tCtx.arc(41, 30, 9, -Math.PI*0.3, Math.PI*0.3);
              tCtx.stroke();
              // Base
              tCtx.fillStyle = '#92400e';
              tCtx.fillRect(10, 58, 36, 8);
              tCtx.fillStyle = '#fbbf24';
              tCtx.fillRect(10, 58, 36, 2);
              // Star on cup
              tCtx.fillStyle = '#fef3c7';
              tCtx.beginPath();
              for (let i=0; i<5; i++) {
                const sa = (i*72-90)*Math.PI/180;
                tCtx.lineTo(28+Math.cos(sa)*6, 30+Math.sin(sa)*6);
                tCtx.lineTo(28+Math.cos(sa+Math.PI/5)*3, 30+Math.sin(sa+Math.PI/5)*3);
              }
              tCtx.closePath();
              tCtx.fill();
              // Glow highlight
              tCtx.fillStyle = 'rgba(255,255,255,0.25)';
              tCtx.beginPath();
              tCtx.ellipse(32, 20, 8, 14, 0, 0, Math.PI*2);
              tCtx.fill();
              
              scene.textures.addCanvas('trophy', tCanvas);
            }
            
            // Clockwork gear texture (for rotating gear platforms)
            if (!scene.textures.exists('gear_wheel')) {
              const gCanvas = document.createElement('canvas');
              gCanvas.width = 180;
              gCanvas.height = 180;
              const gCtx = gCanvas.getContext('2d');
              const cx = 90, cy = 90;
              // Outer ring
              gCtx.strokeStyle = '#b8963c';
              gCtx.lineWidth = 4;
              gCtx.beginPath(); gCtx.arc(cx, cy, 82, 0, Math.PI*2); gCtx.stroke();
              gCtx.strokeStyle = '#8a6d2f';
              gCtx.lineWidth = 2;
              gCtx.beginPath(); gCtx.arc(cx, cy, 78, 0, Math.PI*2); gCtx.stroke();
              // Gear teeth around edge
              for (let i = 0; i < 16; i++) {
                const a = (i/16)*Math.PI*2;
                const outerR = 85, innerR = 73;
                gCtx.fillStyle = '#6b5328';
                gCtx.beginPath();
                gCtx.moveTo(cx+Math.cos(a-0.06)*innerR, cy+Math.sin(a-0.06)*innerR);
                gCtx.lineTo(cx+Math.cos(a-0.06)*outerR, cy+Math.sin(a-0.06)*outerR);
                gCtx.lineTo(cx+Math.cos(a+0.06)*outerR, cy+Math.sin(a+0.06)*outerR);
                gCtx.lineTo(cx+Math.cos(a+0.06)*innerR, cy+Math.sin(a+0.06)*innerR);
                gCtx.closePath();
                gCtx.fill();
              }
              // Inner spokes
              gCtx.strokeStyle = '#7a6030';
              gCtx.lineWidth = 3;
              for (let i = 0; i < 6; i++) {
                const a = (i/6)*Math.PI*2;
                gCtx.beginPath();
                gCtx.moveTo(cx+Math.cos(a)*18, cy+Math.sin(a)*18);
                gCtx.lineTo(cx+Math.cos(a)*68, cy+Math.sin(a)*68);
                gCtx.stroke();
              }
              // Center hub
              const hubGrad = gCtx.createRadialGradient(cx, cy, 2, cx, cy, 20);
              hubGrad.addColorStop(0, '#d4b84c');
              hubGrad.addColorStop(0.5, '#8a6d2f');
              hubGrad.addColorStop(1, '#4a3822');
              gCtx.fillStyle = hubGrad;
              gCtx.beginPath(); gCtx.arc(cx, cy, 20, 0, Math.PI*2); gCtx.fill();
              // Center bolt
              gCtx.fillStyle = '#e2c868';
              gCtx.beginPath(); gCtx.arc(cx, cy, 5, 0, Math.PI*2); gCtx.fill();
              gCtx.strokeStyle = '#4a3822';
              gCtx.lineWidth = 1;
              gCtx.beginPath(); gCtx.arc(cx, cy, 5, 0, Math.PI*2); gCtx.stroke();
              
              scene.textures.addCanvas('gear_wheel', gCanvas);
            }
            
            // Boss texture: Alfil Exiliado (neon bishop boss, size 64x96)
            if (!scene.textures.exists('boss_alfil')) {
              const bCanvas = document.createElement('canvas');
              bCanvas.width = 64;
              bCanvas.height = 96;
              const bCtx = bCanvas.getContext('2d');
              // Dark body with neon glow
              const bGrad = bCtx.createLinearGradient(16, 20, 48, 88);
              bGrad.addColorStop(0, '#5b21b6');
              bGrad.addColorStop(0.5, '#3b0764');
              bGrad.addColorStop(1, '#1a0030');
              bCtx.fillStyle = bGrad;
              bCtx.beginPath();
              bCtx.moveTo(18, 20); bCtx.lineTo(46, 20);
              bCtx.quadraticCurveTo(52, 50, 48, 88);
              bCtx.lineTo(16, 88);
              bCtx.quadraticCurveTo(12, 50, 18, 20);
              bCtx.closePath();
              bCtx.fill();
              // Neon outline
              bCtx.strokeStyle = '#a855f7';
              bCtx.lineWidth = 2;
              bCtx.shadowColor = '#a855f7';
              bCtx.shadowBlur = 10;
              bCtx.stroke();
              bCtx.shadowBlur = 0;
              // Bishop mitre head
              const hGrad = bCtx.createRadialGradient(30, 10, 2, 32, 14, 8);
              hGrad.addColorStop(0, '#c084fc');
              hGrad.addColorStop(0.7, '#7e22ce');
              hGrad.addColorStop(1, '#3b0764');
              bCtx.fillStyle = hGrad;
              bCtx.beginPath(); bCtx.arc(32, 12, 8, 0, Math.PI*2); bCtx.fill();
              // Mitre slot
              bCtx.strokeStyle = '#1a0030';
              bCtx.lineWidth = 1.5;
              bCtx.shadowBlur = 0;
              bCtx.beginPath(); bCtx.moveTo(32, 4); bCtx.lineTo(32, 20); bCtx.stroke();
              // Glowing angry eyes
              bCtx.fillStyle = '#ef4444';
              bCtx.shadowColor = '#ef4444';
              bCtx.shadowBlur = 6;
              bCtx.beginPath(); bCtx.arc(27, 11, 2, 0, Math.PI*2); bCtx.fill();
              bCtx.beginPath(); bCtx.arc(37, 11, 2, 0, Math.PI*2); bCtx.fill();
              bCtx.shadowBlur = 0;
              // Pointed mitre top
              bCtx.fillStyle = '#c084fc';
              bCtx.beginPath();
              bCtx.moveTo(32, -2); bCtx.lineTo(28, 6); bCtx.lineTo(36, 6);
              bCtx.closePath();
              bCtx.fill();
              // Exile marks (diagonal cross on body)
              bCtx.strokeStyle = 'rgba(168,85,247,0.5)';
              bCtx.lineWidth = 2;
              bCtx.beginPath();
              bCtx.moveTo(20, 30); bCtx.lineTo(42, 60);
              bCtx.moveTo(42, 30); bCtx.lineTo(20, 60);
              bCtx.stroke();
              // Base
              bCtx.fillStyle = '#3b0764';
              bCtx.fillRect(12, 88, 40, 6);
              bCtx.fillStyle = '#7e22ce';
              bCtx.fillRect(12, 88, 40, 2);
              
              scene.textures.addCanvas('boss_alfil', bCanvas);
            }

            // Boss texture: El Elegante Veriss (aquatic king boss, size 64x96) (REDESIGNED)
            if (!scene.textures.exists('boss_elegante')) {
              const bCanvas = document.createElement('canvas');
              bCanvas.width = 64;
              bCanvas.height = 96;
              const bCtx = bCanvas.getContext('2d');
              
              // Base - elegant pedestal with scale patterns
              const bGrad = bCtx.createLinearGradient(16, 20, 48, 88);
              bGrad.addColorStop(0, '#0284c7'); // sky blue
              bGrad.addColorStop(0.5, '#0d9488'); // teal
              bGrad.addColorStop(1, '#0f172a'); // slate dark
              bCtx.fillStyle = bGrad;
              bCtx.beginPath();
              bCtx.moveTo(18, 20); bCtx.lineTo(46, 20);
              bCtx.quadraticCurveTo(52, 50, 48, 88);
              bCtx.lineTo(16, 88);
              bCtx.quadraticCurveTo(12, 50, 18, 20);
              bCtx.closePath();
              bCtx.fill();
              
              // Scale patterns on pedestal
              bCtx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
              bCtx.lineWidth = 1.5;
              for (let sy = 30; sy < 80; sy += 10) {
                for (let sx = 20; sx < 44; sx += 8) {
                  bCtx.beginPath();
                  bCtx.arc(sx + (sy % 20 === 0 ? 4 : 0), sy, 5, 0, Math.PI);
                  bCtx.stroke();
                }
              }

              // Gold outlines and trims
              bCtx.strokeStyle = '#fbbf24'; // bright gold
              bCtx.lineWidth = 2.5;
              bCtx.beginPath();
              bCtx.moveTo(18, 20); bCtx.lineTo(46, 20);
              bCtx.quadraticCurveTo(52, 50, 48, 88);
              bCtx.lineTo(16, 88);
              bCtx.quadraticCurveTo(12, 50, 18, 20);
              bCtx.closePath();
              bCtx.stroke();
              
              // Royal Seaweed Cape / Symmetrical fins
              bCtx.fillStyle = 'rgba(34, 211, 238, 0.45)'; // cyan translucent
              bCtx.beginPath();
              // Left flowing seaweed cape
              bCtx.moveTo(16, 24);
              bCtx.bezierCurveTo(-2, 35, -4, 75, 14, 85);
              bCtx.bezierCurveTo(8, 70, 6, 40, 16, 24);
              // Right flowing seaweed cape
              bCtx.moveTo(48, 24);
              bCtx.bezierCurveTo(66, 35, 68, 75, 50, 85);
              bCtx.bezierCurveTo(58, 70, 56, 40, 48, 24);
              bCtx.closePath();
              bCtx.fill();
              
              // Flowing seaweed cape strokes
              bCtx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
              bCtx.lineWidth = 1.5;
              bCtx.beginPath();
              bCtx.moveTo(16, 24); bCtx.quadraticCurveTo(2, 50, 14, 85);
              bCtx.moveTo(48, 24); bCtx.quadraticCurveTo(62, 50, 50, 85);
              bCtx.stroke();
              
              // Gold patterns on body (King cross)
              bCtx.strokeStyle = '#fbbf24';
              bCtx.lineWidth = 2;
              bCtx.beginPath();
              bCtx.arc(32, 45, 10, 0, Math.PI*2);
              bCtx.moveTo(32, 35); bCtx.lineTo(32, 55);
              bCtx.moveTo(22, 45); bCtx.lineTo(42, 45);
              bCtx.stroke();
              
              // Glowing emerald gem in the center
              bCtx.fillStyle = '#10b981'; // emerald green
              bCtx.beginPath();
              bCtx.moveTo(32, 40); bCtx.lineTo(36, 45); bCtx.lineTo(32, 50); bCtx.lineTo(28, 45);
              bCtx.closePath();
              bCtx.fill();
              bCtx.strokeStyle = '#34d399';
              bCtx.lineWidth = 1;
              bCtx.stroke();
              
              // Head (white marble and gold)
              const hGrad = bCtx.createRadialGradient(32, 12, 2, 32, 14, 8);
              hGrad.addColorStop(0, '#ffffff');
              hGrad.addColorStop(0.5, '#e0f2fe'); // light sky blue
              hGrad.addColorStop(1, '#0284c7');
              bCtx.fillStyle = hGrad;
              bCtx.beginPath(); bCtx.arc(32, 12, 8, 0, Math.PI*2); bCtx.fill();
              
              // Gold Crown of Coral Points
              bCtx.fillStyle = '#fbbf24';
              bCtx.beginPath();
              bCtx.moveTo(20, 8);
              bCtx.lineTo(44, 8);
              bCtx.lineTo(42, -2);
              bCtx.lineTo(37, 2);
              bCtx.lineTo(32, -6); // center spire (king cross point)
              bCtx.lineTo(27, 2);
              bCtx.lineTo(22, -2);
              bCtx.closePath();
              bCtx.fill();
              
              // Crown cross detail
              bCtx.strokeStyle = '#fbbf24';
              bCtx.lineWidth = 1.5;
              bCtx.beginPath();
              bCtx.moveTo(32, -9); bCtx.lineTo(32, -5);
              bCtx.moveTo(30, -7); bCtx.lineTo(34, -7);
              bCtx.stroke();
              
              // Glowing gold eyes (King eyes)
              bCtx.fillStyle = '#fef08a';
              bCtx.beginPath(); bCtx.arc(28, 12, 1.8, 0, Math.PI*2); bCtx.fill();
              bCtx.beginPath(); bCtx.arc(36, 12, 1.8, 0, Math.PI*2); bCtx.fill();
              
              // The Golden Trident of Veriss (held on his left side)
              bCtx.fillStyle = '#d97706'; // darker gold staff
              bCtx.fillRect(8, 14, 3, 76); // vertical staff on left side
              bCtx.fillStyle = '#fbbf24'; // bright gold trident head
              bCtx.beginPath();
              // Middle point
              bCtx.moveTo(9.5, -2); bCtx.lineTo(11.5, 6); bCtx.lineTo(7.5, 6); bCtx.closePath(); bCtx.fill();
              // Left point
              bCtx.beginPath();
              bCtx.moveTo(4, 2); bCtx.lineTo(6, 8); bCtx.lineTo(3, 8); bCtx.closePath(); bCtx.fill();
              // Right point
              bCtx.beginPath();
              bCtx.moveTo(15, 2); bCtx.lineTo(16, 8); bCtx.lineTo(13, 8); bCtx.closePath(); bCtx.fill();
              // Crossbar
              bCtx.fillRect(4, 8, 12, 4);
              
              // Gold base plate
              bCtx.fillStyle = '#d97706';
              bCtx.fillRect(12, 88, 40, 6);
              bCtx.fillStyle = '#fbbf24';
              bCtx.fillRect(12, 88, 40, 2);
              
              scene.textures.addCanvas('boss_elegante', bCanvas);
            }

            // Aquatic fish enemy texture
            if (!scene.textures.exists('pez_enemy')) {
              const pezCanvas = document.createElement('canvas');
              pezCanvas.width = 32;
              pezCanvas.height = 32;
              const pezCtx = pezCanvas.getContext('2d');
              
              // Fish body - neon orange oval
              const fGrad = pezCtx.createLinearGradient(4, 16, 28, 16);
              fGrad.addColorStop(0, '#f97316'); // orange
              fGrad.addColorStop(1, '#ef4444'); // red-orange
              pezCtx.fillStyle = fGrad;
              pezCtx.beginPath();
              pezCtx.ellipse(16, 16, 11, 7, 0, 0, Math.PI*2);
              pezCtx.fill();
              
              // Tail fin - fuchsia/pink triangle
              pezCtx.fillStyle = '#ec4899'; // fuchsia
              pezCtx.beginPath();
              pezCtx.moveTo(5, 16);
              pezCtx.lineTo(0, 10);
              pezCtx.lineTo(0, 22);
              pezCtx.closePath();
              pezCtx.fill();
              
              // Dorsal/ventral fins
              pezCtx.fillStyle = '#eab308'; // yellow
              pezCtx.beginPath();
              // top fin
              pezCtx.moveTo(12, 9); pezCtx.quadraticCurveTo(16, 3, 20, 9);
              // bottom fin
              pezCtx.moveTo(12, 23); pezCtx.quadraticCurveTo(16, 29, 20, 23);
              pezCtx.closePath();
              pezCtx.fill();
              
              // Fuchsia stripes
              pezCtx.strokeStyle = '#ec4899';
              pezCtx.lineWidth = 2;
              pezCtx.beginPath();
              pezCtx.moveTo(12, 10); pezCtx.lineTo(10, 22);
              pezCtx.moveTo(17, 9); pezCtx.lineTo(15, 23);
              pezCtx.stroke();
              
              // Eye (large cute cartoon eye)
              pezCtx.fillStyle = '#ffffff';
              pezCtx.beginPath(); pezCtx.arc(22, 13, 3, 0, Math.PI*2); pezCtx.fill();
              pezCtx.fillStyle = '#000000';
              pezCtx.beginPath(); pezCtx.arc(23, 13, 1.2, 0, Math.PI*2); pezCtx.fill();
              
              scene.textures.addCanvas('pez_enemy', pezCanvas);
            }

            // Aquatic jellyfish enemy texture
            if (!scene.textures.exists('medusa_enemy')) {
              const jCanvas = document.createElement('canvas');
              jCanvas.width = 32;
              jCanvas.height = 32;
              const jCtx = jCanvas.getContext('2d');
              
              // Tentacles - yellow wavy lines
              jCtx.strokeStyle = '#eab308';
              jCtx.lineWidth = 1.5;
              for (let i = 0; i < 4; i++) {
                const tx = 9 + i * 4.5;
                jCtx.beginPath();
                jCtx.moveTo(tx, 16);
                jCtx.quadraticCurveTo(tx - 2, 22, tx, 28);
                jCtx.stroke();
              }
              
              // Translucent pink dome
              const dGrad = jCtx.createRadialGradient(16, 12, 1, 16, 12, 10);
              dGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
              dGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.8)'); // purple
              dGrad.addColorStop(1, 'rgba(236, 72, 153, 0.6)'); // pink
              jCtx.fillStyle = dGrad;
              jCtx.beginPath();
              jCtx.arc(16, 14, 10, Math.PI, 0); // semi-circle
              jCtx.lineTo(26, 16);
              jCtx.quadraticCurveTo(16, 18, 6, 16);
              jCtx.closePath();
              jCtx.fill();
              
              // Electric core highlight
              jCtx.fillStyle = '#34d399'; // glowing mint green core
              jCtx.beginPath();
              jCtx.arc(16, 13, 2.5, 0, Math.PI*2);
              jCtx.fill();
              
              scene.textures.addCanvas('medusa_enemy', jCanvas);
            }
            
            // Wild knight texture (L-jump hazard for level 4)
            if (!scene.textures.exists('wild_knight')) {
              const wkCanvas = document.createElement('canvas');
              wkCanvas.width = 52;
              wkCanvas.height = 48;
              const wkCtx = wkCanvas.getContext('2d');
              
              // Body — robust horse torso
              wkCtx.fillStyle = '#8B4513';
              wkCtx.beginPath();
              wkCtx.ellipse(28, 30, 18, 11, 0, 0, Math.PI*2);
              wkCtx.fill();
              
              // Belly highlight
              wkCtx.fillStyle = '#a0622e';
              wkCtx.beginPath();
              wkCtx.ellipse(28, 33, 12, 5, 0, 0, Math.PI*2);
              wkCtx.fill();
              
              // Neck — shorter, thicker horse neck
              wkCtx.fillStyle = '#7a3b10';
              wkCtx.beginPath();
              wkCtx.moveTo(15, 24);
              wkCtx.quadraticCurveTo(10, 16, 11, 10);
              wkCtx.lineTo(18, 10);
              wkCtx.quadraticCurveTo(18, 16, 22, 24);
              wkCtx.closePath();
              wkCtx.fill();
              
              // Head — horse head, shorter and broader
              wkCtx.fillStyle = '#8B4513';
              wkCtx.beginPath();
              wkCtx.moveTo(11, 10);
              wkCtx.quadraticCurveTo(3, 7, 1, 12);
              wkCtx.quadraticCurveTo(0, 16, 5, 18);
              wkCtx.lineTo(13, 18);
              wkCtx.quadraticCurveTo(17, 17, 18, 11);
              wkCtx.closePath();
              wkCtx.fill();
              
              // Snout — rounded horse muzzle
              wkCtx.fillStyle = '#a0622e';
              wkCtx.beginPath();
              wkCtx.ellipse(4, 15, 6, 5, -0.1, 0, Math.PI*2);
              wkCtx.fill();
              
              // Nostril
              wkCtx.fillStyle = '#3a1f0a';
              wkCtx.beginPath();
              wkCtx.arc(2, 15, 1.3, 0, Math.PI*2);
              wkCtx.fill();
              
              // Mouth line
              wkCtx.strokeStyle = '#3a1f0a';
              wkCtx.lineWidth = 0.8;
              wkCtx.beginPath();
              wkCtx.moveTo(2, 18); wkCtx.lineTo(7, 18);
              wkCtx.stroke();
              
              // Eye — expressive horse eye
              wkCtx.fillStyle = '#fff';
              wkCtx.beginPath(); wkCtx.arc(11, 13, 2.8, 0, Math.PI*2); wkCtx.fill();
              wkCtx.fillStyle = '#000';
              wkCtx.beginPath(); wkCtx.arc(12, 12.5, 1.5, 0, Math.PI*2); wkCtx.fill();
              wkCtx.fillStyle = '#fff';
              wkCtx.beginPath(); wkCtx.arc(12.5, 11.5, 0.6, 0, Math.PI*2); wkCtx.fill();
              
              // Ears — two pointed horse ears
              wkCtx.fillStyle = '#6b3410';
              wkCtx.beginPath();
              wkCtx.moveTo(13, 9); wkCtx.lineTo(12, 3); wkCtx.lineTo(15, 8);
              wkCtx.closePath(); wkCtx.fill();
              wkCtx.beginPath();
              wkCtx.moveTo(9, 9); wkCtx.lineTo(7, 4); wkCtx.lineTo(10, 8);
              wkCtx.closePath(); wkCtx.fill();
              // Inner ear
              wkCtx.fillStyle = '#d4a06a';
              wkCtx.beginPath();
              wkCtx.moveTo(13, 9); wkCtx.lineTo(12.5, 5); wkCtx.lineTo(14, 8.5);
              wkCtx.closePath(); wkCtx.fill();
              
              // Mane — thick flowing mane
              wkCtx.fillStyle = '#2a1508';
              wkCtx.beginPath();
              wkCtx.moveTo(16, 8);
              wkCtx.quadraticCurveTo(20, 3, 24, 10);
              wkCtx.quadraticCurveTo(26, 6, 28, 14);
              wkCtx.quadraticCurveTo(30, 10, 31, 17);
              wkCtx.quadraticCurveTo(27, 14, 23, 20);
              wkCtx.quadraticCurveTo(20, 16, 17, 15);
              wkCtx.closePath();
              wkCtx.fill();
              // Mane highlight
              wkCtx.fillStyle = '#3a1f0a';
              wkCtx.beginPath();
              wkCtx.moveTo(17, 10);
              wkCtx.quadraticCurveTo(21, 6, 24, 11);
              wkCtx.quadraticCurveTo(26, 8, 27, 13);
              wkCtx.quadraticCurveTo(24, 11, 21, 14);
              wkCtx.closePath();
              wkCtx.fill();
              
              // Legs — 4 horse legs
              wkCtx.fillStyle = '#6b3410';
              wkCtx.fillRect(20, 38, 4, 8);
              wkCtx.fillRect(26, 39, 4, 7);
              wkCtx.fillRect(31, 38, 4, 8);
              wkCtx.fillRect(37, 39, 4, 7);
              
              // Hooves
              wkCtx.fillStyle = '#1a0a04';
              wkCtx.fillRect(19, 44, 5, 3);
              wkCtx.fillRect(25, 44, 5, 3);
              wkCtx.fillRect(30, 44, 5, 3);
              wkCtx.fillRect(36, 44, 5, 3);
              
              // Tail — flowing horse tail
              wkCtx.fillStyle = '#2a1508';
              wkCtx.beginPath();
              wkCtx.moveTo(44, 26);
              wkCtx.quadraticCurveTo(50, 20, 49, 28);
              wkCtx.quadraticCurveTo(51, 32, 48, 36);
              wkCtx.quadraticCurveTo(50, 40, 46, 42);
              wkCtx.quadraticCurveTo(47, 28, 42, 24);
              wkCtx.closePath();
              wkCtx.fill();
              // Tail highlight
              wkCtx.fillStyle = '#3a1f0a';
              wkCtx.beginPath();
              wkCtx.moveTo(44, 27);
              wkCtx.quadraticCurveTo(48, 24, 47, 30);
              wkCtx.quadraticCurveTo(48, 34, 46, 36);
              wkCtx.quadraticCurveTo(46, 30, 43, 26);
              wkCtx.closePath();
              wkCtx.fill();
              
              // Red hazard glow
              wkCtx.fillStyle = 'rgba(255,30,15,0.35)';
              wkCtx.beginPath(); wkCtx.arc(26, 24, 23, 0, Math.PI*2); wkCtx.fill();
              
              scene.textures.addCanvas('wild_knight', wkCanvas);
            }
          }
          
          // 1. Triple Parallax magical background
          scene.bg = scene.add.tileSprite(0, 0, levelDef.worldWidth, 450, 'background').setOrigin(0, 0);
          scene.bg.setAlpha(0.85);
          scene.bg.setScrollFactor(0.05); // Far sky scrolls extremely slowly!
          
          scene.bgMid = scene.add.tileSprite(0, 0, levelDef.worldWidth, 450, 'bg_middle').setOrigin(0, 0);
          scene.bgMid.setAlpha(0.65);
          scene.bgMid.setScrollFactor(0.15); // Middle mountains scroll at medium speed!

          scene.bgFg = scene.add.tileSprite(0, 0, levelDef.worldWidth, 450, 'bg_foreground').setOrigin(0, 0);
          scene.bgFg.setAlpha(0.50);
          scene.bgFg.setScrollFactor(0.3); // Foreground decorations scroll faster for depth

          // Ambient atmospheric particles per biome
          scene.ambientParticles = [];
          if (biome === 'grass') {
            // Floating magical sparkles drifting upward
            const ambEmitter = scene.add.particles(0, 0, 'sparkle', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 100, max: 420 },
              speed: { min: 3, max: 15 },
              angle: { min: 250, max: 290 },
              scale: { start: 0.35, end: 0 },
              alpha: { start: 0.3, end: 0 },
              lifespan: { min: 3000, max: 6000 },
              frequency: 400,
              quantity: 1,
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'neon') {
            // Floating digital particles drifting up
            const ambEmitter = scene.add.particles(0, 0, 'sparkle_purple', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 80, max: 400 },
              speed: { min: 5, max: 20 },
              angle: { min: 260, max: 280 },
              scale: { start: 0.4, end: 0.05 },
              alpha: { start: 0.25, end: 0 },
              lifespan: { min: 2500, max: 5000 },
              frequency: 350,
              quantity: 1,
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'prairie') {
            // Floating pollen/leaves in the air
            const ambEmitter = scene.add.particles(0, 0, 'sparkle', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 60, max: 380 },
              speed: { min: 2, max: 8 },
              angle: { min: 240, max: 300 },
              scale: { start: 0.25, end: 0 },
              alpha: { start: 0.2, end: 0 },
              lifespan: { min: 4000, max: 8000 },
              frequency: 600,
              quantity: 1,
              tint: [0xfacc15, 0x4ade80, 0xffffff],
              blendMode: 'NORMAL'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'dragon') {
            // Green smoke and ember particles
            const ambEmitter = scene.add.particles(0, 0, 'sparkle', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 200, max: 400 },
              speed: { min: 4, max: 18 },
              angle: { min: 250, max: 290 },
              scale: { start: 0.4, end: 0 },
              alpha: { start: 0.2, end: 0 },
              lifespan: { min: 2000, max: 4500 },
              frequency: 300,
              quantity: 1,
              tint: [0x22c55e, 0x4ade80, 0x166534],
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'clockwork') {
            // Tiny floating gear sparks
            const ambEmitter = scene.add.particles(0, 0, 'sparkle', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 80, max: 380 },
              speed: { min: 2, max: 10 },
              angle: { min: 250, max: 290 },
              scale: { start: 0.3, end: 0 },
              alpha: { start: 0.2, end: 0 },
              lifespan: { min: 3000, max: 5500 },
              frequency: 500,
              quantity: 1,
              tint: [0xfbbf24, 0xd4b84c, 0xc9a84c],
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'castle') {
            // Floating golden coronation sparkles
            const ambEmitter = scene.add.particles(0, 0, 'sparkle', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 60, max: 380 },
              speed: { min: 3, max: 12 },
              angle: { min: 240, max: 300 },
              scale: { start: 0.35, end: 0 },
              alpha: { start: 0.25, end: 0 },
              lifespan: { min: 3000, max: 6000 },
              frequency: 350,
              quantity: 1,
              tint: [0xfbbf24, 0xfef3c7, 0xf59e0b],
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          } else if (biome === 'river') {
            // Floating water bubbles drifting upward slowly
            const ambEmitter = scene.add.particles(0, 0, 'sparkle_cyan', {
              x: { min: 0, max: levelDef.worldWidth },
              y: { min: 100, max: 430 },
              speed: { min: 4, max: 15 },
              angle: { min: 260, max: 280 }, // straight up
              scale: { start: 0.3, end: 0.05 },
              alpha: { start: 0.2, end: 0 },
              lifespan: { min: 4000, max: 7000 },
              frequency: 250, // frequent bubbles
              quantity: 1,
              blendMode: 'ADD'
            });
            ambEmitter.setDepth(0);
            ambEmitter.setScrollFactor(0.3);
            scene.ambientParticles.push(ambEmitter);
          }

          // 2. Physics Static Platforms Group
          scene.platforms = scene.physics.add.staticGroup();

          platformsData.forEach(p => {
            const block = scene.add.graphics();
            
            if (p.x === 1850 || (biome === 'clockwork' && p.x === 1580)) {
              // Highly detailed ceremonial runway / trophy podium
              if (biome === 'clockwork') {
                // Dark brass trophy podium
                block.fillStyle(0x2a1f14, 0.95);
                block.fillRect(p.x, p.y, p.w, p.h);
                block.fillStyle(0x3d2e1a, 0.6);
                block.fillRect(p.x, p.y, p.w, p.h / 2);
                block.fillStyle(0xb8963c, 1);
                block.fillRect(p.x, p.y, p.w, 4);
                block.fillStyle(0xd4b84c, 0.7);
                block.fillRect(p.x, p.y, p.w, 1);
                block.fillStyle(0xc9a84c, 0.3);
                for (let x = p.x; x < p.x + p.w; x += 28) {
                  block.fillRect(x, p.y + 4, 14, 14);
                  block.fillRect(x + 14, p.y + 18, 14, 14);
                }
                block.fillStyle(0xe2c868, 0.35);
                for (let i = 0; i < 25; i++) {
                  block.fillRect(p.x + 4 + Math.random()*(p.w-8), p.y + 6 + Math.random()*(p.h-8), Math.random()*2+1, Math.random()*2+1);
                }
                block.lineStyle(2, 0xb8963c, 0.85);
                block.strokeRect(p.x, p.y, p.w, p.h);
                block.lineStyle(1, 0xd4b84c, 0.4);
                block.strokeRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              } else {
              // Marble base gradient effect
              block.fillStyle(0xf1f5f9, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0xe2e8f0, 0.6);
              block.fillRect(p.x, p.y, p.w, p.h / 2);
              
              // Thick gold top border
              block.fillStyle(0xfacc15, 1);
              block.fillRect(p.x, p.y, p.w, 4);
              block.fillStyle(0xfef08a, 0.7);
              block.fillRect(p.x, p.y, p.w, 1);
              
              // 3D gold checkered plates on marble face
              block.fillStyle(0xfef08a, 0.35);
              for (let x = p.x; x < p.x + p.w; x += 32) {
                block.fillRect(x, p.y + 4, 16, 16);
                block.fillRect(x + 16, p.y + 20, 16, 16);
              }
              
              // Gold glitter specks scattered across
              block.fillStyle(0xfef08a, 0.45);
              for (let i = 0; i < 30; i++) {
                const gx = p.x + 4 + Math.random() * (p.w - 8);
                const gy = p.y + 6 + Math.random() * (p.h - 8);
                block.fillRect(gx, gy, Math.random() * 2 + 1, Math.random() * 2 + 1);
              }
              
              // Glowing gold outline
              block.lineStyle(2, 0xfacc15, 0.85);
              block.strokeRect(p.x, p.y, p.w, p.h);
              block.lineStyle(1, 0xfef08a, 0.4);
              block.strokeRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              } // end inner else (marble)
            } else if (biome === 'clockwork') {
              // Clockwork mechanical brass/copper platform
              block.fillStyle(0x3d2e1a, 0.9);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x4a3822, 0.5);
              block.fillRect(p.x, p.y + 2, p.w, p.h - 4);
              block.fillStyle(0xb8963c, 0.6);
              block.fillRect(p.x, p.y, p.w, 5);
              block.fillStyle(0xd4b84c, 0.4);
              block.fillRect(p.x, p.y, p.w, 2);
              block.fillStyle(0x8a6d2f, 0.35);
              for (let gx = p.x + 3; gx < p.x + p.w - 4; gx += 8) {
                block.fillRect(gx, p.y - 3, 4, 4);
              }
              block.fillStyle(0x6b5328, 0.3);
              for (let rx = p.x + 8; rx < p.x + p.w - 8; rx += 20) {
                block.fillRect(rx, p.y + 7, 3, 3);
                block.fillRect(rx, p.y + p.h - 8, 3, 3);
              }
              block.fillStyle(0x8a7530, 0.15);
              block.fillRect(p.x + 2, p.y + 5, p.w - 4, 1);
              block.lineStyle(1.5, 0x6b5328, 0.8);
              block.strokeRect(p.x, p.y, p.w, p.h);
            } else if (biome === 'neon') {
              // Neon crystal obsidian platforms — dark purple with glowing edges
              block.fillStyle(0x0a0025, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x120835, 0.6);
              block.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              // Neon purple glowing top edge
              block.fillStyle(0x8b5cf6, 0.65);
              block.fillRect(p.x, p.y, p.w, 4);
              block.fillStyle(0xc084fc, 0.45);
              block.fillRect(p.x, p.y, p.w, 1.5);
              // Circuit-like diagonal lines
              block.lineStyle(1, 0x7c3aed, 0.25);
              for (let lx = p.x + 8; lx < p.x + p.w - 8; lx += 24) {
                block.beginPath();
                block.moveTo(lx, p.y + 6);
                block.lineTo(lx + 12, p.y + p.h - 4);
                block.strokePath();
                block.beginPath();
                block.moveTo(lx + 6, p.y + p.h - 4);
                block.lineTo(lx + 18, p.y + 6);
                block.strokePath();
              }
              // Glowing dots along the edge
              block.fillStyle(0xc084fc, 0.5);
              for (let dx = p.x + 6; dx < p.x + p.w - 6; dx += 14) {
                block.fillRect(dx, p.y + 2, 3, 3);
              }
              // Crystal facets
              block.fillStyle(0x4c1d95, 0.25);
              for (let fx = p.x + 4; fx < p.x + p.w - 8; fx += 20) {
                block.fillRect(fx, p.y + 8, 8, 8);
                block.fillRect(fx + 10, p.y + 18, 6, 6);
              }
              block.lineStyle(1.5, 0x7c3aed, 0.6);
              block.strokeRect(p.x, p.y, p.w, p.h);
              block.lineStyle(1, 0xa78bfa, 0.2);
              block.strokeRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
            } else if (biome === 'prairie') {
              // Wooden planks — warm rustic stable style
              block.fillStyle(0x5c3a1e, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x6B4226, 0.6);
              block.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              // Top edge highlight
              block.fillStyle(0x8B6914, 0.7);
              block.fillRect(p.x, p.y, p.w, 4);
              block.fillStyle(0xa0782c, 0.5);
              block.fillRect(p.x, p.y, p.w, 1.5);
              // Horizontal plank lines
              block.fillStyle(0x3a1f0a, 0.35);
              block.fillRect(p.x, p.y + p.h / 2 - 1, p.w, 2);
              block.fillRect(p.x, p.y + p.h * 0.75 - 1, p.w, 1.5);
              // Vertical wood grain lines
              block.fillStyle(0x4a2a10, 0.2);
              for (let gx = p.x + 6; gx < p.x + p.w - 4; gx += 12) {
                block.fillRect(gx, p.y + 5, 1, p.h - 8);
              }
              // Nail dots at corners
              block.fillStyle(0x1a0a04, 0.5);
              const nailSize = 2.5;
              const nailMargin = 10;
              block.fillRect(p.x + nailMargin, p.y + nailMargin - 2, nailSize, nailSize);
              block.fillRect(p.x + p.w - nailMargin - nailSize, p.y + nailMargin - 2, nailSize, nailSize);
              block.fillStyle(0x8B6914, 0.4);
              block.fillRect(p.x + nailMargin + 0.5, p.y + nailMargin - 1.5, 1.5, 1.5);
              block.fillRect(p.x + p.w - nailMargin - nailSize + 0.5, p.y + nailMargin - 1.5, 1.5, 1.5);
              block.lineStyle(1.5, 0x3a1f0a, 0.6);
              block.strokeRect(p.x, p.y, p.w, p.h);
              block.lineStyle(1, 0x8B6914, 0.2);
              block.strokeRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
            } else if (biome === 'dragon') {
              // Dragon biome — emerald scale platforms
              block.fillStyle(0x0a1510, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x0d2018, 0.5);
              block.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              // Green glowing top edge
              block.fillStyle(0x22c55e, 0.55);
              block.fillRect(p.x, p.y, p.w, 5);
              block.fillStyle(0x4ade80, 0.4);
              block.fillRect(p.x, p.y, p.w, 2);
              // Scale pattern
              block.fillStyle(0x166534, 0.2);
              for (let sx = p.x + 4; sx < p.x + p.w - 6; sx += 22) {
                block.fillCircle(sx + 11, p.y + 10, 8);
              }
              // Emerald gem specks
              block.fillStyle(0x4ade80, 0.2);
              for (let i=0;i<14;i++){
                block.fillRect(p.x+6+Math.random()*(p.w-12),p.y+6+Math.random()*(p.h-10),2,2);
              }
              // Glow bevel
              block.fillStyle(0x4ade80, 0.1);
              block.fillRect(p.x+2,p.y+6,p.w-4,1);
              block.lineStyle(1.5,0x0d4020,0.6);
              block.strokeRect(p.x,p.y,p.w,p.h);
            } else if (biome === 'castle') {
              // Castle biome — golden marble platforms fit for a coronation
              block.fillStyle(0x1a1025, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x2d1050, 0.5);
              block.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              // Rich golden top edge
              block.fillStyle(0xfbbf24, 0.75);
              block.fillRect(p.x, p.y, p.w, 5);
              block.fillStyle(0xfef3c7, 0.55);
              block.fillRect(p.x, p.y, p.w, 2);
              // Checkered golden marble pattern
              block.fillStyle(0xfbbf24, 0.2);
              for (let cx = p.x + 4; cx < p.x + p.w - 4; cx += 24) {
                block.fillRect(cx, p.y + 6, 12, 10);
                block.fillRect(cx + 12, p.y + 16, 12, 10);
              }
              // Golden sparkle specks
              block.fillStyle(0xfef3c7, 0.35);
              for (let i = 0; i < 18; i++) {
                block.fillRect(p.x + 6 + Math.random() * (p.w - 12), p.y + 8 + Math.random() * (p.h - 16), 1.5, 1.5);
              }
              // Purple gem inlays along the body
              block.fillStyle(0xa855f7, 0.25);
              for (let gx = p.x + 10; gx < p.x + p.w - 10; gx += 40) {
                block.fillRect(gx, p.y + p.h / 2 - 3, 4, 6);
                block.fillStyle(0xc084fc, 0.2);
                block.fillRect(gx + 1, p.y + p.h / 2 - 2, 2, 4);
                block.fillStyle(0xa855f7, 0.25);
              }
              // Golden bevel highlight
              block.fillStyle(0xfef3c7, 0.12);
              block.fillRect(p.x + 2, p.y + 6, p.w - 4, 1);
              block.lineStyle(1.5, 0x92400e, 0.7);
              block.strokeRect(p.x, p.y, p.w, p.h);
            } else if (biome === 'river') {
              // River/Reef biome — organic reef rocks with bumpy edges (OPTIMIZED)
              block.fillStyle(0x0a2540, 0.98); // Deep indigo dark base
              
              // Draw main base body
              block.fillRect(p.x + 8, p.y + 8, p.w - 16, p.h - 16);
              
              // Draw overlapping circles along the border to create a bumpy rock look (Step increased from 14 to 32)
              const drawBumpyEdge = (color) => {
                block.fillStyle(color);
                
                // Top & bottom edges bumps (Step: 32px, Radius scaled up to 12 + sin*6)
                for (let x = p.x + 10; x <= p.x + p.w - 10; x += 32) {
                  // Top bumps
                  const topR = 12 + (Math.sin(x * 0.03) * 6 + 6);
                  block.fillCircle(x, p.y + 6, topR);
                  // Bottom bumps
                  const botR = 12 + (Math.cos(x * 0.03) * 6 + 6);
                  block.fillCircle(x, p.y + p.h - 6, botR);
                }
                
                // Left & right edges bumps (Step: 32px)
                for (let y = p.y + 10; y <= p.y + p.h - 10; y += 32) {
                  // Left bumps
                  const leftR = 12 + (Math.sin(y * 0.03) * 6 + 6);
                  block.fillCircle(p.x + 6, y, leftR);
                  // Right bumps
                  const rightR = 12 + (Math.cos(y * 0.03) * 6 + 6);
                  block.fillCircle(p.x + p.w - 6, y, rightR);
                }
              };
              
              // Draw base dark bumps
              drawBumpyEdge(0x0a2540);
              
              // Draw lighter inner core bumps for 3D depth
              block.fillStyle(0x0f3e6a); // Mid-tone reef blue
              block.fillRect(p.x + 12, p.y + 12, p.w - 24, p.h - 24);
              
              // Draw overlapping inner mid-tone bumps (Step increased from 18 to 36, Radius to 10 + sin*4)
              for (let x = p.x + 16; x <= p.x + p.w - 16; x += 36) {
                const r1 = 10 + (Math.sin(x * 0.05) * 4 + 4);
                block.fillCircle(x, p.y + 10, r1);
                block.fillCircle(x, p.y + p.h - 10, r1);
              }
              for (let y = p.y + 16; y <= p.y + p.h - 16; y += 36) {
                const r2 = 10 + (Math.cos(y * 0.05) * 4 + 4);
                block.fillCircle(p.x + 10, y, r2);
                block.fillCircle(p.x + p.w - 10, y, r2);
              }
              
              // Draw vivid pink coral cover dynamically
              block.fillStyle(0xdb2777); // Deep pink
              block.fillStyle(0xf472b6); // Bright pink highlights
              
              // For ceiling blocks (y <= 90), draw coral hanging from bottom (Step increased from 14 to 32)
              if (p.y <= 90) {
                block.fillStyle(0xdb2777);
                block.fillRect(p.x, p.y + p.h - 6, p.w, 6);
                
                block.fillStyle(0xf472b6);
                const bumpCount = Math.max(3, Math.floor(p.w / 32));
                for (let i = 0; i < bumpCount; i++) {
                  const bx = p.x + (i + 0.5) * (p.w / bumpCount);
                  const by = p.y + p.h - 3;
                  const br = 8 + (i % 3) * 5;
                  block.fillCircle(bx, by, br);
                  
                  // Add light highlight dot
                  block.fillStyle(0xfce7f3);
                  block.fillCircle(bx - 3, by - 2, br * 0.35);
                  block.fillStyle(0xf472b6);
                }
              } else {
                // Ground rocks, stalagmites, and floating boulders: coral sits on top (Step increased from 14 to 32)
                block.fillStyle(0xdb2777);
                block.fillRect(p.x, p.y, p.w, 6);
                
                block.fillStyle(0xf472b6);
                const bumpCount = Math.max(3, Math.floor(p.w / 32));
                for (let i = 0; i < bumpCount; i++) {
                  const bx = p.x + (i + 0.5) * (p.w / bumpCount);
                  const by = p.y + 3;
                  const br = 8 + (i % 3) * 5;
                  block.fillCircle(bx, by, br);
                  
                  // Add light highlight dot
                  block.fillStyle(0xfce7f3);
                  block.fillCircle(bx - 3, by - 2, br * 0.35);
                  block.fillStyle(0xf472b6);
                }
              }
              
              // Crevices and rock surface shading lines
              block.lineStyle(1.5, 0x051b30, 0.7); // Dark crevice lines
              for (let i = 0; i < Math.max(1, Math.floor(p.w / 60)); i++) {
                const cx1 = p.x + 20 + i * 50;
                const cy1 = p.y + 15;
                const cx2 = cx1 + (i % 2 === 0 ? 10 : -10);
                const cy2 = p.y + p.h - 15;
                
                block.beginPath();
                block.moveTo(cx1, cy1);
                block.lineTo(cx2, cy2);
                block.strokePath();
              }
              
              // Small details: yellow starfish on sides
              block.fillStyle(0xfacc15); // Yellow starfish
              if (p.w > 40 && p.h > 40) {
                const sfx1 = p.x + 20 + Math.random() * (p.w - 40);
                const sfy1 = p.y + 20 + Math.random() * (p.h - 40);
                block.fillRect(sfx1, sfy1, 4, 4);
                block.fillRect(sfx1 - 2, sfy1 + 1, 8, 2);
                block.fillRect(sfx1 + 1, sfy1 - 2, 2, 8);
              }
              
              // Cyan glow frame (soft neon water outline)
              block.lineStyle(1.8, 0x06b6d4, 0.85);
              block.strokeRoundedRect(p.x, p.y, p.w, p.h, 6);
            } else {
              // Grass biome — rich earth platforms with lush grass top
              block.fillStyle(0x4a3728, 0.95);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x5c4535, 0.5);
              block.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
              // Dark soil bottom layer
              block.fillStyle(0x2d1f14, 0.3);
              block.fillRect(p.x, p.y + p.h - 8, p.w, 8);
              // Rich green grass top
              block.fillStyle(0x4ade80, 0.7);
              block.fillRect(p.x, p.y, p.w, 5);
              block.fillStyle(0x86efac, 0.5);
              block.fillRect(p.x, p.y, p.w, 2);
              // Darker green base under grass
              block.fillStyle(0x22c55e, 0.45);
              block.fillRect(p.x, p.y + 4, p.w, 3);
              // Grass tufts along top
              for (let gx = p.x + 3; gx < p.x + p.w - 3; gx += 5) {
                const bh = 3 + (Math.sin(gx * 0.7) * 0.5 + 0.5) * 4;
                const bw = 1.2 + Math.random() * 0.8;
                block.fillStyle(0x4ade80, 0.5);
                block.fillRect(gx, p.y - bh, bw, bh);
                if (Math.random() > 0.5) {
                  block.fillStyle(0x22c55e, 0.4);
                  block.fillRect(gx + 1.5, p.y - bh * 0.7, bw * 0.7, bh * 0.6);
                }
              }
              // Tiny random flowers
              for (let fx = p.x + 8; fx < p.x + p.w - 8; fx += 22 + Math.random() * 18) {
                if (Math.random() > 0.45) {
                  block.fillStyle([
                    0xfacc15, 0xf472b6, 0x60a5fa, 0xffffff
                  ][Math.floor(Math.random() * 4)], 0.6);
                  block.fillRect(fx, p.y - 3, 2, 2);
                  block.fillRect(fx - 1, p.y - 2, 4, 1);
                }
              }
              // Soil texture specks
              block.fillStyle(0x6b5340, 0.2);
              for (let i = 0; i < 20; i++) {
                block.fillRect(p.x + 6 + Math.random() * (p.w - 12), p.y + 8 + Math.random() * (p.h - 16), 1.5, 1.5);
              }
              // Light bevel top
              block.fillStyle(0x86efac, 0.12);
              block.fillRect(p.x + 2, p.y + 6, p.w - 4, 1);
              block.lineStyle(1.5, 0x3d2e1a, 0.7);
              block.strokeRect(p.x, p.y, p.w, p.h);
            }

            // Generate physics body
            scene.physics.add.existing(block, true);
            block.body.setSize(p.w, p.h);
            block.body.setOffset(p.x, p.y);
            scene.physics.world.staticTree.remove(block.body);
            scene.physics.world.staticTree.insert(block.body);
            
            scene.platforms.add(block);
          });

          // Dragon ground — oscillating serpent body segments (level 6)
          scene.dragonSegments = [];
          if (biome === 'dragon' && levelDef.dragonGround) {
            const dg = levelDef.dragonGround;
            // Generate dragon segment texture with scales and spines
            if (!scene.textures.exists('dragon-seg')) {
              const dsCanvas = document.createElement('canvas');
              dsCanvas.width = dg.segmentW; dsCanvas.height = dg.segmentH + dg.amplitude * 2 + 20;
              const dsc = dsCanvas.getContext('2d');
              const ch = dsCanvas.height, cw = dsCanvas.width;
              // Dark dragon body base
              const bodyGrad = dsc.createLinearGradient(0, 0, 0, ch);
              bodyGrad.addColorStop(0, '#0a2015');
              bodyGrad.addColorStop(0.3, '#0d2a1c');
              bodyGrad.addColorStop(0.7, '#081a10');
              bodyGrad.addColorStop(1, '#05100a');
              dsc.fillStyle = bodyGrad;
              dsc.fillRect(0, 0, cw, ch);
              // Hexagonal scale pattern
              dsc.strokeStyle = 'rgba(22,163,74,0.25)';
              dsc.lineWidth = 0.6;
              for (let row = 0; row < 8; row++) {
                const offsetX = (row % 2) * 7;
                for (let col = -1; col < cw/14 + 1; col++) {
                  const cx = col * 14 + offsetX + 7;
                  if (cx < -10 || cx > cw + 10) continue;
                  const cy = 8 + row * 10;
                  dsc.beginPath();
                  for (let p = 0; p < 6; p++) {
                    const a = p * Math.PI / 3 - Math.PI / 2;
                    const px = cx + Math.cos(a) * 7;
                    const py = cy + Math.sin(a) * 5;
                    if (p === 0) dsc.moveTo(px, py);
                    else dsc.lineTo(px, py);
                  }
                  dsc.closePath();
                  dsc.stroke();
                }
              }
              // Spine ridges (dorsal spikes on top)
              dsc.fillStyle = '#166534';
              for (let sx = 4; sx < cw - 4; sx += 12) {
                dsc.beginPath();
                dsc.moveTo(sx - 4, 4);
                dsc.lineTo(sx + 1, -2);
                dsc.lineTo(sx + 6, 4);
                dsc.closePath();
                dsc.fill();
              }
              // Highlight spine tips
              dsc.fillStyle = 'rgba(74,222,128,0.6)';
              for (let sx = 4; sx < cw - 4; sx += 12) {
                dsc.beginPath();
                dsc.arc(sx + 1, 0, 2, 0, Math.PI * 2);
                dsc.fill();
              }
              // Glowing green edge on top
              dsc.fillStyle = 'rgba(34,197,94,0.4)';
              dsc.fillRect(0, 0, cw, 2);
              dsc.fillStyle = 'rgba(74,222,128,0.2)';
              dsc.fillRect(0, 2, cw, 2);
              // Bottom shadow
              dsc.fillStyle = 'rgba(0,0,0,0.3)';
              dsc.fillRect(0, ch - 3, cw, 3);
              // Occasional bright emerald gems embedded in scales
              dsc.fillStyle = 'rgba(74,222,128,0.45)';
              for (let i = 0; i < 6; i++) {
                const gx = 8 + Math.floor(Math.random() * (cw - 16));
                const gy = 5 + Math.floor(Math.random() * (ch - 10));
                dsc.beginPath();
                dsc.arc(gx, gy, 2, 0, Math.PI * 2);
                dsc.fill();
                dsc.fillStyle = 'rgba(255,255,255,0.3)';
                dsc.beginPath();
                dsc.arc(gx - 0.5, gy - 0.5, 0.8, 0, Math.PI * 2);
                dsc.fill();
                dsc.fillStyle = 'rgba(74,222,128,0.45)';
              }
              scene.textures.addCanvas('dragon-seg', dsCanvas);
            }
            // Create segments as sprites
            for (let s = 0; s < dg.segments; s++) {
              const segX = s * dg.segmentW + dg.segmentW/2;
              const seg = scene.physics.add.staticSprite(segX, dg.baseY, 'dragon-seg');
              seg.body.setSize(dg.segmentW, dg.segmentH);
              seg.body.setOffset(0, dg.amplitude + 10);
              seg.setDepth(3);
              scene.dragonSegments.push({ sprite: seg, baseY: dg.baseY, index: s });
            }
          }

          // 3. Create Player (Martina using the actual cuento illustration!)
          scene.player = scene.physics.add.sprite(80, 200, 'player');
          scene.player.setCollideWorldBounds(true);
          if (biome === 'river') {
            scene.player.setSize(44, 26);
            scene.player.setOffset(-6, 11);
          } else {
            scene.player.setSize(26, 44);
            scene.player.setOffset(10, 8);
          }
          // Scale her illustration down to fit the platform grids perfectly
          scene.player.setDisplaySize(38, 56);
          if (biome === 'river') {
            scene.player.body.setGravityY(-550); // net gravity = 150 (very floaty!)
          } else {
            scene.player.body.setGravityY(100); // stable arcade physics gravity
          }
          scene.player.invincibility = 0;
          scene.player.wasOnGround = true;
          scene.player.landingSquashTimer = 0;
          scene.player.doubleJumpAvailable = true;
          scene.player.jumpKeyDebounce = 0;
          scene.player.dashAvailable = true;
          scene.player.isDashing = false;
          scene.player.dashTimer = 0;
          scene.player.dashCooldown = 0;
          
          self.player = scene.player;

          // Dragon ground colliders — must be after player creation
          if (scene.dragonSegments && scene.dragonSegments.length > 0) {
            scene.dragonSegments.forEach(seg => {
              scene.physics.add.collider(scene.player, seg.sprite);
            });
          }
          // Fire pillars — erupt from dragon ground (level 6)
          scene.firePillars = [];
          if (biome === 'dragon' && levelDef.firePillars) {
            // Create flame texture
            if (!scene.textures.exists('flame-pillar')) {
              const fc = document.createElement('canvas');
              fc.width = 24; fc.height = 80;
              const fctx = fc.getContext('2d');
              // Flame shape — tall teardrop with flickering edges
              const flameGrad = fctx.createLinearGradient(12, 0, 12, 80);
              flameGrad.addColorStop(0, 'rgba(255,251,100,1)');   // bright yellow top
              flameGrad.addColorStop(0.15, 'rgba(252,211,40,1)');  // yellow
              flameGrad.addColorStop(0.4, 'rgba(249,158,26,1)');   // orange
              flameGrad.addColorStop(0.7, 'rgba(34,197,94,1)');   // green base
              flameGrad.addColorStop(1, 'rgba(16,80,40,0.8)');    // dark green
              fctx.fillStyle = flameGrad;
              fctx.beginPath();
              fctx.moveTo(12, 0);
              fctx.bezierCurveTo(4, 18, 2, 40, 3, 58);
              fctx.bezierCurveTo(2, 68, 5, 74, 8, 80);
              fctx.lineTo(16, 80);
              fctx.bezierCurveTo(19, 74, 22, 68, 21, 58);
              fctx.bezierCurveTo(22, 40, 20, 18, 12, 0);
              fctx.closePath();
              fctx.fill();
              // Inner hotter core
              const coreGrad = fctx.createLinearGradient(12, 2, 12, 60);
              coreGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
              coreGrad.addColorStop(0.2, 'rgba(255,240,150,0.7)');
              coreGrad.addColorStop(0.5, 'rgba(252,180,60,0.5)');
              coreGrad.addColorStop(1, 'rgba(34,197,94,0)');
              fctx.fillStyle = coreGrad;
              fctx.beginPath();
              fctx.moveTo(12, 3);
              fctx.bezierCurveTo(8, 18, 7, 35, 8, 48);
              fctx.bezierCurveTo(7, 54, 9, 58, 11, 62);
              fctx.lineTo(13, 62);
              fctx.bezierCurveTo(15, 58, 17, 54, 16, 48);
              fctx.bezierCurveTo(17, 35, 16, 18, 12, 3);
              fctx.closePath();
              fctx.fill();
              // White-hot tip
              fctx.fillStyle = 'rgba(255,255,255,0.6)';
              fctx.beginPath();
              fctx.arc(12, 8, 5, 0, Math.PI*2);
              fctx.fill();
              scene.textures.addCanvas('flame-pillar', fc);
            }
            levelDef.firePillars.forEach(fp => {
              const pillar = scene.physics.add.sprite(fp.x, 500, 'flame-pillar');
              pillar.setDisplaySize(22, 60);
              pillar.setDepth(4);
              pillar.setAlpha(0);
              pillar.body.setSize(14, 50);
              pillar.body.setOffset(5, 15);
              pillar.body.allowGravity = false;
              pillar.fireData = fp;
              pillar.fireTimer = fp.offset || 0;
              pillar.fireActive = false;
              pillar.fireHeight = 0;
              scene.firePillars.push(pillar);
            });
            scene.physics.add.overlap(scene.player, scene.firePillars, (player, pillar) => {
              if (!pillar.fireActive || player.invincibility > 0) return;
              self.lives--;
              player.invincibility = 60;
              player.setTint(0x44ff44);
              scene.time.delayedCall(200, () => { if (player.active) player.clearTint(); });
              self.synthesizeSound('damage');
              document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
              if (self.lives <= 0) { self.stopMusic(); self.gameOver(); }
            });
          }
          scene.lastSafeX = 80; // track last safe position for pit respawn

          // Damage animation helper — red flash, star particles, camera shake
          scene.doDamageAnim = () => {
            const p = scene.player;
            // Red tint flash
            p.setTint(0xff4444);
            scene.time.delayedCall(120, () => {
              if (p.active) p.clearTint();
            });
            // Star-shaped red and white damage particles burst outward
            for (let i = 0; i < 14; i++) {
              const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
              const speed = 80 + Math.random() * 130;
              const size = Math.random() * 2.5 + 1.5;
              const dp = scene.add.circle(p.x, p.y, size, i % 3 === 0 ? 0xffffff : 0xff4444, 0.9);
              scene.physics.add.existing(dp, false);
              dp.body.allowGravity = true;
              dp.body.setGravityY(400);
              dp.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed - 100);
              scene.tweens.add({
                targets: dp,
                alpha: 0,
                scaleX: 0.05,
                scaleY: 0.05,
                duration: 500 + Math.random() * 300,
                ease: 'Quad.easeOut',
                onComplete: () => dp.destroy()
              });
            }
            // Stronger camera shake
            scene.cameras.main.shake(150, 0.008);
            // Brief slow-motion effect
            scene.time.timeScale = 0.6;
            scene.time.delayedCall(120, () => { scene.time.timeScale = 1; });
          };

          // Register procedural animations for Martina (Hollow Knight / Celeste style)
          if (!scene.anims.exists('martina-run')) {
            scene.anims.create({
              key: 'martina-run',
              frames: [
                { key: 'player-run-1' },
                { key: 'player-run-2' },
                { key: 'player-run-3' },
                { key: 'player-run-2' }
              ],
              frameRate: 12,
              repeat: -1
            });
            scene.anims.create({
              key: 'martina-idle',
              frames: [{ key: 'player-idle' }],
              frameRate: 1
            });
            scene.anims.create({
              key: 'martina-jump',
              frames: [{ key: 'player-jump' }],
              frameRate: 1
            });
            scene.anims.create({
              key: 'bishop-fly',
              frames: [
                { key: 'flying_bishop_0' },
                { key: 'flying_bishop_1' }
              ],
              frameRate: 8,
              repeat: -1
            });
          }
          
          // Start with idle animation
          scene.player.play('martina-idle');

          // 4. Magical multi-color Sparkles Particle trail
          scene.particleFrameIdx = 0;
          scene.particleTextures = ['sparkle', 'sparkle_cyan', 'sparkle_purple'];
          scene.particles = scene.add.particles(0, 0, 'sparkle', {
            speed: { min: 10, max: 40 },
            angle: { min: 140, max: 220 },
            scale: { start: 0.85, end: 0.05 },
            alpha: { start: 0.75, end: 0 },
            lifespan: 380,
            frequency: 50,
            quantity: 1,
            blendMode: 'ADD'
          });
          scene.particles.startFollow(scene.player, -10, 16);
          
          // Cycling texture for particle trail (toggle every few frames in update)
          scene.particleFrameCounter = 0;

          scene.coins = scene.physics.add.group({ allowGravity: false, immovable: true });
          coinsData.forEach(c => {
            const coin = scene.add.sprite(c.x, c.y, 'coin_0');
            coin.play('coin-spin');
            coin.setDisplaySize(22, 22);

            scene.coins.add(coin);
            coin.body.setCircle(11, -11, -11);
            coin.body.allowGravity = false;
            coin.body.setImmovable(true);
            
            // Add a floating animation loop to the coins!
            scene.tweens.add({
              targets: coin,
              y: c.y - 6,
              duration: 1200 + Math.random()*400,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          });

          // 6. Chess Peoncito Enemies Group
          scene.enemies = scene.physics.add.group();
          enemiesData.forEach(e => {
            let tex = 'enemy';
            let displayW = 32, displayH = 42;
            let sizeW = 24, sizeH = 34;
            let offX = 4, offY = 4;
            if (biome === 'river') {
              tex = e.type === 'medusa' ? 'medusa_enemy' : 'pez_enemy';
              displayW = 32; displayH = 32;
              sizeW = 24; sizeH = 24;
              offX = 4; offY = 4;
            }
            const enemy = scene.physics.add.sprite(e.x, e.y, tex);
            enemy.setDisplaySize(displayW, displayH);
            enemy.setSize(sizeW, sizeH);
            enemy.setOffset(offX, offY);
            enemy.setCollideWorldBounds(true);
            if (biome === 'river' && e.type === 'medusa') {
              enemy.body.allowGravity = false;
            }
            enemy.leftBound = e.left;
            enemy.rightBound = e.right;
            enemy.speed = e.speed;
            enemy.dead = false;
            enemy.body.setVelocityX(-e.speed);
            
            scene.enemies.add(enemy);
          });

          // 6.4. Airborne Flying Bishop Enemies (complicate jump paths with dynamic patrols!)
          scene.airEnemies = scene.physics.add.group({ allowGravity: false });
          
          const airEnemiesData = levelDef.airEnemiesData || [];
          
          airEnemiesData.forEach(ae => {
            let tex = 'flying_bishop_0';
            let displayW = 28, displayH = 42;
            let sizeW = 22, sizeH = 34;
            if (biome === 'river') {
              tex = 'pez_enemy';
              displayW = 32; displayH = 32;
              sizeW = 24; sizeH = 24;
            }
            const airEnemy = scene.physics.add.sprite(ae.x, ae.y, tex);
            airEnemy.setDisplaySize(displayW, displayH);
            airEnemy.setSize(sizeW, sizeH);
            airEnemy.setOffset(3, 4);
            scene.airEnemies.add(airEnemy);
            airEnemy.body.allowGravity = false;
            airEnemy.body.setImmovable(true);
            
            // Set pattern-specific physics properties
            airEnemy.pattern = ae.pattern;
            airEnemy.speed = ae.speed;
            
            if (ae.pattern === 'horizontal') {
              airEnemy.minX = ae.minX;
              airEnemy.maxX = ae.maxX;
              airEnemy.body.setVelocityX(-ae.speed);
            } else if (ae.pattern === 'diagonal') {
              airEnemy.minX = ae.minX;
              airEnemy.maxX = ae.maxX;
              airEnemy.minY = ae.minY;
              airEnemy.maxY = ae.maxY;
              airEnemy.speedY = ae.speedY;
              airEnemy.body.setVelocity(-ae.speed, -ae.speedY);
            } else if (ae.pattern === 'sinusoidal') {
              airEnemy.minX = ae.minX;
              airEnemy.maxX = ae.maxX;
              airEnemy.baseY = ae.baseY;
              airEnemy.ampY = ae.ampY;
              airEnemy.direction = -1; // -1 = left, 1 = right
              airEnemy.body.setVelocityX(-ae.speed);
            }
            
            // Play wing flapping animation!
            airEnemy.play('bishop-fly');
          });

          // 6.5 Secret Gold Crowns group ( Celeste / Hollow Knight style collectibles )
          const crownsData = levelDef.crownsData || [];

          scene.crowns = scene.physics.add.group({ allowGravity: false, immovable: true });
          crownsData.forEach(c => {
            const crown = scene.add.sprite(c.x, c.y, 'crown_gold');
            crown.setDisplaySize(24, 24);
            scene.crowns.add(crown);
            crown.body.allowGravity = false;
            crown.body.setImmovable(true);
            // Crowns stay static and solemn as requested! No initial float animation.
          });

          // 6.8 Rotating Clockwork Gears (level 2 exclusive mechanic)
          scene.gearGroups = [];
          if (biome === 'clockwork' && levelDef.gearData) {
            levelDef.gearData.forEach((gearDef, gi) => {
              const gx = gearDef.centerX;
              const gy = gearDef.centerY;
              const gearAngle = { val: gi * 45 }; // staggered start angles
              
              // Visual gear sprite (decorative, no physics)
              const gearVis = scene.add.sprite(gx, gy, 'gear_wheel');
              gearVis.setDisplaySize(170, 170);
              gearVis.setDepth(0);
              gearVis.setAlpha(0.5);
              
              // Create tooth platforms around the gear
              const teeth = [];
              const toothW = 28;
              const toothH = 14;
              
              for (let t = 0; t < gearDef.numTeeth; t++) {
                const baseAngle = (t / gearDef.numTeeth) * Math.PI * 2;
                const tx = gx + Math.cos(baseAngle) * gearDef.radius;
                const ty = gy + Math.sin(baseAngle) * gearDef.radius;
                
                const isHazard = gearDef.hazardIndices && gearDef.hazardIndices.includes(t);
                
                // Platform graphic
                const toothGfx = scene.add.graphics();
                if (isHazard) {
                  toothGfx.fillStyle(0x8b2500, 0.9);
                  toothGfx.fillRect(-toothW/2, -toothH/2, toothW, toothH);
                  toothGfx.fillStyle(0xff4444, 0.7);
                  toothGfx.fillRect(-toothW/2, -toothH/2, toothW, 3);
                  // Spiky top
                  toothGfx.fillStyle(0xff6644, 0.6);
                  for (let sx = -toothW/2 + 2; sx < toothW/2; sx += 5) {
                    toothGfx.fillRect(sx, -toothH/2 - 5, 3, 6);
                  }
            } else if (biome === 'neon') {
              // Neon platform — dark crystal with glowing purple edge
              block.fillStyle(0x1a1030, 0.9);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x2d1855, 0.5);
              block.fillRect(p.x, p.y + 2, p.w, p.h - 4);
              // Glowing purple top edge
              block.fillStyle(0x8b5cf6, 0.55);
              block.fillRect(p.x, p.y, p.w, 4);
              block.fillStyle(0xa855f7, 0.4);
              block.fillRect(p.x, p.y, p.w, 1);
              // Diagonal hash pattern
              block.fillStyle(0x6d28d9, 0.15);
              for (let dx = p.x; dx < p.x + p.w; dx += 12) {
                block.fillRect(dx, p.y + 6, 6, 2);
                block.fillRect(dx + 4, p.y + 10, 6, 2);
              }
              block.fillStyle(0x7c3aed, 0.2);
              block.fillRect(p.x + 2, p.y + 5, p.w - 4, 1);
              block.lineStyle(1.5, 0x8b5cf6, 0.7);
              block.strokeRect(p.x, p.y, p.w, p.h);
            } else if (biome === 'prairie') {
              // Prairie platform — warm wood with grass top
              block.fillStyle(0x6B4226, 0.9);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(0x7a4f30, 0.5);
              block.fillRect(p.x, p.y + 2, p.w, p.h - 4);
              // Grass top edge
              block.fillStyle(0x5a8f3c, 0.7);
              block.fillRect(p.x, p.y, p.w, 5);
              block.fillStyle(0x4a7c2e, 0.5);
              block.fillRect(p.x, p.y, p.w, 2);
              // Wood grain lines
              block.fillStyle(0x4a2a15, 0.2);
              for (let wx = p.x + 4; wx < p.x + p.w - 4; wx += 10) {
                block.fillRect(wx, p.y + 7, 2, p.h - 10);
              }
              // Wood knot
              block.fillStyle(0x3a1a0a, 0.15);
              block.fillRect(p.x + p.w/2 - 3, p.y + p.h/2 - 2, 6, 4);
              block.lineStyle(1.5, 0x5c3a1e, 0.7);
              block.strokeRect(p.x, p.y, p.w, p.h);
            } else {
                  toothGfx.fillStyle(0x5c4020, 0.9);
                  toothGfx.fillRect(-toothW/2, -toothH/2, toothW, toothH);
                  toothGfx.fillStyle(0x8a6d2f, 0.7);
                  toothGfx.fillRect(-toothW/2, -toothH/2, toothW, 3);
                }
                toothGfx.lineStyle(1, 0xb8963c, 0.6);
                toothGfx.strokeRect(-toothW/2, -toothH/2, toothW, toothH);
                toothGfx.setDepth(3);
                
                // Physics body
                scene.physics.add.existing(toothGfx, true);
                toothGfx.body.setSize(toothW, toothH);
                toothGfx.body.setOffset(tx - toothW/2, ty - toothH/2);
                
                teeth.push({
                  gfx: toothGfx,
                  baseAngle: baseAngle,
                  isHazard: isHazard
                });
              }
              
              scene.gearGroups.push({
                gx, gy,
                radius: gearDef.radius,
                speed: gearDef.speed,
                angle: gearAngle,
                teeth: teeth,
                visual: gearVis
              });
            });
          }

          // 6.9 Boss System — Alfil Exiliado / El Elegante Veriss
          scene.bossActive = false;
          scene.bossDefeated = false;
          scene.bossRoomActive = false;
          scene.bossHP = 0;
          scene.bossInvincible = 0;
          
          if ((biome === 'neon' || biome === 'river') && levelDef.bossData) {
            const bd = levelDef.bossData;
            
            let bossTex = 'boss_alfil';
            let bossName = 'Alfil Exiliado';
            let barBorderColor = '#8b5cf6';
            let barFillGrad = 'linear-gradient(90deg,#ef4444,#a855f7)';
            let wallGlowColor1 = 0xa855f7;
            let wallGlowColor2 = 0xc084fc;
            if (biome === 'river') {
              bossTex = 'boss_elegante';
              bossName = 'El Elegante Veriss';
              barBorderColor = '#06b6d4';
              barFillGrad = 'linear-gradient(90deg,#ef4444,#34d399)';
              wallGlowColor1 = 0x06b6d4;
              wallGlowColor2 = 0x34d399;
            }
            
            // Boss sprite (invisible until room activated)
            scene.boss = scene.physics.add.sprite(bd.x, bd.y, bossTex);
            scene.boss.setDisplaySize(56, 84);
            scene.boss.setSize(40, 72);
            scene.boss.setOffset(12, 12);
            scene.boss.setDepth(4);
            scene.boss.setVisible(false);
            scene.boss.body.allowGravity = false;
            scene.boss.body.setImmovable(true);
            scene.boss.hp = bd.hp;
            scene.boss.speed = bd.speed;
            scene.boss.projInterval = bd.projectileInterval;
            scene.boss.projTimer = 0;
            scene.boss.state = biome === 'river' ? 'floating' : 'idle'; // idle, moving, shooting
            scene.boss.moveDir = 1;
            scene.boss.moveDirX = 1;
            scene.boss.moveDirY = -1;
            scene.boss.moveTimer = 0;
            scene.boss.minX = bd.roomLeft + 40;
            scene.boss.maxX = bd.roomRight - 40;
            scene.boss.minY = 180;
            scene.boss.maxY = 340;
            if (biome === 'river') {
              scene.boss.baseY = bd.y;
              scene.boss.floatAngle = 0;
              scene.boss.chargeTimer = 0;
            }
            
            // Boss room walls — created dynamically when room activates
            scene.bossWalls = null;
            scene.bossWallGlow = null;
            scene.bossRoomActive = false;
            
            // Dark overlay for outside the boss room (dramatic effect - OPTIMIZED: scrolls with world coordinates)
            scene.bossOverlay = scene.add.graphics();
            scene.bossOverlay.setDepth(15);
            scene.bossOverlay.setScrollFactor(1); // Set to 1 so it scrolls statically with the map
            scene.bossOverlay.setVisible(false);
 
            scene.drawBossOverlay = function() {
              const rx = bd.roomLeft;
              const rw = bd.roomRight - bd.roomLeft;
              const ry = 82, rh = 348;
              scene.bossOverlay.clear();
              scene.bossOverlay.fillStyle(0x040010, 0.5);
              // Draw 4 rectangles around the room in absolute world coordinates
              scene.bossOverlay.fillRect(0, 0, levelDef.worldWidth, ry);                               // top
              scene.bossOverlay.fillRect(0, ry + rh, levelDef.worldWidth, 450 - ry - rh);              // bottom
              scene.bossOverlay.fillRect(0, ry, rx, rh);                                                // left
              scene.bossOverlay.fillRect(rx + rw, ry, levelDef.worldWidth - rx - rw, rh);               // right
              // border
              scene.bossOverlay.lineStyle(2.5, wallGlowColor1, 0.85);
              scene.bossOverlay.strokeRect(rx, ry, rw, rh);
            };
 
            scene.createBossWalls = function() {
              if (scene.bossWalls) return;
              scene.bossWalls = scene.physics.add.staticGroup();
              const ww = 24; // thicker walls
              const rw = bd.roomRight - bd.roomLeft;
              // Left wall
              const wL = scene.add.rectangle(bd.roomLeft + 2, 250, ww, 380, 0x7c3aed, 0);
              scene.physics.add.existing(wL, true);
              wL.body.setSize(ww, 380);
              wL.setDepth(6);
              scene.bossWalls.add(wL);
              // Right wall — blocks path to goal
              const wR = scene.add.rectangle(bd.roomRight - 2, 250, ww, 380, 0x7c3aed, 0);
              scene.physics.add.existing(wR, true);
              wR.body.setSize(ww, 380);
              wR.setDepth(6);
              scene.bossWalls.add(wR);
              // Ceiling — taller to prevent jumping over
              const wT = scene.add.rectangle(bd.roomLeft + rw/2, 70, rw + ww*2, 28, 0x7c3aed, 0);
              scene.physics.add.existing(wT, true);
              wT.body.setSize(rw + ww*2, 28);
              wT.setDepth(6);
              scene.bossWalls.add(wT);
              // Floor-level barrier at right side (backup)
              const wRB = scene.add.rectangle(bd.roomRight - 2, 400, ww, 60, 0x7c3aed, 0);
              scene.physics.add.existing(wRB, true);
              wRB.body.setSize(ww, 60);
              wRB.setDepth(6);
              scene.bossWalls.add(wRB);
              // Glow
              scene.bossWallGlow = scene.add.graphics();
              scene.bossWallGlow.setDepth(5);
              scene.bossWallGlow.lineStyle(3, wallGlowColor1, 0.9);
              scene.bossWallGlow.strokeRect(bd.roomLeft, 90, rw, 330);
              scene.bossWallGlow.lineStyle(1, wallGlowColor2, 0.4);
              scene.bossWallGlow.strokeRect(bd.roomLeft+3, 93, rw-6, 324);
              scene.tweens.add({
                targets: scene.bossWallGlow, alpha: 0.5,
                duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
              });
              scene.physics.add.collider(scene.player, scene.bossWalls);
            };
 
            // Boss projectiles group
            scene.bossProjectiles = scene.physics.add.group({ allowGravity: false });
            
            // Boss health bar HTML overlay
            const healthBarHTML = document.createElement('div');
            healthBarHTML.id = 'boss-health-bar';
            healthBarHTML.style.cssText = 'display:none;position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:100;background:rgba(0,0,0,0.7);border:2px solid ' + barBorderColor + ';border-radius:10px;padding:6px 14px;color:#fff;font-family:Outfit,sans-serif;font-size:13px;font-weight:700;text-align:center;min-width:200px;';
            healthBarHTML.innerHTML = '<span style="color:' + barBorderColor + ';">' + bossName + '</span><div style="background:rgba(255,255,255,0.1);height:8px;border-radius:4px;margin-top:4px;overflow:hidden;"><div id="boss-hp-fill" style="background:' + barFillGrad + ';height:100%;width:100%;border-radius:4px;transition:width 0.3s;"></div></div>';
            document.getElementById('phaser-game-parent').appendChild(healthBarHTML);
            
            // Collider: player vs boss walls
            scene.physics.add.collider(scene.player, scene.bossWalls);
          }

          // 6.10 Wild Knight L-Jump Hazards (level 4 prairie mechanic)
          scene.wildKnights = [];
          if (biome === 'prairie' && levelDef.knightData) {
            levelDef.knightData.forEach(kd => {
              const knight = scene.physics.add.sprite(kd.startX, kd.startY, 'wild_knight');
              knight.setDisplaySize(36, 40);
              knight.setSize(28, 34);
              knight.setDepth(4);
              knight.body.allowGravity = false;
              knight.body.setImmovable(true);
              knight.kd = kd;
              knight.jumpTimer = 0;
              knight.targetX = kd.startX;
              knight.targetY = kd.startY;
              // L-jump offsets (knight moves: 2+1 pattern)
              knight.lJumps = [
                { dx: 80, dy: -40 }, { dx: 80, dy: 40 },
                { dx: -80, dy: -40 }, { dx: -80, dy: 40 },
                { dx: 40, dy: -80 }, { dx: 40, dy: 80 },
                { dx: -40, dy: -80 }, { dx: -40, dy: 80 }
              ];
              scene.wildKnights.push(knight);
            });
          }

          // 7. Goal — biome-specific (Portal+Queen for grass, Trophy for clockwork)
          if (biome === 'dragon') {
            // Dragon head goal — simple, recognizable profile
            if (!scene.textures.exists('dragon-head')) {
              const dhCanvas = document.createElement('canvas');
              dhCanvas.width = 140; dhCanvas.height = 100;
              const dhc = dhCanvas.getContext('2d');
              // Dragon head facing left — metallic emerald
              const headGrad = dhc.createLinearGradient(0, 0, 140, 0);
              headGrad.addColorStop(0, '#1a4a30'); headGrad.addColorStop(0.4, '#22c55e'); headGrad.addColorStop(1, '#0d3018');
              dhc.fillStyle = headGrad;
              // Main head shape
              dhc.beginPath();
              dhc.moveTo(10, 55);   // snout tip
              dhc.lineTo(8, 40);    // upper snout
              dhc.lineTo(15, 28);   // forehead
              dhc.lineTo(32, 18);   // brow ridge
              dhc.lineTo(55, 14);   // top of head
              dhc.lineTo(80, 18);   // back of head
              dhc.lineTo(100, 35);  // neck back
              dhc.lineTo(105, 65);  // neck bottom
              dhc.lineTo(80, 70);   // lower jaw back
              dhc.lineTo(50, 68);   // throat
              dhc.lineTo(30, 62);   // lower jaw front
              dhc.lineTo(15, 58);   // chin
              dhc.closePath();
              dhc.fill();
              // Scale ridges on top of head — brighter
              dhc.fillStyle = '#4ade80';
              for (let i = 0; i < 6; i++) {
                const sx = 20 + i * 12;
                dhc.beginPath();
                dhc.moveTo(sx, 16 + (i % 2) * 3);
                dhc.lineTo(sx + 3, 2 + (i % 2) * 2);
                dhc.lineTo(sx + 8, 16 + (i % 2) * 3);
                dhc.closePath();
                dhc.fill();
              }
              // Horns — lighter metallic
              dhc.fillStyle = '#2a5a3a';
              dhc.beginPath();
              dhc.moveTo(55, 14);
              dhc.bezierCurveTo(58, -2, 72, -8, 78, 4);
              dhc.bezierCurveTo(70, 8, 60, 14, 56, 16);
              dhc.closePath(); dhc.fill();
              dhc.beginPath();
              dhc.moveTo(45, 16);
              dhc.bezierCurveTo(48, 2, 60, -4, 64, 6);
              dhc.bezierCurveTo(58, 10, 50, 15, 46, 17);
              dhc.closePath(); dhc.fill();
              // Eye — big golden
              const eyeGlow = dhc.createRadialGradient(30, 25, 2, 30, 25, 14);
              eyeGlow.addColorStop(0, '#fef3c7');
              eyeGlow.addColorStop(0.2, '#fbbf24');
              eyeGlow.addColorStop(0.6, '#d97706');
              eyeGlow.addColorStop(1, 'transparent');
              dhc.fillStyle = eyeGlow;
              dhc.beginPath(); dhc.arc(30, 25, 14, 0, Math.PI * 2); dhc.fill();
              // Pupil slit
              dhc.fillStyle = '#000';
              dhc.beginPath(); dhc.ellipse(32, 25, 2, 6, 0.1, 0, Math.PI * 2); dhc.fill();
              // Nostril
              dhc.fillStyle = '#051008';
              dhc.beginPath(); dhc.arc(15, 35, 3, 0, Math.PI * 2); dhc.fill();
              // Mouth line — snarling
              dhc.strokeStyle = '#051008';
              dhc.lineWidth = 2;
              dhc.beginPath();
              dhc.moveTo(10, 48); dhc.lineTo(30, 50);
              dhc.lineTo(40, 46); dhc.lineTo(50, 50);
              dhc.stroke();
              // Teeth
              dhc.fillStyle = '#fef3c7';
              for (let i = 0; i < 5; i++) {
                dhc.beginPath();
                dhc.moveTo(14 + i * 6, 48);
                dhc.lineTo(16 + i * 6, 52);
                dhc.lineTo(18 + i * 6, 48);
                dhc.closePath(); dhc.fill();
              }
              // Green smoke from nostril
              dhc.fillStyle = 'rgba(74,222,128,0.2)';
              dhc.beginPath(); dhc.arc(10, 32, 10, 0, Math.PI * 2); dhc.fill();
              // Body scales on neck — brighter metallic
              dhc.strokeStyle = 'rgba(74,222,128,0.35)';
              dhc.lineWidth = 1.2;
              for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 4; col++) {
                  const cx = 85 + col * 14 + (row % 2) * 7;
                  const cy = 30 + row * 14;
                  dhc.beginPath();
                  for (let p = 0; p < 6; p++) {
                    const a = p * Math.PI / 3 - Math.PI / 2;
                    const px = cx + Math.cos(a) * 7;
                    const py = cy + Math.sin(a) * 5;
                    if (p === 0) dhc.moveTo(px, py);
                    else dhc.lineTo(px, py);
                  }
                  dhc.closePath(); dhc.stroke();
                }
              }

              scene.textures.addCanvas('dragon-head', dhCanvas);
            }
            // Place head — visible, centered at goal
            const dhx = (levelDef.goal && levelDef.goal.portalX) || 3750;
            const dhy = 325;
            // Portal behind head
            scene.portal = scene.add.sprite(dhx, dhy - 30, 'portal_texture');
            scene.portal.setDisplaySize(140, 140);
            scene.portal.setDepth(2);
            scene.portalGlow = scene.add.graphics();
            scene.portalGlow.fillStyle(0x22c55e, 0.1);
            scene.portalGlow.fillCircle(dhx, dhy - 30, 80);
            scene.portalGlow.setDepth(1);
            // Dragon head in front of portal
            scene.dragonHeadGoal = scene.physics.add.staticSprite(dhx, dhy, 'dragon-head');
            scene.dragonHeadGoal.setDisplaySize(130, 100);
            scene.dragonHeadGoal.setDepth(5);
            scene.dragonHeadGoal.body.setSize(80, 60);
            scene.dragonHeadGoal.body.setOffset(30, 20);
            // Green glow below head
            scene.dragonHeadGlow = scene.add.graphics();
            scene.dragonHeadGlow.fillStyle(0x22c55e, 0.08);
            scene.dragonHeadGlow.fillCircle(dhx, dhy + 20, 70);
            scene.dragonHeadGlow.setDepth(4);
            // Sparkles
            for (let i=0;i<12;i++){
              const sa=(i*Math.PI*2)/12;
              const sr=45+Math.random()*35;
              const sx=dhx+Math.cos(sa)*sr,sy=dhy-10+Math.sin(sa)*sr;
              const sc=scene.add.circle(sx,sy,Math.random()*1.5+0.7,0x4ade80,0.35);
              sc.setDepth(6);
              scene.tweens.add({
                targets:sc,y:sy-10,alpha:0.1,scale:0.5,
                duration:1200+Math.random()*600,yoyo:true,repeat:-1,
                ease:'Sine.easeInOut',delay:i*100
              });
            }
          } else if (biome === 'clockwork') {
            // Tournament Trophy goal (level 2 — Tic, Tac, Jaque Mate)
            const tX = levelDef.goal.trophyX || 2180;
            const tY = levelDef.goal.trophyY || 270;
            
            scene.trophyGoal = scene.physics.add.staticSprite(tX, tY, 'trophy');
            scene.trophyGoal.setDisplaySize(52, 74);
            scene.trophyGoal.body.setSize(40, 70);
            scene.trophyGoal.body.setOffset(6, 4);
            scene.trophyGoal.setDepth(2);
            
            // Golden glow behind trophy
            scene.trophyGlow = scene.add.graphics();
            scene.trophyGlow.fillStyle(0xfacc15, 0.1);
            scene.trophyGlow.beginPath();
            scene.trophyGlow.arc(tX, tY, 70, 0, Math.PI*2);
            scene.trophyGlow.fill();
            scene.trophyGlow.setDepth(1);
            
            // Ambient sparkles
            for (let i=0; i<14; i++) {
              const sa = (i*Math.PI*2)/14;
              const sr = 50+Math.random()*35;
              const sx = tX+Math.cos(sa)*sr;
              const sy = tY+Math.sin(sa)*sr;
              const sc = scene.add.circle(sx, sy, Math.random()*1.5+0.7, i%2===0?0xfef08a:0xd4b84c, 0.4);
              sc.setDepth(3);
              scene.tweens.add({
                targets: sc, y: sy-10, alpha: 0.15, scale: 0.5,
                duration: 1200+Math.random()*600, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut', delay: i*100
              });
              }
              
          } else {
          // 7. Chess-Themed Goal: Portal + White Queen + Peoncito
          const gx = (levelDef.goal && levelDef.goal.portalX) || 2150;
          const gy = (levelDef.goal && levelDef.goal.portalY) || 245;
          // 7.1. Portal
          scene.portal = scene.add.sprite(gx, gy, 'portal_texture');
          scene.portal.setDisplaySize(175, 175);
          scene.portal.setDepth(1);
          if (levelDef.bossData) {
            scene.portal.setVisible(false);
          }
          scene.portalGlow = scene.add.graphics();
          scene.portalGlow.fillStyle(0x7e22ce, 0.15);
          scene.portalGlow.beginPath();
          scene.portalGlow.arc(gx, gy, 100, 0, Math.PI * 2);
          scene.portalGlow.fill();
          scene.portalGlow.setDepth(0);
          if (levelDef.bossData) {
            scene.portalGlow.setVisible(false);
          }
          // 7.2. White Queen
          if (!levelDef.bossData) {
            scene.whiteQueen = scene.physics.add.staticSprite(gx, gy, 'white_queen');
            scene.whiteQueen.setDisplaySize(60, 120);
            scene.whiteQueen.body.setSize(44, 120);
            scene.whiteQueen.body.setOffset(8, 0);
            scene.whiteQueen.setDepth(2);
            scene.queenGlow = scene.add.graphics();
            scene.queenGlow.fillStyle(0xfacc15, 0.08);
            scene.queenGlow.beginPath();
            scene.queenGlow.arc(gx, gy, 90, 0, Math.PI * 2);
            scene.queenGlow.fill();
            scene.queenGlow.setDepth(1);
            for (let i = 0; i < 18; i++) {
              const sa = (i * Math.PI * 2) / 18;
              const sr = 65 + Math.random() * 45;
              const sx = gx + Math.cos(sa) * sr;
              const sy = gy + Math.sin(sa) * sr;
              const sc = scene.add.circle(sx, sy, Math.random() * 1.8 + 0.8, i % 3 === 0 ? 0xfef08a : 0x22d3ee, 0.4);
              sc.setDepth(3);
              scene.tweens.add({
                targets: sc, y: sy - 10, alpha: 0.15, scale: 0.5,
                duration: 1200 + Math.random() * 600, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut', delay: i * 100
              });
            }
          }
          // 7.3. Peoncito
          scene.peoncitoGoal = scene.add.sprite(gx - 80, gy + 45, 'peoncito_friendly');
          scene.peoncitoGoal.setDisplaySize(32, 42);
          scene.peoncitoGoal.setDepth(2);
          if (levelDef.bossData) {
            scene.peoncitoGoal.setVisible(false);
          }
          scene.tweens.add({
            targets: scene.peoncitoGoal,
            y: gy + 35, angle: 5,
            duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
          });
          scene.tweens.add({
            targets: scene.peoncitoGoal,
            scaleX: 1.06, scaleY: 0.94,
            duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
          });

          } // end biome goal if/else

          // 8. Colliders and Overlaps configuration
          scene.physics.add.collider(scene.player, scene.platforms);
          scene.physics.add.collider(scene.enemies, scene.platforms);
          
          // Collect coin overlap (Star shoots off diagonal like a shooting star!)
          scene.physics.add.overlap(scene.player, scene.coins, (player, coin) => {
            if (coin.isCollected) return;
            coin.isCollected = true;
            coin.body.enable = false; // Disable collision immediately!
            
            self.coins++;
            self.score += 100;
            self.synthesizeSound('coin');
            
            document.getElementById('hud-coins').textContent = `🪙 x${self.coins.toString().padStart(2, '0')}`;
            document.getElementById('hud-score').textContent = self.score.toString().padStart(5, '0');
            
            // Stop any existing floating tweens
            scene.tweens.killTweensOf(coin);
            
            // Shoot off like a wild shooting star!
            const flyDirX = Math.random() < 0.5 ? -250 : 250;
            const flyDirY = -500 - Math.random() * 100;
            
            // Trailing magical sparkles emitter behind the flying star
            const starTrail = scene.add.particles(0, 0, 'sparkle', {
              speed: 15,
              scale: { start: 0.6, end: 0 },
              alpha: { start: 0.75, end: 0 },
              lifespan: 250,
              frequency: 25,
              blendMode: 'ADD'
            });
            starTrail.startFollow(coin);
            
            // Parabolic fly-out trajectory using tweens
            scene.tweens.add({
              targets: coin,
              x: coin.x + flyDirX * 0.7,
              ease: 'Linear',
              duration: 650
            });
            scene.tweens.add({
              targets: coin,
              y: coin.y + flyDirY * 0.7,
              ease: 'Quad.easeOut',
              duration: 325,
              yoyo: true,
              easeYoyo: 'Quad.easeIn'
            });
            scene.tweens.add({
              targets: coin,
              angle: 1080, // spin crazily!
              scale: 0.1,  // shrink!
              alpha: 0,    // fade out!
              duration: 650,
              onComplete: () => {
                starTrail.destroy();
                coin.destroy();
              }
            });
          });

          // Collect secret crown overlap (Fades out, spins, expands + 16-sparkle radial explosion)
          scene.physics.add.overlap(scene.player, scene.crowns, (player, crown) => {
            if (crown.isCollected) return;
            crown.isCollected = true;
            crown.body.enable = false; // Disable collision immediately!
            
            self.score += 1000;
            self.synthesizeSound('victory'); // Fanfare for secret!
            
            document.getElementById('hud-score').textContent = self.score.toString().padStart(5, '0');
            
            // 1. Massive radial stardust blast (16 golden particles!)
            for (let i = 0; i < 16; i++) {
              const angle = (i * 360 / 16) * Math.PI / 180;
              const speed = 120 + Math.random() * 80;
              const p = scene.add.circle(crown.x, crown.y, Math.random() * 3 + 2.5, 0xfacc15, 0.95);
              scene.physics.add.existing(p, false);
              p.body.allowGravity = false;
              p.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
              
              scene.tweens.add({
                targets: p,
                alpha: 0,
                scale: 0.1,
                duration: 800 + Math.random() * 300,
                onComplete: () => p.destroy()
              });
            }
            
            // 2. Crown expansion and explosion animation!
            scene.tweens.add({
              targets: crown,
              scaleX: 3.5,
              scaleY: 3.5,
              alpha: 0,
              angle: 360,
              duration: 500,
              ease: 'Back.easeOut',
              onComplete: () => {
                crown.destroy();
              }
            });
          });

          // Enemy collision overlap
          scene.physics.add.overlap(scene.player, scene.enemies, (player, enemy) => {
            if (enemy.dead) return;

            // Stomp on enemy head
            if (player.body.velocity.y > 0 && player.y + player.displayHeight - player.body.velocity.y/60 <= enemy.y + 12) {
              enemy.dead = true;
              enemy.body.setVelocityX(0);
              enemy.body.allowGravity = false;
              enemy.body.setSize(0, 0); // remove collision body
              self.score += 200;
              self.synthesizeSound('stomp');
              document.getElementById('hud-score').textContent = self.score.toString().padStart(5, '0');
              
              player.body.setVelocityY(-350); // bounce up high!

              // Spawn 5 star coins that burst out when stomped! Excellent gameplay incentive!
              for (let i = 0; i < 5; i++) {
                const coin = scene.add.sprite(enemy.x, enemy.y - 12, 'coin_0');
                coin.play('coin-spin');
                coin.setDisplaySize(22, 22);
                
                scene.coins.add(coin);
                coin.body.setCircle(11, -11, -11);
                coin.body.allowGravity = false;
                coin.body.setImmovable(true);
                
                // Spread the 5 coins out in a gorgeous fountain arc!
                // Angles from -135 deg to -45 deg spread symmetrically
                const arcAngle = (-135 + i * 22.5) * Math.PI / 180;
                const burstSpeed = 180 + Math.random() * 60;
                const vx = Math.cos(arcAngle) * burstSpeed;
                const vy = Math.sin(arcAngle) * burstSpeed - 120; // strong upward launch!
                
                scene.tweens.add({
                  targets: coin,
                  x: coin.x + vx * 0.65,
                  y: coin.y + vy * 0.65,
                  duration: 600,
                  ease: 'Quad.easeOut',
                  onComplete: () => {
                    scene.tweens.add({
                      targets: coin,
                      y: coin.y - 6,
                      duration: 1000 + Math.random() * 400,
                      yoyo: true,
                      repeat: -1,
                      ease: 'Sine.easeInOut'
                    });
                  }
                });
              }

              // Stomp squash animation
              scene.tweens.add({
                targets: enemy,
                scaleY: 0.1,
                y: enemy.y + 18,
                duration: 200,
                onComplete: () => enemy.destroy()
              });
            } else {
              // Martina takes damage
              if (player.invincibility === 0) {
                self.lives--;
                player.invincibility = 60;
                player.body.setVelocityX(player.x < enemy.x ? -250 : 250);
                player.body.setVelocityY(-150);
                self.synthesizeSound('damage');
                scene.doDamageAnim();
                
                document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;

                if (self.lives <= 0) {
                  self.gameOver();
                }
              }
            }
          });

          // Flying Bishop airborne collision overlap (deals damage to Martina)
          scene.physics.add.overlap(scene.player, scene.airEnemies, (player, ae) => {
            if (player.invincibility === 0) {
              self.lives--;
              player.invincibility = 60;
              player.body.setVelocityX(player.x < ae.x ? -220 : 220);
              player.body.setVelocityY(-150);
              self.synthesizeSound('damage');
              scene.doDamageAnim();
              
              document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
              
              if (self.lives <= 0) {
                self.gameOver();
              }
            }
          });

          // Goal overlap — biome-specific (Dragon head, Queen, Trophy)
          if (biome === 'dragon' && scene.dragonHeadGoal) {
            scene.physics.add.overlap(scene.player, scene.dragonHeadGoal, () => {
              if (self.player.isAscending) return;
              self.player.isAscending = true;
              self.completeLevel();
              scene.particles.stop();
              scene.player.body.setVelocity(0, -60);
              scene.player.body.allowGravity = false;
              const vt = scene.add.text(400, 200, "¡DRAGÓN DOMADO!\nLa Siciliana ha caído", {
                fontFamily:"'Outfit',sans-serif",fontSize:'24px',fontStyle:'bold',
                fill:'#4ade80',stroke:'#0a2015',strokeThickness:5,align:'center'
              }).setOrigin(0.5).setDepth(10).setScrollFactor(0);
              for (let i=0;i<30;i++){
                scene.time.delayedCall(i*40,()=>{
                  if(!scene.player.active)return;
                  const a=i*0.35,r=25-i*0.2;
                  const sp=scene.add.circle(scene.player.x+Math.cos(a)*Math.max(3,r),scene.player.y+Math.sin(a)*Math.max(3,r),Math.random()*2+1.5,0x4ade80,0.9);
                  scene.physics.add.existing(sp,false);sp.body.allowGravity=false;sp.body.setVelocityY(-100);
                  scene.tweens.add({targets:sp,alpha:0,scale:0.1,duration:700,onComplete:()=>sp.destroy()});
                });
              }
              scene.tweens.add({targets:scene.player,angle:1080,scaleX:0.05,scaleY:0.05,alpha:0,y:scene.player.y-120,duration:2200,ease:'Quad.easeOut',onComplete:()=>{vt.destroy();self.showVictoryScreen(true);}});
            });
          } else if (biome === 'clockwork' && scene.trophyGoal) {
            scene.physics.add.overlap(scene.player, scene.trophyGoal, () => {
              if (self.player.isAscending) return;
              self.player.isAscending = true;
              self.completeLevel();
              
              scene.particles.stop();
              scene.player.body.setVelocityX(0);
              scene.player.body.setVelocityY(0);
              scene.player.body.allowGravity = false;
              
              // Victory text
              const vicText = scene.add.text(scene.player.x, scene.player.y - 130, "¡TORNEO GANADO!\nTic, tac... ¡Jaque Mate!", {
                fontFamily: "'Outfit', 'Inter', sans-serif",
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#fbbf24',
                stroke: '#1a1020',
                strokeThickness: 5,
                align: 'center'
              }).setOrigin(0.5).setDepth(10);
              
              // Burst of particles around player
              for (let i=0; i<30; i++) {
                const angle = (i/30)*Math.PI*2;
                const sp = scene.add.circle(scene.player.x, scene.player.y, Math.random()*2+1.5, i%3===0?0xfacc15:0xd4b84c, 0.8);
                scene.physics.add.existing(sp, false);
                sp.body.allowGravity = false;
                sp.body.setVelocity(Math.cos(angle)*180, Math.sin(angle)*180-80);
                scene.tweens.add({
                  targets: sp, alpha: 0, scale: 0.1, duration: 700+Math.random()*300,
                  onComplete: ()=>sp.destroy()
                });
              }
              
              // Martina jumps up in celebration then fades
              scene.player.body.setVelocityY(-300);
              scene.tweens.add({
                targets: scene.player,
                scaleX: 0.05, scaleY: 0.05, alpha: 0,
                y: scene.player.y-80,
                duration: 2000, ease: 'Quad.easeOut',
                onComplete: () => {
                  vicText.destroy();
                  self.showVictoryScreen(true);
                }
              });
            });
          } else if (scene.whiteQueen) {
          // Goal White Queen overlap (Ascension to Wake Up from the dream!)
          scene.physics.add.overlap(scene.player, scene.whiteQueen, () => {
            if (self.player.isAscending) return;
            self.player.isAscending = true;
            self.completeLevel();
            
            // Disable player control, trails and physics gravity
            scene.particles.stop();
            scene.player.body.setVelocityX(0);
            scene.player.body.setVelocityY(-60); // slow drift upwards!
            scene.player.body.allowGravity = false;
            
            // Camera zoom into Martina as she ascends into the swirling portal!
            scene.cameras.main.zoomTo(1.35, 2200);
            
            // Display beautiful floating text: "¡JAQUE MATE! Despertando..."
            const victoryText = scene.add.text(scene.player.x, scene.player.y - 130, "¡JAQUE MATE!\nDespertando...", {
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontSize: '22px',
              fontStyle: 'bold',
              fill: '#fbbf24', // Gold
              stroke: '#1e0b3b',
              strokeThickness: 5,
              align: 'center'
            }).setOrigin(0.5).setDepth(10);
            
            // Spiral sparkles vortex around Martina as she floats up!
            for (let i = 0; i < 40; i++) {
              scene.time.delayedCall(i * 50, () => {
                if (!scene.player.active) return;
                const angle = i * 0.4;
                const radius = 25 - (i * 0.3); // spiral narrows!
                const px = scene.player.x + Math.cos(angle) * Math.max(5, radius);
                const py = scene.player.y + Math.sin(angle) * Math.max(5, radius);
                
                const sparkleColor = i % 2 === 0 ? 0xfacc15 : 0x22d3ee; // Alternate gold & cyan!
                const sp = scene.add.circle(px, py, Math.random() * 2 + 1.5, sparkleColor, 0.9);
                scene.physics.add.existing(sp, false);
                sp.body.allowGravity = false;
                sp.body.setVelocityY(-110); // float up faster than Martina!
                
                scene.tweens.add({
                  targets: sp,
                  alpha: 0,
                  scale: 0.1,
                  duration: 800,
                  onComplete: () => sp.destroy()
                });
              });
            }
            
            // Spin, scale down, and fade out Martina in a beautiful dream-state transition!
            scene.tweens.add({
              targets: scene.player,
              angle: 1080, // spin 3 full times!
              scaleX: 0.05,
              scaleY: 0.05,
              alpha: 0,
              y: scene.player.y - 120, // drift up even higher
              duration: 2200,
              ease: 'Quad.easeOut',
              onComplete: () => {
                victoryText.destroy();
                self.showVictoryScreen(true);
              }
            });
          });
          } // end goal overlap biome if/else


          // 9. Camera setup
          scene.cameras.main.setBounds(0, 0, levelDef.worldWidth, 450);
          scene.cameras.main.startFollow(scene.player, true, 0.1, 0.1);
          
          // 9.2 Cinematic vignette — canvas-based full-viewport overlay
          const vignetteCanvas = document.createElement('canvas');
          vignetteCanvas.width = 800;
          vignetteCanvas.height = 450;
          const vctx = vignetteCanvas.getContext('2d');
          // Left-to-right gradient: dark at edges, clear at center
          for (let x = 0; x < 800; x++) {
            const edgeDist = Math.min(x, 800 - x) / 400; // 0 at edges, 1 at center
            const alpha = (1 - edgeDist) * (1 - edgeDist) * 0.35;
            vctx.fillStyle = `rgba(2,1,19,${alpha})`;
            vctx.fillRect(x, 0, 1, 450);
          }
          // Top and bottom bands
          for (let y = 0; y < 450; y++) {
            const edgeDist = Math.min(y, 450 - y) / 225;
            const alpha = (1 - edgeDist) * (1 - edgeDist) * 0.2;
            vctx.fillStyle = `rgba(2,1,19,${alpha})`;
            vctx.fillRect(0, y, 800, 1);
          }
          scene.textures.addCanvas('vignette_tex', vignetteCanvas);
          const vignette = scene.add.image(400, 225, 'vignette_tex').setDepth(20).setScrollFactor(0);
          
          // Light rays emanating from portal area (visible when near)
          const lightRays = scene.add.graphics();
          lightRays.setScrollFactor(1);
          lightRays.setDepth(1);
          for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            lightRays.fillStyle(0xfacc15, 0.04);
            lightRays.beginPath();
            lightRays.moveTo(2150, 245);
            lightRays.lineTo(2150 + Math.cos(angle - 0.15) * 300, 245 + Math.sin(angle - 0.15) * 300);
            lightRays.lineTo(2150 + Math.cos(angle + 0.15) * 300, 245 + Math.sin(angle + 0.15) * 300);
            lightRays.closePath();
            lightRays.fill();
          }
          
          // 9.5 Physics world bounds setup (fixes the first abyss blocking bug!)
          scene.physics.world.setBounds(0, 0, levelDef.worldWidth, 450);
          
          // 10. Inputs binder
          scene.cursors = scene.input.keyboard.createCursorKeys();
          scene.keysWASD = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            dash2: Phaser.Input.Keyboard.KeyCodes.C
          });
        },
        update: function() {
          const scene = this;
          if (self.gameState !== 'playing') return;

          // Runner game mode — completely different update
          if (levelDef.gameMode === 'runner') {
            self.updateRunner(scene, levelDef);
            return;
          }

          // --- WATER BIOME SPECIAL MECHANICS (currents and breathing bubbles) ---
          if (biome === 'river') {
            scene.player.setTint(0x7df9ff); // tint blue/cyan
            
            // Auto breathing bubbles from mouth (OPTIMIZED: timer-based, no physics)
            if (!scene._lastBreathTime) scene._lastBreathTime = 0;
            if (scene.time.now - scene._lastBreathTime > 1600) {
              scene._lastBreathTime = scene.time.now;
              for (let i = 0; i < 3; i++) {
                scene.time.delayedCall(i * 150, () => {
                  if (!scene.player || !scene.player.active) return;
                  const bx = scene.player.x + (scene.player.flipX ? -8 : 8);
                  const by = scene.player.y - 12;
                  const bub = scene.add.circle(bx, by, Math.random() * 2 + 1, 0xffffff, 0.6);
                  bub.setDepth(3);
                  const targetX = bx + (Math.random() * 20 - 10);
                  const targetY = by - (40 + Math.random() * 30);
                  scene.tweens.add({
                    targets: bub,
                    x: targetX,
                    y: targetY,
                    alpha: 0,
                    scale: 0.1,
                    duration: 1000 + Math.random() * 400,
                    onComplete: () => bub.destroy()
                  });
                });
              }
            }

            // Water currents handling (OPTIMIZED: no physics on drift particles, reduced frequency)
            if (levelDef.currentsData) {
              levelDef.currentsData.forEach(c => {
                // If player is inside, push player gently
                if (scene.player.x >= c.x && scene.player.x <= c.x + c.w &&
                    scene.player.y >= c.y && scene.player.y <= c.y + c.h) {
                  scene.player.body.setVelocityX(scene.player.body.velocity.x + c.forceX * 0.05);
                  scene.player.body.setVelocityY(scene.player.body.velocity.y + c.forceY * 0.05);
                  
                  // Spawn indicator drift bubbles
                  if (Math.random() < 0.08) {
                    const startX = c.x + Math.random() * c.w;
                    const startY = c.y + Math.random() * c.h;
                    const cb = scene.add.circle(startX, startY, Math.random() * 2 + 1, 0xffffff, 0.45);
                    cb.setDepth(1);
                    const distX = c.forceX * 1.2;
                    const distY = (c.forceY * 1.2) + (Math.random() * 30 - 15);
                    scene.tweens.add({
                      targets: cb,
                      x: startX + distX,
                      y: startY + distY,
                      alpha: 0,
                      scale: 0.1,
                      duration: 1200,
                      onComplete: () => cb.destroy()
                    });
                  }
                }
              });
            }
          }

          // Cycle particle textures for rainbow trail effect
          if (scene.particleTextures && scene.particles) {
            scene.particleFrameCounter++;
            if (scene.particleFrameCounter >= 8) {
              scene.particleFrameCounter = 0;
              scene.particleFrameIdx = (scene.particleFrameIdx + 1) % 3;
              scene.particles.setTexture(scene.particleTextures[scene.particleFrameIdx]);
            }
          }

          // Ambient fireflies — magical floating lights
          if (Math.random() < 0.025) {
            const ffX = scene.cameras.main.scrollX + Math.random() * 800;
            const ffY = 300 + Math.random() * 150;
            const ffColors = [0xfacc15, 0x22d3ee, 0xa855f7, 0xf472b6];
            const ffColor = ffColors[Math.floor(Math.random() * ffColors.length)];
            const ff = scene.add.circle(ffX, ffY, Math.random() * 2.5 + 1.5, ffColor, 0.5);
            ff.setScrollFactor(0.6);
            ff.setDepth(-1);
            scene.tweens.add({
              targets: ff,
              y: ffY - 40 - Math.random() * 30,
              x: ffX + (Math.random() - 0.5) * 60,
              alpha: 0,
              scale: 0.1,
              duration: 2500 + Math.random() * 1500,
              ease: 'Sine.easeOut',
              onComplete: () => ff.destroy()
            });
          }

          // Invincibility flashing timer
          if (scene.player.invincibility > 0) {
            scene.player.invincibility--;
            if (!scene.player._bossIntroProtect) {
              scene.player.setAlpha(scene.player.invincibility % 4 === 0 ? 0.3 : 0.85);
            }
          } else {
            scene.player.setAlpha(1.0);
          }

          // Twinkling stars / shooting stars dynamic simulation in background!
          if (Math.random() < 0.008) {
            const startX = scene.cameras.main.scrollX + Math.random() * 800;
            const startY = Math.random() * 150;
            const star = scene.add.circle(startX, startY, Math.random() * 2 + 1, 0xffffff, 0.9);
            scene.physics.add.existing(star, false);
            star.body.allowGravity = false;
            star.body.setVelocity(250, 180); // fly diagonally down-right!
            star.setScrollFactor(1.0); // scroll with camera!
            
            // Draw a beautiful fade-out tail!
            scene.tweens.add({
              targets: star,
              alpha: 0,
              scaleX: 0.1,
              scaleY: 0.1,
              duration: 800,
              onComplete: () => star.destroy()
            });
          }

          // Enemy patrols update
          scene.enemies.getChildren().forEach(enemy => {
            if (enemy.dead) return;
            
            if (biome === 'river') {
              if (enemy.texture.key === 'medusa_enemy') {
                // Medusa vertical floating pulse
                const pulse = Math.sin(scene.time.now * 0.0035 + enemy.x * 0.05) * 50;
                enemy.body.setVelocityY(pulse);
                enemy.body.setVelocityX(0);
                // Pulse scaling effect
                const scaleVal = 1 + Math.sin(scene.time.now * 0.007 + enemy.x) * 0.12;
                enemy.setScale(scaleVal);
                // soft rotation wobble
                enemy.setAngle(Math.sin(scene.time.now * 0.005) * 10);
              } else if (enemy.texture.key === 'pez_enemy') {
                // Fish swim back and forth, and dart if aligned with player
                const dx = scene.player.x - enemy.x;
                const dy = scene.player.y - enemy.y;
                const isFacingPlayer = enemy.body.velocity.x > 0 ? dx > 0 : dx < 0;
                
                if (Math.abs(dy) < 50 && Math.abs(dx) < 220 && isFacingPlayer) {
                  // Dart towards player!
                  const factor = 2.0;
                  enemy.body.setVelocityX(enemy.body.velocity.x > 0 ? enemy.speed * factor : -enemy.speed * factor);
                  enemy.setTint(0xff8888); // flash red
                  enemy.setAngle(0);
                } else {
                  enemy.clearTint();
                  // standard swim wobble and patrol boundaries
                  const wobble = Math.sin(scene.time.now * 0.02 + enemy.x) * 12;
                  enemy.setAngle(wobble);
                  
                  if (enemy.x <= enemy.leftBound) {
                    enemy.body.setVelocityX(enemy.speed);
                    enemy.setFlipX(true);
                  } else if (enemy.x >= enemy.rightBound) {
                    enemy.body.setVelocityX(-enemy.speed);
                    enemy.setFlipX(false);
                  }
                }
              }
            } else {
              // Wobble patrol walk!
              const wobble = Math.sin(scene.time.now * 0.01 + enemy.x) * 6;
              enemy.setAngle(wobble);
              
              if (enemy.x <= enemy.leftBound) {
                enemy.body.setVelocityX(enemy.speed);
                enemy.setFlipX(true);
              } else if (enemy.x >= enemy.rightBound) {
                enemy.body.setVelocityX(-enemy.speed);
                enemy.setFlipX(false);
              }
            }
          });

          // Flying Bishop airborne vertical/horizontal/diagonal/sinusoidal patrol update
          scene.airEnemies.getChildren().forEach(ae => {
            if (ae.pattern === 'horizontal') {
              if (ae.x <= ae.minX) {
                ae.body.setVelocityX(ae.speed);
                ae.setFlipX(true);
              } else if (ae.x >= ae.maxX) {
                ae.body.setVelocityX(-ae.speed);
                ae.setFlipX(false);
              }
            } else if (ae.pattern === 'diagonal') {
              if (ae.x <= ae.minX) {
                ae.body.setVelocityX(ae.speed);
                ae.body.setVelocityY(ae.speedY);
                ae.setFlipX(true);
              } else if (ae.x >= ae.maxX) {
                ae.body.setVelocityX(-ae.speed);
                ae.body.setVelocityY(-ae.speedY);
                ae.setFlipX(false);
              }
            } else if (ae.pattern === 'sinusoidal') {
              // Smooth sine wave vertical displacement while moving horizontally
              ae.y = ae.baseY + Math.sin(scene.time.now * 0.003) * ae.ampY;
              
              if (ae.x <= ae.minX) {
                ae.direction = 1;
                ae.body.setVelocityX(ae.speed);
                ae.setFlipX(true);
              } else if (ae.x >= ae.maxX) {
                ae.direction = -1;
                ae.body.setVelocityX(-ae.speed);
                ae.setFlipX(false);
              }
            } else {
              // Fallback vertical
              if (ae.y >= ae.maxY) {
                ae.body.setVelocityY(-ae.speed);
              } else if (ae.y <= ae.minY) {
                ae.body.setVelocityY(ae.speed);
              }
            }
            
            // Hovering wobble effect!
            ae.setAngle(Math.sin(scene.time.now * 0.007) * 8);
          });

          // Rotating clockwork gears update
          if (scene.gearGroups) {
            scene.gearGroups.forEach(gear => {
              gear.angle.val += gear.speed * (Math.PI / 180);
              gear.visual.angle += gear.speed;
              
              gear.teeth.forEach((tooth, ti) => {
                const a = gear.angle.val + tooth.baseAngle;
                const tx = gear.gx + Math.cos(a) * gear.radius;
                const ty = gear.gy + Math.sin(a) * gear.radius;
                tooth.gfx.x = tx;
                tooth.gfx.y = ty;
                tooth.gfx.body.position.x = tx - 14;
                tooth.gfx.body.position.y = ty - 7;
                tooth.gfx.angle = (a * 180 / Math.PI) + 90;
                
                // Hazard collision check
                if (tooth.isHazard && scene.player.invincibility === 0) {
                  const dx = scene.player.x - tx;
                  const dy = scene.player.y - ty;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < 26 && scene.player.body.velocity.y >= 0) {
                    self.lives--;
                    scene.player.invincibility = 60;
                    scene.player.body.setVelocityX(scene.player.x < tx ? -180 : 180);
                    scene.player.body.setVelocityY(-120);
                    self.synthesizeSound('damage');
                    scene.doDamageAnim();
                    document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
                    if (self.lives <= 0) self.gameOver();
                  }
                }
              });
            });
          }

          // --- BOSS SYSTEM UPDATE (Alfil Exiliado / El Elegante Veriss) ---
          if ((biome === 'neon' || biome === 'river') && scene.boss && !scene.bossDefeated) {
            const bd = levelDef.bossData;
            const playerInRoom = scene.player.x > bd.roomLeft + 30 && scene.player.x < bd.roomRight - 30;
            
            if (playerInRoom && !scene.bossRoomActive) {
              scene.bossRoomActive = true;
              scene.bossIntro = true; // dramatic pause before fight
              scene.bossHP = scene.boss.hp;
              
              // Create walls NOW
              scene.createBossWalls();
              
              // Clear any old projectiles
              scene.bossProjectiles.getChildren().forEach(p => p.destroy());
              
              // Pause player and give invincibility during intro
              scene.player.body.setVelocity(0, 0);
              scene.player.invincibility = 200; // ~3.3 seconds, covers intro
              
              // Dramatic boss intro
              scene.boss.setVisible(true);
              scene.boss.setPosition(bd.x, bd.y + 80);
              scene.boss.setAlpha(0);
              scene.boss.setScale(1.6);
              scene.boss.body.enable = false;
              
              // Protect player during entire intro + 1 extra second
              scene.player.invincibility = 250;
              // Skip the flashing alpha effect for boss intro
              scene.player._bossIntroProtect = true;
              
              const rw0 = bd.roomRight - bd.roomLeft;
              // Draw room overlay
              scene.bossOverlay.setVisible(true);
              scene.drawBossOverlay();
              
              // Camera zoom into boss room
              scene.cameras.main.zoomTo(1.25, 500);
              scene.cameras.main.pan(bd.roomLeft + rw0/2, 260, 500);
              
              // Boss drop-in animation
              scene.tweens.add({
                targets: scene.boss,
                y: bd.y,
                scaleX: 1, scaleY: 1,
                alpha: 1,
                duration: 1000,
                ease: 'Bounce.easeOut'
              });
              
              // DRAMATIC BOSS NAME TEXT & HELP INSTRUCTIONS
              const displayBossName = biome === 'river' ? "EL ELEGANTE VERISS" : "ALFIL EXILIADO";
              const displayBossColor = biome === 'river' ? "#22d3ee" : "#c084fc";
              const bossNameText = scene.add.text(bd.roomLeft + rw0/2, 120, displayBossName, {
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontStyle: 'bold',
                fill: displayBossColor,
                stroke: '#1a0030',
                strokeThickness: 6,
                align: 'center'
              }).setOrigin(0.5).setDepth(10).setAlpha(0).setScale(2);
              
              const displayHelpText = biome === 'river'
                ? "¡ATÁCALO CON UN DASH (TECLA X / C) O CAYENDO DESDE ARRIBA!"
                : "¡ATÁCALO CON UN DASH (TECLA X / C) O PISANDO SU CABEZA!";
              const bossHelpText = scene.add.text(bd.roomLeft + rw0/2, 165, displayHelpText, {
                fontFamily: "'Outfit', sans-serif",
                fontSize: '12px',
                fontStyle: 'bold',
                fill: '#fef08a',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
              }).setOrigin(0.5).setDepth(10).setAlpha(0);
              
              scene.tweens.add({
                targets: bossNameText,
                alpha: 1, scaleX: 1, scaleY: 1,
                duration: 600, ease: 'Back.easeOut',
                onComplete: () => {
                  scene.tweens.add({
                    targets: bossNameText,
                    alpha: 0, y: 90,
                    duration: 800, delay: 1800,
                    onComplete: () => bossNameText.destroy()
                  });
                }
              });
              
              scene.tweens.add({
                targets: bossHelpText,
                alpha: 1,
                duration: 600,
                delay: 200,
                onComplete: () => {
                  scene.tweens.add({
                    targets: bossHelpText,
                    alpha: 0,
                    duration: 800,
                    delay: 2200,
                    onComplete: () => bossHelpText.destroy()
                  });
                }
              });
              
              // Intro particles burst
              const introPartColor = biome === 'river' ? 0x22d3ee : 0xa855f7;
              for (let i=0;i<30;i++) {
                scene.time.delayedCall(800 + i*25, () => {
                  if (!scene.bossRoomActive) return;
                  const a = (i/30)*Math.PI*2;
                  const sp = scene.add.circle(scene.boss.x, scene.boss.y, Math.random()*3+2, introPartColor, 0.8);
                  sp.setDepth(6);
                  scene.tweens.add({
                    targets: sp, alpha: 0, scale: 0.05,
                    x: sp.x+Math.cos(a)*90, y: sp.y+Math.sin(a)*90,
                    duration: 600, onComplete: ()=>sp.destroy()
                  });
                });
              }
              
              // Change to boss music
              self.stopMusic();
              self.startBossMusic();
              
              // Show health bar
              const hb = document.getElementById('boss-health-bar');
              if (hb) hb.style.display = 'block';
              
              // Start fight after dramatic pause
              scene.time.delayedCall(1800, () => {
                scene.bossIntro = false;
                scene.bossActive = true;
                scene.boss.body.enable = true;
                scene.bossInvincible = 30;
                scene.player._bossIntroProtect = false;
                scene.player.invincibility = 30; // brief post-intro protection
              });
            }
            
            if (scene.bossActive && !scene.bossIntro) {
              // OPTIMIZED: drawBossOverlay() is static and only drawn once in createBossWalls/activation
              
              if (scene.bossInvincible > 0) {
                scene.bossInvincible--;
                scene.boss.setAlpha(scene.bossInvincible%4<2?0.4:1);
              } else scene.boss.setAlpha(1);
              
              if (biome === 'river') {
                // --- EL ELEGANTE VERISS AI: Sinusoidal horizontal float + targeted charge ---
                if (scene.boss.state === 'floating') {
                  scene.boss.chargeTimer++;
                  
                  // Move horizontally back and forth
                  const bx = scene.boss.x + scene.boss.moveDirX * scene.boss.speed * 0.015;
                  scene.boss.x = Phaser.Math.Clamp(bx, scene.boss.minX, scene.boss.maxX);
                  if (scene.boss.x <= scene.boss.minX || scene.boss.x >= scene.boss.maxX) {
                    scene.boss.moveDirX *= -1; // reverse
                  }
                  
                  // Smooth sinusoidal wave on Y
                  scene.boss.floatAngle += 0.035;
                  scene.boss.y = scene.boss.baseY + Math.sin(scene.boss.floatAngle) * 35;
                  scene.boss.setFlipX(scene.boss.moveDirX < 0);
                  scene.boss.clearTint();
                  
                  // Trigger charge warning after a few seconds
                  if (scene.boss.chargeTimer >= 180) {
                    scene.boss.state = 'pre_charge';
                    scene.boss.chargeTimer = 0;
                    scene.boss.setTint(0xff8888); // visual alert
                  }
                } 
                else if (scene.boss.state === 'pre_charge') {
                  scene.boss.chargeTimer++;
                  // Flash visual warning
                  if (scene.boss.chargeTimer % 10 < 5) {
                    scene.boss.setTint(0xff3333);
                  } else {
                    scene.boss.setTint(0xffffff);
                  }
                  
                  // Lock facing direction
                  scene.boss.setFlipX(scene.player.x < scene.boss.x);
                  
                  if (scene.boss.chargeTimer > 35) {
                    scene.boss.state = 'charging';
                    scene.boss.chargeTimer = 0;
                    self.synthesizeSound('jump'); // swoosh audio
                    
                    const angle = Phaser.Math.Angle.Between(scene.boss.x, scene.boss.y, scene.player.x, scene.player.y);
                    scene.boss.chargeVx = Math.cos(angle) * scene.boss.speed * 0.06;
                    scene.boss.chargeVy = Math.sin(angle) * scene.boss.speed * 0.06;
                  }
                } 
                else if (scene.boss.state === 'charging') {
                  scene.boss.chargeTimer++;
                  scene.boss.setTint(0x22d3ee); // charging cyan tint
                  
                  // Trail bubbles
                  if (scene.boss.chargeTimer % 3 === 0) {
                    const trailBub = scene.add.circle(scene.boss.x + (scene.boss.flipX ? 20 : -20), scene.boss.y + Math.random()*30 - 15, Math.random()*3 + 1, 0x22d3ee, 0.8);
                    scene.tweens.add({
                      targets: trailBub,
                      alpha: 0,
                      scale: 0.1,
                      duration: 300,
                      onComplete: () => trailBub.destroy()
                    });
                  }
                  
                  scene.boss.x += scene.boss.chargeVx;
                  scene.boss.y += scene.boss.chargeVy;
                  
                  // Clamp to room bounds
                  scene.boss.x = Phaser.Math.Clamp(scene.boss.x, scene.boss.minX, scene.boss.maxX);
                  scene.boss.y = Phaser.Math.Clamp(scene.boss.y, scene.boss.minY, scene.boss.maxY);
                  
                  if (scene.boss.chargeTimer > 35 || scene.boss.x <= scene.boss.minX || scene.boss.x >= scene.boss.maxX || scene.boss.y <= scene.boss.minY || scene.boss.y >= scene.boss.maxY) {
                    scene.boss.state = 'floating';
                    scene.boss.chargeTimer = 0;
                    scene.boss.clearTint();
                  }
                }
              } else {
                scene.boss.moveTimer++;
                if (scene.boss.moveTimer > 80) {
                  scene.boss.moveTimer = 0;
                  scene.boss.moveDirX = Math.random() < 0.5 ? -1 : 1;
                  scene.boss.moveDirY = Math.random() < 0.5 ? -1 : 1;
                }
                const bx = scene.boss.x + scene.boss.moveDirX * scene.boss.speed * 0.018;
                const by = scene.boss.y + scene.boss.moveDirY * scene.boss.speed * 0.012;
                scene.boss.x = Phaser.Math.Clamp(bx, scene.boss.minX, scene.boss.maxX);
                scene.boss.y = Phaser.Math.Clamp(by, scene.boss.minY, scene.boss.maxY);
                scene.boss.setFlipX(scene.boss.moveDirX < 0);
              }
              
              scene.boss.projTimer++;
              if (scene.boss.projTimer >= scene.boss.projInterval) {
                scene.boss.projTimer = 0;
                // Only fire projectiles if boss is in floating state in river biome
                if (biome !== 'river' || scene.boss.state === 'floating') {
                  if (biome === 'river') {
                    const useBubbleRing = Math.random() < 0.6;
                    if (useBubbleRing) {
                      const bubbleCount = 6;
                      for (let i = 0; i < bubbleCount; i++) {
                        const angle = (i / bubbleCount) * Math.PI * 2;
                        const proj = scene.add.circle(scene.boss.x, scene.boss.y, 6, 0x22d3ee, 0.95);
                        scene.physics.add.existing(proj, false);
                        proj.body.allowGravity = false;
                        proj.body.setVelocity(Math.cos(angle)*bd.projectileSpeed, Math.sin(angle)*bd.projectileSpeed);
                        scene.bossProjectiles.add(proj);
                        proj.setBlendMode('ADD');
                        scene.tweens.add({targets:proj, alpha:0.1, scale:0.2, duration:2200, onComplete:()=>proj.destroy()});
                      }
                      self.synthesizeSound('jump');
                    } else {
                      // Trident Lightning Bolts: 3 fast golden energy bolts fired in a fan directed at player
                      const numBolts = 3;
                      const angleToPlayer = Phaser.Math.Angle.Between(scene.boss.x, scene.boss.y, scene.player.x, scene.player.y);
                      const spreads = [-0.22, 0, 0.22];
                      for (let i = 0; i < numBolts; i++) {
                        const angle = angleToPlayer + spreads[i];
                        const proj = scene.add.circle(scene.boss.x, scene.boss.y, 5, 0xfacc15, 1.0);
                        scene.physics.add.existing(proj, false);
                        proj.body.allowGravity = false;
                        proj.body.setVelocity(Math.cos(angle)*bd.projectileSpeed*1.3, Math.sin(angle)*bd.projectileSpeed*1.3);
                        scene.bossProjectiles.add(proj);
                        proj.setBlendMode('ADD');
                        scene.tweens.add({targets:proj, alpha:0.2, scale:0.1, duration:1800, onComplete:()=>proj.destroy()});
                      }
                      self.synthesizeSound('damage');
                    }
                  } else {
                    const dirs = [Math.PI/4, -Math.PI/4, Math.PI-Math.PI/4, -(Math.PI-Math.PI/4)];
                    const dir = dirs[Math.floor(Math.random()*dirs.length)];
                    const proj = scene.add.circle(scene.boss.x, scene.boss.y, 5, 0xa855f7, 0.9);
                    scene.physics.add.existing(proj, false);
                    proj.body.allowGravity = false;
                    proj.body.setVelocity(Math.cos(dir)*bd.projectileSpeed, Math.sin(dir)*bd.projectileSpeed);
                    scene.bossProjectiles.add(proj);
                    proj.setBlendMode('ADD');
                    scene.tweens.add({targets:proj, alpha:0.2, scale:0.1, duration:2000, onComplete:()=>proj.destroy()});
                  }
                }
              }
              
              scene.bossProjectiles.getChildren().forEach(proj => {
                if (proj.x<bd.roomLeft-50||proj.x>bd.roomRight+50||proj.y<50||proj.y>440) proj.destroy();
              });
              
              if (scene.bossInvincible === 0) {
                const dx = scene.player.x-scene.boss.x, dy = scene.player.y-scene.boss.y;
                if (Math.sqrt(dx*dx+dy*dy) < 42) {
                  const isDashingHit = scene.player.isDashing;
                  const isStompHit = scene.player.body.velocity.y > 0 && scene.player.y < scene.boss.y;
                  
                  if (isStompHit || isDashingHit) {
                    scene.bossHP--;
                    scene.bossInvincible = 40;
                    if (isDashingHit) {
                      const hitDir = scene.player.x < scene.boss.x ? -1 : 1;
                      scene.player.body.setVelocityX(hitDir * 200);
                      scene.player.isDashing = false;
                      scene.player.body.allowGravity = true;
                    } else {
                      scene.player.body.setVelocityY(biome === 'river' ? -180 : -380);
                    }
                    self.synthesizeSound('stomp');
                    scene.cameras.main.shake(150, 0.012); // camera feedback juice!
                    const fill = document.getElementById('boss-hp-fill');
                    if (fill) fill.style.width = `${(scene.bossHP/scene.boss.hp)*100}%`;
                    
                    const hitPartColor = biome === 'river' ? 0x22d3ee : 0xa855f7;
                    for (let i=0;i<15;i++) {
                      const a=(i/15)*Math.PI*2;
                      const sp=scene.add.circle(scene.boss.x, scene.boss.y, Math.random()*3+1.5, hitPartColor, 0.8);
                      sp.setDepth(5);
                      scene.tweens.add({targets:sp, alpha:0, scale:0.1, x:sp.x+Math.cos(a)*60, y:sp.y+Math.sin(a)*60, duration:400, onComplete:()=>sp.destroy()});
                    }
                    
                    if (scene.bossHP <= 0) {
                      scene.bossActive = false; scene.bossDefeated = true;
                      self.synthesizeSound('victory');
                      const hb = document.getElementById('boss-health-bar');
                      if (hb) hb.style.display = 'none';
                      
                      // Restore camera
                      scene.cameras.main.zoomTo(1, 400);
                      scene.cameras.main.startFollow(scene.player, true, 0.1, 0.1);
                      scene.bossOverlay.setVisible(false);
                      
                      // Restore level music
                      self.stopMusic();
                      self.startMusic();
                      
                      // Boss death + wall removal
                      scene.tweens.add({targets:scene.boss, alpha:0, scaleX:0.1, scaleY:0.1, angle:720, duration:1000, onComplete:()=>scene.boss.destroy()});
                      if (scene.bossWalls) {
                        scene.bossWalls.getChildren().forEach(w=>{scene.tweens.add({targets:w, alpha:0, duration:400, onComplete:()=>w.destroy()});});
                        scene.bossWalls = null;
                      }
                      if (scene.bossWallGlow) { scene.bossWallGlow.destroy(); scene.bossWallGlow = null; }
                      
                      // Spawn White Queen + Portal + Peoncito on boss defeat!
                      if (!scene.whiteQueen) {
                        const gx = (levelDef.goal && levelDef.goal.portalX) || 2150;
                        const gy = (levelDef.goal && levelDef.goal.portalY) || 245;
                        scene.whiteQueen = scene.physics.add.staticSprite(gx, gy, 'white_queen');
                        scene.whiteQueen.setDisplaySize(60, 120);
                        scene.whiteQueen.body.setSize(44, 120);
                        scene.whiteQueen.body.setOffset(8, 0);
                        scene.whiteQueen.setDepth(2);
                        scene.whiteQueen.setAlpha(0);
                        scene.tweens.add({
                          targets: scene.whiteQueen,
                          alpha: 1,
                          duration: 1000
                        });
                        
                        scene.physics.add.overlap(scene.player, scene.whiteQueen, () => {
                          if (self.player.isAscending) return;
                          self.player.isAscending = true;
                          self.completeLevel();
                          scene.particles.stop();
                          scene.player.body.setVelocityX(0);
                          scene.player.body.setVelocityY(-60);
                          scene.player.body.allowGravity = false;
                          
                          scene.cameras.main.zoomTo(1.35, 2200);
                          const victoryText = scene.add.text(scene.player.x, scene.player.y - 130, "¡JAQUE MATE!\nDespertando...", {
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontSize: '22px',
                            fontStyle: 'bold',
                            fill: '#fbbf24',
                            stroke: '#1e0b3b',
                            strokeThickness: 5,
                            align: 'center'
                          }).setOrigin(0.5).setDepth(10);
                          
                          for (let i=0;i<30;i++) {
                            scene.time.delayedCall(i*40,()=>{
                              if(!scene.player.active)return;
                              const a=i*0.35,r=25-i*0.2;
                              const startX = scene.player.x+Math.cos(a)*Math.max(3,r);
                              const startY = scene.player.y+Math.sin(a)*Math.max(3,r);
                              const sp=scene.add.circle(startX,startY,Math.random()*2+1.5,0xfacc15,0.9);
                              sp.setDepth(10);
                              scene.tweens.add({
                                targets:sp,
                                y: startY - 70, // equivalent to Y velocity -100 for 700ms
                                alpha:0,
                                scale:0.1,
                                duration:700,
                                onComplete:()=>sp.destroy()
                              });
                            });
                          }
                          scene.tweens.add({
                            targets: scene.player,
                            angle: 1080, scaleX: 0.05, scaleY: 0.05, alpha: 0,
                            y: scene.player.y - 120, duration: 2200,
                            ease: 'Quad.easeOut',
                            onComplete: () => {
                              victoryText.destroy();
                              self.showVictoryScreen(true);
                            }
                          });
                        });
                      }
                      if (scene.portal) {
                        scene.portal.setVisible(true);
                        scene.portal.setAlpha(0);
                        scene.tweens.add({ targets: scene.portal, alpha: 1, duration: 1000 });
                      }
                      if (scene.portalGlow) {
                        scene.portalGlow.setVisible(true);
                        scene.portalGlow.setAlpha(0);
                        scene.tweens.add({ targets: scene.portalGlow, alpha: 1, duration: 1000 });
                      }
                      if (scene.peoncitoGoal) {
                        scene.peoncitoGoal.setVisible(true);
                        scene.peoncitoGoal.setAlpha(0);
                        scene.tweens.add({ targets: scene.peoncitoGoal, alpha: 1, duration: 1000 });
                      }

                      const deathPartColor = biome === 'river' ? 0x34d399 : 0xc084fc;
                      for (let i=0;i<40;i++) {
                        scene.time.delayedCall(i*20, ()=>{
                          const cp=scene.add.circle(bd.roomLeft+Math.random()*(bd.roomRight-bd.roomLeft), 150+Math.random()*250, Math.random()*3+1.5, i%2===0?deathPartColor:0xfbbf24, 0.8);
                          scene.tweens.add({targets:cp, alpha:0, scale:0.1, y:cp.y-60, duration:800+Math.random()*400, onComplete:()=>cp.destroy()});
                        });
                      }
                    }
                  } else if (scene.player.invincibility===0) {
                    self.lives--; scene.player.invincibility=60;
                    scene.player.body.setVelocityX(scene.player.x<scene.boss.x?-220:220);
                    scene.player.body.setVelocityY(-180);
                    self.synthesizeSound('damage'); scene.doDamageAnim();
                    document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
                    if (self.lives<=0) self.gameOver();
                  }
                }
              }
              scene.bossProjectiles.getChildren().forEach(proj => {
                const pdx=scene.player.x-proj.x, pdy=scene.player.y-proj.y;
                if (Math.sqrt(pdx*pdx+pdy*pdy)<22 && scene.player.invincibility===0) {
                  proj.destroy();
                  self.lives--; scene.player.invincibility=60;
                  scene.player.body.setVelocityX(scene.player.x<proj.x?-160:160);
                  scene.player.body.setVelocityY(-100);
                  self.synthesizeSound('damage'); scene.doDamageAnim();
                  document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
                  if (self.lives<=0) self.gameOver();
                }
              });
            }
          }

          // --- CHESS ROOM (level 4 — El Caballo Salvaje) ---
          
          // Wild Knight L-jump patrol
          if (scene.wildKnights) {
            scene.wildKnights.forEach(knight => {
              if (!knight.active) return;
              knight.jumpTimer++;
              if (knight.jumpTimer >= knight.kd.jumpInterval) {
                knight.jumpTimer = 0;
                // Pick a random L-jump
                const jump = knight.lJumps[Math.floor(Math.random() * knight.lJumps.length)];
                knight.targetX = Phaser.Math.Clamp(knight.x + jump.dx, knight.kd.patrolMinX, knight.kd.patrolMaxX);
                knight.targetY = Phaser.Math.Clamp(knight.y + jump.dy, knight.kd.patrolMinY, knight.kd.patrolMaxY);
                // Visual tween for smooth jump
                scene.tweens.add({
                  targets: knight,
                  x: knight.targetX,
                  y: knight.targetY,
                  duration: 500,
                  ease: 'Quad.easeInOut'
                });
              }
              // Damage on contact
              if (scene.player.invincibility === 0) {
                const dx = scene.player.x - knight.x;
                const dy = scene.player.y - knight.y;
                if (Math.sqrt(dx*dx+dy*dy) < 30) {
                  self.lives--;
                  scene.player.invincibility = 60;
                  scene.player.body.setVelocityX(scene.player.x < knight.x ? -180 : 180);
                  scene.player.body.setVelocityY(-150);
                  self.synthesizeSound('damage');
                  scene.doDamageAnim();
                  document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
                  if (self.lives <= 0) self.gameOver();
                }
              }
            });
          }
          
          if (biome === 'prairie' && levelDef.chessRoom && !scene.chessCompleted) {
            const cr = levelDef.chessRoom;
            if (scene.player.x > cr.triggerX && !scene.chessActive) {
              scene.chessActive = true;
              // Freeze player completely during chess duel
              scene.player.body.setVelocity(0, 0);
              scene.player.body.allowGravity = false;
              scene.player.invincibility = 999;
              scene.player.setAlpha(0.3); // visual feedback: paused
              
              // Create simple walls
              if (!scene.chessWalls) {
                scene.chessWalls = scene.physics.add.staticGroup();
                const ww = 20;
                const wL = scene.add.rectangle(cr.roomLeft, 250, ww, 380, 0x8B6914, 0.6);
                scene.physics.add.existing(wL, true); wL.body.setSize(ww, 380);
                scene.chessWalls.add(wL);
                const wR = scene.add.rectangle(cr.roomRight, 250, ww, 380, 0x8B6914, 0.6);
                scene.physics.add.existing(wR, true); wR.body.setSize(ww, 380);
                scene.chessWalls.add(wR);
                const wT = scene.add.rectangle(cr.roomLeft + (cr.roomRight-cr.roomLeft)/2, 70, cr.roomRight-cr.roomLeft+ww*2, 24, 0x8B6914, 0.6);
                scene.physics.add.existing(wT, true); wT.body.setSize(cr.roomRight-cr.roomLeft+ww*2, 24);
                scene.chessWalls.add(wT);
                scene.physics.add.collider(scene.player, scene.chessWalls);
              }
              
              // Show status
              const statusEl = document.createElement('div');
              statusEl.id = 'chess-prestatus';
              statusEl.style.cssText = 'position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);z-index:60;color:#daa520;font-family:Outfit,sans-serif;font-size:24px;font-weight:800;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,0.8);';
              statusEl.textContent = '🐴 Equis te desafía...';
              document.getElementById('phaser-game-parent').appendChild(statusEl);
              
              self.stopMusic();
              
              setTimeout(() => {
                const el = document.getElementById('chess-prestatus');
                if (el) el.remove();
                
                self.chessDuel = new window.ChessDuel(
                  document.getElementById('phaser-game-parent'),
                  () => { // ON WIN — checkmate to opponent
                    scene.chessCompleted = true;
                    scene.chessActive = false;
                    // Remove chess duel DOM overlay
                    document.getElementById('phaser-game-parent').querySelectorAll('.chess-duel-overlay').forEach(e => e.remove());
                    // Place player safely on the chess room ground
                    scene.player.setPosition(
                      Phaser.Math.Clamp(scene.player.x, cr.roomLeft + 40, cr.roomRight - 40),
                      360
                    );
                    scene.player.body.setVelocity(0, 0);
                    scene.player.body.allowGravity = true;
                    scene.player.setAlpha(1);
                    scene.player.invincibility = 120;
                    scene.lastSafeX = scene.player.x;
                    self.stopMusic();
                    self.startMusic();
                    if (scene.chessWalls) {
                      scene.chessWalls.getChildren().forEach(w => w.destroy());
                      scene.chessWalls = null;
                    }
                    self.chessDuel = null;
                    // Show goal
                    if (!scene.whiteQueen) {
                      const gx = (levelDef.goal && levelDef.goal.portalX) || 2330;
                      const gy = (levelDef.goal && levelDef.goal.portalY) || 245;
                      scene.whiteQueen = scene.physics.add.staticSprite(gx, gy, 'white_queen');
                      scene.whiteQueen.setDisplaySize(60, 120);
                      scene.whiteQueen.setDepth(2);
                      scene.physics.add.overlap(scene.player, scene.whiteQueen, () => {
                        if (self.player.isAscending) return;
                        self.player.isAscending = true;
                        self.completeLevel();
                        scene.particles.stop();
                        scene.player.body.setVelocity(0, -60);
                        scene.player.body.allowGravity = false;
                        const vt = scene.add.text(scene.player.x, scene.player.y-130, "¡JAQUE MATE!\nDespertando...", {
                          fontFamily:"'Outfit',sans-serif",fontSize:'22px',fontStyle:'bold',
                          fill:'#fbbf24',stroke:'#1e0b3b',strokeThickness:5,align:'center'
                        }).setOrigin(0.5).setDepth(10);
                        for (let i=0;i<30;i++) {
                          scene.time.delayedCall(i*40,()=>{
                            if(!scene.player.active)return;
                            const a=i*0.35,r=25-i*0.2;
                            const sp=scene.add.circle(scene.player.x+Math.cos(a)*Math.max(3,r),scene.player.y+Math.sin(a)*Math.max(3,r),Math.random()*2+1.5,0xfacc15,0.9);
                            scene.physics.add.existing(sp,false);sp.body.allowGravity=false;sp.body.setVelocityY(-100);
                            scene.tweens.add({targets:sp,alpha:0,scale:0.1,duration:700,onComplete:()=>sp.destroy()});
                          });
                        }
                        scene.tweens.add({targets:scene.player,angle:1080,scaleX:0.05,scaleY:0.05,alpha:0,y:scene.player.y-120,duration:2200,ease:'Quad.easeOut',onComplete:()=>{vt.destroy();self.showVictoryScreen(true);}});
                      });
                    }
                  },
                  () => { // ON LOSE — instant game over, no second chances
                    self.chessDuel = null;
                    scene.chessActive = false;
                    self.stopMusic();
                    self.gameOver();
                  },
                  () => { // ON STALEMATE — reset level from start
                    self.chessDuel = null;
                    scene.chessActive = false;
                    scene.chessCompleted = false;
                    // Remove chess duel DOM overlay
                    document.getElementById('phaser-game-parent').querySelectorAll('.chess-duel-overlay').forEach(e => e.remove());
                    scene.player.body.allowGravity = true;
                    scene.player.setAlpha(1);
                    scene.player.invincibility = 60;
                    self.stopMusic();
                    // Reset position to start of level
                    scene.player.setPosition(80, 200);
                    scene.player.body.setVelocity(0, 0);
                    if (scene.chessWalls) {
                      scene.chessWalls.getChildren().forEach(w => w.destroy());
                      scene.chessWalls = null;
                    }
                    self.startMusic();
                  }
                );
                self.chessDuel.start();
                self.startChessMusic();
              }, 1200);
            }
          }

          // Spin the magical chess portal of the 64 squares!
          if (scene.portal) {
            scene.portal.angle += 0.6; // smooth rotation
            
            // Orbital particle ring around the portal
            if (!scene.portalOrbitTimer) scene.portalOrbitTimer = 0;
            scene.portalOrbitTimer++;
            if (scene.portalOrbitTimer % 6 === 0) {
              const orbAngle = (scene.portalOrbitTimer * 0.08) % (Math.PI * 2);
              const orbR = 88;
              const pox = 2150 + Math.cos(orbAngle) * orbR;
              const poy = 245 + Math.sin(orbAngle) * orbR;
              const orbColors = [0xfacc15, 0x22d3ee, 0xa855f7, 0xfef08a];
              const orb = scene.add.circle(pox, poy, Math.random() * 1.8 + 1, orbColors[Math.floor(Math.random() * orbColors.length)], 0.7);
              orb.setDepth(2);
              scene.tweens.add({
                targets: orb,
                alpha: 0,
                scale: 0.1,
                y: poy - 25,
                duration: 700 + Math.random() * 400,
                onComplete: () => orb.destroy()
              });
            }
          }

          // Out of bounds pit checks — player fell into a gap and hit world bottom
          const pitLimit = (biome === 'river') ? 442 : 405;
          if (scene.player.y > pitLimit && scene.player.invincibility === 0) {
            self.lives--;
            self.synthesizeSound('damage');
            scene.doDamageAnim();
            document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
            
            if (self.lives > 0) {
              scene.player.setPosition(scene.lastSafeX, 150);
              scene.player.body.setVelocity(0, 0);
              scene.player.invincibility = 60;
              scene.player.wasOnGround = true;
              scene.player.landingSquashTimer = 0;
              scene.player.doubleJumpAvailable = true;
              scene.player.jumpKeyDebounce = 0;
              scene.player.dashAvailable = true;
              scene.player.isDashing = false;
              scene.player.dashTimer = 0;
              scene.player.dashCooldown = 0;
              scene.player.setDisplaySize(38, 56);
              scene.player.setAngle(0);
              scene.player.play('martina-idle');
            } else {
              self.gameOver();
            }
            return;
          }

          if (self.player.isSliding) return;

          // Dragon ground oscillation (level 6 — Sicilian Dragon)
          if (scene.dragonSegments && scene.dragonSegments.length > 0) {
            const dg = levelDef.dragonGround;
            const time = scene.time.now * 0.001 * (dg.frequency * 40);
            scene.dragonSegments.forEach(seg => {
              const offsetY = Math.sin(time + seg.index * dg.phaseStep) * dg.amplitude;
              seg.sprite.y = seg.baseY + offsetY;
              seg.sprite.refreshBody();
            });
          }

          // Fire pillars — erupt from dragon ground (level 6)
          if (scene.firePillars && scene.firePillars.length > 0) {
            scene.firePillars.forEach(pillar => {
              pillar.fireTimer++;
              if (pillar.fireTimer >= pillar.fireData.interval) {
                pillar.fireTimer = 0;
                pillar.fireActive = true;
                pillar.fireHeight = 0;
              }
              if (pillar.fireActive) {
                pillar.fireHeight += 3;
                const maxH = 100;
                if (pillar.fireHeight > maxH) {
                  pillar.fireActive = false;
                  pillar.fireHeight = 0;
                  pillar.setAlpha(0);
                } else {
                  const ratio = pillar.fireHeight / maxH;
                  pillar.setAlpha(0.85);
                  const groundY = 410 + Math.sin(scene.time.now * 0.001 * (levelDef.dragonGround.frequency * 40) + pillar.fireData.x * 0.003) * levelDef.dragonGround.amplitude;
                  pillar.y = groundY - pillar.fireHeight / 2;
                  pillar.setDisplaySize(20, pillar.fireHeight);
                  pillar.body.reset(pillar.x, pillar.y);
                }
              }
            });
          }

          // Block all input while chess duel is active
          if (scene.chessActive && !scene.chessCompleted) return;

          // Track last safe ground position for pit respawn
          if (scene.player.body.touching.down && scene.player.y < 400) {
            scene.lastSafeX = scene.player.x;
          }

          // Keyboard + Virtual Gamepad inputs
          const moveLeft = scene.cursors.left.isDown || scene.keysWASD.left.isDown || self.touchInputs.left;
          const moveRight = scene.cursors.right.isDown || scene.keysWASD.right.isDown || self.touchInputs.right;
          const jumpPressed = scene.cursors.up.isDown || scene.cursors.space.isDown || scene.keysWASD.up.isDown || self.touchInputs.jump;

          // --- CHESS DASH MECHANIC ---
          if (scene.player.dashCooldown > 0) scene.player.dashCooldown--;
          
          const dashPressed = Phaser.Input.Keyboard.JustDown(scene.keysWASD.dash) || Phaser.Input.Keyboard.JustDown(scene.keysWASD.dash2) || self.touchInputs.dash;
          
          if (dashPressed && scene.player.dashAvailable && scene.player.dashCooldown === 0 && !scene.player.isDashing) {
            scene.player.isDashing = true;
            scene.player.dashAvailable = false;
            scene.player.dashTimer = 10; // Dash lasts 10 frames (~160ms)
            scene.player.dashCooldown = 60; // 1 second cooldown
            scene.player.body.allowGravity = false;
            
            let dir = scene.player.flipX ? -1 : 1;
            scene.player.body.setVelocityX(dir * 475);
            scene.player.body.setVelocityY(0);
            
            self.synthesizeSound('coin'); // soft high speed dash chime
            
            // Dash sweep sound!
            const audioCtx = window.GameAudio.ctx;
            if (audioCtx && self.musicEnabled) {
              const now = audioCtx.currentTime;
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(300, now);
              osc.frequency.linearRampToValueAtTime(1000, now + 0.15);
              gain.gain.setValueAtTime(0.06, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(now);
              osc.stop(now + 0.15);
            }
          }
          
          if (scene.player.isDashing) {
            scene.player.dashTimer--;
            if (biome === 'river') {
              for (let i = 0; i < 3; i++) {
                const startX = scene.player.x + (scene.player.flipX ? 15 : -15);
                const startY = scene.player.y + Math.random()*20 - 10;
                const dbub = scene.add.circle(startX, startY, Math.random()*2.5 + 1, 0xffffff, 0.7);
                dbub.setDepth(3);
                const vx = scene.player.flipX ? 80 + Math.random()*60 : -80 - Math.random()*60;
                const vy = Math.random()*20 - 10;
                scene.tweens.add({
                  targets: dbub,
                  x: startX + vx * 0.4, // duration 400ms (0.4s)
                  y: startY + vy * 0.4,
                  alpha: 0,
                  scale: 0.1,
                  duration: 400,
                  onComplete: () => dbub.destroy()
                });
              }
            }
            scene.player.body.setVelocityY(0); // lock Y
            
            // Leave semi-transparent blue ghost trails with cycling tints!
            if (scene.player.dashTimer % 2 === 0) {
              const dashColors = [0x60a5fa, 0x22d3ee, 0xa855f7, 0x38bdf8];
              if (!scene._dashColorIdx) scene._dashColorIdx = 0;
              scene._dashColorIdx = (scene._dashColorIdx + 1) % dashColors.length;
              const ghost = scene.add.sprite(scene.player.x, scene.player.y, scene.player.anims.currentFrame ? scene.player.anims.currentFrame.textureKey : 'player-idle');
              ghost.setFlipX(scene.player.flipX);
              ghost.setDisplaySize(38, 56);
              ghost.setAlpha(0.4);
              ghost.setTint(dashColors[scene._dashColorIdx]);
              ghost.setBlendMode('ADD');
              scene.tweens.add({
                targets: ghost,
                alpha: 0,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 300,
                onComplete: () => ghost.destroy()
              });
            }
            
            if (scene.player.dashTimer <= 0) {
              scene.player.isDashing = false;
              scene.player.body.allowGravity = true;
              scene.player.body.setVelocityX(scene.player.flipX ? -175 : 175);
            }
            return; // bypass standard movement while dashing!
          }

          // Reset dash on touching ground
          if (scene.player.body.touching.down) {
            scene.player.dashAvailable = true;
          }

          // Horizontal movement
          if (moveLeft) {
            scene.player.body.setVelocityX(biome === 'river' ? -145 : -175);
            scene.player.setFlipX(true); // flip sprite left
            scene.particles.start();
            
            if (biome === 'river') {
              scene.player.play('martina-run', true);
            } else if (scene.player.body.touching.down) {
              scene.player.play('martina-run', true);
            }
          } else if (moveRight) {
            scene.player.body.setVelocityX(biome === 'river' ? 145 : 175);
            scene.player.setFlipX(false); // standard flip right
            scene.particles.start();
            
            if (biome === 'river') {
              scene.player.play('martina-run', true);
            } else if (scene.player.body.touching.down) {
              scene.player.play('martina-run', true);
            }
          } else {
            scene.player.body.setVelocityX(0);
            scene.particles.stop();
            
            if (biome === 'river') {
              scene.player.play('martina-idle', true);
            } else if (scene.player.body.touching.down) {
              scene.player.play('martina-idle', true);
            }
          }

          if (biome !== 'river' && !scene.player.body.touching.down) {
            scene.player.play('martina-jump', true);
          }

          // Jump physics ( Arcade jump physics are extremely stable! )
          if (scene.player.jumpKeyDebounce > 0) scene.player.jumpKeyDebounce--;

          if (jumpPressed) {
            if (biome === 'river') {
              // Water swim stroke: can swim at any time, but only if debounce is 0
              if (scene.player.jumpKeyDebounce === 0) {
                scene.player.body.setVelocityY(-230); // swimming up stroke
                self.synthesizeSound('jump'); // soft splash sound
                scene.player.jumpKeyDebounce = 12; // debounce so she doesn't shoot up too fast
                
                // Spawn bubble rings or splash particles when swimming! (OPTIMIZED: no physics)
                for (let i = 0; i < 6; i++) {
                  const startX = scene.player.x;
                  const startY = scene.player.y + 10;
                  const bp = scene.add.circle(startX, startY, Math.random()*2.5 + 1.5, 0xffffff, 0.7);
                  bp.setDepth(3);
                  const vx = Math.random()*60 - 30;
                  const vy = Math.random()*40 + 20;
                  scene.tweens.add({
                    targets: bp,
                    x: startX + vx * 0.6, // duration 600ms (0.6s)
                    y: startY + vy * 0.6,
                    alpha: 0,
                    scale: 0.1,
                    duration: 600,
                    onComplete: () => bp.destroy()
                  });
                }
              }
            } else if (scene.player.body.touching.down) {
              scene.player.body.setVelocityY(-405); // high enough to reach all platforms easily!
              self.synthesizeSound('jump');
              scene.player.doubleJumpAvailable = true;
              scene.player.jumpKeyDebounce = 15; // debounce for 250ms
              
              // Trigger jump stretch!
              scene.player.setDisplaySize(30, 68);
            } else if (scene.player.doubleJumpAvailable && scene.player.jumpKeyDebounce === 0) {
              scene.player.body.setVelocityY(-405);
              scene.player.doubleJumpAvailable = false;
              self.synthesizeSound('victory'); // custom high pitch double jump chime!
              
              scene.player.jumpKeyDebounce = 15;
              scene.player.setDisplaySize(30, 68);
              
              // Spawn the Knight/Horse shockwave silhouette!
              const horse = scene.add.sprite(scene.player.x, scene.player.y, 'knight_burst');
              horse.setAlpha(0.8);
              horse.setScale(0.2);
              horse.setTint(0x22d3ee); // Glowing Cyan
              scene.tweens.add({
                targets: horse,
                scale: 2.2,
                alpha: 0,
                duration: 450,
                onComplete: () => horse.destroy()
              });
            }
          }

          // --- SQUASH AND STRETCH ORGANIC JUICE ---
          // Detect landing
          if (scene.player.body.touching.down && !scene.player.wasOnGround) {
            scene.player.landingSquashTimer = 10; // squash for 10 frames
            
            // Spawn landing dust particles or water bubbles! (OPTIMIZED: no physics)
            for (let i = 0; i < 6; i++) {
              const dustX = scene.player.x + (Math.random() * 20 - 10);
              const dustY = scene.player.y + 26;
              const dustColor = 0xffffff;
              const dust = scene.add.circle(dustX, dustY, Math.random() * 2.5 + 1, dustColor, 0.7);
              dust.setDepth(3);
              const vy = biome === 'river' ? -Math.random() * 60 - 20 : -Math.random() * 30 - 10;
              const vx = (Math.random() * 60 - 30);
              const duration = 350 + Math.random() * 150;
              const durationSeconds = duration / 1000;
              scene.tweens.add({
                targets: dust,
                x: dustX + vx * durationSeconds,
                y: dustY + vy * durationSeconds,
                alpha: 0,
                scale: 0.1,
                duration: duration,
                onComplete: () => dust.destroy()
              });
            }
          }
          scene.player.wasOnGround = scene.player.body.touching.down;

          // Apply deformation math
          if (biome === 'river') {
            // Squeeze/stretch horizontally based on nado speed
            const speed = Math.sqrt(scene.player.body.velocity.x * scene.player.body.velocity.x + scene.player.body.velocity.y * scene.player.body.velocity.y);
            const stretch = 1 + Math.min(0.12, speed / 1500);
            const invStretch = 2 - stretch;
            // Since rotated ~90 deg, unrotated width (38) is vertical thickness, unrotated height (56) is horizontal length
            scene.player.setDisplaySize(38 * invStretch, 56 * stretch);
            
            // Calculate swim angle: horizontal rotation + minor tilt up/down depending on Y movement
            let targetAngle = scene.player.flipX ? -80 : 80;
            if (scene.player.body.velocity.y < -30) {
              targetAngle = scene.player.flipX ? -65 : 65; // facing slightly upward
            } else if (scene.player.body.velocity.y > 30) {
              targetAngle = scene.player.flipX ? -95 : 95; // facing slightly downward
            }
            
            // Subtle floating wobble when not active
            if (Math.abs(scene.player.body.velocity.x) < 5 && Math.abs(scene.player.body.velocity.y) < 5) {
              targetAngle += Math.sin(scene.time.now * 0.003) * 6;
            }
            scene.player.setAngle(targetAngle);
          } else if (scene.player.landingSquashTimer > 0) {
            scene.player.landingSquashTimer--;
            // Squash body on landing (Y goes down, X goes up)
            const squash = 0.8 + (10 - scene.player.landingSquashTimer) * 0.02;
            const invSquash = 1.2 - (10 - scene.player.landingSquashTimer) * 0.02;
            scene.player.setDisplaySize(38 * invSquash, 56 * squash);
            scene.player.setAngle(0);
          } else if (!scene.player.body.touching.down) {
            // Airborn: stretch dynamically based on vertical velocity
            const vY = scene.player.body.velocity.y;
            const stretch = 1 + Math.min(0.2, Math.abs(vY) / 2000);
            const invStretch = 2 - stretch;
            scene.player.setDisplaySize(38 * invStretch, 56 * stretch);
            
            // Slight tilt in direction of movement
            if (scene.player.body.velocity.x < 0) {
              scene.player.setAngle(-6);
            } else if (scene.player.body.velocity.x > 0) {
               scene.player.setAngle(6);
            } else {
              scene.player.setAngle(0);
            }
          } else if (moveLeft || moveRight) {
            // Running on the ground: run tilt and height wobble!
            const runWobble = Math.sin(scene.time.now * 0.015) * 8;
            scene.player.setAngle(runWobble);
            
            const bounceY = 1 + Math.sin(scene.time.now * 0.03) * 0.04;
            const bounceX = 1 - Math.sin(scene.time.now * 0.03) * 0.04;
            scene.player.setDisplaySize(38 * bounceX, 56 * bounceY);
          } else {
            // Standing Idle: breathe slowly
            const breath = 1 + Math.sin(scene.time.now * 0.003) * 0.02;
            scene.player.setDisplaySize(38, 56 * breath);
            scene.player.setAngle(0);
          }
        }
      }
    };

    this.phaserGame = new Phaser.Game(config);
  }

  // --- NATIVE Web Audio API SINTETIZADOR (Música Original Mágica de 64 pasos) ---
  synthesizeSound(type) {
    if (!this.musicEnabled) return;
    
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'jump') {
      // Ethereal upward chime
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
    
    else if (type === 'coin') {
      // Magical sparkling bell
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, now); // C6
      osc.frequency.setValueAtTime(1567.98, now + 0.07); // G6
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    else if (type === 'stomp') {
      // Soft magic bounce
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.linearRampToValueAtTime(80, now + 0.12);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    else if (type === 'damage') {
      // Minor dark chord
      [150, 180, 220].forEach(f => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      });
    }

    else if (type === 'victory') {
      // Triumphant fairy arpeggio fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C5 to C7
      const rhythm = 0.12;
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * rhythm);
        
        gain.gain.setValueAtTime(0, now + idx * rhythm);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * rhythm + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * rhythm + 0.4);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * rhythm);
        osc.stop(now + idx * rhythm + 0.4);
      });
    }
    
    else if (type === 'defeat') {
      // Melancholic, descending retro game over sound
      // Notes: A3 (220Hz), G#3 (207.65Hz), F3 (174.61Hz), E3 (164.81Hz), C3 (130.81Hz)
      const notes = [220.00, 207.65, 174.61, 164.81, 130.81];
      const rhythm = 0.18;
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = idx === notes.length - 1 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * rhythm);
        
        gain.gain.setValueAtTime(0, now + idx * rhythm);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * rhythm + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * rhythm + 0.5);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * rhythm);
        osc.stop(now + idx * rhythm + 0.5);
      });
    }
  }

  // --- START ORIGINAL DREAMY CHIPTUNE BGM (64 steps) ---
  startMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;

    window.GameAudio.init();
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;

    // Level-specific melodies
    let melody, bass, tempo;
    
    if (this.currentLevelIndex === 1) {
      // Level 2 — Clockwork mechanical theme (E minor, rhythmic, gears)
      melody = [
        329.63, 0, 329.63, 392.00, 329.63, 0, 293.66, 0,
        329.63, 0, 329.63, 392.00, 440.00, 392.00, 329.63, 0,
        293.66, 0, 293.66, 329.63, 293.66, 0, 261.63, 0,
        293.66, 0, 293.66, 329.63, 392.00, 329.63, 293.66, 0,
        246.94, 0, 246.94, 293.66, 246.94, 0, 220.00, 0,
        246.94, 0, 246.94, 293.66, 329.63, 293.66, 246.94, 0,
        329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 0,
        392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00, 329.63
      ];
      bass = [
        82.41, 0, 0, 0, 82.41, 0, 0, 0,
        82.41, 0, 0, 0, 82.41, 0, 0, 0,
        73.42, 0, 0, 0, 73.42, 0, 0, 0,
        73.42, 0, 0, 0, 73.42, 0, 0, 0,
        98.00, 0, 0, 0, 98.00, 0, 0, 0,
        98.00, 0, 0, 0, 98.00, 0, 0, 0,
        82.41, 0, 0, 0, 82.41, 0, 0, 0,
        82.41, 0, 0, 0, 82.41, 0, 0, 0
      ];
      tempo = 160; // Faster tempo for mechanical feel
    } else if (this.currentLevelIndex === 2) {
      // Level 3 — Neon mysterious theme (D minor, dark ambient with sharp stabs)
      melody = [
        293.66, 0, 349.23, 0, 440.00, 349.23, 293.66, 0,
        293.66, 349.23, 440.00, 0, 523.25, 440.00, 349.23, 0,
        261.63, 0, 329.63, 0, 392.00, 329.63, 261.63, 0,
        261.63, 329.63, 392.00, 0, 493.88, 392.00, 329.63, 0,
        220.00, 0, 293.66, 0, 349.23, 293.66, 220.00, 0,
        220.00, 293.66, 349.23, 0, 440.00, 349.23, 293.66, 0,
        349.23, 0, 440.00, 523.25, 659.25, 523.25, 440.00, 0,
        440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00, 349.23
      ];
      bass = [
        73.42, 0, 0, 0, 73.42, 0, 0, 0,
        73.42, 0, 0, 0, 73.42, 0, 0, 0,
        65.41, 0, 0, 0, 65.41, 0, 0, 0,
        65.41, 0, 0, 0, 65.41, 0, 0, 0,
        55.00, 0, 0, 0, 55.00, 0, 0, 0,
        55.00, 0, 0, 0, 55.00, 0, 0, 0,
        87.31, 0, 0, 0, 87.31, 0, 0, 0,
        87.31, 0, 0, 0, 87.31, 0, 0, 0
      ];
      tempo = 190;
    } else if (this.currentLevelIndex === 3) {
      // Level 4 — Prairie folk theme (D major, cheerful, acoustic)
      melody = [
        587.33, 0, 587.33, 659.25, 587.33, 523.25, 440.00, 0,
        440.00, 523.25, 587.33, 0, 523.25, 440.00, 392.00, 0,
        392.00, 0, 440.00, 523.25, 440.00, 392.00, 349.23, 0,
        349.23, 392.00, 440.00, 0, 392.00, 349.23, 293.66, 0,
        587.33, 659.25, 783.99, 0, 659.25, 587.33, 523.25, 0,
        523.25, 587.33, 659.25, 0, 587.33, 523.25, 440.00, 0,
        440.00, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 0,
        523.25, 440.00, 392.00, 349.23, 293.66, 349.23, 392.00, 440.00
      ];
      bass = [
        146.83, 0, 0, 0, 146.83, 0, 0, 0,
        110.00, 0, 0, 0, 110.00, 0, 0, 0,
        98.00,  0, 0, 0, 98.00,  0, 0, 0,
        87.31,  0, 0, 0, 87.31,  0, 0, 0,
        146.83, 0, 0, 0, 146.83, 0, 0, 0,
        130.81, 0, 0, 0, 130.81, 0, 0, 0,
        110.00, 0, 0, 0, 110.00, 0, 0, 0,
        73.42,  0, 0, 0, 73.42,  0, 0, 0
      ];
      tempo = 200;
    } else if (this.currentLevelIndex === 4) {
      // Level 5 — Majestic Coronation Theme (C major, triumphant, heroic, fast)
      melody = [
        261.63, 0, 329.63, 0, 392.00, 0, 523.25, 0,
        392.00, 0, 523.25, 0, 659.25, 0, 523.25, 0,
        440.00, 0, 523.25, 0, 587.33, 0, 698.46, 0,
        587.33, 0, 698.46, 0, 783.99, 0, 587.33, 0,
        523.25, 523.25, 493.88, 493.88, 440.00, 440.00, 392.00, 0,
        349.23, 349.23, 392.00, 392.00, 440.00, 440.00, 523.25, 0,
        587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0,
        880.00, 783.99, 698.46, 587.33, 523.25, 392.00, 261.63, 0
      ];
      bass = [
        130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
        130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
        146.83, 0, 146.83, 0, 146.83, 0, 146.83, 0,
        146.83, 0, 146.83, 0, 146.83, 0, 146.83, 0,
        174.61, 0, 174.61, 0, 196.00, 0, 196.00, 0,
        220.00, 0, 220.00, 0, 130.81, 0, 130.81, 0,
        146.83, 0, 164.81, 0, 174.61, 0, 196.00, 0,
        130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0
      ];
      tempo = 140; // Fast and energetic!
    } else if (this.currentLevelIndex === 5) {
      // Level 6 — Sicilian Dragon theme (E minor, aggressive, chromatic, dark fire)
      melody = [
        // Bar 1-2: Dragon's tail coiling down chromatically
        659.25, 622.25, 587.33, 554.37, 523.25, 493.88, 466.16, 440.00,
        // Bar 3-4: Rising fire breath
        440.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00, 0,
        // Bar 5-6: Sharp stabs — Hungarian minor augmented 2nd
        466.16, 0, 466.16, 0, 622.25, 0, 587.33, 0,
        369.99, 0, 369.99, 0, 523.25, 0, 493.88, 0,
        // Bar 7-8: Dragon ascending
        329.63, 392.00, 466.16, 554.37, 659.25, 0, 783.99, 880.00,
        // Bar 9-10: Menacing arpeggio — Em, G, Bdim
        329.63, 0, 392.00, 0, 493.88, 0, 392.00, 0,
        392.00, 0, 466.16, 0, 587.33, 0, 466.16, 0,
        // Bar 11-12: Fire pillar eruption
        622.25, 0, 783.99, 0, 622.25, 587.33, 554.37, 523.25,
        // Bar 13-14: Grand theme — heroic but dark
        659.25, 0, 783.99, 0, 880.00, 783.99, 659.25, 587.33,
        // Bar 15-16: Decay — dragon's roar fading
        523.25, 466.16, 392.00, 329.63, 293.66, 0, 329.63, 0
      ];
      bass = [
        // Deep rumbling E pedal — dragon's heartbeat
        82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41,
        // Rising tension
        82.41, 82.41, 98.00, 98.00, 110.00, 110.00, 123.47, 123.47,
        // Chromatic descent — tail coiling
        130.81, 123.47, 116.54, 110.00, 103.83, 98.00, 92.50, 87.31,
        // Heavy march
        82.41, 0, 82.41, 0, 82.41, 0, 82.41, 0,
        // Second pass — more intense
        98.00, 0, 98.00, 0, 110.00, 0, 110.00, 0,
        87.31, 0, 87.31, 0, 82.41, 0, 82.41, 0,
        // Dragon soaring
        130.81, 0, 110.00, 0, 98.00, 0, 87.31, 0,
        // Final beat — deep and dark
        65.41, 0, 65.41, 0, 82.41, 82.41, 65.41, 0
      ];
      tempo = 165; // Aggressive Sicilian tempo
    } else if (this.currentLevelIndex === 6) {
      // Level 7 — "El Pescador y el Elegante" (F minor, aquatic, flowing, calm but mysterious)
      melody = [
        349.23, 0, 415.30, 466.16, 523.25, 0, 466.16, 415.30,
        349.23, 0, 415.30, 466.16, 523.25, 587.33, 523.25, 0,
        311.13, 0, 392.00, 415.30, 466.16, 0, 415.30, 392.00,
        311.13, 0, 392.00, 415.30, 466.16, 523.25, 466.16, 0,
        293.66, 0, 349.23, 392.00, 415.30, 0, 392.00, 349.23,
        293.66, 0, 349.23, 392.00, 415.30, 466.16, 415.30, 0,
        349.23, 415.30, 523.25, 698.46, 659.25, 523.25, 415.30, 0,
        415.30, 523.25, 659.25, 783.99, 659.25, 523.25, 415.30, 349.23
      ];
      bass = [
        87.31, 0, 87.31, 0, 87.31, 0, 87.31, 0,
        87.31, 0, 87.31, 0, 87.31, 0, 87.31, 0,
        77.78, 0, 77.78, 0, 77.78, 0, 77.78, 0,
        77.78, 0, 77.78, 0, 77.78, 0, 77.78, 0,
        69.30, 0, 69.30, 0, 69.30, 0, 69.30, 0,
        69.30, 0, 69.30, 0, 69.30, 0, 69.30, 0,
        87.31, 0, 87.31, 0, 87.31, 0, 87.31, 0,
        87.31, 0, 87.31, 0, 87.31, 0, 87.31, 0
      ];
      tempo = 160; // Flowing, watery feel
    } else {
      // Level 1 — Dreamy, ethereal, minor-mode fairy tale chords
      melody = [
        440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 440.00, 0,
        440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 659.25, 783.99,
        349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 349.23, 0,
        349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 523.25, 659.25,
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 0,
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 392.00, 493.88,
        329.63, 415.30, 493.88, 659.25, 493.88, 415.30, 329.63, 0,
        329.63, 415.30, 493.88, 659.25, 783.99, 659.25, 587.33, 493.88
      ];
      bass = [
        110.00, 0, 110.00, 0, 110.00, 0, 110.00, 0,
        110.00, 0, 110.00, 0, 110.00, 0, 110.00, 0,
        87.31,  0, 87.31,  0, 87.31,  0, 87.31,  0,
        87.31,  0, 87.31,  0, 87.31,  0, 87.31,  0,
        130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
        130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
        82.41,  0, 82.41,  0, 82.41,  0, 82.41,  0,
        82.41,  0, 82.41,  0, 82.41,  0, 82.41,  0
      ];
      tempo = 220;
    }

    let step = 0;
    this.musicInterval = setInterval(() => {
      if (this.gameState !== 'playing' || !this.musicEnabled) {
        this.stopMusic();
        return;
      }

      const now = audioCtx.currentTime;

      // Lead arpeggio track (Soft Triangle wave for fairytale atmosphere)
      const leadFreq = melody[step];
      if (leadFreq > 0) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(leadFreq, now);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        this.synthNotes.push(osc);
      }

      // Smooth bass track (Sine wave for round low-end)
      const bassFreq = bass[step];
      if (bassFreq > 0) {
        const bOsc = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        
        bGain.gain.setValueAtTime(0.07, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        bOsc.connect(bGain);
        bGain.connect(audioCtx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.2);
        this.synthNotes.push(bOsc);
      }

      step = (step + 1) % melody.length;
      
      // Prevent memory leakage
      if (this.synthNotes.length > 50) {
        this.synthNotes.splice(0, 30);
      }

    }, tempo);
  }

  // --- STOP CHIPTUNE BGM LOOP ---
  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this._chessTickInterval) {
      clearInterval(this._chessTickInterval);
      this._chessTickInterval = null;
    }
    this.synthNotes.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.synthNotes = [];
  }

  // --- BOSS BATTLE MUSIC (intense, dramatic, fast-paced) ---
  startBossMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;
    window.GameAudio.init();
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;
    
    // Aggressive, fast, chromatic descent theme
    const melody = [
      587.33, 0, 554.37, 0, 523.25, 0, 493.88, 0,
      466.16, 0, 440.00, 440.00, 466.16, 466.16, 493.88, 493.88,
      523.25, 523.25, 587.33, 587.33, 659.25, 0, 587.33, 0,
      523.25, 523.25, 493.88, 493.88, 440.00, 0, 392.00, 0,
      659.25, 0, 622.25, 0, 587.33, 0, 554.37, 0,
      523.25, 523.25, 493.88, 493.88, 440.00, 440.00, 392.00, 392.00,
      349.23, 0, 392.00, 0, 440.00, 0, 523.25, 0,
      587.33, 587.33, 659.25, 659.25, 783.99, 783.99, 880.00, 880.00
    ];
    const bass = [
      146.83, 0, 0, 0, 146.83, 0, 146.83, 0,
      130.81, 0, 0, 0, 130.81, 0, 130.81, 0,
      110.00, 0, 0, 0, 110.00, 0, 110.00, 0,
      98.00,  0, 0, 0, 98.00,  0, 98.00,  0,
      164.81, 0, 0, 0, 164.81, 0, 164.81, 0,
      146.83, 0, 0, 0, 146.83, 0, 146.83, 0,
      87.31,  0, 0, 0, 87.31,  0, 87.31,  0,
      110.00, 0, 0, 0, 110.00, 0, 110.00, 0
    ];
    const tempo = 130;
    let step = 0;
    
    this.musicInterval = setInterval(() => {
      if (this.gameState !== 'playing' || !this.musicEnabled) {
        this.stopMusic();
        return;
      }
      const now = audioCtx.currentTime;
      const leadFreq = melody[step];
      if (leadFreq > 0) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(leadFreq, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.12);
        this.synthNotes.push(osc);
      }
      const bassFreq = bass[step];
      if (bassFreq > 0) {
        const bOsc = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        bOsc.type = 'square';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.06, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        bOsc.connect(bGain); bGain.connect(audioCtx.destination);
        bOsc.start(now); bOsc.stop(now + 0.12);
        this.synthNotes.push(bOsc);
      }
      step = (step + 1) % melody.length;
      if (this.synthNotes.length > 80) this.synthNotes.splice(0, 40);
    }, tempo);
  }

  // --- CHESS DUEL MUSIC (tension, clock ticking, increasing pressure) ---
  startChessMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;
    window.GameAudio.init();
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;
    
    // Tension theme: minor, repetitive, clock-like
    const melody = [
      311.13, 0, 311.13, 349.23, 311.13, 293.66, 261.63, 0,
      311.13, 0, 311.13, 349.23, 369.99, 349.23, 311.13, 0,
      293.66, 0, 293.66, 311.13, 293.66, 261.63, 246.94, 0,
      293.66, 0, 293.66, 311.13, 349.23, 311.13, 293.66, 0,
      233.08, 0, 233.08, 261.63, 233.08, 220.00, 207.65, 0,
      233.08, 0, 233.08, 261.63, 293.66, 261.63, 233.08, 0,
      311.13, 349.23, 369.99, 415.30, 369.99, 349.23, 311.13, 0,
      349.23, 369.99, 415.30, 466.16, 415.30, 369.99, 349.23, 311.13
    ];
    const bass = [
      77.78, 0, 0, 0, 77.78, 0, 0, 0,
      77.78, 0, 0, 0, 77.78, 0, 0, 0,
      73.42, 0, 0, 0, 73.42, 0, 0, 0,
      73.42, 0, 0, 0, 73.42, 0, 0, 0,
      58.27, 0, 0, 0, 58.27, 0, 0, 0,
      58.27, 0, 0, 0, 58.27, 0, 0, 0,
      77.78, 0, 0, 0, 77.78, 0, 0, 0,
      77.78, 0, 0, 0, 77.78, 0, 0, 0
    ];
    const tempo = 180;
    let step = 0;
    
    // Tick-tock percussion layer
    const tickInterval = setInterval(() => {
      if (this.gameState !== 'playing' || !this.musicEnabled) {
        clearInterval(tickInterval);
        return;
      }
      const now2 = audioCtx.currentTime;
      const tOsc = audioCtx.createOscillator();
      const tGain = audioCtx.createGain();
      tOsc.type = 'square';
      tOsc.frequency.setValueAtTime(step % 2 === 0 ? 800 : 600, now2);
      tGain.gain.setValueAtTime(0.03, now2);
      tGain.gain.exponentialRampToValueAtTime(0.001, now2 + 0.05);
      tOsc.connect(tGain); tGain.connect(audioCtx.destination);
      tOsc.start(now2); tOsc.stop(now2 + 0.05);
    }, 1000);
    this._chessTickInterval = tickInterval;
    
    this.musicInterval = setInterval(() => {
      if (this.gameState !== 'playing' || !this.musicEnabled) {
        this.stopMusic();
        return;
      }
      const now = audioCtx.currentTime;
      const leadFreq = melody[step];
      if (leadFreq > 0) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(leadFreq, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.16);
        this.synthNotes.push(osc);
      }
      const bassFreq = bass[step];
      if (bassFreq > 0) {
        const bOsc = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.05, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        bOsc.connect(bGain); bGain.connect(audioCtx.destination);
        bOsc.start(now); bOsc.stop(now + 0.16);
        this.synthNotes.push(bOsc);
      }
      step = (step + 1) % melody.length;
      if (this.synthNotes.length > 80) this.synthNotes.splice(0, 40);
    }, tempo);
  }

  // --- DESTROY GAME INSTANCE (CLEANS PHASER) ---
  destroy() {
    this.gameState = 'welcome';
    this.stopMusic();
    this.touchInputs = { left: false, right: false, jump: false };
    
    // Shut down Phaser completely to prevent WebGL leaks and remove canvas
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
  }
  
  // --- GAME OVER HANDLER ---
  gameOver() {
    this.gameState = 'gameover';
    this.stopMusic();
    this.synthesizeSound('defeat'); // Play the sad, descending retro game over sound!
    
    // Completely destroy Phaser first to clean up the canvas
    this.destroy();
    
    // Render standard centered game-screen
    this.container.innerHTML = `
      <div class="game-screen animate-pop">
        <div class="game-screen-img" style="border-color: var(--rose);">
          <img src="/assets/img/super_martina_juego_1780024581060.png" alt="Fin del Juego" style="filter: grayscale(0.8) brightness(0.5) sepia(0.5) hue-rotate(-50deg);">
        </div>
        <h2 style="color: var(--rose);">FIN DEL JUEGO 💀</h2>
        <p style="color: var(--warm-white); opacity: 0.9;">
          Los peones de las sombras te han superado en esta partida. ¡No te rindas! Analiza el tablero y vuelve a intentarlo.
        </p>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="go-btn-map" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">Volver al Mapa ➔</button>
          <button class="btn btn-game-screen" id="go-btn-replay" style="background: var(--rose); color: white;">Reintentar 🔁</button>
        </div>
      </div>
    `;
    
    // Bind buttons
    document.getElementById('go-btn-replay').addEventListener('click', () => {
      window.GameAudio.playMove();
      this.startLevel();
    });
    
    document.getElementById('go-btn-map').addEventListener('click', () => {
      window.GameAudio.playMove();
      this.showWelcomeScreen();
    });
  }

  // --- LEVEL COMPLETE HANDLER ---
  completeLevel() {
    this.gameState = 'victory';
    this.synthesizeSound('victory');
    
    // Save best score for this level
    const levelKey = this.currentLevelIndex;
    const prev = this.bestScores[levelKey] || 0;
    if (this.score > prev) {
      this.bestScores[levelKey] = this.score;
      localStorage.setItem('martina_mario_bestscores', JSON.stringify(this.bestScores));
    }
    
    // Unlock next level
    const nextIdx = levelKey + 1;
    if (nextIdx < this.levels.length && !this.unlockedLevels[nextIdx]) {
      this.unlockedLevels[nextIdx] = true;
      localStorage.setItem('martina_mario_unlocked', JSON.stringify(this.unlockedLevels));
    }
  }

  // --- VICTORY SCREEN ---
  showVictoryScreen(replayLevel) {
    this.stopMusic();
    
    // Completely destroy Phaser first to clean up the canvas
    this.destroy();
    
    // Render standard centered game-screen
    this.container.innerHTML = `
      <div class="game-screen animate-pop">
        <div class="game-screen-img" style="border-color: var(--gold);">
          <img src="/assets/img/super_martina_juego_1780024581060.png" alt="Nivel Completado">
        </div>
        <h2>¡Nivel Completado! 🏆</h2>
        <p style="color: var(--warm-white); opacity: 0.9;">
          Martina ha despertado con éxito del Reino de las 64 Casillas con su bigote y táctica impecables.
        </p>

        <div class="game-screen-stats">
          <div class="stat-item" style="border-color: var(--gold-light); min-width: 100px;">
            <span style="font-weight: 700; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase;">Puntaje</span>
            <div class="stat-val" style="color: var(--gold-light); font-size: 1.5rem; font-weight: 800;">+${this.score}</div>
          </div>
          <div class="stat-item" style="border-color: var(--sage); min-width: 100px;">
            <span style="font-weight: 700; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase;">Monedas</span>
            <div class="stat-val" style="color: var(--sage); font-size: 1.5rem; font-weight: 800;">🪙 x${this.coins}</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="vic-btn-map" style="background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.1); color: var(--warm-white);">Volver al Mapa ➔</button>
          <button class="btn btn-game-screen" id="vic-btn-replay" style="background: var(--gold); color: var(--magic-dark); border-color: var(--gold);">Repetir Nivel 🔄</button>
        </div>
      </div>
    `;
    
    document.getElementById('vic-btn-replay').addEventListener('click', () => {
      window.GameAudio.playMove();
      this.startLevel();
    });
    
    document.getElementById('vic-btn-map').addEventListener('click', () => {
      window.GameAudio.playMove();
      this.showWelcomeScreen();
    });
  }
}

// Register inside namespace
window.MartinaGames.mario = MarioGame;
