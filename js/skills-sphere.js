// skills-sphere.js — Interactive 3D Technology Sphere (Fibonacci distribution)
// Pure Vanilla JS + CSS 3D Transforms. Smooth rotation with pause-on-hover & mouse steering.
// Preserves immutable base coordinates to eliminate floating-point drift.

const SKILLS_LIST = [
  'Python', 'JavaScript', 'TypeScript', 'C / C++', 'SQL', 'MySQL',
  'React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Leaflet.js', 'Chart.js',
  'FastAPI', 'Node.js', 'Express.js', 'WebSockets', 'JWT Security', 'RBAC',
  'PostgreSQL', 'PostGIS', 'MongoDB', 'Supabase', 'Prisma ORM',
  'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Gemini Vision AI', 'NumPy', 'Pandas',
  'Git & GitHub', 'Postman', 'Linux', 'VS Code', 'Lenis Scroll'
];

let activeCleanup = null;

export function initSkillsSphere() {
  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }

  const mountEl = document.getElementById('skills-sphere-mount');
  const fallbackGrid = document.getElementById('skills-fallback-grid');
  if (!mountEl) return;

  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shouldUseFallback = () => window.innerWidth < 1024 || prefersReducedQuery.matches;

  const showFallback = () => {
    mountEl.style.display = 'none';
    if (fallbackGrid) fallbackGrid.style.display = 'grid';
  };

  if (shouldUseFallback()) {
    showFallback();
  }

  mountEl.innerHTML = '';

  // Outer 3D perspective stage
  const stage = document.createElement('div');
  stage.className = 'skills-sphere-stage relative w-full h-[460px] flex items-center justify-center overflow-visible select-none';
  stage.style.perspective = '1000px';

  // Inner rotating globe container
  const sphere = document.createElement('div');
  sphere.className = 'skills-sphere-container relative w-[380px] h-[380px]';
  sphere.style.transformStyle = 'preserve-3d';
  stage.appendChild(sphere);
  mountEl.appendChild(stage);

  // Fibonacci Sphere distribution with immutable base coordinates
  const total = SKILLS_LIST.length;
  const radius = 175; // px sphere radius
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

  const items = SKILLS_LIST.map((skill, i) => {
    const y = 1 - (i / (total - 1)) * 2; // -1 to 1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const el = document.createElement('div');
    el.className = 'skills-sphere-item absolute top-1/2 left-1/2 cursor-pointer font-mono text-xs px-3 py-1.5 rounded-full border border-borderGold bg-bgSecondary/90 text-textPrimary backdrop-blur-sm shadow-md transition-colors duration-200';
    el.style.transformStyle = 'preserve-3d';
    el.style.whiteSpace = 'nowrap';
    el.textContent = skill;

    sphere.appendChild(el);

    return {
      el,
      baseX: x * radius,
      baseY: y * radius,
      baseZ: z * radius
    };
  });

  // Cumulative rotation angles & angular velocities
  let angleX = 0;
  let angleY = 0;
  let velX = 0;
  let velY = 0.0028; // slow continuous idle spin
  let targetVelX = 0;
  let targetVelY = 0.0028;
  let animId = null;
  let isSphereVisible = true;

  const onMouseEnter = () => {
    // Keep interactive mouse steering active
  };

  const onMouseLeave = () => {
    targetVelX = 0;
    targetVelY = 0.0028;
  };

  const onMouseMove = (e) => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetVelY = (e.clientX - cx) * 0.00008;
    targetVelX = -(e.clientY - cy) * 0.00008;
  };

  stage.addEventListener('mouseenter', onMouseEnter);
  stage.addEventListener('mouseleave', onMouseLeave);
  stage.addEventListener('mousemove', onMouseMove, { passive: true });

  const renderFrame = () => {
    if (shouldUseFallback() || !isSphereVisible || document.hidden) {
      animId = null;
      return;
    }

    animId = requestAnimationFrame(renderFrame);

    velX += (targetVelX - velX) * 0.05;
    velY += (targetVelY - velY) * 0.05;

    angleX += velX;
    angleY += velY;

    const sinX = Math.sin(angleX);
    const cosX = Math.cos(angleX);
    const sinY = Math.sin(angleY);
    const cosY = Math.cos(angleY);

    items.forEach(item => {
      // Compute rotation from immutable base coordinates
      const rx1 = item.baseX * cosY - item.baseZ * sinY;
      const rz1 = item.baseZ * cosY + item.baseX * sinY;

      const ry2 = item.baseY * cosX - rz1 * sinX;
      const rz2 = rz1 * cosX + item.baseY * sinX;

      const depthScale = (rz2 + radius) / (2 * radius); // 0 (far) to 1 (near)
      const scale = 0.75 + depthScale * 0.45;
      const alpha = 0.35 + depthScale * 0.65;
      const zIndex = Math.round(depthScale * 100);

      item.el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${rx1.toFixed(2)}px, ${ry2.toFixed(2)}px, ${rz2.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      item.el.style.opacity = alpha.toFixed(3);
      item.el.style.zIndex = zIndex;

      if (depthScale > 0.8) {
        item.el.classList.add('border-accentGoldMuted');
        item.el.classList.remove('border-border');
      } else {
        item.el.classList.remove('border-accentGoldMuted');
        item.el.classList.add('border-border');
      }
    });
  };

  const startLoop = () => {
    if (!shouldUseFallback() && isSphereVisible && !document.hidden && animId === null) {
      mountEl.style.display = 'block';
      animId = requestAnimationFrame(renderFrame);
    }
  };

  const stopLoop = () => {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };

  const onResizeOrMotionChange = () => {
    if (shouldUseFallback()) {
      stopLoop();
      showFallback();
    } else {
      mountEl.style.display = 'block';
      startLoop();
    }
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSphereVisible = entry.isIntersecting;
      if (isSphereVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(mountEl);

  window.addEventListener('resize', onResizeOrMotionChange, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  prefersReducedQuery.addEventListener('change', onResizeOrMotionChange);

  if (!shouldUseFallback()) {
    mountEl.style.display = 'block';
    startLoop();
  }

  activeCleanup = () => {
    stopLoop();
    observer.disconnect();
    stage.removeEventListener('mouseenter', onMouseEnter);
    stage.removeEventListener('mouseleave', onMouseLeave);
    stage.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResizeOrMotionChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    prefersReducedQuery.removeEventListener('change', onResizeOrMotionChange);
  };
}
