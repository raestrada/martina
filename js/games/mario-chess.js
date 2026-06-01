// === CHESS DUEL MODULE — Uses shared ChessEngine + ChessBoard ===
window.ChessDuel = class ChessDuel {
  constructor(container, onWin, onLose, onStalemate) {
    this.container = container;
    this.onWin = onWin;
    this.onLose = onLose;
    this.onStalemate = onStalemate || onWin;
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.gameOver = false;
    this.moveHistory = [];
    this.isThinking = false;
    this.lastMove = null;
    this.board = null;
  }

  start() {
    // Clear container
    this.container.querySelectorAll('.chess-duel-overlay').forEach(e => e.remove());
    const overlay = document.createElement('div');
    overlay.className = 'chess-duel-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;z-index:50;background:rgba(10,10,25,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;';
    
    // Status bar
    const status = document.createElement('div');
    status.id = 'chess-duel-status';
    status.style.cssText = 'color:#fbbf24;font-family:Outfit,sans-serif;font-size:18px;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,0.8);text-align:center;';
    status.textContent = '¡Tu turno! Juegas con blancas ♔';
    overlay.appendChild(status);
    
    // Board container
    const boardDiv = document.createElement('div');
    boardDiv.id = 'chess-duel-board';
    boardDiv.style.cssText = 'width:min(56vmin,340px);height:min(56vmin,340px);margin:0 auto;';
    overlay.appendChild(boardDiv);
    
    // Buttons
    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:8px;';
    const resignBtn = document.createElement('button');
    resignBtn.textContent = 'Rendirse';
    resignBtn.style.cssText = 'background:#ef4444;color:#fff;border:none;padding:6px 16px;border-radius:6px;font-family:Outfit,sans-serif;font-weight:700;cursor:pointer;';
    resignBtn.onclick = () => this.onLose();
    btns.appendChild(resignBtn);
    overlay.appendChild(btns);
    
    this.container.appendChild(overlay);
    
    // Init shared chess board
    this.board = new ChessBoard({
      containerId: 'chess-duel-board',
      squareClass: 'chess-duel-sq',
      pieceClass: 'chess-duel-pc',
      popupClass: 'chess-duel-popup',
      lightColor: '#e8d5b7',
      darkColor: '#7c5c3e',
      onSquareClick: (r, c, coord, piece) => this.handleClick(r, c, coord, piece)
    });
    
    this.render();
    this.updateStatus('¡Tu turno! Juegas con blancas ♔');
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
      this.updateStatus('Caballo de Ŋ está pensando...');
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

    // Simple opponent AI (ELO ~400 with blunders)
    let chosen;
    if (Math.random() < 0.45) {
      chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    } else {
      validMoves.sort((a, b) => {
        const sa = ChessEngine.evaluateBoard(ChessEngine.executeMoveRaw(this.fen, a), 'b');
        const sb = ChessEngine.evaluateBoard(ChessEngine.executeMoveRaw(this.fen, b), 'b');
        return sb - sa;
      });
      chosen = validMoves[0];
      // Blunder chance
      if (Math.random() < 0.20 && validMoves.length > 1) {
        const others = validMoves.filter(m => m !== chosen);
        chosen = others[Math.floor(Math.random() * others.length)];
      }
    }
    
    this.isThinking = false;
    this.executeMove(chosen, false);
  }
};
