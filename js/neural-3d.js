// neural-3d.js — Cinematic AI Environment (Three.js)
// Deep Obsidian & Antique Gold neural constellation weighted toward the right portrait halo,
// keeping the left typography zone quiet and dark.

let activeNeuralCleanup = null;

export function initNeural3D() {
  if (typeof activeNeuralCleanup === 'function') {
    activeNeuralCleanup();
    activeNeuralCleanup = null;
  }

  const container = document.getElementById('particles-js');
  if (!container) return;

  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shouldDisable = () => window.innerWidth < 768 || prefersReducedQuery.matches || typeof THREE === 'undefined';

  if (shouldDisable()) {
    container.innerHTML = '';
    container.style.opacity = '0.3';
    return;
  }

  container.innerHTML = '';
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '0';
  container.style.overflow = 'hidden';

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, width / height, 1, 1000);
  camera.position.z = 340;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.opacity = '0.58';
  container.appendChild(renderer.domElement);

  // 1. Neural Network Nodes (weighted toward the right side around the portrait arch)
  const particleCount = 40;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  const minX = -110;
  const maxX = 270;
  const boundsY = 165;
  const boundsZ = 110;

  for (let i = 0; i < particleCount; i++) {
    // Bias 70% of nodes to the right hemisphere (portrait side) so left text remains calm
    const xPos = i < particleCount * 0.72
      ? 35 + Math.random() * (maxX - 35)
      : minX + Math.random() * (35 - minX);

    positions[i * 3]     = xPos;
    positions[i * 3 + 1] = (Math.random() - 0.5) * boundsY * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * boundsZ * 2;

    velocities.push({
      x: (Math.random() - 0.5) * 0.14,
      y: (Math.random() - 0.5) * 0.14,
      z: (Math.random() - 0.5) * 0.09
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xB99A5E, // Antique Gold
    size: 4.2,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. Synapse Energy Trails (Antique Gold & Champagne Light)
  const maxConnections = (particleCount * (particleCount - 1)) / 2;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineColors = new Float32Array(maxConnections * 6);

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSystem);

  // 3. Subtle Orbital Halo Particles around the Portrait Arch (right side, outer ring)
  const orbitalCount = 26;
  const orbitalPositions = new Float32Array(orbitalCount * 3);
  const orbitalAngles = [];
  const orbitalCenterX = 128;
  const orbitalCenterY = 8;

  for (let i = 0; i < orbitalCount; i++) {
    const angle = (i / orbitalCount) * Math.PI * 2;
    const radius = 122 + (i % 3) * 14;
    orbitalAngles.push({
      angle,
      radius,
      speed: 0.0016 + (i % 2) * 0.0007,
      zTilt: ((i % 5) - 2) * 12
    });
    orbitalPositions[i * 3]     = orbitalCenterX + Math.cos(angle) * radius;
    orbitalPositions[i * 3 + 1] = orbitalCenterY + Math.sin(angle) * (radius * 0.72);
    orbitalPositions[i * 3 + 2] = -30 + ((i % 5) - 2) * 12;
  }

  const orbitalGeo = new THREE.BufferGeometry();
  orbitalGeo.setAttribute('position', new THREE.BufferAttribute(orbitalPositions, 3));

  const orbitalMat = new THREE.PointsMaterial({
    color: 0xD1B77E, // Champagne Light
    size: 3.0,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const orbitalSystem = new THREE.Points(orbitalGeo, orbitalMat);
  scene.add(orbitalSystem);

  // 4. Deep-Space Ambient Starlight Dots (very faint muted grey)
  const spaceCount = 34;
  const spacePositions = new Float32Array(spaceCount * 3);
  for (let i = 0; i < spaceCount; i++) {
    spacePositions[i * 3]     = (Math.random() - 0.5) * 620;
    spacePositions[i * 3 + 1] = (Math.random() - 0.5) * 380;
    spacePositions[i * 3 + 2] = -120 - Math.random() * 140;
  }
  const spaceGeo = new THREE.BufferGeometry();
  spaceGeo.setAttribute('position', new THREE.BufferAttribute(spacePositions, 3));
  const spaceMat = new THREE.PointsMaterial({
    color: 0x929BAA, // Muted Grey
    size: 2.0,
    transparent: true,
    opacity: 0.3
  });
  const spaceSystem = new THREE.Points(spaceGeo, spaceMat);
  scene.add(spaceSystem);

  // Smooth mouse parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const onMouseMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 32;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 24;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  let animId = null;
  let isTabVisible = !document.hidden;
  let isHeroInView = true;
  let isDisposed = false;

  const connectDist = 100;
  const connectDistSq = connectDist * connectDist;

  const animate = () => {
    if (isDisposed || !isTabVisible || !isHeroInView || shouldDisable()) {
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.035;
    mouseY += (targetMouseY - mouseY) * 0.035;
    camera.position.x = mouseX;
    camera.position.y = -mouseY;
    camera.lookAt(0, 0, 0);

    // Update neural network nodes & synapses
    const pos = particleGeo.attributes.position.array;
    let lineIdx = 0;
    let colorIdx = 0;
    let connectedLines = 0;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      if (pos[i * 3] < minX || pos[i * 3] > maxX) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > boundsY)     velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > boundsZ)     velocities[i].z *= -1;

      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < connectDistSq) {
          const alpha = (1 - Math.sqrt(dSq) / connectDist) * 0.34;

          linePositions[lineIdx++] = pos[i * 3];
          linePositions[lineIdx++] = pos[i * 3 + 1];
          linePositions[lineIdx++] = pos[i * 3 + 2];

          linePositions[lineIdx++] = pos[j * 3];
          linePositions[lineIdx++] = pos[j * 3 + 1];
          linePositions[lineIdx++] = pos[j * 3 + 2];

          // Antique Gold RGB (#B99A5E -> 0.725, 0.604, 0.369)
          for (let k = 0; k < 2; k++) {
            lineColors[colorIdx++] = 0.725 * alpha;
            lineColors[colorIdx++] = 0.604 * alpha;
            lineColors[colorIdx++] = 0.369 * alpha;
          }
          connectedLines++;
        }
      }
    }

    // Update orbital portrait halo particles
    const orbPos = orbitalGeo.attributes.position.array;
    for (let i = 0; i < orbitalCount; i++) {
      const o = orbitalAngles[i];
      o.angle += o.speed;
      orbPos[i * 3]     = orbitalCenterX + Math.cos(o.angle) * o.radius;
      orbPos[i * 3 + 1] = orbitalCenterY + Math.sin(o.angle) * (o.radius * 0.72);
      orbPos[i * 3 + 2] = -30 + Math.sin(o.angle * 2) * 16 + o.zTilt;
    }

    particleGeo.attributes.position.needsUpdate = true;
    orbitalGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, connectedLines * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  };

  const startLoop = () => {
    if (!isDisposed && isTabVisible && isHeroInView && !shouldDisable() && animId === null) {
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
    prefersReducedQuery.removeEventListener('change', onResize);

    particleGeo.dispose();
    particleMat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
    orbitalGeo.dispose();
    orbitalMat.dispose();
    spaceGeo.dispose();
    spaceMat.dispose();
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

  const onResize = () => {
    if (shouldDisable()) {
      disposeResources();
      return;
    }
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    if (newW > 0 && newH > 0) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }
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
  prefersReducedQuery.addEventListener('change', onResize);

  activeNeuralCleanup = disposeResources;
  startLoop();
}
