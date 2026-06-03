const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let consoleErrors = [];

  // Listen to console messages, ignore Disqus CORS block errors as they are external network calls
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('disqus') && !txt.includes('CORS') && !txt.includes('Failed to load resource')) {
        console.error('Browser console error:', txt);
        consoleErrors.push(txt);
      }
    } else {
      console.log('Browser console:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.error('Unhandled page exception:', err.message);
    consoleErrors.push(err.message);
  });

  try {
    // Inject localStorage script to unlock all levels
    await page.addInitScript(() => {
      localStorage.setItem('martina_mario_unlocked', JSON.stringify([
        true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
      ]));
    });

    console.log('Navigating to http://localhost:8080/juegos.html...');
    await page.goto('http://localhost:8080/juegos.html', { waitUntil: 'networkidle' });

    console.log('Page loaded. Clicking "¡Iniciar Aventura!"...');
    const startAdventureBtn = page.locator('.game-card[data-game="mario"] .btn-start-game');
    await startAdventureBtn.click();

    console.log('Game modal opened. Waiting for levels grid...');
    await page.waitForSelector('.mario-stage-node', { timeout: 5000 });

    console.log('Finding Level 8 node...');
    const level8Node = page.locator('.mario-stage-node[data-level="7"]');
    
    // Check elements
    const name = await level8Node.locator('.mario-node-name').innerText();
    const desc = await level8Node.locator('.mario-node-desc').innerText();
    const status = await level8Node.locator('.mario-node-status').innerText();
    
    console.log('Level 8 found!');
    console.log('Name:', name);
    console.log('Description:', desc);
    console.log('Status:', status);

    if (name !== 'El Relámpago y el Vikingo') {
      throw new Error(`Expected Level 8 name "El Relámpago y el Vikingo", got "${name}"`);
    }

    console.log('Clicking on Level 8 node to start game...');
    await level8Node.click();

    console.log('Waiting for Phaser canvas to be initialized...');
    await page.waitForSelector('canvas', { timeout: 5000 });
    console.log('Phaser canvas successfully rendered!');

    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(', ')}`);
    }

    console.log('Test passed successfully!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    await browser.close();
    process.exit(1);
  }
})();
