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
