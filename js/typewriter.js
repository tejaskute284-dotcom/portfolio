// Typewriter Animation Module — Classic Luxury Editorial Edition

export function initTypewriter() {
  // 1. Tagline typewriter (infinite cycle with refined typography)
  const taglineEl = document.getElementById('typewriter-tagline');
  if (taglineEl) {
    const taglines = [
      "Crafting intelligent AI/ML systems with architectural precision.",
      "Architecting robust full-stack software & high-throughput backends.",
      "Transforming complex mathematical models into production realities."
    ];
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

      setTimeout(typeTagline, typingSpeed);
    }

    typeTagline();
  }
}
