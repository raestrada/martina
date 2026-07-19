// test_puzzle.js — Verificador de desafíos de táctica (mate en 1/2/3/4)
//
// Uso:
//   node test_puzzle.js            → verifica TODOS los puzzles de js/games/puzzles.js
//   node test_puzzle.js --pv       → además imprime la variante principal (PV) de Stockfish
//   node test_puzzle.js --id p14   → verifica solo ese puzzle (con PV)
//
// Qué verifica de cada puzzle:
//   1. La posición FEN es legal (dos reyes, juegan blancas, el rey negro NO está en jaque).
//   2. La solución guardada es 100% legal, alterna bandos y termina en jaque mate.
//   3. Existe un mate FORZADO en exactamente `difficulty` jugadas (oráculo: Stockfish WASM
//      incluido en el repo, js/stockfish.js + js/stockfish.wasm), contra cualquier defensa.
//   4. La línea guardada no contiene jugadas blancas que regaten el mate (cada jugada
//      blanca de la solución mantiene un mate forzado dentro de las jugadas restantes).

const fs = require('fs');
const path = require('path');

// ---------- 1. Cargar Stockfish WASM como oráculo ----------
// OJO: debe cargarse ANTES de definir global.window, porque el glue de
// emscripten detecta `window` y cree estar en un navegador.
const sfLines = [];
let sfHandler = null;
global.postMessage = (msg) => { sfLines.push(String(msg)); };
Object.defineProperty(global, 'onmessage', {
  set(fn) { sfHandler = fn; },
  get() { return sfHandler; }
});
process.chdir(path.join(__dirname, 'js'));
(function loadStockfish() {
  // eval en ámbito de función: stockfish.js declara sus propios `var fs`, etc.
  eval(fs.readFileSync('stockfish.js', 'utf8'));
})();
process.chdir(__dirname);

// ---------- 2. Cargar el motor de reglas del proyecto ----------
global.window = {};
const engineSrc = fs.readFileSync(path.join(__dirname, 'js', 'chess-engine.js'), 'utf8');
eval(engineSrc);
const CE = global.window.ChessEngine;
if (!CE) { console.error('No se pudo cargar ChessEngine'); process.exit(1); }

function sfSend(cmd) { sfHandler({ data: cmd }); }
function sfWaitFor(pred, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const idx = sfLines.findIndex(pred);
      if (idx >= 0) { clearInterval(iv); resolve(sfLines[idx]); }
      else if (Date.now() - t0 > timeoutMs) { clearInterval(iv); reject(new Error('Stockfish timeout')); }
    }, 5);
  });
}

// Analiza una posición buscando mate forzado en ≤ maxMoves jugadas del bando que mueve.
// Estrategia dual (este build 2019 multi-variant es poco fiable con `go depth` a secas):
//   1) `go depth D` rápido: si reporta "mate k", es exacto.
//   2) si no, `go mate maxMoves` con watchdog: si no termina solo, se envía `stop`.
// Devuelve { mate: N | -N | null, scoreCp, pv: [...uci], bestmove }
async function analyze(fen, maxMoves, depthHint) {
  // ucinewgame limpia la TT entre posiciones (evita resultados contaminados)
  sfLines.length = 0;
  sfSend('ucinewgame');
  sfSend(`position fen ${fen}`);
  sfSend(`go depth ${depthHint || (2 * maxMoves + 8)}`);
  try {
    await sfWaitFor(l => l.startsWith('bestmove'), 15000);
  } catch (e) {
    sfSend('stop');
    await sfWaitFor(l => l.startsWith('bestmove'), 5000).catch(() => {});
  }
  let r = parseResult();
  if (r.mate !== null) return r;

  // Segunda pasada: búsqueda de mate dedicada (poda mucho mejor estos casos)
  sfLines.length = 0;
  sfSend(`position fen ${fen}`);
  sfSend(`go mate ${maxMoves}`);
  try {
    await sfWaitFor(l => l.startsWith('bestmove'), 12000);
  } catch (e) {
    sfSend('stop');
    await sfWaitFor(l => l.startsWith('bestmove'), 5000).catch(() => {});
  }
  r = parseResult();
  return r;
}

function parseResult() {
  const infos = sfLines.filter(l => l.startsWith('info') && l.includes(' score ') && l.includes(' pv '));
  const best = sfLines.find(l => l.startsWith('bestmove')) || '';
  let mate = null, scoreCp = null, pv = [];
  // Buscar de atrás hacia adelante la info más profunda con score mate (si existe)
  for (let i = infos.length - 1; i >= 0; i--) {
    const mMate = infos[i].match(/score mate (-?\d+)/);
    if (mMate) { mate = parseInt(mMate[1]); const mPv = infos[i].match(/ pv (.+)$/); if (mPv) pv = mPv[1].trim().split(/\s+/); break; }
  }
  if (mate === null && infos.length) {
    const last = infos[infos.length - 1];
    const mCp = last.match(/score cp (-?\d+)/);
    if (mCp) scoreCp = parseInt(mCp[1]);
    const mPv = last.match(/ pv (.+)$/);
    if (mPv) pv = mPv[1].trim().split(/\s+/);
  }
  return { mate, scoreCp, pv, bestmove: best.split(/\s+/)[1] || null };
}

// ---------- 3. Extraer la base de datos de puzzles ----------
function extractPuzzles() {
  const src = fs.readFileSync(path.join(__dirname, 'js', 'games', 'puzzles.js'), 'utf8');
  const start = src.indexOf('this.puzzles = [');
  if (start < 0) throw new Error('No se encontró this.puzzles en puzzles.js');
  const arrStart = src.indexOf('[', start);
  let depth = 0, i = arrStart, inStr = null, esc = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (inStr) { if (ch === inStr) inStr = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) break; }
  }
  return eval(src.slice(arrStart, i + 1));
}

// ---------- 4. Verificación ----------
const errors = [];

async function verifyPuzzle(p, showPV) {
  const id = p.id;
  const N = p.difficulty;
  const expectedPlies = 2 * N - 1;
  const fail = (msg) => errors.push(`[${id}] ${msg}`);

  // --- a) FEN legal ---
  let board;
  try { board = CE.parseFEN(p.fen); } catch (e) { fail(`FEN inválido: ${e.message}`); return; }
  const flat = board.flat().filter(Boolean);
  if (flat.filter(x => x === 'K').length !== 1 || flat.filter(x => x === 'k').length !== 1) {
    fail('Debe haber exactamente un rey de cada color'); return;
  }
  if (p.fen.split(' ')[1] !== 'w') { fail('El turno inicial debe ser de las blancas ("w")'); return; }
  if (CE.isKingInCheck(p.fen, 'b')) { fail('Posición ilegal: el rey NEGRO está en jaque pero juegan las blancas'); return; }
  if (CE.getAllLegalMoves(p.fen, 'w').length === 0) { fail('Las blancas no tienen jugadas legales al inicio'); return; }

  // --- b) Solución guardada: legalidad, alternancia y mate final ---
  if (!Array.isArray(p.solution) || p.solution.length === 0) { fail('Sin solución'); return; }
  if (p.solution.length !== expectedPlies) {
    fail(`La solución tiene ${p.solution.length} medias-jugadas; para mate en ${N} deben ser ${expectedPlies}`);
  }
  let fen = p.fen;
  let solutionOk = true;
  for (let i = 0; i < p.solution.length; i++) {
    const t = fen.split(' ')[1];
    if (t !== (i % 2 === 0 ? 'w' : 'b')) { fail(`Turno roto en la jugada ${i + 1} (${p.solution[i]})`); solutionOk = false; break; }
    if (!CE.getAllLegalMoves(fen, t).includes(p.solution[i])) {
      fail(`Jugada ilegal en la solución: #${i + 1} ${p.solution[i]} (FEN: ${fen})`);
      solutionOk = false; break;
    }
    fen = CE.executeMoveRaw(fen, p.solution[i]);
  }
  if (solutionOk && !CE.isCheckmate(fen, 'b')) {
    fail(`La solución NO termina en jaque mate (FEN final: ${fen})`);
    solutionOk = false;
  }

  // --- c) Mate forzado en exactamente N según Stockfish ---
  // Se busca mate en hasta N+2 para distinguir "mate más largo" de "sin mate".
  let res;
  try { res = await analyze(p.fen, N + 2); }
  catch (e) { fail(`Stockfish no respondió (${e.message})`); return; }

  if (res.mate === null || res.mate <= 0) {
    fail(`NO hay mate forzado para las blancas (Stockfish: ${res.mate === null ? 'sin mate a la vista' : 'mate en ' + res.mate + ' para el bando que juega'})`);
  } else if (res.mate < N) {
    fail(`Hay mate en ${res.mate} (más rápido que el anunciado en ${N}). Dificultad mal etiquetada`);
  } else if (res.mate > N) {
    fail(`El mate real es en ${res.mate}, no en ${N} como indica la dificultad`);
  }

  // --- d) Coherencia de la línea: cada jugada blanca mantiene el mate en las restantes ---
  if (solutionOk && res.mate === N) {
    let f2 = p.fen;
    for (let i = 0; i < p.solution.length; i += 2) {
      const remaining = N - i / 2;
      const r2 = await analyze(f2, remaining + 1);
      if (r2.mate === null || r2.mate <= 0 || r2.mate > remaining) {
        fail(`La jugada blanca #${i / 2 + 1} de la solución (${p.solution[i]}) no mantiene el mate en ${remaining}`);
        break;
      }
      // la solución guardada debe empezar por una jugada que dé mate en `remaining`
      f2 = CE.executeMoveRaw(f2, p.solution[i]);
      if (i + 1 < p.solution.length) f2 = CE.executeMoveRaw(f2, p.solution[i + 1]);
      if (CE.isCheckmate(f2, 'b')) break;
    }
  }

  if (showPV) {
    const sans = [];
    let f = p.fen;
    for (const uci of res.pv) {
      const san = CE.uciToSan(f, uci);
      sans.push(san);
      f = CE.executeMoveRaw(f, uci);
    }
    console.log(`    PV Stockfish [${id}] mate=${res.mate}: ${sans.join(' ')}`);
    console.log(`    UCI: [${res.pv.map(m => `'${m}'`).join(', ')}]`);
  }
  return res;
}

// ---------- 5. Main ----------
(async function main() {
  const args = process.argv.slice(2);
  const showPV = args.includes('--pv');
  const idIdx = args.indexOf('--id');
  const onlyId = idIdx >= 0 ? args[idIdx + 1] : null;

  sfSend('uci');
  await sfWaitFor(l => l.includes('uciok'));
  sfSend('isready');
  await sfWaitFor(l => l.includes('readyok'));

  const puzzles = extractPuzzles();
  console.log(`\n=== Verificador de desafíos de táctica (oráculo: Stockfish) ===`);
  console.log(`Puzzles encontrados: ${puzzles.length}`);
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const p of puzzles) counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
  console.log(`Distribución: M1=${counts[1]}, M2=${counts[2]}, M3=${counts[3]}, M4=${counts[4]}\n`);

  const seen = new Set();
  for (const p of puzzles) {
    if (seen.has(p.id)) errors.push(`[${p.id}] ID duplicado`);
    seen.add(p.id);
    if (onlyId && p.id !== onlyId) continue;
    const before = errors.length;
    await verifyPuzzle(p, showPV || !!onlyId);
    console.log(errors.length === before
      ? `  ✅ ${p.id} — mate en ${p.difficulty} correcto (${p.title})`
      : `  ❌ ${p.id} — ${p.title}`);
  }

  console.log('\n=== Resultado ===');
  if (errors.length === 0) {
    console.log('  🎉 Todos los desafíos son resolubles y están bien etiquetados.\n');
    process.exit(0);
  } else {
    console.log(`  ${errors.length} problema(s) encontrado(s):\n`);
    errors.forEach(e => console.log('  ❌ ' + e));
    console.log('');
    process.exit(1);
  }
})().catch(e => { console.error(e); process.exit(1); });
