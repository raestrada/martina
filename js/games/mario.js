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
          <button class="mario-node-play-btn">Jugar ➔</button>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mario-outer-container">
        <div class="mario-map-container">
          <div class="mario-map-header">
            <h2>⭐️ Super Martina: El Salto Mágico ⭐️</h2>
            <p>¡Explora los 16 capítulos del reino! Corre, salta sobre plataformas y conquista la bandera dorada.</p>
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
    
    // Dynamically Load Phaser from CDN
    this.loadPhaser(() => {
      this.initPhaserEngine();
      this.startMusic();
    });
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

          <!-- Active Canvas Container -->
          <div class="mario-canvas-container" id="phaser-game-parent">
            <!-- Phaser canvas will be dynamically injected here -->
            
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
    bindTouch('touch-jump', 'jump');
  }

  // --- INITIALIZE PHASER GAME ENGINE ---
  initPhaserEngine() {
    const parentEl = document.getElementById('phaser-game-parent');
    if (!parentEl) return;

    const self = this;
    
    // Levels structure setup
    const platformsData = [
      // Standard Ground blocks
      { x: 0, y: 410, w: 800, h: 40 },
      { x: 980, y: 410, w: 750, h: 40 },
      { x: 1850, y: 410, w: 600, h: 40 },
      
      // Floating Chapter 1 Grass Platforms
      { x: 260, y: 310, w: 140, h: 20 },
      { x: 460, y: 220, w: 100, h: 20 },
      { x: 640, y: 300, w: 120, h: 20 },
      
      // Midground Platforms over first pit (Tuned heights for easy jumping!)
      { x: 800, y: 220, w: 120, h: 20 },
      
      // Second Segment floating platforms
      { x: 1080, y: 310, w: 160, h: 20 },
      { x: 1320, y: 220, w: 120, h: 20 },
      { x: 1540, y: 310, w: 100, h: 20 },
      
      // Intermediate bridges over second pit
      { x: 1730, y: 220, w: 120, h: 20 },
      
      // Staircase steps near flagpole
      { x: 1980, y: 370, w: 40, h: 40 },
      { x: 2030, y: 330, w: 40, h: 80 },
      { x: 2080, y: 290, w: 40, h: 120 },
      { x: 2130, y: 250, w: 40, h: 160 }
    ];

    const coinsData = [
      { x: 300, y: 260 }, { x: 330, y: 260 }, { x: 360, y: 260 },
      { x: 510, y: 170 },
      { x: 680, y: 250 }, { x: 710, y: 250 },
      { x: 860, y: 170 },
      { x: 1120, y: 260 }, { x: 1150, y: 260 },
      { x: 1380, y: 170 },
      { x: 1590, y: 260 },
      // Over second pit arches
      { x: 1750, y: 170 }, { x: 1790, y: 170 },
      // Staircase rewards
      { x: 2000, y: 320 }, { x: 2050, y: 280 }, { x: 2100, y: 240 }
    ];

    const enemiesData = [
      { x: 380, y: 360, left: 180, right: 600, speed: 70 },
      { x: 650, y: 360, left: 450, right: 750, speed: 60 },
      { x: 1200, y: 360, left: 1020, right: 1500, speed: 80 },
      { x: 1520, y: 360, left: 1350, right: 1680, speed: 70 },
      { x: 1950, y: 360, left: 1880, right: 2120, speed: 90 }
    ];

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 450,
      parent: 'phaser-game-parent',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 700 }, // Perfect platformer gravity
          debug: false
        }
      },
      loader: {
        imageLoadType: 'HTMLImageElement'
      },
      scene: {
        preload: function() {
          // Preload actual cuento assets from Base64 to bypass local file CORS policy!
          const assets = window.MartinaGameAssets || { martina: '', peoncito: '', background: '', castle: '' };
          this.load.image('player', assets.martina);
          this.load.image('enemy', assets.peoncito);
          this.load.image('background', assets.background);
          this.load.image('castle', assets.castle);
          
          // Generate a smooth particle sparkle texture dynamically
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
          grad.addColorStop(0, 'rgba(255, 223, 0, 1)');
          grad.addColorStop(0.3, 'rgba(255, 180, 0, 0.8)');
          grad.addColorStop(1, 'rgba(255, 180, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(8, 8, 8, 0, Math.PI * 2);
          ctx.fill();
          this.textures.addBase64('sparkle', canvas.toDataURL());
        },
        create: function() {
          const scene = this;
          
          // 1. Double Parallax magical background
          scene.bg = scene.add.tileSprite(0, 0, 2400, 450, 'background').setOrigin(0, 0);
          scene.bg.setAlpha(0.65);
          scene.bg.setScrollFactor(0.25); // Parallax slow scroll

          // 2. Physics Static Platforms Group
          scene.platforms = scene.physics.add.staticGroup();

          platformsData.forEach(p => {
            const block = scene.add.graphics();
            
            // Draw textured, professional chess-themed green platform
            // Forest grass top
            block.fillStyle(0x38bdf8, 0.45); // light magical cyan glow
            block.fillRect(p.x, p.y, p.w, p.h);
            
            block.fillStyle(0x1e3a8a, 0.85); // deep magical royal blue dirt
            block.fillRect(p.x, p.y + 6, p.w, p.h - 6);
            
            block.fillStyle(0x60a5fa, 0.95); // glowing cyan neon grass edge
            block.fillRect(p.x, p.y, p.w, 6);

            // Draw checkered grid details directly on platforms!
            block.fillStyle(0x1d4ed8, 0.25);
            for (let x = p.x; x < p.x + p.w; x += 16) {
              block.fillRect(x, p.y + 6, 8, 6);
            }

            block.lineStyle(2, 0x1d4ed8, 1);
            block.strokeRect(p.x, p.y, p.w, p.h);

            // Generate physics body
            const container = scene.add.container(0, 0);
            container.add(block);
            scene.physics.add.existing(container, true);
            container.body.setSize(p.w, p.h);
            container.body.setOffset(p.x, p.y);
            
            scene.platforms.add(container);
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

          // 4. Magical Sparkles Particle trail!
          scene.particles = scene.add.particles(0, 0, 'sparkle', {
            speed: { min: 10, max: 40 },
            angle: { min: 140, max: 220 },
            scale: { start: 0.8, end: 0.1 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 400,
            frequency: 60,
            quantity: 1,
            blendMode: 'ADD'
          });
          scene.particles.startFollow(scene.player, -10, 16);

          // 5. Collectible Chess Coins (Cromos)
          scene.coins = scene.physics.add.group();
          coinsData.forEach(c => {
            const coin = scene.add.graphics();
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

            const coinContainer = scene.add.container(c.x, c.y);
            coinContainer.add(coin);
            scene.physics.add.existing(coinContainer, true);
            coinContainer.body.setCircle(10, -10, -10);
            
            // Add a floating animation loop to the coins!
            scene.tweens.add({
              targets: coinContainer,
              y: c.y - 6,
              duration: 1200 + Math.random()*400,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });

            scene.coins.add(coinContainer);
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

          // 7. Goal Mástil and Castle Boss
          scene.flagpole = scene.add.graphics();
          scene.flagpole.fillStyle(0xdcdcdc, 1);
          scene.flagpole.fillRect(2150, 100, 8, 310);
          scene.flagpole.fillStyle(0xfacc15, 1);
          scene.flagpole.beginPath();
          scene.flagpole.arc(2154, 100, 8, 0, Math.PI * 2);
          scene.flagpole.fill();
          
          // Magical Gold Banner Flag
          scene.flag = scene.add.graphics();
          scene.flag.fillStyle(0xfacc15, 1);
          scene.flag.beginPath();
          scene.flag.moveTo(2158, 120);
          scene.flag.lineTo(2208, 135);
          scene.flag.lineTo(2158, 150);
          scene.flag.closePath();
          scene.flag.fill();

          scene.physics.add.existing(scene.flagpole, true);
          scene.flagpole.body.setSize(16, 310);
          scene.flagpole.body.setOffset(2146, 100);

          scene.castle = scene.physics.add.staticSprite(2280, 310, 'castle');
          scene.castle.setDisplaySize(120, 160);

          // 8. Colliders and Overlaps configuration
          scene.physics.add.collider(scene.player, scene.platforms);
          scene.physics.add.collider(scene.enemies, scene.platforms);
          
          // Collect coin overlap
          scene.physics.add.overlap(scene.player, scene.coins, (player, coin) => {
            coin.destroy();
            self.coins++;
            self.score += 100;
            self.synthesizeSound('coin');
            
            document.getElementById('hud-coins').textContent = `🪙 x${self.coins.toString().padStart(2, '0')}`;
            document.getElementById('hud-score').textContent = self.score.toString().padStart(5, '0');
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
                player.invincibility = 60; // 1 second
                player.body.setVelocityX(player.x < enemy.x ? -250 : 250);
                player.body.setVelocityY(-150);
                self.synthesizeSound('damage');
                
                document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;

                if (self.lives <= 0) {
                  self.gameOver();
                }
              }
            }
          });

          // Goal flagpole overlap (Level completed)
          scene.physics.add.overlap(scene.player, scene.flagpole, () => {
            if (self.player.isSliding) return;
            self.completeLevel();
            
            self.player.isSliding = true;
            scene.particles.stop();
            scene.player.body.setVelocityX(0);
            scene.player.body.setVelocityY(80);
            scene.player.body.allowGravity = false;

            // Slide flag down in sync
            scene.tweens.add({
              targets: scene.flag,
              y: 200,
              duration: 1500
            });

            // Walk to castle
            scene.time.delayedCall(1600, () => {
              scene.player.body.allowGravity = true;
              scene.player.body.setVelocityX(120);
              
              // Walk right
              scene.time.delayedCall(1200, () => {
                scene.tweens.add({
                  targets: scene.player,
                  alpha: 0,
                  scale: 0,
                  duration: 500,
                  onComplete: () => {
                    self.showVictoryScreen(true);
                  }
                });
              });
            });
          });

          // 9. Camera setup
          scene.cameras.main.setBounds(0, 0, 2400, 450);
          scene.cameras.main.startFollow(scene.player, true, 0.1, 0.1);
          
          // 10. Inputs binder
          scene.cursors = scene.input.keyboard.createCursorKeys();
          scene.keysWASD = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
          });
        },
        update: function() {
          const scene = this;
          if (self.gameState !== 'playing') return;

          // Invincibility flashing timer
          if (scene.player.invincibility > 0) {
            scene.player.invincibility--;
            scene.player.setAlpha(scene.player.invincibility % 4 === 0 ? 0.3 : 0.85);
          } else {
            scene.player.setAlpha(1.0);
          }

          // Enemy patrols update
          scene.enemies.getChildren().forEach(enemy => {
            if (enemy.dead) return;
            
            if (enemy.x <= enemy.leftBound) {
              enemy.body.setVelocityX(enemy.speed);
              enemy.setFlipX(true);
            } else if (enemy.x >= enemy.rightBound) {
              enemy.body.setVelocityX(-enemy.speed);
              enemy.setFlipX(false);
            }
          });

          // Out of bounds pit checks
          if (scene.player.y > 450) {
            self.lives--;
            self.synthesizeSound('damage');
            document.getElementById('hud-lives').textContent = `❤️ x${self.lives}`;
            
            if (self.lives > 0) {
              scene.player.setPosition(scene.player.x < 950 ? 80 : 1050, 150);
              scene.player.body.setVelocity(0, 0);
              scene.player.invincibility = 60;
            } else {
              self.gameOver();
            }
            return;
          }

          if (self.player.isSliding) return;

          // Keyboard + Virtual Gamepad inputs
          const moveLeft = scene.cursors.left.isDown || scene.keysWASD.left.isDown || self.touchInputs.left;
          const moveRight = scene.cursors.right.isDown || scene.keysWASD.right.isDown || self.touchInputs.right;
          const jumpPressed = scene.cursors.up.isDown || scene.cursors.space.isDown || scene.keysWASD.up.isDown || self.touchInputs.jump;

          // Horizontal movement
          if (moveLeft) {
            scene.player.body.setVelocityX(-175);
            scene.player.setFlipX(true); // flip sprite left
            scene.particles.start();
          } else if (moveRight) {
            scene.player.body.setVelocityX(175);
            scene.player.setFlipX(false); // standard flip right
            scene.particles.start();
          } else {
            scene.player.body.setVelocityX(0);
            scene.particles.stop();
          }

          // Jump physics ( Arcade jump physics are extremely stable! )
          if (jumpPressed && scene.player.body.touching.down) {
            scene.player.body.setVelocityY(-405); // high enough to reach all platforms easily!
            self.synthesizeSound('jump');
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
  }

  // --- START ORIGINAL DREAMY CHIPTUNE BGM (64 steps) ---
  startMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;

    window.GameAudio.init();
    const audioCtx = window.GameAudio.ctx;
    if (!audioCtx) return;

    // Dreamy, ethereal, minor-mode fairy tale chords:
    // Bar 1-2: A minor | Bar 3-4: F major | Bar 5-6: C major | Bar 7-8: E major
    const melody = [
      440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 440.00, 0,
      440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 659.25, 783.99,
      349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 349.23, 0,
      349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 523.25, 659.25,
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 0,
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 392.00, 493.88,
      329.63, 415.30, 493.88, 659.25, 493.88, 415.30, 329.63, 0,
      329.63, 415.30, 493.88, 659.25, 783.99, 659.25, 587.33, 493.88
    ];

    const bass = [
      110.00, 0, 110.00, 0, 110.00, 0, 110.00, 0,
      110.00, 0, 110.00, 0, 110.00, 0, 110.00, 0,
      87.31,  0, 87.31,  0, 87.31,  0, 87.31,  0,
      87.31,  0, 87.31,  0, 87.31,  0, 87.31,  0,
      130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
      130.81, 0, 130.81, 0, 130.81, 0, 130.81, 0,
      82.41,  0, 82.41,  0, 82.41,  0, 82.41,  0,
      82.41,  0, 82.41,  0, 82.41,  0, 82.41,  0
    ];

    let step = 0;
    const tempo = 220; // 220ms per step, slower tempo for dreamy, magical vibe!

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
}

// Register inside namespace
window.MartinaGames.mario = MarioGame;
