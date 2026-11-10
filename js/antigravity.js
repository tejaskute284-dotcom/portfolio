/**
 * antigravity.js
 * Clean mouse-proximity 3-D tilt for .ag-card elements.
 * Removed all color/purple spotlight overlays to preserve clean luxury editorial aesthetic.
 * Requires GSAP (loaded via CDN in index.html before this module runs).
 */

const CONFIG = {
  tiltMax: 10,          // degrees — max subtle tilt at card edge
  repelRadius: 70,      // px — distance at which magnetic float begins
  repelStrength: 10,    // px — max XY shift during subtle float
  spring: 0.08,         // lerp factor (smooth spring)
  resetDuration: 0.6,   // seconds for GSAP elastic snap-back on leave
};

/**
 * Initialises the AntiGravity effect on all .ag-card elements.
 * Must be called after renderAll() has injected the card DOM.
 */
export function initAntiGravity() {
  // Skip on touch-only devices — no hover state, no rAF waste
  if (window.matchMedia('(hover: none)').matches) return;

  // GSAP must be present — loaded via CDN before this module
  if (typeof gsap === 'undefined') {
    return;
  }

  const cards = document.querySelectorAll('.ag-card');
  if (!cards.length) return;

  cards.forEach(card => {
    // The element that physically tilts preserves stacking context
    const inner = card.querySelector('.ag-inner') ?? card;
    card.style.position = 'relative';

    // Live animation state
    let targetRX = 0, targetRY = 0, targetTX = 0, targetTY = 0;
    let currentRX = 0, currentRY = 0, currentTX = 0, currentTY = 0;
    let rafId = null;
    let isHovered = false;

    // GSAP quickSetters — bypass tween overhead for per-frame rAF updates
    const setRotX = gsap.quickSetter(inner, 'rotationX', 'deg');
    const setRotY = gsap.quickSetter(inner, 'rotationY', 'deg');
    const setTransX = gsap.quickSetter(inner, 'x', 'px');
    const setTransY = gsap.quickSetter(inner, 'y', 'px');

    // ── mousemove — compute subtle tilt targets (no color injection) ───────
    card.addEventListener('mousemove', (e) => {
      isHovered = true;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const mx = e.clientX - cx; // offset from card centre
      const my = e.clientY - cy;

      // Normalise offset to -1 … +1 range
      const normX = mx / (rect.width / 2);
      const normY = my / (rect.height / 2);

      // 3-D tilt: cursor right → positive rotationY; cursor down → negative rotationX
      targetRY = normX * CONFIG.tiltMax;
      targetRX = -normY * CONFIG.tiltMax;

      // Subtle float when cursor enters the inner radius
      const dist = Math.sqrt(mx * mx + my * my);
      if (dist < CONFIG.repelRadius) {
        const repelFactor = 1 - dist / CONFIG.repelRadius;
        targetTX = -normX * CONFIG.repelStrength * repelFactor;
        targetTY = -normY * CONFIG.repelStrength * repelFactor;
      } else {
        targetTX = 0;
        targetTY = 0;
      }

      // Start the rAF loop if not already running
      if (!rafId) rafId = requestAnimationFrame(loop);
    });

    // ── mouseleave — spring back to rest via GSAP elastic ─────────────
    card.addEventListener('mouseleave', () => {
      isHovered = false;

      // Reset targets immediately
      targetRX = 0; targetRY = 0;
      targetTX = 0; targetTY = 0;

      // GSAP handles the satisfying elastic snap-back
      gsap.to(inner, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        duration: CONFIG.resetDuration,
        ease: 'elastic.out(1, 0.5)',
        overwrite: true,
        onComplete: () => {
          currentRX = currentRY = currentTX = currentTY = 0;
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
      });
    });

    // ── rAF spring loop — lerps current values toward targets ──────────
    function loop() {
      currentRX += (targetRX - currentRX) * CONFIG.spring;
      currentRY += (targetRY - currentRY) * CONFIG.spring;
      currentTX += (targetTX - currentTX) * CONFIG.spring;
      currentTY += (targetTY - currentTY) * CONFIG.spring;

      setRotX(currentRX);
      setRotY(currentRY);
      setTransX(currentTX);
      setTransY(currentTY);

      // Continue while hovered; mouseleave handles final snap via GSAP
      if (isHovered) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }
  });
}

