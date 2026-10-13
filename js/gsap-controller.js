/* ==========================================================================
   STACKLY BI - GSAP INTERACTIVE ENGINE & CLEAN MOTION SYSTEM
   No intrusive canvas streaks or blank-screen blockers.
   All content is 100% visible immediately.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGSAPAnimations();
  initMagneticButtons();
});

/* 1. MAGNETIC BUTTON PHYSICS */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.magnetic-btn, .btn-primary, .stackly-brand');

  magneticElements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (window.gsap) {
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.35,
          ease: "power2.out"
        });
      } else {
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.4)"
        });
      } else {
        btn.style.transform = `translate(0, 0)`;
      }
    });
  });
}

/* 2. REFINED GSAP ENTRANCES & SCROLL ENHANCEMENTS */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') {
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Floating Badges on Hero
  gsap.to(".badge-top-right", {
    y: -10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".badge-bottom-left", {
    y: -8,
    duration: 3.5,
    delay: 0.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Micro-tilt on interactive cards
  document.querySelectorAll('.luxury-bento-card, .feature-card, .stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -6,
        duration: 0.25,
        ease: "power1.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        duration: 0.35,
        ease: "power1.out"
      });
    });
  });
}
