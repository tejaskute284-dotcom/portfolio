import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Award, Mail } from 'lucide-react';
import GoldenParticleWave from './GoldenParticleWave.jsx';
import { GitHubIcon, LinkedInIcon } from './Icons.jsx';

const TAGLINES = [
  'Crafting intelligent AI/ML systems with architectural precision.',
  'Architecting robust full-stack software & high-throughput backends.',
  'Transforming complex mathematical models into production realities.'
];

export default function Hero() {
  const heroRef = useRef(null);
  const [tagline, setTagline] = useState(TAGLINES[0]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTagline(TAGLINES[0]);
      return;
    }

    let tagIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      const currentText = TAGLINES[tagIndex];
      let delay = 65;

      if (isDeleting) {
        charIndex--;
        setTagline(currentText.substring(0, charIndex));
        delay = 30;
      } else {
        charIndex++;
        setTagline(currentText.substring(0, charIndex));
        delay = 65;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        delay = 2600;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        tagIndex = (tagIndex + 1) % TAGLINES.length;
        delay = 600;
      }

      timer = setTimeout(tick, delay);
    };

    tick();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="section-midnight relative min-h-[100dvh] flex flex-col justify-center overflow-x-hidden pt-20 sm:pt-24 pb-8 sm:pb-12"
    >
      <GoldenParticleWave heroRef={heroRef} />

      <div className="layout-container z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accentGoldMuted animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-accentGoldMuted font-medium">
                DEVELOPER · CREATOR · PROBLEM SOLVER
              </span>
            </div>

            <div className="mb-3 max-w-2xl">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-textPrimary leading-[1.15]">
                Building Digital Experiences with Purpose &amp; Precision.
              </h2>
            </div>

            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold">
                <span className="gold-gradient-text hero-name-3d" id="hero-name-target">
                  Tejas Sharad Kute
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-textSecondary leading-relaxed mb-6 max-w-2xl font-sans font-light">
              I build modern digital products, intelligent applications, and meaningful user experiences. Focused on
              full-stack architecture, clean code, and AI systems at Atharva University Mumbai.
            </p>

            <div className="h-8 mb-8 flex items-center">
              <span className="font-mono text-xs sm:text-sm text-textMuted tracking-wider" id="typewriter-tagline">
                {tagline}
              </span>
              <span className="typewriter-cursor" />
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-8 w-full sm:w-auto">
              <a href="#about" className="btn-luxury-primary w-full sm:w-auto text-center cursor-pointer">
                <span>Explore My Work</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <a href="#contact" className="btn-luxury-secondary w-full sm:w-auto text-center">
                <span>Let's Connect</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/80 w-full max-w-xl text-[11px] font-mono text-textSecondary">
              <a
                href="https://github.com/tejaskute284-dotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accentGold transition"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
              <span className="opacity-30">/</span>
              <a
                href="https://linkedin.com/in/tejas-kute-512aa2363"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accentGold transition"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
              <span className="opacity-30">/</span>
              <a href="mailto:tejaskute284@gmail.com" className="flex items-center gap-2 hover:text-accentGold transition">
                <Mail className="w-4 h-4 text-accentGold" />
                <span>tejaskute284@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Side: Actual Portrait inside Gold Arch */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="portrait-container">
              <div className="portrait-backdrop-organic" />
              <div className="portrait-arch-frame">
                <div className="portrait-inner">
                  <img
                    src="/assets/tejas_portrait.jpg"
                    alt="Tejas Sharad Kute — Professional Portrait"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 right-2 sm:right-6 bg-bgSecondary border border-borderGold px-4 py-2.5 rounded-lg shadow-xl z-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accentGold/10 flex items-center justify-center text-accentGold">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-textMuted">
                    Internship &amp; Research
                  </div>
                  <div className="text-xs font-serif font-bold text-textPrimary">Aerus Infotech Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
