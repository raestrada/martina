// Martina · Galería con lightbox, teclado y swipe
(function () {
  var items = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var counter = document.getElementById('lightbox-counter');
  var current = 0;

  if (!items.length || !lightbox) return;

  function open(index) {
    current = index;
    var el = items[current];
    var src = el.querySelector('img').getAttribute('src');
    var cap = el.querySelector('.gallery-caption').textContent;
    img.src = src;
    img.alt = cap;
    caption.textContent = cap;
    counter.textContent = (current + 1) + ' / ' + items.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() {
    current = (current - 1 + items.length) % items.length;
    update();
  }

  function next() {
    current = (current + 1) % items.length;
    update();
  }

  function update() {
    var el = items[current];
    var src = el.querySelector('img').getAttribute('src');
    var cap = el.querySelector('.gallery-caption').textContent;
    img.style.opacity = '0';
    setTimeout(function () {
      img.src = src;
      img.alt = cap;
      caption.textContent = cap;
      counter.textContent = (current + 1) + ' / ' + items.length;
      img.style.opacity = '1';
    }, 120);
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  document.querySelector('.lightbox-close').addEventListener('click', close);
  document.querySelector('.lightbox-prev').addEventListener('click', prev);
  document.querySelector('.lightbox-next').addEventListener('click', next);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe support for mobile
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, { passive: true });
})();
