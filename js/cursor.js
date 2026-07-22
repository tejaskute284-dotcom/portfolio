// Custom Cursor Module (Desktop Only)

export function initCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isMoving) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isMoving = true;
    }
  });

  // Lerp loop for lagged ring follower
  function updateCursor() {
    // Dot position
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    // Ring position (lagged ring)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isMoving = false;
  });

  // Hover states over interactive elements
  const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, .premium-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'var(--accent-violet)';
      ring.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(1.5)`;
    });

    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'var(--accent-cyan)';
      ring.style.backgroundColor = 'transparent';
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(1)`;
    });
  });
}
