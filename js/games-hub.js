// === MARTINA GAMES HUB CONTROLLER ===
// Manages modals, dynamic script loading, and premium Web Audio API effects.

// Initialize namespace for games
window.MartinaGames = {};
window.activeGameInstance = null;

// Premium Sound Engine using Web Audio API (100% Client-side, no assets required!)
const GameAudio = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playMove() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime); // Pitch
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Play a lovely major arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  },

  playError() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    
    // Simple bandpass filter for a muffled buzzer sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 150;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  },

  playVictory() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Play a grand trumpet fanfare!
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    const durations = [0.15, 0.15, 0.15, 0.15, 0.5];
    let timeOffset = 0;
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + timeOffset);
      
      gain.gain.setValueAtTime(0, now + timeOffset);
      gain.gain.linearRampToValueAtTime(0.2, now + timeOffset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + durations[index]);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + durations[index]);
      
      timeOffset += 0.12;
    });
  }
};

// Export to window so games can use them
window.GameAudio = GameAudio;

// Modal elements
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('game-modal');
  const sandbox = document.getElementById('game-sandbox');
  const closeBtn = document.getElementById('btn-close-modal');
  const gameTitle = document.getElementById('active-game-title');
  const gameCards = document.querySelectorAll('.game-card');

  // Open Game Modal
  function openGame(gameType) {
    let title = '';
    if (gameType === 'torreta') title = 'Las Empanadas de Torreta';
    if (gameType === 'caballo') title = 'El Laberinto del Caballo de Ŋ';
    if (gameType === 'reina') title = '¡Cuidado con el Estornudo!';
    if (gameType === 'sombra') title = 'Martina contra su Sombra';
    if (gameType === 'mario') title = 'Super Martina: El Salto Mágico';
    
    gameTitle.textContent = title;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Show Loading Spinner / Welcome Screen inside sandbox
    sandbox.innerHTML = `
      <div class="game-screen" style="animation: none;">
        <div style="font-size: 3rem; margin-bottom: 1rem; animation: spin 1s infinite linear;">🪄</div>
        <h2>Cargando tablero...</h2>
        <p>Invocando piezas mágicas del reino.</p>
      </div>
    `;

    // Load Game Script dynamically
    const scriptId = `script-game-${gameType}`;
    let script = document.getElementById(scriptId);

    function instantiateGame() {
      const GameClass = window.MartinaGames[gameType];
      if (GameClass) {
        sandbox.innerHTML = '';
        window.activeGameInstance = new GameClass(sandbox);
        window.activeGameInstance.showWelcomeScreen();
      } else {
        sandbox.innerHTML = `
          <div class="game-screen">
            <h2>¡Oops!</h2>
            <p>No se pudo cargar la lógica del juego. Inténtalo de nuevo.</p>
            <button class="btn btn-game-screen" onclick="location.reload()">Recargar</button>
          </div>
        `;
      }
    }

    if (script) {
      instantiateGame();
    } else {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `js/games/${gameType}.js`;
      script.onload = instantiateGame;
      script.onerror = () => {
        sandbox.innerHTML = `
          <div class="game-screen">
            <h2>Error de Conexión</h2>
            <p>No se pudo descargar el archivo de juego. Verifica tu conexión.</p>
          </div>
        `;
      };
      document.body.appendChild(script);
    }
  }

  // --- LOGROS & DASHBOARD SYNCHRONIZER ---
  function loadDashboardStats() {
    const loadProg = (key) => {
      let prog = JSON.parse(localStorage.getItem(key)) || [];
      if (prog.length < 15) {
        while (prog.length < 15) prog.push(0);
        localStorage.setItem(key, JSON.stringify(prog));
      }
      return prog;
    };

    let torretaProgEasy = loadProg('martina_torreta_progress_easy');
    let torretaProgMedium = loadProg('martina_torreta_progress');
    let torretaProgHard = loadProg('martina_torreta_progress_hard');
    let torretaProgMartina = loadProg('martina_torreta_progress_martina');

    let caballoProgEasy = loadProg('martina_caballo_progress_easy');
    let caballoProgMedium = loadProg('martina_caballo_progress');
    let caballoProgHard = loadProg('martina_caballo_progress_hard');
    let caballoProgMartina = loadProg('martina_caballo_progress_martina');

    let reinaProgEasy = loadProg('martina_reina_progress_easy');
    let reinaProgMedium = loadProg('martina_reina_progress');
    let reinaProgHard = loadProg('martina_reina_progress_hard');
    let reinaProgMartina = loadProg('martina_reina_progress_martina');

    let sombraProgEasy = loadProg('martina_sombra_progress_easy');
    let sombraProgMedium = loadProg('martina_sombra_progress');
    let sombraProgHard = loadProg('martina_sombra_progress_hard');
    let sombraProgMartina = loadProg('martina_sombra_progress_martina');

    const sumProg = (prog) => prog.reduce((sum, s) => sum + s, 0);

    const torretaStars = sumProg(torretaProgEasy) + sumProg(torretaProgMedium) + sumProg(torretaProgHard) + sumProg(torretaProgMartina);
    const caballoStars = sumProg(caballoProgEasy) + sumProg(caballoProgMedium) + sumProg(caballoProgHard) + sumProg(caballoProgMartina);
    const reinaStars = sumProg(reinaProgEasy) + sumProg(reinaProgMedium) + sumProg(reinaProgHard) + sumProg(reinaProgMartina);
    const sombraStars = sumProg(sombraProgEasy) + sumProg(sombraProgMedium) + sumProg(sombraProgHard) + sumProg(sombraProgMartina);
    const totalStars = torretaStars + caballoStars + reinaStars + sombraStars;

    const unlockedStickers = JSON.parse(localStorage.getItem('martina_album_unlocked')) || [];
    const stickersCount = unlockedStickers.length;

    const packsCount = parseInt(localStorage.getItem('martina_album_packs')) || 0;

    // Magic Score: 100 per star + 50 per sticker
    const magicScore = (totalStars * 100) + (stickersCount * 50);

    // Update DOM if elements exist
    const scoreEl = document.getElementById('dash-magic-score');
    const starsEl = document.getElementById('dash-total-stars');
    const packsEl = document.getElementById('dash-card-packs');
    const stickersEl = document.getElementById('dash-album-stickers');

    if (scoreEl) scoreEl.textContent = `${magicScore} pts`;
    if (starsEl) starsEl.textContent = `${totalStars} / 720`;
    if (packsEl) packsEl.textContent = packsCount;
    if (stickersEl) stickersEl.textContent = `${stickersCount} / 24`;

    // Compute Title Rank & Progress (Rebalanced for 720 stars max)
    let rankTitle = "Peón Novato";
    let rankEmoji = "🐣";
    let rankProgress = 0;

    if (totalStars < 80) {
      rankTitle = "Peón Novato";
      rankEmoji = "🐣";
      rankProgress = (totalStars / 80) * 100;
    } else if (totalStars < 240) {
      rankTitle = "Cabo de Guardia";
      rankEmoji = "🐴";
      rankProgress = ((totalStars - 80) / 160) * 100;
    } else if (totalStars < 400) {
      rankTitle = "Defensor del Centro";
      rankEmoji = "🏰";
      rankProgress = ((totalStars - 240) / 160) * 100;
    } else if (totalStars < 560) {
      rankTitle = "Chef de Aperturas";
      rankEmoji = "🥐";
      rankProgress = ((totalStars - 400) / 160) * 100;
    } else if (totalStars < 680) {
      rankTitle = "Jinete del Tablero";
      rankEmoji = "⚡";
      rankProgress = ((totalStars - 560) / 120) * 100;
    } else {
      rankTitle = "Gran Maestro Mágico";
      rankEmoji = "👑";
      rankProgress = 100;
    }

    const rankTitleEl = document.getElementById('rank-title');
    const rankEmojiEl = document.getElementById('rank-emoji');
    const barEl = document.getElementById('dashboard-progress-fill');
    const textEl = document.getElementById('dashboard-progress-text');

    if (rankTitleEl) rankTitleEl.textContent = `${rankEmoji} ${rankTitle}`;
    if (barEl) barEl.style.width = `${rankProgress}%`;
    if (textEl) textEl.textContent = `${Math.round(rankProgress)}%`;

    // Badges list definition (Rebalanced for 720 stars / 24 stickers)
    const badges = [
      { id: "primer_paso", name: "Primer Paso", desc: "Consigue tu 1ª estrella", emoji: "👣", unlocked: totalStars >= 1 },
      { id: "cocinero_real", name: "Chef Real", desc: "90★ en las Empanadas", emoji: "👨‍🍳", unlocked: torretaStars >= 90 },
      { id: "jinete_l", name: "Jinete de la L", desc: "90★ en el Laberinto", emoji: "🎠", unlocked: caballoStars >= 90 },
      { id: "alergico_mate", name: "¡Salud!", desc: "90★ en los Estornudos", emoji: "🤧", unlocked: reinaStars >= 90 },
      { id: "espejo_sombra", name: "El Espejo Vencido", desc: "90★ contra tu Sombra", emoji: "👥", unlocked: sombraStars >= 90 },
      { id: "coleccionista", name: "Coleccionista", desc: "Colecciona 20 cromos", emoji: "📖", unlocked: stickersCount >= 20 },
      { id: "ataque_caotico", name: "Táctico Caótico", desc: "Logra 400★ totales", emoji: "⚡", unlocked: totalStars >= 400 },
      { id: "maestro_supremo", name: "Inmortal", desc: "Logra 650★ totales", emoji: "👑", unlocked: totalStars >= 650 }
    ];

    const badgesRow = document.getElementById('badges-row');
    if (badgesRow) {
      badgesRow.innerHTML = '';
      badges.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-item ${badge.unlocked ? 'unlocked animate-pop' : 'locked'}`;
        badgeEl.innerHTML = `
          <div class="badge-icon-circle">${badge.emoji}</div>
          <span class="badge-name">${badge.name}</span>
          <span class="badge-desc">${badge.desc}</span>
        `;
        badgesRow.appendChild(badgeEl);
      });
    }
  }

  // Export globally so games can invoke it
  window.loadDashboardStats = loadDashboardStats;

  // Initialize stats on load
  loadDashboardStats();

  // Close Game Modal
  function closeGame() {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Restore background scroll
    
    // Destroy active game instance to prevent memory leaks and stop timers
    if (window.activeGameInstance) {
      if (typeof window.activeGameInstance.destroy === 'function') {
        window.activeGameInstance.destroy();
      }
      window.activeGameInstance = null;
    }
    
    sandbox.innerHTML = '';
    // Reload dashboard in case progress was achieved
    loadDashboardStats();
  }

  // Set click events for cards
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      const gameType = card.getAttribute('data-game');
      if (gameType) {
        // Initialize Audio context on user gesture (browser security policy)
        GameAudio.init();
        openGame(gameType);
      }
    });
  });

  // Close buttons
  closeBtn.addEventListener('click', closeGame);

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeGame();
    }
  });
});
