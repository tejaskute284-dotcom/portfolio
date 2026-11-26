import React, { useEffect, useRef, useState } from 'react';
import { Code, Terminal } from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }) {
  const [value, setValue] = useState(target);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const start = performance.now();
            const duration = 1200;

            const step = (now) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = p * (2 - p);
              setValue(Math.floor(eased * target));
              if (p < 1) requestAnimationFrame(step);
              else setValue(target);
            };
            requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const formatted = value < 10 ? `0${value}` : `${value}`;
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section-obsidian reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            01 / Profile
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">
            Engineering with <span className="gold-gradient-text">Purpose</span>
          </h2>
          <p className="section-intro-text">
            Bridging software architecture with data-driven artificial intelligence to build reliable, scalable digital
            products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-textSecondary text-base leading-relaxed font-sans">
              I am an AI &amp; Machine Learning engineering undergraduate at{' '}
              <strong className="text-textPrimary font-semibold">Atharva University Mumbai</strong> (2025 – 2029),
              combining deep theoretical foundations with practical, production-level full-stack development.
            </p>
            <p className="text-textSecondary text-base leading-relaxed font-sans">
              During my tenure as a Web Development Intern at{' '}
              <strong className="text-textPrimary font-semibold">Aerus Infotech Solutions Pvt. Ltd.</strong>, I led
              critical architecture on the Housing Society Maintenance Management System (HSMMS), designing multi-role
              RBAC security and relational persistence across 8 functional modules.
            </p>

            {/* Luxury Stat Strip */}
            <div className="stat-strip p-6 mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="stat-item p-2 rounded">
                <p className="stat-strip-number">
                  <AnimatedCounter target={5} />
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-textMuted mt-1">
                  Production Projects
                </p>
              </div>
              <div className="stat-item p-2 rounded border-x border-border">
                <p className="stat-strip-number">
                  <AnimatedCounter target={7} />
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-textMuted mt-1">
                  Hackathons &amp; Honours
                </p>
              </div>
              <div className="stat-item p-2 rounded">
                <p className="stat-strip-number">
                  <AnimatedCounter target={300} suffix="+" />
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-textMuted mt-1">
                  Annual Commits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="premium-card !p-5 flex items-start gap-4">
                <Code className="w-5 h-5 text-accentGold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-textPrimary text-sm">Full-Stack Mastery</h4>
                  <p className="text-xs text-textSecondary mt-1">React, FastAPI, Node.js, PostgreSQL, MySQL &amp; MongoDB.</p>
                </div>
              </div>
              <div className="premium-card !p-5 flex items-start gap-4">
                <Terminal className="w-5 h-5 text-accentGold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-textPrimary text-sm">AI &amp; Research</h4>
                  <p className="text-xs text-textSecondary mt-1">Deep Learning, PostGIS Spatial Triage, &amp; Computer Vision.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Profile Record Card */}
          <div className="lg:col-span-5">
            <div className="premium-card editorial-frame">
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                  <span className="font-mono text-[11px] text-textMuted uppercase tracking-widest">
                    Developer Dossier
                  </span>
                  <span className="w-2 h-2 rounded-full bg-accentGold" />
                </div>
                <div className="font-mono text-xs sm:text-sm space-y-3 text-textSecondary">
                  <p>
                    <span className="text-accentGold font-bold">name:</span> &quot;Tejas Sharad Kute&quot;
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">role:</span> &quot;AI/ML Enthusiast &amp; Full-Stack Dev&quot;
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">degree:</span> &quot;B.Tech in Artificial Intelligence&quot;
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">institution:</span> &quot;Atharva University Mumbai&quot;
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">internship:</span> &quot;Aerus Infotech Solutions&quot;
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">focusAreas:</span> [&quot;Deep Learning&quot;, &quot;PostGIS&quot;,
                    &quot;System Design&quot;]
                  </p>
                  <p>
                    <span className="text-accentGold font-bold">status:</span> &quot;Available for Internships&quot;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-sans text-textMuted">
                  <span>Verified System Record</span>
                  <span className="text-accentGold font-mono">Mumbai, IN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
