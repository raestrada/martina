// chess-board.js — Shared DOM chess board with SVG pieces
// Used by both bots and chessboxing games.
(function() {

class ChessBoard {
  constructor(opts) {
    this.containerId = opts.containerId || 'chess-board';
    this.squareClass = opts.squareClass || 'chess-sq';
    this.pieceClass = opts.pieceClass || 'chess-pc';
    this.lightColor = opts.lightColor || '#e8d5b7';
    this.darkColor = opts.darkColor || '#7c5c3e';
    this.onSquareClick = opts.onSquareClick || null;
    this.popupClass = opts.popupClass || 'chess-popup';
    this._lastMove = null;
    this._selected = null;
    this._accentColor = '#fbbf24';
  }

  setColors(light, dark) { this.lightColor = light; this.darkColor = dark; }

  render(fen) {
    const boardDOM = document.getElementById(this.containerId);
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    const board = ChessEngine.parseFEN(fen);
    const pieceMap = {
      'K': 'wK', 'Q': 'wQ', 'R': 'wR', 'B': 'wB', 'N': 'wN', 'P': 'wP',
      'k': 'bK', 'q': 'bQ', 'r': 'bR', 'b': 'bB', 'n': 'bN', 'p': 'bP'
    };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const light = (r + c) % 2 === 0;
        const coord = `${String.fromCharCode(97 + c)}${8 - r}`;
        const square = document.createElement('div');
        square.className = this.squareClass;
        square.style.backgroundColor = light ? this.lightColor : this.darkColor;
        square.setAttribute('data-coord', coord);

        const piece = board[r][c];
        if (piece) {
          const el = document.createElement('div');
          el.className = this.pieceClass;
          el.style.backgroundImage = `url('/assets/img/pieces/${pieceMap[piece]}.svg')`;
          square.appendChild(el);
        }

        if (this._lastMove) {
          if (coord === this._lastMove.from || coord === this._lastMove.to) {
            const isFrom = coord === this._lastMove.from;
            const pct = isFrom ? 0.25 : 0.45;
            const rv = parseInt(this._accentColor.slice(1,3), 16);
            const gv = parseInt(this._accentColor.slice(3,5), 16);
            const bv = parseInt(this._accentColor.slice(5,7), 16);
            square.style.background = `linear-gradient(rgba(${rv},${gv},${bv},${pct}), rgba(${rv},${gv},${bv},${pct})), ${light ? this.lightColor : this.darkColor}`;
          }
        }

        const rr = r, cc = c;
        square.addEventListener('click', () => {
          if (this.onSquareClick) this.onSquareClick(rr, cc, coord, piece);
        });
        boardDOM.appendChild(square);
      }
    }
  }

  setLastMove(from, to, accentColor) {
    this._lastMove = { from, to };
    if (accentColor) this._accentColor = accentColor;
  }

  clearHighlights() {
    const sqs = document.querySelectorAll(`#${this.containerId} .${this.squareClass}`);
    sqs.forEach(s => { s.style.boxShadow = ''; s.style.outline = ''; });
  }

  setSelected(coord) {
    this.clearHighlights();
    if (!coord) return;
    const sq = document.querySelector(`#${this.containerId} .${this.squareClass}[data-coord="${coord}"]`);
    if (sq) sq.style.outline = '3px solid #fbbf24';
  }

  showLegalMoves(moves, fromCoord) {
    moves.forEach(m => {
      if (m.substring(0,2) !== fromCoord) return;
      const dest = m.substring(2,4);
      const sq = document.querySelector(`#${this.containerId} .${this.squareClass}[data-coord="${dest}"]`);
      if (sq) {
        const hasPiece = sq.querySelector(`.${this.pieceClass}`);
        sq.style.boxShadow = `inset 0 0 0 4px ${hasPiece ? 'rgba(239,68,68,0.55)' : 'rgba(74,222,128,0.35)'}`;
      }
    });
  }

  showPopup(uciMove, annotation) {
    if (!annotation) return;
    document.querySelectorAll(`.${this.popupClass}`).forEach(p => {
      p.style.animation = 'botsPopupOut 0.3s ease-in forwards';
      setTimeout(() => p.remove(), 350);
    });

    const dest = uciMove.substring(2,4);
    const board = document.getElementById(this.containerId);
    if (!board) return;
    const file = dest.charCodeAt(0) - 97;
    const rank = 8 - parseInt(dest[1]);
    const rect = board.getBoundingClientRect();
    const sqSize = rect.width / 8;
    const x = rect.left + (file + 1) * sqSize - 6;
    const y = rect.top + rank * sqSize + 3;

    const popup = document.createElement('div');
    popup.className = this.popupClass;
    popup.textContent = annotation;
    popup.style.cssText = `position:fixed;left:${x}px;top:${y}px;transform:translate(-100%,0) scale(0);font-size:0.8rem;z-index:999;pointer-events:none;animation:botsPopupIn 0.3s ease-out forwards;text-shadow:0 1px 3px rgba(0,0,0,0.5);line-height:1;font-weight:900;`;
    document.body.appendChild(popup);
  }
}

window.ChessBoard = ChessBoard;
})();
