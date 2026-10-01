/**
 * DH TECH — Main JavaScript
 * Premium Digital Studio
 * ============================================
 */

'use strict';

/* ============================================================
   NAVBAR: Scroll effect + Active link tracking
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Scroll effect
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section tracking
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   MOBILE MENU: Hamburger toggle
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Đóng menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Mở menu di động');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();

/* ============================================================
   SCROLL ANIMATION: Intersection Observer
   ============================================================ */
(function initScrollAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Make all animated elements immediately visible
    document.querySelectorAll('.anim-fade-up, .anim-fade-in, .anim-blur-up').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const animatedElements = document.querySelectorAll('.anim-fade-up, .anim-fade-in, .anim-blur-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Process steps: additional 'visible' class for number styling
  const processSteps = document.querySelectorAll('.process-step');
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        processObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  processSteps.forEach(step => processObserver.observe(step));
})();

/* ============================================================
   SMOOTH SCROLL: Anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '74'
      );

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // Update URL without page jump
      history.pushState(null, '', href);
    });
  });
})();

/* ============================================================
   CONTACT FORM: Validation + API submission
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error-msg');

  // Fields config
  const fields = {
    name:        { required: true, minLength: 2 },
    email:       { required: true, isEmail: true },
    websiteType: { required: true },
    message:     { required: true, minLength: 10 },
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(id, show) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input) return;

    if (show) {
      input.classList.add('error');
      if (error) error.classList.add('visible');
    } else {
      input.classList.remove('error');
      if (error) error.classList.remove('visible');
    }
  }

  function validateField(id, config) {
    const input = document.getElementById(id);
    if (!input) return true;
    const value = input.value.trim();

    if (config.required && !value) {
      setFieldError(id, true);
      return false;
    }

    if (config.isEmail && value && !validateEmail(value)) {
      setFieldError(id, true);
      return false;
    }

    if (config.minLength && value.length < config.minLength) {
      setFieldError(id, true);
      return false;
    }

    setFieldError(id, false);
    return true;
  }

  function validateAll() {
    let valid = true;
    for (const [id, config] of Object.entries(fields)) {
      if (!validateField(id, config)) valid = false;
    }
    return valid;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => validateField(id, fields[id]));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(id, fields[id]);
    });
  });

  // Set button loading state
  function setLoading(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    if (loading) {
      submitBtn.disabled = true;
      btnText.textContent = 'Đang gửi yêu cầu...';
      if (btnIcon) btnIcon.style.display = 'none';

      // Add spinner
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.id = 'btn-spinner';
      submitBtn.appendChild(spinner);
    } else {
      submitBtn.disabled = false;
      btnText.textContent = 'Gửi yêu cầu';
      if (btnIcon) btnIcon.style.display = '';
      const spinner = document.getElementById('btn-spinner');
      if (spinner) spinner.remove();
    }
  }

  // Show toast notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconSvg = type === 'success'
      ? `<svg class="toast__icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg class="toast__icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${iconSvg}<span class="toast__text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(110%)';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }

  // Form submit
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Hide previous messages
    successMsg.classList.remove('success');
    errorMsg.classList.remove('error');

    // Validate
    if (!validateAll()) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Gather data
    const data = {
      name:        document.getElementById('name').value.trim(),
      email:       document.getElementById('email').value.trim(),
      phone:       document.getElementById('phone').value.trim(),
      websiteType: document.getElementById('websiteType').value,
      budget:      document.getElementById('budget').value,
      message:     document.getElementById('message').value.trim(),
    };

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        successMsg.classList.add('success');
        form.reset();
        showToast('✓ Gửi yêu cầu thành công! DH TECH sẽ liên hệ với bạn trong thời gian sớm nhất.', 'success');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(result.message || 'Không thể gửi yêu cầu.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      errorMsg.classList.add('error');
      showToast('Không thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp với DH TECH.', 'error');
    } finally {
      setLoading(false);
    }
  });
})();

/* ============================================================
   HERO: Subtle cursor / mouse parallax effect (desktop only)
   ============================================================ */
(function initHeroParallax() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bgArt = document.getElementById('hero-bg-art');
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  const orb3 = document.querySelector('.hero__orb--3');

  let animFrame;

  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      
      if (bgArt) {
        bgArt.style.transform = `translate(${x * 0.35}px, ${y * 0.25}px)`;
      }
      if (orb1) orb1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
      if (orb2) orb2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
      if (orb3) orb3.style.transform = `translate(${-x * 0.4}px, ${y * 0.4}px)`;
    });
  });
})();

/* ============================================================
   CARD HOVER SPOTLIGHT (desktop only)
   ============================================================ */
(function initCardSpotlight() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.service-card, .why-card, .pricing-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });
})();

/* ============================================================
   NUMBERS: Counter animation for hero stats
   ============================================================ */
(function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const counters = document.querySelectorAll('.hero__stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseInt(text.replace(/\D/g, ''));
      const suffix = text.replace(/[\d]/g, '');
      if (!num) return;

      let current = 0;
      const duration = 1500;
      const increment = num / (duration / 16);

      const tick = () => {
        current = Math.min(current + increment, num);
        el.textContent = Math.floor(current) + suffix;
        if (current < num) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   NAV: Keyboard accessibility for anchor links
   ============================================================ */
document.querySelectorAll('.btn, .project-card, .experiment-card').forEach(el => {
  if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  }
});

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Staggered reveal for hero elements
  const heroElements = document.querySelectorAll('.hero .anim-fade-up, .hero .anim-fade-in, .hero .anim-blur-up');
  heroElements.forEach((el, index) => {
    setTimeout(() => el.classList.add('visible'), 60 + index * 100);
  });
});
