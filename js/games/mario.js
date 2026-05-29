// === JUEGO: SUPER MARTINA · EL SALTO MÁGICO ===
// Minijuego estrella de plataformas en 2D al estilo Super Mario Bros.
// Desarrollado nativamente en Canvas HTML5 con Web Audio API para síntesis Chiptune de 8-bits.

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
    
    // Keyboard inputs
    this.keys = { left: false, right: false, up: false, down: false, space: false };
    this.touchInputs = { left: false, right: false, jump: false };
  }

  // --- WELCOME LEVEL SELECTOR SCREEN ---
  showWelcomeScreen() {
    this.gameState = 'welcome';
    this.stopMusic();
    
    // Sync level unlocks from local storage
    this.unlockedLevels = JSON.parse(localStorage.getItem('martina_mario_unlocked')) || [true];
    while (this.unlockedLevels.length < 16) this.unlockedLevels.push(false);
    
    let levelGridHTML = '';
    
    this.levels.forEach((level, idx) => {
      const isUnlocked = this.unlockedLevels[idx] === true;
      levelGridHTML += `
        <div class="mario-stage-node ${isUnlocked ? 'unlocked' : ''}" data-level="${idx}">
          <div class="mario-node-lock">${isUnlocked ? '🔓' : '🔒'}</div>
          <div class="mario-node-badge">${isUnlocked ? level.icon : '❓'}</div>
          <div class="mario-node-num">Nivel ${level.num}</div>
          <div class="mario-node-name">${level.name}</div>
          <div class="mario-node-desc">${level.desc}</div>
          <div class="mario-node-status">${isUnlocked ? 'Disponible' : 'Bloqueado'}</div>
          <button class="mario-node-play-btn">Cabalgar ➔</button>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mario-outer-container">
        <div class="mario-map-container">
          <div class="mario-map-header">
            <h2>⭐️ Super Martina: El Salto Mágico ⭐️</h2>
            <p>¡Explora los 16 capítulos del reino! Corre, salta sobre plataformas de ajedrez y conquista la bandera dorada.</p>
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

  // --- START ACTIVE LEVEL ---
  startLevel() {
    this.gameState = 'playing';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    
    // Physics variables setup
    this.levelWidth = 2400; // Large scrolling platformer level
    this.levelHeight = 450;
    this.cameraX = 0;
    
    // Player object
    this.player = {
      x: 80,
      y: 300,
      vx: 0,
      vy: 0,
      width: 28,
      height: 48,
      onGround: false,
      direction: 'right',
      invincibilityFrames: 0,
      stompTimer: 0,
      runAnimFrame: 0,
      isSliding: false
    };

    // Parallax background layers
    this.clouds = [
      { x: 100, y: 80, size: 40, speed: 0.2 },
      { x: 350, y: 50, size: 60, speed: 0.1 },
      { x: 600, y: 90, size: 50, speed: 0.15 },
      { x: 1000, y: 60, size: 70, speed: 0.08 },
      { x: 1300, y: 75, size: 45, speed: 0.25 },
      { x: 1700, y: 40, size: 55, speed: 0.12 },
      { x: 2100, y: 85, size: 65, speed: 0.18 }
    ];

    // Platforms (solid blocks)
    this.platforms = [
      // Standard Ground blocks
      { x: 0, y: 400, w: 800, h: 50 },
      { x: 950, y: 400, w: 700, h: 50 },
      { x: 1800, y: 400, w: 600, h: 50 },
      
      // Floating Chapter 1 Grass Platforms
      { x: 260, y: 290, w: 140, h: 25 },
      { x: 460, y: 190, w: 100, h: 25 },
      { x: 640, y: 280, w: 120, h: 25 },
      
      // Midground Platforms over first pit
      { x: 800, y: 180, w: 120, h: 25 },
      
      // Second Segment floating platforms
      { x: 1050, y: 290, w: 160, h: 25 },
      { x: 1300, y: 200, w: 120, h: 25 },
      { x: 1500, y: 290, w: 100, h: 25 },
      
      // Staircase steps near flagpole
      { x: 1950, y: 360, w: 40, h: 40 },
      { x: 2000, y: 320, w: 40, h: 80 },
      { x: 2050, y: 280, w: 40, h: 120 },
      { x: 2100, y: 240, w: 40, h: 160 }
    ];

    // Collectible Chess Coins (Cromos)
    this.coinsList = [
      { x: 300, y: 250, collected: false },
      { x: 330, y: 250, collected: false },
      { x: 510, y: 150, collected: false },
      { x: 680, y: 240, collected: false },
      { x: 710, y: 240, collected: false },
      { x: 860, y: 140, collected: false },
      { x: 1100, y: 250, collected: false },
      { x: 1130, y: 250, collected: false },
      { x: 1360, y: 160, collected: false },
      { x: 1550, y: 250, collected: false },
      // High arches over second pit
      { x: 1700, y: 180, collected: false },
      { x: 1730, y: 150, collected: false },
      { x: 1760, y: 180, collected: false },
      // Staircase rewards
      { x: 2015, y: 270, collected: false },
      { x: 2065, y: 230, collected: false },
      { x: 2115, y: 190, collected: false }
    ];

    // Chess Pawn Enemies ("Peones rebeldes" walking Goomba-style)
    this.enemies = [
      { x: 380, y: 368, w: 30, h: 32, vx: -1.2, leftBound: 180, rightBound: 500, dead: false, squashFrame: 0 },
      { x: 620, y: 368, w: 30, h: 32, vx: -1.0, leftBound: 480, rightBound: 760, dead: false, squashFrame: 0 },
      { x: 1150, y: 368, w: 30, h: 32, vx: -1.4, leftBound: 980, rightBound: 1350, dead: false, squashFrame: 0 },
      { x: 1480, y: 368, w: 30, h: 32, vx: -1.2, leftBound: 1300, rightBound: 1600, dead: false, squashFrame: 0 },
      { x: 1900, y: 368, w: 30, h: 32, vx: -1.6, leftBound: 1820, rightBound: 2100, dead: false, squashFrame: 0 }
    ];

    // Goal Castle Flagpole
    this.flagpole = { x: 2180, y: 100, w: 8, h: 300 };
    this.castle = { x: 2260, y: 240, w: 100, h: 160 };

    this.setupLevelLayout();
    this.setupInputs();
    this.startMusic();
    
    // Trigger loop execution
    this.gameLoopActive = true;
    this.loop();
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
                <span class="mario-hud-val" id="hud-chapter">1-1</span>
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

          <!-- Active HTML5 Canvas -->
          <div class="mario-canvas-container">
            <canvas class="mario-canvas" id="mario-canvas-DOM" width="800" height="450"></canvas>
            
            <!-- Mobile Translucent Touch Gamepad -->
            <div class="mario-touch-pad">
              <div class="touch-btn left" id="touch-left">◀</div>
              <div class="touch-btn right" id="touch-right">▶</div>
              <div class="touch-btn jump" id="touch-jump">A</div>
            </div>
          </div>

        </div>
      </div>
    `;

    this.canvas = document.getElementById('mario-canvas-DOM');
    this.ctx = this.canvas.getContext('2d');

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
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.touchInputs[field] = true;
        });
        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.touchInputs[field] = false;
        });
        // Mouse Fallbacks
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.touchInputs[field] = true;
        });
        btn.addEventListener('mouseup', (e) => {
          e.preventDefault();
          this.touchInputs[field] = false;
        });
      }
    };

    bindTouch('touch-left', 'left');
    bindTouch('touch-right', 'right');
    bindTouch('touch-jump', 'jump');
  }

  // --- KEYBOARD KEY INPUT HANDLER ---
  setupInputs() {
    this.keyPressHandler = (e) => {
      const active = e.type === 'keydown';
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = active;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = active;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = active;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = active;
      if (e.key === ' ' || e.key === 'Spacebar') this.keys.space = active;
    };

    window.addEventListener('keydown', this.keyPressHandler);
    window.addEventListener('keyup', this.keyPressHandler);
  }

  // --- 60FPS PLATFORMER RENDERING ENGINE ---
  loop() {
    if (!this.gameLoopActive) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(() => this.loop());
  }

  // --- GAME STATE & PHYSICS UPDATE ---
  update() {
    if (this.gameState !== 'playing') return;

    // A. Tick animations & counters
    if (this.player.invincibilityFrames > 0) {
      this.player.invincibilityFrames--;
    }
    
    // B. Player horizontal movement inputs
    const moveLeft = this.keys.left || this.touchInputs.left;
    const moveRight = this.keys.right || this.touchInputs.right;
    
    if (moveLeft && !this.player.isSliding) {
      this.player.vx -= 0.65;
      this.player.direction = 'left';
      this.player.runAnimFrame++;
    } else if (moveRight && !this.player.isSliding) {
      this.player.vx += 0.65;
      this.player.direction = 'right';
      this.player.runAnimFrame++;
    }
    
    // Friction
    this.player.vx *= 0.85;

    // C. Gravity
    this.player.vy += 0.55;
    if (this.player.vy > 12) this.player.vy = 12; // Terminal velocity

    // D. Jump inputs
    const jumpPressed = this.keys.up || this.keys.space || this.touchInputs.jump;
    if (jumpPressed && this.player.onGround && !this.player.isSliding) {
      this.player.vy = -10.5;
      this.player.onGround = false;
      this.synthesizeSound('jump');
    }

    // E. Level 1 Horizontal bounds & physics update
    this.player.x += this.player.vx;
    
    // Keep player in level left bound
    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.vx = 0;
    }

    // F. Horizontal platform collision check
    this.platforms.forEach(block => {
      if (this.collides(this.player, block)) {
        if (this.player.vx > 0) { // Collide right wall
          this.player.x = block.x - this.player.width;
          this.player.vx = 0;
        } else if (this.player.vx < 0) { // Collide left wall
          this.player.x = block.x + block.w;
          this.player.vx = 0;
        }
      }
    });

    // G. Vertical movement & platform collision check
    this.player.y += this.player.vy;
    this.player.onGround = false;

    this.platforms.forEach(block => {
      if (this.collides(this.player, block)) {
        if (this.player.vy > 0) { // Landing on top of platform
          this.player.y = block.y - this.player.height;
          this.player.vy = 0;
          this.player.onGround = true;
        } else if (this.player.vy < 0) { // Bumping head into ceiling
          this.player.y = block.y + block.h;
          this.player.vy = 0;
        }
      }
    });

    // H. Scrolling Camera smoothly tracks Martina
    const targetCamX = this.player.x - 320;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    
    // Bounds of camera scroll
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > this.levelWidth - 800) this.cameraX = this.levelWidth - 800;

    // I. Collect Coins
    this.coinsList.forEach(coin => {
      if (!coin.collected) {
        // Simple circle box overlap check
        const dist = Math.hypot((this.player.x + this.player.width/2) - coin.x, (this.player.y + this.player.height/2) - coin.y);
        if (dist < 26) {
          coin.collected = true;
          this.coins++;
          this.score += 100;
          this.synthesizeSound('coin');
          
          document.getElementById('hud-coins').textContent = `🪙 x${this.coins.toString().padStart(2, '0')}`;
          document.getElementById('hud-score').textContent = this.score.toString().padStart(5, '0');
        }
      }
    });

    // J. Update & Collide Pawns (Enemies)
    this.enemies.forEach(enemy => {
      if (enemy.dead) {
        enemy.squashFrame++;
        return;
      }

      // Patrol movement
      enemy.x += enemy.vx;
      if (enemy.x <= enemy.leftBound) {
        enemy.x = enemy.leftBound;
        enemy.vx = Math.abs(enemy.vx);
      } else if (enemy.x >= enemy.rightBound) {
        enemy.x = enemy.rightBound;
        enemy.vx = -Math.abs(enemy.vx);
      }

      // Overlap with player
      if (this.collides(this.player, enemy)) {
        // Squashing enemy from the top
        if (this.player.vy > 0 && (this.player.y + this.player.height - this.player.vy <= enemy.y + 12)) {
          enemy.dead = true;
          this.player.vy = -8.5; // bounce up
          this.score += 200;
          this.synthesizeSound('stomp');
          document.getElementById('hud-score').textContent = this.score.toString().padStart(5, '0');
        } else {
          // Player touched from side (Takes damage)
          if (this.player.invincibilityFrames === 0) {
            this.lives--;
            this.player.invincibilityFrames = 60; // 1 second invincibility
            this.player.vx = this.player.x < enemy.x ? -6 : 6;
            this.player.vy = -4;
            this.synthesizeSound('damage');
            
            document.getElementById('hud-lives').textContent = `❤️ x${this.lives}`;

            if (this.lives <= 0) {
              this.gameOver();
            }
          }
        }
      }
    });

    // K. Fell in pits (Out of bounds bottom)
    if (this.player.y > this.levelHeight + 50) {
      this.lives--;
      this.synthesizeSound('damage');
      document.getElementById('hud-lives').textContent = `❤️ x${this.lives}`;

      if (this.lives > 0) {
        // Respawn at last safe segment
        this.player.x = this.player.x < 900 ? 80 : 1000;
        this.player.y = 200;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.invincibilityFrames = 60;
      } else {
        this.gameOver();
      }
    }

    // L. Overlap with Flagpole (Level Win!)
    const pCenter = this.player.x + this.player.width/2;
    if (pCenter >= this.flagpole.x - 10 && pCenter <= this.flagpole.x + this.flagpole.w + 10 && this.player.y < this.flagpole.y + this.flagpole.h) {
      this.completeLevel();
    }
  }

  // --- GAME OVER ---
  gameOver() {
    this.gameState = 'gameover';
    this.stopMusic();
    window.GameAudio.playError();

    // Reset controls
    this.keys = { left: false, right: false, up: false, down: false, space: false };
    this.touchInputs = { left: false, right: false, jump: false };

    // Overlay Game Over Screen on DOM
    setTimeout(() => {
      this.container.innerHTML = `
        <div class="game-screen">
          <div class="game-screen-img" style="border-color: #ff6b6b; background: rgba(255, 107, 107, 0.1);">
            <div style="font-size: 5rem; margin-top: 1.2rem;">🥀</div>
          </div>
          <h2>¡Oh no! Juego Terminado</h2>
          <p>Martina se quedó sin energía explorando la pradera. ¡No te rindas y prueba otra vez!</p>
          <div class="game-screen-stats">
            <div class="stat-item">
              <span>Puntuación</span>
              <div class="stat-val">${this.score}</div>
            </div>
            <div class="stat-item">
              <span>Monedas</span>
              <div class="stat-val">🪙 ${this.coins}</div>
            </div>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
            <button class="btn btn-game-screen" id="mario-fail-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
              Menú de Niveles 📋
            </button>
            <button class="btn btn-game-screen" id="mario-fail-retry">Reintentar Nivel 🔁</button>
          </div>
        </div>
      `;

      document.getElementById('mario-fail-menu').addEventListener('click', () => {
        this.showWelcomeScreen();
      });
      document.getElementById('mario-fail-retry').addEventListener('click', () => {
        this.startLevel();
      });
    }, 500);
  }

  // --- VICTORY COMPLETE LEVEL ---
  completeLevel() {
    this.gameState = 'victory';
    this.stopMusic();
    this.synthesizeSound('victory');

    // Trigger sliding animation
    this.player.isSliding = true;
    this.player.vx = 0;
    this.player.vy = 2; // slow slide down flagpole

    // Trigger level unlock
    const nextIdx = this.currentLevelIndex + 1;
    if (nextIdx < 16) {
      this.unlockedLevels[nextIdx] = true;
      localStorage.setItem('martina_mario_unlocked', JSON.stringify(this.unlockedLevels));
    }

    // Award 3 Card packs to album on completing Level 1 for the first time!
    let packAwarded = false;
    try {
      const key = 'martina_mario_pack_reward';
      if (localStorage.getItem(key) !== 'true') {
        localStorage.setItem(key, 'true');
        let packs = parseInt(localStorage.getItem('martina_album_packs') || '0');
        localStorage.setItem('martina_album_packs', (packs + 3).toString());
        packAwarded = true;
      }
    } catch (e) {
      console.error(e);
    }

    // Update global dashboard immediately
    if (typeof window.loadDashboardStats === 'function') {
      window.loadDashboardStats();
    }

    // Slide down flagpole animation
    const slideDown = setInterval(() => {
      this.player.y += 3;
      if (this.player.y >= 352) {
        this.player.y = 352;
        clearInterval(slideDown);
        
        // Walk to castle
        const walkToCastle = setInterval(() => {
          this.player.x += 2.5;
          this.player.runAnimFrame++;
          this.render(); // force render
          if (this.player.x >= this.castle.x + 35) {
            clearInterval(walkToCastle);
            
            // Trigger victory screen
            setTimeout(() => {
              this.showVictoryScreen(packAwarded);
            }, 600);
          }
        }, 1000/60);
      }
      this.render();
    }, 1000/60);
  }

  showVictoryScreen(packAwarded) {
    let packMsgHTML = packAwarded 
      ? `
        <div style="background: rgba(244, 162, 97, 0.08); border: 2px dashed var(--gold); padding: 1rem; border-radius: 16px; margin: 1rem 0; color: var(--gold-light); font-weight: 700; font-size: 0.95rem;">
          🎒 ¡PERFECTO! Has ganado 3 SOBRES DE CROMOS por completar el Juego Estrella. ¡Ve al Álbum a abrirlos!
        </div>
      `
      : '';

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img" style="border-color: var(--sage); background: rgba(42, 157, 143, 0.1);">
          <div style="font-size: 5rem; margin-top: 1.2rem;">🏆</div>
        </div>
        <h2>¡Nivel Completado! ⭐</h2>
        <p>¡Increíble! Has guiado a Martina con saltos perfectos superando la **Pradera del Centro**.</p>
        
        ${packMsgHTML}

        <div class="game-screen-stats">
          <div class="stat-item">
            <span>Puntos</span>
            <div class="stat-val">+${this.score}</div>
          </div>
          <div class="stat-item">
            <span>Monedas</span>
            <div class="stat-val">🪙 ${this.coins}</div>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="mario-win-menu">
            Menú de Niveles 📋
          </button>
        </div>
      </div>
    `;

    document.getElementById('mario-win-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });
  }

  // --- DRAW CANVAS SCENE ---
  render() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, 800, 450);

    // 1. Render Sky Background
    this.ctx.fillStyle = '#70a0ff'; // Beautiful Nintendo sky blue
    this.ctx.fillRect(0, 0, 800, 450);

    // 2. Render Parallax Clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    this.clouds.forEach(cloud => {
      // Parallax camera calculation
      const cx = (cloud.x - this.cameraX * cloud.speed) % (this.levelWidth);
      const drawX = cx < -100 ? cx + this.levelWidth : cx;

      this.ctx.beginPath();
      this.ctx.arc(drawX, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
      this.ctx.arc(drawX + cloud.size * 0.35, cloud.y - cloud.size * 0.1, cloud.size * 0.45, 0, Math.PI * 2);
      this.ctx.arc(drawX - cloud.size * 0.35, cloud.y, cloud.size * 0.35, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 3. Render Parallax Rolling Chess Mountains (Midground)
    this.ctx.fillStyle = '#38bdf8'; // Soft teal-green rolling hills
    
    // First hill layer
    this.ctx.fillStyle = '#2d6a4f';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 450);
    for (let i = 0; i <= 800; i += 20) {
      const height = Math.sin((i + this.cameraX * 0.35) * 0.005) * 45 + 320;
      this.ctx.lineTo(i, height);
    }
    this.ctx.lineTo(800, 450);
    this.ctx.fill();

    // Render Chess checkerboard faded pattern inside hills for thematic magic!
    this.ctx.fillStyle = '#40916c';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 450);
    for (let i = 0; i <= 800; i += 25) {
      const height = Math.sin((i + this.cameraX * 0.5) * 0.008) * 35 + 345;
      this.ctx.lineTo(i, height);
    }
    this.ctx.lineTo(800, 450);
    this.ctx.fill();

    // 4. Render Castle & Flagpole (Before Foreground)
    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // Castle Drawing
    this.ctx.fillStyle = '#4a4e69'; // slate grey castle
    this.ctx.fillRect(this.castle.x, this.castle.y, this.castle.w, this.castle.h);
    // Draw battlements/turrets
    this.ctx.fillStyle = '#22223b';
    this.ctx.fillRect(this.castle.x - 8, this.castle.y - 15, 20, 15);
    this.ctx.fillRect(this.castle.x + this.castle.w - 12, this.castle.y - 15, 20, 15);
    this.ctx.fillRect(this.castle.x + this.castle.w/2 - 10, this.castle.y - 10, 20, 10);
    // Draw golden chess piece logo on castle
    this.ctx.font = '2rem serif';
    this.ctx.fillStyle = '#facc15';
    this.ctx.fillText('♕', this.castle.x + this.castle.w/2 - 14, this.castle.y + 60);
    // Castle door
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(this.castle.x + this.castle.w/2 - 16, this.castle.y + this.castle.h - 45, 32, 45);

    // Flagpole Drawing
    this.ctx.fillStyle = '#dcdcdc'; // metallic grey pole
    this.ctx.fillRect(this.flagpole.x, this.flagpole.y, this.flagpole.w, this.flagpole.h);
    // Flag pole gold ball on top
    this.ctx.beginPath();
    this.ctx.arc(this.flagpole.x + this.flagpole.w/2, this.flagpole.y, 8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#facc15';
    this.ctx.fill();
    // Green/gold magical Flag itself
    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    // Flag slides down with player if completed
    let flagY = this.flagpole.y + 20;
    if (this.player.isSliding) {
      flagY = this.player.y + 5;
      if (flagY > this.flagpole.y + this.flagpole.h - 40) {
        flagY = this.flagpole.y + this.flagpole.h - 40;
      }
    }
    this.ctx.moveTo(this.flagpole.x + this.flagpole.w, flagY);
    this.ctx.lineTo(this.flagpole.x + this.flagpole.w + 45, flagY + 15);
    this.ctx.lineTo(this.flagpole.x + this.flagpole.w, flagY + 30);
    this.ctx.closePath();
    this.ctx.fill();
    // Draw star emoji on flag
    this.ctx.font = '0.7rem serif';
    this.ctx.fillStyle = '#080710';
    this.ctx.fillText('⭐', this.flagpole.x + this.flagpole.w + 6, flagY + 19);

    // 5. Render Coins
    this.ctx.fillStyle = '#facc15';
    this.coinsList.forEach(coin => {
      if (!coin.collected) {
        // Draw rotating coin (ellipse/circle)
        this.ctx.beginPath();
        const spinRadius = 8 * Math.abs(Math.sin(Date.now() * 0.008));
        this.ctx.ellipse(coin.x, coin.y, spinRadius, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#e76f51';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });

    // 6. Render Enemies (Chess Pawns Goombas)
    this.enemies.forEach(enemy => {
      if (enemy.dead) {
        // Squashed pawn drawing
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(enemy.x, enemy.y + 20, enemy.w, 12);
        return;
      }

      // Draw Pawn Body
      this.ctx.fillStyle = '#ef4444'; // Red rebel pawns
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 2;
      
      // Pawn base
      this.ctx.fillRect(enemy.x, enemy.y + enemy.h - 6, enemy.w, 6);
      this.ctx.strokeRect(enemy.x, enemy.y + enemy.h - 6, enemy.w, 6);

      // Pawn body triangular
      this.ctx.beginPath();
      this.ctx.moveTo(enemy.x + 4, enemy.y + enemy.h - 6);
      this.ctx.lineTo(enemy.x + enemy.w - 4, enemy.y + enemy.h - 6);
      this.ctx.lineTo(enemy.x + enemy.w/2, enemy.y + 12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Pawn head ball
      this.ctx.beginPath();
      this.ctx.arc(enemy.x + enemy.w/2, enemy.y + 10, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw mean angry eyes on pawn!
      this.ctx.fillStyle = '#080710';
      this.ctx.beginPath();
      this.ctx.arc(enemy.x + enemy.w/2 - 3, enemy.y + 9, 1.2, 0, Math.PI * 2);
      this.ctx.arc(enemy.x + enemy.w/2 + 3, enemy.y + 9, 1.2, 0, Math.PI * 2);
      this.ctx.fill();
      // Angry eyebrows
      this.ctx.strokeStyle = '#080710';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(enemy.x + enemy.w/2 - 5, enemy.y + 6);
      this.ctx.lineTo(enemy.x + enemy.w/2 - 1, enemy.y + 8);
      this.ctx.moveTo(enemy.x + enemy.w/2 + 5, enemy.y + 6);
      this.ctx.lineTo(enemy.x + enemy.w/2 + 1, enemy.y + 8);
      this.ctx.stroke();
    });

    // 7. Render Platforms & Ground Blocks
    this.platforms.forEach(block => {
      // Draw grass top
      this.ctx.fillStyle = '#40916c'; // beautiful forest green grass
      this.ctx.fillRect(block.x, block.y, block.w, 8);
      
      // Draw dirt base
      this.ctx.fillStyle = '#5c3d2e'; // warm brown soil
      this.ctx.fillRect(block.x, block.y + 8, block.w, block.h - 8);

      // Grass fringe details
      this.ctx.fillStyle = '#1b4332';
      for (let x = block.x; x < block.x + block.w; x += 16) {
        this.ctx.fillRect(x, block.y + 8, 8, 4);
      }
      
      // Outline of platforms
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 2.2;
      this.ctx.strokeRect(block.x, block.y, block.w, block.h);
    });

    // 8. Render Protagonist (Martina)
    const p = this.player;
    const isInvincible = p.invincibilityFrames > 0;
    
    // Blinking effect when invincible
    if (!isInvincible || Math.floor(Date.now() / 60) % 2 === 0) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      // Face flip based on direction
      if (p.direction === 'left') {
        this.ctx.translate(p.width, 0);
        this.ctx.scale(-1, 1);
      }

      // Draw Martina dynamically and crisply:
      
      // A. Legs (Run animation cycle)
      this.ctx.fillStyle = '#1d4ed8'; // blue socks / white shoes
      const legCycle = Math.sin(p.runAnimFrame * 0.25) * 8;
      const isRunning = Math.abs(p.vx) > 0.1 && p.onGround;

      // Leg left
      this.ctx.fillRect(4, p.height - 12, 6, isRunning ? 10 + legCycle : 10);
      this.ctx.fillStyle = '#ffffff'; // shoe
      this.ctx.fillRect(3, p.height - 4, 8, 4);
      
      // Leg right
      this.ctx.fillStyle = '#1d4ed8';
      this.ctx.fillRect(p.width - 10, p.height - 12, 6, isRunning ? 10 - legCycle : 10);
      this.ctx.fillStyle = '#ffffff'; // shoe
      this.ctx.fillRect(p.width - 11, p.height - 4, 8, 4);

      // B. Shorts (Blue volleyball shorts)
      this.ctx.fillStyle = '#1d4ed8'; // volleyball blue
      this.ctx.fillRect(3, p.height - 18, p.width - 6, 8);
      
      // C. Body (White/light polo shirt with collar)
      this.ctx.fillStyle = '#f3f4f6'; // Light grey polo shirt
      this.ctx.fillRect(2, p.height - 38, p.width - 4, 20);

      // Red logo checker crown print on her shirt!
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(p.width/2 - 2, p.height - 30, 4, 4);

      // D. Arms (Run animation)
      this.ctx.fillStyle = '#fcd34d'; // skin color arms
      const armCycle = Math.cos(p.runAnimFrame * 0.25) * 6;
      
      // Left arm
      this.ctx.fillRect(-2, p.height - 34, 4, isRunning ? 12 + armCycle : 12);
      // Right arm
      this.ctx.fillRect(p.width - 2, p.height - 34, 4, isRunning ? 12 - armCycle : 12);

      // E. Head & Skin
      this.ctx.fillStyle = '#fcd34d'; // skin tone
      this.ctx.fillRect(6, p.height - 52, p.width - 12, 14);

      // F. Hair (Martina's straight dark hair)
      this.ctx.fillStyle = '#271b13'; // straight dark brown/black hair
      // Back hair drape
      this.ctx.fillRect(4, p.height - 46, p.width - 8, 12);
      // Top hair & Bangs
      this.ctx.fillRect(4, p.height - 54, p.width - 8, 6);
      this.ctx.fillRect(4, p.height - 50, 4, 8);
      this.ctx.fillRect(p.width - 8, p.height - 50, 4, 8);

      // G. Glasses (Her signature Glasses 👓)
      this.ctx.strokeStyle = '#080710'; // black frames
      this.ctx.lineWidth = 1.8;
      // Draw rectangular left frame
      this.ctx.strokeRect(p.width - 11, p.height - 46, 7, 5);
      // Draw rectangular right frame
      this.ctx.strokeRect(p.width - 21, p.height - 46, 7, 5);
      // Bridge
      this.ctx.beginPath();
      this.ctx.moveTo(p.width - 14, p.height - 43);
      this.ctx.lineTo(p.width - 11, p.height - 43);
      this.ctx.stroke();

      // Eye dots
      this.ctx.fillStyle = '#080710';
      this.ctx.fillRect(p.width - 8, p.height - 44, 2, 2);
      this.ctx.fillRect(p.width - 18, p.height - 44, 2, 2);

      // H. Outline of body for maximum sharpness/contrast (premium arcade finish!)
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(2, p.height - 38, p.width - 4, 20);

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // --- NATIVE 8-BIT RETRO SYNTH ENGINE (Web Audio API) ---
  synthesizeSound(type) {
    if (!this.musicEnabled) return;
    
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'jump') {
      // Short upward frequency arpeggio
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
    
    else if (type === 'coin') {
      // Classic double-tone chiptune arpeggio
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    else if (type === 'stomp') {
      // Downward noise-like frequency stomp
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.15);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    else if (type === 'damage') {
      // Harsh noise buzzer
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.3);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    else if (type === 'victory') {
      // Play triumphant NES-style fanfarre!
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      const rhythm = [0.1, 0.1, 0.1, 0.15, 0.15, 0.15, 0.6];
      let offset = 0;
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + offset);
        
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.15, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + rhythm[idx]);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + rhythm[idx]);
        
        offset += rhythm[idx] * 0.85;
      });
    }
  }

  // --- START CHIPTUNE BGM LOOP ---
  startMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;

    window.GameAudio.init();
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;

    const melody = [
      659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0,
      783.99, 0, 0, 0, 392.00, 0, 0, 0,
      523.25, 0, 0, 392.00, 0, 0, 329.63, 0,
      0, 440.00, 0, 493.88, 0, 440.00, 523.25, 0
    ];

    const bass = [
      130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
      196.00, 0, 196.00, 0, 196.00, 0, 196.00, 0,
      130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
      174.61, 0, 174.61, 0, 196.00, 0, 130.81, 0
    ];

    let step = 0;
    const tempo = 150; // milliseconds per step

    this.musicInterval = setInterval(() => {
      if (this.gameState !== 'playing' || !this.musicEnabled) {
        this.stopMusic();
        return;
      }

      const now = audioCtx.currentTime;

      // Play lead track (Square wave)
      const leadFreq = melody[step];
      if (leadFreq > 0) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(leadFreq, now);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        this.synthNotes.push(osc);
      }

      // Play bass track (Triangle wave)
      const bassFreq = bass[step];
      if (bassFreq > 0) {
        const bOsc = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        
        bGain.gain.setValueAtTime(0.08, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        
        bOsc.connect(bGain);
        bGain.connect(audioCtx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.15);
        this.synthNotes.push(bOsc);
      }

      step = (step + 1) % melody.length;
      
      // Clean up past oscillators reference to prevent leaks
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

  // --- COLLISION HELPER (AABB) ---
  collides(r1, r2) {
    return r1.x < r2.x + r2.w &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.h &&
           r1.y + r1.height > r2.y;
  }

  // --- DESTROY GAME INSTANCE ---
  destroy() {
    this.gameLoopActive = false;
    this.stopMusic();
    window.removeEventListener('keydown', this.keyPressHandler);
    window.removeEventListener('keyup', this.keyPressHandler);
  }
}

// Register inside namespace
window.MartinaGames.mario = MarioGame;
