// Step-by-Step Interactive Section Navigator

export function initStepNavigation() {
  const sections = [
    { id: 'hero', label: 'Landing' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'hackathons', label: 'Achievements' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'skills', label: 'Skills' },
    { id: 'github-stats', label: 'GitHub' },
    { id: 'future-vision', label: 'Research' },
    { id: 'contact', label: 'Contact' }
  ];

  const exploreBtn = document.getElementById('hero-next-step-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.getElementById('about');
      if (targetEl) {
        const navbarHeight = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Floating Step-by-Step progress tracker on scroll
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
        if (target) {
          const navbarHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  }

  if (stepNext) {
    stepNext.addEventListener('click', () => {
      const idx = getCurrentSectionIndex();
      if (idx < sections.length - 1) {
        const target = document.getElementById(sections[idx + 1].id);
        if (target) {
          const navbarHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  }

  window.addEventListener('scroll', updateStepUI, { passive: true });
  updateStepUI();
}
