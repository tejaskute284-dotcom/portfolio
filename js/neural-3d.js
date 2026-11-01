// neural-3d.js — Subtle 3D Neural Particle Constellation Background (Three.js)
// Desktop-only (>=768px), respects prefers-reduced-motion, low-opacity champagne gold

export function initNeural3D() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  // Mobile & reduced motion checks: show lightweight static dots
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  if (prefersReduced || isMobile || typeof THREE === 'undefined') {
    container.style.opacity = '0.35';
    return;
  }

  // Clear any existing children
  container.innerHTML = '';
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '0';
  container.style.overflow = 'hidden';

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
  camera.position.z = 320;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.opacity = '0.45'; // Restrained luxury presence
  container.appendChild(renderer.domElement);

  // 42 subtle floating neural particles
  const particleCount = 42;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  const boundsX = 260;
  const boundsY = 160;
  const boundsZ = 120;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * boundsX * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * boundsY * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * boundsZ * 2;

    velocities.push({
      x: (Math.random() - 0.5) * 0.18,
      y: (Math.random() - 0.5) * 0.18,
      z: (Math.random() - 0.5) * 0.12
    });
  }

  // Particle Geometry & Material (Champagne Gold #D5B26B)
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xD5B26B,
    size: 4.5,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Line Mesh for Inter-Particle Synapses
  const maxConnections = particleCount * (particleCount - 1) / 2;
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

  // Mouse Interaction: Subtle ambient parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const onMouseMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 45;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 35;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Animation Loop with Visibility Optimization
  let animId = null;
  let isVisible = true;

  const onVisibilityChange = () => {
    isVisible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const connectDist = 95;
  const connectDistSq = connectDist * connectDist;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;

    // Smooth lerp mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;
    camera.position.x = mouseX;
    camera.position.y = -mouseY;
    camera.lookAt(0, 0, 0);

    const pos = particleGeo.attributes.position.array;
    let lineIdx = 0;
    let colorIdx = 0;
    let connectedLines = 0;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce gracefully at bounding envelope
      if (Math.abs(pos[i * 3]) > boundsX)     velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > boundsY) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > boundsZ) velocities[i].z *= -1;

      // Connect nearby particles
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < connectDistSq) {
          const alpha = (1 - Math.sqrt(dSq) / connectDist) * 0.35; // Fine hairline champagne transparency
          
          linePositions[lineIdx++] = pos[i * 3];
          linePositions[lineIdx++] = pos[i * 3 + 1];
          linePositions[lineIdx++] = pos[i * 3 + 2];

          linePositions[lineIdx++] = pos[j * 3];
          linePositions[lineIdx++] = pos[j * 3 + 1];
          linePositions[lineIdx++] = pos[j * 3 + 2];

          // Gold RGB: (0.835, 0.698, 0.420)
          for (let k = 0; k < 2; k++) {
            lineColors[colorIdx++] = 0.835 * alpha;
            lineColors[colorIdx++] = 0.698 * alpha;
            lineColors[colorIdx++] = 0.420 * alpha;
          }
          connectedLines++;
        }
      }
    }

    particleGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, connectedLines * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  };

  animate();

  // Resize Listener
  const onResize = () => {
    if (window.innerWidth < 768) {
      if (animId) cancelAnimationFrame(animId);
      container.innerHTML = '';
      return;
    }
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', onResize);
}

