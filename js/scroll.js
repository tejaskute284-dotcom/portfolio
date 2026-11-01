// Scroll & Animations Module (Lenis, GSAP, & Intersection Observer)

export function initScroll() {
  // 1. Native Smooth Scroll for Anchors with Fallback
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // If clicking Explore button or navbar while locked, step-nav handles unlocking
      if (document.body.classList.contains('landing-locked')) {
        return;
      }

      e.preventDefault();
      if (targetId === '#' || targetId === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navbarHeight = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Fallback in case smooth scroll fails or is interrupted
        setTimeout(() => {
          if (Math.abs(window.scrollY - targetPosition) > 10) {
            window.scrollTo(0, targetPosition);
          }
        }, 400);
      }
    });
  });

  // 2. Section Scroll Reveal using IntersectionObserver with staggered children
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Stagger children transition-delay if present
        const staggerChildren = entry.target.querySelectorAll('.stagger-child');
        staggerChildren.forEach((child, index) => {
          child.style.transitionDelay = `${index * 80}ms`;
          child.classList.add('revealed');
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Active Nav Link Highlight on scroll via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    threshold: 0.4,
    rootMargin: '-80px 0px -40% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    // If at the very top of the page, clear all active highlights
    if (window.scrollY < 100) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // Also listen to scroll event to clear highlights at top
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      navLinks.forEach(link => link.classList.remove('active'));
    }
  }, { passive: true });

  // 4. GSAP 3D Entrance & Cinematic Scroll (Respects prefers-reduced-motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && !prefersReduced) {
    // 3D Embossed Hero Name Entrance
    gsap.from('#hero-name-target', {
      opacity: 0,
      y: 25,
      rotateX: 14,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.2
    });

    // Hero Portrait Soft 3D Float Entrance
    gsap.from('#hero .portrait-container', {
      opacity: 0,
      scale: 0.94,
      y: 20,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.35
    });

    // Mouse-based 3D parallax on Hero Name (gentle, desktop only)
    if (window.innerWidth >= 1024) {
      const heroName = document.getElementById('hero-name-target');
      if (heroName) {
        window.addEventListener('mousemove', (e) => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const tiltX = (e.clientY - cy) * -0.015;
          const tiltY = (e.clientX - cx) * 0.018;
          gsap.to(heroName, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.5,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }, { passive: true });
      }
    }

    // Selective Magnetic Micro-Interactions on CTA Buttons
    const magneticBtns = document.querySelectorAll('.btn-luxury-primary, .btn-luxury-secondary');
    if (window.innerWidth >= 1024) {
      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          gsap.to(btn, {
            x: dx * 0.22,
            y: dy * 0.22,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }
  }
}
