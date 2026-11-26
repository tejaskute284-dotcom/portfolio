// neural-3d.js — Ultra-Dark Cinematic AI Universe (Three.js)
// Multi-layer, portrait-aware 3D environment:
//   Layer 1: Deep-space atmospheric dust
//   Layer 2: Multi-depth floating particles (mostly navy/slate, selective antique gold)
//   Layer 3: Proximity neural network weighted away from left text & portrait face
//   Layer 4: Flowing antique-gold energy trails & traveling data signals
//   Layer 5: Elliptical 3D orbital particles hugging the outer portrait arch

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
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.72)');
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.16)');
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
  if (!container || typeof THREE === 'undefined') return;

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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, width / Math.max(height, 1), 1, 1200);
  camera.position.z = 360;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: tier !== 'mobile',
    powerPreference: 'low-power'
  });
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
    exclRadiusX: 85,
    exclRadiusY: 110,
    orbitRadiusX: 108,
    orbitRadiusY: 132
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

        portraitMetrics.exclRadiusX = halfW + 14;
        portraitMetrics.exclRadiusY = halfH + 14;
        portraitMetrics.orbitRadiusX = halfW + 26;
        portraitMetrics.orbitRadiusY = halfH + 24;
      }
    }
    return { worldWidth, worldHeight };
  };

  const { worldWidth, worldHeight } = updatePortraitMetrics();

  // Helper: keep particles outside portrait face area
  const isInsidePortraitExclusion = (x, y) => {
    const dx = (x - portraitMetrics.worldX) / portraitMetrics.exclRadiusX;
    const dy = (y - portraitMetrics.worldY) / portraitMetrics.exclRadiusY;
    return (dx * dx + dy * dy) < 1.0;
  };

  // =========================================================================
  // LAYER 1: Deep-space atmospheric dust (slowest parallax)
  // =========================================================================
  const spaceCount = tier === 'desktop' ? 75 : tier === 'tablet' ? 45 : 22;
  const spacePos = new Float32Array(spaceCount * 3);
  const spaceColors = new Float32Array(spaceCount * 3);

  for (let i = 0; i < spaceCount; i++) {
    spacePos[i * 3]     = (Math.random() - 0.5) * worldWidth * 1.4;
    spacePos[i * 3 + 1] = (Math.random() - 0.5) * worldHeight * 1.3;
    spacePos[i * 3 + 2] = -140 - Math.random() * 180;

    // Mostly muted slate/navy (#24334C / #929BAA), sparse dim gold
    const isGold = Math.random() < 0.14;
    if (isGold) {
      spaceColors[i * 3]     = 0.725 * 0.45;
      spaceColors[i * 3 + 1] = 0.604 * 0.45;
      spaceColors[i * 3 + 2] = 0.369 * 0.45;
    } else {
      spaceColors[i * 3]     = 0.32;
      spaceColors[i * 3 + 1] = 0.38;
      spaceColors[i * 3 + 2] = 0.50;
    }
  }

  const spaceGeo = new THREE.BufferGeometry();
  spaceGeo.setAttribute('position', new THREE.BufferAttribute(spacePos, 3));
  spaceGeo.setAttribute('color', new THREE.BufferAttribute(spaceColors, 3));
  const spaceMat = new THREE.PointsMaterial({
    size: 2.6,
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
  // LAYER 2 & 3: Multi-depth Floating 3D Particles + Neural Network Connections
  // Weighted right/outer-space so left headline stays calm and readable
  // =========================================================================
  const nodeCount = tier === 'desktop' ? 44 : tier === 'tablet' ? 24 : 10;
  const nodePos = new Float32Array(nodeCount * 3);
  const nodeColors = new Float32Array(nodeCount * 3);
  const nodeMeta = [];

  const halfW = worldWidth * 0.5;
  const halfH = worldHeight * 0.5;

  for (let i = 0; i < nodeCount; i++) {
    // 78% weighted to right/outer areas; 22% sparse quiet left perimeter
    let x, y;
    let attempts = 0;
    do {
      if (i < nodeCount * 0.78) {
        x = -halfW * 0.12 + Math.random() * (halfW * 1.15);
      } else {
        x = -halfW * 0.95 + Math.random() * (halfW * 0.8);
      }
      y = (Math.random() - 0.5) * worldHeight * 0.96;
      attempts++;
    } while (isInsidePortraitExclusion(x, y) && attempts < 14);

    if (isInsidePortraitExclusion(x, y)) {
      x = portraitMetrics.worldX + (x >= portraitMetrics.worldX ? 1 : -1) * (portraitMetrics.exclRadiusX + 18);
    }

    const z = -90 + Math.random() * 130;
    nodePos[i * 3]     = x;
    nodePos[i * 3 + 1] = y;
    nodePos[i * 3 + 2] = z;

    const isGold = Math.random() < 0.28;
    if (isGold) {
      nodeColors[i * 3]     = 0.725; // #B99A5E
      nodeColors[i * 3 + 1] = 0.604;
      nodeColors[i * 3 + 2] = 0.369;
    } else {
      nodeColors[i * 3]     = 0.28;  // Dark blue-grey #475875
      nodeColors[i * 3 + 1] = 0.35;
      nodeColors[i * 3 + 2] = 0.46;
    }

    nodeMeta.push({
      isGold,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      vz: (Math.random() - 0.5) * 0.04,
      phase: Math.random() * Math.PI * 2
    });
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
  const nodeMat = new THREE.PointsMaterial({
    size: tier === 'mobile' ? 4.2 : 5.2,
    map: softTexture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodePoints);
  disposables.push(nodeGeo, nodeMat);

  // Neural connections (Desktop & Tablet only, capped connections per node to avoid clutter)
  let lineGeo = null;
  let lineMat = null;
  let linePos = null;
  let lineCol = null;
  const maxTotalLines = tier === 'desktop' ? 90 : tier === 'tablet' ? 35 : 0;

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
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);
    disposables.push(lineGeo, lineMat);
  }

  // =========================================================================
  // LAYER 4: Flowing Antique-Gold Energy Trails & Occasional Data Signals
  // Positioned along outer hero arcs, avoiding left headline text
  // =========================================================================
  const trails = [];
  if (tier !== 'mobile') {
    const trailSpecs = [
      // Upper-right sweeping arc
      [
        new THREE.Vector3(-halfW * 0.05, halfH * 0.85, -45),
        new THREE.Vector3(portraitMetrics.worldX * 0.65, halfH * 0.58, -25),
        new THREE.Vector3(halfW * 0.96, halfH * 0.15, -55)
      ],
      // Lower-right sweeping arc
      [
        new THREE.Vector3(halfW * 0.12, -halfH * 0.88, -60),
        new THREE.Vector3(portraitMetrics.worldX * 0.85, -halfH * 0.52, -20),
        new THREE.Vector3(halfW * 0.98, -halfH * 0.08, -40)
      ],
      // Far-right vertical constellation wave
      [
        new THREE.Vector3(halfW * 0.78, -halfH * 0.85, -80),
        new THREE.Vector3(halfW * 0.92, 0, -35),
        new THREE.Vector3(halfW * 0.72, halfH * 0.82, -70)
      ]
    ];

    const activeTrails = tier === 'desktop' ? trailSpecs : trailSpecs.slice(0, 2);
    const signalPositions = new Float32Array(activeTrails.length * 3);
    const signalGeo = new THREE.BufferGeometry();
    signalGeo.setAttribute('position', new THREE.BufferAttribute(signalPositions, 3));
    const signalMat = new THREE.PointsMaterial({
      color: 0xD1B77E, // Champagne Light signal
      size: 6.5,
      map: softTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const signalPoints = new THREE.Points(signalGeo, signalMat);
    scene.add(signalPoints);
    disposables.push(signalGeo, signalMat);

    activeTrails.forEach((pts, idx) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const sampled = curve.getPoints(44);
      const tGeo = new THREE.BufferGeometry().setFromPoints(sampled);
      const tMat = new THREE.LineBasicMaterial({
        color: 0xB99A5E,
        transparent: true,
        opacity: 0.14,
        depthWrite: false
      });
      const tLine = new THREE.Line(tGeo, tMat);
      scene.add(tLine);
      disposables.push(tGeo, tMat);

      trails.push({
        samples: sampled,
        t: idx * 0.37,
        speed: 0.0014 + idx * 0.0003,
        signalGeo,
        signalPositions
      });
    });
  }

  // =========================================================================
  // LAYER 5: Elliptical 3D Orbital Particles around Portrait Arch
  // Strictly outside the portrait frame & face area
  // =========================================================================
  const orbitalCount = tier === 'desktop' ? 22 : tier === 'tablet' ? 14 : 8;
  const orbitalPos = new Float32Array(orbitalCount * 3);
  const orbitalCol = new Float32Array(orbitalCount * 3);
  const orbitalMeta = [];

  for (let i = 0; i < orbitalCount; i++) {
    const angle = (i / orbitalCount) * Math.PI * 2;
    const depthLayer = i % 3; // 3 orbital depths
    const radiusScale = 1.0 + depthLayer * 0.11;
    const rx = portraitMetrics.orbitRadiusX * radiusScale;
    const ry = portraitMetrics.orbitRadiusY * radiusScale;
    const zBase = -35 + depthLayer * 18;

    orbitalPos[i * 3]     = portraitMetrics.worldX + Math.cos(angle) * rx;
    orbitalPos[i * 3 + 1] = portraitMetrics.worldY + Math.sin(angle) * ry;
    orbitalPos[i * 3 + 2] = zBase;

    const isChampagne = i % 3 === 0;
    if (isChampagne) {
      orbitalCol[i * 3]     = 0.820; // #D1B77E Champagne Light
      orbitalCol[i * 3 + 1] = 0.718;
      orbitalCol[i * 3 + 2] = 0.494;
    } else {
      orbitalCol[i * 3]     = 0.725; // #B99A5E Antique Gold
      orbitalCol[i * 3 + 1] = 0.604;
      orbitalCol[i * 3 + 2] = 0.369;
    }

    orbitalMeta.push({
      angle,
      radiusScale,
      speed: (0.0011 + depthLayer * 0.00035) * (i % 2 === 0 ? 1 : 0.85),
      zBase
    });
  }

  const orbitalGeo = new THREE.BufferGeometry();
  orbitalGeo.setAttribute('position', new THREE.BufferAttribute(orbitalPos, 3));
  orbitalGeo.setAttribute('color', new THREE.BufferAttribute(orbitalCol, 3));
  const orbitalMat = new THREE.PointsMaterial({
    size: tier === 'mobile' ? 3.2 : 4.0,
    map: softTexture || undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const orbitalPoints = new THREE.Points(orbitalGeo, orbitalMat);
  scene.add(orbitalPoints);
  disposables.push(orbitalGeo, orbitalMat);

  // =========================================================================
  // Subtle Mouse Parallax (Desktop fine-pointer only; disabled on touch)
  // =========================================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const enableParallax = tier === 'desktop' && finePointerQuery.matches;
  const onMouseMove = (e) => {
    if (!enableParallax) return;
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 14;
  };
  if (enableParallax) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  let animId = null;
  let isTabVisible = !document.hidden;
  let isHeroInView = true;
  let isDisposed = false;
  let elapsed = 0;

  const connectDist = tier === 'desktop' ? 95 : 80;
  const connectDistSq = connectDist * connectDist;
  const degreeCounts = new Uint8Array(nodeCount);

  const renderSingleFrame = (step = true) => {
    if (step) elapsed += 0.016;

    // Gentle camera parallax
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;
    camera.position.x = mouseX;
    camera.position.y = -mouseY;
    camera.lookAt(0, 0, 0);

    // Subtle deep-space drift
    if (step) {
      spacePoints.rotation.y = Math.sin(elapsed * 0.04) * 0.025;
      spacePoints.rotation.x = Math.cos(elapsed * 0.03) * 0.015;
    }

    // Update Layer 2/3 nodes
    if (step) {
      for (let i = 0; i < nodeCount; i++) {
        const m = nodeMeta[i];
        let x = nodePos[i * 3] + m.vx + Math.sin(elapsed * 0.4 + m.phase) * 0.02;
        let y = nodePos[i * 3 + 1] + m.vy + Math.cos(elapsed * 0.35 + m.phase) * 0.02;
        let z = nodePos[i * 3 + 2] + m.vz;

        if (x < -halfW || x > halfW) m.vx *= -1;
        if (Math.abs(y) > halfH)     m.vy *= -1;
        if (z < -100 || z > 50)      m.vz *= -1;

        // Gently deflect if approaching portrait arch exclusion zone
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

    // Update Layer 3 proximity connections (capped degree <= 3 to avoid clutter)
    if (lineGeo && linePos && lineCol) {
      degreeCounts.fill(0);
      let lineIdx = 0;
      let colorIdx = 0;
      let connected = 0;

      for (let i = 0; i < nodeCount && connected < maxTotalLines; i++) {
        if (degreeCounts[i] >= 3) continue;
        // Keep left-side text zone free of prominent crossings
        if (nodePos[i * 3] < -halfW * 0.25) continue;

        for (let j = i + 1; j < nodeCount && connected < maxTotalLines; j++) {
          if (degreeCounts[j] >= 3) continue;

          const dx = nodePos[i * 3] - nodePos[j * 3];
          const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
          const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
          const dSq = dx * dx + dy * dy + dz * dz;

          if (dSq < connectDistSq) {
            const alpha = (1 - Math.sqrt(dSq) / connectDist) * 0.32;
            const goldLink = nodeMeta[i].isGold && nodeMeta[j].isGold;

            linePos[lineIdx++] = nodePos[i * 3];
            linePos[lineIdx++] = nodePos[i * 3 + 1];
            linePos[lineIdx++] = nodePos[i * 3 + 2];
            linePos[lineIdx++] = nodePos[j * 3];
            linePos[lineIdx++] = nodePos[j * 3 + 1];
            linePos[lineIdx++] = nodePos[j * 3 + 2];

            const r = goldLink ? 0.725 * alpha * 1.35 : 0.20 * alpha;
            const g = goldLink ? 0.604 * alpha * 1.35 : 0.28 * alpha;
            const b = goldLink ? 0.369 * alpha * 1.35 : 0.42 * alpha;

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
    }

    // Update Layer 4 energy signals along curved trails
    if (step && trails.length > 0) {
      for (let i = 0; i < trails.length; i++) {
        const tr = trails[i];
        tr.t = (tr.t + tr.speed) % 1;
        const maxIdx = tr.samples.length - 1;
        const fIdx = tr.t * maxIdx;
        const i0 = Math.floor(fIdx);
        const i1 = Math.min(i0 + 1, maxIdx);
        const frac = fIdx - i0;

        const p0 = tr.samples[i0];
        const p1 = tr.samples[i1];
        tr.signalPositions[i * 3]     = p0.x + (p1.x - p0.x) * frac;
        tr.signalPositions[i * 3 + 1] = p0.y + (p1.y - p0.y) * frac;
        tr.signalPositions[i * 3 + 2] = p0.z + (p1.z - p0.z) * frac;
      }
      trails[0].signalGeo.attributes.position.needsUpdate = true;
    }

    // Update Layer 5 elliptical orbital particles around portrait arch
    if (step) {
      for (let i = 0; i < orbitalCount; i++) {
        const o = orbitalMeta[i];
        o.angle += o.speed;
        const rx = portraitMetrics.orbitRadiusX * o.radiusScale;
        const ry = portraitMetrics.orbitRadiusY * o.radiusScale;

        orbitalPos[i * 3]     = portraitMetrics.worldX + Math.cos(o.angle) * rx;
        orbitalPos[i * 3 + 1] = portraitMetrics.worldY + Math.sin(o.angle) * ry;
        orbitalPos[i * 3 + 2] = o.zBase + Math.sin(o.angle * 2) * 14;
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
        // Re-initialize cleanly when crossing desktop/tablet/mobile breakpoints
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
