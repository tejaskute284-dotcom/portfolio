// Stats Counter Module (Scroll Triggered Count-Up)

export function initCounter() {
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length === 0) return;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      // Pad numbers less than 10 with a zero
      el.textContent = currentValue < 10 ? `0${currentValue}` : currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact and formatted
        el.textContent = target < 10 ? `0${target}` : target;
      }
    };

    requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counterElements.forEach(el => observer.observe(el));
}
