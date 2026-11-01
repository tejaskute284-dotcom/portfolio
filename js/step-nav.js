// Step-by-Step Interactive Section Navigator & Strict Landing Gate Flow

export function initStepNavigation() {
  const mainContent = document.getElementById('portfolio-main-content');
  const exploreBtn = document.getElementById('hero-next-step-btn');
  const floatingStep = document.getElementById('floating-step-guide');
  let isUnlocked = false;

  function unlockPortfolio(targetId = 'about') {
    if (!mainContent) return;
    
    if (!isUnlocked) {
      isUnlocked = true;
      document.body.classList.remove('landing-locked');
      mainContent.classList.remove('portfolio-content-gate');
      mainContent.classList.add('portfolio-content-active');
      
      if (floatingStep) {
        floatingStep.classList.remove('hidden');
        floatingStep.classList.add('flex');
      }

      // Re-trigger GSAP or AOS triggers if applicable
      window.dispatchEvent(new Event('resize'));
    }

    if (targetId) {
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  }

  // Explore button triggers unlock and scrolls to About
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      unlockPortfolio('about');
    });
  }

  // Any navbar link click also unlocks and navigates to the clicked section
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#' && href !== '#hero') {
        const targetId = href.substring(1);
        if (!isUnlocked) {
          e.preventDefault();
          unlockPortfolio(targetId);
        }
      }
    });
  });

  // Floating Step-by-Step progress tracker on scroll
  const sections = [
    { id: 'hero', label: 'Landing' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'hackathons', label: 'Achievements' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'skills', label: 'Skills' },
    { id: 'future-vision', label: 'Research' },
    { id: 'contact', label: 'Contact' }
  ];

  const stepPrev = document.getElementById('step-nav-prev');
  const stepNext = document.getElementById('step-nav-next');
  const stepCurrentLabel = document.getElementById('step-current-label');
  const stepNumber = document.getElementById('step-number');

  function getCurrentSectionIndex() {
    const scrollY = window.scrollY + 200;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollY) {
        return i;
      }
    }
    return 0;
  }

  function updateStepUI() {
    if (!isUnlocked) return;
    
    const currentIndex = getCurrentSectionIndex();
    if (stepCurrentLabel) {
      stepCurrentLabel.textContent = sections[currentIndex].label;
    }
    if (stepNumber) {
      stepNumber.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
    }

    if (stepPrev) {
      stepPrev.disabled = currentIndex === 0;
      stepPrev.style.opacity = currentIndex === 0 ? '0.35' : '1';
    }
    if (stepNext) {
      stepNext.disabled = currentIndex === sections.length - 1;
      stepNext.style.opacity = currentIndex === sections.length - 1 ? '0.35' : '1';
    }
  }

  if (stepPrev) {
    stepPrev.addEventListener('click', () => {
      const idx = getCurrentSectionIndex();
      if (idx > 0) {
        const target = document.getElementById(sections[idx - 1].id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (stepNext) {
    stepNext.addEventListener('click', () => {
      const idx = getCurrentSectionIndex();
      if (idx < sections.length - 1) {
        const target = document.getElementById(sections[idx + 1].id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('scroll', updateStepUI, { passive: true });
}
