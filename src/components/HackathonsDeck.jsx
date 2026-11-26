import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { HACKATHONS } from '../data/hackathons.js';
import { isSafeAssetPath } from '../utils/security.js';

export default function HackathonsDeck({ onOpenCertificate, isModalOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));
  const deckRef = useRef(null);
  const isInViewRef = useRef(true);
  const pointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const suppressClickRef = useRef(false);

  const total = HACKATHONS.length;

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 640);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      if (document.hidden || !isInViewRef.current || isModalOpen || pointerDownRef.current) return;
      setActiveIndex((prev) => (prev + 1) % total);
    }, 2600);

    return () => clearInterval(timer);
  }, [total, isModalOpen]);

  const goTo = (index) => setActiveIndex(((index % total) + total) % total);
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const offsetX1 = isCompact ? 18 : 42;
  const offsetX2 = isCompact ? 34 : 80;
  const offsetY1 = isCompact ? 8 : 10;
  const offsetY2 = isCompact ? 16 : 20;

  return (
    <section id="hackathons" className="section-midnight reveal revealed">
      <div className="layout-container-carousel">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            04 / Honors
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Hackathon &amp; Workshop Credentials</h2>
          <p className="section-intro-text">
            Click on any card to view the official verified certificate photograph.
          </p>
        </div>

        <div
          id="hackathons-deck"
          ref={deckRef}
          className="hackathon-deck-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Hackathon and Workshop Credentials Card Deck"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              goPrev();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              goNext();
            }
          }}
        >
          <div
            className="hackathon-deck-stage"
            onTouchStart={(e) => {
              startXRef.current = e.changedTouches[0].screenX;
            }}
            onTouchEnd={(e) => {
              const diff = startXRef.current - e.changedTouches[0].screenX;
              if (Math.abs(diff) > 35) {
                if (diff > 0) goNext();
                else goPrev();
              }
            }}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              pointerDownRef.current = true;
              startXRef.current = e.clientX;
            }}
            onMouseUp={(e) => {
              if (!pointerDownRef.current) return;
              pointerDownRef.current = false;
              const diff = startXRef.current - e.clientX;
              if (Math.abs(diff) > 45) {
                suppressClickRef.current = true;
                setTimeout(() => {
                  suppressClickRef.current = false;
                }, 60);
                if (diff > 0) goNext();
                else goPrev();
              }
            }}
            onMouseLeave={() => {
              pointerDownRef.current = false;
            }}
          >
            {HACKATHONS.map((h, idx) => {
              const forwardDiff = (idx - activeIndex + total) % total;
              const backwardDiff = (activeIndex - idx + total) % total;

              let state = 'hidden';
              let transform = 'translate3d(0, 28px, -140px) scale(0.82)';
              let opacity = 0;
              let zIndex = 1;
              let pointerEvents = 'none';

              if (forwardDiff === 0) {
                state = 'active';
                transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
                opacity = 1;
                zIndex = 30;
                pointerEvents = 'auto';
              } else if (forwardDiff === 1) {
                state = 'next-1';
                transform = `translate3d(${offsetX1}px, ${offsetY1}px, -45px) scale(0.94) rotate(2.5deg)`;
                opacity = 0.88;
                zIndex = 20;
                pointerEvents = 'auto';
              } else if (forwardDiff === 2 && total > 3) {
                state = 'next-2';
                transform = `translate3d(${offsetX2}px, ${offsetY2}px, -90px) scale(0.88) rotate(5deg)`;
                opacity = 0.62;
                zIndex = 10;
                pointerEvents = 'auto';
              } else if (backwardDiff === 1) {
                state = 'prev-1';
                transform = `translate3d(-${offsetX1}px, ${offsetY1}px, -45px) scale(0.94) rotate(-2.5deg)`;
                opacity = 0.88;
                zIndex = 20;
                pointerEvents = 'auto';
              }

              const safeImg = isSafeAssetPath(h.img) ? `/${h.img}` : '';

              return (
                <div
                  key={h.title}
                  className="hackathon-deck-card"
                  data-deck-state={state}
                  aria-hidden={state === 'hidden'}
                  style={{ transform, opacity, zIndex, pointerEvents }}
                  onClick={(e) => {
                    if (suppressClickRef.current) return;
                    if (idx !== activeIndex) {
                      e.preventDefault();
                      e.stopPropagation();
                      goTo(idx);
                    } else if (safeImg) {
                      onOpenCertificate(safeImg, h.certTitle, h.certSubtitle, e.currentTarget);
                    }
                  }}
                >
                  <div className="premium-card h-full flex flex-col justify-between group hov-card-border transition cursor-pointer">
                    <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">
                            {h.org}
                          </span>
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-accentGold/30 text-accentGold">
                            {h.badge?.label}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-textPrimary mb-2 hov-card-title transition">
                          {h.title}
                        </h3>
                        <p className="text-xs text-textSecondary mb-3.5 line-clamp-1">{h.subtitle}</p>
                        {safeImg && (
                          <div className="relative overflow-hidden rounded-lg border border-border aspect-video mb-3.5 bg-bgTertiary shadow-sm">
                            <img
                              src={safeImg}
                              alt={h.imgAlt || h.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-semibold">
                              <Maximize2 className="w-4 h-4 text-accentGold" /> View Certificate
                            </div>
                          </div>
                        )}
                        <p className="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">{h.desc}</p>
                      </div>
                      <div className="border-t border-border pt-4 flex items-center justify-between mt-auto">
                        <span className="text-[11px] text-textMuted font-mono">{h.footerLeft}</span>
                        <span className="text-xs font-medium text-accentGold flex items-center gap-1.5 group-hover:underline">
                          View Certificate <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hackathon-deck-controls">
            <button
              type="button"
              onClick={goPrev}
              className="hackathon-deck-btn"
              aria-label="Previous Achievement Card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="hackathon-deck-counter font-mono text-xs text-textSecondary">
                {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <div className="hackathon-deck-dots">
                {HACKATHONS.map((h, i) => (
                  <button
                    key={h.title}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`hackathon-deck-dot ${i === activeIndex ? 'is-active' : ''}`}
                    aria-label={`Show achievement card ${i + 1}`}
                    aria-current={i === activeIndex}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={goNext}
              className="hackathon-deck-btn"
              aria-label="Next Achievement Card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
