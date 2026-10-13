/* ==========================================================================
   STACKLY BI - JAVASCRIPT ANIMATIONS & INTERACTIVE MOTION ENGINE
   Handles:
   - Typewriter text reveal
   - 3D Card Tilt with perspective
   - Counter tick-up animations with easing
   - IntersectionObserver scroll reveals & staggered triggers
   - Parallax scroll depth
   - Accordion expand/collapse
   - Wobble cards & spring triggers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollReveals();
  initCounters();
  init3DTilt();
  initAccordions();
  initParallax();
  initWobbleCards();
  initImageReveals();
});

/* 1. TYPEWRITER / TEXT REVEAL */
function initTypewriter() {
  const target = document.getElementById('heroTypewriter');
  if (!target) return;

  const phrases = [
    "Predictive AI & Real-Time BI",
    "Self-Service Visual Data Pipelines",
    "Autonomous Executive Intelligence",
    "Automated Anomaly Radar Alerts"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* 2. SCROLL REVEAL & STAGGERED ANIMATIONS */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-parent');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-on-scroll')) {
          entry.target.classList.add('revealed');
        }
        if (entry.target.classList.contains('stagger-parent')) {
          entry.target.classList.add('is-visible');
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* 3. COUNTER ANIMATION (Smooth requestAnimationFrame) */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-counter-target'));
        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = 1800;
        let startTimestamp = null;

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ease Out Quart
          const easeOut = 1 - Math.pow(1 - progress, 4);
          const currentVal = easeOut * targetVal;

          el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
          }
        }

        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counterElements.forEach(el => counterObserver.observe(el));
}

/* 4. 3D CARD TILT WITH PERSPECTIVE */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* 5. ACCORDION / EXPAND-COLLAPSE */
function initAccordions() {
  const accordions = document.querySelectorAll('.faq-item, .accordion-item');

  accordions.forEach(item => {
    const header = item.querySelector('.faq-question, .accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close peers if desired
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item.active, .accordion-item.active').forEach(peer => {
          if (peer !== item) peer.classList.remove('active');
        });
      }

      item.classList.toggle('active', !isActive);
    });
  });
}

/* 6. PARALLAX SCROLL DEPTH */
function initParallax() {
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
  if (parallaxLayers.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed') || '0.2');
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* 7. WOBBLE CARDS & SPRING TRIGGERS */
function initWobbleCards() {
  const wobbleElements = document.querySelectorAll('.wobble-card');

  wobbleElements.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.remove('wobble-trigger');
      void card.offsetWidth; // Trigger reflow
      card.classList.add('wobble-trigger');
    });
  });
}

/* 8. IMAGE REVEAL CURTAIN */
function initImageReveals() {
  const imageWrappers = document.querySelectorAll('.image-reveal-wrapper');

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed', 'reveal-curtain');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  imageWrappers.forEach(el => imgObserver.observe(el));
}
