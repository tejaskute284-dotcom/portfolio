// Typewriter Animation Module

export function initTypewriter() {
  // 1. Tagline typewriter (infinite cycle)
  const taglineEl = document.getElementById('typewriter-tagline');
  if (taglineEl) {
    const taglines = [
      "Building intelligent systems.",
      "Turning data into decisions.",
      "Shipping production-grade code."
    ];
    let tagIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeTagline() {
      const currentText = taglines[tagIndex];
      if (isDeleting) {
        taglineEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // faster delete
      } else {
        taglineEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // standard typing
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // pause at full text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        tagIndex = (tagIndex + 1) % taglines.length;
        typingSpeed = 500; // pause before next word
      }

      setTimeout(typeTagline, typingSpeed);
    }

    typeTagline();
  }

  // 2. Greeting typewriter ("Hi, I'm" -> Name)
  const greetingPrefixEl = document.getElementById('typewriter-greeting-prefix');
  const nameEl = document.getElementById('typewriter-name');
  
  if (greetingPrefixEl && nameEl) {
    const prefixText = "Hi, I'm";
    const nameText = " Mr. Tejas Sharad Kute";
    let index = 0;

    function typePrefix() {
      if (index < prefixText.length) {
        greetingPrefixEl.textContent += prefixText.charAt(index);
        index++;
        setTimeout(typePrefix, 120);
      } else {
        // start typing name after prefix is done
        index = 0;
        typeName();
      }
    }

    function typeName() {
      if (index < nameText.length) {
        nameEl.textContent += nameText.charAt(index);
        index++;
        setTimeout(typeName, 100);
      }
    }

    // Initialize greeting typing
    typePrefix();
  }
}
