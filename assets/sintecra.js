/**
 * SINTECRA | ENERGÍA & OBRAS — Frontend Interactive Engine (Vanilla JS)
 * - Mobile Navigation Toggle
 * - Scroll Reveal Animations (IntersectionObserver, 250-400ms)
 * - Smooth Hero Parallax Effect (requestAnimationFrame)
 * - Animated Metrics Counters on Scroll
 */
(function () {
  'use strict';

  // 1. Dynamic Year in Footer
  var yearEls = document.querySelectorAll('#current-year, .js-current-year');
  var currentYear = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = currentYear;
  });

  // 2. Mobile Menu Toggle
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('menu-icon-open');
  var iconClose = document.getElementById('menu-icon-close');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu(forceClose) {
    if (!menuBtn || !mobileMenu) return;
    var isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    var nextState = forceClose ? false : !isExpanded;

    menuBtn.setAttribute('aria-expanded', String(nextState));
    if (nextState) {
      mobileMenu.classList.remove('hidden');
      if (iconOpen) iconOpen.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      toggleMenu(false);
    });
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(true);
    });
  });

  // 3. Fade-in on Scroll (IntersectionObserver)
  var revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // 4. Animated Metrics Counters
  var counterElements = document.querySelectorAll('[data-counter-target]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter-target'), 10);
    var prefix = el.getAttribute('data-counter-prefix') || '';
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var duration = 1100;
    if (isNaN(target)) return;

    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var currentVal = Math.round(eased * target);
      el.textContent = prefix + currentVal + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    var counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // 5. Smooth Hero Parallax Effect
  var parallaxBg = document.getElementById('hero-parallax-bg');
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (parallaxBg && !prefersReducedMotion) {
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY < 900) {
              var offset = Math.round(scrollY * 0.22);
              parallaxBg.style.transform = 'translate3d(0, ' + offset + 'px, 0) scale(1.06)';
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
