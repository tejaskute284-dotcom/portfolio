import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GoldenParticleWave({ heroRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(pointer: fine)');

    const getDeviceTier = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 'desktop';
      if (w >= 768) return 'tablet';
      return 'mobile';
    };

    let cleanup = null;

    const setupScene = () => {
      if (typeof cleanup === 'function') cleanup();

      const tier = getDeviceTier();
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
        return null;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(44, width / Math.max(height, 1), 1, 1400);
      camera.position.set(0, 42, 340);
      camera.lookAt(0, -18, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.pointerEvents = 'none';
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const layerConfigs =
        tier === 'desktop'
          ? [
              { cols: 76, rows: 22, width: 640, depth: 240, yOffset: -64, zOffset: 20, amp: 16.0, speed: 0.42, baseSize: 3.8, opacity: 0.92 },
              { cols: 54, rows: 14, width: 700, depth: 260, yOffset: -46, zOffset: -95, amp: 20.0, speed: 0.28, baseSize: 2.7, opacity: 0.56 }
            ]
          : tier === 'tablet'
            ? [
                { cols: 52, rows: 15, width: 540, depth: 200, yOffset: -66, zOffset: 10, amp: 13.0, speed: 0.36, baseSize: 3.4, opacity: 0.85 },
                { cols: 36, rows: 10, width: 580, depth: 220, yOffset: -48, zOffset: -85, amp: 16.0, speed: 0.24, baseSize: 2.4, opacity: 0.48 }
              ]
            : [
                { cols: 34, rows: 11, width: 420, depth: 150, yOffset: -82, zOffset: 0, amp: 9.5, speed: 0.3, baseSize: 3.0, opacity: 0.72 }
              ];

      const totalParticles = layerConfigs.reduce((sum, cfg) => sum + cfg.cols * cfg.rows, 0);
      const positions = new Float32Array(totalParticles * 3);
      const colors = new Float32Array(totalParticles * 3);
      const sizes = new Float32Array(totalParticles);
      const phases = new Float32Array(totalParticles);
      const amps = new Float32Array(totalParticles);
      const speeds = new Float32Array(totalParticles);
      const fades = new Float32Array(totalParticles);
      const sparkles = new Float32Array(totalParticles);

      const antiqueGold = [0.725, 0.604, 0.369];
      const champagneGold = [0.82, 0.718, 0.494];
      const softGold = [0.886, 0.788, 0.569];

      let idx = 0;
      layerConfigs.forEach((cfg, layerIdx) => {
        for (let r = 0; r < cfg.rows; r++) {
          const zNorm = r / (cfg.rows - 1);
          const z = cfg.zOffset + (zNorm - 0.5) * cfg.depth;
          const zFade = Math.sin(zNorm * Math.PI);

          for (let c = 0; c < cfg.cols; c++) {
            const xNorm = c / (cfg.cols - 1);
            const jitterX = Math.sin(r * 12.9898 + c * 78.233) * 0.5 * (cfg.width / cfg.cols) * 0.45;
            const jitterZ = Math.cos(c * 39.346 + r * 11.135) * 0.5 * (cfg.depth / cfg.rows) * 0.45;
            const x = (xNorm - 0.5) * cfg.width + jitterX;

            const xFade = Math.pow(Math.sin(xNorm * Math.PI), 0.75);
            const leftCalm = xNorm < 0.42 ? 0.62 + 0.38 * (xNorm / 0.42) : 1.0;

            positions[idx * 3] = x;
            positions[idx * 3 + 1] = cfg.yOffset;
            positions[idx * 3 + 2] = z + jitterZ;

            const hash = Math.abs(Math.sin(idx * 17.31 + layerIdx * 5.7));
            let col = antiqueGold;
            let isHighlight = 0.0;

            if (hash > 0.92) {
              col = softGold;
              isHighlight = 1.0;
            } else if (hash > 0.62) {
              col = champagneGold;
              isHighlight = 0.35;
            }

            colors[idx * 3] = col[0];
            colors[idx * 3 + 1] = col[1];
            colors[idx * 3 + 2] = col[2];

            sizes[idx] = cfg.baseSize * (0.72 + hash * 0.75) * (isHighlight > 0.8 ? 1.35 : 1.0);
            phases[idx] = x * 0.015 + z * 0.02;
            amps[idx] = cfg.amp;
            speeds[idx] = cfg.speed;
            fades[idx] = Math.max(0.0, Math.min(1.0, zFade * xFade * leftCalm * cfg.opacity));
            sparkles[idx] = isHighlight;
            idx++;
          }
        }
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute('aAmp', new THREE.BufferAttribute(amps, 1));
      geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
      geometry.setAttribute('aFade', new THREE.BufferAttribute(fades, 1));
      geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkles, 1));

      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr }
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          attribute vec3 aColor;
          attribute float aSize;
          attribute float aPhase;
          attribute float aAmp;
          attribute float aSpeed;
          attribute float aFade;
          attribute float aSparkle;
          uniform float uTime;
          uniform float uPixelRatio;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            float primaryWave = sin(pos.x * 0.016 - uTime * aSpeed) * aAmp;
            float crossSwell  = cos(pos.z * 0.024 + uTime * (aSpeed * 0.68)) * (aAmp * 0.58);
            float fineRipple  = sin((pos.x * 0.032 - pos.z * 0.022) - uTime * (aSpeed * 1.15)) * (aAmp * 0.25);
            pos.y += primaryWave + crossSwell + fineRipple;
            float crestFactor = clamp((primaryWave + crossSwell) / (aAmp * 1.58) * 0.5 + 0.5, 0.0, 1.0);
            float travelingGlow = sin(pos.x * 0.012 - uTime * 0.55 + aPhase) * 0.5 + 0.5;
            float brightness = mix(0.55, 1.15, crestFactor) + aSparkle * travelingGlow * 0.45;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float dist = max(-mvPosition.z, 60.0);
            gl_PointSize = aSize * uPixelRatio * (300.0 / dist);
            float depthFade = clamp(1.0 - (dist - 180.0) / 420.0, 0.28, 1.0);
            vColor = aColor * brightness;
            vAlpha = aFade * depthFade * mix(0.65, 1.0, crestFactor);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.04, d);
            float core = smoothstep(0.24, 0.0, d) * 0.35;
            gl_FragColor = vec4(vColor, (soft * 0.8 + core) * vAlpha);
          }
        `
      });

      scene.add(new THREE.Points(geometry, material));

      let mouseX = 0;
      let mouseY = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;
      const enableParallax = tier === 'desktop' && finePointerQuery.matches;

      const onMouseMove = (e) => {
        if (!enableParallax) return;
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 16;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 9;
      };
      if (enableParallax) window.addEventListener('mousemove', onMouseMove, { passive: true });

      let animId = null;
      let isTabVisible = !document.hidden;
      let isHeroInView = true;
      let isDisposed = false;
      let lastTime = performance.now();

      const renderFrame = (advance = true) => {
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        if (advance) uniforms.uTime.value += dt;

        mouseX += (targetMouseX - mouseX) * 0.03;
        mouseY += (targetMouseY - mouseY) * 0.03;
        camera.position.x = mouseX;
        camera.position.y = 42 - mouseY;
        camera.lookAt(0, -18, 0);
        renderer.render(scene, camera);
      };

      const animate = () => {
        if (isDisposed || !isTabVisible || !isHeroInView || prefersReducedQuery.matches) {
          animId = null;
          return;
        }
        animId = requestAnimationFrame(animate);
        renderFrame(true);
      };

      const startLoop = () => {
        lastTime = performance.now();
        if (prefersReducedQuery.matches) {
          renderFrame(false);
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

      let resizeTimer = null;
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (isDisposed) return;
          if (getDeviceTier() !== tier) {
            cleanup = setupScene();
            return;
          }
          width = container.clientWidth || window.innerWidth;
          height = container.clientHeight || window.innerHeight;
          if (width > 0 && height > 0) {
            const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5);
            uniforms.uPixelRatio.value = nextDpr;
            renderer.setPixelRatio(nextDpr);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          }
        }, 150);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isHeroInView = entry.isIntersecting;
            if (isHeroInView) startLoop();
            else stopLoop();
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(heroRef?.current || container);

      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize, { passive: true });
      prefersReducedQuery.addEventListener('change', onMotionChange);

      startLoop();

      return () => {
        isDisposed = true;
        stopLoop();
        observer.disconnect();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        prefersReducedQuery.removeEventListener('change', onMotionChange);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        container.innerHTML = '';
      };
    };

    cleanup = setupScene();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [heroRef]);

  return <div id="particles-js" ref={containerRef} aria-hidden="true" />;
}
