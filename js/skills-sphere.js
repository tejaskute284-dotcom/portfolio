// skills-sphere.js — Interactive 3D Technology Sphere (Fibonacci distribution)
// Pure Vanilla JS + CSS 3D Transforms. Smooth rotation with pause-on-hover & mouse steering.
// Displays actual verified technologies from the portfolio.

const SKILLS_LIST = [
  'Python', 'JavaScript', 'TypeScript', 'C / C++', 'SQL', 'MySQL',
  'React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Leaflet.js', 'Chart.js',
  'FastAPI', 'Node.js', 'Express.js', 'WebSockets', 'JWT Security', 'RBAC',
  'PostgreSQL', 'PostGIS', 'MongoDB', 'Supabase', 'Prisma ORM',
  'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Gemini Vision AI', 'NumPy', 'Pandas',
  'Git & GitHub', 'Postman', 'Linux', 'VS Code', 'Lenis Scroll'
];

export function initSkillsSphere() {
  const mountEl = document.getElementById('skills-sphere-mount');
  if (!mountEl) return;

  // Check if reduced motion or mobile: keep clean responsive grid fallback
  const isMobile = window.innerWidth < 1024;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || prefersReduced) {
    mountEl.style.display = 'none';
    const fallbackGrid = document.getElementById('skills-fallback-grid');
    if (fallbackGrid) fallbackGrid.style.display = 'grid';
    return;
  }

  mountEl.innerHTML = '';
  mountEl.style.display = 'block';

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

  // Fibonacci Sphere distribution
  const total = SKILLS_LIST.length;
  const radius = 175; // px sphere radius
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

  const items = [];

  SKILLS_LIST.forEach((skill, i) => {
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

    items.push({
      el,
      x: x * radius,
      y: y * radius,
      z: z * radius
    });
  });

  // Smooth Rotation State
  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0.0028; // slow continuous idle spin
  let isHovered = false;
  let animId = null;

  stage.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotX = 0;
    targetRotY = 0.0028;
  });

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Interactive mouse steering
    targetRotY = (e.clientX - cx) * 0.00008;
    targetRotX = -(e.clientY - cy) * 0.00008;
  });

  const renderFrame = () => {
    animId = requestAnimationFrame(renderFrame);

    // Apply rotation
    rotX += (targetRotX - rotX) * 0.05;
    rotY += (targetRotY - rotY) * 0.05;

    const sinX = Math.sin(rotX);
    const cosX = Math.cos(rotX);
    const sinY = Math.sin(rotY);
    const cosY = Math.cos(rotY);

    items.forEach(item => {
      // Rotate around Y axis
      let rx1 = item.x * cosY - item.z * sinY;
      let rz1 = item.z * cosY + item.x * sinY;

      // Rotate around X axis
      let ry2 = item.y * cosX - rz1 * sinX;
      let rz2 = rz1 * cosX + item.y * sinX;

      item.x = rx1;
      item.y = ry2;
      item.z = rz2;

      // Depth perception: scale & opacity based on Z coordinate
      const depthScale = (item.z + radius) / (2 * radius); // 0 (far) to 1 (near)
      const scale = 0.75 + depthScale * 0.45;              // 0.75 to 1.2
      const alpha = 0.35 + depthScale * 0.65;              // 0.35 to 1.0
      const zIndex = Math.round(depthScale * 100);

      item.el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${item.x}px, ${item.y}px, ${item.z}px) scale(${scale})`;
      item.el.style.opacity = alpha;
      item.el.style.zIndex = zIndex;

      // Enhance front-facing items with champagne gold border
      if (depthScale > 0.8) {
        item.el.classList.add('border-accentGoldMuted');
        item.el.classList.remove('border-border');
      } else {
        item.el.classList.remove('border-accentGoldMuted');
        item.el.classList.add('border-border');
      }
    });
  };

  renderFrame();

  // Resize handler
  window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
      if (animId) cancelAnimationFrame(animId);
      mountEl.style.display = 'none';
      const fallbackGrid = document.getElementById('skills-fallback-grid');
      if (fallbackGrid) fallbackGrid.style.display = 'grid';
    } else {
      mountEl.style.display = 'block';
    }
  });
}

