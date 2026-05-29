// Martina · Cuentos para Dormir
// Simple interactions: active nav link, fade animations, hamburger menu, PWA

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu toggle for mobile
  const hamburger = document.getElementById('hamburger-btn');
  const navBar = document.querySelector('.nav-bar-compact');
  if (hamburger && navBar) {
    hamburger.addEventListener('click', () => {
      navBar.classList.toggle('open');
      hamburger.textContent = navBar.classList.contains('open') ? '✕' : '☰';
    });
    // Close menu when clicking a nav link
    navBar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navBar.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }

  // Highlight current nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop() ||
        (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Fade-in elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(1rem)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
