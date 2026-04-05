/**
 * ============================================
 * Munshi Holistic Services - Main JavaScript
 * @munshiholisticservices | Nisreen Madraswala
 * ============================================
 */

'use strict';

/* ==========================================
   PAGE NAVIGATION
   ========================================== */

/**
 * Show a specific page and hide all others
 * @param {string} pageId - The page to show ('home','about','services','gallery','contact')
 */
function showPage(pageId) {
  // Hide all page sections
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(s => s.classList.remove('active'));

  // Show the requested section
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }

  // Update nav link active states
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkId = link.id; // e.g. 'nav-home'
    if (linkId === 'nav-' + pageId) {
      link.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger animations for newly visible section
  setTimeout(() => {
    observeFadeIns();
    if (pageId === 'about') animateSkillBars();
  }, 100);

  // Close mobile nav if open
  closeMobileNav();
}


/* ==========================================
   NAVBAR SCROLL EFFECT
   ========================================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ==========================================
   MOBILE NAVIGATION
   ========================================== */
function toggleMobileNav() {
  const mobileNav  = document.getElementById('mobileNav');
  const hamburger  = document.getElementById('hamburger');
  mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active');
}

function closeMobileNav() {
  const mobileNav  = document.getElementById('mobileNav');
  const hamburger  = document.getElementById('hamburger');
  mobileNav.classList.remove('open');
  hamburger.classList.remove('active');
}

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  const mobileNav  = document.getElementById('mobileNav');
  const hamburger  = document.getElementById('hamburger');
  if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileNav();
  }
});


/* ==========================================
   FADE-IN ANIMATIONS (Intersection Observer)
   ========================================== */
let fadeObserver = null;

function observeFadeIns() {
  if (fadeObserver) {
    fadeObserver.disconnect();
  }

  const fadeEls = document.querySelectorAll('.page-section.active .fade-in:not(.visible)');

  fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the animations
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));
}

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
  observeFadeIns();
});

// Also run on scroll
window.addEventListener('scroll', observeFadeIns, { passive: true });


/* ==========================================
   SKILL BARS ANIMATION
   ========================================== */
function animateSkillBars() {
  const bars = document.querySelectorAll('#page-about .skill-bar');
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}


/* ==========================================
   GALLERY FILTER
   ========================================== */
function filterGallery(category, btn) {
  // Update button states
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter gallery items
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    if (category === 'all' || itemCategory === category) {
      item.style.display = 'block';
      item.style.animation = 'fadeItemIn 0.4s ease forwards';
    } else {
      item.style.display = 'none';
    }
  });
}

// Add CSS animation for gallery filter
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeItemIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(style);


/* ==========================================
   LIGHTBOX
   ========================================== */
let galleryImages = [];
let currentLightboxIndex = 0;

function openLightbox(item) {
  const img = item.querySelector('.gallery-img');
  if (!img) return;

  // Collect all visible gallery real images
  galleryImages = Array.from(
    document.querySelectorAll('#galleryGrid .gallery-item[style="display: block;"] .gallery-img, #galleryGrid .gallery-item:not([style*="display: none"]) .gallery-img')
  ).filter(i => !!i);

  currentLightboxIndex = galleryImages.indexOf(img);
  if (currentLightboxIndex === -1) currentLightboxIndex = 0;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || 'Gallery image';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openLightboxPlaceholder(item, emoji, label, colors) {
  // For placeholder items, show a styled modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  // Create a canvas placeholder
  const canvas = document.createElement('canvas');
  canvas.width  = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const colorArr = colors.split(',');
  const grad = ctx.createLinearGradient(0, 0, 800, 600);
  grad.addColorStop(0, colorArr[0] || '#5D8A7B');
  grad.addColorStop(1, colorArr[1] || '#3D6B5C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 600);

  // Emoji
  ctx.font = '120px serif';
  ctx.textAlign = 'center';
  ctx.fillText(emoji, 400, 280);

  // Label
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(label, 400, 380);

  lightboxImg.src = canvas.toDataURL();
  lightboxImg.alt = label;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  galleryImages = []; // no nav for placeholders
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  if (galleryImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  const lightboxImg = document.getElementById('lightboxImg');
  const nextImg = galleryImages[currentLightboxIndex];
  
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = nextImg.src;
    lightboxImg.alt = nextImg.alt;
    lightboxImg.style.opacity = '1';
  }, 200);
}

lightboxImg && (lightboxImg.style.transition = 'opacity 0.2s ease');

// Close lightbox on backdrop click
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
});


/* ==========================================
   CONTACT FORM
   ========================================== */
function submitForm(e) {
  e.preventDefault();

  const btn  = document.getElementById('submitBtn');
  const text = document.getElementById('submitText');

  // Show loading state
  btn.disabled = true;
  text.textContent = 'Sending… ✉️';

  // Simulate form submission (replace with actual backend/EmailJS integration)
  setTimeout(() => {
    // Hide form, show success
    document.getElementById('formContent').style.display = 'none';
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';

    // Reset after delay for demo
    // Re-enable button
    btn.disabled = false;
    text.textContent = 'Send Message 📩';
  }, 1500);
}


/* ==========================================
   SMOOTH COUNTER ANIMATION
   ========================================== */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


/* ==========================================
   ACTIVE NAV LINK ON HASH CHANGE
   ========================================== */
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    showPage(hash);
  }
});


/* ==========================================
   INIT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initial fade-in trigger
  setTimeout(observeFadeIns, 200);

  // Check for hash in URL on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    showPage(hash);
  }

  // Apply lightboxImg opacity transition
  const lb = document.getElementById('lightboxImg');
  if (lb) lb.style.transition = 'opacity 0.2s ease';
});
