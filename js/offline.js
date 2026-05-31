// Martina · Offline Manager
// Auto-cache on mobile + per-video manual cache + SW update notifications

(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  // ---- Mobile detection ----

  function isMobile() {
    return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) ||
      ('ontouchstart' in window && window.innerWidth < 1024);
  }

  // ---- MP4 file sizes (bytes) for button labels ----

  var VIDEO_SIZES = {
    '/assets/video/cuento_01_audiolibro.mp4': 44099672,
    '/assets/video/cuento_02_audiolibro.mp4': 25132828,
    '/assets/video/cuento_03_audiolibro.mp4': 37176221,
    '/assets/video/cuento_04_audiolibro.mp4': 32744245,
    '/assets/video/cuento_05_audiolibro.mp4': 41715926,
    '/assets/video/cuento_06_audiolibro.mp4': 41636578,
    '/assets/video/cuento_07_audiolibro.mp4': 39275255,
    '/assets/video/cuento_08_audiolibro.mp4': 31409580,
    '/assets/video/cuento_09_audiolibro.mp4': 34489850,
    '/assets/video/cuento_10_audiolibro.mp4': 55703399,
    '/assets/video/cuento_11_audiolibro.mp4': 62573719,
    '/assets/video/cuento_12_audiolibro.mp4': 35461668,
    '/assets/video/cuento_13_audiolibro.mp4': 44813939,
    '/assets/video/cuento_14_audiolibro.mp4': 50436041,
    '/assets/video/cuento_15_audiolibro.mp4': 30915598,
    '/assets/video/cuento_16_audiolibro.mp4': 41827877,
  };

  function formatMB(bytes) {
    var mb = bytes / (1024 * 1024);
    return mb >= 1 ? Math.round(mb) + ' MB' : Math.round(mb * 10) / 10 + ' MB';
  }

  var SHELL_KEY = 'martina-shell-cached-v5';
  var isShellCached = localStorage.getItem(SHELL_KEY) === 'true';

  // ---- SW registration ----

  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    if (reg.active && !navigator.serviceWorker.controller) {
      location.reload();
      return;
    }

    navigator.serviceWorker.addEventListener('message', onSWMessage);

    if (isMobile() && !isShellCached) {
      showBanner('Preparando para leer sin conexion...');
    }

    setupVideoButtons();
  });

  // ---- SW update detection ----

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    isShellCached = false;
    localStorage.removeItem(SHELL_KEY);
  });

  // ---- SW messages ----

  function onSWMessage(event) {
    var data = event.data;
    if (!data) return;

    if (data.type === 'cache-progress') {
      updateBannerProgress(data.progress);
    }

    if (data.type === 'cache-complete') {
      finishAutoCache();
    }

    if (data.type === 'sw-updated') {
      if (isMobile()) {
        location.reload();
      } else {
        showUpdateToast();
      }
    }

    if (data.type === 'video-status-reply') {
      updateVideoButton(data.url, data.cached);
    }

    if (data.type === 'video-cached') {
      var btn = document.querySelector('.video-offline-btn[data-video-src="' + data.url + '"]');
      if (btn) setBtnState(btn, 'saved');
    }

    if (data.type === 'video-error') {
      var btnErr = document.querySelector('.video-offline-btn[data-video-src="' + data.url + '"]');
      if (btnErr) setBtnState(btnErr, 'default');
    }
  }

  // ---- Auto-cache banner ----

  var bannerEl = null;
  var bannerTextEl = null;
  var progressFillEl = null;

  function getBannerElements() {
    if (bannerEl) return;
    bannerEl = document.getElementById('offline-banner');
    if (!bannerEl) return;
    bannerTextEl = bannerEl.querySelector('.offline-banner-text');
    progressFillEl = bannerEl.querySelector('.offline-progress-fill');
  }

  function showBanner(text) {
    getBannerElements();
    if (!bannerEl) return;
    if (bannerTextEl) bannerTextEl.textContent = text;
    bannerEl.classList.add('visible');
  }

  function updateBannerProgress(percent) {
    getBannerElements();
    if (bannerEl) bannerEl.classList.add('visible');
    if (progressFillEl) progressFillEl.style.width = percent + '%';
    if (bannerTextEl) bannerTextEl.textContent = 'Preparando para leer sin conexion... ' + percent + '%';
  }

  function finishAutoCache() {
    if (isShellCached) return;
    isShellCached = true;
    localStorage.setItem(SHELL_KEY, 'true');
    getBannerElements();
    if (!bannerEl) return;
    if (bannerTextEl) bannerTextEl.textContent = 'Listo para leer sin conexion';
    if (progressFillEl) progressFillEl.style.width = '100%';
    bannerEl.classList.add('visible');
    setTimeout(function () {
      bannerEl.classList.remove('visible');
    }, 3000);
  }

  // ---- SW update toast ----

  function showUpdateToast() {
    if (document.querySelector('.sw-update-toast')) return;
    var toast = document.createElement('div');
    toast.className = 'sw-update-toast';
    toast.textContent = '\uD83D\uDD04 Actualizacion disponible \u2014 Recargar';
    toast.addEventListener('click', function () {
      toast.remove();
      location.reload();
    });
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });
    setTimeout(function () {
      if (toast.parentNode) {
        toast.classList.remove('visible');
        setTimeout(function () { toast.remove(); }, 400);
      }
    }, 10000);
  }

  // ---- Video offline buttons ----

  function setupVideoButtons() {
    var buttons = document.querySelectorAll('.video-offline-btn');
    if (!buttons.length) return;

    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        var src = btn.getAttribute('data-video-src');
        if (!src) return;

        // Add file size to label on mobile
        var size = VIDEO_SIZES[src];
        if (size && isMobile()) {
          btn.innerHTML = '\u2B07\uFE0F Guardar offline (' + formatMB(size) + ')';
        }

        // Check if already cached
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'video-status',
            url: src,
          });
        }

        // Intercept click
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var url = this.getAttribute('data-video-src');
          if (!url || !navigator.serviceWorker.controller) return;
          if (this.classList.contains('saved') || this.classList.contains('saving')) return;

          setBtnState(this, 'saving');
          navigator.serviceWorker.controller.postMessage({
            type: 'cache-video',
            url: url,
          });
        });
      })(buttons[i]);
    }
  }

  function updateVideoButton(url, cached) {
    var btn = document.querySelector('.video-offline-btn[data-video-src="' + url + '"]');
    if (!btn) return;
    if (cached) setBtnState(btn, 'saved');
  }

  function setBtnState(btn, state) {
    btn.classList.remove('saving', 'saved');
    if (state === 'saving') {
      btn.classList.add('saving');
      btn.innerHTML = '\u23F3 Guardando...';
    } else if (state === 'saved') {
      btn.classList.add('saved');
      btn.innerHTML = '\u2705 Guardado';
    } else {
      var src = btn.getAttribute('data-video-src');
      var size = VIDEO_SIZES[src];
      if (size && isMobile()) {
        btn.innerHTML = '\u2B07\uFE0F Guardar offline (' + formatMB(size) + ')';
      } else {
        btn.innerHTML = '\u2B07\uFE0F Descargar Video (MP4)';
      }
    }
  }

})();
