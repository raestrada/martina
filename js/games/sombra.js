// === JUEGO: MARTINA CONTRA SU SOMBRA (EL LABERINTO DEL ESPEJO) ===
// Minijuego interactivo de coordinación en espejo simétrico y táctica de clavada (Shadow Beams).
// Permite mover a Martina (avatar) mientras su Sombra replica los movimientos en dirección invertida.
// Cuenta con 15 niveles de progresiva complejidad, colocación de Peoncitos de escudo, clavadas absolutas y 4 dificultades.

class SombraGame {
  constructor(container) {
    this.container = container;
    this.currentLevelIndex = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.gameActive = false;
    this.selectedDifficulty = localStorage.getItem('martina_sombra_difficulty') || 'medium';

    this.martinaPos = { r: 7, c: 0 }; // a1
    this.sombraPos = { r: 0, c: 7 }; // h8
    this.peoncitosRescued = 0; // Inventory of Peoncitos to place as shields
    this.rescuedCoords = []; // Rescued coordinates in this level
    this.placedPeoncitos = []; // Coordinates on the board where shields are placed
    this.placementMode = false;
    this.isMartinaPinned = false;
    this.pinLine = null; // Vector direction of current pin {dr, dc}

    // 15 Progressive levels with mirror symmetry and chess-based pins
    this.levels = [
      {
        name: "El Primer Reflejo",
        description: "Aprende a moverte en espejo. Rescata al Peoncito y dirígete al Portal del Espejo en h1.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["d5"],
        obstacles: [],
        lava: [],
        ice: [],
        exit: "h1",
        beamType: "none"
      },
      {
        name: "Espejo del Centro",
        description: "Rocas bloquean el Río Central. Choca a Martina contra los bordes para 'desfasar' tu posición respecto a la Sombra.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["d4"],
        obstacles: ["c3", "f6", "c6", "f3"],
        lava: [],
        ice: [],
        exit: "h1",
        beamType: "none"
      },
      {
        name: "El Cruce de Diagonales",
        description: "Lava caliente cubre las bandas laterales. Coordina tu paso por las diagonales centrales en zigzag.",
        startPos: "b2",
        sombraStartPos: "g7",
        peoncitos: ["d4", "e5"],
        obstacles: [],
        lava: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"],
        ice: [],
        exit: "g2",
        beamType: "none"
      },
      {
        name: "El Muro de Piedra",
        description: "Cuatro pilares de piedra en el centro d4-e5. Úsalos a tu favor para desfasar a tu Sombra y rescatar a los Peoncitos.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["c4", "f5"],
        obstacles: ["d4", "e4", "d5", "e5"],
        lava: [],
        ice: [],
        exit: "h2",
        beamType: "none"
      },
      {
        name: "La Primera Clavada",
        description: "¡Atención! La Sombra proyecta rayos de clavada de Torre (columnas y filas). Si te cruzas en su rayo, ¡quedarás clavada!",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["d4"],
        obstacles: ["c3", "f6"],
        lava: [],
        ice: [],
        exit: "h1",
        beamType: "rook"
      },
      {
        name: "Laberinto de Ceniza",
        description: "La Sombra lanza rayos de Alfil (diagonales). Busca cobertura tras las rocas para avanzar sin quedar en clavada.",
        startPos: "b2",
        sombraStartPos: "g7",
        peoncitos: ["d3", "e6"],
        obstacles: ["c2", "f7", "c7", "f2", "d4"],
        lava: ["b4", "g5"],
        ice: [],
        exit: "h2",
        beamType: "bishop"
      },
      {
        name: "El Rescate del Alfil",
        description: "Los Peoncitos están atrapados en esquinas rodeadas de lava. Si te clavan en la diagonal de lava, no podrás escapar.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["b2", "g7"],
        obstacles: ["c3", "f6"],
        lava: ["a2", "b1", "h7", "g8"],
        ice: [],
        exit: "e5",
        beamType: "bishop"
      },
      {
        name: "Clavada de Dama",
        description: "Peligro total: rayos de Dama (diagonales + columnas/filas). Si rescatas un Peoncito, ¡colócalo en la línea del rayo para bloquearlo!",
        startPos: "b2",
        sombraStartPos: "g7",
        peoncitos: ["d5"],
        obstacles: ["c4", "f5", "d4"],
        lava: [],
        ice: [],
        exit: "h2",
        beamType: "queen"
      },
      {
        name: "El Gran Deslave Glacial",
        description: "Casillas heladas cubren el centro. El hielo te permite deslizarte rápidamente en simetría.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["d4"],
        obstacles: [],
        lava: [],
        ice: ["c3", "d3", "e3", "f3", "c6", "d6", "e6", "f6"],
        exit: "g2",
        beamType: "rook"
      },
      {
        name: "La Barrera de la Duda",
        description: "Una fila de lava bloquea el paso, con puentes libres solo en d5 y e5. Desfasa a la Sombra contra rocas para cruzar.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["d6", "e3"],
        obstacles: ["b4", "g5", "c4", "f5"],
        lava: ["a5", "b5", "c5", "f5", "g5", "h5"],
        ice: [],
        exit: "h8",
        beamType: "none"
      },
      {
        name: "El Bosque de las Sombras",
        description: "Laberinto repleto de rocas pesadas y rayos púrpuras. Coloca tus escudos de Peoncito con inteligencia.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["b3", "g6"],
        obstacles: ["c3", "f6", "d4", "e5"],
        lava: [],
        ice: [],
        exit: "h2",
        beamType: "queen"
      },
      {
        name: "Trampas Gemelas",
        description: "Peoncitos atrapados al lado de trampas de lava. Bloquea a la Sombra contra rocas sólidas para salvarlos.",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["c3", "f6"],
        obstacles: ["b2", "g7"],
        lava: ["c2", "f7", "d3", "e6"],
        ice: [],
        exit: "h1",
        beamType: "bishop"
      },
      {
        name: "Clavada Absoluta",
        description: "La Sombra vigila el Portal de Salida con un rayo absoluto de Dama. ¡Debes interponer un Peoncito para romper la clavada!",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["b4"],
        obstacles: ["d4"],
        lava: [],
        ice: [],
        exit: "g5",
        beamType: "queen"
      },
      {
        name: "El Trono Invertido",
        description: "Escapa del laberinto del centro d4-e5 mientras la Sombra patrulla el perímetro con rayos activos de Dama.",
        startPos: "e1",
        sombraStartPos: "d8",
        peoncitos: ["c4", "f5"],
        obstacles: ["d4", "e5"],
        lava: ["d3", "e6"],
        ice: [],
        exit: "b8",
        beamType: "queen"
      },
      {
        name: "El Espejo de las 64 Casillas",
        description: "¡El súper puzzle final! Desfases, lava en el Río Central, 3 Peoncitos y rayos cruzados de Dama de la Sombra. ¡Demuestra tu maestría!",
        startPos: "a1",
        sombraStartPos: "h8",
        peoncitos: ["c3", "d5", "f6"],
        obstacles: ["b2", "g7"],
        lava: ["d4", "e5", "e4", "d5"],
        ice: [],
        exit: "h1",
        beamType: "queen"
      }
    ];
  }

  initAudio() {
    if (window.GameAudio && typeof window.GameAudio.init === 'function') {
      window.GameAudio.init();
    }
  }

  // --- AUDIO SYNTHS FOR SOMBRA ---
  playShieldPlace() {
    this.initAudio();
    const audioCtx = window.GameAudio.ctx || window.activeAudioContext;
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("Failed to play shield place sound", e);
    }
  }

  playClavada() {
    this.initAudio();
    const audioCtx = window.GameAudio.ctx || window.activeAudioContext;
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Metallic clashing / chain sounds
      [220, 225, 440, 445].forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(15, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch (e) {
      console.warn("Failed to play clavada sound", e);
    }
  }

  playCapture() {
    this.initAudio();
    const audioCtx = window.GameAudio.ctx || window.activeAudioContext;
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Lovely pentatonic arpeggio for rescues
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.05);
        
        gain.gain.setValueAtTime(0, now + index * 0.05);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.05 + 0.22);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + index * 0.05);
        osc.stop(now + index * 0.05 + 0.22);
      });
    } catch (e) {
      console.warn("Failed to play capture sound", e);
    }
  }

  // --- WELCOME & LEVEL SELECT SCREEN ---
  showWelcomeScreen() {
    let key = 'martina_sombra_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_sombra_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_sombra_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_sombra_progress_martina';

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
            <span class="level-card-meta">${level.peoncitos.length} ♙ Rescates</span>
            ${isLocked ? '' : '<button class="level-card-play-btn" style="background:#9d4edd;">Desafiar 👥</button>'}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="level-select-container">
        <div class="level-select-header">
          <h2>👥 Martina contra su Sombra 👥</h2>
          <p>La Sombra oscura replica tus pasos en espejo inverso. Rescata a los Peoncitos perdidos en el laberinto, esquiva la lava hirviente, colócalos como escudos tácticos para bloquear los rayos de clavada de la Sombra y alcanza el Portal del Espejo.</p>
          
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

    // Bind difficulty tabs
    const diffButtons = this.container.querySelectorAll('.diff-tab');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const diff = btn.getAttribute('data-diff');
        this.selectedDifficulty = diff;
        localStorage.setItem('martina_sombra_difficulty', diff);
        if (window.GameAudio && typeof window.GameAudio.playMove === 'function') {
          window.GameAudio.playMove();
        }
        this.showWelcomeScreen();
      });
    });

    // Bind level cards
    const cards = this.container.querySelectorAll('.level-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-level'));
        const isLocked = idx > 0 && (progress[idx - 1] === 0);
        if (!isLocked) {
          this.currentLevelIndex = idx;
          this.startGame();
        } else {
          if (window.GameAudio && typeof window.GameAudio.playError === 'function') {
            window.GameAudio.playError();
          }
        }
      });
    });
  }

  // --- START GAME ---
  startGame() {
    const level = this.levels[this.currentLevelIndex];
    this.martinaPos = this.nameToCoords(level.startPos);
    this.sombraPos = this.nameToCoords(level.sombraStartPos);
    this.peoncitosRescued = 0;
    this.rescuedCoords = [];
    this.placedPeoncitos = [];
    this.placementMode = false;
    this.isMartinaPinned = false;
    this.pinLine = null;
    this.gameActive = true;

    // Set difficulty lives
    if (this.selectedDifficulty === 'easy') {
      this.maxLives = 5;
    } else if (this.selectedDifficulty === 'hard') {
      this.maxLives = 2;
    } else if (this.selectedDifficulty === 'martina') {
      this.maxLives = 1; // Flawless play required!
    } else {
      this.maxLives = 3;
    }
    this.lives = this.maxLives;

    this.setupGameLayout();
    this.updateBeamsState();
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
          <div class="timer-box" style="background: rgba(157, 78, 221, 0.2); border-color: #9d4edd;">
            <span>👥 Rayo de Sombra:</span> <span id="sombra-beam-state" style="color: #e0aaff; font-weight: 800;">Activo</span>
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
            
            <div class="recipe-card" style="border-top-color: #9d4edd;">
              <h3 style="color: #e0aaff; font-family: 'Nunito', sans-serif;">Etapa ${this.currentLevelIndex + 1}: ${level.name}</h3>
              <p style="font-size: 0.9rem; line-height: 1.4; opacity: 0.95; margin-bottom: 0;">${level.description}</p>
            </div>
 
            <!-- Panel de instrucciones tácticas -->
            <div class="recipe-card" style="border-top-color: var(--gold); margin-top: 1rem; background: rgba(244, 162, 97, 0.05); border-left: 4px solid var(--gold);">
              <h4 style="color: var(--gold-light); font-family: 'Nunito', sans-serif; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                ⚔️ Reglas del Espejo
              </h4>
              <ul style="font-size: 0.8rem; padding-left: 1.2rem; line-height: 1.45; opacity: 0.95; display: flex; flex-direction: column; gap: 0.4rem; list-style-type: '👑 ';">
                <li>Desplázate 1 casilla en cualquier dirección (como un Rey).</li>
                <li>La Sombra moverá su cuerpo de forma invertida.</li>
                <li>Si te bloqueas contra una pared o roca, ¡la Sombra seguirá moviéndose, desfasando sus posiciones!</li>
                <li>Evita pisar lava 🔥 (resta vida).</li>
                <li>Si te cruza un rayo de clavada (⛓️), ¡no podrás salvar Peoncitos ni cruzar el Portal hasta liberarte del rayo!</li>
                <li>Rescata Peoncitos 🥸 y colócalos con <strong>🛡️ Escudo</strong> para cortar el rayo.</li>
              </ul>
            </div>

            <!-- Botón Colocar Escudo de Peoncito -->
            <button class="btn btn-block" id="btn-place-shield" style="background: rgba(244, 162, 97, 0.2); border: 2px dashed var(--gold); color: var(--gold); font-weight: 800; padding: 0.8rem; border-radius: 12px; transition: all 0.3s;" disabled>
              🛡️ Colocar Escudo (0 disp.)
            </button>
 
            <div class="moves-left-card">
              <div class="stat-label">❤️ Vidas Restantes</div>
              <div class="moves-count" id="lives-display-val" style="color: #e63946; letter-spacing: 0.15rem;"></div>
            </div>
 
            <div class="moves-left-card" style="border-bottom-color: var(--sage);">
              <div class="stat-label">🥸 Peoncitos Salvados</div>
              <div class="moves-count" id="peoncitos-display-val" style="color: var(--sage);">0 / 0</div>
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

    // Bind Shield placement button
    const shieldBtn = document.getElementById('btn-place-shield');
    shieldBtn.addEventListener('click', () => {
      if (this.peoncitosRescued > 0 && this.gameActive) {
        this.placementMode = !this.placementMode;
        if (this.placementMode) {
          shieldBtn.textContent = "❌ Cancelar Colocación";
          shieldBtn.style.background = "rgba(230, 57, 70, 0.2)";
          shieldBtn.style.borderColor = "#e63946";
          shieldBtn.style.color = "#ff9e80";
        } else {
          this.updateShieldButtonState();
        }
        this.renderBoard();
      }
    });

    this.updateStatsDisplay();
  }

  // --- UPDATE SHIELD BUTTON LABEL & STATE ---
  updateShieldButtonState() {
    const shieldBtn = document.getElementById('btn-place-shield');
    if (!shieldBtn) return;
    if (this.peoncitosRescued > 0) {
      shieldBtn.disabled = false;
      shieldBtn.textContent = `🛡️ Colocar Escudo (${this.peoncitosRescued} disp.)`;
      shieldBtn.style.background = "rgba(244, 162, 97, 0.2)";
      shieldBtn.style.borderColor = "var(--gold)";
      shieldBtn.style.color = "var(--gold)";
      shieldBtn.style.cursor = "pointer";
    } else {
      shieldBtn.disabled = true;
      shieldBtn.textContent = "🛡️ Colocar Escudo (0 disp.)";
      shieldBtn.style.background = "rgba(255,255,255,0.03)";
      shieldBtn.style.borderColor = "rgba(255,255,255,0.08)";
      shieldBtn.style.color = "rgba(255,255,255,0.3)";
      shieldBtn.style.cursor = "not-allowed";
    }
  }

  // --- STATS HUD SYNCHRONIZER ---
  updateStatsDisplay() {
    const livesEl = document.getElementById('lives-display-val');
    const peoncitosEl = document.getElementById('peoncitos-display-val');
    const beamLabelEl = document.getElementById('sombra-beam-state');

    if (livesEl) {
      let hearts = '';
      for (let l = 0; l < this.maxLives; l++) {
        hearts += l < this.lives ? '❤️' : '🖤';
      }
      livesEl.textContent = hearts;
    }

    if (peoncitosEl) {
      const total = this.levels[this.currentLevelIndex].peoncitos.length;
      peoncitosEl.textContent = `${this.rescuedCoords.length} / ${total}`;
    }

    if (beamLabelEl) {
      const level = this.levels[this.currentLevelIndex];
      if (level.beamType === 'none' || this.selectedDifficulty === 'easy') {
        beamLabelEl.textContent = 'Inactivo';
        beamLabelEl.style.color = 'var(--sage)';
        beamLabelEl.parentNode.style.borderColor = 'var(--sage)';
        beamLabelEl.parentNode.style.background = 'rgba(42, 157, 143, 0.2)';
      } else {
        beamLabelEl.textContent = level.beamType === 'queen' ? 'Dama (Doble)' : (level.beamType === 'bishop' ? 'Alfil (Diagonales)' : 'Torre (Ortogonales)');
        beamLabelEl.style.color = '#e0aaff';
        beamLabelEl.parentNode.style.borderColor = '#9d4edd';
        beamLabelEl.parentNode.style.background = 'rgba(157, 78, 221, 0.2)';
      }
    }

    this.updateShieldButtonState();
  }

  // --- BEAMS AND PIN COMPUTING ENGINE ---
  updateBeamsState() {
    this.isMartinaPinned = false;
    this.pinLine = null;
    this.activeBeams = [];

    const level = this.levels[this.currentLevelIndex];
    // Beams are disabled in easy mode or if beamType is none
    if (level.beamType === 'none' || this.selectedDifficulty === 'easy') return;

    let directions = [];
    if (level.beamType === 'rook' || level.beamType === 'queen') {
      directions.push({ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 });
    }
    if (level.beamType === 'bishop' || level.beamType === 'queen') {
      directions.push({ dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 });
    }

    const sombraName = this.coordsToName(this.sombraPos.r, this.sombraPos.c);
    const martinaName = this.coordsToName(this.martinaPos.r, this.martinaPos.c);

    directions.forEach(dir => {
      let r = this.sombraPos.r + dir.dr;
      let c = this.sombraPos.c + dir.dc;
      let raySquares = [];
      let blocked = false;

      while (r >= 0 && r < 8 && c >= 0 && c < 8 && !blocked) {
        const coordName = this.coordsToName(r, c);
        
        // Blocked by rock/obstacle or placed shield (Peoncito)
        if (level.obstacles.includes(coordName) || this.placedPeoncitos.includes(coordName)) {
          blocked = true;
          break;
        }

        raySquares.push(coordName);
        this.activeBeams.push(coordName);

        if (coordName === martinaName) {
          this.isMartinaPinned = true;
          this.pinLine = { dr: dir.dr, dc: dir.dc };
        }

        r += dir.dr;
        c += dir.dc;
      }
    });
  }

  // --- RENDER CHESSBOARD ---
  renderBoard() {
    const boardDOM = document.getElementById('chess-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    // Apply blindfold class in Martina difficulty
    if (this.selectedDifficulty === 'martina') {
      boardDOM.classList.add('board-blindfold');
    } else {
      boardDOM.classList.remove('board-blindfold');
    }

    const level = this.levels[this.currentLevelIndex];
    const martinaCoord = this.coordsToName(this.martinaPos.r, this.martinaPos.c);
    const sombraCoord = this.coordsToName(this.sombraPos.r, this.sombraPos.c);

    // Adjacent legal steps (King movement)
    let legalMoves = this.getLegalSteps(this.martinaPos.r, this.martinaPos.c);

    // Filter by obstacle, placed shield and lava blocking
    legalMoves = legalMoves.filter(coord => {
      // Exclude obstacles, placed shields, and lava (which is lethal, especially with 1 life in Martina difficulty!)
      return !level.obstacles.includes(coord) && 
             !this.placedPeoncitos.includes(coord) &&
             !level.lava.includes(coord);
    });

    // Calculate highlight placement squares if placement mode is active
    let placeableSquares = [];
    if (this.placementMode) {
      placeableSquares = legalMoves.filter(coord => {
        return !level.obstacles.includes(coord) && 
               !level.lava.includes(coord) &&
               coord !== martinaCoord &&
               coord !== sombraCoord &&
               !this.rescuedCoords.includes(coord) &&
               !this.placedPeoncitos.includes(coord);
      });
    }

    // Easy mode helper dots: where the Sombra will land if Martina moves
    let shadowGuides = [];
    if (this.selectedDifficulty === 'easy' && this.gameActive && !this.placementMode) {
      legalMoves.forEach(coord => {
        if (!level.obstacles.includes(coord)) {
          const mTarget = this.nameToCoords(coord);
          const dr = mTarget.r - this.martinaPos.r;
          const dc = mTarget.c - this.martinaPos.c;
          const sTargetR = this.sombraPos.r - dr;
          const sTargetC = this.sombraPos.c - dc;
          
          if (sTargetR >= 0 && sTargetR < 8 && sTargetC >= 0 && sTargetC < 8) {
            const guideCoord = this.coordsToName(sTargetR, sTargetC);
            if (!level.obstacles.includes(guideCoord)) {
              shadowGuides.push(guideCoord);
            }
          }
        }
      });
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
        if (level.obstacles.includes(coord)) {
          square.classList.add('square-obstacle');
        }

        // Render lava
        if (level.lava.includes(coord)) {
          square.classList.add('square-lava');
        }

        // Render ice
        if (level.ice.includes(coord)) {
          square.classList.add('square-ice');
        }

        // Render shadow beams
        if (this.gameActive && this.activeBeams && this.activeBeams.includes(coord)) {
          square.classList.add('square-sombra-beam');
        }

        // Render shadow guide dots (easy difficulty)
        if (shadowGuides.includes(coord)) {
          square.classList.add('square-sombra-guide');
        }

        // Render Peoncitos to rescue
        if (level.peoncitos.includes(coord) && !this.rescuedCoords.includes(coord)) {
          square.classList.add('square-peoncito-rescued');
          square.classList.add('square-peoncito-rescued-bigote');
        }

        // Render placed shields (Peoncitos acting as blocks)
        if (this.placedPeoncitos.includes(coord)) {
          square.classList.add('square-peoncito-placed');
          square.textContent = '♙';
        }

        // Render Exit Mirror Portal
        if (this.rescuedCoords.length === level.peoncitos.length && level.exit === coord) {
          square.classList.add('square-mirror-portal');
        }

        // Render Martina
        if (coord === martinaCoord) {
          const martinaEl = document.createElement('div');
          martinaEl.className = 'square-martina';
          martinaEl.textContent = '♕';
          
          if (this.isMartinaPinned) {
            square.classList.add('square-martina-pinned');
          }
          square.appendChild(martinaEl);
        }

        // Render Sombra
        if (coord === sombraCoord) {
          const sombraEl = document.createElement('div');
          sombraEl.className = 'square-sombra';
          sombraEl.textContent = '♛';
          square.appendChild(sombraEl);
        }

        // Bind clicks for movement or shield placement
        if (this.gameActive) {
          if (this.placementMode && placeableSquares.includes(coord)) {
            square.classList.add('square-highlight');
            square.style.cursor = 'pointer';
            square.addEventListener('click', () => this.placeShieldAt(coord));
          } else if (!this.placementMode && legalMoves.includes(coord) && !level.obstacles.includes(coord)) {
            square.classList.add('square-path');
            square.style.cursor = 'pointer';
            square.addEventListener('click', () => this.moveMartinaTo(coord));
          }
        }

        boardDOM.appendChild(square);
      }
    }
  }

  // --- ADJACENT LEGAL TILES (8-WAY KING MOVES) ---
  getLegalSteps(r, c) {
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

  // --- PLACING PEONCITO SHIELD ---
  placeShieldAt(coord) {
    if (!this.gameActive || this.peoncitosRescued <= 0) return;

    this.placedPeoncitos.push(coord);
    this.peoncitosRescued--;
    this.placementMode = false;

    this.playShieldPlace();
    
    // Recalculate shadow beams and update view
    this.updateBeamsState();
    this.updateStatsDisplay();
    this.renderBoard();
  }

  // --- CHARACTER MOVEMENT SIMULATION ENGINE ---
  moveMartinaTo(coord) {
    if (!this.gameActive) return;

    const targetPos = this.nameToCoords(coord);
    const dr = targetPos.r - this.martinaPos.r;
    const dc = targetPos.c - this.martinaPos.c;

    const level = this.levels[this.currentLevelIndex];

    // 1. Compute Martina's movement and blocks
    let mTargetR = targetPos.r;
    let mTargetC = targetPos.c;
    let mBlocked = false;

    // Check rocks or placed shields
    if (level.obstacles.includes(coord) || this.placedPeoncitos.includes(coord)) {
      mTargetR = this.martinaPos.r;
      mTargetC = this.martinaPos.c;
      mBlocked = true;
    }

    // 2. Compute Sombra's symmetrical mirrored movement in reverse!
    let sTargetR = this.sombraPos.r - dr;
    let sTargetC = this.sombraPos.c - dc;
    let sBlocked = false;

    if (sTargetR < 0 || sTargetR >= 8 || sTargetC < 0 || sTargetC >= 8) {
      sTargetR = this.sombraPos.r;
      sTargetC = this.sombraPos.c;
      sBlocked = true;
    } else {
      const sombraTargetName = this.coordsToName(sTargetR, sTargetC);
      // Sombra is blocked by rocks or placed shields too
      if (level.obstacles.includes(sombraTargetName) || this.placedPeoncitos.includes(sombraTargetName)) {
        sTargetR = this.sombraPos.r;
        sTargetC = this.sombraPos.c;
        sBlocked = true;
      }
    }

    // Both blocked: do nothing but play a bump sound
    if (mBlocked && sBlocked) {
      if (window.GameAudio && typeof window.GameAudio.playError === 'function') {
        window.GameAudio.playError();
      }
      return;
    }

    // Execute positions!
    this.martinaPos = { r: mTargetR, c: mTargetC };
    this.sombraPos = { r: sTargetR, c: sTargetC };

    if (window.GameAudio && typeof window.GameAudio.playMove === 'function') {
      window.GameAudio.playMove();
    }

    const newMartinaCoord = this.coordsToName(this.martinaPos.r, this.martinaPos.c);
    const newSombraCoord = this.coordsToName(this.sombraPos.r, this.sombraPos.c);

    // Update beams and pin state immediately before checking rescues and victories
    const wasPinned = this.isMartinaPinned;
    this.updateBeamsState();
    if (this.isMartinaPinned && !wasPinned) {
      this.playClavada();
    }

    // 3. CHECK PEONCITO RESCUE: Martina steps on Peoncito
    if (level.peoncitos.includes(newMartinaCoord) && !this.rescuedCoords.includes(newMartinaCoord)) {
      if (this.isMartinaPinned) {
        // If pinned, block rescue!
        this.playClavada();
        const boardDOM = document.getElementById('chess-board-DOM');
        if (boardDOM) {
          const sq = boardDOM.querySelector(`[data-coord="${newMartinaCoord}"]`);
          if (sq) {
            sq.classList.add('shake');
            setTimeout(() => sq.classList.remove('shake'), 400);
          }
        }
      } else {
        this.rescuedCoords.push(newMartinaCoord);
        this.peoncitosRescued++;
        this.playCapture();
        this.updateStatsDisplay();
      }
    }

    // 4. CHECK LAVA DAMAGES: If either Martina or Sombra step on lava!
    if (level.lava.includes(newMartinaCoord) || level.lava.includes(newSombraCoord)) {
      this.lives--;
      if (window.GameAudio && typeof window.GameAudio.playError === 'function') {
        window.GameAudio.playError();
      }

      if (this.lives <= 0) {
        this.gameOver();
        return;
      } else {
        // Reset positions to level starts
        this.martinaPos = this.nameToCoords(level.startPos);
        this.sombraPos = this.nameToCoords(level.sombraStartPos);
        this.peoncitosRescued = this.rescuedCoords.length - this.placedPeoncitos.length; // Restore inventory balance
        
        this.isMartinaPinned = false;
        this.pinLine = null;
        this.updateBeamsState();
        this.updateStatsDisplay();
        this.renderBoard();
        return;
      }
    }

    // 5. CHECK EXIT PORTAL VICTORY
    if (this.rescuedCoords.length === level.peoncitos.length && newMartinaCoord === level.exit) {
      if (this.isMartinaPinned) {
        // If pinned, block victory!
        this.playClavada();
        const boardDOM = document.getElementById('chess-board-DOM');
        if (boardDOM) {
          const sq = boardDOM.querySelector(`[data-coord="${newMartinaCoord}"]`);
          if (sq) {
            sq.classList.add('shake');
            setTimeout(() => sq.classList.remove('shake'), 400);
          }
        }
      } else {
        this.victory();
        return;
      }
    }

    this.updateStatsDisplay();
    this.renderBoard();
  }

  // --- VICTORY RESOLUTION ---
  victory() {
    this.gameActive = false;
    if (window.GameAudio && typeof window.GameAudio.playVictory === 'function') {
      window.GameAudio.playVictory();
    }

    // Stars won based on remaining lives
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
        <div style="font-size: 4rem; margin-bottom: 1rem;">🏆🪞</div>
        <h2>¡Desafío Superado!</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--sage);">
          ¡Impecable coordinación! Martina cruza el Portal del Espejo victoriosa tras salvar a todos los Peoncitos.
        </p>
        <div class="victory-stars" style="font-size: 2.5rem; margin-bottom: 1.5rem;">
          ${starsHTML}
        </div>
        ${packRewardHTML}
        <div style="display: flex; gap: 1rem; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-victory-back" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">Menú</button>
          <button class="btn btn-game-screen" id="btn-victory-next" style="background: #9d4edd;">Siguiente Nivel →</button>
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
      nextBtn.style.color = 'var(--magic-dark)';
      nextBtn.addEventListener('click', () => this.showWelcomeScreen());
    }

    // Refresh global dashboard
    if (typeof window.loadDashboardStats === 'function') {
      window.loadDashboardStats();
    }
  }

  // --- GAME OVER RESOLUTION ---
  gameOver() {
    this.gameActive = false;
    if (window.GameAudio && typeof window.GameAudio.playError === 'function') {
      window.GameAudio.playError();
    }

    this.container.innerHTML = `
      <div class="game-screen">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔥🫂</div>
        <h2>¡Oh no! Sin energía</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: #ff6b6b;">
          ¡La lava hirviente o las trampas de la Sombra te han quitado todas tus vidas!
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-gameover-back" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">Menú</button>
          <button class="btn btn-game-screen" id="btn-gameover-retry" style="background: #9d4edd;">Reintentar 🔁</button>
        </div>
      </div>
    `;

    document.getElementById('btn-gameover-back').addEventListener('click', () => this.showWelcomeScreen());
    document.getElementById('btn-gameover-retry').addEventListener('click', () => this.startGame());
  }

  // --- PERSIST PROGRESS ---
  saveProgress(starsWon) {
    let key = 'martina_sombra_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_sombra_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_sombra_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_sombra_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);

    const oldStars = progress[this.currentLevelIndex] || 0;
    if (starsWon > oldStars) {
      progress[this.currentLevelIndex] = starsWon;
      localStorage.setItem(key, JSON.stringify(progress));
    }
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

// Register inside namespace
window.MartinaGames.sombra = SombraGame;
