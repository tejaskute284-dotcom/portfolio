// skills-sphere.js — Cinematic Golden Orbit Technical Skills Visualization
// Combines:
//   - Three.js curved golden orbital paths, traveling light signals, and bottom 3D particle wave
//   - Deterministic collision-free floating technology badges preserving exact mastered/learning status

const SKILLS_DATA = [
  // Primary (Tier 1)
  { name: 'Python', tier: 'primary', status: 'mastered' },
  { name: 'JavaScript', tier: 'primary', status: 'mastered' },
  { name: 'TypeScript', tier: 'primary', status: 'mastered' },
  { name: 'React 18', tier: 'primary', status: 'mastered' },
  { name: 'Node.js', tier: 'primary', status: 'mastered' },
  { name: 'FastAPI', tier: 'primary', status: 'learning' },
  { name: 'PyTorch', tier: 'primary', status: 'learning' },
  { name: 'TensorFlow', tier: 'primary', status: 'learning' },
  { name: 'PostgreSQL', tier: 'primary', status: 'mastered' },
  { name: 'Gemini Vision AI', tier: 'primary', status: 'learning' },

  // Secondary (Tier 2)
  { name: 'C / C++', tier: 'secondary', status: 'mastered' },
  { name: 'HTML5 / Modern CSS', tier: 'secondary', status: 'mastered' },
  { name: 'SQL', tier: 'secondary', status: 'mastered' },
  { name: 'Express.js', tier: 'secondary', status: 'mastered' },
  { name: 'Tailwind CSS', tier: 'secondary', status: 'mastered' },
  { name: 'Vite', tier: 'secondary', status: 'mastered' },
  { name: 'MySQL', tier: 'secondary', status: 'mastered' },
  { name: 'MongoDB & Atlas', tier: 'secondary', status: 'mastered' },
  { name: 'REST APIs', tier: 'secondary', status: 'mastered' },
  { name: 'JWT Security', tier: 'secondary', status: 'mastered' },
  { name: 'Scikit-Learn', tier: 'secondary', status: 'mastered' },
  { name: 'NumPy', tier: 'secondary', status: 'mastered' },
  { name: 'Pandas', tier: 'secondary', status: 'mastered' },
  { name: 'PostGIS', tier: 'secondary', status: 'learning' },
  { name: 'Prisma ORM', tier: 'secondary', status: 'learning' },
  { name: 'Supabase', tier: 'secondary', status: 'learning' },
  { name: 'WebSockets', tier: 'secondary', status: 'learning' },
  { name: 'Framer Motion', tier: 'secondary', status: 'learning' },

  // Additional (Tier 3)
  { name: 'DSA Algorithms', tier: 'additional', status: 'mastered' },
  { name: 'RBAC', tier: 'additional', status: 'mastered' },
  { name: 'Leaflet.js', tier: 'additional', status: 'mastered' },
  { name: 'Chart.js', tier: 'additional', status: 'mastered' },
  { name: 'Lenis Scroll', tier: 'additional', status: 'mastered' },
  { name: 'Git & GitHub', tier: 'additional', status: 'mastered' },
  { name: 'Postman', tier: 'additional', status: 'mastered' },
  { name: 'Linux', tier: 'additional', status: 'mastered' },
  { name: 'VS Code', tier: 'additional', status: 'mastered' },
  { name: 'Cloudinary', tier: 'additional', status: 'mastered' },
  { name: 'Zod', tier: 'additional', status: 'mastered' }
];

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
  g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
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

  // Build stage DOM
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

  // Create deterministic badge elements
  const badgeNodes = SKILLS_DATA.map((skill, idx) => {
    const el = document.createElement('div');
    const isLearning = skill.status === 'learning';
    el.className = `skill-orbit-badge tier-${skill.tier} ${isLearning ? 'is-learning' : 'is-mastered'}`;
    el.setAttribute('title', `${skill.name} — ${isLearning ? 'Learning in Progress' : 'Production Mastered'}`);

    const dot = document.createElement('span');
    dot.className = 'skill-badge-dot';
    dot.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.textContent = skill.name;

    el.appendChild(dot);
    el.appendChild(label);

    // Deterministic gentle float parameters (small amplitudes inside collision margin)
    const dirX = idx % 2 === 0 ? 1 : -1;
    const dirY = idx % 3 === 0 ? -1 : 1;
    el.style.setProperty('--float-x', `${dirX * (2.5 + (idx % 3) * 1.1)}px`);
    el.style.setProperty('--float-y', `${dirY * (3 + (idx % 4) * 1.1)}px`);
    el.style.setProperty('--float-rot', `${dirX * 0.45}deg`);
    el.style.setProperty('--float-dur', `${5.8 + (idx % 5) * 0.9}s`);
    el.style.setProperty('--float-delay', `${-(idx % 7) * 0.65}s`);

    badgesLayer.appendChild(el);
    return { el, skill, idx, w: 0, h: 0, x: 0, y: 0 };
  });

  // =========================================================================
  // Deterministic Collision-Free Positioning Solver (Desktop & Tablet)
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
    const H = 540;
    const padX = 24;
    const padTop = 22;
    const padBottom = 105; // Reserve bottom space for flowing golden particle wave
    const usableW = Math.max(W - padX * 2, 300);
    const usableH = H - padTop - padBottom;
    const centerX = W * 0.5;
    const centerY = padTop + usableH * 0.48;

    // Measure actual rendered badge dimensions before positioning
    badgeNodes.forEach(b => {
      b.w = b.el.offsetWidth || 110;
      b.h = b.el.offsetHeight || 34;
    });

    // Initial deterministic elliptical distribution by tier
    const tierGroups = {
      primary: badgeNodes.filter(b => b.skill.tier === 'primary'),
      secondary: badgeNodes.filter(b => b.skill.tier === 'secondary'),
      additional: badgeNodes.filter(b => b.skill.tier === 'additional')
    };

    const placeEllipseGroup = (group, rxRatio, ryRatio, angleOffset) => {
      const len = group.length;
      group.forEach((b, i) => {
        const angle = angleOffset + (i / len) * Math.PI * 2;
        const cx = centerX + Math.cos(angle) * (usableW * rxRatio);
        const cy = centerY + Math.sin(angle) * (usableH * ryRatio);
        b.x = cx - b.w * 0.5;
        b.y = cy - b.h * 0.5;
      });
    };

    placeEllipseGroup(tierGroups.primary, 0.22, 0.22, -Math.PI * 0.15);
    placeEllipseGroup(tierGroups.secondary, 0.39, 0.38, 0.22);
    placeEllipseGroup(tierGroups.additional, 0.46, 0.45, 0.55);

    // Iterative deterministic AABB collision resolution
    const minGap = window.innerWidth >= 1024 ? 14 : 10;
    const maxIterations = 140;

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

        // Clamp strictly inside container bounds
        a.x = Math.max(padX, Math.min(W - padX - a.w, a.x));
        a.y = Math.max(padTop, Math.min(H - padBottom - a.h, a.y));
      }

      if (!moved) break;
    }

    // Apply computed deterministic coordinates
    badgeNodes.forEach(b => {
      b.el.style.setProperty('--base-x', `${Math.round(b.x)}px`);
      b.el.style.setProperty('--base-y', `${Math.round(b.y)}px`);
      b.el.style.transform = `translate3d(${Math.round(b.x)}px, ${Math.round(b.y)}px, 0)`;
    });
  };

  layoutBadges();

  // =========================================================================
  // Three.js Background Canvas: Golden Orbital Paths, Signals & Bottom Wave
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
    const h = canvasHost.clientHeight || stage.clientHeight || 360;
    if (w <= 0 || h <= 0 || typeof THREE === 'undefined') return;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: tier !== 'mobile',
        powerPreference: 'low-power'
      });
    } catch {
      return; // Graceful CSS-only fallback if WebGL unavailable
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

    // 1. Curved Golden Orbital Paths + Traveling Signals
    const orbitSpecs = tier === 'mobile'
      ? [{ rx: worldW * 0.42, ry: worldH * 0.34, rotZ: 0.12, rotX: 0.35, opacity: 0.22 }]
      : [
          { rx: worldW * 0.26, ry: worldH * 0.28, rotZ: -0.18, rotX: 0.42, opacity: 0.28 },
          { rx: worldW * 0.39, ry: worldH * 0.38, rotZ: 0.14,  rotX: 0.32, opacity: 0.20 },
          { rx: worldW * 0.47, ry: worldH * 0.44, rotZ: -0.08, rotX: 0.22, opacity: 0.14 }
        ];

    const orbitCurves = [];
    const signalCount = tier === 'mobile' ? 4 : tier === 'tablet' ? 8 : 14;
    const signalPos = new Float32Array(signalCount * 3);
    const signalCol = new Float32Array(signalCount * 3);
    const signalMeta = [];

    orbitSpecs.forEach((spec, idx) => {
      const segs = 96;
      const pts = [];
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        const px = Math.cos(a) * spec.rx;
        const py = Math.sin(a) * spec.ry;
        const pz = Math.sin(a * 2 + idx) * 22;

        // Apply subtle 3D orbital tilt
        const cosZ = Math.cos(spec.rotZ);
        const sinZ = Math.sin(spec.rotZ);
        const rx1 = px * cosZ - py * sinZ;
        const ry1 = px * sinZ + py * cosZ;

        const cosX = Math.cos(spec.rotX);
        const sinX = Math.sin(spec.rotX);
        const ry2 = ry1 * cosX - pz * sinX;
        const rz2 = ry1 * sinX + pz * cosX - 35;

        pts.push(new THREE.Vector3(rx1, ry2, rz2));
      }
      const oGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const oMat = new THREE.LineBasicMaterial({
        color: idx === 0 ? 0xD1B77E : 0xB99A5E,
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
      const isBright = s % 3 === 0;
      signalCol[s * 3]     = isBright ? 0.820 : 0.725;
      signalCol[s * 3 + 1] = isBright ? 0.718 : 0.604;
      signalCol[s * 3 + 2] = isBright ? 0.494 : 0.369;

      signalMeta.push({
        curveIdx: cIdx,
        t: Math.random(),
        speed: 0.0008 + (cIdx * 0.00025) + Math.random() * 0.0005
      });
    }

    const signalGeo = new THREE.BufferGeometry();
    signalGeo.setAttribute('position', new THREE.BufferAttribute(signalPos, 3));
    signalGeo.setAttribute('color', new THREE.BufferAttribute(signalCol, 3));
    const signalMat = new THREE.PointsMaterial({
      size: tier === 'mobile' ? 4.0 : 5.2,
      map: dotTex || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(signalGeo, signalMat));
    disposables.push(signalGeo, signalMat);

    // 2. Subtle Background Neural Particles
    const bgCount = tier === 'desktop' ? 45 : tier === 'tablet' ? 25 : 14;
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * worldW * 1.1;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * worldH * 0.95;
      bgPos[i * 3 + 2] = -60 - Math.random() * 140;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0x929BAA,
      size: 2.5,
      map: dotTex || undefined,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const bgPoints = new THREE.Points(bgGeo, bgMat);
    scene.add(bgPoints);
    disposables.push(bgGeo, bgMat);

    // 3. Bottom Flowing Golden Particle Wave (left-to-right flow)
    let waveGeo = null;
    let wavePos = null;
    let waveCols = 0;
    let waveRows = 0;

    if (tier !== 'mobile') {
      waveCols = tier === 'desktop' ? 38 : 24;
      waveRows = tier === 'desktop' ? 10 : 7;
      const totalWave = waveCols * waveRows;
      wavePos = new Float32Array(totalWave * 3);
      const waveCol = new Float32Array(totalWave * 3);

      const waveW = worldW * 1.12;
      const baseY = -worldH * 0.38;

      let idx = 0;
      for (let r = 0; r < waveRows; r++) {
        const zNorm = r / (waveRows - 1);
        const z = -90 + zNorm * 130;
        const fade = Math.sin(zNorm * Math.PI) * 0.72 + 0.18;

        for (let c = 0; c < waveCols; c++) {
          const xNorm = c / (waveCols - 1);
          wavePos[idx * 3]     = (xNorm - 0.5) * waveW;
          wavePos[idx * 3 + 1] = baseY;
          wavePos[idx * 3 + 2] = z;

          const isSpark = (r * 7 + c * 11) % 17 === 0;
          waveCol[idx * 3]     = (isSpark ? 0.820 : 0.725) * fade;
          waveCol[idx * 3 + 1] = (isSpark ? 0.718 : 0.604) * fade;
          waveCol[idx * 3 + 2] = (isSpark ? 0.494 : 0.369) * fade;
          idx++;
        }
      }

      waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
      waveGeo.setAttribute('color', new THREE.BufferAttribute(waveCol, 3));
      const waveMat = new THREE.PointsMaterial({
        size: 2.7,
        map: dotTex || undefined,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
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
        bgPoints.rotation.y = Math.sin(elapsed * 0.04) * 0.03;

        // Update orbital signals along pre-sampled curves
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

        // Update bottom golden particle wave (flowing left -> right)
        if (waveGeo && wavePos) {
          const baseY = -worldH * 0.38;
          let idx = 0;
          for (let r = 0; r < waveRows; r++) {
            for (let c = 0; c < waveCols; c++) {
              const x = wavePos[idx * 3];
              const z = wavePos[idx * 3 + 2];
              wavePos[idx * 3 + 1] = baseY +
                Math.sin(x * 0.018 - elapsed * 0.7) * 9 +
                Math.cos(z * 0.025 + elapsed * 0.45) * 6;
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

  // If Three.js wasn't mounted, still recalculate badge layout on resize
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
