// === JUEGO: EL LABERINTO DEL CABALLO DE Ŋ ===
// Minijuego táctico de cálculo de saltos de caballo en L.
// Cuenta con 10 niveles de dificultad progresiva, selector de niveles, estrellas y guardado persistente.

class CaballoGame {
  constructor(container) {
    this.container = container;
    this.currentLevelIndex = 0;
    this.score = 0;
    this.movesLeft = 15;
    this.gameActive = false;
    this.horsePos = { r: 7, c: 1 }; // Starts at b1
    this.carrotsCollected = [];
    this.trophyActive = false;
    this.selectedDifficulty = localStorage.getItem('martina_caballo_difficulty') || 'medium';

    // 10 Progressive levels
    this.levels = [
      {
        name: "Pradera del Centro",
        description: "Recoge todas las zanahorias del Río Central y galopa hasta la Copa de Oro.",
        moves: 10,
        carrots: ['c3', 'e4', 'd6'],
        obstacles: ['d4', 'd5', 'e5'],
        ice: [],
        lava: [],
        trophy: 'g7',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Mina de Obstáculos",
        description: "Esquiva los muros de piedra gris en c3 y f6. ¡Calcula bien tu ruta!",
        moves: 14,
        carrots: ['b3', 'f3', 'c5', 'e5'],
        obstacles: ['a4', 'd3', 'd6', 'g5', 'f6'],
        ice: [],
        lava: [],
        trophy: 'h8',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Bosque Encantado",
        description: "Un circuito táctico complejo. Mide cada salto para no quedar atrapado en las esquinas.",
        moves: 18,
        carrots: ['a3', 'h3', 'c4', 'f4', 'd7'],
        obstacles: ['b2', 'g2', 'c6', 'f6', 'e4', 'd4', 'd5'],
        ice: [],
        lava: [],
        trophy: 'e8',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Laberinto de Hielo",
        description: "¡El frío del norte ha congelado el tablero! Evita resbalar en las casillas heladas y glaciares.",
        moves: 14,
        carrots: ['b2', 'g3', 'e6', 'b6'],
        obstacles: ['f3', 'c6', 'd2', 'e3', 'e4'],
        ice: ['f3', 'c6', 'd2', 'e3', 'e4'], // Visual ice
        lava: [],
        trophy: 'g7',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Volcán de Sombras",
        description: "Lava hirviente y ceniza cubren las esquinas. Mantente firme en el centro del tablero.",
        moves: 16,
        carrots: ['c2', 'f2', 'd6', 'e6', 'b4'],
        obstacles: ['a2', 'b1', 'g1', 'h2', 'a8', 'h8', 'e3', 'd4'],
        ice: [],
        lava: ['a2', 'b1', 'g1', 'h2', 'a8', 'h8', 'e3', 'd4'], // Visual lava
        trophy: 'g5',
        startPos: { r: 7, c: 2 } // c1
      },
      {
        name: "La Ciudad Prohibida",
        description: "Corredores extremadamente estrechos. ¡Calcula cada giro en L con absoluta precisión!",
        moves: 18,
        carrots: ['a4', 'h4', 'c6', 'f6', 'd3'],
        obstacles: ['b3', 'g3', 'b5', 'g5', 'c2', 'f2', 'd4', 'e4', 'd5', 'e5'],
        ice: [],
        lava: [],
        trophy: 'e7',
        startPos: { r: 7, c: 0 } // a1
      },
      {
        name: "El Desierto de D5",
        description: "Dunas gigantes cubren el centro. Encuentra los oasis lejanos bordeando el Río Central.",
        moves: 20,
        carrots: ['b3', 'g3', 'a6', 'h6', 'c7', 'f7'],
        obstacles: ['d4', 'd5', 'e4', 'e5', 'c4', 'f4', 'c5', 'f5'],
        ice: [],
        lava: [],
        trophy: 'e8',
        startPos: { r: 7, c: 3 } // d1
      },
      {
        name: "Glaciar del Rey",
        description: "¡El hielo se ha apoderado de las casillas del enroque! Navega por los glaciares helados.",
        moves: 18,
        carrots: ['a2', 'h2', 'c4', 'f4', 'd6'],
        obstacles: ['e1', 'e2', 'f1', 'f2', 'b3', 'g3', 'c5'],
        ice: ['e1', 'e2', 'f1', 'f2'],
        lava: [],
        trophy: 'g6',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "El Templo del Fianchetto",
        description: "Las diagonales sagradas del Fianchetto están cubiertas de lava hirviente. ¡Ten mucho cuidado!",
        moves: 20,
        carrots: ['b3', 'g3', 'c2', 'f2', 'c6', 'f6'],
        obstacles: ['g2', 'h1', 'b2', 'a1', 'c3', 'f3', 'd5', 'e5'],
        ice: [],
        lava: ['g2', 'h1', 'b2', 'a1'],
        trophy: 'd7',
        startPos: { r: 7, c: 4 } // e1
      },
      {
        name: "La Cumbre de las 64 Casillas",
        description: "¡El gran desafío final! 8 zanahorias dispersas, un denso laberinto y un límite de saltos impecable.",
        moves: 22,
        carrots: ['a3', 'h3', 'c2', 'f2', 'c6', 'f6', 'b4', 'g4'],
        obstacles: ['d3', 'e3', 'd4', 'e4', 'd5', 'e5', 'd6', 'e6', 'a7', 'h7', 'b8', 'g8'],
        ice: [],
        lava: [],
        trophy: 'd7',
        startPos: { r: 7, c: 4 } // e1
      },
      {
        name: "Río de Diamantes",
        description: "Recoge las zanahorias flotantes en las orillas del Gran Río Central. ¡Cuidado con las corrientes de lava!",
        moves: 18,
        carrots: ['b2', 'g2', 'c7', 'f7', 'd4', 'e5'],
        obstacles: ['d3', 'e3', 'd6', 'e6', 'c4', 'f5'],
        lava: ['d3', 'e3', 'd6', 'e6', 'c4', 'f5'],
        ice: [],
        trophy: 'd8',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "La Prisión del Enroque",
        description: "El rey enemigo ha fortificado el enroque corto. Salta los muros helados para reclamar tu premio.",
        moves: 16,
        carrots: ['f7', 'h7', 'g6', 'f8', 'h8'],
        obstacles: ['f6', 'g7', 'h6', 'e7', 'e8'],
        ice: ['f6', 'g7', 'h6', 'e7', 'e8'],
        lava: [],
        trophy: 'g8',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "El Desfiladero Glacial",
        description: "Deslízate por un desfiladero estrecho rodeado de glaciares traicioneros. ¡Un paso en falso y te congelarás!",
        moves: 18,
        carrots: ['a2', 'b4', 'c6', 'd8', 'f8', 'g6', 'h4'],
        obstacles: ['b3', 'c4', 'd5', 'e6', 'f7', 'a6', 'h6', 'e4', 'd4'],
        ice: ['b3', 'c4', 'd5', 'e6', 'f7', 'a6', 'h6', 'e4', 'd4'],
        lava: [],
        trophy: 'f3',
        startPos: { r: 7, c: 0 } // a1
      },
      {
        name: "La Danza del Fianchetto",
        description: "Realiza una danza geométrica perfecta alrededor de las diagonales del alfil dragón. ¡La lava fluye en g2 y b7!",
        moves: 20,
        carrots: ['a3', 'c3', 'f3', 'h3', 'a6', 'c6', 'f6', 'h6'],
        obstacles: ['b2', 'g2', 'b7', 'g7', 'd4', 'e4', 'd5', 'e5'],
        ice: [],
        lava: ['b2', 'g2', 'b7', 'g7'],
        trophy: 'd7',
        startPos: { r: 7, c: 4 } // e1
      },
      {
        name: "La Gran Muralla del Reino",
        description: "¡La muralla de peones bloquea el norte! Salta la barrera con total determinación y corona en la cima.",
        moves: 22,
        carrots: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
        obstacles: ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
        ice: [],
        lava: [],
        trophy: 'e8',
        startPos: { r: 7, c: 1 } // b1
      }
    ];
  }

  // --- INITIAL LEVEL SELECT SCREEN ---
  showWelcomeScreen() {
    let key = 'martina_caballo_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_caballo_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_caballo_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_caballo_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);
    
    let levelCardsHTML = '';
    
    // Thematic star styles based on difficulty
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
          <div class="level-card-desc">${level.description}</div>
          <div class="level-card-footer">
            <span class="level-card-meta">${level.carrots.length} Zanahorias</span>
            ${isLocked ? '' : '<button class="level-card-play-btn">Cabalgar 🐴</button>'}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="level-select-container">
        <div class="level-select-header">
          <h2>🐴 El Laberinto de Ŋ 🐴</h2>
          <p>Guiá al Caballo de Ŋ en su entrenamiento táctico de saltos en L. ¡Esquiva trampas y gana estrellas!</p>
          
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

    // Click event for difficulty selector
    const diffButtons = this.container.querySelectorAll('.diff-tab');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const diff = btn.getAttribute('data-diff');
        this.selectedDifficulty = diff;
        localStorage.setItem('martina_caballo_difficulty', diff);
        window.GameAudio.playMove();
        this.showWelcomeScreen();
      });
    });

    // Click events
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
    this.score = 0;
    this.loadLevel();
  }

  loadLevel() {
    const currentLevel = this.levels[this.currentLevelIndex];
    
    // Apply difficulty modifiers for moves left
    let moveModifier = 0;
    if (this.selectedDifficulty === 'easy') moveModifier = 5;
    if (this.selectedDifficulty === 'hard') moveModifier = -2;
    if (this.selectedDifficulty === 'martina') moveModifier = -4;

    this.movesLeft = currentLevel.moves + moveModifier;
    this.gameActive = true;
    this.trophyActive = false;
    this.carrotsCollected = [];

    // Parse starting position
    this.horsePos = { ...currentLevel.startPos };

    this.setupGameLayout();
    this.renderBoard();
  }

  // --- SETUP LAYOUT ---
  setupGameLayout() {
    const currentLevel = this.levels[this.currentLevelIndex];
    this.container.innerHTML = `
      <div class="empanadas-container">
        
        <div class="empanadas-top-bar">
          <button class="btn-close-modal" id="btn-back-to-select" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            ← Menú de Laberintos
          </button>
          <div class="score-box" style="border-color: var(--sage);">
            <span>🥕 Recolectadas:</span> <span id="carrots-count">0 / ${currentLevel.carrots.length}</span>
          </div>
        </div>

        <div class="empanadas-layout">
          
          <!-- Tablero de ajedrez -->
          <div class="cooking-station">
            <div class="chess-board-wrapper">
              <div class="chess-board" id="chess-board-DOM"></div>
            </div>
          </div>

          <!-- Información del Nivel -->
          <div class="maze-dashboard">
            
            <div class="recipe-instruction-card" style="border-color: var(--sage);">
              <h4 style="color: var(--sage);">${currentLevel.name}</h4>
              <p style="font-size: 0.9rem; margin-top: 0.5rem; line-height: 1.5; opacity: 0.9;">
                ${currentLevel.description}
              </p>
            </div>

            <!-- Movimientos restantes -->
            <div class="moves-left-card">
              <span>Saltos Restantes</span>
              <div class="moves-count" id="moves-left-val">${this.movesLeft}</div>
            </div>

          </div>

        </div>

      </div>
    `;

    document.getElementById('btn-back-to-select').addEventListener('click', () => {
      this.destroy();
      this.showWelcomeScreen();
    });
  }

  // --- RENDER CHESSBOARD ---
  renderBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    // Blindfold chess in Martina Mode
    if (this.selectedDifficulty === 'martina') {
      boardDOM.classList.add('board-blindfold');
    } else {
      boardDOM.classList.remove('board-blindfold');
    }

    const currentLevel = this.levels[this.currentLevelIndex];
    const horseCoord = this.coordsToName(this.horsePos.r, this.horsePos.c);
    const legalMoves = this.getLegalKnightMoves(this.horsePos.r, this.horsePos.c);

    // Visual assist in Easy Mode: Highlight the L-move(s) that get closest to the remaining targets
    let bestMoves = [];
    if (this.selectedDifficulty === 'easy') {
      let targets = currentLevel.carrots.filter(co => !this.carrotsCollected.includes(co));
      if (targets.length === 0 && this.trophyActive) {
        targets = [currentLevel.trophy];
      }
      if (targets.length > 0) {
        let targetCoords = targets.map(t => this.nameToCoords(t));
        let moveDistances = [];
        let minMovesDist = Infinity;
        
        legalMoves.forEach(mCoord => {
          if (!currentLevel.obstacles.includes(mCoord)) {
            let mPos = this.nameToCoords(mCoord);
            let minD = Infinity;
            targetCoords.forEach(tPos => {
              let dist = Math.abs(mPos.r - tPos.r) + Math.abs(mPos.c - tPos.c);
              if (dist < minD) minD = dist;
            });
            moveDistances.push({ coord: mCoord, dist: minD });
            if (minD < minMovesDist) {
              minMovesDist = minD;
            }
          }
        });
        
        bestMoves = moveDistances.filter(md => md.dist === minMovesDist).map(md => md.coord);
      }
    }

    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c);
        const coord = `${file}${r}`;
        const isDark = (r + c) % 2 === 0;

        const square = document.createElement('div');
        square.className = `chess-square ${isDark ? 'square-dark' : 'square-light'}`;
        square.setAttribute('data-coord', coord);

        // Render obstacles
        if (currentLevel.obstacles.includes(coord)) {
          square.classList.add('square-obstacle');
          // Add custom theme styles
          if (currentLevel.ice.includes(coord)) {
            square.classList.add('square-ice');
          } else if (currentLevel.lava.includes(coord)) {
            square.classList.add('square-lava');
          }
        }

        // Render carrots
        if (currentLevel.carrots.includes(coord) && !this.carrotsCollected.includes(coord)) {
          square.classList.add('square-carrot');
        }

        // Render Trophy
        if (this.trophyActive && currentLevel.trophy === coord) {
          square.classList.add('square-trophy');
        }

        // Render Horse
        if (coord === horseCoord) {
          const horseEl = document.createElement('div');
          horseEl.className = 'chess-piece white-piece';
          horseEl.textContent = '♘';
          horseEl.style.fontSize = '2.2rem';
          horseEl.style.color = '#f4a261';
          horseEl.style.textShadow = '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000';
          square.appendChild(horseEl);
        }

        // Highlight legal knight destinations
        if (legalMoves.includes(coord) && !currentLevel.obstacles.includes(coord)) {
          square.classList.add('square-path');
          square.addEventListener('click', () => this.moveHorseTo(coord));
        }

        // Visual assist in Easy Mode: Highlight start position and optimal path
        if (this.selectedDifficulty === 'easy') {
          if (coord === horseCoord) {
            square.classList.add('square-easy-from');
          }
          if (bestMoves.includes(coord)) {
            square.classList.add('square-easy-to');
          }
        }

        boardDOM.appendChild(square);
      }
    }
  }

  // --- KNIGHT MOVEMENT LOGIC ---
  getLegalKnightMoves(r, c) {
    const offsets = [
      { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
      { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
      { dr: 1, dc: -2 },  { dr: 1, dc: 2 },
      { dr: 2, dc: -1 },  { dr: 2, dc: 1 }
    ];

    const moves = [];
    offsets.forEach(offset => {
      const nr = r + offset.dr;
      const nc = c + offset.dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        moves.push(this.coordsToName(nr, nc));
      }
    });
    return moves;
  }

  moveHorseTo(coord) {
    if (!this.gameActive) return;

    const currentLevel = this.levels[this.currentLevelIndex];

    // Deduct moves
    this.movesLeft--;
    document.getElementById('moves-left-val').textContent = this.movesLeft;

    if (this.movesLeft <= 3) {
      document.getElementById('moves-left-val').classList.add('moves-danger');
    }

    // Play hop
    window.GameAudio.playMove();

    // Move horse
    this.horsePos = this.nameToCoords(coord);
    
    // Check carrot capture
    if (currentLevel.carrots.includes(coord) && !this.carrotsCollected.includes(coord)) {
      this.carrotsCollected.push(coord);
      this.score += 5;
      
      window.GameAudio.playSuccess();
      document.getElementById('carrots-count').textContent = `${this.carrotsCollected.length} / ${currentLevel.carrots.length}`;

      // Spawn Trophy if all carrots eaten
      if (this.carrotsCollected.length === currentLevel.carrots.length) {
        this.trophyActive = true;
        
        const boardDOM = document.getElementById('chess-board-DOM');
        boardDOM.style.boxShadow = '0 0 35px rgba(244, 162, 97, 0.8)';
        setTimeout(() => {
          if (boardDOM) boardDOM.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        }, 500);
      }
    }

    // Check Trophy victory
    if (this.trophyActive && coord === currentLevel.trophy) {
      this.completeLevel();
      return;
    }

    this.renderBoard();

    // Out of moves
    if (this.movesLeft <= 0 && this.gameActive) {
      this.gameOver();
    }
  }

  // --- COMPLETE LEVEL ---
  completeLevel() {
    this.gameActive = false;
    window.GameAudio.playVictory();

    const currentLevel = this.levels[this.currentLevelIndex];
    
    // Apply difficulty modifiers for max moves calculation
    let moveModifier = 0;
    if (this.selectedDifficulty === 'easy') moveModifier = 5;
    if (this.selectedDifficulty === 'hard') moveModifier = -2;
    if (this.selectedDifficulty === 'martina') moveModifier = -4;
    const maxMoves = currentLevel.moves + moveModifier;

    // Star calculation
    let starsWon = 1;
    if (this.movesLeft >= maxMoves * 0.40) {
      starsWon = 3;
    } else if (this.movesLeft >= maxMoves * 0.15) {
      starsWon = 2;
    }

    // Save progress to LocalStorage based on active difficulty
    let key = 'martina_caballo_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_caballo_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_caballo_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_caballo_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);
    const oldStars = progress[this.currentLevelIndex] || 0;
    
    let isNewHighStar = starsWon > oldStars;
    if (isNewHighStar) {
      progress[this.currentLevelIndex] = starsWon;
      localStorage.setItem(key, JSON.stringify(progress));
    }

    // Card pack award: got 3 stars for the first time
    let packAwarded = false;
    if (starsWon === 3 && oldStars < 3) {
      try {
        let packs = parseInt(localStorage.getItem('martina_album_packs') || '0');
        localStorage.setItem('martina_album_packs', (packs + 1).toString());
        packAwarded = true;
      } catch (e) {
        console.error(e);
      }
    }

    // Update global dashboard stats immediately!
    if (typeof window.loadDashboardStats === 'function') {
      window.loadDashboardStats();
    }

    // Theme active stars display
    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    let starsHTML = '';
    for (let s = 1; s <= 3; s++) {
      starsHTML += s <= starsWon 
        ? `<span class="star-filled ${starClass}" style="font-size: 3.5rem;">★</span>`
        : '<span class="star-empty" style="font-size: 3.5rem;">★</span>';
    }

    let packMsgHTML = packAwarded 
      ? `
        <div style="background: rgba(244, 162, 97, 0.08); border: 2px dashed var(--gold); padding: 1rem; border-radius: 16px; margin-top: 1rem; color: var(--gold-light); font-weight: 700; font-size: 0.95rem;">
          🎒 ¡PERFECTO! Has ganado 1 SOBRE DE CROMOS para tu libreta de clavadas. ¡Ve al Álbum a abrirlo!
        </div>
      `
      : '';

    const hasNext = this.currentLevelIndex < this.levels.length - 1;

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/rey_blanco_entrenamiento_1779139099201.png" alt="Nivel Completado">
        </div>
        <h2>¡Laberinto Superado! 🏆</h2>
        <p>
          ¡Fantásticos saltos en L! Has guiado al Caballo de Ŋ con precisión en **${currentLevel.name}**.
        </p>

        <div style="margin: 1rem 0;">
          ${starsHTML}
        </div>

        ${packMsgHTML}

        <div class="game-screen-stats">
          <div class="stat-item">
            <span>Puntos</span>
            <div class="stat-val">+${starsWon * 100}</div>
          </div>
          <div class="stat-item">
            <span>Saltos de Sobra</span>
            <div class="stat-val">${this.movesLeft}</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-back-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Laberintos 📋
          </button>
          ${hasNext ? '<button class="btn btn-game-screen" id="btn-next-level">Siguiente Laberinto ➔</button>' : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    if (hasNext) {
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.currentLevelIndex++;
        this.startGame();
      });
    }
  }

  // --- GAME OVER ---
  gameOver() {
    this.gameActive = false;
    window.GameAudio.playError();

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/caballo_l_equivocado_1779239565440.png" alt="Sin movimientos">
        </div>
        <h2>¡Oh no! Sin energía 🐴</h2>
        <p>
          El Caballo de Ŋ se ha cansado y se ha quedado sin saltos. ¡Inténtalo de nuevo para encontrar la ruta de L perfecta!
        </p>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-back-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Laberintos 📋
          </button>
          <button class="btn btn-game-screen" id="btn-retry-level">Reintentar Nivel 🔁</button>
        </div>
      </div>
    `;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    document.getElementById('btn-retry-level').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- UTILS COORD CONVERTER ---
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

  destroy() {
    this.gameActive = false;
  }
}

window.MartinaGames.caballo = CaballoGame;
