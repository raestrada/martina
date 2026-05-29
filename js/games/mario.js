// === JUEGO: SUPER MARTINA · EL SALTO MÁGICO ===
// Minijuego estrella de plataformas en 2D al estilo retro.
// Desarrollado con el potente motor Phaser 3 (cargado dinámicamente)
// y con los assets de ilustración oficiales de Martina para una fidelidad total.

class MarioGame {
  constructor(container) {
    this.container = container;
    
    // Core game state
    this.currentLevelIndex = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.gameState = 'welcome'; // 'welcome', 'playing', 'gameover', 'victory'
    this.musicEnabled = localStorage.getItem('martina_mario_mute') !== 'true';
    
    // Unlocked levels progress tracking
    this.unlockedLevels = JSON.parse(localStorage.getItem('martina_mario_unlocked')) || [true];
    while (this.unlockedLevels.length < 16) {
      this.unlockedLevels.push(false);
    }

    // Best score per level tracking (for trophies & completion %)
    this.bestScores = JSON.parse(localStorage.getItem('martina_mario_bestscores')) || {};
    // Max possible score per level
    this.maxScores = (window.MartinaLevels && window.MartinaLevels.maxScore) || { 0: 9900 };

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
    while (this.unlockedLevels.length < 16) {
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
      
      const displayDesc = idx === 0 ? level.desc : `${level.desc} (Próximamente)`;
      
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
              <div class="touch-btn left" id="touch-left">◀</div>
              <div class="touch-btn right" id="touch-right">▶</div>
              <div class="touch-btn dash" id="touch-dash" style="background: rgba(245,158,11,0.25); border-color: rgba(245,158,11,0.45); color: #fef08a;">B</div>
              <div class="touch-btn jump" id="touch-jump">A</div>
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

    const muteBtn = document.getElementById('mario-btn-mute');
    muteBtn.addEventListener('click', () => {
      this.musicEnabled = !this.musicEnabled;
      localStorage.setItem('martina_mario_mute', (!this.musicEnabled).toString());
      muteBtn.textContent = this.musicEnabled ? '🔊 Sonido' : '🔇 Mute';
      if (this.musicEnabled) {
        this.startMusic();
      } else {
        this.stopMusic();
      }
    });

    // Touch controls binder
    const bindTouch = (id, field) => {
      const btn = document.getElementById(id);
      if (btn) {
        const setTouch = (e, val) => {
          e.preventDefault();
          this.touchInputs[field] = val;
        };
        btn.addEventListener('touchstart', (e) => setTouch(e, true));
        btn.addEventListener('touchend', (e) => setTouch(e, false));
        btn.addEventListener('mousedown', (e) => setTouch(e, true));
        btn.addEventListener('mouseup', (e) => setTouch(e, false));
      }
    };

    bindTouch('touch-left', 'left');
    bindTouch('touch-right', 'right');
    bindTouch('touch-dash', 'dash');
    bindTouch('touch-jump', 'jump');

    // Inject custom premium victory screen overlay styling if not already present
    if (!document.getElementById('mario-victory-styles')) {
      const styles = document.createElement('style');
      styles.id = 'mario-victory-styles';
      styles.textContent = `
        .mario-victory-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.4s ease-out forwards;
        }
        .mario-victory-panel {
          background: rgba(30, 27, 75, 0.9);
          border: 2px solid rgba(250, 204, 21, 0.55);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(126, 34, 206, 0.3);
          color: #ffffff;
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .mario-victory-crown {
          font-size: 50px;
          margin-bottom: 10px;
          animation: bounce 2s infinite ease-in-out;
        }
        .mario-victory-panel h2 {
          font-size: 26px;
          color: #fbbf24;
          margin: 10px 0;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
        }
        .mario-victory-msg {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .mario-victory-stats {
          display: flex;
          justify-content: space-around;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 12px;
          padding: 15px 10px;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mario-stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mario-stat-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }
        .mario-stat-num {
          font-size: 22px;
          font-weight: 800;
          color: #38bdf8;
        }
        .mario-stat-name {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .mario-victory-buttons {
          display: flex;
          gap: 15px;
        }
        .mario-vic-btn {
          flex: 1;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease-out;
          border: none;
          font-family: inherit;
        }
        .mario-vic-btn.btn-replay {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .mario-vic-btn.btn-replay:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .mario-vic-btn.btn-map {
          background: linear-gradient(135deg, #e11d48, #be123c);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }
        .mario-vic-btn.btn-map:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(225, 29, 72, 0.5);
        }
        
        /* Game Over Premium Styling */
        .mario-gameover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.4s ease-out forwards;
        }
        .mario-gameover-panel {
          background: rgba(30, 27, 75, 0.9);
          border: 2px solid rgba(239, 68, 68, 0.55);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(220, 38, 38, 0.25);
          color: #ffffff;
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .mario-gameover-skull {
          font-size: 50px;
          margin-bottom: 10px;
          animation: wobble-head 2.5s infinite ease-in-out;
        }
        .mario-gameover-panel h2 {
          font-size: 26px;
          color: #ef4444;
          margin: 10px 0;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
        }
        .mario-gameover-msg {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .mario-gameover-stats {
          display: flex;
          justify-content: space-around;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 12px;
          padding: 15px 10px;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mario-gameover-buttons {
          display: flex;
          gap: 15px;
        }
        @keyframes wobble-head {
          0%, 100% { transform: rotate(0) translateY(0); }
          25% { transform: rotate(-5deg) translateY(-2px); }
          75% { transform: rotate(5deg) translateY(-2px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Progress, trophies & stats styles now in games.css */
      `;
      document.head.appendChild(styles);
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
          
          // Generate a smooth particle sparkle texture — dual color variant for variety
          const sparkleCanvas = document.createElement('canvas');
          sparkleCanvas.width = 16;
          sparkleCanvas.height = 16;
          const sctx = sparkleCanvas.getContext('2d');
          const sgrad = sctx.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad.addColorStop(0, 'rgba(255, 223, 0, 1)');
          sgrad.addColorStop(0.3, 'rgba(255, 180, 0, 0.8)');
          sgrad.addColorStop(1, 'rgba(255, 180, 0, 0)');
          sctx.fillStyle = sgrad;
          sctx.beginPath();
          sctx.arc(8, 8, 8, 0, Math.PI * 2);
          sctx.fill();
          scene.textures.addCanvas('sparkle', sparkleCanvas);
          
          // Cyan variant sparkle
          const sparkleCyan = document.createElement('canvas');
          sparkleCyan.width = 16;
          sparkleCyan.height = 16;
          const sctx2 = sparkleCyan.getContext('2d');
          const sgrad2 = sctx2.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad2.addColorStop(0, 'rgba(34, 211, 238, 1)');
          sgrad2.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
          sgrad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
          sctx2.fillStyle = sgrad2;
          sctx2.beginPath();
          sctx2.arc(8, 8, 8, 0, Math.PI * 2);
          sctx2.fill();
          scene.textures.addCanvas('sparkle_cyan', sparkleCyan);
          
          // Purple variant sparkle
          const sparklePurple = document.createElement('canvas');
          sparklePurple.width = 16;
          sparklePurple.height = 16;
          const sctx3 = sparklePurple.getContext('2d');
          const sgrad3 = sctx3.createRadialGradient(8, 8, 0, 8, 8, 8);
          sgrad3.addColorStop(0, 'rgba(167, 139, 250, 1)');
          sgrad3.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)');
          sgrad3.addColorStop(1, 'rgba(139, 92, 246, 0)');
          sctx3.fillStyle = sgrad3;
          sctx3.beginPath();
          sctx3.arc(8, 8, 8, 0, Math.PI * 2);
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
              
              // Hair back (behind the face)
              pCtx.fillStyle = '#3f1d0b'; // Dark brown
              pCtx.beginPath();
              pCtx.arc(16, 17, 9, Math.PI, 0); // top half
              pCtx.rect(7, 17, 18, 13); // back locks
              pCtx.fill();
              
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
              
              // Draw Arms
              pCtx.fillStyle = '#ffffff'; // Sleeves
              pCtx.fillRect(8, 23, 2, 4);
              pCtx.fillRect(22, 23, 2, 4);
              pCtx.fillStyle = '#fed7aa'; // Hands
              pCtx.beginPath();
              pCtx.arc(9, 28, 2, 0, Math.PI*2);
              pCtx.arc(23, 28, 2, 0, Math.PI*2);
              pCtx.fill();
              
              // --- ANCHOR DYNAMIC LEGS DRAWING BASED ON FRAMES ---
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
                // Left leg forward, right leg backward
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
                // Pass position: legs overlapping in center
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
                // Right leg forward, left leg backward
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
                // Legs bent slightly higher!
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

            // 7. Gold Crown Secret Collectible Canvas (size 32x32)
            const crCanvas = document.createElement('canvas');
            crCanvas.width = 32;
            crCanvas.height = 32;
            const crCtx = crCanvas.getContext('2d');
            const crGrad = crCtx.createLinearGradient(4, 4, 28, 28);
            crGrad.addColorStop(0, '#fbbf24'); // Yellow Amber
            crGrad.addColorStop(1, '#d97706'); // Gold Bronze
            crCtx.fillStyle = crGrad;
            crCtx.beginPath();
            crCtx.moveTo(4, 26);
            crCtx.lineTo(28, 26);
            crCtx.lineTo(26, 12);
            crCtx.lineTo(20, 18);
            crCtx.lineTo(16, 8); // center crown peak
            crCtx.lineTo(12, 18);
            crCtx.lineTo(6, 12);
            crCtx.closePath();
            crCtx.fill();
            
            // Ruby and sapphire jewels on crown peaks
            crCtx.fillStyle = '#ef4444'; // Red center ruby
            crCtx.beginPath();
            crCtx.arc(16, 6, 2, 0, Math.PI*2);
            crCtx.fill();
            crCtx.fillStyle = '#3b82f6'; // Blue sapphires on side peaks
            crCtx.beginPath();
            crCtx.arc(6, 10, 1.5, 0, Math.PI*2);
            crCtx.arc(26, 10, 1.5, 0, Math.PI*2);
            crCtx.fill();
            
            scene.textures.addCanvas('crown_gold', crCanvas);
            
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
            } else {
              // Premium chess-themed platform block
              // Base body — deep magical blue
              const bodyGrad = [0x1e3a8a, 0x1e40af, 0x1d4ed8]; // subtle gradient via layers
              block.fillStyle(bodyGrad[0], 0.85);
              block.fillRect(p.x, p.y, p.w, p.h);
              block.fillStyle(bodyGrad[1], 0.45);
              block.fillRect(p.x, p.y + 2, p.w, p.h - 4);
              
              // Glowing cyan neon grass edge (thick)
              block.fillStyle(0x38bdf8, 0.55);
              block.fillRect(p.x, p.y, p.w, 6);
              block.fillStyle(0x7dd3fc, 0.45);
              block.fillRect(p.x, p.y, p.w, 2);
              
              // Grass blade tufts along the top
              block.fillStyle(0x34d399, 0.35);
              for (let gx = p.x + 2; gx < p.x + p.w - 4; gx += 6) {
                const bh = 2 + Math.random() * 3;
                block.fillRect(gx + Math.random(), p.y - bh, 1.5, bh);
              }
              
              // Checkered grid detail on body
              block.fillStyle(0x1d4ed8, 0.20);
              for (let x = p.x; x < p.x + p.w; x += 16) {
                block.fillRect(x, p.y + 8, 8, 6);
                block.fillRect(x + 8, p.y + 14, 8, 6);
              }
              
              // Bevel highlight (top-left inner)
              block.fillStyle(0x93c5fd, 0.12);
              block.fillRect(p.x + 2, p.y + 6, p.w - 4, 1);
              block.fillRect(p.x + 1, p.y + 6, 1, p.h - 8);
              
              // Bevel shadow (bottom-right inner)
              block.fillStyle(0x0f172a, 0.15);
              block.fillRect(p.x + 2, p.y + p.h - 2, p.w - 4, 1);
              
              // Crisp outline
              block.lineStyle(1.5, 0x1d4ed8, 0.8);
              block.strokeRect(p.x, p.y, p.w, p.h);
            }

            // Generate physics body
            scene.physics.add.existing(block, true);
            block.body.setSize(p.w, p.h);
            block.body.setOffset(p.x, p.y);
            
            scene.platforms.add(block);
          });

          // 3. Create Player (Martina using the actual cuento illustration!)
          scene.player = scene.physics.add.sprite(80, 200, 'player');
          scene.player.setCollideWorldBounds(true);
          scene.player.setSize(26, 44);
          scene.player.setOffset(10, 8);
          // Scale her illustration down to fit the platform grids perfectly
          scene.player.setDisplaySize(38, 56);
          scene.player.body.setGravityY(100); // stable arcade physics gravity
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
          scene.lastSafeX = 80; // track last safe position for pit respawn

          // Damage animation helper — red flash, particles, camera shake
          scene.doDamageAnim = () => {
            const p = scene.player;
            // Red tint flash
            p.setTint(0xff4444);
            scene.time.delayedCall(120, () => {
              if (p.active) p.clearTint();
            });
            // Red damage particles burst outward
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
              const speed = 70 + Math.random() * 110;
              const dp = scene.add.circle(p.x, p.y, Math.random() * 3 + 1.5, 0xff4444, 0.9);
              scene.physics.add.existing(dp, false);
              dp.body.allowGravity = true;
              dp.body.setGravityY(350);
              dp.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed - 80);
              scene.tweens.add({
                targets: dp,
                alpha: 0,
                scale: 0.05,
                duration: 450 + Math.random() * 250,
                onComplete: () => dp.destroy()
              });
            }
            // Subtle camera shake
            scene.cameras.main.shake(100, 0.005);
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
            const coin = scene.add.graphics({x: c.x, y: c.y});
            // Draw a beautiful rotating/pulsing gold star coin
            coin.fillStyle(0xfacc15, 1);
            coin.beginPath();
            // Draw a star shape
            for (let i = 0; i < 5; i++) {
              coin.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 8, Math.sin((18 + i * 72) * Math.PI / 180) * 8);
              coin.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 3, Math.sin((54 + i * 72) * Math.PI / 180) * 3);
            }
            coin.closePath();
            coin.fill();
            coin.lineStyle(1.2, 0xe76f51, 1);
            coin.stroke();

            scene.coins.add(coin); // Add first to the grav-safe group
            coin.body.setCircle(10, -10, -10);
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
            const enemy = scene.physics.add.sprite(e.x, e.y, 'enemy');
            enemy.setDisplaySize(32, 42);
            enemy.setSize(24, 34);
            enemy.setOffset(4, 4);
            enemy.setCollideWorldBounds(true);
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
            const airEnemy = scene.physics.add.sprite(ae.x, ae.y, 'flying_bishop_0');
            airEnemy.setDisplaySize(28, 42);
            airEnemy.setSize(22, 34);
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

          // 6.9 Boss System — Alfil Exiliado (level 3 neon biome)
          scene.bossActive = false;
          scene.bossDefeated = false;
          scene.bossRoomActive = false;
          scene.bossHP = 0;
          scene.bossInvincible = 0;
          
          if (biome === 'neon' && levelDef.bossData) {
            const bd = levelDef.bossData;
            
            // Boss sprite (invisible until room activated)
            scene.boss = scene.physics.add.sprite(bd.x, bd.y, 'boss_alfil');
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
            scene.boss.state = 'idle'; // idle, moving, shooting
            scene.boss.moveDir = 1;
            scene.boss.moveDirX = 1;
            scene.boss.moveDirY = -1;
            scene.boss.moveTimer = 0;
            scene.boss.minX = bd.roomLeft + 40;
            scene.boss.maxX = bd.roomRight - 40;
            scene.boss.minY = 180;
            scene.boss.maxY = 340;
            
            // Boss room walls — created dynamically when room activates
            scene.bossWalls = null;
            scene.bossWallGlow = null;
            scene.bossRoomActive = false;
            
            // Dark overlay for outside the boss room (dramatic effect)
            scene.bossOverlay = scene.add.graphics();
            scene.bossOverlay.setDepth(15);
            scene.bossOverlay.setScrollFactor(0);
            scene.bossOverlay.setVisible(false);

            scene.drawBossOverlay = function() {
              const camX = scene.cameras.main.scrollX;
              const rx = bd.roomLeft - camX;
              const rw = bd.roomRight - bd.roomLeft;
              const ry = 82, rh = 348;
              scene.bossOverlay.clear();
              scene.bossOverlay.fillStyle(0x040010, 0.5);
              // Draw 4 rectangles around the room instead of trying to punch a hole
              scene.bossOverlay.fillRect(0, 0, 800, ry);                    // top
              scene.bossOverlay.fillRect(0, ry + rh, 800, 450 - ry - rh);   // bottom
              scene.bossOverlay.fillRect(0, ry, rx, rh);                     // left
              scene.bossOverlay.fillRect(rx + rw, ry, 800 - rx - rw, rh);   // right
              // Neon border
              scene.bossOverlay.lineStyle(2.5, 0xa855f7, 0.85);
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
              scene.bossWallGlow.lineStyle(3, 0xa855f7, 0.9);
              scene.bossWallGlow.strokeRect(bd.roomLeft, 90, rw, 330);
              scene.bossWallGlow.lineStyle(1, 0xc084fc, 0.4);
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
            healthBarHTML.style.cssText = 'display:none;position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:100;background:rgba(0,0,0,0.7);border:2px solid #8b5cf6;border-radius:10px;padding:6px 14px;color:#fff;font-family:Outfit,sans-serif;font-size:13px;font-weight:700;text-align:center;min-width:200px;';
            healthBarHTML.innerHTML = '<span style="color:#c084fc;">Alfil Exiliado</span><div style="background:rgba(255,255,255,0.1);height:8px;border-radius:4px;margin-top:4px;overflow:hidden;"><div id="boss-hp-fill" style="background:linear-gradient(90deg,#ef4444,#a855f7);height:100%;width:100%;border-radius:4px;transition:width 0.3s;"></div></div>';
            document.getElementById('phaser-game-parent').appendChild(healthBarHTML);
            
            // Collider: player vs boss walls
            scene.physics.add.collider(scene.player, scene.bossWalls);
          }

          // 7. Goal — biome-specific (Portal+Queen for grass, Trophy for clockwork)
          if (biome === 'clockwork') {
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
          scene.portalGlow = scene.add.graphics();
          scene.portalGlow.fillStyle(0x7e22ce, 0.15);
          scene.portalGlow.beginPath();
          scene.portalGlow.arc(gx, gy, 100, 0, Math.PI * 2);
          scene.portalGlow.fill();
          scene.portalGlow.setDepth(0);
          // 7.2. White Queen
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
          // 7.3. Peoncito
          scene.peoncitoGoal = scene.add.sprite(gx - 80, gy + 45, 'peoncito_friendly');
          scene.peoncitoGoal.setDisplaySize(32, 42);
          scene.peoncitoGoal.setDepth(2);
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
                const coin = scene.add.graphics({x: enemy.x, y: enemy.y - 12});
                coin.fillStyle(0xfacc15, 1);
                coin.beginPath();
                for (let s = 0; s < 5; s++) {
                  coin.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * 8, Math.sin((18 + s * 72) * Math.PI / 180) * 8);
                  coin.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * 3, Math.sin((54 + s * 72) * Math.PI / 180) * 3);
                }
                coin.closePath();
                coin.fill();
                coin.lineStyle(1.2, 0xe76f51, 1);
                coin.stroke();
                
                scene.coins.add(coin);
                coin.body.setCircle(10, -10, -10);
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

          // Goal overlap — biome-specific (Queen for grass, Trophy for clockwork)
          if (biome === 'clockwork' && scene.trophyGoal) {
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

          // --- BOSS SYSTEM UPDATE (Alfil Exiliado, level 3) ---
          if (biome === 'neon' && scene.boss && !scene.bossDefeated) {
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
              // Draw room overlay — darken outside, clear inside with neon border
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
              
              // DRAMATIC BOSS NAME TEXT
              const bossName = scene.add.text(bd.roomLeft + rw0/2, 130, "ALFIL EXILIADO", {
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontStyle: 'bold',
                fill: '#c084fc',
                stroke: '#1a0030',
                strokeThickness: 6,
                align: 'center'
              }).setOrigin(0.5).setDepth(10).setAlpha(0).setScale(2);
              
              scene.tweens.add({
                targets: bossName,
                alpha: 1, scaleX: 1, scaleY: 1,
                duration: 600, ease: 'Back.easeOut',
                onComplete: () => {
                  scene.tweens.add({
                    targets: bossName,
                    alpha: 0, y: 100,
                    duration: 800, delay: 1200,
                    onComplete: () => bossName.destroy()
                  });
                }
              });
              
              // Intro particles burst
              for (let i=0;i<30;i++) {
                scene.time.delayedCall(800 + i*25, () => {
                  if (!scene.bossRoomActive) return;
                  const a = (i/30)*Math.PI*2;
                  const sp = scene.add.circle(scene.boss.x, scene.boss.y, Math.random()*3+2, 0xa855f7, 0.8);
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
              if (scene.bossOverlay && scene.bossOverlay.visible) {
                scene.drawBossOverlay();
              }
              
              if (scene.bossInvincible > 0) {
                scene.bossInvincible--;
                scene.boss.setAlpha(scene.bossInvincible%4<2?0.4:1);
              } else scene.boss.setAlpha(1);
              
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
              
              scene.boss.projTimer++;
              if (scene.boss.projTimer >= scene.boss.projInterval) {
                scene.boss.projTimer = 0;
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
              
              scene.bossProjectiles.getChildren().forEach(proj => {
                if (proj.x<bd.roomLeft-50||proj.x>bd.roomRight+50||proj.y<50||proj.y>440) proj.destroy();
              });
              
              if (scene.bossInvincible === 0) {
                const dx = scene.player.x-scene.boss.x, dy = scene.player.y-scene.boss.y;
                if (Math.sqrt(dx*dx+dy*dy) < 42) {
                  if (scene.player.body.velocity.y>0 && scene.player.y<scene.boss.y) {
                    scene.bossHP--;
                    scene.bossInvincible = 40;
                    scene.player.body.setVelocityY(-380);
                    self.synthesizeSound('stomp');
                    const fill = document.getElementById('boss-hp-fill');
                    if (fill) fill.style.width = `${(scene.bossHP/scene.boss.hp)*100}%`;
                    for (let i=0;i<15;i++) {
                      const a=(i/15)*Math.PI*2;
                      const sp=scene.add.circle(scene.boss.x, scene.boss.y, Math.random()*3+1.5, 0xa855f7, 0.8);
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
                      for (let i=0;i<40;i++) {
                        scene.time.delayedCall(i*20, ()=>{
                          const cp=scene.add.circle(bd.roomLeft+Math.random()*(bd.roomRight-bd.roomLeft), 150+Math.random()*250, Math.random()*3+1.5, i%2===0?0xc084fc:0xfbbf24, 0.8);
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
          if (scene.player.y > 405) {
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
            scene.player.body.setVelocityX(-175);
            scene.player.setFlipX(true); // flip sprite left
            scene.particles.start();
            
            if (scene.player.body.touching.down) {
              scene.player.play('martina-run', true);
            }
          } else if (moveRight) {
            scene.player.body.setVelocityX(175);
            scene.player.setFlipX(false); // standard flip right
            scene.particles.start();
            
            if (scene.player.body.touching.down) {
              scene.player.play('martina-run', true);
            }
          } else {
            scene.player.body.setVelocityX(0);
            scene.particles.stop();
            
            if (scene.player.body.touching.down) {
              scene.player.play('martina-idle', true);
            }
          }

          if (!scene.player.body.touching.down) {
            scene.player.play('martina-jump', true);
          }

          // Jump physics ( Arcade jump physics are extremely stable! )
          if (scene.player.jumpKeyDebounce > 0) scene.player.jumpKeyDebounce--;

          if (jumpPressed) {
            if (scene.player.body.touching.down) {
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
            
            // Spawn landing dust particles!
            for (let i = 0; i < 6; i++) {
              const dustX = scene.player.x + (Math.random() * 20 - 10);
              const dustY = scene.player.y + 26;
              const dust = scene.add.circle(dustX, dustY, Math.random() * 2.5 + 1, 0xffffff, 0.7);
              scene.physics.add.existing(dust, false);
              dust.body.allowGravity = false;
              dust.body.setVelocityY(-Math.random() * 30 - 10);
              dust.body.setVelocityX((Math.random() * 60 - 30));
              scene.tweens.add({
                targets: dust,
                alpha: 0,
                scale: 0.1,
                duration: 350 + Math.random() * 150,
                onComplete: () => dust.destroy()
              });
            }
          }
          scene.player.wasOnGround = scene.player.body.touching.down;

          // Apply deformation math
          if (scene.player.landingSquashTimer > 0) {
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
    
    if (this.phaserGame && this.phaserGame.scene && this.phaserGame.scene.scenes[0]) {
      this.phaserGame.scene.scenes[0].scene.pause();
    }
    
    // Create premium game over overlay element
    const gameoverOverlay = document.createElement('div');
    gameoverOverlay.className = 'mario-gameover-overlay';
    gameoverOverlay.innerHTML = `
      <div class="mario-gameover-panel">
        <div class="mario-gameover-skull">💀</div>
        <h2>FIN DEL JUEGO</h2>
        <p class="mario-gameover-msg">Los peones de las sombras te han superado en esta partida. ¡No te rindas! Analiza el tablero y vuelve a intentarlo.</p>
        
        <div class="mario-gameover-stats">
          <div class="mario-stat-box">
            <span class="mario-stat-icon">🪙</span>
            <span class="mario-stat-num">${this.coins}</span>
            <span class="mario-stat-name">Monedas</span>
          </div>
          <div class="mario-stat-box">
            <span class="mario-stat-icon">⭐</span>
            <span class="mario-stat-num">${this.score}</span>
            <span class="mario-stat-name">Puntaje</span>
          </div>
        </div>
        
        <div class="mario-gameover-buttons">
          <button class="mario-vic-btn btn-map" id="go-btn-replay" style="background: linear-gradient(135deg, #e11d48, #be123c); color: #ffffff; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);">Reintentar 🔄</button>
          <button class="mario-vic-btn btn-replay" id="go-btn-map">Volver al Mapa ➔</button>
        </div>
      </div>
    `;
    
    this.container.appendChild(gameoverOverlay);
    
    // Bind buttons
    document.getElementById('go-btn-replay').addEventListener('click', () => {
      window.GameAudio.playMove();
      gameoverOverlay.remove();
      this.destroy();
      this.startLevel();
    });
    
    document.getElementById('go-btn-map').addEventListener('click', () => {
      window.GameAudio.playMove();
      gameoverOverlay.remove();
      this.destroy();
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
    
    const maxScore = this.maxScores[this.currentLevelIndex] || 9900;
    const pct = Math.min(100, Math.round((this.score / maxScore) * 100));
    const prev = this.bestScores[this.currentLevelIndex] || 0;
    const isNewRecord = this.score >= prev && this.score > 0;
    const trophyEmoji = pct >= 100 ? '🏆' : pct >= 75 ? '🥇' : pct >= 50 ? '🥈' : pct >= 25 ? '🥉' : '👣';
    
    const victoryOverlay = document.createElement('div');
    victoryOverlay.className = 'mario-victory-overlay';
    victoryOverlay.innerHTML = `
      <div class="mario-victory-panel">
        <div class="mario-victory-crown">${trophyEmoji}</div>
        <h2>¡Nivel Completado!</h2>
        <p class="mario-victory-msg">Martina ha despertado con éxito del Reino de las 64 Casillas con su bigote y táctica impecables.</p>
        
        <div class="mario-victory-progress">
          <div class="mario-progress-bar-bg">
            <div class="mario-progress-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="mario-progress-pct">${pct}% completado</span>
        </div>
        
        <div class="mario-victory-stats">
          <div class="mario-stat-box">
            <span class="mario-stat-icon">🪙</span>
            <span class="mario-stat-num">${this.coins}</span>
            <span class="mario-stat-name">Monedas</span>
          </div>
          <div class="mario-stat-box">
            <span class="mario-stat-icon">⭐</span>
            <span class="mario-stat-num">${this.score}</span>
            <span class="mario-stat-name">Puntaje</span>
          </div>
          <div class="mario-stat-box">
            <span class="mario-stat-icon">🎯</span>
            <span class="mario-stat-num">${maxScore}</span>
            <span class="mario-stat-name">Máximo</span>
          </div>
        </div>
        
        ${isNewRecord ? '<p class="mario-new-record">✨ ¡Nuevo récord personal! ✨</p>' : ''}
        
        <div class="mario-victory-buttons">
          <button class="mario-vic-btn btn-replay" id="vic-btn-replay">Repetir Nivel 🔄</button>
          <button class="mario-vic-btn btn-map" id="vic-btn-map">Volver al Mapa ➔</button>
        </div>
      </div>
    `;
    
    this.container.appendChild(victoryOverlay);
    
    document.getElementById('vic-btn-replay').addEventListener('click', () => {
      window.GameAudio.playMove();
      victoryOverlay.remove();
      this.destroy();
      this.startLevel();
    });
    
    document.getElementById('vic-btn-map').addEventListener('click', () => {
      window.GameAudio.playMove();
      victoryOverlay.remove();
      this.destroy();
      this.showWelcomeScreen();
    });
  }
}

// Register inside namespace
window.MartinaGames.mario = MarioGame;
