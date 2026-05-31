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
      this._masterGain = this.ctx.createGain();
      this._masterGain.gain.value = 1;
      this._masterGain.connect(this.ctx.destination);
    }
  },

  _out() {
    return this._masterGain || this.ctx.destination;
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
    gain.connect(this._out());
    
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
      gain.connect(this._out());
      
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
    gain.connect(this._out());
    
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
      gain.connect(this._out());
      
      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + durations[index]);
      
      timeOffset += 0.12;
    });
  },

  playCapture() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
      osc.connect(gain).connect(this._out());
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.12);
    });
  },

  playMute() {
    this.init();
    if (!this.ctx) return;
    this._muted = !this._muted;
    if (this._muted) {
      this._savedGain = this._masterGain ? this._masterGain.gain.value : 1;
      if (this._masterGain) this._masterGain.gain.value = 0;
    } else {
      if (this._masterGain) this._masterGain.gain.value = this._savedGain || 1;
    }
    localStorage.setItem('martina_game_mute', this._muted ? '1' : '0');
    return this._muted;
  },

  isMuted() {
    return !!this._muted;
  },

  restoreMute() {
    const muted = localStorage.getItem('martina_game_mute') === '1';
    this._muted = muted;
    return muted;
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
    if (gameType === 'chessbox') title = 'Chess Boxing: Duelo de Titanes';
    
    // Landscape overlay for landscape-only games on mobile
    const isMobile = window.innerWidth < 1024 || window.innerHeight < 500 || 'ontouchstart' in window;
    const needsLandscape = gameType === 'mario' || gameType === 'chessbox';
    if (isMobile && needsLandscape) {
      ensureLandscapeOverlay();
      // Lock screen orientation to landscape on mobile
      try {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch(e) {}
    } else {
      removeLandscapeOverlay();
    }
    
    gameTitle.textContent = title;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Show Loading Progress inside sandbox
    const quotes = [
      '«Cada peón es una reina dormida»',
      '«El ajedrez es 99% táctica»',
      '«Para jugar bien, solo necesitas imaginación»',
      '«En el ajedrez, el mejor movimiento es siempre el siguiente»',
      '«El que controla el centro, controla el reino»',
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];

    sandbox.innerHTML = `
      <div class="game-screen game-loading" style="animation: none;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">♕</div>
        <h2>Invocando piezas...</h2>
        <p style="font-style:italic;opacity:0.7;max-width:320px;margin:0 auto 1.5rem;font-size:0.85rem;">${q}</p>
        <div class="loading-bar-track"><div class="loading-bar-fill" id="loading-fill" style="width:0%"></div></div>
        <p style="font-size:0.75rem;opacity:0.5;margin-top:0.5rem;" id="loading-status">Preparando tablero...</p>
      </div>
    `;
    let loadPct = 0;
    const fillEl = document.getElementById('loading-fill');
    const statusEl = document.getElementById('loading-status');
    const loadInterval = setInterval(() => {
      loadPct += Math.random() * 18;
      if (loadPct > 88) loadPct = 88;
      if (fillEl) fillEl.style.width = loadPct + '%';
      if (statusEl && loadPct > 60) statusEl.textContent = 'Casi listo...';
    }, 200);

    // Load Game Script dynamically
    const scriptId = `script-game-${gameType}`;
    let script = document.getElementById(scriptId);

    function instantiateGame() {
      clearInterval(loadInterval);
      if (fillEl) fillEl.style.width = '100%';
      if (statusEl) statusEl.textContent = '¡Listo!';
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
      script.src = `js/games/${gameType}.js?v=2.0`;
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

    let chessboxProgEasy = loadProg('martina_chessbox_progress_easy');
    let chessboxProgMedium = loadProg('martina_chessbox_progress');
    let chessboxProgHard = loadProg('martina_chessbox_progress_hard');
    let chessboxProgMartina = loadProg('martina_chessbox_progress_martina');

    const sumProg = (prog) => prog.reduce((sum, s) => sum + s, 0);

    const torretaStars = sumProg(torretaProgEasy) + sumProg(torretaProgMedium) + sumProg(torretaProgHard) + sumProg(torretaProgMartina);
    const caballoStars = sumProg(caballoProgEasy) + sumProg(caballoProgMedium) + sumProg(caballoProgHard) + sumProg(caballoProgMartina);
    const reinaStars = sumProg(reinaProgEasy) + sumProg(reinaProgMedium) + sumProg(reinaProgHard) + sumProg(reinaProgMartina);
    const sombraStars = sumProg(sombraProgEasy) + sumProg(sombraProgMedium) + sumProg(sombraProgHard) + sumProg(sombraProgMartina);
    const chessboxStars = sumProg(chessboxProgEasy) + sumProg(chessboxProgMedium) + sumProg(chessboxProgHard) + sumProg(chessboxProgMartina);
    const totalStars = torretaStars + caballoStars + reinaStars + sombraStars + chessboxStars;

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
    if (starsEl) starsEl.textContent = `${totalStars} / 900`;
    if (packsEl) packsEl.textContent = packsCount;
    if (stickersEl) stickersEl.textContent = `${stickersCount} / 24`;

    // Compute Title Rank & Progress (Rebalanced for 900 stars max)
    let rankTitle = "Peón Novato";
    let rankEmoji = "🐣";
    let rankProgress = 0;

    if (totalStars < 100) {
      rankTitle = "Peón Novato";
      rankEmoji = "🐣";
      rankProgress = (totalStars / 100) * 100;
    } else if (totalStars < 300) {
      rankTitle = "Cabo de Guardia";
      rankEmoji = "🐴";
      rankProgress = ((totalStars - 100) / 200) * 100;
    } else if (totalStars < 500) {
      rankTitle = "Defensor del Centro";
      rankEmoji = "🏰";
      rankProgress = ((totalStars - 300) / 200) * 100;
    } else if (totalStars < 700) {
      rankTitle = "Gladiador del Ring";
      rankEmoji = "🥊";
      rankProgress = ((totalStars - 500) / 200) * 100;
    } else if (totalStars < 850) {
      rankTitle = "Campeón del Tablero";
      rankEmoji = "⚡";
      rankProgress = ((totalStars - 700) / 150) * 100;
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
    if (barEl) {
      const currentWidth = parseFloat(barEl.style.width) || 0;
      barEl.style.width = currentWidth + '%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { barEl.style.width = `${rankProgress}%`; });
      });
    }
    if (textEl) textEl.textContent = `${Math.round(rankProgress)}%`;

    // Badges list definition (Rebalanced for 900 stars / 24 stickers)
    const badges = [
      { id: "primer_paso", name: "Primer Paso", desc: "Consigue tu 1ª estrella", emoji: "👣", unlocked: totalStars >= 1 },
      { id: "cocinero_real", name: "Chef Real", desc: "90★ en las Empanadas", emoji: "👨‍🍳", unlocked: torretaStars >= 90 },
      { id: "jinete_l", name: "Jinete de la L", desc: "90★ en el Laberinto", emoji: "🎠", unlocked: caballoStars >= 90 },
      { id: "alergico_mate", name: "¡Salud!", desc: "90★ en los Estornudos", emoji: "🤧", unlocked: reinaStars >= 90 },
      { id: "espejo_sombra", name: "El Espejo Vencido", desc: "90★ contra tu Sombra", emoji: "👥", unlocked: sombraStars >= 90 },
      { id: "gladiador_mental", name: "Gladiador Mental", desc: "90★ en Chess Boxing", emoji: "🥊", unlocked: chessboxStars >= 90 },
      { id: "ataque_caotico", name: "Táctico Caótico", desc: "Logra 500★ totales", emoji: "⚡", unlocked: totalStars >= 500 },
      { id: "maestro_supremo", name: "Inmortal", desc: "Logra 800★ totales", emoji: "👑", unlocked: totalStars >= 800 }
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
    removeLandscapeOverlay();
    // Unlock screen orientation
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch(e) {}
    
    // Destroy active game instance to prevent memory leaks and stop timers
    if (window.activeGameInstance) {
      if (typeof window.activeGameInstance.destroy === 'function') {
        window.activeGameInstance.destroy();
      }
      window.activeGameInstance = null;
    }
    
    sandbox.innerHTML = '';
    // Stats are updated on-demand by games via endGame callback — no need to reload here
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

  // Mute button
  const muteBtn = document.getElementById('btn-mute');
  if (muteBtn) {
    if (GameAudio.restoreMute()) {
      muteBtn.textContent = '🔇';
      muteBtn.classList.add('muted');
    }
    muteBtn.addEventListener('click', () => {
      const nowMuted = GameAudio.playMute();
      muteBtn.textContent = nowMuted ? '🔇' : '🔊';
      muteBtn.classList.toggle('muted', nowMuted);
    });
  }

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeGame();
    }
  });

  // --- Landscape overlay for mobile games that require horizontal ---
  function ensureLandscapeOverlay() {
    if (document.getElementById('landscape-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'landscape-overlay';
    overlay.className = 'landscape-overlay';
    overlay.innerHTML = `
      <div class="rotate-icon">📱</div>
      <h2>Gira tu dispositivo</h2>
      <p>Este juego se juega en horizontal</p>
    `;
    document.body.appendChild(overlay);
    checkLandscape();
    window.addEventListener('resize', checkLandscape);
    window.addEventListener('orientationchange', checkLandscape);
  }

  function removeLandscapeOverlay() {
    const overlay = document.getElementById('landscape-overlay');
    if (overlay) overlay.remove();
    window.removeEventListener('resize', checkLandscape);
    window.removeEventListener('orientationchange', checkLandscape);
  }

  function checkLandscape() {
    const overlay = document.getElementById('landscape-overlay');
    if (!overlay) return;
    overlay.style.display = window.innerWidth > window.innerHeight ? 'none' : 'flex';
  }
});
