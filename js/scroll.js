// Scroll & Animations Module (Lenis, GSAP, & Intersection Observer)

export function initScroll() {
  // 1. Native Smooth Scroll for Anchors with Fallback
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') {
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

  // 4. GSAP Entrance Animations (Hero Section load-in)
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    tl.from('.hero-anim-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.2
    })
    .from('.hero-anim-sub', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-anim-cta', {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.15
    }, '-=0.4')
    .from('.hero-anim-social', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.3');
  }
}

