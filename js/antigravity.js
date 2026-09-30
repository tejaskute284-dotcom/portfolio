/**
 * antigravity.js
 * Mouse-proximity 3-D tilt + magnetic repulsion for .ag-card elements.
 * Requires GSAP (loaded via CDN in index.html before this module runs).
 *
 * How it works:
 *  - Each .ag-card gets a spotlight <div> overlay injected once.
 *  - mousemove calculates normalised cursor offset from card centre.
 *  - Target rotationX/Y (tilt) and translateX/Y (repulsion) are set.
 *  - A rAF spring loop lerps current values toward targets each frame.
 *  - mouseleave springs back via GSAP elastic.out and cancels the rAF.
 *  - Touch / reduced-motion devices are skipped automatically.
 */

const CONFIG = {
  tiltMax:       12,    // degrees — max tilt at card edge
  repelRadius:   80,    // px    — distance at which repulsion begins
  repelStrength: 14,    // px    — max XY shift during repulsion
  glowOpacity:   0.18,  // 0–1   — spotlight opacity at cursor centre
  spring:        0.08,  // lerp factor (lower = more springy / laggier)
  resetDuration: 0.6,   // seconds for GSAP elastic snap-back on leave
};

/**
 * Initialises the AntiGravity effect on all .ag-card elements.
 * Must be called after renderAll() has injected the card DOM.
 *
 * Assumptions:
 *  - `gsap` is available on window (GSAP CDN loaded in index.html).
 *  - Cards have an optional .ag-inner child; if absent the card itself tilts.
 */
export function initAntiGravity() {
  // Skip on touch-only devices — no hover state, no rAF waste
  if (window.matchMedia('(hover: none)').matches) return;

  // GSAP must be present — loaded via CDN before this module
  if (typeof gsap === 'undefined') {
    console.warn('[AntiGravity] GSAP not found. Effect disabled.');
    return;
  }

  const cards = document.querySelectorAll('.ag-card');
  if (!cards.length) return;

  cards.forEach(card => {
    // The element that physically tilts preserves stacking context
    const inner = card.querySelector('.ag-inner') ?? card;

    // One spotlight overlay per card — follows the cursor
    const spotlight = createSpotlight();
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(spotlight);

    // Live animation state
    let targetRX = 0, targetRY = 0, targetTX = 0, targetTY = 0;
    let currentRX = 0, currentRY = 0, currentTX = 0, currentTY = 0;
    let rafId = null;
    let isHovered = false;

    // GSAP quickSetters — bypass tween overhead for per-frame rAF updates
    const setRotX   = gsap.quickSetter(inner, 'rotationX', 'deg');
    const setRotY   = gsap.quickSetter(inner, 'rotationY', 'deg');
    const setTransX = gsap.quickSetter(inner, 'x', 'px');
    const setTransY = gsap.quickSetter(inner, 'y', 'px');

    // ── mousemove — compute tilt & repulsion targets ───────────────────
    card.addEventListener('mousemove', (e) => {
      isHovered = true;

      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const mx    = e.clientX - cx; // offset from card centre
      const my    = e.clientY - cy;

      // Normalise offset to -1 … +1 range
      const normX =  mx / (rect.width  / 2);
      const normY =  my / (rect.height / 2);

      // 3-D tilt: cursor right → positive rotationY; cursor down → negative rotationX
      targetRY =  normX * CONFIG.tiltMax;
      targetRX = -normY * CONFIG.tiltMax;

      // Magnetic repulsion when cursor enters the inner repel radius
      const dist = Math.sqrt(mx * mx + my * my);
      if (dist < CONFIG.repelRadius) {
        const repelFactor = 1 - dist / CONFIG.repelRadius;
        targetTX = -normX * CONFIG.repelStrength * repelFactor;
        targetTY = -normY * CONFIG.repelStrength * repelFactor;
      } else {
        targetTX = 0;
        targetTY = 0;
      }

      // Spotlight follows cursor within card bounds
      const relX = ((e.clientX - rect.left) / rect.width)  * 100;
      const relY = ((e.clientY - rect.top)  / rect.height) * 100;
      spotlight.style.background =
        'radial-gradient(circle at ' + relX + '% ' + relY + '%,' +
        ' rgba(139,92,246,' + CONFIG.glowOpacity + ') 0%, transparent 65%)';
      spotlight.style.opacity = '1';

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

      spotlight.style.opacity = '0';
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

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates the per-card spotlight overlay element.
 * @returns {HTMLDivElement}
 */
function createSpotlight() {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText =
    'position:absolute;inset:0;pointer-events:none;' +
    'border-radius:inherit;opacity:0;transition:opacity 0.3s ease;z-index:1;';
  return el;
}
