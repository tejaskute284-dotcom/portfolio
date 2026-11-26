// neural-3d.js — Dark Cinematic Neural Orbit & Particle Wave Universe (Three.js)
// Layers:
//   1. Obsidian / Midnight atmospheric backdrop + deep-space dust
//   2. Multi-depth floating golden & slate-navy particles (with depth-of-field sizing)
//   3. Delicate neural network connections + traveling golden light signals along edges
//   4. 3D flowing golden particle wave landscape along the bottom of the hero
//   5. Elliptical golden orbital rings + traveling orbital particles outside the portrait arch

let activeNeuralCleanup = null;

function createSoftParticleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.32, 'rgba(255, 255, 255, 0.78)');
  grad.addColorStop(0.68, 'rgba(255, 255, 255, 0.18)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function initNeural3D() {
  if (typeof activeNeuralCleanup === 'function') {
    activeNeuralCleanup();
    activeNeuralCleanup = null;
  }

  const container = document.getElementById('particles-js');
  if (!container) return;

  // Lightweight fallback if Three.js failed to load
  if (typeof THREE === 'undefined') {
    container.style.opacity = '0.85';
    return;
  }

  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');

  container.innerHTML = '';
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '0';
  container.style.overflow = 'hidden';

  const getDeviceTier = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 'desktop';
    if (w >= 768) return 'tablet';
    return 'mobile';
  };

  let tier = getDeviceTier();
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: tier !== 'mobile',
      powerPreference: 'low-power'
    });
  } catch {
    // Graceful WebGL fallback: keep CSS obsidian/midnight radial & grid background
    container.style.opacity = '0.85';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, width / Math.max(height, 1), 1, 1400);
  camera.position.z = 360;

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  const softTexture = createSoftParticleTexture();
  const disposables = [];
  if (softTexture) disposables.push(softTexture);

  // Measure actual portrait arch position in Three.js world space at z = 0
  const portraitMetrics = {
    worldX: 115,
    worldY: 0,
    exclRadiusX: 88,
    exclRadiusY: 112,
    orbitRadiusX: 112,
    orbitRadiusY: 134
  };

  const updatePortraitMetrics = () => {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;

    const vFovRad = (camera.fov * Math.PI) / 180;
    const worldHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
    const worldWidth = worldHeight * (width / Math.max(height, 1));

    const archEl = document.querySelector('#hero .portrait-arch-frame');
    if (archEl) {
      const cRect = container.getBoundingClientRect();
      const aRect = archEl.getBoundingClientRect();
      if (cRect.width > 0 && cRect.height > 0 && aRect.width > 0) {
        const centerPxX = aRect.left - cRect.left + aRect.width / 2;
        const centerPxY = aRect.top - cRect.top + aRect.height / 2;

        const normX = (centerPxX / cRect.width) - 0.5;
        const normY = 0.5 - (centerPxY / cRect.height);

        portraitMetrics.worldX = normX * worldWidth;
        portraitMetrics.worldY = normY * worldHeight;

        const halfW = (aRect.width / cRect.width) * worldWidth * 0.5;
        const halfH = (aRect.height / cRect.height) * worldHeight * 0.5;

        portraitMetrics.exclRadiusX = halfW + 16;
        portraitMetrics.exclRadiusY = halfH + 16;
        portraitMetrics.orbitRadiusX = halfW + 28;
        portraitMetrics.orbitRadiusY = halfH + 26;
      }
    }
    return { worldWidth, worldHeight };
  };

  const { worldWidth, worldHeight } = updatePortraitMetrics();
  const halfW = worldWidth * 0.5;
  const halfH = worldHeight * 0.5;

  const isInsidePortraitExclusion = (x, y) => {
    const dx = (x - portraitMetrics.worldX) / portraitMetrics.exclRadiusX;
    const dy = (y - portraitMetrics.worldY) / portraitMetrics.exclRadiusY;
    return (dx * dx + dy * dy) < 1.0;
  };

  // =========================================================================
  // LAYER 1: Deep-space atmospheric dust (slowest parallax)
  // =========================================================================
  const spaceCount = tier === 'desktop' ? 70 : tier === 'tablet' ? 40 : 20;
  const spacePos = new Float32Array(spaceCount * 3);
  const spaceColors = new Float32Array(spaceCount * 3);

  for (let i = 0; i < spaceCount; i++) {
    spacePos[i * 3]     = (Math.random() - 0.5) * worldWidth * 1.4;
    spacePos[i * 3 + 1] = (Math.random() - 0.5) * worldHeight * 1.3;
    spacePos[i * 3 + 2] = -150 - Math.random() * 190;

    const isGold = Math.random() < 0.22;
    if (isGold) {
      spaceColors[i * 3]     = 0.725 * 0.5;
      spaceColors[i * 3 + 1] = 0.604 * 0.5;
      spaceColors[i * 3 + 2] = 0.369 * 0.5;
    } else {
      spaceColors[i * 3]     = 0.25;
      spaceColors[i * 3 + 1] = 0.32;
      spaceColors[i * 3 + 2] = 0.44;
    }
  }

  const spaceGeo = new THREE.BufferGeometry();
  spaceGeo.setAttribute('position', new THREE.BufferAttribute(spacePos, 3));
  spaceGeo.setAttribute('color', new THREE.BufferAttribute(spaceColors, 3));
  const spaceMat = new THREE.PointsMaterial({
    size: 2.5,
    map: softTexture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const spacePoints = new THREE.Points(spaceGeo, spaceMat);
  scene.add(spacePoints);
  disposables.push(spaceGeo, spaceMat);

  // =========================================================================
  // LAYER 2 & 3: Golden Neural Network Particles + Connecting Lines + Signals
  // =========================================================================
  const nodeCount = tier === 'desktop' ? 48 : tier === 'tablet' ? 26 : 12;
  const nodePos = new Float32Array(nodeCount * 3);
  const nodeColors = new Float32Array(nodeCount * 3);
  const nodeMeta = [];

  for (let i = 0; i < nodeCount; i++) {
    let x, y;
    let attempts = 0;
    do {
      // 76% weighted right/upper-center; 24% sparse quiet left perimeter
      if (i < nodeCount * 0.76) {
        x = -halfW * 0.14 + Math.random() * (halfW * 1.16);
      } else {
        x = -halfW * 0.94 + Math.random() * (halfW * 0.76);
      }
      y = (Math.random() - 0.5) * worldHeight * 0.92;
      attempts++;
    } while (isInsidePortraitExclusion(x, y) && attempts < 14);

    if (isInsidePortraitExclusion(x, y)) {
      x = portraitMetrics.worldX + (x >= portraitMetrics.worldX ? 1 : -1) * (portraitMetrics.exclRadiusX + 18);
    }

    const z = -95 + Math.random() * 135;
    nodePos[i * 3]     = x;
    nodePos[i * 3 + 1] = y;
    nodePos[i * 3 + 2] = z;

    const brightness = 0.55 + Math.random() * 0.45;
    const isChampagne = Math.random() < 0.35;
    if (isChampagne) {
      nodeColors[i * 3]     = 0.820 * brightness; // #D1B77E
      nodeColors[i * 3 + 1] = 0.718 * brightness;
      nodeColors[i * 3 + 2] = 0.494 * brightness;
    } else {
      nodeColors[i * 3]     = 0.725 * brightness; // #B99A5E
      nodeColors[i * 3 + 1] = 0.604 * brightness;
      nodeColors[i * 3 + 2] = 0.369 * brightness;
    }

    nodeMeta.push({
      vx: (Math.random() - 0.5) * 0.075,
      vy: (Math.random() - 0.5) * 0.075,
      vz: (Math.random() - 0.5) * 0.038,
      phase: Math.random() * Math.PI * 2
    });
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
  const nodeMat = new THREE.PointsMaterial({
    size: tier === 'mobile' ? 4.0 : 5.0,
    map: softTexture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodePoints);
  disposables.push(nodeGeo, nodeMat);

  // Neural connections & traveling edge light signals
  let lineGeo = null;
  let lineMat = null;
  let linePos = null;
  let lineCol = null;
  const maxTotalLines = tier === 'desktop' ? 96 : tier === 'tablet' ? 38 : 0;

  let edgeSignalGeo = null;
  let edgeSignalMat = null;
  let edgeSignalPos = null;
  const edgeSignalCount = tier === 'desktop' ? 10 : tier === 'tablet' ? 5 : 0;
  const edgeSignals = [];

  if (maxTotalLines > 0) {
    linePos = new Float32Array(maxTotalLines * 6);
    lineCol = new Float32Array(maxTotalLines * 6);
    lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));
    disposables.push(lineGeo, lineMat);

    if (edgeSignalCount > 0) {
      edgeSignalPos = new Float32Array(edgeSignalCount * 3);
      edgeSignalGeo = new THREE.BufferGeometry();
      edgeSignalGeo.setAttribute('position', new THREE.BufferAttribute(edgeSignalPos, 3));
      edgeSignalMat = new THREE.PointsMaterial({
        color: 0xD1B77E,
        size: 6.2,
        map: softTexture || undefined,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      scene.add(new THREE.Points(edgeSignalGeo, edgeSignalMat));
      disposables.push(edgeSignalGeo, edgeSignalMat);

      for (let s = 0; s < edgeSignalCount; s++) {
        edgeSignals.push({
          edgeIdx: s * 4,
          t: Math.random(),
          speed: 0.008 + Math.random() * 0.007
        });
      }
    }
  }

  // =========================================================================
  // LAYER 4: Animated Golden Particle Waves along the Bottom of the Hero
  // Hundreds of tiny golden particles forming a smooth 3D flowing landscape
  // =========================================================================
  let waveGeo = null;
  let waveMat = null;
  let wavePos = null;
  let waveCol = null;
  let waveCols = 0;
  let waveRows = 0;

  if (tier !== 'mobile') {
    waveCols = tier === 'desktop' ? 42 : 26;
    waveRows = tier === 'desktop' ? 13 : 9;
    const waveTotal = waveCols * waveRows;

    wavePos = new Float32Array(waveTotal * 3);
    waveCol = new Float32Array(waveTotal * 3);

    const waveWidth = worldWidth * 1.18;
    const waveDepth = 190;
    const baseY = -halfH * 0.62;

    let idx = 0;
    for (let r = 0; r < waveRows; r++) {
      const zNorm = r / (waveRows - 1);
      const z = -120 + zNorm * waveDepth;
      // Fade brightness smoothly toward front/back edges
      const rowFade = Math.sin(zNorm * Math.PI) * 0.72 + 0.18;

      for (let c = 0; c < waveCols; c++) {
        const xNorm = c / (waveCols - 1);
        const x = (xNorm - 0.5) * waveWidth;

        wavePos[idx * 3]     = x;
        wavePos[idx * 3 + 1] = baseY;
        wavePos[idx * 3 + 2] = z;

        const isSpark = (r * 7 + c * 13) % 19 === 0;
        if (isSpark) {
          waveCol[idx * 3]     = 0.820 * rowFade; // #D1B77E
          waveCol[idx * 3 + 1] = 0.718 * rowFade;
          waveCol[idx * 3 + 2] = 0.494 * rowFade;
        } else {
          waveCol[idx * 3]     = 0.725 * rowFade * 0.75; // #B99A5E
          waveCol[idx * 3 + 1] = 0.604 * rowFade * 0.75;
          waveCol[idx * 3 + 2] = 0.369 * rowFade * 0.75;
        }
        idx++;
      }
    }

    waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveCol, 3));
    waveMat = new THREE.PointsMaterial({
      size: tier === 'desktop' ? 2.8 : 2.5,
      map: softTexture || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(waveGeo, waveMat));
    disposables.push(waveGeo, waveMat);
  }

  // =========================================================================
  // LAYER 5: Portrait-Orbit Animation (Golden Orbital Rings + Particles)
  // Positioned strictly outside the portrait arch frame
  // =========================================================================
  const ringSegments = 72;
  const ringSpecs = tier === 'mobile'
    ? [{ scale: 1.02, z: -22, opacity: 0.22 }]
    : [
        { scale: 1.0,  z: -24, opacity: 0.26 },
        { scale: 1.14, z: -42, opacity: 0.14 }
      ];

  const orbitalRings = [];
  ringSpecs.forEach((spec, rIdx) => {
    const pts = new Float32Array(ringSegments * 3);
    for (let s = 0; s < ringSegments; s++) {
      const a = (s / ringSegments) * Math.PI * 2;
      pts[s * 3]     = portraitMetrics.worldX + Math.cos(a) * portraitMetrics.orbitRadiusX * spec.scale;
      pts[s * 3 + 1] = portraitMetrics.worldY + Math.sin(a) * portraitMetrics.orbitRadiusY * spec.scale;
      pts[s * 3 + 2] = spec.z + Math.sin(a + rIdx) * 10;
    }
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const rMat = new THREE.LineBasicMaterial({
      color: rIdx === 0 ? 0xB99A5E : 0xD1B77E,
      transparent: true,
      opacity: spec.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const rLoop = new THREE.LineLoop(rGeo, rMat);
    scene.add(rLoop);
    disposables.push(rGeo, rMat);
    orbitalRings.push({ geo: rGeo, pos: pts, scale: spec.scale, z: spec.z, phase: rIdx * 1.2 });
  });

  const orbitalCount = tier === 'desktop' ? 22 : tier === 'tablet' ? 14 : 8;
  const orbitalPos = new Float32Array(orbitalCount * 3);
  const orbitalCol = new Float32Array(orbitalCount * 3);
  const orbitalMeta = [];

  for (let i = 0; i < orbitalCount; i++) {
    const angle = (i / orbitalCount) * Math.PI * 2;
    const ringChoice = i % ringSpecs.length;
    const spec = ringSpecs[ringChoice];

    orbitalPos[i * 3]     = portraitMetrics.worldX + Math.cos(angle) * portraitMetrics.orbitRadiusX * spec.scale;
    orbitalPos[i * 3 + 1] = portraitMetrics.worldY + Math.sin(angle) * portraitMetrics.orbitRadiusY * spec.scale;
    orbitalPos[i * 3 + 2] = spec.z;

    const isChampagne = i % 3 === 0;
    orbitalCol[i * 3]     = isChampagne ? 0.820 : 0.725;
    orbitalCol[i * 3 + 1] = isChampagne ? 0.718 : 0.604;
    orbitalCol[i * 3 + 2] = isChampagne ? 0.494 : 0.369;

    orbitalMeta.push({
      angle,
      scale: spec.scale,
      zBase: spec.z,
      phase: ringChoice * 1.2,
      speed: (0.0011 + ringChoice * 0.0004) * (i % 2 === 0 ? 1 : 0.82)
    });
  }

  const orbitalGeo = new THREE.BufferGeometry();
  orbitalGeo.setAttribute('position', new THREE.BufferAttribute(orbitalPos, 3));
  orbitalGeo.setAttribute('color', new THREE.BufferAttribute(orbitalCol, 3));
  const orbitalMat = new THREE.PointsMaterial({
    size: tier === 'mobile' ? 3.2 : 4.2,
    map: softTexture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  scene.add(new THREE.Points(orbitalGeo, orbitalMat));
  disposables.push(orbitalGeo, orbitalMat);

  // =========================================================================
  // Subtle Mouse Parallax (Desktop fine-pointer only)
  // =========================================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const enableParallax = tier === 'desktop' && finePointerQuery.matches;
  const onMouseMove = (e) => {
    if (!enableParallax) return;
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 18;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 12;
  };
  if (enableParallax) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  let animId = null;
  let isTabVisible = !document.hidden;
  let isHeroInView = true;
  let isDisposed = false;
  let elapsed = 0;

  const connectDist = tier === 'desktop' ? 98 : 82;
  const connectDistSq = connectDist * connectDist;
  const degreeCounts = new Uint8Array(nodeCount);

  const renderSingleFrame = (step = true) => {
    if (step) elapsed += 0.016;

    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;
    camera.position.x = mouseX;
    camera.position.y = -mouseY;
    camera.lookAt(0, 0, 0);

    if (step) {
      spacePoints.rotation.y = Math.sin(elapsed * 0.035) * 0.025;
      spacePoints.rotation.x = Math.cos(elapsed * 0.028) * 0.015;
    }

    // Update Layer 2/3 nodes
    if (step) {
      for (let i = 0; i < nodeCount; i++) {
        const m = nodeMeta[i];
        let x = nodePos[i * 3] + m.vx + Math.sin(elapsed * 0.4 + m.phase) * 0.018;
        let y = nodePos[i * 3 + 1] + m.vy + Math.cos(elapsed * 0.35 + m.phase) * 0.018;
        let z = nodePos[i * 3 + 2] + m.vz;

        if (x < -halfW || x > halfW) m.vx *= -1;
        if (Math.abs(y) > halfH)     m.vy *= -1;
        if (z < -105 || z > 55)      m.vz *= -1;

        if (isInsidePortraitExclusion(x, y)) {
          m.vx *= -1;
          m.vy *= -1;
          x = nodePos[i * 3];
          y = nodePos[i * 3 + 1];
        }

        nodePos[i * 3]     = x;
        nodePos[i * 3 + 1] = y;
        nodePos[i * 3 + 2] = z;
      }
      nodeGeo.attributes.position.needsUpdate = true;
    }

    // Update Layer 3 neural connections & traveling edge light signals
    let connected = 0;
    if (lineGeo && linePos && lineCol) {
      degreeCounts.fill(0);
      let lineIdx = 0;
      let colorIdx = 0;

      for (let i = 0; i < nodeCount && connected < maxTotalLines; i++) {
        if (degreeCounts[i] >= 3) continue;
        if (nodePos[i * 3] < -halfW * 0.25) continue;

        for (let j = i + 1; j < nodeCount && connected < maxTotalLines; j++) {
          if (degreeCounts[j] >= 3) continue;

          const dx = nodePos[i * 3] - nodePos[j * 3];
          const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
          const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
          const dSq = dx * dx + dy * dy + dz * dz;

          if (dSq < connectDistSq) {
            const alpha = (1 - Math.sqrt(dSq) / connectDist) * 0.34;

            linePos[lineIdx++] = nodePos[i * 3];
            linePos[lineIdx++] = nodePos[i * 3 + 1];
            linePos[lineIdx++] = nodePos[i * 3 + 2];
            linePos[lineIdx++] = nodePos[j * 3];
            linePos[lineIdx++] = nodePos[j * 3 + 1];
            linePos[lineIdx++] = nodePos[j * 3 + 2];

            const r = 0.725 * alpha;
            const g = 0.604 * alpha;
            const b = 0.369 * alpha;

            lineCol[colorIdx++] = r;
            lineCol[colorIdx++] = g;
            lineCol[colorIdx++] = b;
            lineCol[colorIdx++] = r;
            lineCol[colorIdx++] = g;
            lineCol[colorIdx++] = b;

            degreeCounts[i]++;
            degreeCounts[j]++;
            connected++;
          }
        }
      }

      lineGeo.setDrawRange(0, connected * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Update golden signals gliding along active connecting lines
      if (edgeSignalGeo && edgeSignalPos && connected > 0) {
        for (let s = 0; s < edgeSignals.length; s++) {
          const sig = edgeSignals[s];
          if (step) {
            sig.t += sig.speed;
            if (sig.t >= 1) {
              sig.t = 0;
              sig.edgeIdx = Math.floor(Math.random() * connected);
            }
          }
          const eIdx = (sig.edgeIdx % connected) * 6;
          const x1 = linePos[eIdx];
          const y1 = linePos[eIdx + 1];
          const z1 = linePos[eIdx + 2];
          const x2 = linePos[eIdx + 3];
          const y2 = linePos[eIdx + 4];
          const z2 = linePos[eIdx + 5];

          edgeSignalPos[s * 3]     = x1 + (x2 - x1) * sig.t;
          edgeSignalPos[s * 3 + 1] = y1 + (y2 - y1) * sig.t;
          edgeSignalPos[s * 3 + 2] = z1 + (z2 - z1) * sig.t;
        }
        edgeSignalGeo.attributes.position.needsUpdate = true;
      }
    }

    // Update Layer 4 bottom golden particle wave landscape
    if (waveGeo && wavePos && step) {
      const baseY = -halfH * 0.64;
      let idx = 0;
      for (let r = 0; r < waveRows; r++) {
        for (let c = 0; c < waveCols; c++) {
          const x = wavePos[idx * 3];
          const z = wavePos[idx * 3 + 2];
          const elevation =
            Math.sin(x * 0.016 + elapsed * 0.65) * 11 +
            Math.cos(z * 0.025 + elapsed * 0.45) * 7 +
            Math.sin((x + z) * 0.01 + elapsed * 0.35) * 5;
          wavePos[idx * 3 + 1] = baseY + elevation;
          idx++;
        }
      }
      waveGeo.attributes.position.needsUpdate = true;
    }

    // Update Layer 5 orbital rings & particles around portrait arch
    if (step) {
      for (let r = 0; r < orbitalRings.length; r++) {
        const ring = orbitalRings[r];
        for (let s = 0; s < ringSegments; s++) {
          const a = (s / ringSegments) * Math.PI * 2;
          ring.pos[s * 3]     = portraitMetrics.worldX + Math.cos(a) * portraitMetrics.orbitRadiusX * ring.scale;
          ring.pos[s * 3 + 1] = portraitMetrics.worldY + Math.sin(a) * portraitMetrics.orbitRadiusY * ring.scale;
          ring.pos[s * 3 + 2] = ring.z + Math.sin(a + ring.phase + elapsed * 0.25) * 10;
        }
        ring.geo.attributes.position.needsUpdate = true;
      }

      for (let i = 0; i < orbitalCount; i++) {
        const o = orbitalMeta[i];
        o.angle += o.speed;
        orbitalPos[i * 3]     = portraitMetrics.worldX + Math.cos(o.angle) * portraitMetrics.orbitRadiusX * o.scale;
        orbitalPos[i * 3 + 1] = portraitMetrics.worldY + Math.sin(o.angle) * portraitMetrics.orbitRadiusY * o.scale;
        orbitalPos[i * 3 + 2] = o.zBase + Math.sin(o.angle + o.phase + elapsed * 0.25) * 10;
      }
      orbitalGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  const animate = () => {
    if (isDisposed || !isTabVisible || !isHeroInView || prefersReducedQuery.matches) {
      animId = null;
      return;
    }
    animId = requestAnimationFrame(animate);
    renderSingleFrame(true);
  };

  const startLoop = () => {
    if (prefersReducedQuery.matches) {
      renderSingleFrame(false);
      return;
    }
    if (!isDisposed && isTabVisible && isHeroInView && animId === null) {
      animId = requestAnimationFrame(animate);
    }
  };

  const stopLoop = () => {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };

  const disposeResources = () => {
    if (isDisposed) return;
    isDisposed = true;
    stopLoop();
    observer.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    prefersReducedQuery.removeEventListener('change', onMotionChange);

    disposables.forEach(item => {
      if (item && typeof item.dispose === 'function') item.dispose();
    });
    renderer.dispose();
    container.innerHTML = '';
  };

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
      startLoop();
    } else {
      stopLoop();
    }
  };

  const onMotionChange = () => {
    if (prefersReducedQuery.matches) {
      stopLoop();
      renderSingleFrame(false);
    } else {
      startLoop();
    }
  };

  let resizeTimer = null;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDisposed) return;
      const newTier = getDeviceTier();
      if (newTier !== tier) {
        initNeural3D();
        return;
      }
      updatePortraitMetrics();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 150);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroInView = entry.isIntersecting;
      if (isHeroInView) {
        startLoop();
      } else {
        stopLoop();
      }
    });
  }, { threshold: 0.05 });

  const heroSection = document.getElementById('hero') || container;
  observer.observe(heroSection);

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', onResize, { passive: true });
  prefersReducedQuery.addEventListener('change', onMotionChange);

  activeNeuralCleanup = disposeResources;
  startLoop();
}
