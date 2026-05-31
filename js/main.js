// Martina · Cuentos para Dormir
// Dark mode toggle, hamburger menu, fade animations, reading progress, nav dropdown

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // === DARK MODE TOGGLE ===
    var themeToggle = document.getElementById('theme-toggle');
    var metaTheme = document.getElementById('theme-color-meta');
    var stored = localStorage.getItem('martina-theme');
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (metaTheme) metaTheme.content = '#0d1b2a';
    }

    if (themeToggle) {
      themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
      themeToggle.addEventListener('click', function () {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          if (metaTheme) metaTheme.content = '#012a4a';
          themeToggle.textContent = '🌙';
          localStorage.setItem('martina-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          if (metaTheme) metaTheme.content = '#0d1b2a';
          themeToggle.textContent = '☀️';
          localStorage.setItem('martina-theme', 'dark');
        }
      });
    }

    // === READING PROGRESS BAR ===
    var progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
          progressBar.style.width = Math.min((scrollTop / docHeight) * 100, 100) + '%';
        }
      }, { passive: true });
    }

    // === NAV DROPDOWN (Más...) ===
    var moreBtn = document.getElementById('nav-more-btn');
    var moreMenu = document.getElementById('nav-more-menu');
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var open = moreMenu.classList.toggle('open');
        moreBtn.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', function (e) {
        if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
          moreMenu.classList.remove('open');
          moreBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // === HAMBURGER MENU ===
    var hamburger = document.getElementById('hamburger-btn');
    var navBar = document.getElementById('nav-bar');
    if (hamburger && navBar) {
      hamburger.addEventListener('click', function () {
        navBar.classList.toggle('open');
        hamburger.textContent = navBar.classList.contains('open') ? '✕' : '☰';
      });
      navBar.querySelectorAll('.nav-link, .nav-dropdown-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          navBar.classList.remove('open');
          hamburger.textContent = '☰';
        });
      });
    }

    // === FADE-IN ON SCROLL ===
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(1rem)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });

    // === LAZY LOADED IMAGES ===
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('loaded'); });
        img.addEventListener('error', function () { img.classList.add('loaded'); });
      }
    });

    // === ROTATING FOOTER QUOTE ===
    var quotes = [
      '«El ajedrez es un cuento de hadas de la mente» — Mikhail Tal',
      '«El ajedrez no se acaba cuando pierdes. Se acaba cuando dejas de luchar.» — Martina',
      '«El ajedrez es 99% táctica» — Richard Teichmann',
      '«Para jugar bien, solo necesitas imaginación y valentía» — Judith Polgar',
      '«En el ajedrez, como en la vida, el mejor movimiento es siempre el siguiente» — Savielly Tartakower',
      '«Cada peón es una reina dormida» — Proverbio ajedrecístico'
    ];
    var quoteEl = document.getElementById('footer-quote');
    if (quoteEl) {
      var idx = Math.floor(Math.random() * quotes.length);
      var currentText = quoteEl.textContent.trim();
      if (currentText && currentText.length > 3) {
        quoteEl.textContent = currentText;
      } else {
        quoteEl.textContent = quotes[idx];
      }
    }

    // === PLAYBACK SPEED CONTROLS ===
    document.querySelectorAll('.speed-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var speed = parseFloat(this.dataset.speed);
        var video = this.closest('.audiobook-body').querySelector('video');
        if (video) {
          video.playbackRate = speed;
          this.parentElement.querySelectorAll('.speed-btn').forEach(function (b) { b.classList.remove('active'); });
          this.classList.add('active');
        }
      });
    });

    // === BREADCRUMBS & READING TIME for story pages ===
    var storyHeader = document.querySelector('.story-header');
    if (storyHeader) {
      var path = window.location.pathname;
      var match = path.match(/\/cuentos\/(\d+)-(.+)\.html/);
      if (match) {
        var num = match[1];
        var breadcrumbsDiv = document.createElement('div');
        breadcrumbsDiv.className = 'breadcrumbs';
        breadcrumbsDiv.innerHTML = '<a href="/">Inicio</a><span>›</span><a href="/#cuentos">Cuentos</a><span>›</span>' + num;
        storyHeader.parentNode.insertBefore(breadcrumbsDiv, storyHeader);
      }

      var paragraphs = document.querySelectorAll('.story-body > p').length;
      var words = document.querySelector('.story-body') ? document.querySelector('.story-body').textContent.split(/\s+/).length : 0;
      var minutes = Math.max(1, Math.round(words / 200));
      var metaBar = document.createElement('div');
      metaBar.className = 'story-meta-bar';
      metaBar.innerHTML = '<span>⏱️ ' + minutes + ' min de lectura</span>';
      storyHeader.appendChild(metaBar);
    }
  });
})();
