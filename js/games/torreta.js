// === JUEGO: LAS EMPANADAS DE TORRETA ===
// Minijuego interactivo de preparación de aperturas de ajedrez en la casilla c3.
// Cuenta con 10 niveles de dificultad progresiva, selector de niveles, estrellas y guardado persistente.

class TorretaGame {
  constructor(container) {
    this.container = container;
    this.gameActive = false;
    this.timerInterval = null;
    this.currentRecipeIndex = 0;
    this.currentStepIndex = 0;
    this.selectedSquare = null;
    this.boardState = {};
    this.selectedDifficulty = localStorage.getItem('martina_torreta_difficulty') || 'medium';

    this.recipes = [
      {
        name: "Defensa Siciliana",
        excerpt: "¡Picante y asimétrica, para paladares atrevidos!",
        customer: "Reina Negra",
        avatar: "assets/img/reina_negra_1778904582825.png",
        targetTime: 40,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "c7", to: "c5", piece: "♟", desc: "La Reina Negra responde c5 (Siciliana)" }
        ]
      },
      {
        name: "Defensa Francesa",
        excerpt: "Compacta y sólida como una empanada de hojaldre.",
        customer: "Tomás el Erizo",
        avatar: "assets/img/tomas_erizo_1778905884457.png",
        targetTime: 45,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "e7", to: "e6", piece: "♟", desc: "La máquina responde e6 (Francesa)" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Toma el control del centro con d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "La máquina golpea el centro con d5" }
        ]
      },
      {
        name: "Gambito de Dama",
        excerpt: "Sin dama (solo masa), ¡un sacrificio delicioso!",
        customer: "Alfil Exiliado",
        avatar: "assets/img/alfil_exiliado_1778944848314.png",
        targetTime: 55,
        steps: [
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Mueve tu Peón de Dama a d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "La máquina responde d5" },
          { type: "user", from: "c2", to: "c4", piece: "♙", desc: "Ofrece el Peón de c4 para desviar su centro" },
          { type: "comp", from: "e7", to: "e6", piece: "♟", desc: "La máquina rechaza el gambito con e6" },
          { type: "user", from: "b1", to: "c3", piece: "♘", desc: "Desarrolla tu Caballo de Dama a c3" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "El rival saca su Caballo a f6" }
        ]
      },
      {
        name: "Apertura Italiana",
        excerpt: "Con tomate y albahaca, ¡el clásico del reino!",
        customer: "Peoncito",
        avatar: "assets/img/peoncito_1778904557723.png",
        targetTime: 60,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Mueve tu Peón de Rey a e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "La máquina responde e5" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu Caballo a f3" },
          { type: "comp", from: "b8", to: "c6", piece: "♞", desc: "La máquina defiende con Cc6" },
          { type: "user", from: "f1", to: "c4", piece: "♗", desc: "Saca tu Alfil de casillas claras a c4" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "El rival desafía con Cf6" }
        ]
      },
      {
        name: "Defensa Caro-Kann",
        excerpt: "La receta ultra-sólida favorita de los jugadores de torneo.",
        customer: "Caballo de Ŋ",
        avatar: "assets/img/juego_caballo_l_1779376737849.png",
        targetTime: 60,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón a e4, iniciando la batalla" },
          { type: "comp", from: "c7", to: "c6", piece: "♟", desc: "El oponente prepara d5 jugando c6" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Ocupa el centro con d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "Las negras desafían con d5" },
          { type: "user", from: "b1", to: "c3", piece: "♘", desc: "Desarrolla tu Caballo a c3 protegiendo e4" },
          { type: "comp", from: "d5", to: "e4", piece: "♟", desc: "El rival captura en e4" }
        ]
      },
      {
        name: "Defensa Escandinava",
        excerpt: "Un golpe inmediato al centro que exige reflejos rápidos.",
        customer: "Reloj Parlante",
        avatar: "assets/img/peoncito_1778904557723.png",
        targetTime: 60,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón a e4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "¡Desafío directo a e4 con d5!" },
          { type: "user", from: "e4", to: "d5", piece: "♙", desc: "Captura el peón intruso en d5" },
          { type: "comp", from: "d8", to: "d5", piece: "♛", desc: "La Dama negra recaptura en d5" },
          { type: "user", from: "b1", to: "c3", piece: "♘", desc: "Saca tu Caballo a c3 amenazando la Dama" },
          { type: "comp", from: "d5", to: "a5", piece: "♛", desc: "La Dama negra se retira a a5" }
        ]
      },
      {
        name: "Defensa Eslava",
        excerpt: "¡Sólida y sabrosa, una muralla de empanada!",
        customer: "Alfil Exiliado",
        avatar: "assets/img/alfil_exiliado_1778944848314.png",
        targetTime: 65,
        steps: [
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Mueve tu Peón de Dama a d4" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "La máquina responde d5" },
          { type: "user", from: "c2", to: "c4", piece: "♙", desc: "Ofrece el Peón de c4" },
          { type: "comp", from: "c7", to: "c6", piece: "♟", desc: "La máquina se solidifica jugando c6" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu Caballo a f3" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "El caballo negro salta a f6" }
        ]
      },
      {
        name: "Apertura Española (Ruy López)",
        excerpt: "La empanada real de alta alcurnia. Ataque sutil a larga distancia.",
        customer: "Rey Blanco",
        avatar: "assets/img/rey_blanco_entrenamiento_1779139099201.png",
        targetTime: 75,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón de Rey a e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "Las negras responden e5" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Caballo a f3" },
          { type: "comp", from: "b8", to: "c6", piece: "♞", desc: "Caballo negro a c6" },
          { type: "user", from: "f1", to: "b5", piece: "♗", desc: "¡Lanza tu Alfil a b5 presionando el Caballo!" },
          { type: "comp", from: "a7", to: "a6", piece: "♟", desc: "El peón negro en a6 ahuyenta tu Alfil" },
          { type: "user", from: "b5", to: "a4", piece: "♗", desc: "Retira tu Alfil con elegancia a a4" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "Las negras sacan su Caballo a f6" }
        ]
      },
      {
        name: "Apertura del Alfil (Ataque Greco)",
        excerpt: "El clásico ataque táctico del sabio Gioachino Greco.",
        customer: "Torreta",
        avatar: "assets/img/juego_torreta_empanadas_1779376721444.png",
        targetTime: 80,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "Respuesta e5" },
          { type: "user", from: "f1", to: "c4", piece: "♗", desc: "Saca tu Alfil a la diagonal activa c4" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "Caballo negro f6" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Golpea el centro con d4" },
          { type: "comp", from: "e5", to: "d4", piece: "♟", desc: "Las negras capturan exd4" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Caballo f3 atacando d4" },
          { type: "comp", from: "f6", to: "e4", piece: "♞", desc: "El rival captura tu peón de e4" }
        ]
      },
      {
        name: "Ataque Yugoslavo (Siciliana Dragón)",
        excerpt: "¡Fuego extremo! Sacrificios, enroques opuestos y tormentas tácticas.",
        customer: "Mikhail Tal (La Sombra)",
        avatar: "assets/img/tal_sombra_1779113500853.png",
        targetTime: 95,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Inicia la partida con e4" },
          { type: "comp", from: "c7", to: "c5", piece: "♟", desc: "El dragón se defiende con c5" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu Caballo a f3" },
          { type: "comp", from: "d7", to: "d6", piece: "♟", desc: "Las negras abren diagonal con d6" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Golpea el centro con d4" },
          { type: "comp", from: "c5", to: "d4", piece: "♟", desc: "El peón de c5 captura en d4" },
          { type: "user", from: "f3", to: "d4", piece: "♘", desc: "Tu Caballo recaptura en d4 con orgullo" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "El caballo negro presiona e4" },
          { type: "user", from: "b1", to: "c3", piece: "♘", desc: "Caballo c3 defendiendo e4" },
          { type: "comp", from: "g7", to: "g6", piece: "♟", desc: "Las negras preparan el Fianchetto con g6" }
        ]
      },
      {
        name: "Gambito de Rey",
        excerpt: "¡Caos romántico e impulsivo en el flanco de rey!",
        customer: "Reina Negra",
        avatar: "assets/img/reina_negra_1778904582825.png",
        targetTime: 50,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón de rey a e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "La Reina Negra responde e5" },
          { type: "user", from: "f2", to: "f4", piece: "♙", desc: "¡Ofrece tu peón en f4!" },
          { type: "comp", from: "e5", to: "f4", piece: "♟", desc: "El rival acepta el Gambito" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu caballo a f3" },
          { type: "comp", from: "g7", to: "g5", piece: "♟", desc: "Las negras defienden con g5" }
        ]
      },
      {
        name: "Defensa Escocesa",
        excerpt: "Abre el juego de inmediato con fuerza y decisión.",
        customer: "Peoncito",
        avatar: "assets/img/peoncito_1778904557723.png",
        targetTime: 55,
        steps: [
          { type: "user", from: "e2", to: "e4", piece: "♙", desc: "Peón de rey a e4" },
          { type: "comp", from: "e7", to: "e5", piece: "♟", desc: "El oponente responde e5" },
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu caballo a f3" },
          { type: "comp", from: "b8", to: "c6", piece: "♞", desc: "El rival saca su caballo a c6" },
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "¡Golpea en d4!" },
          { type: "comp", from: "e5", to: "d4", piece: "♟", desc: "Las negras capturan en d4" },
          { type: "user", from: "f3", to: "d4", piece: "♘", desc: "Tu caballo recaptura en d4" }
        ]
      },
      {
        name: "Defensa Nimzoindia",
        excerpt: "Clavada sutil y control del centro a larga distancia.",
        customer: "Tomás el Erizo",
        avatar: "assets/img/tomas_erizo_1778905884457.png",
        targetTime: 65,
        steps: [
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Mueve tu peón a d4" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "Las negras sacan su caballo a f6" },
          { type: "user", from: "c2", to: "c4", piece: "♙", desc: "Avanza tu peón c4" },
          { type: "comp", from: "e7", to: "e6", piece: "♟", desc: "El oponente abre paso con e6" },
          { type: "user", from: "b1", to: "c3", piece: "♘", desc: "Desarrolla tu caballo de dama a c3" },
          { type: "comp", from: "f8", to: "b4", piece: "♝", desc: "¡El rival clava tu caballo en c3!" }
        ]
      },
      {
        name: "Gambito Benko",
        excerpt: "Un contraataque agudo sacrificando un peón de flanco.",
        customer: "Alfil Exiliado",
        avatar: "assets/img/alfil_exiliado_1778944848314.png",
        targetTime: 70,
        steps: [
          { type: "user", from: "d2", to: "d4", piece: "♙", desc: "Inicia con peón d4" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "El caballo negro salta a f6" },
          { type: "user", from: "c2", to: "c4", piece: "♙", desc: "Avanza tu peón a c4" },
          { type: "comp", from: "c7", to: "c5", piece: "♟", desc: "Las negras desafían con c5" },
          { type: "user", from: "d4", to: "d5", piece: "♙", desc: "Cierra el centro con d5" },
          { type: "comp", from: "b7", to: "b5", piece: "♟", desc: "¡El rival ofrece b5 (Gambito Benko)!" },
          { type: "user", from: "c4", to: "b5", piece: "♙", desc: "Acepta capturando en b5" },
          { type: "comp", from: "a7", to: "a6", piece: "♟", desc: "Las negras atacan en a6" }
        ]
      },
      {
        name: "Ataque Indio de Rey",
        excerpt: "Una fortaleza flexible lista para contraatacar en el flanco.",
        customer: "Rey Blanco",
        avatar: "assets/img/rey_blanco_entrenamiento_1779139099201.png",
        targetTime: 75,
        steps: [
          { type: "user", from: "g1", to: "f3", piece: "♘", desc: "Desarrolla tu caballo a f3" },
          { type: "comp", from: "d7", to: "d5", piece: "♟", desc: "El oponente ocupa el centro con d5" },
          { type: "user", from: "g2", to: "g3", piece: "♙", desc: "Prepara el flanco de rey con g3" },
          { type: "comp", from: "g8", to: "f6", piece: "♞", desc: "Las negras sacan su caballo a f6" },
          { type: "user", from: "f1", to: "g2", piece: "♗", desc: "Fianchetto de alfil en g2" },
          { type: "comp", from: "c7", to: "c6", piece: "♟", desc: "El rival solidifica con c6" },
          { type: "user", from: "d2", to: "d3", piece: "♙", desc: "Soporta tu centro con d3" },
          { type: "comp", from: "c8", to: "f5", piece: "♝", desc: "El alfil negro sale a f5" }
        ]
      }
    ];
  }

  // --- INITIAL LEVEL SELECT SCREEN ---
  showWelcomeScreen() {
    let key = 'martina_torreta_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_torreta_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_torreta_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_torreta_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);
    
    let levelCardsHTML = '';
    
    // Thematic star styles based on difficulty
    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    this.recipes.forEach((recipe, idx) => {
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
          <div class="level-card-title">${recipe.name}</div>
          <div class="level-card-desc">${recipe.excerpt}</div>
          <div class="level-card-footer">
            <span class="level-card-meta">${recipe.steps.filter(s => s.type === 'user').length} Jugadas</span>
            ${isLocked ? '' : '<button class="level-card-play-btn">Cocinar 🥐</button>'}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="level-select-container">
        <div class="level-select-header">
          <h2>🥐 Las Empanadas de Torreta 🥐</h2>
          <p>Elige una receta del menú. ¡Cocina en la casilla c3 antes de que se agote el tiempo y desbloquea niveles!</p>
          
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
        localStorage.setItem('martina_torreta_difficulty', diff);
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
          this.currentRecipeIndex = idx;
          this.startGame();
        } else {
          window.GameAudio.playError();
        }
      });
    });
  }

  // --- START GAME ---
  startGame() {
    const currentRecipe = this.recipes[this.currentRecipeIndex];
    
    // Apply difficulty modifiers for timer
    let timeMultiplier = 1.0;
    if (this.selectedDifficulty === 'easy') timeMultiplier = 1.5;
    if (this.selectedDifficulty === 'hard') timeMultiplier = 0.75;
    if (this.selectedDifficulty === 'martina') timeMultiplier = 0.50;
    
    this.timeLeft = Math.round(currentRecipe.targetTime * timeMultiplier);
    this.gameActive = true;
    this.currentStepIndex = 0;
    this.selectedSquare = null;

    this.setupGameLayout();
    this.initBoard();
    this.loadRecipe();

    // Start timer interval
    if (this.timerInterval) clearInterval(this.timerInterval);
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
          <button class="btn-close-modal" id="btn-back-to-select" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            ← Menú de Recetas
          </button>
          <div class="timer-box" id="timer-box">
            <span>⏱️ Reloj de Cocina:</span> <span id="timer-val">${this.timeLeft}s</span>
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

    document.getElementById('btn-back-to-select').addEventListener('click', () => {
      this.destroy();
      this.showWelcomeScreen();
    });
  }

  // --- CHESSBOARD LOGIC ---
  initBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    boardDOM.innerHTML = '';
    this.boardState = {};

    // Initial piece placement
    const initialSetup = {
      // Black Pieces
      'a8': '♜', 'b8': '♞', 'c8': '♝', 'd8': '♛', 'e8': '♚', 'f8': '♝', 'g8': '♞', 'h8': '♜',
      'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟',
      // White Pieces
      'a2': '♙', 'b2': '♙', 'c2': '♙', 'd2': '♙', 'e2': '♙', 'f2': '♙', 'g2': '♙', 'h2': '♙',
      'a1': '♖', 'b1': '♘', 'c1': '♗', 'd1': '♕', 'e1': '♔', 'f1': '♗', 'g1': '♘', 'h1': '♖'
    };

    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c);
        const coord = `${file}${r}`;
        this.boardState[coord] = initialSetup[coord] || null;
      }
    }

    this.renderBoardDOM();
  }

  renderBoardDOM() {
    const boardDOM = document.getElementById('chess-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    // Blindfold chess in Martina Mode
    if (this.selectedDifficulty === 'martina') {
      boardDOM.classList.add('board-blindfold');
    } else {
      boardDOM.classList.remove('board-blindfold');
    }

    const currentRecipe = this.recipes[this.currentRecipeIndex];
    const currentStep = currentRecipe ? currentRecipe.steps[this.currentStepIndex] : null;

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

        // Visual assist in Easy Mode: Highlight correct starting square and target destination
        if (this.selectedDifficulty === 'easy' && currentStep && currentStep.type === 'user') {
          if (coord === currentStep.from) {
            square.classList.add('square-easy-from');
          }
          if (coord === currentStep.to) {
            square.classList.add('square-easy-to');
          }
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

    if (currentStep.type === 'comp') return;

    const piece = this.boardState[coord];

    if (!this.selectedSquare) {
      if (piece && '♙♘♗♖♕♔'.includes(piece)) {
        this.selectedSquare = coord;
        window.GameAudio.playMove();
        this.renderBoardDOM();
      }
      return;
    }

    const fromCoord = this.selectedSquare;
    const toCoord = coord;

    if (fromCoord === toCoord) {
      this.selectedSquare = null;
      this.renderBoardDOM();
      return;
    }

    // Check correct move
    if (fromCoord === currentStep.from && toCoord === currentStep.to) {
      this.executeMove(fromCoord, toCoord);
      this.selectedSquare = null;
      this.currentStepIndex++;
      this.updateRecipeStepDisplay();

      if (this.currentStepIndex >= currentRecipe.steps.length) {
        this.completeLevel();
      } else {
        window.GameAudio.playMove();
        
        // Auto comp move
        const nextStep = currentRecipe.steps[this.currentStepIndex];
        if (nextStep && nextStep.type === 'comp') {
          setTimeout(() => this.executeComputerMove(nextStep), 600);
        }
      }
    } else {
      window.GameAudio.playError();
      this.selectedSquare = null;
      
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

    const currentRecipe = this.recipes[this.currentRecipeIndex];
    if (this.currentStepIndex >= currentRecipe.steps.length) {
      this.completeLevel();
    }
  }

  // --- RECIPE LOADING ---
  loadRecipe() {
    this.currentStepIndex = 0;
    const recipe = this.recipes[this.currentRecipeIndex];

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

    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-excerpt').textContent = recipe.excerpt;

    this.updateRecipeStepDisplay();
  }

  updateRecipeStepDisplay() {
    const listDOM = document.getElementById('moves-recipe-list');
    if (!listDOM) return;
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

  // --- COMPLETE LEVEL ---
  completeLevel() {
    this.gameActive = false;
    clearInterval(this.timerInterval);

    window.GameAudio.playVictory();

    const currentRecipe = this.recipes[this.currentRecipeIndex];
    
    // Apply difficulty modifiers for max time calculation
    let timeMultiplier = 1.0;
    if (this.selectedDifficulty === 'easy') timeMultiplier = 1.5;
    if (this.selectedDifficulty === 'hard') timeMultiplier = 0.75;
    if (this.selectedDifficulty === 'martina') timeMultiplier = 0.50;
    
    const maxTime = Math.round(currentRecipe.targetTime * timeMultiplier);

    // Star calculation
    let starsWon = 1;
    if (this.timeLeft >= maxTime * 0.55) {
      starsWon = 3;
    } else if (this.timeLeft >= maxTime * 0.25) {
      starsWon = 2;
    }

    // Save progress to LocalStorage based on active difficulty
    let key = 'martina_torreta_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_torreta_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_torreta_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_torreta_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);
    const oldStars = progress[this.currentRecipeIndex] || 0;
    
    let isNewHighStar = starsWon > oldStars;
    if (isNewHighStar) {
      progress[this.currentRecipeIndex] = starsWon;
      localStorage.setItem(key, JSON.stringify(progress));
    }

    // Pack award: Award 1 pack if they got 3 stars on this level for the first time
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

    const hasNext = this.currentRecipeIndex < this.recipes.length - 1;

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="${currentRecipe.avatar}" alt="Nivel Completado">
        </div>
        <h2>¡Apertura Cocinada! 🥐</h2>
        <p>
          ¡Fantástico! Has completado con éxito la receta de la **${currentRecipe.name}** con excelente tiempo.
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
            <span>Tiempo de Sobra</span>
            <div class="stat-val">${this.timeLeft}s</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-back-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Menú 📋
          </button>
          ${hasNext ? '<button class="btn btn-game-screen" id="btn-next-level">Siguiente Receta ➔</button>' : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    if (hasNext) {
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.currentRecipeIndex++;
        this.startGame();
      });
    }
  }

  // --- TIME ALERTS ---
  updateTimerDisplay() {
    const valEl = document.getElementById('timer-val');
    const boxEl = document.getElementById('timer-box');
    if (valEl) {
      valEl.textContent = `${this.timeLeft}s`;
      if (this.timeLeft <= 10) {
        boxEl.classList.add('timer-danger');
      } else {
        boxEl.classList.remove('timer-danger');
      }
    }
  }

  // --- GAME OVER ---
  gameOver() {
    this.gameActive = false;
    clearInterval(this.timerInterval);

    window.GameAudio.playError();

    this.container.innerHTML = `
      <div class="game-screen">
        <div class="game-screen-img">
          <img src="assets/img/martina_estudio_empanada_1779113500853.png" alt="Empanadas Quemadas">
        </div>
        <h2>¡Empanadas Quemadas! 🔥</h2>
        <p>
          ¡El reloj llegó a cero! En el ajedrez real y en la cocina de Torreta, el manejo del tiempo es fundamental. ¡Inténtalo de nuevo!
        </p>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-back-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Menú 📋
          </button>
          <button class="btn btn-game-screen" id="btn-retry-recipe">Reintentar Receta 🔁</button>
        </div>
      </div>
    `;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    document.getElementById('btn-retry-recipe').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- DESTROY TIMER ---
  destroy() {
    this.gameActive = false;
    clearInterval(this.timerInterval);
  }
}

window.MartinaGames.torreta = TorretaGame;
