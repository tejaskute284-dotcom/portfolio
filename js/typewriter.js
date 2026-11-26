// Typewriter Animation Module — Classic Luxury Editorial Edition

let typewriterTimer = null;

export function initTypewriter() {
  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }

  // 1. Tagline typewriter (infinite cycle with refined typography)
  const taglineEl = document.getElementById('typewriter-tagline');
  if (!taglineEl) return;

  const taglines = [
    "Crafting intelligent AI/ML systems with architectural precision.",
    "Architecting robust full-stack software & high-throughput backends.",
    "Transforming complex mathematical models into production realities."
  ];

  // Respect prefers-reduced-motion: render static primary tagline
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    taglineEl.textContent = taglines[0];
    return;
  }

  let tagIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeTagline() {
    const currentText = taglines[tagIndex];
    if (isDeleting) {
      taglineEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30; // faster delete
    } else {
      taglineEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65; // measured, elegant typing pace
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2600; // pause at full text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      tagIndex = (tagIndex + 1) % taglines.length;
      typingSpeed = 600; // pause before next statement
    }

    typewriterTimer = setTimeout(typeTagline, typingSpeed);
  }

  typeTagline();
}
