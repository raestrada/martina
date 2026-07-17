#!/usr/bin/env node
/**
 * scripts/generate_books.js
 * Automates the generation of PDF and EPUB files for "Martina: Cuentos de Ajedrez para Dormir".
 * Combines 22 stories into structured, publishable formats.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { chromium } = require('playwright');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const CUENTOS_BUILD_DIR = path.join(ROOT_DIR, '_site', 'cuentos');
const OUTPUT_DIR = path.join(ROOT_DIR, 'assets', 'books');
const SITE_OUTPUT_DIR = path.join(ROOT_DIR, '_site', 'assets', 'books');
const QR_DIR = path.join(ROOT_DIR, 'assets', 'img', 'qr');

// Create directories if they do not exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(SITE_OUTPUT_DIR, { recursive: true });
fs.mkdirSync(QR_DIR, { recursive: true });

// Helper to run commands
function runCmd(cmd) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { cwd: ROOT_DIR, stdio: 'inherit' });
}

// Metadata for the divided parts of the book (6 stories per part)
const PARTS_METADATA = [
  {
    num: 1,
    title: 'La Semilla de la Campeona',
    desc: 'Los primeros pasos de Martina en el tablero, descubriendo el poder del centro, el desarrollo y las primeras tácticas.',
    quote: '"La belleza de un movimiento de ajedrez no se mide por su apariencia exterior, sino por el pensamiento que hay detrás de él."',
    author: 'Judit Polgar'
  },
  {
    num: 2,
    title: 'En el Bosque Oscuro',
    desc: 'Martina se adentra en el caos táctico, aprendiendo a calcular bajo presión y a guiar sus piezas en las sombras.',
    quote: '"Tienes que llevar a tu oponente a un bosque oscuro y profundo donde 2+2=5, y el camino de salida sea lo suficientemente estrecho para que solo quepa uno."',
    author: 'Mikhail Tal'
  },
  {
    num: 3,
    title: 'Tácticas y Sacrificios',
    desc: 'La maestría de las clavadas y los puestos avanzados. Martina aprende a entregar material para ganar iniciativa.',
    quote: '"En el ajedrez, el jugador que tiene la iniciativa tiene la obligación de atacar, de lo contrario se arriesga a perderla."',
    author: 'Wilhelm Steinitz'
  },
  {
    num: 4,
    title: 'La Presión del Reloj',
    desc: 'Partidas rápidas, torneos escolares y nacionales. Martina aprende a manejar los nervios, el tiempo y la resiliencia.',
    quote: '"El ajedrez es lucha. El carácter es más importante que el talento."',
    author: 'Garry Kasparov'
  },
  {
    num: 5,
    title: 'La Colección Esquiva',
    desc: 'La búsqueda de las medallas perdidas. Una aventura sobre la honestidad, el juego limpio y el valor de jugar con pasión.',
    quote: '"No importa si ganas o pierdes. Lo importante es jugar con pasión y dar el cien por cien en cada partida."',
    author: 'Judit Polgar'
  }
];

// Helper to download files (for offline QR codes)
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// 1. Build Eleventy site first to ensure HTML files are fresh
console.log('--- Step 1: Building Eleventy Site ---');
runCmd('npm run build');

// 2. Parse all story HTML files
console.log('--- Step 2: Parsing Stories & Downloading QR Codes ---');
const files = fs.readdirSync(CUENTOS_BUILD_DIR)
  .filter(f => f.endsWith('.html') && /^\d+/.test(f))
  .sort();

console.log(`Found ${files.length} story files.`);

const storiesData = [];

(async () => {
  // Download QR code for the homepage
  const homepageQrFilename = 'homepage.png';
  const homepageQrLocalPath = path.join(QR_DIR, homepageQrFilename);
  const homepageQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://martinachess.com';
  if (!fs.existsSync(homepageQrLocalPath)) {
    console.log('Downloading QR code for homepage...');
    try {
      await downloadFile(homepageQrUrl, homepageQrLocalPath);
    } catch (err) {
      console.error('ERROR downloading QR code for homepage:', err.message);
    }
  }

  for (const file of files) {
    const filePath = path.join(CUENTOS_BUILD_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const slug = path.basename(file, '.html');

    // Extract title
    const titleMatch = fileContent.match(/<title>([\s\S]*?)<\/title>/);
    let title = titleMatch ? titleMatch[1] : '';
    title = title.replace(' — Martina · Cuentos de Ajedrez', '').trim();

    // Extract subtitle
    const subtitleMatch = fileContent.match(/<p class="story-subtitle">([\s\S]*?)<\/p>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

    // Extract story number
    const numberMatch = fileContent.match(/<span class="story-number">([\s\S]*?)<\/span>/);
    const numberText = numberMatch ? numberMatch[1].trim() : '';

    // Extract main article content
    const articleMatch = fileContent.match(/<article class="story-body">([\s\S]*?)<\/article>/);
    if (!articleMatch) {
      console.warn(`WARNING: Could not find article in ${file}`);
      continue;
    }

    let body = articleMatch[1];

    // Clean up content:
    // Discard everything before the first actual paragraph of the story to remove duplicate titles and audiobook containers
    const dropcapIndex = body.indexOf('<p class="dropcap">');
    if (dropcapIndex !== -1) {
      body = body.substring(dropcapIndex);
    }
    // Truncate at story footer (share and disqus comments)
    const shareIndex = body.indexOf('<div class="story-share"');
    if (shareIndex !== -1) {
      body = body.substring(0, shareIndex);
    }
    // Replace lazy loading with eager loading for images, so headless browsers load them for printing
    body = body.replace(/loading="lazy"/gi, 'loading="eager"');

    // Download QR Code locally for 100% offline books compilation
    const qrFilename = `${slug}.png`;
    const qrLocalPath = path.join(QR_DIR, qrFilename);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://martinachess.com/cuentos/${slug}.html%23partida-real`;

    if (!fs.existsSync(qrLocalPath)) {
      console.log(`Downloading QR Code for ${slug}...`);
      try {
        await downloadFile(qrUrl, qrLocalPath);
      } catch (err) {
        console.error(`ERROR downloading QR code for ${slug}:`, err.message);
      }
    }

    storiesData.push({
      title,
      subtitle,
      numberText,
      body,
      slug
    });
  }
  // 3. Copy QR codes to _site build folder so local server resolves them
  const qrBuildDir = path.join(ROOT_DIR, '_site', 'assets', 'img', 'qr');
  fs.mkdirSync(qrBuildDir, { recursive: true });
  fs.readdirSync(QR_DIR).forEach(f => {
    fs.copyFileSync(path.join(QR_DIR, f), path.join(qrBuildDir, f));
  });

  // 4. Start static server to serve files from _site/
  console.log('--- Step 3: Starting Local Static Server ---');
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif'
  };

  const server = http.createServer((req, res) => {
    let decodedUrl = req.url;
    try {
      decodedUrl = decodeURIComponent(req.url);
    } catch (e) {
      console.error('Error decoding URL:', e);
    }
    const safeUrl = path.normalize(decodedUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(ROOT_DIR, '_site', safeUrl);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    console.log(`Server Request: ${req.url} -> ${filePath}`);

    const ext = path.extname(filePath).toLowerCase();
    const readWithRetry = (attemptsLeft) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          if ((err.code === 'EACCES' || err.code === 'EPERM' || err.code === 'EBUSY') && attemptsLeft > 0) {
            console.warn(`  WARNING: Lock error ${err.code} reading ${filePath}. Retrying in 100ms... (${attemptsLeft} attempts left)`);
            setTimeout(() => readWithRetry(attemptsLeft - 1), 100);
            return;
          }
          console.error(`  ERROR reading file ${filePath}:`, err.message);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
        
        if (data.length === 0 && attemptsLeft > 0) {
          console.warn(`  WARNING: Read 0 bytes for ${filePath}. Retrying in 100ms... (${attemptsLeft} attempts left)`);
          setTimeout(() => readWithRetry(attemptsLeft - 1), 100);
          return;
        }

        console.log(`  Served: ${filePath} (${data.length} bytes, Content-Type: ${mimeTypes[ext] || 'application/octet-stream'})`);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      });
    };
    
    readWithRetry(5);
  });

  const { server: serverInstance, port } = await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const p = server.address().port;
      console.log(`Temporary server started on http://127.0.0.1:${p}`);
      resolve({ server, port: p });
    });
  });

  try {
    const storiesPerPart = 6;
    const numParts = Math.ceil(storiesData.length / storiesPerPart);
    
    // Clean up old complete book files if they exist
    const oldPdf = path.join(OUTPUT_DIR, 'martina_cuentos.pdf');
    const oldEpub = path.join(OUTPUT_DIR, 'martina_cuentos.epub');
    if (fs.existsSync(oldPdf)) fs.unlinkSync(oldPdf);
    if (fs.existsSync(oldEpub)) fs.unlinkSync(oldEpub);
    
    const oldSitePdf = path.join(SITE_OUTPUT_DIR, 'martina_cuentos.pdf');
    const oldSiteEpub = path.join(SITE_OUTPUT_DIR, 'martina_cuentos.epub');
    if (fs.existsSync(oldSitePdf)) fs.unlinkSync(oldSitePdf);
    if (fs.existsSync(oldSiteEpub)) fs.unlinkSync(oldSiteEpub);

    for (let pIdx = 0; pIdx < numParts; pIdx++) {
      console.log(`\n=================== COMPILING PART ${pIdx + 1} ===================`);
      await runPDFAndCover(port, pIdx);
      await runEPUB(pIdx);
    }
    console.log('\n--- All Books Generated Successfully! ---');
  } catch (error) {
    console.error('Error during book generation:', error);
    process.exitCode = 1;
  } finally {
    console.log('Shutting down local server...');
    serverInstance.close();
  }
})();

async function runPDFAndCover(port, partIdx) {
  console.log(`--- Generating PDF & Cover Image for Part ${partIdx + 1} ---`);
  
  const storiesPerPart = 6;
  const partStories = storiesData.slice(partIdx * storiesPerPart, (partIdx + 1) * storiesPerPart);
  const partMeta = PARTS_METADATA[partIdx];
  const isPartIncomplete = partStories.length < storiesPerPart;

  let pdfStoriesHtml = '';
  let pdfTocHtml = '';

  partStories.forEach((s, idx) => {
    pdfTocHtml += `
      <li class="pdf-toc-item">
        <span class="pdf-toc-item-title">${s.numberText}. ${s.title}</span>
        <span class="pdf-toc-item-dots"></span>
        <span class="pdf-toc-item-page" id="toc-page-${idx}">--</span>
      </li>
    `;

    // Process game replayer to static box with local QR code
    const pdfGameBox = `
      <div class="pdf-game-interactive-box">
        <img src="/assets/img/qr/${s.slug}.png" class="pdf-qr-code" alt="Código QR de Lichess">
        <div class="pdf-interactive-text">
          <p class="pdf-interactive-instruction">♟️ ¡Juega la partida en tu pantalla!</p>
          <p class="pdf-interactive-desc">Escanea este código QR con tu móvil o haz clic en el enlace para abrir el tablero interactivo en martinachess.com y reproducir cada jugada.</p>
          <a href="https://martinachess.com/cuentos/${s.slug}.html#partida-real" class="pdf-interactive-link">https://martinachess.com/cuentos/${s.slug}.html#partida-real</a>
        </div>
      </div>
    `;

    let cleanBody = s.body.replace(/<div class="chess-replayer-container"[\s\S]*?<\/div>/gi, pdfGameBox);

    // Build chapter HTML
    pdfStoriesHtml += `
      <section id="chapter-${idx}" class="pdf-chapter">
        <header class="pdf-story-header">
          <span class="pdf-story-number">${s.numberText}</span>
          <h1 class="pdf-story-title">${s.title}</h1>
          <p class="pdf-story-subtitle">${s.subtitle}</p>
        </header>
        <div class="pdf-story-content">
          ${cleanBody}
        </div>
      </section>
    `;
  });

  const pdfFullHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Martina: Cuentos de Ajedrez - Parte ${partMeta.num}</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/pdf-book.css">
</head>
<body>

  <!-- Portada Temática -->
  <section class="pdf-cover pdf-part-cover-${partMeta.num}">
    <div class="pdf-cover-header" style="margin-top: 1rem;">
      <span class="pdf-part-cover-meta" style="font-size: 13pt; letter-spacing: 2px;">Parte ${partMeta.num}</span>
      <h1 class="pdf-cover-title" style="margin-top: 0.5rem; line-height: 1.2; font-size: 30pt;">Martina<br>y los Cuentos de Ajedrez</h1>
      <p class="pdf-cover-subtitle" style="margin-top: 0.5rem; font-size: 13pt; font-weight: bold; opacity: 0.95;">${partMeta.title}</p>
    </div>
    ${isPartIncomplete ? `
      <div class="pdf-part-incomplete-badge" style="margin: 0.5rem auto; padding: 0.8rem; background-color: rgba(231, 111, 81, 0.25); border: 2px dashed #e76f51;">
        <span style="font-size: 11pt; color: #fff;">⚠️ PARTE EN DESARROLLO</span>
        <p style="font-size: 8.5pt; color: #fff; margin-top: 0.2rem;">Esta sección contiene ${partStories.length} de los 6 cuentos planeados.</p>
      </div>
    ` : ''}
    <div class="pdf-cover-image-wrapper" style="margin: 1rem 0;">
      <img src="/assets/img/cover_parte_${partMeta.num}.png" class="pdf-cover-image" alt="Portada de la Parte ${partMeta.num}" style="max-height: 380px;">
    </div>
    <div class="pdf-cover-footer" style="margin-bottom: 1rem;">
      <p class="pdf-cover-author" style="margin: 0; font-weight: bold; font-size: 14pt;">Rodrigo Estrada</p>
      <p class="pdf-cover-tagline" style="margin: 0.2rem 0 0 0; font-size: 9.5pt; opacity: 0.85;">Cuentos de Ajedrez para Dormir</p>
    </div>
  </section>

  <!-- Página de Licencia -->
  <section class="pdf-license-page">
    <h2 class="pdf-license-title">Créditos y Licencia</h2>
    <div class="pdf-license-content">
      <p><strong>Martina: Cuentos de Ajedrez para Dormir — Parte ${partMeta.num}: ${partMeta.title}</strong></p>
      <p><strong>Escrito por:</strong> Rodrigo Estrada (Papá de Martina)</p>
      <p><strong>Ilustraciones:</strong> Generadas con Inteligencia Artificial y editadas por el autor.</p>
      <p><strong>Sitio Web Oficial:</strong> <a href="https://martinachess.com">https://martinachess.com</a></p>
      <p><strong>Código Fuente:</strong> <a href="https://github.com/raestrada/martina">https://github.com/raestrada/martina</a></p>
      
      <p>Este libro recopila los cuentos de la <strong>Parte ${partMeta.num}</strong> publicados originalmente en formato digital en el sitio web oficial de Martina. Cada historia está diseñada para enseñar conceptos reales y prácticos de ajedrez (tácticas, finales, aperturas, resiliencia y mentalidad deportiva) a través de aventuras surrealistas y humor absurdo adecuado para niños.</p>
      
      <div class="pdf-license-cc-box">
        <p><strong>Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)</strong></p>
        <p>Usted es libre de compartir (copiar y redistribuir el material en cualquier medio o formato) y adaptar (remezclar, transformar y construir a partir del material) bajo las siguientes condiciones:</p>
        <ul>
          <li><strong>Atribución (BY):</strong> Debe otorgar el crédito correspondiente de manera adecuada, proporcionar un enlace a la licencia e indicar si se realizaron cambios.</li>
          <li><strong>No Comercial (NC):</strong> No puede utilizar este material con fines comerciales.</li>
          <li><strong>Compartir Igual (SA):</strong> Si remezcla, transforma o crea a partir del material, debe distribuir sus contribuciones bajo la misma licencia que el original.</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Tabla de Contenidos -->
  <section class="pdf-toc-page">
    <h2 class="pdf-toc-title">Índice</h2>
    <ul class="pdf-toc-list">
      ${pdfTocHtml}
    </ul>
  </section>

  <!-- Cuentos -->
  ${pdfStoriesHtml}

  <!-- Anexo: Glosario de Conceptos -->
  <section class="pdf-intro-page pdf-annex-page" style="page-break-before: always;">
    <h2 class="pdf-intro-title">Anexo: Glosario de Conceptos</h2>
    <div style="max-width: 650px; margin: 0 auto; font-size: 10.5pt; line-height: 1.6; color: #2b2d42;">
      <p>En este libro, Martina ha explorado conceptos reales de la teoría y la práctica del ajedrez. Aquí tienes un resumen de las lecciones clave:</p>
      
      <div style="margin-top: 1.5rem;">
        <h4 style="color: var(--pdf-blue); margin-bottom: 0.3rem;">♟️ El Centro y el Desarrollo</h4>
        <p>Controlar las cuatro casillas centrales (d4, e4, d5, e5) es vital. Desarrollar las piezas menores (caballos y alfiles) temprano y asegurar el rey mediante el enroque son los primeros pasos de cualquier campeón en la apertura.</p>
      </div>
      
      <div style="margin-top: 1.2rem;">
        <h4 style="color: var(--pdf-blue); margin-bottom: 0.3rem;">♟️ La Clavada (Pin)</h4>
        <p>Una táctica donde una pieza atacada no puede moverse porque expondría a una pieza más valiosa (como el rey o la dama) detrás de ella. Es la táctica favorita de Martina y la estudia de forma continua.</p>
      </div>

      <div style="margin-top: 1.2rem;">
        <h4 style="color: var(--pdf-blue); margin-bottom: 0.3rem;">♟️ El Zugzwang</h4>
        <p>Una situación en la que cualquier movimiento que haga un jugador empeorará su posición. En ajedrez, a veces tener la obligación de mover es una desventaja fatal.</p>
      </div>

      <div style="margin-top: 1.2rem;">
        <h4 style="color: var(--pdf-blue); margin-bottom: 0.3rem;">♟️ El Sacrificio e Iniciativa</h4>
        <p>Entregar material (como un alfil o una dama) para abrir líneas de ataque y ganar la iniciativa, obligando al oponente a defenderse en lugar de atacar, al estilo de Mikhail Tal.</p>
      </div>

      <div style="margin-top: 1.2rem;">
        <h4 style="color: var(--pdf-blue); margin-bottom: 0.3rem;">♟️ La Oposición y Regla del Cuadrado</h4>
        <p>Conceptos fundamentales de finales de peones. La oposición permite al rey ganar espacio y bloquear al rey rival, y la regla del cuadrado calcula si un rey puede interceptar a un peón pasado en carrera.</p>
      </div>
    </div>
  </section>

  <!-- Contraportada Temática -->
  <section class="pdf-back-cover pdf-part-back-cover-${partMeta.num}">
    <div style="margin-top: 1rem;">
      <h2 style="font-family: 'Nunito', sans-serif; font-size: 22pt; text-transform: uppercase; margin: 0;">Martina</h2>
      <p style="font-size: 11pt; letter-spacing: 2px; margin: 0.2rem 0 0 0;">Y LOS CUENTOS DE AJEDREZ</p>
      <p style="font-size: 9.5pt; font-weight: bold; margin-top: 0.2rem;">Parte ${partMeta.num}: ${partMeta.title}</p>
    </div>
    
    <div style="max-width: 520px; margin: 1.5rem auto; font-size: 10.5pt; line-height: 1.7; text-align: justify; border: 2px solid var(--pdf-gold, #f4a261); padding: 1.5rem; border-radius: var(--pdf-radius); background-color: rgba(255, 255, 255, 0.95); color: #2b2d42;">
      <p style="margin-bottom: 0.8rem; margin-top: 0;">Este libro es una puerta mágica al tablero de las sesenta y cuatro casillas. A través de aventuras absurdas y personajes entrañables, la teoría real del ajedrez cobra vida para los más pequeños.</p>
      <p style="margin-bottom: 0;">En esta parte, Martina explora <strong>${partMeta.title}</strong> a lo largo de ${partStories.length} cuentos llenos de creatividad, humor y aprendizaje.</p>
    </div>

    <div class="pdf-part-back-quote" style="font-size: 11.5pt; max-width: 520px; margin-bottom: 1rem; line-height: 1.6;">
      ${partMeta.quote}
    </div>
    <div class="pdf-part-back-author" style="font-size: 9.5pt; margin-bottom: 1rem;">
      — ${partMeta.author}
    </div>
    
    <div style="margin-bottom: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <img src="/assets/img/qr/homepage.png" style="width: 70px; height: 70px; border: 1px solid var(--pdf-board-light); border-radius: 6px;" alt="QR Sitio Web">
      <a href="https://martinachess.com" style="font-family: monospace; font-size: 9pt; font-weight: bold; text-decoration: none; color: inherit;">https://martinachess.com</a>
    </div>
  </section>

</body>
</html>
  `;

  const pdfHtmlPath = path.join(ROOT_DIR, '_site', `book_pdf_part_${partMeta.num}.html`);
  fs.writeFileSync(pdfHtmlPath, pdfFullHtml, 'utf8');

  // Launch Playwright Chromium
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`PAGE LOG [${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('PAGE EXCEPTION:', err));
  page.on('requestfailed', request => {
    console.error(`PAGE REQUEST FAILED: ${request.url()} - Error: ${request.failure()?.errorText}`);
  });

  await page.setViewportSize({ width: 816, height: 1056 });
  await page.emulateMedia({ media: 'print' });

  console.log(`Loading http://localhost:${port}/book_pdf_part_${partMeta.num}.html...`);
  await page.goto(`http://localhost:${port}/book_pdf_part_${partMeta.num}.html`, { waitUntil: 'networkidle' });

  // Take screenshot of cover for EPUB cover image
  console.log(`Capturing cover screenshot for EPUB Part ${partMeta.num}...`);
  const coverElement = await page.$('.pdf-cover');
  if (coverElement) {
    const epubCoverPath = path.join(ROOT_DIR, 'assets', 'img', `cover_epub_parte_${partMeta.num}.png`);
    await coverElement.screenshot({ path: epubCoverPath });
    fs.mkdirSync(path.join(ROOT_DIR, '_site', 'assets', 'img'), { recursive: true });
    fs.copyFileSync(epubCoverPath, path.join(ROOT_DIR, '_site', 'assets', 'img', `cover_epub_parte_${partMeta.num}.png`));
    console.log(`Cover screenshot saved to ${epubCoverPath}`);
  }

  // Calculate pages for Table of Contents
  console.log('Calculating page numbers for chapters...');
  const pageNumbers = await page.evaluate(() => {
    const chapters = Array.from(document.querySelectorAll('.pdf-chapter'));
    const pageHeight = 1056; 
    return chapters.map((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return Math.round(top / pageHeight) + 1;
    });
  });

  console.log('Page numbers calculated:', pageNumbers);

  // Update TOC in DOM with calculated page numbers
  await page.evaluate((pages) => {
    pages.forEach((pageNo, idx) => {
      const pageEl = document.getElementById(`toc-page-${idx}`);
      if (pageEl) {
        pageEl.textContent = pageNo;
      }
    });
  }, pageNumbers);

  // Print to PDF
  console.log('Printing to PDF...');
  const pdfPath = path.join(OUTPUT_DIR, `martina_cuentos_parte_${partMeta.num}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size: 8.5pt; font-family: 'Quicksand', sans-serif; color: #8d99ae; width: 100%; text-align: center; border-bottom: 1px solid #e0e1dd; padding-bottom: 4px; margin: 0 20mm;"><span class="title"></span></div>`,
    footerTemplate: `<div style="font-size: 8.5pt; font-family: 'Quicksand', sans-serif; color: #8d99ae; width: 100%; text-align: center; padding-top: 4px; margin: 0 20mm;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`
  });

  // Copy PDF to public build dir
  fs.copyFileSync(pdfPath, path.join(SITE_OUTPUT_DIR, `martina_cuentos_parte_${partMeta.num}.pdf`));

  console.log(`PDF successfully generated at ${pdfPath}`);
  await browser.close();
}

async function runEPUB(partIdx) {
  console.log(`--- Generating EPUB for Part ${partIdx + 1} ---`);

  const storiesPerPart = 6;
  const partStories = storiesData.slice(partIdx * storiesPerPart, (partIdx + 1) * storiesPerPart);
  const partMeta = PARTS_METADATA[partIdx];
  const isPartIncomplete = partStories.length < storiesPerPart;

  let epubStoriesHtml = '';

  partStories.forEach((s) => {
    // Process game replayer to static box with local QR code for EPUB
    const epubGameBox = `
      <div class="epub-game-interactive-box">
        <p class="epub-interactive-instruction">♟️ ¡Juega la partida interactiva!</p>
        <p class="epub-interactive-desc">Haz clic en el enlace a continuación para abrir el tablero interactivo y reproducir cada jugada, o escanea el código QR:</p>
        <p style="text-align: center;"><a href="https://martinachess.com/cuentos/${s.slug}.html#partida-real" class="epub-interactive-link">Jugar partida en martinachess.com</a></p>
        <img src="assets/img/qr/${s.slug}.png" class="epub-qr-code" alt="Código QR para el tablero de ajedrez">
      </div>
    `;

    // EPUB images must resolve relative to repository root (assets/img/...)
    let cleanBody = s.body.replace(/<div class="chess-replayer-container"[\s\S]*?<\/div>/gi, epubGameBox);
    // Replace "/assets/img/" with "assets/img/"
    cleanBody = cleanBody.replace(/src="\/assets\/img\//g, 'src="assets/img/');

    epubStoriesHtml += `
      <section class="epub-chapter">
        <header class="epub-story-header">
          <span class="epub-story-number">${s.numberText}</span>
          <h1 class="epub-story-title">${s.title}</h1>
          <p class="epub-story-subtitle">${s.subtitle}</p>
        </header>
        <div class="epub-story-content">
          ${cleanBody}
        </div>
      </section>
    `;
  });

  const epubFullHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Martina: Cuentos de Ajedrez - Parte ${partMeta.num}</title>
</head>
<body>

  <!-- Página de Créditos -->
  <section class="epub-credits-page">
    <h1 class="epub-credits-title">Créditos y Licencia</h1>
    <div class="epub-credits-content">
      <p><strong>Martina: Cuentos de Ajedrez para Dormir — Parte ${partMeta.num}: ${partMeta.title}</strong></p>
      <p><strong>Escrito por:</strong> Rodrigo Estrada (Papá de Martina)</p>
      <p><strong>Ilustraciones:</strong> Generadas con Inteligencia Artificial y editadas por el autor.</p>
      <p><strong>Sitio Web Oficial:</strong> <a href="https://martinachess.com">https://martinachess.com</a></p>
      <p><strong>Código Fuente:</strong> <a href="https://github.com/raestrada/martina">https://github.com/raestrada/martina</a></p>
      
      <p>Este libro recopila los cuentos de la <strong>Parte ${partMeta.num}</strong> publicados originalmente en formato digital en el sitio web oficial de Martina. Cada historia está diseñada para enseñar conceptos reales y prácticos de ajedrez (tácticas, finales, aperturas, resiliencia y mentalidad deportiva) a través de aventuras surrealistas y humor absurdo adecuado para niños.</p>
      
      <div class="epub-credits-cc-box">
        <p><strong>Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)</strong></p>
        <p>Usted es libre de compartir (copiar y redistribuir el material en cualquier medio o formato) y adaptar (remezclar, transformar y construir a partir del material) bajo las siguientes condiciones:</p>
        <ul>
          <li><strong>Atribución (BY):</strong> Debe otorgar el crédito correspondiente de manera adecuada, proporcionar un enlace a la licencia e indicar si se realizaron cambios.</li>
          <li><strong>No Comercial (NC):</strong> No puede utilizar este material con fines comerciales.</li>
          <li><strong>Compartir Igual (SA):</strong> Si remezcla, transforma o crea a partir del material, debe distribuir sus contribuciones bajo la misma licencia que el original.</li>
        </ul>
      </div>
    </div>
    <div style="text-align: center; font-size: 0.9em; color: #666; margin-top: 1.5em;">
      Publicado en Santiago de Chile, 2026.
    </div>
  </section>

  <!-- Prólogo / Introducción -->
  <section class="epub-intro-page">
    <h1>Prólogo</h1>
    <div class="epub-intro-content">
      <p>Querido lector o lectora,</p>
      <p>Este libro nació al borde de la cama, en ese momento del día en que el mundo real empieza a apagarse y la imaginación se enciende. Es el resultado de noches de lecturas compartidas con Martina, mi hija de 9 años, una apasionada jugadora de ajedrez que prefiere el caos creativo del ataque a la aburrida seguridad de las tablas.</p>
      <p>Cada una de estas historias combina aventuras en un tablero de ajedrez infinito con enseñanzas de juego real: desde la histórica Apertura Italiana hasta finales tácticos complejos, pasando por el manejo de la frustración y el respeto hacia los rivales. Aquí conviven peones con bigotes falsos que buscan respeto, reinas alérgicas al jaque mate, y caballos lesionados en su orgullo por saltar en formas inesperadas.</p>
      <p>Ya sea que leas estas páginas para dormir o para inspirar tu próximo torneo, recuerda las palabras de Mikhail Tal: <em>"Tienes que llevar a tu oponente a un bosque oscuro y profundo donde 2+2=5, y el camino de salida sea lo suficientemente estrecho para que solo quepa uno."</em></p>
      <p style="text-align: right; margin-top: 1.5em; font-weight: bold;">— Rodrigo Estrada (Papá de Martina)</p>
    </div>
  </section>

  <!-- Separador de Parte en EPUB -->
  <section class="epub-part-separator">
    <h2>Parte ${partMeta.num}</h2>
    <h1>${partMeta.title}</h1>
    <p>${partMeta.desc}</p>
    ${isPartIncomplete ? `
      <div class="epub-part-incomplete-badge">
        <span>⚠️ PARTE EN DESARROLLO</span>
        <p>Esta sección contiene ${partStories.length} de los 6 cuentos planeados.</p>
      </div>
    ` : ''}
    <div class="epub-part-back-quote-box">
      <p>${partMeta.quote}</p>
      <p style="text-align: right; font-weight: bold; margin-top: 1.5em;">— ${partMeta.author}</p>
    </div>
  </section>

  <!-- Cuentos -->
  ${epubStoriesHtml}

  <!-- Anexo: Glosario de Conceptos -->
  <section class="epub-chapter">
    <h1>Anexo: Glosario de Conceptos</h1>
    <div class="epub-intro-content">
      <p>En este libro, Martina ha explorado conceptos reales de la teoría y la práctica del ajedrez. Aquí tienes un resumen de las lecciones clave:</p>
      
      <div style="margin-top: 1.5em;">
        <h3>♟️ El Centro y el Desarrollo</h3>
        <p>Controlar las cuatro casillas centrales (d4, e4, d5, e5) es vital. Desarrollar las piezas menores (caballos y alfiles) temprano y asegurar el rey mediante el enroque son los primeros pasos de cualquier campeón en la apertura.</p>
      </div>
      
      <div style="margin-top: 1.2em;">
        <h3>♟️ La Clavada (Pin)</h3>
        <p>Una táctica donde una pieza atacada no puede moverse porque expondría a una pieza más valiosa (como el rey o la dama) detrás de ella. Es la táctica favorita de Martina y la estudia de forma continua.</p>
      </div>

      <div style="margin-top: 1.2em;">
        <h3>♟️ El Zugzwang</h3>
        <p>Una situación en la que cualquier movimiento que haga un jugador empeorará su posición. En ajedrez, a veces tener la obligación de mover es una desventaja fatal.</p>
      </div>

      <div style="margin-top: 1.2em;">
        <h3>♟️ El Sacrificio e Iniciativa</h3>
        <p>Entregar material (como un alfil o una dama) para abrir líneas de ataque y ganar la iniciativa, obligando al oponente a defenderse en lugar de atacar, al estilo de Mikhail Tal.</p>
      </div>

      <div style="margin-top: 1.2em;">
        <h3>♟️ La Oposición y Regla del Cuadrado</h3>
        <p>Conceptos fundamentales de finales de peones. La oposición permite al rey ganar espacio y bloquear al rey rival, y la regla del cuadrado calcula si un rey puede interceptar a un peón pasado en carrera.</p>
      </div>
    </div>
  </section>

</body>
</html>
  `;

  const epubHtmlPath = path.join(ROOT_DIR, '_site', `book_epub_part_${partMeta.num}.html`);
  fs.writeFileSync(epubHtmlPath, epubFullHtml, 'utf8');

  console.log('Running Pandoc to compile EPUB...');
  const epubPath = path.join(OUTPUT_DIR, `martina_cuentos_parte_${partMeta.num}.epub`);
  const epubCoverFilename = `cover_epub_parte_${partMeta.num}.png`;
  const epubCoverLocalPath = path.join(ROOT_DIR, 'assets', 'img', epubCoverFilename);

  runCmd(`pandoc _site/book_epub_part_${partMeta.num}.html -o "${epubPath}" --css="css/epub-book.css" --epub-cover-image="${epubCoverLocalPath}" --metadata title="Martina: Cuentos de Ajedrez - Parte ${partMeta.num}" --metadata author="Rodrigo Estrada" --metadata language="es" --toc`);

  // Copy EPUB to public build dir
  fs.copyFileSync(epubPath, path.join(SITE_OUTPUT_DIR, `martina_cuentos_parte_${partMeta.num}.epub`));

  console.log(`EPUB successfully generated at ${epubPath}`);
}
