import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────── skill data ─────────────────────────── */
const SKILLS = [
  { name: 'React 18',         status: 'mastered',  size: 'lg' },
  { name: 'Express.js',       status: 'mastered',  size: 'lg' },
  { name: 'RBAC',             status: 'mastered',  size: 'md' },
  { name: 'SQL',              status: 'mastered',  size: 'md' },
  { name: 'TypeScript',       status: 'mastered',  size: 'lg' },
  { name: 'FastAPI',          status: 'learning',  size: 'lg' },
  { name: 'MongoDB',          status: 'mastered',  size: 'md' },
  { name: 'Prisma ORM',       status: 'learning',  size: 'lg' },
  { name: 'Scikit-Learn',     status: 'mastered',  size: 'lg' },
  { name: 'PostGIS',          status: 'learning',  size: 'md' },
  { name: 'JWT Security',     status: 'mastered',  size: 'md' },
  { name: 'NumPy',            status: 'mastered',  size: 'lg' },
  { name: 'Postman',          status: 'mastered',  size: 'md' },
  { name: 'Pandas',           status: 'mastered',  size: 'md' },
  { name: 'TensorFlow',       status: 'learning',  size: 'lg' },
  { name: 'Gemini Vision AI', status: 'learning',  size: 'lg' },
  { name: 'Linux',            status: 'mastered',  size: 'md' },
  { name: 'VS Code',          status: 'mastered',  size: 'md' },
  { name: 'Lenis Scroll',     status: 'mastered',  size: 'sm' },
  { name: 'PyTorch',          status: 'learning',  size: 'lg' },
  { name: 'Node.js',          status: 'mastered',  size: 'lg' },
  { name: 'Tailwind CSS',     status: 'mastered',  size: 'md' },
  { name: 'Python',           status: 'mastered',  size: 'lg' },
  { name: 'JavaScript',       status: 'mastered',  size: 'lg' },
  { name: 'PostgreSQL',       status: 'mastered',  size: 'md' },
  { name: 'MySQL',            status: 'mastered',  size: 'md' },
  { name: 'REST APIs',        status: 'mastered',  size: 'md' },
  { name: 'WebSockets',       status: 'learning',  size: 'md' },
  { name: 'Framer Motion',    status: 'learning',  size: 'md' },
  { name: 'Vite',             status: 'mastered',  size: 'md' },
  { name: 'Chart.js',         status: 'mastered',  size: 'sm' },
  { name: 'Git & GitHub',     status: 'mastered',  size: 'sm' },
  { name: 'Cloudinary',       status: 'mastered',  size: 'sm' },
  { name: 'Zod',              status: 'mastered',  size: 'sm' },
  { name: 'DSA Algorithms',   status: 'mastered',  size: 'sm' },
  { name: 'Leaflet.js',       status: 'mastered',  size: 'sm' },
  { name: 'Supabase',         status: 'learning',  size: 'sm' },
  { name: 'C / C++',          status: 'mastered',  size: 'md' },
  { name: 'HTML5 / CSS',      status: 'mastered',  size: 'md' },
];

/* Three concentric ellipses — rx/ry as fractions of container */
const ORBITS = [
  { rx: 0.30, ry: 0.21, tilt: -8,  count: 8  },
  { rx: 0.52, ry: 0.34, tilt: -6,  count: 14 },
  { rx: 0.72, ry: 0.44, tilt: -4,  count: 17 },
];

/* Distribute skills across orbits */
function assignOrbits(skills, orbits) {
  const result = [];
  let idx = 0;
  orbits.forEach((orbit, oIdx) => {
    for (let i = 0; i < orbit.count && idx < skills.length; i++, idx++) {
      const angle = (i / orbit.count) * 2 * Math.PI;
      result.push({ ...skills[idx], orbit: oIdx, angle });
    }
  });
  while (idx < skills.length) {
    const oIdx = orbits.length - 1;
    result.push({ ...skills[idx], orbit: oIdx, angle: Math.random() * 2 * Math.PI });
    idx++;
  }
  return result;
}

/* Compute point on a tilted ellipse */
function ellipsePoint(cx, cy, rx, ry, tiltDeg, angle) {
  const rad = (tiltDeg * Math.PI) / 180;
  const ex = rx * Math.cos(angle);
  const ey = ry * Math.sin(angle);
  return {
    x: cx + ex * Math.cos(rad) - ey * Math.sin(rad),
    y: cy + ex * Math.sin(rad) + ey * Math.cos(rad),
  };
}

/* ─────────────────────────── component ─────────────────────────── */
export default function TechnicalSkills() {
  const stageRef = useRef(null);
  const badgeRefs = useRef([]);
  const animRef = useRef(null);
  const [dims, setDims] = useState({ w: 1050, h: 580 });

  const assigned = assignOrbits(SKILLS, ORBITS);

  /* — Canvas starfield — */
  useEffect(() => {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.001,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      /* deep dark gradient */
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      bg.addColorStop(0, '#0d1626');
      bg.addColorStop(0.6, '#080e1b');
      bg.addColorStop(1, '#030509');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* gold centre glow */
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.52, 0, w * 0.5, h * 0.52, w * 0.4);
      glow.addColorStop(0, 'rgba(185,154,94,0.09)');
      glow.addColorStop(1, 'rgba(185,154,94,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      stars.forEach(s => {
        s.a += s.speed;
        const alpha = Math.sin(s.a) * 0.4 + 0.5;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(209,183,126,${alpha * 0.65})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* — Badge float animation — */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animate = (ts) => {
      const t = ts * 0.0005;
      badgeRefs.current.forEach((el, i) => {
        if (!el) return;
        const fy = Math.sin(t * 0.9 + i * 0.73) * 3;
        el.style.transform = `translate(-50%, calc(-50% + ${fy}px))`;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* — Track container dims — */
  useEffect(() => {
    const update = () => {
      const el = stageRef.current;
      if (el) setDims({ w: el.clientWidth || 1050, h: el.clientHeight || 580 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cx = dims.w * 0.5;
  const cy = dims.h * 0.52;

  return (
    <section
      id="skills"
      className="relative py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050a12 0%, #070b18 100%)' }}
    >
      {/* Canvas starfield */}
      <canvas
        id="skills-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 layout-container">
        {/* ── Heading ── */}
        <div className="text-center mb-2">
          <h2
            className="font-display font-bold mb-2"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              background: 'linear-gradient(135deg, #e2c991 0%, #b99a5e 50%, #d1b77e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Technical Competencies
          </h2>

          {/* gold divider */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #b99a5e)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#b99a5e', boxShadow: '0 0 6px #b99a5e' }} />
            <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #b99a5e)' }} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 font-mono text-xs tracking-widest uppercase">
            <span className="flex items-center gap-2 text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4a7fcb', boxShadow: '0 0 7px #4a7fcb88' }} />
              Production Mastered
            </span>
            <span className="flex items-center gap-2 text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#c4a04a', boxShadow: '0 0 7px #c4a04a88' }} />
              Learning in Progress
            </span>
          </div>
        </div>

        {/* ── Orbital stage — desktop ── */}
        <div
          ref={stageRef}
          className="relative hidden md:block mx-auto"
          style={{ width: '100%', maxWidth: 1050, height: 580 }}
        >
          {/* SVG ellipse rings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="sk-glow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {ORBITS.map((o, i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={o.rx * dims.w}
                ry={o.ry * dims.h}
                transform={`rotate(${o.tilt}, ${cx}, ${cy})`}
                fill="none"
                stroke={`rgba(185,154,94,${i === 0 ? 0.35 : i === 1 ? 0.22 : 0.14})`}
                strokeWidth={i === 0 ? 1.4 : i === 1 ? 1.1 : 0.8}
                filter={i === 0 ? 'url(#sk-glow)' : undefined}
              />
            ))}
          </svg>

          {/* Centre core pulse */}
          <div
            className="absolute rounded-full"
            style={{
              left: cx, top: cy,
              width: 80, height: 80,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(185,154,94,0.18) 0%, rgba(185,154,94,0.04) 60%, transparent 100%)',
              border: '1px solid rgba(185,154,94,0.35)',
              boxShadow: '0 0 50px rgba(185,154,94,0.22)',
              zIndex: 5,
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />

          {/* Skill badges */}
          {assigned.map((skill, i) => {
            const o = ORBITS[skill.orbit];
            const pt = ellipsePoint(cx, cy, o.rx * dims.w, o.ry * dims.h, o.tilt, skill.angle);
            const isMastered = skill.status === 'mastered';
            const isLg = skill.size === 'lg';
            const isSm = skill.size === 'sm';

            return (
              <div
                key={`${skill.name}-${i}`}
                ref={el => { badgeRefs.current[i] = el; }}
                className="absolute select-none"
                style={{
                  left: pt.x,
                  top: pt.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  willChange: 'transform',
                }}
              >
                <span
                  className="flex items-center gap-1.5 rounded-full font-mono whitespace-nowrap cursor-default transition-all duration-200 hover:scale-110"
                  style={{
                    padding: isLg ? '5px 14px' : isSm ? '3px 9px' : '4px 11px',
                    fontSize: isLg ? '0.76rem' : isSm ? '0.58rem' : '0.67rem',
                    fontWeight: isLg ? 700 : 600,
                    background: 'rgba(10,18,36,0.92)',
                    border: isMastered
                      ? '1px solid rgba(74,127,203,0.5)'
                      : '1px solid rgba(196,160,74,0.6)',
                    color: isMastered ? '#b8ccec' : '#d4b46a',
                    boxShadow: isMastered
                      ? '0 2px 14px rgba(74,127,203,0.14), inset 0 1px 0 rgba(255,255,255,0.04)'
                      : '0 2px 14px rgba(196,160,74,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(10px)',
                    letterSpacing: '0.01em',
                  }}
                >
                  <span
                    className="rounded-full shrink-0"
                    style={{
                      width: isLg ? 7 : 6,
                      height: isLg ? 7 : 6,
                      background: isMastered ? '#4a7fcb' : '#c4a04a',
                      boxShadow: isMastered ? '0 0 5px #4a7fcb' : '0 0 5px #c4a04a',
                    }}
                  />
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Mobile fallback ── */}
        <div className="md:hidden mt-6 flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
          {SKILLS.map((skill, i) => {
            const isMastered = skill.status === 'mastered';
            return (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[0.65rem] font-semibold"
                style={{
                  background: 'rgba(10,18,36,0.9)',
                  border: isMastered ? '1px solid rgba(74,127,203,0.45)' : '1px solid rgba(196,160,74,0.5)',
                  color: isMastered ? '#b8ccec' : '#d4b46a',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: isMastered ? '#4a7fcb' : '#c4a04a' }}
                />
                {skill.name}
              </span>
            );
          })}
        </div>

        {/* ── Category summary cards ── */}
        <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Languages',  count: 5  },
            { label: 'Frontend',   count: 7  },
            { label: 'Backend',    count: 6  },
            { label: 'Databases',  count: 6  },
            { label: 'AI / ML',    count: 7  },
            { label: 'Toolchain',  count: 8  },
          ].map(cat => (
            <div
              key={cat.label}
              className="text-center px-2 py-3 rounded-xl"
              style={{
                background: 'rgba(10,18,36,0.75)',
                border: '1px solid rgba(185,154,94,0.14)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="font-mono text-[9px] tracking-widest uppercase text-gray-500 mb-0.5">{cat.label}</div>
              <div className="font-bold text-base" style={{ color: '#b99a5e' }}>{cat.count}+</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.08); }
        }
      `}</style>
    </section>
  );
}
