// === CHESS DUEL MODULE — Uses shared ChessEngine + ChessBoard ===
window.ChessDuel = class ChessDuel {
  constructor(container, onWin, onLose, onStalemate, options = {}) {
    this.container = container;
    this.onWin = onWin;
    this.onLose = onLose;
    this.onStalemate = onStalemate || onWin;
    this.options = options || {};
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.gameOver = false;
    this.moveHistory = [];
    this.isThinking = false;
    this.lastMove = null;
    this.board = null;

    // Dynamically scale ELO and name based on difficulty settings
    const storedDifficulty = localStorage.getItem('martina_mario_difficulty') || 'medium';
    const baseElo = this.options.elo || 300;
    if (baseElo > 500) {
      if (storedDifficulty === 'easy') this.elo = 550;
      else if (storedDifficulty === 'medium') this.elo = 700;
      else if (storedDifficulty === 'hard') this.elo = 850;
      else if (storedDifficulty === 'martina') this.elo = 1000;
    } else {
      if (storedDifficulty === 'easy') this.elo = 200;
      else if (storedDifficulty === 'medium') this.elo = 300;
      else if (storedDifficulty === 'hard') this.elo = 400;
      else if (storedDifficulty === 'martina') this.elo = 500;
    }
    this.opponentName = this.options.opponentName || 'Caballo de Ŋ';
  }

  start() {
    if (!this.container) return;

    // Clear container
    this.container.querySelectorAll('.chess-duel-overlay').forEach(e => e.remove());
    const overlay = document.createElement('div');
    overlay.className = 'chess-duel-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;z-index:50;background:rgba(10,10,25,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;overflow:hidden;';
    
    // Status bar
    const status = document.createElement('div');
    status.id = 'chess-duel-status';
    status.style.cssText = 'color:#fbbf24;font-family:Outfit,sans-serif;font-size:18px;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,0.8);text-align:center;z-index:56;';
    status.textContent = `¡Tu turno contra ${this.opponentName} (ELO ${this.elo})! Juegas con blancas ♔`;
    overlay.appendChild(status);
    
    // Board container — needs explicit grid for ChessBoard
    const boardDiv = document.createElement('div');
    boardDiv.id = 'chess-duel-board';
    const borderColor = this.options.borderColor || '#8B6914';
    boardDiv.style.cssText = `display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:min(50vmin,300px);height:min(50vmin,300px);margin:0 auto;border:3px solid ${borderColor};border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5);z-index:56;position:relative;background:#000;`;
    overlay.appendChild(boardDiv);
    
    // Buttons
    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:8px;z-index:56;';
    const resignBtn = document.createElement('button');
    resignBtn.textContent = 'Rendirse';
    resignBtn.style.cssText = 'background:#ef4444;color:#fff;border:none;padding:6px 16px;border-radius:6px;font-family:Outfit,sans-serif;font-weight:700;cursor:pointer;';
    resignBtn.onclick = () => this.onLose();
    btns.appendChild(resignBtn);
    overlay.appendChild(btns);
    
    this.container.appendChild(overlay);
    
    // Storm Canvas Effect
    if (this.options.stormEffect) {
      const stormCanvas = document.createElement('canvas');
      stormCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:55;';
      overlay.appendChild(stormCanvas);
      
      const sCtx = stormCanvas.getContext('2d');
      let width = stormCanvas.width = this.container.clientWidth || 800;
      let height = stormCanvas.height = this.container.clientHeight || 450;
      
      const handleResize = () => {
        width = stormCanvas.width = this.container.clientWidth || 800;
        height = stormCanvas.height = this.container.clientHeight || 450;
      };
      window.addEventListener('resize', handleResize);

      const particles = [];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 25 + 12,
          speed: Math.random() * 18 + 16,
          weight: Math.random() * 1.5 + 0.5
        });
      }

      let flashAlpha = 0;
      let nextFlashTime = Date.now() + 2000 + Math.random() * 3000;
      
      const anim = () => {
        if (!overlay.parentNode) {
          window.removeEventListener('resize', handleResize);
          return; // overlay was removed
        }
        sCtx.clearRect(0, 0, width, height);

        // Draw lightning flash
        if (flashAlpha > 0) {
          sCtx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          sCtx.fillRect(0, 0, width, height);
          flashAlpha -= 0.06;
        }

        if (Date.now() > nextFlashTime) {
          flashAlpha = 0.7 + Math.random() * 0.3;
          nextFlashTime = Date.now() + 4000 + Math.random() * 4000;
          // Apply shake class to board
          boardDiv.classList.add('board-shake');
          setTimeout(() => boardDiv.classList.remove('board-shake'), 400);
        }

        // Draw rain
        sCtx.strokeStyle = 'rgba(156, 163, 175, 0.45)';
        sCtx.lineWidth = 1.2;
        sCtx.beginPath();
        particles.forEach(p => {
          sCtx.moveTo(p.x, p.y);
          sCtx.lineTo(p.x - 3, p.y + p.length); // diagonal rain
          p.y += p.speed;
          p.x -= 3;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });
        sCtx.stroke();

        requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }
    
    // Init shared chess board
    this.board = new ChessBoard({
      containerId: 'chess-duel-board',
      squareClass: 'chess-duel-sq',
      pieceClass: 'chess-duel-pc',
      popupClass: 'chess-duel-popup',
      lightColor: this.options.lightColor || '#e8d5b7',
      darkColor: this.options.darkColor || '#7c5c3e',
      onSquareClick: (r, c, coord, piece) => this.handleClick(r, c, coord, piece)
    });
    
    this.render();
    this.updateStatus(`¡Tu turno contra ${this.opponentName} (ELO ${this.elo})! Juegas con blancas ♔`);
  }

  render() {
    if (!this.board) return;
    this.board.setLastMove(this.lastMove?.from, this.lastMove?.to, '#fbbf24');
    this.board.render(this.fen);
  }

  updateStatus(msg) {
    const el = document.getElementById('chess-duel-status');
    if (el) el.textContent = msg;
  }

  handleClick(r, c, coord, piece) {
    const parts = this.fen.split(' ');
    const turn = parts[1] || 'w';
    if (turn !== 'w' || this.isThinking || this.gameOver) return;
    if (!this.board) return;

    if (this._selected) {
      const fromCoord = this._selected.coord;
      const uciMove = fromCoord + coord;
      const validMoves = ChessEngine.getAllLegalMoves(this.fen, 'w');
      const targetMove = validMoves.find(m => m.substring(0, 4) === uciMove.substring(0, 4));
      if (targetMove) {
        this._selected = null;
        this.executeMove(targetMove, true);
        return;
      }
      this._selected = null;
      this.board.clearHighlights();
    }

    if (piece && piece === piece.toUpperCase()) {
      this._selected = { r, c, coord };
      this.board.setSelected(coord);
      const moves = ChessEngine.getAllLegalMoves(this.fen, 'w');
      this.board.showLegalMoves(moves, coord);
    }
  }

  executeMove(uciMove, isPlayer) {
    if (this.gameOver) return;
    if (isPlayer && this.isThinking) return;

    // Validate move doesn't leave own king in check
    const color = isPlayer ? 'w' : 'b';
    const nextFEN = ChessEngine.executeMoveRaw(this.fen, uciMove);
    if (ChessEngine.isKingInCheck(nextFEN, color)) return;

    this.fen = nextFEN;
    this.moveHistory.push(uciMove);
    this.lastMove = { from: uciMove.substring(0,2), to: uciMove.substring(2,4) };
    this.render();

    const newParts = this.fen.split(' ');
    const nextTurn = newParts[1] || 'w';

    // Check game end
    if (ChessEngine.isCheckmate(this.fen, nextTurn)) {
      this.gameOver = true;
      this.updateStatus(isPlayer ? '¡JAQUE MATE! ¡Victoria!' : 'Jaque mate... Derrota.');
      if (isPlayer) setTimeout(() => this.onWin(), 800);
      else setTimeout(() => this.onLose(), 800);
      return;
    }
    if (ChessEngine.isStalemate(this.fen, nextTurn)) {
      this.gameOver = true;
      this.updateStatus('¡Ahogado! Tablas.');
      setTimeout(() => this.onStalemate(), 800);
      return;
    }

    if (nextTurn === 'b' && isPlayer) {
      this.isThinking = true;
      this.updateStatus(`${this.opponentName} está pensando...`);
      setTimeout(() => this.opponentMove(), 400 + Math.random() * 400);
    } else if (!isPlayer) {
      this.isThinking = false;
      this.updateStatus('¡Tu turno! ♔');
    }
  }

  opponentMove() {
    const validMoves = ChessEngine.getAllLegalMoves(this.fen, 'b');
    if (validMoves.length === 0) {
      this.isThinking = false;
      this.render();
      // Check game end for player
      if (ChessEngine.isCheckmate(this.fen, 'w')) { this.gameOver = true; this.updateStatus('Jaque mate... Derrota.'); setTimeout(() => this.onLose(), 800); }
      else { this.gameOver = true; this.updateStatus('¡Ahogado! Tablas.'); setTimeout(() => this.onStalemate(), 800); }
      return;
    }

    // Opponent AI scaling based on ELO
    const randomChance = Math.max(0.05, 0.5 - (this.elo - 300) / 1000);
    const blunderChance = Math.max(0.02, 0.25 - (this.elo - 300) / 1500);

    let chosen;
    if (Math.random() < randomChance) {
      chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    } else {
      validMoves.sort((a, b) => {
        const sa = ChessEngine.evaluateBoard(ChessEngine.executeMoveRaw(this.fen, a), 'b');
        const sb = ChessEngine.evaluateBoard(ChessEngine.executeMoveRaw(this.fen, b), 'b');
        return sb - sa;
      });
      chosen = validMoves[0];
      // Blunder chance
      if (Math.random() < blunderChance && validMoves.length > 1) {
        const others = validMoves.filter(m => m !== chosen);
        chosen = others[Math.floor(Math.random() * others.length)];
      }
    }
    
    this.isThinking = false;
    this.executeMove(chosen, false);
  }
};
