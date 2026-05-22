// === JUEGO: ¡CUIDADO CON EL ESTORNUDO! ===
// Minijuego táctico y de reflejos con temática de la Reina Negra y Peoncito.
// Peoncito debe esquivar las zonas de peligro rojas de los estornudos,
// coleccionar sus bigotes falsos y llegar a la caja dorada de pañuelos.

class ReinaGame {
  constructor(container) {
    this.container = container;
    this.currentLevelIndex = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.sneezeTimer = 3;
    this.gameActive = false;
    
    // Default starting positions (will be overwritten by levels)
    this.peoncitoPos = { r: 7, c: 4 }; // e1
    this.reinaPos = { r: 0, c: 4 }; // e8
    this.mustachesCollected = [];
    
    this.selectedDifficulty = localStorage.getItem('martina_reina_difficulty') || 'medium';

    // 15 Progressive levels with chess-based sneeze threats
    this.levels = [
      {
        name: "El Gran Resfriado",
        description: "¡Primer reto! Mueve a Peoncito recogiendo los bigotes y alcanza la caja de pañuelos en e8. ¡Esquiva la columna e!",
        startPos: "e1",
        reinaPos: "e8",
        mustaches: ["d4", "f4"],
        tissueBox: "e8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "column",
        sneezeCooldown: 3
      },
      {
        name: "Alergia en Cruz",
        description: "La Reina Negra estornuda en cruz (fila y columna central d). Planifica tus movimientos laterales.",
        startPos: "d1",
        reinaPos: "d8",
        mustaches: ["c3", "e3", "d5"],
        tissueBox: "d8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "cross",
        sneezeCooldown: 3
      },
      {
        name: "El Bosque de Pañuelos",
        description: "Piedras de laberinto bloquean el centro. La Reina estornuda en forma de X (diagonales).",
        startPos: "e1",
        reinaPos: "e8",
        mustaches: ["b4", "d5", "g4"],
        tissueBox: "f8",
        obstacles: ["d4", "e4"],
        lava: [],
        ice: [],
        sneezePatternType: "diagonal",
        sneezeCooldown: 3
      },
      {
        name: "Tormenta en e4",
        description: "El Gran Río Central (casillas d4, e4, d5, e5 y vecinas) se vuelve un foco alérgico muy peligroso.",
        startPos: "e1",
        reinaPos: "e8",
        mustaches: ["c3", "f3", "e5"],
        tissueBox: "e8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "center3x3",
        sneezeCooldown: 3
      },
      {
        name: "Estornudo en L",
        description: "¡Locura geométrica! Los estornudos salen en forma de saltos de caballo desde la Reina.",
        startPos: "b1",
        reinaPos: "b8",
        mustaches: ["a4", "c5", "d3"],
        tissueBox: "b8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "knight",
        sneezeCooldown: 3
      },
      {
        name: "Lluvia del Norte",
        description: "El norte del tablero está cubierto de gotas flotantes. Esquiva casillas impredecibles.",
        startPos: "d1",
        reinaPos: "d8",
        mustaches: ["b3", "f3", "c6", "e6"],
        tissueBox: "d8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "random",
        randomTargets: ["b6", "c7", "e7", "f6", "g5", "d6"],
        sneezeCooldown: 2
      },
      {
        name: "El Pasillo Estrecho",
        description: "Ríos de lava bloquean los flancos. Sube por la columna central esquivando ráfagas frontales.",
        startPos: "e1",
        reinaPos: "e8",
        mustaches: ["c2", "g2", "e5"],
        tissueBox: "e8",
        obstacles: ["d4", "f4"],
        lava: ["d4", "f4"],
        ice: [],
        sneezePatternType: "column",
        sneezeCooldown: 3
      },
      {
        name: "Diagonales Glaciales",
        description: "Glaciares congelados bloquean d3 y e3. Esquiva las diagonales cruzadas desde g8.",
        startPos: "f1",
        reinaPos: "g8",
        mustaches: ["b4", "f4", "c6", "e6"],
        tissueBox: "b8",
        obstacles: ["d3", "e3"],
        lava: [],
        ice: ["d3", "e3"],
        sneezePatternType: "diagonal",
        sneezeCooldown: 2
      },
      {
        name: "Achuús Centrado",
        description: "El centro del tablero d4-e5 se inunda de snot. Rodéalo con cuidado para ganar.",
        startPos: "c1",
        reinaPos: "d8",
        mustaches: ["c3", "f3", "c6", "f6"],
        tissueBox: "d8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "center3x3",
        sneezeCooldown: 2
      },
      {
        name: "La Barrera de Moco",
        description: "Las filas completas 5 y 6 se llenan de estornudos transversales. Elige cuándo saltar.",
        startPos: "e1",
        reinaPos: "f8",
        mustaches: ["b3", "g3", "e2", "d7"],
        tissueBox: "f8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "ranks",
        targetRanks: [5, 6],
        sneezeCooldown: 3
      },
      {
        name: "Gambito de Estornudos",
        description: "Gotas de estornudo caen en múltiples casillas alternas. Planifica un camino en zigzag.",
        startPos: "g1",
        reinaPos: "g8",
        mustaches: ["b2", "e4", "f5", "h3"],
        tissueBox: "g8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "random",
        randomTargets: ["a3", "b5", "c4", "d6", "e5", "f3", "h4", "g6"],
        sneezeCooldown: 2
      },
      {
        name: "El Laberinto Alérgico",
        description: "Paredes de lava ardiente dividen el paso. Esquiva la columna central e y la fila 4.",
        startPos: "c1",
        reinaPos: "e8",
        mustaches: ["b3", "d2", "f2", "h3"],
        tissueBox: "e8",
        obstacles: ["c4", "g4"],
        lava: ["c4", "g4"],
        ice: [],
        sneezePatternType: "cross",
        sneezeCooldown: 2
      },
      {
        name: "Estornudo Cruzado Gigante",
        description: "Estornudos simultáneos cubren filas completas 3, 5 y 7. ¡El tablero es zona hostil!",
        startPos: "c1",
        reinaPos: "d8",
        mustaches: ["c4", "e4", "f2", "b6"],
        tissueBox: "d8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "giant_cross",
        sneezeCooldown: 2
      },
      {
        name: "El Trono del Estornudo",
        description: "¡Peligro instantáneo! La Reina estornuda alrededor de tu casilla de salida. ¡Escapa ya!",
        startPos: "e1",
        reinaPos: "e8",
        mustaches: ["a4", "h4", "c3", "f3"],
        tissueBox: "e8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "surrounding_peoncito",
        sneezeCooldown: 2
      },
      {
        name: "La Gran Alergia",
        description: "¡Desafío final! Las columnas c, d, e y las filas 4, 5 son tormenta total de moco. ¡Concéntrate!",
        startPos: "b1",
        reinaPos: "d8",
        mustaches: ["a2", "h2", "b6", "g6", "f3", "c3"],
        tissueBox: "d8",
        obstacles: [],
        lava: [],
        ice: [],
        sneezePatternType: "massive_grid",
        sneezeCooldown: 2
      }
    ];
  }

  // --- WELCOME & LEVEL SELECT SCREEN ---
  showWelcomeScreen() {
    let key = 'martina_reina_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_reina_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_reina_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_reina_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);

    let levelCardsHTML = '';
    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    this.levels.forEach((level, idx) => {
      const stars = progress[idx] || 0;
      const isLocked = idx > 0 && (progress[idx - 1] === 0);

      let starsHTML = '';
      for (let s = 1; s <= 3; s++) {
        if (s <= stars) {
          starsHTML += `<span class="star-filled ${starClass}">★</span>`;
        } else {
          starsHTML += '<span class="star-empty">★</span>';
        }
      }

      levelCardsHTML += `
        <div class="level-card ${isLocked ? 'locked' : ''}" data-level="${idx}">
          <div class="level-number">Etapa ${idx + 1}</div>
          <div class="level-card-stars">${isLocked ? '' : starsHTML}</div>
          <div class="level-card-title">${level.name}</div>
          <div class="level-card-desc">${level.description.substring(0, 75)}...</div>
          <div class="level-card-footer">
            <span class="level-card-meta">${level.mustaches.length} 🥸</span>
            ${isLocked ? '' : '<button class="level-card-play-btn" style="background:var(--rose);">Esquivar 🤧</button>'}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="level-select-container">
        <div class="level-select-header">
          <h2>🤧 ¡Cuidado con el Estornudo! 🤧</h2>
          <p>Mueve a Peoncito con cuidado por el tablero, recoge sus bigotes postizos y llévale pañuelos a la Reina Negra antes de que te atrapen sus estornudos.</p>
          
          <div class="difficulty-selector">
            <button class="diff-tab easy ${this.selectedDifficulty === 'easy' ? 'active' : ''}" data-diff="easy">🟢 Fácil</button>
            <button class="diff-tab medium ${this.selectedDifficulty === 'medium' ? 'active' : ''}" data-diff="medium">🟡 Medio</button>
            <button class="diff-tab hard ${this.selectedDifficulty === 'hard' ? 'active' : ''}" data-diff="hard">🔴 Difícil</button>
            <button class="diff-tab martina ${this.selectedDifficulty === 'martina' ? 'active' : ''}" data-diff="martina">👑 Martina</button>
          </div>
        </div>
        <div class="level-grid">
          ${levelCardsHTML}
        </div>
      </div>
    `;

    // Click events difficulty buttons
    const diffButtons = this.container.querySelectorAll('.diff-tab');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const diff = btn.getAttribute('data-diff');
        this.selectedDifficulty = diff;
        localStorage.setItem('martina_reina_difficulty', diff);
        window.GameAudio.playMove();
        this.showWelcomeScreen();
      });
    });

    // Click events level cards
    const cards = this.container.querySelectorAll('.level-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-level'));
        const isLocked = idx > 0 && (progress[idx - 1] === 0);
        if (!isLocked) {
          this.currentLevelIndex = idx;
          this.startGame();
        } else {
          window.GameAudio.playError();
        }
      });
    });
  }

  // --- START GAME ---
  startGame() {
    const level = this.levels[this.currentLevelIndex];
    this.peoncitoPos = this.nameToCoords(level.startPos);
    this.reinaPos = this.nameToCoords(level.reinaPos);
    this.mustachesCollected = [];
    this.gameActive = true;
    this.selectedSquare = null;

    // Difficulty settings
    if (this.selectedDifficulty === 'easy') {
      this.maxLives = 5;
      this.sneezeTimer = level.sneezeCooldown + 1; // Extra turn warning
    } else if (this.selectedDifficulty === 'hard') {
      this.maxLives = 2;
      this.sneezeTimer = Math.max(1, level.sneezeCooldown - 1);
    } else if (this.selectedDifficulty === 'martina') {
      this.maxLives = 1; // Perfect play required!
      this.sneezeTimer = 1; // Sneeze every single turn!
    } else {
      this.maxLives = 3;
      this.sneezeTimer = level.sneezeCooldown;
    }
    
    this.lives = this.maxLives;
    this.sneezeCooldown = this.sneezeTimer;

    this.setupGameLayout();
    this.renderBoard();
  }

  // --- INTERFACE LAYOUT ---
  setupGameLayout() {
    const level = this.levels[this.currentLevelIndex];
    this.container.innerHTML = `
      <div class="empanadas-container">
        
        <div class="empanadas-top-bar">
          <button class="btn-close-modal" id="btn-back-to-select" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            ← Menú de Desafíos
          </button>
          <div class="timer-box" style="background: rgba(230, 57, 70, 0.2); border-color: var(--rose);">
            <span id="sneeze-timer-label">🤧 Siguiente Estornudo en:</span> <span id="sneeze-timer-val" style="color: var(--rose); font-weight: 800;">${this.sneezeTimer} turnos</span>
          </div>
        </div>

        <div class="empanadas-layout">
          
          <!-- Tablero de ajedrez -->
          <div class="cooking-station">
            <div class="chess-board-wrapper">
              <div class="chess-board" id="chess-board-DOM"></div>
            </div>
          </div>

          <!-- Panel de control derecho -->
          <div class="maze-dashboard">
            
            <div class="recipe-card" style="border-top-color: var(--rose);">
              <h3 style="color: var(--rose); font-family: 'Nunito', sans-serif;">Etapa ${this.currentLevelIndex + 1}: ${level.name}</h3>
              <p style="font-size: 0.9rem; line-height: 1.4; opacity: 0.95; margin-bottom: 0;">${level.description}</p>
            </div>

            <!-- Panel de instrucciones sobre cómo jugar -->
            <div class="recipe-card" style="border-top-color: var(--gold); margin-top: 1rem; background: rgba(244, 162, 97, 0.05); border-left: 4px solid var(--gold);">
              <h4 style="color: var(--gold-light); font-family: 'Nunito', sans-serif; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                📖 ¿Cómo jugar?
              </h4>
              <ul style="font-size: 0.8rem; padding-left: 1.2rem; line-height: 1.45; opacity: 0.95; display: flex; flex-direction: column; gap: 0.4rem; list-style-type: '♟️ ';">
                <li>Mueve a <strong>Peoncito</strong> 1 casilla a tu alrededor (como un Rey).</li>
                <li>Recoge todos los <strong>bigotes perdidos</strong> (🥸) del tablero.</li>
                <li>Esquiva los <strong>estornudos</strong> de la Reina: las zonas 💨 son de advertencia, ¡y las ⚠️ explotarán el próximo turno!</li>
                <li>Alcanza la <strong>caja dorada de pañuelos</strong> (🧻) para ganar el nivel.</li>
              </ul>
            </div>

            <div class="moves-left-card">
              <div class="stat-label">❤️ Vidas Restantes</div>
              <div class="moves-count" id="lives-display-val" style="color: var(--rose); letter-spacing: 0.15rem;"></div>
            </div>

            <div class="moves-left-card" style="border-bottom-color: var(--sage);">
              <div class="stat-label">🥸 Bigotes Recogidos</div>
              <div class="moves-count" id="mustaches-display-val" style="color: var(--sage);">0 / 0</div>
            </div>

          </div>

        </div>

      </div>
    `;

    // Bind back button
    document.getElementById('btn-back-to-select').addEventListener('click', () => {
      this.destroy();
      this.showWelcomeScreen();
    });

    this.updateStatsDisplay();
  }

  // --- RENDER CHESSBOARD ---
  renderBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    // Blindfold mode in Martina difficulty
    if (this.selectedDifficulty === 'martina') {
      boardDOM.classList.add('board-blindfold');
    } else {
      boardDOM.classList.remove('board-blindfold');
    }

    const level = this.levels[this.currentLevelIndex];
    const peoncitoCoord = this.coordsToName(this.peoncitoPos.r, this.peoncitoPos.c);
    const reinaCoord = this.coordsToName(this.reinaPos.r, this.reinaPos.c);
    
    // Get legal neighbors for Peoncito (standard King steps in dreamworld)
    const legalMoves = this.getLegalPeoncitoMoves(this.peoncitoPos.r, this.peoncitoPos.c);
    
    // Get current sneeze warning squares
    const warnings = this.getSneezeWarningSquares(level, this.coordsToName(this.reinaPos.r, this.reinaPos.c));

    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c);
        const coord = `${file}${r}`;
        const isDark = (r + c) % 2 === 0;

        const square = document.createElement('div');
        square.className = `chess-square ${isDark ? 'square-dark' : 'square-light'}`;
        square.setAttribute('data-coord', coord);

        // Render obstacles/lava/ice
        if (level.obstacles.includes(coord)) {
          square.classList.add('square-obstacle');
          if (level.ice.includes(coord)) {
            square.classList.add('square-ice');
          } else if (level.lava.includes(coord)) {
            square.classList.add('square-lava');
          }
        }

        // Render warning highlights: 2 states (danger vs breathing/wind warning)
        if (this.gameActive && warnings.includes(coord)) {
          if (this.sneezeTimer === 1) {
            square.classList.add('square-sneeze-warning');
          } else {
            square.classList.add('square-sneeze-premonition');
          }
        }

        // Render mustaches
        if (level.mustaches.includes(coord) && !this.mustachesCollected.includes(coord)) {
          square.classList.add('square-mustache');
        }

        // Render Tissue Box (Destination Goal)
        if (level.tissueBox === coord) {
          square.classList.add('square-tissue-box');
        }

        // Render Peoncito
        if (coord === peoncitoCoord) {
          const peonEl = document.createElement('div');
          peonEl.className = 'square-peoncito';
          peonEl.textContent = '♙';
          square.appendChild(peonEl);
        }

        // Render Reina Negra
        if (coord === reinaCoord) {
          const reinaEl = document.createElement('div');
          reinaEl.className = 'square-reina';
          reinaEl.textContent = '♛';
          square.appendChild(reinaEl);
        }

        // Highlight legal movement options (clickable neighbors)
        if (this.gameActive && legalMoves.includes(coord) && !level.obstacles.includes(coord)) {
          square.classList.add('square-easy-to');
          square.style.cursor = 'pointer';
          square.addEventListener('click', () => this.movePeoncito(coord));
        }

        boardDOM.appendChild(square);
      }
    }
  }

  // --- STATS HUD SYNCHRONIZER ---
  updateStatsDisplay() {
    const livesEl = document.getElementById('lives-display-val');
    const mustachesEl = document.getElementById('mustaches-display-val');
    const timerValEl = document.getElementById('sneeze-timer-val');
    
    if (livesEl) {
      let hearts = '';
      for (let l = 0; l < this.maxLives; l++) {
        hearts += l < this.lives ? '❤️' : '🖤';
      }
      livesEl.textContent = hearts;
    }

    if (mustachesEl) {
      const total = this.levels[this.currentLevelIndex].mustaches.length;
      mustachesEl.textContent = `${this.mustachesCollected.length} / ${total}`;
    }

    if (timerValEl) {
      timerValEl.textContent = `${this.sneezeTimer} turnos`;
      if (this.sneezeTimer === 1) {
        timerValEl.style.color = '#e63946';
        timerValEl.classList.add('moves-danger');
      } else {
        timerValEl.style.color = 'var(--rose)';
        timerValEl.classList.remove('moves-danger');
      }
    }
  }

  // --- LEGAL MOVEMENT CALCULATOR ---
  getLegalPeoncitoMoves(r, c) {
    const moves = [];
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    for (let i = 0; i < 8; i++) {
      let nr = r + dr[i];
      let nc = c + dc[i];
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        moves.push(this.coordsToName(nr, nc));
      }
    }
    return moves;
  }

  // --- DETECT ADVANCED MOVEMENT AND BLOCKS ---
  movePeoncito(coord) {
    if (!this.gameActive) return;

    const targetPos = this.nameToCoords(coord);
    this.peoncitoPos = targetPos;
    window.GameAudio.playMove();

    const level = this.levels[this.currentLevelIndex];

    // Collect mustache check
    if (level.mustaches.includes(coord) && !this.mustachesCollected.includes(coord)) {
      this.mustachesCollected.push(coord);
      window.GameAudio.playCapture();
    }

    // Tick Sneeze timer down
    this.sneezeTimer--;
    
    if (this.sneezeTimer <= 0) {
      this.detonateSneeze();
    } else {
      // Periodic Reina movements on high ranks to keep it highly dynamic
      this.moveReinaRandomly();
      this.updateStatsDisplay();
      this.renderBoard();
    }

    // Win condition check: collected all mustaches and reached tissue box
    if (coord === level.tissueBox) {
      if (this.mustachesCollected.length === level.mustaches.length) {
        this.victory();
      } else {
        // Show informative prompt
        this.updateStatsDisplay();
        this.renderBoard();
      }
    }
  }

  // --- RANDOMISED REINA STEP TO ALTER PATTERNS ---
  moveReinaRandomly() {
    // La Reina se mantiene en su trono para que los patrones de estornudo sean estratégicos y predecibles.
    const level = this.levels[this.currentLevelIndex];
    const targetPos = this.nameToCoords(level.reinaPos);
    this.reinaPos = targetPos;
  }

  // --- SNEEZE DETONATOR ENGINE ---
  detonateSneeze() {
    this.gameActive = false;
    const level = this.levels[this.currentLevelIndex];
    const warnings = this.getSneezeWarningSquares(level, this.coordsToName(this.reinaPos.r, this.reinaPos.c));
    const peoncitoCoord = this.coordsToName(this.peoncitoPos.r, this.peoncitoPos.c);
    
    // Play custom synthesized sound
    this.playSneezeSound();

    // Trigger visual blast animations in DOM
    const boardDOM = document.getElementById('chess-board-DOM');
    if (boardDOM) {
      warnings.forEach(coord => {
        const sq = boardDOM.querySelector(`[data-coord="${coord}"]`);
        if (sq) {
          sq.classList.add('square-sneeze-blast');
        }
      });
    }

    // Check hit
    const gotHit = warnings.includes(peoncitoCoord);
    
    setTimeout(() => {
      if (gotHit) {
        this.lives--;
        window.GameAudio.playError();
        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
      }
      
      // Reset Sneeze timer
      this.sneezeTimer = this.sneezeCooldown;
      this.gameActive = true;
      this.moveReinaRandomly();
      
      this.updateStatsDisplay();
      this.renderBoard();
    }, 600);
  }

  // --- CUSTOM AUDIO SYNTH FOR SNEEZE (ACHÚÚS!) ---
  playSneezeSound() {
    const audioCtx = window.GameAudio.ctx || window.activeAudioContext;
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      
      // Ah... (triangle glide up)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      
      // ...CHOO! (bandpass noise burst)
      const osc2 = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain2 = audioCtx.createGain();
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(90, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(35, now + 0.45);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.45);
      filter.Q.setValueAtTime(6, now + 0.15);
      
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      
      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      osc2.start(now + 0.15);
      osc2.stop(now + 0.48);
    } catch(e) {
      console.warn("Failed to synthesis sneeze", e);
    }
  }

  // --- VICTORY RESOLUTION ---
  victory() {
    this.gameActive = false;
    window.GameAudio.playVictory();

    // Reward stars based on remaining lives
    let starsWon = 1;
    if (this.lives === this.maxLives) starsWon = 3;
    else if (this.lives > 1) starsWon = 2;

    this.saveProgress(starsWon);

    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    let starsHTML = '';
    for (let s = 1; s <= 3; s++) {
      starsHTML += s <= starsWon 
        ? `<span class="star-filled ${starClass}">★</span>` 
        : '<span class="star-empty">★</span>';
    }

    // Award card pack if maximum stars scored
    let packRewardHTML = '';
    if (starsWon === 3) {
      let packs = parseInt(localStorage.getItem('martina_album_packs')) || 0;
      localStorage.setItem('martina_album_packs', packs + 1);
      packRewardHTML = `
        <div style="margin-top: 1rem; color: var(--gold); font-size: 1.1rem; font-weight: 800; animation: bounceCarrot 1s infinite alternate;">
          🎒 ¡PERFECTO! Has ganado 1 SOBRE DE CROMOS para tu libreta de clavadas. ¡Ve al Álbum a abrirlo!
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="game-screen">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🏆🧻</div>
        <h2>¡Desafío Superado!</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--sage);">
          ¡Excelente esquiva! Peoncito le entrega la caja dorada de pañuelos a la Reina Negra y recupera su gran bigote.
        </p>
        <div class="victory-stars" style="font-size: 2.5rem; margin-bottom: 1.5rem;">
          ${starsHTML}
        </div>
        ${packRewardHTML}
        <div style="display: flex; gap: 1rem; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-victory-back" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">Menú</button>
          <button class="btn btn-game-screen" id="btn-victory-next" style="background: var(--rose);">Siguiente Nivel →</button>
        </div>
      </div>
    `;

    document.getElementById('btn-victory-back').addEventListener('click', () => this.showWelcomeScreen());
    
    const nextBtn = document.getElementById('btn-victory-next');
    if (this.currentLevelIndex < this.levels.length - 1) {
      nextBtn.addEventListener('click', () => {
        this.currentLevelIndex++;
        this.startGame();
      });
    } else {
      nextBtn.textContent = '¡Juego Completado! 🎉';
      nextBtn.style.background = 'var(--gold)';
      nextBtn.addEventListener('click', () => this.showWelcomeScreen());
    }
  }

  // --- GAME OVER RESOLUTION ---
  gameOver() {
    this.gameActive = false;
    window.GameAudio.playError();

    this.container.innerHTML = `
      <div class="game-screen">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🤧🦠</div>
        <h2>¡Achuús!</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: #ff6b6b;">
          ¡Peoncito ha quedado cubierto de mocos de estornudo! Se ha quedado sin vidas.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-gameover-back" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">Menú</button>
          <button class="btn btn-game-screen" id="btn-gameover-retry" style="background: var(--rose);">Reintentar 🔁</button>
        </div>
      </div>
    `;

    document.getElementById('btn-gameover-back').addEventListener('click', () => this.showWelcomeScreen());
    document.getElementById('btn-gameover-retry').addEventListener('click', () => this.startGame());
  }

  // --- PERSIST PROGRESS ---
  saveProgress(starsWon) {
    let key = 'martina_reina_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_reina_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_reina_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_reina_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);

    const oldStars = progress[this.currentLevelIndex] || 0;
    if (starsWon > oldStars) {
      progress[this.currentLevelIndex] = starsWon;
      localStorage.setItem(key, JSON.stringify(progress));
    }
    
    // Update main games-hub stats automatically
    if (window.loadDashboardStats) {
      window.loadDashboardStats();
    }
  }

  // --- UTILS COORD CONVERTERS ---
  coordsToName(r, c) {
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    return `${file}${rank}`;
  }

  nameToCoords(name) {
    const c = name.charCodeAt(0) - 97;
    const r = 8 - parseInt(name.charAt(1));
    return { r, c };
  }

  getSneezeWarningSquares(level, reinaPos) {
    const squares = [];
    const rCoords = this.nameToCoords(reinaPos);
    const patternType = level.sneezePatternType;

    switch (patternType) {
      case 'column':
        for (let r = 0; r < 8; r++) {
          squares.push(this.coordsToName(r, rCoords.c));
        }
        break;
      case 'cross':
        for (let i = 0; i < 8; i++) {
          squares.push(this.coordsToName(i, rCoords.c));
          squares.push(this.coordsToName(rCoords.r, i));
        }
        break;
      case 'diagonal':
        for (let i = -7; i <= 7; i++) {
          let r1 = rCoords.r + i;
          let c1 = rCoords.c + i;
          if (r1 >= 0 && r1 < 8 && c1 >= 0 && c1 < 8) {
            squares.push(this.coordsToName(r1, c1));
          }
          let r2 = rCoords.r + i;
          let c2 = rCoords.c - i;
          if (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8) {
            squares.push(this.coordsToName(r2, c2));
          }
        }
        break;
      case 'center3x3':
        const centerPos = { r: 4, c: 4 }; // e4
        for (let r = centerPos.r - 1; r <= centerPos.r + 1; r++) {
          for (let c = centerPos.c - 1; c <= centerPos.c + 1; c++) {
            squares.push(this.coordsToName(r, c));
          }
        }
        break;
      case 'knight':
        const dr = [-2, -2, -1, -1, 1, 1, 2, 2];
        const dc = [-1, 1, -2, 2, -2, 2, -1, 1];
        for (let i = 0; i < 8; i++) {
          let nr = rCoords.r + dr[i];
          let nc = rCoords.c + dc[i];
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            squares.push(this.coordsToName(nr, nc));
          }
        }
        break;
      case 'random':
        if (level.randomTargets) {
          squares.push(...level.randomTargets);
        }
        break;
      case 'ranks':
        if (level.targetRanks) {
          level.targetRanks.forEach(rank => {
            const rIdx = 8 - rank;
            for (let c = 0; c < 8; c++) {
              squares.push(this.coordsToName(rIdx, c));
            }
          });
        }
        break;
      case 'giant_cross':
        [3, 5, 7].forEach(rank => {
          const rIdx = 8 - rank;
          for (let c = 0; c < 8; c++) {
            squares.push(this.coordsToName(rIdx, c));
          }
        });
        break;
      case 'surrounding_peoncito':
        const pPos = this.peoncitoPos;
        for (let r = pPos.r - 1; r <= pPos.r + 1; r++) {
          for (let c = pPos.c - 1; c <= pPos.c + 1; c++) {
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
              squares.push(this.coordsToName(r, c));
            }
          }
        }
        break;
      case 'massive_grid':
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const colName = String.fromCharCode(97 + c);
            const rankName = 8 - r;
            if (['c', 'd', 'e'].includes(colName) || [4, 5].includes(rankName)) {
              squares.push(this.coordsToName(r, c));
            }
          }
        }
        break;
    }
    return [...new Set(squares)];
  }

  destroy() {
    this.gameActive = false;
  }
}

// Register inside MartinaGames global namespace
window.MartinaGames.reina = ReinaGame;
