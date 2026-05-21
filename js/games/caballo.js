// === JUEGO: EL LABERINTO DEL CABALLO DE Ŋ ===
// Minijuego táctico de cálculo de saltos de caballo en L.

class CaballoGame {
  constructor(container) {
    this.container = container;
    this.levelIndex = 0;
    this.score = 0;
    this.movesLeft = 15;
    this.gameActive = false;
    this.horsePos = { r: 7, c: 1 }; // Starts at b1
    
    // Level layouts mapping coordinates
    this.levels = [
      {
        name: "Pradera del Centro",
        description: "Recoge todas las zanahorias del Río Central y galopa hasta la Copa de Oro.",
        moves: 10,
        carrots: ['c3', 'e4', 'd6'],
        obstacles: ['d4', 'd5', 'e5'],
        trophy: 'g7',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Mina de Obstáculos",
        description: "Esquiva los muros de piedra gris en c3 y f6. ¡Calcula bien tu ruta!",
        moves: 14,
        carrots: ['b3', 'f3', 'c5', 'e5'],
        obstacles: ['a4', 'd3', 'd6', 'g5', 'f6'],
        trophy: 'h8',
        startPos: { r: 7, c: 1 } // b1
      },
      {
        name: "Bosque Encantado",
        description: "Un circuito táctico complejo. Mide cada salto para no quedar atrapado.",
        moves: 18,
        carrots: ['a3', 'h3', 'c4', 'f4', 'd7'],
        obstacles: ['b2', 'g2', 'c6', 'f6', 'e4', 'd4', 'd5'],
        trophy: 'e8',
        startPos: { r: 7, c: 1 } // b1
      }
    ];

    this.carrotsCollected = [];
    this.trophyActive = false;
  }

  // --- INITIAL SCREEN ---
  showWelcomeScreen() {
    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/juego_caballo_l_1779376737849.png" alt="Caballo de Ŋ">
        </div>
        <h2>El Laberinto de Ŋ</h2>
        <p>
          ¡Ayuda al Caballo de Ŋ a practicar su salto en L! Debes recoger las deliciosas zanahorias repartidas por el tablero y alcanzar la copa dorada de trofeo sin quedarte sin movimientos.
        </p>
        <button class="btn btn-game-screen" id="btn-start-riding">¡Empezar a Cabalgar! 🐴</button>
      </div>
    `;

    document.getElementById('btn-start-riding').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- START GAME ---
  startGame() {
    this.levelIndex = 0;
    this.score = 0;
    this.loadLevel();
  }

  loadLevel() {
    if (this.levelIndex >= this.levels.length) {
      this.victory();
      return;
    }

    const currentLevel = this.levels[this.levelIndex];
    this.movesLeft = currentLevel.moves;
    this.gameActive = true;
    this.trophyActive = false;
    this.carrotsCollected = [];

    // Parse starting position
    this.horsePos = { ...currentLevel.startPos };

    this.setupGameLayout();
    this.renderBoard();
  }

  // --- INTERFACE LAYOUT ---
  setupGameLayout() {
    const currentLevel = this.levels[this.levelIndex];
    this.container.innerHTML = `
      <div class="empanadas-container">
        
        <div class="empanadas-top-bar">
          <div class="score-box" style="border-color: var(--sage);">
            <span>🥕 Recolectadas:</span> <span id="carrots-count">0 / ${currentLevel.carrots.length}</span>
          </div>
          <div class="score-box" style="border-color: var(--gold);">
            <span>Nivel:</span> <span>${this.levelIndex + 1} / ${this.levels.length}</span>
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
  }

  // --- RENDER CHESSBOARD MAPPED TO MAZE ---
  renderBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    const currentLevel = this.levels[this.levelIndex];
    const horseCoord = this.coordsToName(this.horsePos.r, this.horsePos.c);
    const legalMoves = this.getLegalKnightMoves(this.horsePos.r, this.horsePos.c);

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
        }

        // Render collectibles (Carrots)
        if (currentLevel.carrots.includes(coord) && !this.carrotsCollected.includes(coord)) {
          square.classList.add('square-carrot');
        }

        // Render Trophy
        if (this.trophyActive && currentLevel.trophy === coord) {
          square.classList.add('square-trophy');
        }

        // Render Horse (Knight)
        if (coord === horseCoord) {
          const horseEl = document.createElement('div');
          horseEl.className = 'chess-piece white-piece';
          horseEl.textContent = '♘';
          horseEl.style.fontSize = '2.2rem';
          horseEl.style.color = '#f4a261';
          horseEl.style.textShadow = '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000';
          square.appendChild(horseEl);
        }

        // Highlight legal destinations
        if (legalMoves.includes(coord) && !currentLevel.obstacles.includes(coord)) {
          square.classList.add('square-path');
          square.addEventListener('click', () => this.moveHorseTo(coord));
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

    const currentLevel = this.levels[this.levelIndex];

    // Deduct moves
    this.movesLeft--;
    document.getElementById('moves-left-val').textContent = this.movesLeft;

    // Check danger zones
    if (this.movesLeft <= 3) {
      document.getElementById('moves-left-val').classList.add('moves-danger');
    }

    // Play hop sound
    window.GameAudio.playMove();

    // Move horse
    this.horsePos = this.nameToCoords(coord);
    
    // Check if carrot collected
    if (currentLevel.carrots.includes(coord) && !this.carrotsCollected.includes(coord)) {
      this.carrotsCollected.push(coord);
      this.score += 5;
      
      window.GameAudio.playSuccess();

      // Update carrot progress counter
      document.getElementById('carrots-count').textContent = `${this.carrotsCollected.length} / ${currentLevel.carrots.length}`;

      // Check if all carrots collected -> Spawn Trophy!
      if (this.carrotsCollected.length === currentLevel.carrots.length) {
        this.trophyActive = true;
        
        // Success flash
        const boardDOM = document.getElementById('chess-board-DOM');
        boardDOM.style.boxShadow = '0 0 35px rgba(244, 162, 97, 0.8)';
        setTimeout(() => {
          boardDOM.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        }, 500);
      }
    }

    // Check if reached Trophy (victory level)
    if (this.trophyActive && coord === currentLevel.trophy) {
      this.completeLevel();
      return;
    }

    this.renderBoard();

    // Check failure out of moves
    if (this.movesLeft <= 0 && this.gameActive) {
      this.gameOver();
    }
  }

  // --- LEVEL COMPLETE ---
  completeLevel() {
    this.gameActive = false;
    this.score += this.movesLeft * 10; // Bonus for remaining moves!
    window.GameAudio.playVictory();

    const currentLevel = this.levels[this.levelIndex];
    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/rey_blanco_entrenamiento_1779139099201.png" alt="Nivel Completado">
        </div>
        <h2>¡Nivel Completado! 🏆</h2>
        <p>
          ¡Fantásticos saltos en L! Has guiado al Caballo de Ŋ con precisión matemática en "${currentLevel.name}".
        </p>

        <div class="game-screen-stats">
          <div class="stat-item">
            <span>Puntos</span>
            <div class="stat-val">${this.score}</div>
          </div>
          <div class="stat-item">
            <span>Saltos de Sobra</span>
            <div class="stat-val">${this.movesLeft}</div>
          </div>
        </div>

        <button class="btn btn-game-screen" id="btn-next-level">Siguiente Nivel ➔</button>
      </div>
    `;

    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.levelIndex++;
      this.loadLevel();
    });
  }

  // --- TOTAL VICTORY SCREEN ---
  victory() {
    this.gameActive = false;
    window.GameAudio.playVictory();

    let packMessage = '';
    try {
      let packs = parseInt(localStorage.getItem('martina_album_packs') || '0');
      localStorage.setItem('martina_album_packs', (packs + 1).toString());
      packMessage = `
        <div style="background: rgba(42, 111, 151, 0.1); border: 2px dashed var(--magic-blue); padding: 1rem; border-radius: 12px; margin-top: 1rem; color: var(--magic-dark); font-weight: 700; font-size: 0.95rem; width: 100%; box-sizing: border-box; text-align: center;">
          🎒 ¡Has ganado 1 SOBRE DE CROMOS para tu álbum! Ve a la sección <strong>Álbum</strong> para abrirlo.
        </div>
      `;
    } catch (e) {
      console.error(e);
    }

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/caballo_invencible_1778968679199.png" alt="Victoria Total">
        </div>
        <h2>¡Maestro de Caballos! 👑</h2>
        <p>
          ¡Impresionante! Has completado todos los laberintos. El Caballo de Ŋ ya nunca volverá a tropezar y galopa con absoluto orgullo en el centro del tablero.
        </p>
        ${packMessage}

        <div class="game-screen-stats">
          <div class="stat-item">
            <span>Récord Final</span>
            <div class="stat-val">${this.score}</div>
          </div>
          <div class="stat-item">
            <span>Rango</span>
            <div class="stat-val">Gran Maestro</div>
          </div>
        </div>

        <button class="btn btn-game-screen" id="btn-restart-game">Jugar de Nuevo 🔁</button>
      </div>
    `;

    document.getElementById('btn-restart-game').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- GAME OVER SCREEN ---
  gameOver() {
    this.gameActive = false;
    window.GameAudio.playError();

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/caballo_l_equivocado_1779239565440.png" alt="Sin movimientos">
        </div>
        <h2>¡Oh no! Sin movimientos 🐴</h2>
        <p>
          El Caballo de Ŋ se ha quedado sin energía y se ha confundido con sus saltos. ¡Inténtalo de nuevo para encontrar la ruta perfecta!
        </p>
        
        <button class="btn btn-game-screen" id="btn-retry-level">Reintentar Nivel 🔁</button>
      </div>
    `;

    document.getElementById('btn-retry-level').addEventListener('click', () => {
      this.loadLevel();
    });
  }

  // --- UTILS COORDINATES CONVERTER ---
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

// Register inside global games object
window.MartinaGames.caballo = CaballoGame;
