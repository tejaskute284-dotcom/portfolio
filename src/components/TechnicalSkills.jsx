import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─── skills ─────────────────────────────────────────────────────── */
const SKILLS = [
  { name: 'React 18',         status: 'mastered', size: 'lg' },
  { name: 'Express.js',       status: 'mastered', size: 'lg' },
  { name: 'RBAC',             status: 'mastered', size: 'md' },
  { name: 'SQL',              status: 'mastered', size: 'md' },
  { name: 'TypeScript',       status: 'mastered', size: 'lg' },
  { name: 'FastAPI',          status: 'learning', size: 'lg' },
  { name: 'MongoDB',          status: 'mastered', size: 'md' },
  { name: 'Prisma ORM',       status: 'learning', size: 'lg' },
  { name: 'Scikit-Learn',     status: 'mastered', size: 'lg' },
  { name: 'PostGIS',          status: 'learning', size: 'md' },
  { name: 'JWT Security',     status: 'mastered', size: 'md' },
  { name: 'NumPy',            status: 'mastered', size: 'lg' },
  { name: 'Postman',          status: 'mastered', size: 'md' },
  { name: 'Pandas',           status: 'mastered', size: 'md' },
  { name: 'TensorFlow',       status: 'learning', size: 'lg' },
  { name: 'Gemini Vision AI', status: 'learning', size: 'lg' },
  { name: 'Linux',            status: 'mastered', size: 'md' },
  { name: 'VS Code',          status: 'mastered', size: 'md' },
  { name: 'Lenis Scroll',     status: 'mastered', size: 'sm' },
  { name: 'PyTorch',          status: 'learning', size: 'lg' },
  { name: 'Node.js',          status: 'mastered', size: 'lg' },
  { name: 'Tailwind CSS',     status: 'mastered', size: 'md' },
  { name: 'Python',           status: 'mastered', size: 'lg' },
  { name: 'JavaScript',       status: 'mastered', size: 'lg' },
  { name: 'PostgreSQL',       status: 'mastered', size: 'md' },
  { name: 'MySQL',            status: 'mastered', size: 'md' },
  { name: 'REST APIs',        status: 'mastered', size: 'md' },
  { name: 'WebSockets',       status: 'learning', size: 'md' },
  { name: 'Framer Motion',    status: 'learning', size: 'md' },
  { name: 'Vite',             status: 'mastered', size: 'md' },
  { name: 'Chart.js',         status: 'mastered', size: 'sm' },
  { name: 'Git & GitHub',     status: 'mastered', size: 'sm' },
  { name: 'Cloudinary',       status: 'mastered', size: 'sm' },
  { name: 'Zod',              status: 'mastered', size: 'sm' },
  { name: 'DSA Algorithms',   status: 'mastered', size: 'sm' },
  { name: 'Leaflet.js',       status: 'mastered', size: 'sm' },
  { name: 'Supabase',         status: 'learning', size: 'sm' },
  { name: 'C / C++',          status: 'mastered', size: 'md' },
  { name: 'HTML5 / CSS',      status: 'mastered', size: 'md' },
];

/* ─── fixed viewBox dimensions (px) ─────────────────────────────── */
const VW = 1100;   // viewBox width
const VH = 560;    // viewBox height
const CX = VW / 2; // centre x
const CY = VH / 2 + 10; // centre y (slightly below mid)

/* Three ellipses in absolute px — stays within VW×VH with badge padding */
const ORBITS = [
  { rx: 160, ry: 90,  tilt: -8, count: 8  },
  { rx: 300, ry: 165, tilt: -6, count: 14 },
  { rx: 450, ry: 235, tilt: -4, count: 17 },
];

/* distribute skills */
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
    result.push({ ...skills[idx], orbit: ORBITS.length - 1, angle: (idx / skills.length) * 2 * Math.PI });
    idx++;
  }
  return result;
}

/* point on a tilted ellipse */
function ellipsePoint(cx, cy, rx, ry, tiltDeg, angle) {
  const rad = (tiltDeg * Math.PI) / 180;
  const ex = rx * Math.cos(angle);
  const ey = ry * Math.sin(angle);
  return {
    x: cx + ex * Math.cos(rad) - ey * Math.sin(rad),
    y: cy + ex * Math.sin(rad) + ey * Math.cos(rad),
  };
}

/* badge px sizes */
const SIZE = { lg: { fs: 12, px: 14, py: 6, dot: 7 }, md: { fs: 11, px: 11, py: 5, dot: 6 }, sm: { fs: 10, px: 9, py: 4, dot: 5 } };

/* ─── component ─────────────────────────────────────────────────── */
export default function TechnicalSkills() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);
  const floatRefs = useRef([]);

  const assigned = assignOrbits(SKILLS, ORBITS);

  /* — starfield canvas — */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    let w = 0, h = 0;

    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width  = w;
      canvas.height = h;
    };
    resize();

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.004 + 0.001,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createRadialGradient(w*.5, h*.45, 0, w*.5, h*.5, Math.max(w,h)*.9);
      bg.addColorStop(0,   '#0d1828');
      bg.addColorStop(0.6, '#080e1b');
      bg.addColorStop(1,   '#030509');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w*.5, h*.52, 0, w*.5, h*.52, w*.38);
      glow.addColorStop(0, 'rgba(185,154,94,0.09)');
      glow.addColorStop(1, 'rgba(185,154,94,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

      stars.forEach(s => {
        s.a += s.s;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(209,183,126,${(Math.sin(s.a)*.4+.5)*.6})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  /* — badge float — */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tick = (ts) => {
      timeRef.current = ts * 0.0005;
      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        const fy = Math.sin(timeRef.current * 0.9 + i * 0.73) * 3;
        el.style.transform = `translate(-50%, calc(-50% + ${fy}px))`;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section
      id="skills"
      style={{ background: 'linear-gradient(180deg,#050a12 0%,#070b18 100%)', padding: '72px 0 60px' }}
    >
      {/* ── heading ── */}
      <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontFamily: 'var(--font-display, Georgia, serif)',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
          background: 'linear-gradient(135deg,#e2c991 0%,#b99a5e 50%,#d1b77e 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          margin: '0 0 10px',
        }}>Technical Competencies</h2>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:12 }}>
          <div style={{ height:1, width:70, background:'linear-gradient(to right,transparent,#b99a5e)' }} />
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#b99a5e', boxShadow:'0 0 7px #b99a5e' }} />
          <div style={{ height:1, width:70, background:'linear-gradient(to left,transparent,#b99a5e)' }} />
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:28, fontFamily:'monospace', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6b7a99' }}>
          <span style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ display:'inline-block', width:9, height:9, borderRadius:'50%', background:'#4a7fcb', boxShadow:'0 0 7px #4a7fcb88' }} />
            Production Mastered
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ display:'inline-block', width:9, height:9, borderRadius:'50%', background:'#c4a04a', boxShadow:'0 0 7px #c4a04a88' }} />
            Learning in Progress
          </span>
        </div>
      </div>

      {/* ── orbital stage — desktop ── */}
      <div
        className="hidden md:block"
        style={{ position:'relative', width:'100%', overflow:'hidden' }}
      >
        {/* canvas background */}
        <canvas
          ref={canvasRef}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
        />

        {/* SVG: viewBox keeps everything in proportion; overflow visible so badges aren't clipped */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          style={{ display:'block', width:'100%', height:'auto', minHeight:380, maxHeight:600, position:'relative', zIndex:1, overflow:'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="sk-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
              <feComposite in="SourceGraphic" in2="b" operator="over"/>
            </filter>
          </defs>

          {/* ellipse rings */}
          {ORBITS.map((o, i) => (
            <ellipse
              key={i}
              cx={CX} cy={CY}
              rx={o.rx} ry={o.ry}
              transform={`rotate(${o.tilt},${CX},${CY})`}
              fill="none"
              stroke={`rgba(185,154,94,${i===0?.38:i===1?.24:.14})`}
              strokeWidth={i===0?1.5:i===1?1.1:.8}
              filter={i===0?'url(#sk-glow)':undefined}
            />
          ))}

          {/* centre core */}
          <circle cx={CX} cy={CY} r={42} fill="none" stroke="rgba(185,154,94,0.3)" strokeWidth={1}/>
          <circle cx={CX} cy={CY} r={28} fill="rgba(185,154,94,0.07)" stroke="rgba(185,154,94,0.22)" strokeWidth={1}/>

          {/* skill badges as foreignObject — scales with SVG */}
          {assigned.map((skill, i) => {
            const o   = ORBITS[skill.orbit];
            const pt  = ellipsePoint(CX, CY, o.rx, o.ry, o.tilt, skill.angle);
            const s   = SIZE[skill.size];
            const isMastered = skill.status === 'mastered';

            // badge dimensions in viewBox units
            const badgeW = skill.name.length * 7.2 + s.px * 2 + 16;
            const badgeH = s.fs + s.py * 2 + 2;

            return (
              <foreignObject
                key={`${skill.name}-${i}`}
                x={pt.x - badgeW / 2}
                y={pt.y - badgeH / 2}
                width={badgeW}
                height={badgeH}
                style={{ overflow: 'visible' }}
              >
                <div
                  ref={el => { floatRefs.current[i] = el; }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: `${s.py}px ${s.px}px`,
                    borderRadius: 999,
                    fontFamily: 'monospace',
                    fontSize: s.fs,
                    fontWeight: skill.size === 'lg' ? 700 : 600,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.01em',
                    background: 'rgba(8,15,30,0.92)',
                    border: isMastered
                      ? '1px solid rgba(74,127,203,0.5)'
                      : '1px solid rgba(196,160,74,0.6)',
                    color: isMastered ? '#b8ccec' : '#d4b46a',
                    boxShadow: isMastered
                      ? '0 2px 14px rgba(74,127,203,0.14)'
                      : '0 2px 14px rgba(196,160,74,0.18)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'default',
                    userSelect: 'none',
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <span style={{
                    width: s.dot, height: s.dot,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isMastered ? '#4a7fcb' : '#c4a04a',
                    boxShadow: isMastered ? '0 0 5px #4a7fcb' : '0 0 5px #c4a04a',
                  }}/>
                  {skill.name}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* ── mobile: wrap pill list ── */}
      <div
        className="md:hidden"
        style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', padding:'12px 16px 0', maxWidth:480, margin:'0 auto' }}
      >
        {SKILLS.map((skill, i) => {
          const isMastered = skill.status === 'mastered';
          return (
            <span key={i} style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'5px 12px', borderRadius:999,
              fontFamily:'monospace', fontSize:11, fontWeight:600,
              background:'rgba(8,15,30,0.9)',
              border: isMastered ? '1px solid rgba(74,127,203,0.45)' : '1px solid rgba(196,160,74,0.5)',
              color: isMastered ? '#b8ccec' : '#d4b46a',
            }}>
              <span style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background: isMastered ? '#4a7fcb' : '#c4a04a' }}/>
              {skill.name}
            </span>
          );
        })}
      </div>

      {/* ── category summary cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12, maxWidth:900, margin:'32px auto 0', padding:'0 24px' }} className="grid-cols-3 md:grid-cols-6">
        {[
          { label:'Languages',  count:5  },
          { label:'Frontend',   count:7  },
          { label:'Backend',    count:6  },
          { label:'Databases',  count:6  },
          { label:'AI / ML',    count:7  },
          { label:'Toolchain',  count:8  },
        ].map(cat => (
          <div key={cat.label} style={{
            textAlign:'center', padding:'10px 8px', borderRadius:14,
            background:'rgba(8,15,30,0.78)',
            border:'1px solid rgba(185,154,94,0.14)',
            backdropFilter:'blur(8px)',
          }}>
            <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4a5568', marginBottom:3 }}>{cat.label}</div>
            <div style={{ fontWeight:700, fontSize:16, color:'#b99a5e' }}>{cat.count}+</div>
          </div>
        ))}
      </div>
    </section>
  );
}
