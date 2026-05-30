// Martina · Offline Manager
// Auto-cache on mobile + per-video manual cache + SW update notifications

(function () {
  'use strict';

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

  var isShellCached = false;

  // ---- Service Worker registration ----

  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    if (reg.active && !navigator.serviceWorker.controller) {
      // SW is active but not controlling this page — reload once
      location.reload();
      return;
    }

    // Check if auto-cache is already done
    var alreadyDone = localStorage.getItem('martina-shell-cached-v3');
    isShellCached = alreadyDone === 'true';

    // Listen for messages from SW
    navigator.serviceWorker.addEventListener('message', onSWMessage);

    // If mobile and not cached, show banner and wait for SW to precache
    if (isMobile() && !isShellCached) {
      showBanner('Preparando para leer sin conexión...');
    }
  });

  // ---- SW update detection ----

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    // New SW took control
    isShellCached = false;
    localStorage.removeItem('martina-shell-cached-v3');
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
      showUpdateToast();
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
    if (bannerTextEl) bannerTextEl.textContent = 'Preparando para leer sin conexión... ' + percent + '%';
  }

  function finishAutoCache() {
    if (isShellCached) return;
    isShellCached = true;
    localStorage.setItem('martina-shell-cached-v3', 'true');
    getBannerElements();
    if (bannerEl) {
      if (bannerTextEl) bannerTextEl.textContent = ' Listo para leer sin conexión';
      if (progressFillEl) progressFillEl.style.width = '100%';
      bannerEl.classList.add('visible');
      setTimeout(function () {
        if (bannerEl) bannerEl.classList.remove('visible');
      }, 3000);
    }
  }

  // ---- SW update toast ----

  function showUpdateToast() {
    if (document.querySelector('.sw-update-toast')) return;
    var toast = document.createElement('div');
    toast.className = 'sw-update-toast';
    toast.innerHTML = ' Actualización disponible — Recargar';
    toast.addEventListener('click', function () {
      toast.remove();
      location.reload();
    });
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });
    // Auto-hide after 10s
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
      var btn = buttons[i];
      var src = btn.getAttribute('data-video-src');
      if (!src) continue;

      // Add file size to label
      var size = VIDEO_SIZES[src];
      if (size && isMobile()) {
        btn.innerHTML = '  Guardar offline (' + formatMB(size) + ')';
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
    }
  }

  function updateVideoButton(url, cached) {
    var btn = document.querySelector('.video-offline-btn[data-video-src="' + url + '"]');
    if (!btn) return;
    if (cached) {
      setBtnState(btn, 'saved');
    }
  }

  function setBtnState(btn, state) {
    btn.classList.remove('saving', 'saved');
    if (state === 'saving') {
      btn.classList.add('saving');
      btn.innerHTML = '  Guardando...';
    } else if (state === 'saved') {
      btn.classList.add('saved');
      btn.innerHTML = '  Guardado';
    } else {
      var src = btn.getAttribute('data-video-src');
      var size = VIDEO_SIZES[src];
      if (size && isMobile()) {
        btn.innerHTML = '  Guardar offline (' + formatMB(size) + ')';
      } else {
        btn.innerHTML = '  Descargar Video (MP4)';
      }
    }
  }

  // ---- Init on DOM ready ----

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVideoButtons);
  } else {
    setupVideoButtons();
  }

})();
