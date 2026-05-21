// === JUEGO: LAS EMPANADAS DE TORRETA ===
// Minijuego interactivo de preparación de aperturas de ajedrez.

class TorretaGame {
  constructor(container) {
    this.container = container;
    this.score = 0;
    this.timeLeft = 45;
    this.gameActive = false;
    this.timerInterval = null;
    
    this.recipes = [
      {
        name: "Apertura Italiana",
        excerpt: "Con tomate y albahaca, ¡el clásico del reino!",
        customer: "Peoncito",
        avatar: "assets/img/peoncito_1778904557723.png",
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "La máquina responde e5" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu Caballo a f3" },
          { type: "comp", from: "b8", to: "c6", piece: "♞", desc: "La máquina defiende con Cc6" },
          { type: "user", from: "f1", to: "c4", piece: "♗", desc: "Saca tu Alfil de casillas claras a c4" }
        ]
      },
      {
        name: "Defensa Siciliana",
        excerpt: "Picante y asimétrica, para paladares atrevidos.",
        customer: "Reina Negra",
        avatar: "assets/img/reina_negra_1778904582825.png",
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "c7", to: "c5", piece: "♟", desc: "La máquina responde c5 (Siciliana)" }
        ]
      },
      {
        name: "Gambito de Dama",
        excerpt: "Sin dama (solo masa), ¡un sacrificio delicioso!",
        customer: "Alfil Exiliado",
        avatar: "assets/img/alfil_exiliado_1778944848314.png",
        steps: [
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Mueve tu Peón de Dama a d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "La máquina responde d5" },
          { type: "user", from: "c2", to: "c4", piece: "♙", desc: "Ofrece el Peón de c4 para desviar su centro" }
        ]
      },
      {
        name: "Defensa Francesa",
        excerpt: "Compacta y sólida como una empanada de hojaldre.",
        customer: "Tomás el Erizo",
        avatar: "assets/img/tomas_erizo_1778905884457.png",
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "e7", to: "e6", piece: "♟", desc: "La máquina responde e6 (Francesa)" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Toma el control del centro con d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "La máquina golpea el centro con d5" }
        ]
      }
    ];

    this.currentRecipeIndex = 0;
    this.currentStepIndex = 0;
    this.selectedSquare = null;
    this.boardState = {}; // Coordinates mapped to pieces
  }

  // --- INITIAL SCREEN ---
  showWelcomeScreen() {
    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/juego_torreta_empanadas_1779376721444.png" alt="Empanadas de Torreta">
        </div>
        <h2>Las Empanadas de Torreta</h2>
        <p>
          ¡Ayuda a Torreta a atender su puesto en la casilla c3! Los personajes del reino tienen hambre. Prepárales sus pedidos de ajedrez jugando los movimientos correctos de cada apertura.
        </p>
        <button class="btn btn-game-screen" id="btn-start-cooking">¡Empezar a Cocinar! 🥐</button>
      </div>
    `;

    document.getElementById('btn-start-cooking').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- START GAME ---
  startGame() {
    this.score = 0;
    this.timeLeft = 45;
    this.gameActive = true;
    this.currentRecipeIndex = 0;
    this.currentStepIndex = 0;
    this.selectedSquare = null;

    this.setupGameLayout();
    this.initBoard();
    this.loadRecipe();

    // Start clock timer
    this.timerInterval = setInterval(() => {
      if (this.gameActive) {
        this.timeLeft--;
        this.updateTimerDisplay();
        
        if (this.timeLeft <= 0) {
          this.gameOver();
        }
      }
    }, 1000);
  }

  // --- SETUP INTERFACE LAYOUT ---
  setupGameLayout() {
    this.container.innerHTML = `
      <div class="empanadas-container">
        
        <div class="empanadas-top-bar">
          <div class="score-box">
            <span>⭐ Pedidos:</span> <span id="score-val">0</span>
          </div>
          <div class="timer-box" id="timer-box">
            <span>⏱️ Reloj:</span> <span id="timer-val">45s</span>
          </div>
        </div>

        <div class="empanadas-layout">
          
          <!-- Tablero de ajedrez -->
          <div class="cooking-station">
            <div class="chess-board-wrapper">
              <div class="chess-board" id="chess-board-DOM"></div>
            </div>
          </div>

          <!-- Información del pedido -->
          <div class="empanadas-dashboard">
            
            <!-- Tarjeta de cliente -->
            <div class="customer-card" id="customer-card">
              <!-- Se inyecta dinámicamente -->
            </div>

            <!-- Receta de movimientos -->
            <div class="recipe-instruction-card">
              <h4 id="recipe-name">Apertura</h4>
              <p id="recipe-excerpt" style="font-size: 0.9rem; margin-bottom: 0.8rem; font-style: italic; opacity: 0.8;"></p>
              <div class="moves-recipe-list" id="moves-recipe-list">
                <!-- Pasos de la apertura -->
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // --- CHESSBOARD LOGIC ---
  initBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    boardDOM.innerHTML = '';
    this.boardState = {};

    // Initial piece placement on board coordinates
    const initialSetup = {
      // Black Pieces
      'a8': '♜', 'b8': '♞', 'c8': '♝', 'd8': '♛', 'e8': '♚', 'f8': '♝', 'g8': '♞', 'h8': '♜',
      'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟',
      // White Pieces
      'a2': '♙', 'b2': '♙', 'c2': '♙', 'd2': '♙', 'e2': '♙', 'f2': '♙', 'g2': '♙', 'h2': '♙',
      'a1': '♖', 'b1': '♘', 'c1': '♗', 'd1': '♕', 'e1': '♔', 'f1': '♗', 'g1': '♘', 'h1': '♖'
    };

    // Fill board state
    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c); // a-h
        const coord = `${file}${r}`;
        this.boardState[coord] = initialSetup[coord] || null;
      }
    }

    this.renderBoardDOM();
  }

  renderBoardDOM() {
    const boardDOM = document.getElementById('chess-board-DOM');
    boardDOM.innerHTML = '';

    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c);
        const coord = `${file}${r}`;
        const isDark = (r + c) % 2 === 0;

        const square = document.createElement('div');
        square.className = `chess-square ${isDark ? 'square-dark' : 'square-light'}`;
        square.setAttribute('data-coord', coord);

        const piece = this.boardState[coord];
        if (piece) {
          const pieceEl = document.createElement('div');
          const isWhite = '♙♘♗♖♕♔'.includes(piece);
          pieceEl.className = `chess-piece ${isWhite ? 'white-piece' : 'black-piece'}`;
          pieceEl.textContent = piece;
          
          // Style piece
          pieceEl.style.fontSize = '2rem';
          pieceEl.style.color = isWhite ? '#f4a261' : '#012a4a';
          pieceEl.style.textShadow = isWhite 
            ? '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
            : '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff';

          square.appendChild(pieceEl);
        }

        // Highlight selected
        if (this.selectedSquare === coord) {
          square.classList.add('square-selected');
        }

        square.addEventListener('click', () => this.handleSquareClick(coord));
        boardDOM.appendChild(square);
      }
    }
  }

  // --- SQUARE CLICKS CONTROLLER ---
  handleSquareClick(coord) {
    if (!this.gameActive) return;

    const currentRecipe = this.recipes[this.currentRecipeIndex];
    const currentStep = currentRecipe.steps[this.currentStepIndex];

    // If it's a computer move step, wait for machine
    if (currentStep.type === 'comp') return;

    const piece = this.boardState[coord];

    // First click: Select piece
    if (!this.selectedSquare) {
      if (piece && '♙♘♗♖♕♔'.includes(piece)) { // Must select user (white) piece
        this.selectedSquare = coord;
        window.GameAudio.playMove();
        this.renderBoardDOM();
      }
      return;
    }

    // Second click: Move target
    const fromCoord = this.selectedSquare;
    const toCoord = coord;

    // Reset selection if clicking the same square
    if (fromCoord === toCoord) {
      this.selectedSquare = null;
      this.renderBoardDOM();
      return;
    }

    // Check if correct step move
    if (fromCoord === currentStep.from && toCoord === currentStep.to) {
      // Success move!
      this.executeMove(fromCoord, toCoord);
      this.selectedSquare = null;
      this.currentStepIndex++;
      this.updateRecipeStepDisplay();

      // Check if recipe completed
      if (this.currentStepIndex >= currentRecipe.steps.length) {
        this.completeRecipe();
      } else {
        // Play success tone
        window.GameAudio.playMove();
        
        // Next step is computer? Make auto-move after 500ms
        const nextStep = currentRecipe.steps[this.currentStepIndex];
        if (nextStep && nextStep.type === 'comp') {
          setTimeout(() => this.executeComputerMove(nextStep), 600);
        }
      }
    } else {
      // Incorrect move!
      window.GameAudio.playError();
      this.selectedSquare = null;
      
      // Shake the active step to notify error
      const activeStepEl = document.querySelector('.move-active');
      if (activeStepEl) {
        activeStepEl.classList.add('shake');
        setTimeout(() => activeStepEl.classList.remove('shake'), 400);
      }
      
      this.renderBoardDOM();
    }
  }

  executeMove(from, to) {
    const piece = this.boardState[from];
    this.boardState[to] = piece;
    this.boardState[from] = null;
    this.renderBoardDOM();
  }

  executeComputerMove(step) {
    if (!this.gameActive) return;

    this.executeMove(step.from, step.to);
    window.GameAudio.playMove();
    this.currentStepIndex++;
    this.updateRecipeStepDisplay();

    // Check if completed after computer move
    const currentRecipe = this.recipes[this.currentRecipeIndex];
    if (this.currentStepIndex >= currentRecipe.steps.length) {
      this.completeRecipe();
    }
  }

  // --- RECIPE MANAGEMENT ---
  loadRecipe() {
    this.currentStepIndex = 0;
    const recipe = this.recipes[this.currentRecipeIndex];

    // Load customer card
    const customerCard = document.getElementById('customer-card');
    customerCard.innerHTML = `
      <div class="customer-avatar">
        <img src="${recipe.avatar}" alt="${recipe.customer}">
      </div>
      <div class="customer-order">
        <h4>${recipe.customer}</h4>
        <span class="order-recipe">Pedido: ${recipe.name}</span>
      </div>
    `;

    // Load instructions list
    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-excerpt').textContent = recipe.excerpt;

    this.updateRecipeStepDisplay();
  }

  updateRecipeStepDisplay() {
    const listDOM = document.getElementById('moves-recipe-list');
    listDOM.innerHTML = '';

    const recipe = this.recipes[this.currentRecipeIndex];

    recipe.steps.forEach((step, idx) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'move-step';

      if (idx < this.currentStepIndex) {
        stepEl.classList.add('move-done');
      } else if (idx === this.currentStepIndex) {
        stepEl.classList.add('move-active');
      }

      stepEl.innerHTML = `
        <span>${idx + 1}. ${step.desc}</span>
        <strong style="color: var(--gold-light);">${step.from} ➔ ${step.to}</strong>
      `;

      listDOM.appendChild(stepEl);
    });
  }

  completeRecipe() {
    this.score++;
    this.timeLeft += 6; // Add bonus time!
    document.getElementById('score-val').textContent = this.score;

    window.GameAudio.playSuccess();

    // Create fireworks/success overlay briefly
    const boardDOM = document.getElementById('chess-board-DOM');
    boardDOM.style.boxShadow = '0 0 30px rgba(42, 157, 143, 0.8)';
    setTimeout(() => {
      boardDOM.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    }, 600);

    // Switch recipe
    this.currentRecipeIndex = (this.currentRecipeIndex + 1) % this.recipes.length;
    this.initBoard();
    this.loadRecipe();
  }

  // --- TIME DISPLAY & ALERTS ---
  updateTimerDisplay() {
    const valEl = document.getElementById('timer-val');
    const boxEl = document.getElementById('timer-box');
    if (valEl) {
      valEl.textContent = `${this.timeLeft}s`;
      
      // Urgent alerts under 10 seconds
      if (this.timeLeft <= 10) {
        boxEl.classList.add('timer-danger');
      } else {
        boxEl.classList.remove('timer-danger');
      }
    }
  }

  // --- GAME OVER SCREEN ---
  gameOver() {
    this.gameActive = false;
    clearInterval(this.timerInterval);

    window.GameAudio.playVictory(); // Play end fanfare

    let packMessage = '';
    if (this.score >= 2) {
      try {
        let packs = parseInt(localStorage.getItem('martina_album_packs') || '0');
        localStorage.setItem('martina_album_packs', (packs + 1).toString());
        packMessage = `
          <div style="background: rgba(42, 111, 151, 0.1); border: 2px dashed var(--magic-blue); padding: 1rem; border-radius: 12px; margin-top: 1rem; color: var(--magic-dark); font-weight: 700; font-size: 0.95rem;">
            🎒 ¡Has ganado 1 SOBRE DE CROMOS para tu álbum! Ve a la sección <strong>Álbum</strong> para abrirlo.
          </div>
        `;
      } catch (e) {
        console.error(e);
      }
    }

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/martina_estudio_empanada_1779113500853.png" alt="Torneo Finalizado">
        </div>
        <h2>¡Servicio Terminado! ⏱️</h2>
        <p>
          ¡Excelente cocina! Has preparado deliciosas aperturas de ajedrez para el reino. Torreta c3 está orgullosa de tu técnica.
        </p>
        ${packMessage}
        
        <div class="game-screen-stats">
          <div class="stat-item">
            <span>Pedidos</span>
            <div class="stat-val">${this.score}</div>
          </div>
          <div class="stat-item">
            <span>Elo Cocina</span>
            <div class="stat-val">+${this.score * 12}</div>
          </div>
        </div>

        <button class="btn btn-game-screen" id="btn-restart-cooking">Cocinar de Nuevo 🔁</button>
      </div>
    `;

    document.getElementById('btn-restart-cooking').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- CLEAN UP TO PREVENT MEMORY LEAKS ---
  destroy() {
    this.gameActive = false;
    clearInterval(this.timerInterval);
  }
}

// Register inside global games object
window.MartinaGames.torreta = TorretaGame;
