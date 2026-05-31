// Martina PWA — Service Worker v5
// Network-first strategy. Cache is offline fallback only.
// 3-tier caching: shell (auto) + images (auto) + videos (on-demand)
const VERSION = '5';
const CACHE_SHELL = `martina-shell-v${VERSION}`;
const CACHE_IMAGES = `martina-images-v${VERSION}`;
const CACHE_VIDEOS = `martina-videos-v${VERSION}`;

const CUENTOS = [
  '01-el-primer-movimiento',
  '02-tic-tac-jaque-mate',
  '03-la-clavada-del-alfil-exiliado',
  '04-el-caballo-salvaje',
  '05-la-coronacion-de-peoncito',
  '06-la-jugada-invisible',
  '07-el-pescador-y-el-elegante',
  '08-el-relampago-y-el-vikingo',
  '09-la-sombra-que-jugaba',
  '10-lo-que-no-se-ve-en-el-tablero',
  '11-la-ultima-grieta',
  '12-el-peon-que-bailaba',
  '13-lo-que-estaba-escrito',
  '14-hielo-que-quema',
  '15-el-ultimo-capitulo',
  '16-fuego-contra-todos',
];

const SHELL_URLS = [
  '/',
  '/index.html',
  '/juegos.html',
  '/album.html',
  '/galeria.html',
  '/acerca-de.html',
  '/difundir.html',
  ...CUENTOS.map(c => `/cuentos/${c}.html`),
  '/css/style.css',
  '/css/games.css',
  '/css/album.css',
  '/css/offline.css',
  '/js/main.js',
  '/js/offline.js',
  '/js/games-hub.js',
  '/js/album.js',
  '/js/gallery.js',
  '/manifest.json',
];

const GAME_JS_URLS = [
  '/js/games/assets_b64.js',
  '/js/games/caballo.js',
  '/js/games/chessbox.js',
  '/js/games/mario-chess.js',
  '/js/games/mario-data.js',
  '/js/games/mario.js',
  '/js/games/reina.js',
  '/js/games/sombra.js',
  '/js/games/torreta.js',
];

const IMAGE_URLS = [
  '/assets/img/alfil_exiliado_1778944848314.png',
  '/assets/img/aplauso_spassky_magico_1779111811723.png',
  '/assets/img/bosque_oscuro_ataque_1779035345118.png',
  '/assets/img/caballo_invencible_1778968679199.png',
  '/assets/img/caballo_l_equivocado_1779239565440.png',
  '/assets/img/caballo_recien_nacido_1779034486090.png',
  '/assets/img/chessboxing_card_thumb.png',
  '/assets/img/club_clavada_fiesta_1778945037841.png',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png',
  '/assets/img/inmortal_mate_martina_1779113017632.png',
  '/assets/img/juego_caballo_l_1779376737849.png',
  '/assets/img/juego_torreta_empanadas_1779376721444.png',
  '/assets/img/juegos_banner_principal_1779376644977.png',
  '/assets/img/kiosquera_torreta_1778905896331.png',
  '/assets/img/martina_estudio_empanada_1779113500853.png',
  '/assets/img/martina_full_body_1778904544807.png',
  '/assets/img/martina_ines_torneo_1779139889385.png',
  '/assets/img/martina_instinto_ajedrez_1779112535041.png',
  '/assets/img/martina_pablo_tramposo_1779113476167.png',
  '/assets/img/martina_peoncito_estudio_1779035328084.png',
  '/assets/img/martina_profile_1778904530237.png',
  '/assets/img/martina_reloj_noche_1779250555984.png',
  '/assets/img/martina_sombra_1779407700308.png',
  '/assets/img/martina_sombra_1779972341205.png',
  '/assets/img/martina_sombra_split_1780000000000.png',
  '/assets/img/martina_torre_sacrificio_1778945022044.png',
  '/assets/img/martina_torre_sacrificio_v2_1778945194932.png',
  '/assets/img/martina_vs_equis_1778968666455.png',
  '/assets/img/martina_vs_leon_1780000000000.png',
  '/assets/img/martina_vs_leon_victory_1780000000000.png',
  '/assets/img/mate_de_boden_1779250613804.png',
  '/assets/img/mundo_magico_1778904597376.png',
  '/assets/img/peon_bailarin_magico_1779139907666.png',
  '/assets/img/peoncito_1778904557723.png',
  '/assets/img/peoncito_e4_1779250596021.png',
  '/assets/img/peoncito_octava_fila_1779034473779.png',
  '/assets/img/pescador_sereno_tablero_1779111796668.png',
  '/assets/img/puente_rio_central_1779239550750.png',
  '/assets/img/reina_estornudo_1779239591968.png',
  '/assets/img/reina_negra_1778904582825.png',
  '/assets/img/relampago_vikingo_blitz_1779112516290.png',
  '/assets/img/rey_blanco_entrenamiento_1779139099201.png',
  '/assets/img/rey_blanco_sombra_amigos_1779139119914.png',
  '/assets/img/sacrificio_greco_1779239578282.png',
  '/assets/img/sombra_tramposa_tablero_1779112999828.png',
  '/assets/img/super_martina_juego_1780024581060.png',
  '/assets/img/tictac_reloj_1778905871501.png',
  '/assets/img/tomas_erizo_1778905884457.png',
  '/assets/img/torneo_escolar_ajedrez_1779250574888.png',
  '/assets/img/torreta_1778904570538.png',
];

const AUDIO_URLS = [
  '/assets/audio/inner_light.ogg',
];

// ---- HELPERS ----

async function broadcastProgress(progress) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({ type: 'cache-progress', progress });
  }
}

// ---- INSTALL ----

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const allLight = [...SHELL_URLS, ...GAME_JS_URLS, ...IMAGE_URLS, ...AUDIO_URLS];
      const total = allLight.length;
      let done = 0;

      // Precache shell + game JS in shell cache
      const shellAll = [...SHELL_URLS, ...GAME_JS_URLS, ...AUDIO_URLS];
      const shellCache = await caches.open(CACHE_SHELL);
      for (let i = 0; i < shellAll.length; i += 6) {
        const batch = shellAll.slice(i, i + 6);
        await Promise.allSettled(batch.map(url => shellCache.add(url).catch(() => {})));
        done += batch.length;
        broadcastProgress(Math.round((done / total) * 100));
      }

      // Precache images in images cache
      const imgCache = await caches.open(CACHE_IMAGES);
      for (let i = 0; i < IMAGE_URLS.length; i += 6) {
        const batch = IMAGE_URLS.slice(i, i + 6);
        await Promise.allSettled(batch.map(url => imgCache.add(url).catch(() => {})));
        done += batch.length;
        broadcastProgress(Math.round((done / total) * 100));
      }

      // Signal completion
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: 'cache-complete' });
      }
    })()
  );
});

// ---- ACTIVATE ----

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      const ourCaches = [CACHE_SHELL, CACHE_IMAGES, CACHE_VIDEOS];
      await Promise.all(
        cacheKeys.filter(key => !ourCaches.includes(key)).map(key => caches.delete(key))
      );
      await self.clients.claim();
      // Notify clients SW updated
      const clients = await self.clients.matchAll();
      for (const client of clients) {
        client.postMessage({ type: 'sw-updated' });
      }
    })()
  );
});

// ---- FETCH ----
// Network-first for ALL content. Cache serves as offline fallback only.
// This prevents stale/corrupt cached files from bricking the app.

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // Videos: network-first with dedicated videos cache
  if (path.startsWith('/assets/video/') && path.endsWith('.mp4')) {
    event.respondWith(networkFirst(event.request, CACHE_VIDEOS));
    return;
  }

  // Images: network-first with images cache
  if (path.startsWith('/assets/img/')) {
    event.respondWith(networkFirst(event.request, CACHE_IMAGES));
    return;
  }

  // Everything else (HTML, CSS, JS, audio, manifest): network-first with shell cache
  event.respondWith(networkFirst(event.request, CACHE_SHELL));
});

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || new Response('Sin conexion', { status: 408 });
  }
}

// ---- MESSAGES ----

self.addEventListener('message', event => {
  const { type, url } = event.data || {};

  if (type === 'cache-video') {
    event.waitUntil(
      (async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('fetch failed');
          const cache = await caches.open(CACHE_VIDEOS);
          await cache.put(url, response.clone());

          if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: 'video-cached', url });
          }
        } catch (err) {
          if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: 'video-error', url, error: err.message });
          }
        }
      })()
    );
  }

  if (type === 'video-status') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_VIDEOS);
        const cached = await cache.match(url);
        if (event.source && event.source.postMessage) {
          event.source.postMessage({ type: 'video-status-reply', url, cached: !!cached });
        }
      })()
    );
  }

  if (type === 'delete-video') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_VIDEOS);
        await cache.delete(url);
        if (event.source && event.source.postMessage) {
          event.source.postMessage({ type: 'video-deleted', url });
        }
      })()
    );
  }
});
