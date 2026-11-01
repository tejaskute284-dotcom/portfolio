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
    let typingSpeed = 70;

    function typeTagline() {
      const currentText = taglines[tagIndex];
      if (isDeleting) {
        taglineEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35; // faster delete
      } else {
        taglineEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70; // measured, elegant typing pace
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2400; // pause at full text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        tagIndex = (tagIndex + 1) % taglines.length;
        typingSpeed = 600; // pause before next statement
      }

      setTimeout(typeTagline, typingSpeed);
    }

    typeTagline();
  }

  // 2. Headline typewriter: Types greeting prefix and name
  const greetingPrefixEl = document.getElementById('typewriter-greeting-prefix');
  const nameEl = document.getElementById('typewriter-name');
  
  if (greetingPrefixEl && nameEl) {
    const prefixText = "Hi, I'm ";
    const nameText = "Tejas Sharad Kute";
    let index = 0;

    function typePrefix() {
      if (index < prefixText.length) {
        greetingPrefixEl.textContent += prefixText.charAt(index);
        index++;
        setTimeout(typePrefix, 90);
      } else {
        index = 0;
        typeName();
      }
    }

    function typeName() {
      if (index < nameText.length) {
        nameEl.textContent += nameText.charAt(index);
        index++;
        setTimeout(typeName, 85);
      }
    }

    typePrefix();
  }
}
