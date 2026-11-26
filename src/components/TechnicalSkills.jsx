import React, { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Brain, Code2, Database, Layout, Server, Terminal } from 'lucide-react';
import { SKILLS_ORBIT_DATA } from '../data/skills.js';
import { SkillIcon } from './Icons.jsx';

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

export default function TechnicalSkills() {
  const stageRef = useRef(null);
  const canvasHostRef = useRef(null);
  const badgesLayerRef = useRef(null);
  const badgeElsRef = useRef([]);

  const layoutBadges = () => {
    const badgesLayer = badgesLayerRef.current;
    if (!badgesLayer) return;

    const isMobile = window.innerWidth < 768;
    const nodes = badgeElsRef.current.filter(Boolean);

    if (isMobile) {
      nodes.forEach((el) => {
        el.style.removeProperty('--base-x');
        el.style.removeProperty('--base-y');
        el.style.transform = '';
      });
      return;
    }

    const W = badgesLayer.clientWidth || 1000;
    const H = 580;
    const padX = 32;
    const padTop = 32;
    const padBottom = 115;
    const usableW = Math.max(W - padX * 2, 320);
    const usableH = H - padTop - padBottom;
    const centerX = W * 0.5;
    const centerY = padTop + usableH * 0.48;

    const items = nodes.map((el) => ({
      el,
      w: el.offsetWidth || 120,
      h: el.offsetHeight || 36,
      x: 0,
      y: 0
    }));

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const total = items.length;

    items.forEach((b, i) => {
      const normR = i === 0 ? 0 : Math.sqrt((i + 0.4) / total);
      const theta = i * goldenAngle + 0.4;
      const cx = centerX + Math.cos(theta) * (usableW * 0.46) * normR;
      const cy = centerY + Math.sin(theta) * (usableH * 0.45) * normR;
      b.x = cx - b.w * 0.5;
      b.y = cy - b.h * 0.5;
    });

    const minGap = window.innerWidth >= 1024 ? 16 : 11;
    for (let iter = 0; iter < 160; iter++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j];
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

    items.forEach((b) => {
      const bx = Math.round(b.x);
      const by = Math.round(b.y);
      b.el.style.setProperty('--base-x', `${bx}px`);
      b.el.style.setProperty('--base-y', `${by}px`);
      b.el.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
    });
  };

  useLayoutEffect(() => {
    layoutBadges();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const canvasHost = canvasHostRef.current;
    if (!stage || !canvasHost) return;

    const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const getTier = () => (window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile');

    let cleanupThree = null;

    const initThree = () => {
      if (typeof cleanupThree === 'function') cleanupThree();

      const tier = getTier();
      const w = canvasHost.clientWidth || stage.clientWidth || window.innerWidth;
      const h = canvasHost.clientHeight || stage.clientHeight || 380;
      if (w <= 0 || h <= 0) return null;

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
      const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
      camera.position.z = 320;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      canvasHost.innerHTML = '';
      canvasHost.appendChild(renderer.domElement);

      const disposables = [];
      const dotTex = createSoftDotTexture();
      if (dotTex) disposables.push(dotTex);

      const vFov = (camera.fov * Math.PI) / 180;
      const worldH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const worldW = worldH * (w / h);

      const orbitSpecs =
        tier === 'mobile'
          ? [{ rx: worldW * 0.42, ry: worldH * 0.34, rotZ: 0.12, rotX: 0.35, opacity: 0.28 }]
          : [
              { rx: worldW * 0.32, ry: worldH * 0.3, rotZ: -0.14, rotX: 0.45, opacity: 0.38 },
              { rx: worldW * 0.42, ry: worldH * 0.37, rotZ: 0.12, rotX: 0.36, opacity: 0.28 },
              { rx: worldW * 0.48, ry: worldH * 0.41, rotZ: -0.06, rotX: 0.28, opacity: 0.2 },
              { rx: worldW * 0.24, ry: worldH * 0.22, rotZ: 0.2, rotX: 0.5, opacity: 0.3 }
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
          color: idx % 2 === 0 ? 0xd1b77e : 0xb99a5e,
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
        signalCol[s * 3] = isBright ? 0.92 : 0.78;
        signalCol[s * 3 + 1] = isBright ? 0.84 : 0.65;
        signalCol[s * 3 + 2] = isBright ? 0.62 : 0.42;
        signalMeta.push({
          curveIdx: cIdx,
          t: Math.random(),
          speed: 0.0009 + cIdx * 0.00025 + Math.random() * 0.0005
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

      if (tier !== 'mobile') {
        const cornerNodes = [];
        const cornerCount = 24;
        const cPos = new Float32Array(cornerCount * 3);
        for (let i = 0; i < cornerCount; i++) {
          const isRight = i >= cornerCount / 2;
          const x = (isRight ? 1 : -1) * (worldW * 0.3 + Math.random() * worldW * 0.22);
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
          color: 0xd1b77e,
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
            color: 0xb99a5e,
            transparent: true,
            opacity: 0.16,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          scene.add(new THREE.LineSegments(lGeo, lMat));
          disposables.push(lGeo, lMat);
        }
      }

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
            wavePos[idx * 3] = (xNorm - 0.5) * waveW;
            wavePos[idx * 3 + 1] = baseY;
            wavePos[idx * 3 + 2] = z;

            const isSpark = (r * 7 + c * 11) % 13 === 0;
            waveCol[idx * 3] = (isSpark ? 0.94 : 0.78) * fade;
            waveCol[idx * 3 + 1] = (isSpark ? 0.85 : 0.65) * fade;
            waveCol[idx * 3 + 2] = (isSpark ? 0.6 : 0.4) * fade;
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

      let animId = null;
      let isDisposed = false;
      let isTabVisible = !document.hidden;
      let isSectionInView = true;
      let elapsed = 0;

      const renderFrame = (step = true) => {
        if (step) {
          elapsed += 0.016;
          for (let s = 0; s < signalMeta.length; s++) {
            const m = signalMeta[s];
            m.t = (m.t + m.speed) % 1;
            const pts = orbitCurves[m.curveIdx];
            const maxI = pts.length - 1;
            const f = m.t * maxI;
            const i0 = Math.floor(f);
            const i1 = Math.min(i0 + 1, maxI);
            const frac = f - i0;
            signalPos[s * 3] = pts[i0].x + (pts[i1].x - pts[i0].x) * frac;
            signalPos[s * 3 + 1] = pts[i0].y + (pts[i1].y - pts[i0].y) * frac;
            signalPos[s * 3 + 2] = pts[i0].z + (pts[i1].z - pts[i0].z) * frac;
          }
          signalGeo.attributes.position.needsUpdate = true;

          if (waveGeo && wavePos) {
            const baseY = -worldH * 0.37;
            let idx = 0;
            for (let r = 0; r < waveRows; r++) {
              for (let c = 0; c < waveCols; c++) {
                const x = wavePos[idx * 3];
                const z = wavePos[idx * 3 + 2];
                wavePos[idx * 3 + 1] =
                  baseY +
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

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isSectionInView = entry.isIntersecting;
            if (isSectionInView) startLoop();
            else stopLoop();
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(stage);

      let resizeTimer = null;
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (isDisposed) return;
          layoutBadges();
          if (getTier() !== tier) {
            cleanupThree = initThree();
            return;
          }
          const nw = canvasHost.clientWidth || stage.clientWidth;
          const nh = canvasHost.clientHeight || stage.clientHeight;
          if (nw > 0 && nh > 0) {
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
        isDisposed = true;
        stopLoop();
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
        prefersReducedQuery.removeEventListener('change', onMotionChange);
        disposables.forEach((d) => {
          if (d && typeof d.dispose === 'function') d.dispose();
        });
        renderer.dispose();
        canvasHost.innerHTML = '';
      };
    };

    cleanupThree = initThree();

    let fallbackResizeTimer = null;
    const onFallbackResize = () => {
      if (fallbackResizeTimer) clearTimeout(fallbackResizeTimer);
      fallbackResizeTimer = setTimeout(layoutBadges, 150);
    };
    if (!cleanupThree) window.addEventListener('resize', onFallbackResize, { passive: true });

    return () => {
      if (typeof cleanupThree === 'function') cleanupThree();
      if (!cleanupThree) window.removeEventListener('resize', onFallbackResize);
    };
  }, []);

  return (
    <section id="skills" className="section-obsidian reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            08 / Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">Technical Competencies</h2>
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto mb-5" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accentGold/60" />
            <span className="w-2 h-2 rotate-45 border border-accentGold bg-accentGold/30" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accentGold/60" />
          </div>
          <div className="flex items-center justify-center gap-6 text-xs font-mono text-textSecondary">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-bgSecondary border border-border" />
              <span>Production Mastered</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accentGold animate-pulse" />
              <span className="text-accentGoldLight font-medium">Learning in Progress</span>
            </span>
          </div>
        </div>

        {/* Cinematic Golden Orbit & Floating Skills Constellation */}
        <div id="skills-sphere-mount" className="relative w-full mb-12">
          <div className="skills-orbit-stage" ref={stageRef}>
            <div className="skills-orbit-canvas" ref={canvasHostRef} aria-hidden="true" />
            <div className="skills-badges-layer" ref={badgesLayerRef}>
              {SKILLS_ORBIT_DATA.map((skill, idx) => {
                const isLearning = skill.status === 'learning';
                const dirX = idx % 2 === 0 ? 1 : -1;
                const dirY = idx % 3 === 0 ? -1 : 1;
                return (
                  <div
                    key={skill.name}
                    ref={(el) => {
                      badgeElsRef.current[idx] = el;
                    }}
                    className={`skill-orbit-badge tier-${skill.tier} ${isLearning ? 'is-learning' : 'is-mastered'}`}
                    title={`${skill.name} — ${isLearning ? 'Learning in Progress' : 'Production Mastered'}`}
                    style={{
                      '--float-x': `${dirX * (2.5 + (idx % 3) * 1.0)}px`,
                      '--float-y': `${dirY * (3 + (idx % 4) * 1.0)}px`,
                      '--float-rot': `${dirX * 0.4}deg`,
                      '--float-dur': `${5.6 + (idx % 5) * 0.9}s`,
                      '--float-delay': `${-(idx % 7) * 0.65}s`
                    }}
                  >
                    <span className="skill-badge-icon" aria-hidden="true">
                      <SkillIcon name={skill.icon} />
                    </span>
                    <span>{skill.name}</span>
                    {isLearning && <span className="skill-badge-status" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Structured Reference Grid */}
        <div id="skills-fallback-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>Core Languages</span>
              <Code2 className="w-5 h-5 text-accentGold" />
            </h3>
            <ul className="space-y-4 font-mono text-xs">
              <li className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-textSecondary">Python</span>
                <span className="text-accentGold font-bold">Proficient</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-textSecondary">JavaScript / TypeScript</span>
                <span className="text-accentGold font-bold">Proficient</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-textSecondary">C / C++</span>
                <span className="text-accentGold font-bold">Intermediate</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-textSecondary">SQL (MySQL, PostGIS)</span>
                <span className="text-accentGold font-bold">Intermediate</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-textSecondary">HTML5 / Modern CSS</span>
                <span className="text-accentGold font-bold">Advanced</span>
              </li>
            </ul>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>Frontend Architecture</span>
              <Layout className="w-5 h-5 text-accentGold" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Leaflet.js', 'Chart.js', 'Lenis Scroll'].map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
              <span className="tech-tag tech-tag-learning" title="Learning in Progress">
                <span className="learning-beacon" />
                <span>Framer Motion</span>
              </span>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>Backend &amp; Services</span>
              <Server className="w-5 h-5 text-accentGold" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['Node.js', 'Express.js', 'REST APIs', 'JWT Security', 'RBAC'].map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
              {['FastAPI', 'WebSockets'].map((t) => (
                <span key={t} className="tech-tag tech-tag-learning" title="Learning in Progress">
                  <span className="learning-beacon" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>Persistence &amp; Storage</span>
              <Database className="w-5 h-5 text-accentGold" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['MySQL', 'MongoDB & Atlas', 'PostgreSQL'].map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
              {['PostGIS (Geospatial)', 'Prisma ORM', 'Supabase'].map((t) => (
                <span key={t} className="tech-tag tech-tag-learning" title="Learning in Progress">
                  <span className="learning-beacon" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>AI / ML &amp; Mathematics</span>
              <Brain className="w-5 h-5 text-accentGold" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['NumPy', 'Pandas', 'DSA Algorithms', 'Scikit-Learn'].map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
              {['TensorFlow', 'PyTorch', 'Gemini Vision AI'].map((t) => (
                <span key={t} className="tech-tag tech-tag-learning" title="Learning in Progress">
                  <span className="learning-beacon" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="premium-card">
            <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-between">
              <span>Toolchain &amp; Workflow</span>
              <Terminal className="w-5 h-5 text-accentGold" />
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['Git & GitHub', 'Postman', 'Linux', 'VS Code', 'Cloudinary', 'Zod'].map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
