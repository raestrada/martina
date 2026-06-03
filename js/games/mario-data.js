// === MARIO DATA — Level definitions for Super Martina: El Salto Mágico ===
// Each level has its own biome, platform layout, enemies, coins, and goal.

window.MartinaLevels = {

  // Max possible score per level index (coins + burst + enemies + crowns)
      maxScore: {
        0: 9900,
        1: 9900,
        2: 9900,
        3: 9900,
        4: 12000,
        5: 9900,
        6: 9900,
        7: 9900
      },

  levels: [
    // ================================================================
    // LEVEL 1 — "El Primer Movimiento" — Grass / Magical Realm
    // ================================================================
    {
      biome: 'grass',
      worldWidth: 2400,
      backgroundColor: '#5c94fc',

      platformsData: [
        { x: 0, y: 410, w: 800, h: 40 },
        { x: 980, y: 410, w: 750, h: 40 },
        { x: 1850, y: 410, w: 600, h: 40 },  // marble finish
        { x: 260, y: 310, w: 140, h: 20 },
        { x: 460, y: 220, w: 100, h: 20 },
        { x: 640, y: 300, w: 120, h: 20 },
        { x: 830, y: 310, w: 120, h: 20 },
        { x: 1080, y: 310, w: 160, h: 20 },
        { x: 1320, y: 220, w: 120, h: 20 },
        { x: 1540, y: 310, w: 100, h: 20 },
        { x: 1730, y: 310, w: 120, h: 20 }
      ],

      coinsData: [
        { x: 300, y: 260 }, { x: 330, y: 260 }, { x: 360, y: 260 },
        { x: 510, y: 170 },
        { x: 680, y: 250 }, { x: 710, y: 250 },
        { x: 860, y: 260 },
        { x: 1120, y: 260 }, { x: 1150, y: 260 },
        { x: 1380, y: 170 },
        { x: 1590, y: 260 },
        { x: 1750, y: 260 }, { x: 1790, y: 260 },
        { x: 220, y: 370 }, { x: 250, y: 370 }, { x: 280, y: 370 },
        { x: 380, y: 370 }, { x: 410, y: 370 }, { x: 440, y: 370 },
        { x: 580, y: 370 }, { x: 610, y: 370 }, { x: 640, y: 370 },
        { x: 1060, y: 370 }, { x: 1090, y: 370 }, { x: 1120, y: 370 },
        { x: 1200, y: 370 }, { x: 1230, y: 370 }, { x: 1260, y: 370 },
        { x: 1460, y: 370 }, { x: 1490, y: 370 }, { x: 1520, y: 370 },
        { x: 1960, y: 360 }, { x: 2010, y: 360 }, { x: 2060, y: 360 }
      ],

      enemiesData: [
        { x: 380, y: 360, left: 180, right: 600, speed: 70 },
        { x: 650, y: 360, left: 450, right: 750, speed: 60 },
        { x: 1200, y: 360, left: 1020, right: 1500, speed: 80 },
        { x: 1520, y: 360, left: 1350, right: 1680, speed: 70 },
        { x: 1950, y: 360, left: 1880, right: 2120, speed: 90 }
      ],

      airEnemiesData: [
        { x: 500, y: 140, pattern: 'horizontal', minX: 400, maxX: 640, speed: 75 },
        { x: 910, y: 220, pattern: 'diagonal', minX: 830, maxX: 980, minY: 160, maxY: 260, speed: 70, speedY: 55 },
        { x: 1790, y: 200, pattern: 'sinusoidal', minX: 1700, maxX: 1880, baseY: 190, ampY: 45, speed: 80 }
      ],

      crownsData: [
        { x: 890, y: 180 },
        { x: 1380, y: 110 },
        { x: 1790, y: 180 }
      ],

      // Goal configuration
      goal: {
        type: 'portal_queen',  // Portal + White Queen
        portalX: 2150, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 2 — "Tic, Tac, Jaque Mate" — Clockwork / Real World
    // ================================================================
    {
      biome: 'clockwork',
      worldWidth: 2400,
      backgroundColor: '#1a1520',

      platformsData: [
        // Ground — mechanical brass platforms
        { x: 0, y: 410, w: 650, h: 40 },
        { x: 820, y: 410, w: 580, h: 40 },
        { x: 1580, y: 410, w: 820, h: 40 },  // marble/trophy runway

        // Clock-gear floating platforms — vertical tiered design
        { x: 200, y: 310, w: 110, h: 20 },
        { x: 440, y: 240, w: 80, h: 20 },
        { x: 620, y: 320, w: 100, h: 20 },

        // Over first pit — mechanical bridge
        { x: 740, y: 310, w: 100, h: 20 },

        // Mid-level gear cluster (more vertical)
        { x: 980, y: 310, w: 140, h: 20 },
        { x: 1150, y: 220, w: 100, h: 20 },
        { x: 1320, y: 310, w: 120, h: 20 },
        { x: 1480, y: 240, w: 80, h: 20 },

        // Over second pit
        { x: 1560, y: 310, w: 80, h: 20 },

        // Final approach — symmetrical gear arrangement
        { x: 1800, y: 300, w: 120, h: 20 },
        { x: 1980, y: 240, w: 90, h: 20 },
        { x: 2150, y: 310, w: 100, h: 20 }
      ],

      coinsData: [
        // Starting area — gear circle pattern
        { x: 180, y: 260 }, { x: 210, y: 250 }, { x: 240, y: 260 },
        { x: 480, y: 190 },
        { x: 660, y: 270 }, { x: 690, y: 270 },

        // Mid-section — clock numeral positions
        { x: 1020, y: 260 }, { x: 1060, y: 250 }, { x: 1100, y: 260 },
        { x: 1200, y: 170 },
        { x: 1360, y: 260 }, { x: 1400, y: 260 },

        // Ground coins — gear teeth pattern
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 340, y: 370 }, { x: 380, y: 370 }, { x: 420, y: 370 },
        { x: 500, y: 370 }, { x: 540, y: 370 }, { x: 580, y: 370 },

        { x: 900, y: 370 }, { x: 940, y: 370 }, { x: 980, y: 370 },
        { x: 1100, y: 370 }, { x: 1140, y: 370 }, { x: 1180, y: 370 },
        { x: 1260, y: 370 }, { x: 1300, y: 370 },

        { x: 1680, y: 370 }, { x: 1720, y: 370 }, { x: 1760, y: 370 },
        { x: 1880, y: 370 }, { x: 1920, y: 370 },

        // Trophy approach
        { x: 2060, y: 360 }, { x: 2110, y: 360 }, { x: 2160, y: 360 }
      ],

      enemiesData: [
        // Faster hedgehog pawns (Tomás style!)
        { x: 320, y: 360, left: 100, right: 520, speed: 100 },
        { x: 600, y: 360, left: 480, right: 650, speed: 90 },
        { x: 1050, y: 360, left: 850, right: 1300, speed: 110 },
        { x: 1420, y: 360, left: 1250, right: 1550, speed: 95 },
        { x: 1850, y: 360, left: 1620, right: 2150, speed: 105 }
      ],

      airEnemiesData: [
        // Flying clock hands
        { x: 480, y: 150, pattern: 'horizontal', minX: 380, maxX: 620, speed: 90 },
        { x: 1100, y: 150, pattern: 'diagonal', minX: 950, maxX: 1250, minY: 100, maxY: 210, speed: 80, speedY: 60 },
        { x: 1800, y: 180, pattern: 'sinusoidal', minX: 1680, maxX: 1950, baseY: 170, ampY: 50, speed: 85 }
      ],

      crownsData: [
        { x: 780, y: 180 },
        { x: 1200, y: 100 },
        { x: 2000, y: 150 }
      ],

      // Goal: Tournament trophy instead of portal
      goal: {
        type: 'trophy',
        trophyX: 2180, trophyY: 270
      },

      // Rotating clockwork gear platforms (unique level 2 mechanic)
      gearData: [
        {
          centerX: 600, centerY: 280,
          radius: 76,
          numTeeth: 8,
          speed: 0.55,
          hazardIndices: [2, 6]
        },
        {
          centerX: 1850, centerY: 280,
          radius: 85,
          numTeeth: 10,
          speed: 0.72,
          hazardIndices: [1, 4, 7]
        }
      ]
    },

    // ================================================================
    // LEVEL 3 — "La Clavada del Alfil Exiliado" — Neon Diagonal
    // ================================================================
    {
      biome: 'neon',
      worldWidth: 2600,
      backgroundColor: '#0a0020',

      platformsData: [
        // Ground — neon-edged platforms
        { x: 0, y: 410, w: 650, h: 40 },
        { x: 800, y: 410, w: 550, h: 40 },
        { x: 1500, y: 410, w: 600, h: 40 },  // extends to boss room
        // Boss room floor — spans to goal
        { x: 2100, y: 410, w: 500, h: 40 },

        // Floating neon platforms — diagonal arrangement
        { x: 200, y: 320, w: 110, h: 18 },
        { x: 440, y: 230, w: 90, h: 18 },
        { x: 640, y: 320, w: 100, h: 18 },
        { x: 880, y: 290, w: 120, h: 18 },
        { x: 1080, y: 220, w: 100, h: 18 },
        { x: 1280, y: 310, w: 110, h: 18 },
        { x: 1450, y: 250, w: 80, h: 18 },
        { x: 1620, y: 310, w: 100, h: 18 },
        { x: 1780, y: 270, w: 80, h: 18 },
        { x: 1920, y: 310, w: 100, h: 18 },
        // Inside boss room — small platforms
        { x: 2150, y: 290, w: 75, h: 18 },
        { x: 2320, y: 300, w: 70, h: 18 },
        { x: 2450, y: 280, w: 80, h: 18 }
      ],

      coinsData: [
        { x: 230, y: 270 }, { x: 260, y: 270 }, { x: 290, y: 270 },
        { x: 500, y: 180 },
        { x: 690, y: 270 }, { x: 720, y: 270 },
        { x: 920, y: 240 }, { x: 950, y: 240 },
        { x: 1120, y: 170 },
        { x: 1320, y: 260 }, { x: 1350, y: 260 },
        { x: 1500, y: 200 },
        { x: 1660, y: 260 }, { x: 1690, y: 260 },
        { x: 1830, y: 220 },
        // Ground coins
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 360, y: 370 }, { x: 400, y: 370 },
        { x: 540, y: 370 }, { x: 580, y: 370 },
        { x: 880, y: 370 }, { x: 920, y: 370 }, { x: 960, y: 370 },
        { x: 1100, y: 370 }, { x: 1140, y: 370 },
        { x: 1280, y: 370 }, { x: 1320, y: 370 },
        { x: 1600, y: 370 }, { x: 1640, y: 370 }, { x: 1680, y: 370 },
        { x: 1800, y: 370 }, { x: 1840, y: 370 },
        // Boss room coins
        { x: 2180, y: 370 }, { x: 2220, y: 370 },
        { x: 2360, y: 370 }, { x: 2400, y: 370 },
        // Goal approach
        { x: 2520, y: 360 }, { x: 2540, y: 360 }
      ],

      enemiesData: [
        { x: 340, y: 360, left: 120, right: 520, speed: 75 },
        { x: 600, y: 360, left: 480, right: 650, speed: 65 },
        { x: 1050, y: 360, left: 840, right: 1300, speed: 85 },
        { x: 1450, y: 360, left: 1320, right: 1600, speed: 70 },
        { x: 1750, y: 360, left: 1620, right: 1920, speed: 80 }
      ],

      airEnemiesData: [
        { x: 460, y: 150, pattern: 'horizontal', minX: 360, maxX: 600, speed: 80 },
        { x: 1100, y: 140, pattern: 'diagonal', minX: 980, maxX: 1280, minY: 100, maxY: 200, speed: 75, speedY: 50 },
        { x: 1650, y: 160, pattern: 'sinusoidal', minX: 1550, maxX: 1780, baseY: 160, ampY: 40, speed: 80 }
      ],

      crownsData: [
        { x: 910, y: 170 },
        { x: 1120, y: 100 },
        { x: 2200, y: 200 }
      ],

      // Pin rays — diagonal hazard beams (stun on contact)
      pinRaysData: [
        { x: 380, y: 80, angle: 45, length: 280, pulseSpeed: 0.03 },
        { x: 700, y: 100, angle: -45, length: 300, pulseSpeed: 0.04 },
        { x: 1200, y: 70, angle: 45, length: 320, pulseSpeed: 0.035 },
        { x: 1600, y: 90, angle: -45, length: 260, pulseSpeed: 0.045 }
      ],

      // Boss: Alfil Exiliado
      bossData: {
        type: 'alfil_exiliado',
        hp: 3,
        roomLeft: 2080,
        roomRight: 2510,
        x: 2300, y: 280,
        speed: 65,
        projectileSpeed: 220,
        projectileInterval: 90  // frames between shots
      },

      // Goal after defeating boss
      goal: {
        type: 'neon_portal',
        portalX: 2550, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 4 — "El Caballo Salvaje" — Prairie / Stable
    // ================================================================
    {
      biome: 'prairie',
      worldWidth: 2400,
      backgroundColor: '#87CEEB',

      platformsData: [
        // Ground — dirt & grass
        { x: 0, y: 410, w: 700, h: 40 },
        { x: 850, y: 410, w: 600, h: 40 },
        { x: 1600, y: 410, w: 500, h: 40 },
        // Chess room floor
        { x: 2150, y: 410, w: 250, h: 40 },

        // Floating wooden platforms — L-shaped knight jump arrangements
        { x: 200, y: 300, w: 100, h: 16 },
        { x: 400, y: 220, w: 90, h: 16 },
        { x: 620, y: 310, w: 100, h: 16 },
        { x: 860, y: 290, w: 110, h: 16 },
        { x: 1050, y: 210, w: 90, h: 16 },
        { x: 1250, y: 300, w: 100, h: 16 },
        { x: 1450, y: 240, w: 80, h: 16 },
        { x: 1650, y: 300, w: 100, h: 16 },
        { x: 1820, y: 250, w: 80, h: 16 },
        { x: 1970, y: 310, w: 100, h: 16 }
      ],

      coinsData: [
        { x: 230, y: 250 }, { x: 260, y: 250 }, { x: 290, y: 250 },
        { x: 450, y: 170 },
        { x: 660, y: 260 }, { x: 690, y: 260 },
        { x: 900, y: 240 }, { x: 930, y: 240 },
        { x: 1090, y: 160 },
        { x: 1290, y: 250 }, { x: 1320, y: 250 },
        { x: 1500, y: 190 },
        { x: 1690, y: 250 }, { x: 1720, y: 250 },
        { x: 1870, y: 200 },
        // Ground coins
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 380, y: 370 }, { x: 420, y: 370 },
        { x: 540, y: 370 }, { x: 580, y: 370 },
        { x: 920, y: 370 }, { x: 960, y: 370 }, { x: 1000, y: 370 },
        { x: 1140, y: 370 }, { x: 1180, y: 370 },
        { x: 1320, y: 370 }, { x: 1360, y: 370 },
        { x: 1680, y: 370 }, { x: 1720, y: 370 }, { x: 1760, y: 370 },
        { x: 1880, y: 370 }, { x: 1920, y: 370 },
        // Chess room approach
        { x: 2200, y: 360 }, { x: 2250, y: 360 }, { x: 2300, y: 360 }
      ],

      enemiesData: [
        { x: 320, y: 360, left: 100, right: 550, speed: 70 },
        { x: 580, y: 360, left: 480, right: 680, speed: 65 },
        { x: 1020, y: 360, left: 880, right: 1280, speed: 75 },
        { x: 1400, y: 360, left: 1280, right: 1580, speed: 70 }
      ],

      airEnemiesData: [
        { x: 450, y: 140, pattern: 'horizontal', minX: 350, maxX: 600, speed: 72 },
        { x: 1150, y: 130, pattern: 'diagonal', minX: 1000, maxX: 1300, minY: 100, maxY: 190, speed: 70, speedY: 50 }
      ],

      crownsData: [
        { x: 500, y: 120 },
        { x: 1100, y: 100 },
        { x: 1700, y: 150 }
      ],

      // Chess duel room instead of boss
      chessRoom: {
        triggerX: 2100,
        roomLeft: 2150,
        roomRight: 2400,
        elo: 300
      },

      // Wild knight L-jump hazards (unique level 4 mechanic)
      knightData: [
        { startX: 350, startY: 280, patrolMinX: 200, patrolMaxX: 650, patrolMinY: 200, patrolMaxY: 370, jumpInterval: 90 },
        { startX: 1200, startY: 300, patrolMinX: 900, patrolMaxX: 1500, patrolMinY: 200, patrolMaxY: 370, jumpInterval: 75 }
      ],

      goal: {
        type: 'chess_victory',
        portalX: 2330, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 5 — "La Coronación de Peoncito" — Castle Runner (visto de atrás)
    // ================================================================
    (() => {
      const obstacles = [];
      const coinsData = [];
      const crownsData = [];
      const maxDistance = 18000;
      
      for (let y = 600; y < maxDistance - 1000; y += 600) {
        const idx = Math.floor(y / 600);
        const lane = idx % 3;
        const type = (idx % 2 === 0) ? 'rock' : 'crystal';
        obstacles.push({ y, lane, type });
        
        const safeLane1 = (lane + 1) % 3;
        const safeLane2 = (lane + 2) % 3;
        const x1 = safeLane1 === 0 ? 260 : (safeLane1 === 2 ? 540 : 400);
        const x2 = safeLane2 === 0 ? 260 : (safeLane2 === 2 ? 540 : 400);
        
        coinsData.push({ x: x1, y: y - 250 });
        coinsData.push({ x: x1, y: y - 200 });
        coinsData.push({ x: x1, y: y - 150 });
        
        coinsData.push({ x: x2, y: y + 150 });
        coinsData.push({ x: x2, y: y + 200 });
        coinsData.push({ x: x2, y: y + 250 });
        
        const crownLane = (lane + 2) % 3;
        const cx = crownLane === 0 ? 260 : (crownLane === 2 ? 540 : 400);
        crownsData.push({ x: cx, y: y + 300 });
      }
      
      // Giant clock obstacle near the end
      obstacles.push({ y: 16800, lane: 1, type: 'giant_clock' });
      
      return {
        biome: 'castle_runner',
        gameMode: 'runner',
        worldWidth: 800,
        worldHeight: 450,
        backgroundColor: '#0d0620',
        runDistance: maxDistance,
        baseScrollSpeed: 1.8,
        lanes: 3,
        pathWidth: 440,
        obstacles,
        coinsData,
        crownsData,
        chasers: [],
        goal: {
          type: 'coronation_portal',
          portalY: maxDistance
        }
      };
    })(),

    // ================================================================
    // LEVEL 6 — "La Jugada Invisible" — Dragon / Sicilian
    // ================================================================
    {
      biome: 'dragon',
      worldWidth: 3900,
      backgroundColor: '#0a0a0a',

      // Dragon ground — segments that oscillate up/down like a serpent
      dragonGround: {
        segments: 24,          // number of ground segments
        segmentW: 150,         // width of each segment
        segmentH: 40,          // height
        baseY: 410,            // center Y of the oscillation
        amplitude: 30,         // how high/low it moves
        frequency: 0.025,      // oscillation speed
        phaseStep: 0.5         // phase offset between adjacent segments
      },

      platformsData: [
        // Floating platforms above the dragon
        { x: 250, y: 290, w: 110, h: 20 },
        { x: 480, y: 210, w: 100, h: 20 },
        { x: 700, y: 300, w: 120, h: 20 },
        { x: 950, y: 190, w: 90, h: 20 },
        { x: 1150, y: 280, w: 110, h: 20 },
        { x: 1400, y: 220, w: 100, h: 20 },
        { x: 1650, y: 310, w: 120, h: 20 },
        { x: 1900, y: 180, w: 90, h: 20 },
        { x: 2100, y: 270, w: 110, h: 20 },
        { x: 2350, y: 200, w: 100, h: 20 },
        { x: 2600, y: 300, w: 120, h: 20 },
        { x: 2850, y: 210, w: 100, h: 20 },
        { x: 3100, y: 280, w: 110, h: 20 },
        { x: 3350, y: 190, w: 90, h: 20 },
        { x: 3600, y: 350, w: 60, h: 60 }
      ],

      coinsData: [
        { x: 280, y: 240 }, { x: 310, y: 235 }, { x: 340, y: 240 },
        { x: 520, y: 160 },
        { x: 740, y: 250 }, { x: 770, y: 250 },
        { x: 980, y: 140 },
        { x: 1180, y: 230 }, { x: 1210, y: 230 },
        { x: 1440, y: 170 },
        { x: 1700, y: 260 }, { x: 1730, y: 260 },
        { x: 1940, y: 130 },
        { x: 2140, y: 220 }, { x: 2170, y: 220 },
        { x: 2400, y: 150 },
        { x: 2650, y: 250 }, { x: 2680, y: 250 },
        { x: 2900, y: 160 },
        { x: 3150, y: 230 }, { x: 3180, y: 230 },
        { x: 3400, y: 140 },
        // Ground coins along dragon path
        { x: 200, y: 370 }, { x: 350, y: 360 }, { x: 500, y: 370 },
        { x: 650, y: 360 }, { x: 800, y: 370 }, { x: 950, y: 360 },
        { x: 1100, y: 370 }, { x: 1250, y: 360 }, { x: 1400, y: 370 },
        { x: 1550, y: 360 }, { x: 1700, y: 370 }, { x: 1850, y: 360 },
        { x: 2000, y: 370 }, { x: 2150, y: 360 }, { x: 2300, y: 370 },
        { x: 2500, y: 360 }, { x: 2650, y: 370 }, { x: 2800, y: 360 },
        { x: 2950, y: 370 }, { x: 3100, y: 360 }, { x: 3250, y: 370 },
        { x: 3400, y: 360 }, { x: 3600, y: 370 },
        { x: 3700, y: 360 }
      ],

      enemiesData: [
        { x: 380, y: 360, left: 180, right: 600, speed: 75 },
        { x: 650, y: 360, left: 500, right: 780, speed: 65 },
        { x: 1000, y: 360, left: 850, right: 1200, speed: 80 },
        { x: 1300, y: 360, left: 1150, right: 1500, speed: 70 },
        { x: 1700, y: 360, left: 1550, right: 1900, speed: 75 },
        { x: 2100, y: 360, left: 1950, right: 2250, speed: 80 },
        { x: 2450, y: 360, left: 2300, right: 2600, speed: 70 },
        { x: 2800, y: 360, left: 2650, right: 2950, speed: 75 },
        { x: 3150, y: 360, left: 3000, right: 3400, speed: 80 }
      ],

      airEnemiesData: [
        { x: 600, y: 130, pattern: 'horizontal', minX: 450, maxX: 750, speed: 70 },
        { x: 1100, y: 120, pattern: 'diagonal', minX: 950, maxX: 1300, minY: 70, maxY: 180, speed: 65, speedY: 45 },
        { x: 1600, y: 140, pattern: 'sinusoidal', minX: 1480, maxX: 1750, baseY: 130, ampY: 40, speed: 70 },
        { x: 2200, y: 110, pattern: 'horizontal', minX: 2050, maxX: 2400, speed: 75 },
        { x: 2700, y: 130, pattern: 'diagonal', minX: 2550, maxX: 2900, minY: 80, maxY: 190, speed: 70, speedY: 50 },
        { x: 3200, y: 120, pattern: 'sinusoidal', minX: 3050, maxX: 3400, baseY: 120, ampY: 50, speed: 80 }
      ],

      crownsData: [
        { x: 520, y: 100 },
        { x: 1180, y: 120 },
        { x: 1940, y: 80 },
        { x: 2650, y: 100 },
        { x: 3400, y: 90 }
      ],

      // Fire pillars erupting from dragon ground
      firePillars: [
        { x: 280, interval: 180, offset: 0 },
        { x: 560, interval: 200, offset: 60 },
        { x: 880, interval: 170, offset: 100 },
        { x: 1200, interval: 190, offset: 30 },
        { x: 1500, interval: 210, offset: 80 },
        { x: 1800, interval: 180, offset: 50 },
        { x: 2100, interval: 200, offset: 120 },
        { x: 2400, interval: 190, offset: 10 },
        { x: 2700, interval: 220, offset: 90 },
        { x: 3000, interval: 180, offset: 40 },
        { x: 3300, interval: 200, offset: 70 }
      ],

      // Dragon head goal at the end
      goal: {
        type: 'portal_queen',
        portalX: 3750, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 7 — "El Pescador y el Elegante" — River / Aquatic Biome
    // ================================================================
    {
      biome: 'river',
      worldWidth: 3500,
      backgroundColor: '#082f49',

      platformsData: [
        // Continuous solid ceiling rock across the entire level width
        { x: 0, y: 0, w: 3500, h: 90 },

        // Ground - bumpy coral reef base with recessed trenches
        { x: 0, y: 410, w: 800, h: 40 },
        { x: 800, y: 430, w: 150, h: 20 }, // Trench 1
        { x: 950, y: 410, w: 900, h: 40 },
        { x: 1850, y: 430, w: 120, h: 20 }, // Trench 2
        { x: 1970, y: 410, w: 1530, h: 40 }, // Ground to end

        // Cavern stalactites (hanging rocks from ceiling y=90, gap >= 120px)
        { x: 400, y: 90, w: 120, h: 120 },
        { x: 1500, y: 90, w: 120, h: 120 },
        { x: 2600, y: 90, w: 120, h: 120 },

        // Standing stalagmites (rising rocks from ground y=410, gap >= 120px)
        { x: 950, y: 260, w: 120, h: 150 },
        { x: 2050, y: 260, w: 120, h: 150 },

        // Floating coral boulders (with safe gaps above and below >= 110px)
        { x: 700, y: 220, w: 80, h: 70 },
        { x: 1250, y: 200, w: 80, h: 80 },
        { x: 1800, y: 220, w: 80, h: 70 },
        { x: 2350, y: 200, w: 80, h: 80 }
      ],

      coinsData: [
        // Curves guiding through open channels
        { x: 200, y: 250 }, { x: 240, y: 250 }, { x: 280, y: 250 },
        { x: 460, y: 330 },
        { x: 710, y: 150 }, { x: 740, y: 140 }, { x: 770, y: 150 },
        { x: 710, y: 350 }, { x: 740, y: 360 }, { x: 770, y: 350 },
        { x: 840, y: 380 }, { x: 875, y: 380 }, { x: 910, y: 380 },
        { x: 1010, y: 170 },
        { x: 1260, y: 140 }, { x: 1290, y: 130 }, { x: 1320, y: 140 },
        { x: 1260, y: 340 }, { x: 1290, y: 350 }, { x: 1320, y: 340 },
        { x: 1560, y: 330 },
        { x: 1810, y: 150 }, { x: 1840, y: 140 },
        { x: 1880, y: 380 }, { x: 1910, y: 380 }, { x: 1940, y: 380 },
        { x: 2110, y: 170 },
        { x: 2360, y: 140 }, { x: 2390, y: 130 }, { x: 2420, y: 140 },
        { x: 2360, y: 340 }, { x: 2390, y: 350 }, { x: 2420, y: 340 },
        { x: 2660, y: 330 },
        { x: 2800, y: 300 }, { x: 2830, y: 300 }, { x: 2860, y: 300 }
      ],

      enemiesData: [
        { x: 320, y: 220, left: 320, right: 320, speed: 40, type: 'medusa' },
        { x: 580, y: 330, left: 540, right: 630, speed: 60, type: 'pez' },
        { x: 875, y: 220, left: 875, right: 875, speed: 50, type: 'medusa' },
        { x: 1120, y: 330, left: 1090, right: 1210, speed: 70, type: 'pez' },
        { x: 1420, y: 200, left: 1420, right: 1420, speed: 55, type: 'medusa' },
        { x: 1680, y: 330, left: 1640, right: 1760, speed: 65, type: 'pez' },
        { x: 1920, y: 220, left: 1920, right: 1920, speed: 50, type: 'medusa' },
        { x: 2220, y: 330, left: 2190, right: 2310, speed: 75, type: 'pez' },
        { x: 2500, y: 200, left: 2500, right: 2500, speed: 45, type: 'medusa' },
        { x: 2780, y: 330, left: 2740, right: 2860, speed: 70, type: 'pez' }
      ],

      airEnemiesData: [
        { x: 700, y: 150, pattern: 'horizontal', minX: 620, maxX: 780, speed: 80 },
        { x: 1300, y: 130, pattern: 'diagonal', minX: 1200, maxX: 1400, minY: 110, maxY: 170, speed: 70, speedY: 40 },
        { x: 2400, y: 140, pattern: 'sinusoidal', minX: 2300, maxX: 2500, baseY: 130, ampY: 35, speed: 80 }
      ],

      crownsData: [
        { x: 1010, y: 150 },
        { x: 875, y: 330 },
        { x: 2110, y: 150 }
      ],

      // Currents data (X, Y, Width, Height, ForceX, ForceY)
      currentsData: [
        { x: 600, y: 100, w: 300, h: 180, forceX: 130, forceY: 0 },
        { x: 1550, y: 120, w: 350, h: 200, forceX: -110, forceY: 0 },
        { x: 2350, y: 100, w: 300, h: 180, forceX: 120, forceY: 0 }
      ],

      // Boss: El Elegante Veriss
      bossData: {
        type: 'elegante_veriss',
        hp: 4,
        roomLeft: 2900,
        roomRight: 3450,
        x: 3150, y: 200,
        speed: 85,
        projectileSpeed: 180,
        projectileInterval: 75
      },

      goal: {
        type: 'portal_queen',
        portalX: 3380, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 8 — "El Relámpago y el Vikingo" — Ocean / Storm Biome
    // ================================================================
    {
      biome: 'ocean',
      worldWidth: 3500,
      backgroundColor: '#0a0f1d',

      platformsData: [
        // Solid rock islands and balanced drakar longships
        { x: 0, y: 410, w: 500, h: 40, type: 'island' },
        { x: 620, y: 340, w: 200, h: 20, type: 'drakar' },
        { x: 940, y: 280, w: 140, h: 20, type: 'island' },
        { x: 1180, y: 350, w: 220, h: 20, type: 'drakar' },
        { x: 1500, y: 220, w: 100, h: 20, type: 'island' },
        { x: 1720, y: 340, w: 200, h: 20, type: 'drakar' },
        { x: 2020, y: 270, w: 120, h: 20, type: 'island' },
        { x: 2240, y: 350, w: 200, h: 20, type: 'drakar' },
        // Large boss arena island
        { x: 2540, y: 410, w: 1000, h: 40, type: 'island' }
      ],

      coinsData: [
        // Guide paths over waves and ships
        { x: 180, y: 350 }, { x: 220, y: 350 }, { x: 260, y: 350 },
        { x: 420, y: 350 },
        { x: 690, y: 270 }, { x: 730, y: 280 },
        { x: 960, y: 220 }, { x: 1000, y: 210 }, { x: 1040, y: 220 },
        { x: 1220, y: 290 }, { x: 1260, y: 280 }, { x: 1300, y: 290 },
        { x: 1520, y: 160 }, { x: 1550, y: 150 },
        { x: 1760, y: 280 }, { x: 1800, y: 270 }, { x: 1840, y: 280 },
        { x: 2040, y: 210 }, { x: 2080, y: 200 },
        { x: 2280, y: 290 }, { x: 2320, y: 280 }, { x: 2360, y: 290 },
        // Boss area coins
        { x: 2620, y: 370 }, { x: 2680, y: 370 }, { x: 2740, y: 370 },
        { x: 2860, y: 370 }, { x: 2920, y: 370 }, { x: 2980, y: 370 }
      ],

      enemiesData: [
        { x: 300, y: 330, left: 240, right: 420, speed: 50, type: 'pez' },
        { x: 960, y: 200, left: 960, right: 960, speed: 45, type: 'medusa' },
        { x: 1520, y: 140, left: 1520, right: 1520, speed: 50, type: 'medusa' },
        { x: 2040, y: 190, left: 2040, right: 2040, speed: 55, type: 'medusa' },
        { x: 2680, y: 370, left: 2580, right: 2780, speed: 70, type: 'pez' },
        { x: 2880, y: 370, left: 2780, right: 2980, speed: 75, type: 'pez' }
      ],

      airEnemiesData: [
        { x: 700, y: 160, pattern: 'horizontal', minX: 620, maxX: 820, speed: 85 },
        { x: 1250, y: 140, pattern: 'diagonal', minX: 1150, maxX: 1350, minY: 100, maxY: 180, speed: 75, speedY: 45 },
        { x: 1800, y: 150, pattern: 'sinusoidal', minX: 1700, maxX: 1900, baseY: 140, ampY: 40, speed: 85 },
        { x: 2300, y: 160, pattern: 'horizontal', minX: 2200, maxX: 2420, speed: 90 }
      ],

      crownsData: [
        { x: 720, y: 220 }, // sitting above the mast of ship 1
        { x: 1550, y: 110 }, // high above floating island 3
        { x: 2320, y: 220 }  // above the mast of ship 4
      ],

      // Chess room setup at the end
      chessRoom: {
        triggerX: 3050,
        roomLeft: 3100,
        roomRight: 3450,
        elo: 700
      },

      goal: {
        type: 'chess_victory',
        portalX: 3380,
        portalY: 245
      }
    }
  ]
};
