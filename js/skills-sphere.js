// skills-sphere.js — Cinematic Golden Orbit Technical Skills Visualization
// Matches reference design:
//   - Centered, collision-free Vogel-phyllotaxis distribution (no empty center hole, no clipped edges)
//   - Crisp colored SVG technology icons inside dark pill badges with gold rim accents
//   - Three.js tilted golden orbital rings, traveling signals, corner neural constellations, and bottom particle wave

const SKILLS_DATA = [
  // Primary (Tier 1) — centered focal constellation
  { name: 'Python', tier: 'primary', status: 'mastered', icon: 'python' },
  { name: 'JavaScript', tier: 'primary', status: 'mastered', icon: 'js' },
  { name: 'TypeScript', tier: 'primary', status: 'mastered', icon: 'ts' },
  { name: 'React 18', tier: 'primary', status: 'mastered', icon: 'react' },
  { name: 'Node.js', tier: 'primary', status: 'mastered', icon: 'node' },
  { name: 'FastAPI', tier: 'primary', status: 'learning', icon: 'fastapi' },
  { name: 'PyTorch', tier: 'primary', status: 'learning', icon: 'pytorch' },
  { name: 'TensorFlow', tier: 'primary', status: 'learning', icon: 'tf' },
  { name: 'PostgreSQL', tier: 'primary', status: 'mastered', icon: 'db' },
  { name: 'Gemini Vision AI', tier: 'primary', status: 'learning', icon: 'ai' },

  // Secondary (Tier 2)
  { name: 'C / C++', tier: 'secondary', status: 'mastered', icon: 'code' },
  { name: 'HTML5 / Modern CSS', tier: 'secondary', status: 'mastered', icon: 'html' },
  { name: 'SQL', tier: 'secondary', status: 'mastered', icon: 'db' },
  { name: 'Express.js', tier: 'secondary', status: 'mastered', icon: 'node' },
  { name: 'Tailwind CSS', tier: 'secondary', status: 'mastered', icon: 'wind' },
  { name: 'Vite', tier: 'secondary', status: 'mastered', icon: 'bolt' },
  { name: 'MySQL', tier: 'secondary', status: 'mastered', icon: 'db' },
  { name: 'MongoDB & Atlas', tier: 'secondary', status: 'mastered', icon: 'leaf' },
  { name: 'REST APIs', tier: 'secondary', status: 'mastered', icon: 'api' },
  { name: 'JWT Security', tier: 'secondary', status: 'mastered', icon: 'shield' },
  { name: 'Scikit-Learn', tier: 'secondary', status: 'mastered', icon: 'ml' },
  { name: 'NumPy', tier: 'secondary', status: 'mastered', icon: 'cube' },
  { name: 'Pandas', tier: 'secondary', status: 'mastered', icon: 'chart' },
  { name: 'PostGIS', tier: 'secondary', status: 'learning', icon: 'db' },
  { name: 'Prisma ORM', tier: 'secondary', status: 'learning', icon: 'prism' },
  { name: 'Supabase', tier: 'secondary', status: 'learning', icon: 'bolt' },
  { name: 'WebSockets', tier: 'secondary', status: 'learning', icon: 'api' },
  { name: 'Framer Motion', tier: 'secondary', status: 'learning', icon: 'motion' },

  // Additional (Tier 3)
  { name: 'DSA Algorithms', tier: 'additional', status: 'mastered', icon: 'code' },
  { name: 'RBAC', tier: 'additional', status: 'mastered', icon: 'shield' },
  { name: 'Leaflet.js', tier: 'additional', status: 'mastered', icon: 'leaf' },
  { name: 'Chart.js', tier: 'additional', status: 'mastered', icon: 'chart' },
  { name: 'Lenis Scroll', tier: 'additional', status: 'mastered', icon: 'wind' },
  { name: 'Git & GitHub', tier: 'additional', status: 'mastered', icon: 'git' },
  { name: 'Postman', tier: 'additional', status: 'mastered', icon: 'rocket' },
  { name: 'Linux', tier: 'additional', status: 'mastered', icon: 'terminal' },
  { name: 'VS Code', tier: 'additional', status: 'mastered', icon: 'vscode' },
  { name: 'Cloudinary', tier: 'additional', status: 'mastered', icon: 'cloud' },
  { name: 'Zod', tier: 'additional', status: 'mastered', icon: 'shield' }
];

const ICON_SVGS = {
  react: '<svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" stroke-width="1.6" class="w-4 h-4"><circle cx="12" cy="12" r="2.1" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>',
  ts: '<svg viewBox="0 0 24 24" class="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6"/><text x="12" y="16.5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="700" font-family="sans-serif">TS</text></svg>',
  js: '<svg viewBox="0 0 24 24" class="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E"/><text x="12" y="16.5" text-anchor="middle" fill="#101A2C" font-size="10" font-weight="800" font-family="sans-serif">JS</text></svg>',
  python: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M12 3c-4 0-3.8 1.8-3.8 1.8v2h3.9v.7H6.6S4 7.2 4 11.1c0 3.9 2.3 3.8 2.3 3.8h1.4v-1.8s-.1-2.3 2.2-2.3h3.9s2.2 0 2.2-2.1V5.1S16.3 3 12 3z" fill="#3776AB"/><path d="M12 21c4 0 3.8-1.8 3.8-1.8v-2h-3.9v-.7h5.5s2.6.3 2.6-3.6c0-3.9-2.3-3.8-2.3-3.8h-1.4v1.8s.1 2.3-2.2 2.3h-3.9s-2.2 0-2.2 2.1v3.6S7.7 21 12 21z" fill="#FFD43B"/></svg>',
  node: '<svg viewBox="0 0 24 24" fill="none" stroke="#68A063" stroke-width="1.8" class="w-4 h-4"><polygon points="12 2 20.5 7 20.5 17 12 22 3.5 17 3.5 7"/><path d="M9 14.5c0 1 1.2 1.8 3 1.8s3-.7 3-1.8c0-2-6-1-6-3 0-1 1.2-1.7 3-1.7s2.8.6 3 1.5"/></svg>',
  fastapi: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><circle cx="12" cy="12" r="9.5" fill="#009688"/><path d="M13 6l-5 7h4l-1 5 5-7h-4l1-5z" fill="#FFFFFF"/></svg>',
  pytorch: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M16.5 6.5a6.5 6.5 0 1 1-9 0l2-2 1.4 1.4-2 2a4.5 4.5 0 1 0 6.2 0z" fill="#EE4C2C"/><circle cx="15" cy="5.5" r="1.4" fill="#EE4C2C"/></svg>',
  tf: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M12 3L4 7.5v4l4-2.2V19l4 2.2V11.5l3 1.7V9.5L12 7.8V3zm0 0l8 4.5v4l-4-2.2v3.2l-2-1.1V8.2L12 7V3z" fill="#FF6F00"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" fill="#D1B77E"/></svg>',
  db: '<svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="1.8" class="w-4 h-4"><ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6"/><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M12 2C7 7 6 12.5 12 21c6-8.5 5-14 0-19z" fill="#47A248"/><path d="M12 7v14" stroke="#E9E7E1" stroke-width="1.2"/></svg>',
  prism: '<svg viewBox="0 0 24 24" fill="none" stroke="#E9E7E1" stroke-width="1.8" class="w-4 h-4"><polygon points="12 3 20 18 12 21 4 18"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" stroke-width="1.8" class="w-4 h-4"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/></svg>',
  ml: '<svg viewBox="0 0 24 24" fill="none" stroke="#F89939" stroke-width="1.8" class="w-4 h-4"><circle cx="7" cy="14" r="3.5" fill="#F89939" fill-opacity="0.25"/><circle cx="15.5" cy="9.5" r="4" fill="#3499CD" fill-opacity="0.3" stroke="#3499CD"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="#4DABCF" stroke-width="1.8" class="w-4 h-4"><polygon points="12 2 20 6.5 20 17.5 12 22 4 17.5 4 6.5"/><polyline points="4 6.5 12 11 20 6.5"/><line x1="12" y1="11" x2="12" y2="22"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" class="w-4 h-4"><line x1="6" y1="19" x2="6" y2="11"/><line x1="12" y1="19" x2="12" y2="5"/><line x1="18" y1="19" x2="18" y2="14"/></svg>',
  wind: '<svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="1.8" class="w-4 h-4"><path d="M3 10c2-3 5-3 7 0s5 3 7 0"/><path d="M5 15c2-3 5-3 7 0s5 3 7 0"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#3ECF8E"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="#F05032" stroke-width="1.8" class="w-4 h-4"><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="8" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M6 8.2v7.6M18 10.2C18 14 6 12 6 15.8"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="#FF6C37" stroke-width="1.8" class="w-4 h-4"><circle cx="12" cy="12" r="8"/><path d="M9 15l6-6M11 9h4v4"/></svg>',
  vscode: '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M16.5 3L7 11.5 3.5 9 2 10.5l3.8 2.5L2 15.5 3.5 17 7 14.5 16.5 21l4.5-2V5l-4.5-2z" fill="#007ACC"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" stroke-width="1.8" class="w-4 h-4"><rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 9 10 12 7 15"/><line x1="12" y1="15" x2="17" y2="15"/></svg>',
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="#E34F26" stroke-width="1.8" class="w-4 h-4"><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/><line x1="13" y1="5" x2="11" y2="19"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="#929BAA" stroke-width="1.8" class="w-4 h-4"><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/></svg>',
  api: '<svg viewBox="0 0 24 24" fill="none" stroke="#B99A5E" stroke-width="1.8" class="w-4 h-4"><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="18" cy="17" r="2.2"/><line x1="8" y1="11" x2="16" y2="8"/><line x1="8" y1="13" x2="16" y2="16"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="1.8" class="w-4 h-4"><path d="M17.5 18H7a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-1.3A3.5 3.5 0 0 1 17.5 18z"/></svg>',
  motion: '<svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" stroke-width="1.8" class="w-4 h-4"><path d="M5 5h14l-7 7h7l-7 7-7-7h7l-7-7z"/></svg>'
};

let activeSkillsCleanup = null;

function createSoftDotTexture() {
  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.32, 'rgba(255,255,255,0.82)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function initSkillsSphere() {
  if (typeof activeSkillsCleanup === 'function') {
    activeSkillsCleanup();
    activeSkillsCleanup = null;
  }

  const mountEl = document.getElementById('skills-sphere-mount');
  if (!mountEl) return;

  mountEl.innerHTML = '';
  mountEl.style.display = 'block';

  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const stage = document.createElement('div');
  stage.className = 'skills-orbit-stage';

  const canvasHost = document.createElement('div');
  canvasHost.className = 'skills-orbit-canvas';
  canvasHost.setAttribute('aria-hidden', 'true');

  const badgesLayer = document.createElement('div');
  badgesLayer.className = 'skills-badges-layer';

  stage.appendChild(canvasHost);
  stage.appendChild(badgesLayer);
  mountEl.appendChild(stage);

  // Create badge elements with crisp SVG icons
  const badgeNodes = SKILLS_DATA.map((skill, idx) => {
    const el = document.createElement('div');
    const isLearning = skill.status === 'learning';
    el.className = `skill-orbit-badge tier-${skill.tier} ${isLearning ? 'is-learning' : 'is-mastered'}`;
    el.setAttribute('title', `${skill.name} — ${isLearning ? 'Learning in Progress' : 'Production Mastered'}`);

    const iconWrap = document.createElement('span');
    iconWrap.className = 'skill-badge-icon';
    iconWrap.setAttribute('aria-hidden', 'true');
    iconWrap.innerHTML = ICON_SVGS[skill.icon] || ICON_SVGS.code;

    const label = document.createElement('span');
    label.textContent = skill.name;

    el.appendChild(iconWrap);
    el.appendChild(label);

    if (isLearning) {
      const statusDot = document.createElement('span');
      statusDot.className = 'skill-badge-status';
      statusDot.setAttribute('aria-hidden', 'true');
      el.appendChild(statusDot);
    }

    const dirX = idx % 2 === 0 ? 1 : -1;
    const dirY = idx % 3 === 0 ? -1 : 1;
    el.style.setProperty('--float-x', `${dirX * (2.5 + (idx % 3) * 1.0)}px`);
    el.style.setProperty('--float-y', `${dirY * (3 + (idx % 4) * 1.0)}px`);
    el.style.setProperty('--float-rot', `${dirX * 0.4}deg`);
    el.style.setProperty('--float-dur', `${5.6 + (idx % 5) * 0.9}s`);
    el.style.setProperty('--float-delay', `${-(idx % 7) * 0.65}s`);

    badgesLayer.appendChild(el);
    return { el, skill, idx, w: 0, h: 0, x: 0, y: 0 };
  });

  // =========================================================================
  // Vogel Phyllotaxis + Deterministic Collision Solver (No Center Hole, Zero Clipping)
  // =========================================================================
  const layoutBadges = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      badgeNodes.forEach(b => {
        b.el.style.removeProperty('--base-x');
        b.el.style.removeProperty('--base-y');
      });
      return;
    }

    const W = badgesLayer.clientWidth || mountEl.clientWidth || 1000;
    const H = 580;
    const padX = 32;
    const padTop = 32;
    const padBottom = 115; // Clear separation above bottom golden wave
    const usableW = Math.max(W - padX * 2, 320);
    const usableH = H - padTop - padBottom;
    const centerX = W * 0.5;
    const centerY = padTop + usableH * 0.48;

    badgeNodes.forEach(b => {
      b.w = b.el.offsetWidth || 120;
      b.h = b.el.offsetHeight || 36;
    });

    // Vogel phyllotaxis fills the entire ellipse evenly from center outward
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const total = badgeNodes.length;

    badgeNodes.forEach((b, i) => {
      const normR = i === 0 ? 0 : Math.sqrt((i + 0.4) / total);
      const theta = i * goldenAngle + 0.4;
      const cx = centerX + Math.cos(theta) * (usableW * 0.46) * normR;
      const cy = centerY + Math.sin(theta) * (usableH * 0.45) * normR;
      b.x = cx - b.w * 0.5;
      b.y = cy - b.h * 0.5;
    });

    const minGap = window.innerWidth >= 1024 ? 16 : 11;
    const maxIterations = 160;

    for (let iter = 0; iter < maxIterations; iter++) {
      let moved = false;

      for (let i = 0; i < badgeNodes.length; i++) {
        const a = badgeNodes[i];

        for (let j = i + 1; j < badgeNodes.length; j++) {
          const b = badgeNodes[j];

          const aCx = a.x + a.w * 0.5;
          const aCy = a.y + a.h * 0.5;
          const bCx = b.x + b.w * 0.5;
          const bCy = b.y + b.h * 0.5;

          const overlapX = (a.w + b.w) * 0.5 + minGap - Math.abs(aCx - bCx);
          const overlapY = (a.h + b.h) * 0.5 + minGap - Math.abs(aCy - bCy);

          if (overlapX > 0 && overlapY > 0) {
            moved = true;
            if (overlapX < overlapY) {
              const push = overlapX * 0.52;
              const dir = aCx <= bCx ? -1 : 1;
              a.x += dir * push;
              b.x -= dir * push;
            } else {
              const push = overlapY * 0.52;
              const dir = aCy <= bCy ? -1 : 1;
              a.y += dir * push;
              b.y -= dir * push;
            }
          }
        }

        a.x = Math.max(padX, Math.min(W - padX - a.w, a.x));
        a.y = Math.max(padTop, Math.min(H - padBottom - a.h, a.y));
      }

      if (!moved) break;
    }

    badgeNodes.forEach(b => {
      b.el.style.setProperty('--base-x', `${Math.round(b.x)}px`);
      b.el.style.setProperty('--base-y', `${Math.round(b.y)}px`);
      b.el.style.transform = `translate3d(${Math.round(b.x)}px, ${Math.round(b.y)}px, 0)`;
    });
  };

  layoutBadges();

  // =========================================================================
  // Three.js Background Canvas: Tilted Orbital Rings, Corner Constellations & Bottom Wave
  // =========================================================================
  let renderer = null;
  let animId = null;
  let isDisposed = false;
  let isTabVisible = !document.hidden;
  let isSectionInView = true;
  const disposables = [];

  const getTier = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 'desktop';
    if (w >= 768) return 'tablet';
    return 'mobile';
  };
  let tier = getTier();

  const initThreeLayer = () => {
    const w = canvasHost.clientWidth || stage.clientWidth || window.innerWidth;
    const h = canvasHost.clientHeight || stage.clientHeight || 380;
    if (w <= 0 || h <= 0 || typeof THREE === 'undefined') return;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: tier !== 'mobile',
        powerPreference: 'low-power'
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
    camera.position.z = 320;

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    canvasHost.appendChild(renderer.domElement);

    const dotTex = createSoftDotTexture();
    if (dotTex) disposables.push(dotTex);

    const vFov = (camera.fov * Math.PI) / 180;
    const worldH = 2 * Math.tan(vFov / 2) * camera.position.z;
    const worldW = worldH * (w / h);

    // 1. Crisp Tilted Golden Orbital Rings + Traveling Signals
    const orbitSpecs = tier === 'mobile'
      ? [{ rx: worldW * 0.42, ry: worldH * 0.34, rotZ: 0.12, rotX: 0.35, opacity: 0.28 }]
      : [
          { rx: worldW * 0.32, ry: worldH * 0.30, rotZ: -0.14, rotX: 0.45, opacity: 0.38 },
          { rx: worldW * 0.42, ry: worldH * 0.37, rotZ: 0.12,  rotX: 0.36, opacity: 0.28 },
          { rx: worldW * 0.48, ry: worldH * 0.41, rotZ: -0.06, rotX: 0.28, opacity: 0.20 },
          { rx: worldW * 0.24, ry: worldH * 0.22, rotZ: 0.20,  rotX: 0.50, opacity: 0.30 }
        ];

    const orbitCurves = [];
    const signalCount = tier === 'mobile' ? 4 : tier === 'tablet' ? 10 : 18;
    const signalPos = new Float32Array(signalCount * 3);
    const signalCol = new Float32Array(signalCount * 3);
    const signalMeta = [];

    orbitSpecs.forEach((spec, idx) => {
      const segs = 110;
      const pts = [];
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        const px = Math.cos(a) * spec.rx;
        const py = Math.sin(a) * spec.ry;
        const pz = Math.sin(a * 2 + idx) * 20;

        const cosZ = Math.cos(spec.rotZ);
        const sinZ = Math.sin(spec.rotZ);
        const rx1 = px * cosZ - py * sinZ;
        const ry1 = px * sinZ + py * cosZ;

        const cosX = Math.cos(spec.rotX);
        const sinX = Math.sin(spec.rotX);
        const ry2 = ry1 * cosX - pz * sinX + 10;
        const rz2 = ry1 * sinX + pz * cosX - 30;

        pts.push(new THREE.Vector3(rx1, ry2, rz2));
      }
      const oGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const oMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0xD1B77E : 0xB99A5E,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      scene.add(new THREE.Line(oGeo, oMat));
      disposables.push(oGeo, oMat);
      orbitCurves.push(pts);
    });

    for (let s = 0; s < signalCount; s++) {
      const cIdx = s % orbitCurves.length;
      const isBright = s % 2 === 0;
      signalCol[s * 3]     = isBright ? 0.92 : 0.78;
      signalCol[s * 3 + 1] = isBright ? 0.84 : 0.65;
      signalCol[s * 3 + 2] = isBright ? 0.62 : 0.42;

      signalMeta.push({
        curveIdx: cIdx,
        t: Math.random(),
        speed: 0.0009 + (cIdx * 0.00025) + Math.random() * 0.0005
      });
    }

    const signalGeo = new THREE.BufferGeometry();
    signalGeo.setAttribute('position', new THREE.BufferAttribute(signalPos, 3));
    signalGeo.setAttribute('color', new THREE.BufferAttribute(signalCol, 3));
    const signalMat = new THREE.PointsMaterial({
      size: tier === 'mobile' ? 4.2 : 6.0,
      map: dotTex || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(signalGeo, signalMat));
    disposables.push(signalGeo, signalMat);

    // 2. Corner Neural Constellations (Upper-left & Upper-right atmospheric depth)
    if (tier !== 'mobile') {
      const cornerNodes = [];
      const cornerCount = 24;
      const cPos = new Float32Array(cornerCount * 3);
      for (let i = 0; i < cornerCount; i++) {
        const isRight = i >= cornerCount / 2;
        const x = (isRight ? 1 : -1) * (worldW * 0.30 + Math.random() * worldW * 0.22);
        const y = worldH * 0.16 + Math.random() * worldH * 0.34;
        const z = -60 - Math.random() * 80;
        cPos[i * 3] = x;
        cPos[i * 3 + 1] = y;
        cPos[i * 3 + 2] = z;
        cornerNodes.push(new THREE.Vector3(x, y, z));
      }
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
      const cMat = new THREE.PointsMaterial({
        color: 0xD1B77E,
        size: 3.4,
        map: dotTex || undefined,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      scene.add(new THREE.Points(cGeo, cMat));
      disposables.push(cGeo, cMat);

      const linePts = [];
      for (let i = 0; i < cornerNodes.length; i++) {
        for (let j = i + 1; j < cornerNodes.length; j++) {
          if (cornerNodes[i].distanceTo(cornerNodes[j]) < 85) {
            linePts.push(cornerNodes[i], cornerNodes[j]);
          }
        }
      }
      if (linePts.length > 0) {
        const lGeo = new THREE.BufferGeometry().setFromPoints(linePts);
        const lMat = new THREE.LineBasicMaterial({
          color: 0xB99A5E,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        scene.add(new THREE.LineSegments(lGeo, lMat));
        disposables.push(lGeo, lMat);
      }
    }

    // 3. Rich Bottom Flowing Golden Particle Wave (left-to-right flow)
    let waveGeo = null;
    let wavePos = null;
    let waveCols = 0;
    let waveRows = 0;

    if (tier !== 'mobile') {
      waveCols = tier === 'desktop' ? 54 : 32;
      waveRows = tier === 'desktop' ? 14 : 10;
      const totalWave = waveCols * waveRows;
      wavePos = new Float32Array(totalWave * 3);
      const waveCol = new Float32Array(totalWave * 3);

      const waveW = worldW * 1.16;
      const baseY = -worldH * 0.37;

      let idx = 0;
      for (let r = 0; r < waveRows; r++) {
        const zNorm = r / (waveRows - 1);
        const z = -95 + zNorm * 140;
        const fade = Math.sin(zNorm * Math.PI) * 0.82 + 0.18;

        for (let c = 0; c < waveCols; c++) {
          const xNorm = c / (waveCols - 1);
          wavePos[idx * 3]     = (xNorm - 0.5) * waveW;
          wavePos[idx * 3 + 1] = baseY;
          wavePos[idx * 3 + 2] = z;

          const isSpark = (r * 7 + c * 11) % 13 === 0;
          waveCol[idx * 3]     = (isSpark ? 0.94 : 0.78) * fade;
          waveCol[idx * 3 + 1] = (isSpark ? 0.85 : 0.65) * fade;
          waveCol[idx * 3 + 2] = (isSpark ? 0.60 : 0.40) * fade;
          idx++;
        }
      }

      waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
      waveGeo.setAttribute('color', new THREE.BufferAttribute(waveCol, 3));
      const waveMat = new THREE.PointsMaterial({
        size: 3.1,
        map: dotTex || undefined,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      scene.add(new THREE.Points(waveGeo, waveMat));
      disposables.push(waveGeo, waveMat);
    }

    let elapsed = 0;
    const renderFrame = (step = true) => {
      if (step) elapsed += 0.016;

      if (step) {
        for (let s = 0; s < signalMeta.length; s++) {
          const m = signalMeta[s];
          m.t = (m.t + m.speed) % 1;
          const pts = orbitCurves[m.curveIdx];
          const maxI = pts.length - 1;
          const f = m.t * maxI;
          const i0 = Math.floor(f);
          const i1 = Math.min(i0 + 1, maxI);
          const frac = f - i0;

          const p0 = pts[i0];
          const p1 = pts[i1];
          signalPos[s * 3]     = p0.x + (p1.x - p0.x) * frac;
          signalPos[s * 3 + 1] = p0.y + (p1.y - p0.y) * frac;
          signalPos[s * 3 + 2] = p0.z + (p1.z - p0.z) * frac;
        }
        signalGeo.attributes.position.needsUpdate = true;

        if (waveGeo && wavePos) {
          const baseY = -worldH * 0.37;
          let idx = 0;
          for (let r = 0; r < waveRows; r++) {
            for (let c = 0; c < waveCols; c++) {
              const x = wavePos[idx * 3];
              const z = wavePos[idx * 3 + 2];
              wavePos[idx * 3 + 1] = baseY +
                Math.sin(x * 0.016 - elapsed * 0.72) * 14 +
                Math.cos(z * 0.024 + elapsed * 0.45) * 9;
              idx++;
            }
          }
          waveGeo.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    const animate = () => {
      if (isDisposed || !isTabVisible || !isSectionInView || prefersReducedQuery.matches) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
      renderFrame(true);
    };

    const startLoop = () => {
      if (prefersReducedQuery.matches) {
        renderFrame(false);
        return;
      }
      if (!isDisposed && isTabVisible && isSectionInView && animId === null) {
        animId = requestAnimationFrame(animate);
      }
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) startLoop();
      else stopLoop();
    };

    const onMotionChange = () => {
      if (prefersReducedQuery.matches) {
        stopLoop();
        renderFrame(false);
      } else {
        startLoop();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionInView = entry.isIntersecting;
        if (isSectionInView) startLoop();
        else stopLoop();
      });
    }, { threshold: 0.05 });
    observer.observe(stage);

    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isDisposed) return;
        const nextTier = getTier();
        if (nextTier !== tier) {
          initSkillsSphere();
          return;
        }
        layoutBadges();
        const nw = canvasHost.clientWidth || stage.clientWidth;
        const nh = canvasHost.clientHeight || stage.clientHeight;
        if (nw > 0 && nh > 0 && renderer) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }, 150);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', onResize, { passive: true });
    prefersReducedQuery.addEventListener('change', onMotionChange);

    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      prefersReducedQuery.removeEventListener('change', onMotionChange);
      disposables.forEach(d => {
        if (d && typeof d.dispose === 'function') d.dispose();
      });
      if (renderer) renderer.dispose();
      canvasHost.innerHTML = '';
    };
  };

  const cleanupThree = initThreeLayer();

  let fallbackResizeTimer = null;
  const onFallbackResize = () => {
    if (fallbackResizeTimer) clearTimeout(fallbackResizeTimer);
    fallbackResizeTimer = setTimeout(layoutBadges, 150);
  };
  if (!cleanupThree) {
    window.addEventListener('resize', onFallbackResize, { passive: true });
  }

  activeSkillsCleanup = () => {
    isDisposed = true;
    if (typeof cleanupThree === 'function') cleanupThree();
    if (!cleanupThree) window.removeEventListener('resize', onFallbackResize);
  };
}
