# Base de datos de puzzles de mate verificados

`mates_verificados.json` contiene **730 puzzles de jaque mate de partidas reales**
(colección de Bill Harvey, wtharvey.com), todos **verificados automáticamente**:

- **Mate forzado exacto en N** confirmado por Stockfish WASM (el mismo `js/stockfish.js`
  del sitio, ejecutado en Node).
- **Solución 100% legal y termina en mate** confirmada con `js/chess-engine.js`.

## Formato de cada entrada

```json
{
  "id": "m3-001",                    // id interno de la BD
  "citation": "William Evans vs Alexander MacDonnell, London, 1826",
  "difficulty": 3,                   // 3 = mate en 3, 4 = mate en 4
  "fen": "r3k2r/ppp2Npp/1b5n/4p2b/2B1P2q/BQP2P2/P5PP/RN5K w kq - 1 0",
  "solution": ["c4b5", "c7c6", "b3e6", "h4e7", "e6e7"],   // UCI
  "san": "1. Bb5+ c6 2. Qe6+ Qe7 3. Qxe7#",
  "used": true,                      // true si ya está publicado en el sitio
  "puzzleId": "p29"                  // id del puzzle en js/games/puzzles.js (null si no se usa)
}
```

## Cómo agregar más puzzles al sitio (flujo para un agente LLM)

1. **Elegir candidatos** en `mates_verificados.json` con `"used": false`.
   - Evitar soluciones con **coronación** (`=` en el SAN): la UI actual no la soporta
     (el jugador no puede indicar la pieza de coronación).
   - Preferir variedad de temas (sacrificio de dama, caza de rey, coz, clavada,
     mates con peón/torre/alfil/caballo) y jugadores famosos.
2. **Crear la entrada curada** en `js/games/puzzles.js` (dentro de `this.puzzles`):
   - `id`: siguiente correlativo (`p46`, `p47`, …).
   - `difficulty`: igual a la de la BD (3 o 4).
   - `title`/`desc`/`quotes`: en español, tono Martina (humor absurdo, personajes del
     Reino de las 64 Casillas). Mencionar la partida real en `desc`.
   - `fen` y `solution`: **copiar exactamente** de la BD.
   - `character`: uno de `peoncito`, `reinangra`, `caballo`, `alfil`, `sombra`, `martina`.
3. **Verificar** con el test (obligatorio):
   ```bash
   node test_puzzle.js --id p46   # verifica un puzzle concreto
   node test_puzzle.js            # verifica todos
   ```
4. **Marcar como usado** en `mates_verificados.json`: poner `"used": true` y
   `"puzzleId": "p46"` en la entrada correspondiente (mismo tablero FEN).
5. El sitio lista los puzzles automáticamente por dificultad; no hay que tocar nada más.

## Por qué hay que verificar siempre

Históricamente, más de la mitad de los puzzles escritos a mano para esta sección
resultaron irresolubles (rey en jaque inicial oculto, defensas no consideradas,
jugadas de torre "en diagonal", mates más rápidos que el anunciado, etc.).
`test_puzzle.js` existe exactamente para evitarlo: **ningún puzzle se publica sin pasar el test**.
