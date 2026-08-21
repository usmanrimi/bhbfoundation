/**
 * BHB FOUNDATION — CLEAN EDITORIAL ANIMATIONS & INTERACTION ENGINE
 */

// 1. Subtle Eased Number Counter for Impact Section
function animateValue(element, start, end, duration = 1400, prefix = '', suffix = '') {
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

// 2. IntersectionObserver for Gentle Scroll Reveals
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  
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
            animateValue(counter, 0, target, 1400, prefix, suffix);
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 3. Toast Notification Helper
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
});
