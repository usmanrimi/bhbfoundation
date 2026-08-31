/**
 * BHB FOUNDATION — COMPREHENSIVE INTERACTION & ANIMATION ENGINE
 * Smooth scroll reveals, dynamic counters, marquee controls, and micro-interactions
 */

// 1. Subtle Eased Number Counter for Impact Section
function animateValue(element, start, end, duration = 1600, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeProgress * (end - start) + start);
    element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    }
  };
  window.requestAnimationFrame(step);
}

// 2. IntersectionObserver for Dynamic Scroll Reveals
function initScrollReveals() {
  const revealSelectors = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .pastel-card, .focus-area-item, .stat-metric-block, .about-mv-item-card, .director-profile-card, .executive-spotlight-card';
  const revealElements = document.querySelectorAll(revealSelectors);
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        
        // Counter trigger
        const counters = entry.target.querySelectorAll('[data-counter-end]');
        counters.forEach(counter => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            const target = parseFloat(counter.getAttribute('data-counter-end')) || 0;
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            animateValue(counter, 0, target, 1600, prefix, suffix);
          }
        });

        // Also check if the element itself has counter data
        if (entry.target.hasAttribute('data-counter-end') && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseFloat(entry.target.getAttribute('data-counter-end')) || 0;
          const prefix = entry.target.getAttribute('data-prefix') || '';
          const suffix = entry.target.getAttribute('data-suffix') || '';
          animateValue(entry.target, 0, target, 1600, prefix, suffix);
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  });

  revealElements.forEach((el) => {
    // Check if element is already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      el.classList.add('in');
    } else {
      observer.observe(el);
    }
  });
}

window.initScrollReveals = initScrollReveals;

// 3. Interactive Subtle Card Hover Effects
function initCardInteractions() {
  const cards = document.querySelectorAll('.pastel-card, .about-mv-item-card, .portfolio-card, .blog-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease';
    });
  });
}

// 4. Toast Notification Helper
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initCardInteractions();
});
