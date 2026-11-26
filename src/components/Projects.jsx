import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PROJECTS } from '../data/projects.js';
import { isSafeAssetPath, isValidHttpUrl } from '../utils/security.js';
import { GitHubIcon } from './Icons.jsx';

function ProjectCard({ p }) {
  const imgPath = isSafeAssetPath(p.img) ? `/${p.img}` : null;
  const hasGithub = isValidHttpUrl(p.github);
  const hasDemo = isValidHttpUrl(p.demo);

  return (
    <div className="project-marquee-card">
      <div className="premium-card h-full flex flex-col justify-between">
        <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight">{p.name}</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-accentGold/40 text-accentGold font-mono">
                {p.badge?.label}
              </span>
            </div>
            <p className="text-xs font-medium text-accentGold mb-3 line-clamp-1">{p.tagline}</p>

            {imgPath && (
              <div className="mb-3.5 overflow-hidden rounded-lg border border-border aspect-video bg-bgTertiary shadow-sm">
                <img
                  src={imgPath}
                  alt={p.imgAlt || p.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <p className="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">{p.desc}</p>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-textMuted block mb-1.5 uppercase tracking-wider">
                Collaborators
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(p.collaborators || []).map((c) => {
                  const cls = `text-[11px] px-2 py-0.5 rounded border border-border bg-bgTertiary ${
                    c.owner ? 'text-textPrimary font-semibold' : 'text-textSecondary'
                  } hover:border-accentGold hover:text-accentGoldDark transition inline-block`;
                  return isValidHttpUrl(c.url) ? (
                    <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className={cls}>
                      {c.name}
                    </a>
                  ) : (
                    <span key={c.name} className={cls}>
                      {c.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(p.tags || []).map((t) => (
                <span key={t} className="tech-tag text-[10px] px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-4">
              {p.internship ? (
                <span className="text-xs text-textSecondary italic">{p.internship}</span>
              ) : p.private ? (
                <span className="flex items-center gap-1.5 text-xs text-textSecondary opacity-75">
                  <GitHubIcon /> Private Repository
                </span>
              ) : (
                <>
                  {hasGithub && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-textPrimary hover:text-accentGoldDark transition"
                    >
                      <GitHubIcon /> GitHub
                    </a>
                  )}
                  {hasDemo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-accentGold hover:underline transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </>
              )}
            </div>
            <span className="text-[10px] text-textMuted font-mono block text-right">{p.footer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section-navy reveal revealed">
      <div className="layout-container-carousel">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            02 / Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Production &amp; Research Works</h2>
          <p className="section-intro-text">
            End-to-end full stack applications, intelligence platforms, and high-performance services.
          </p>
        </div>

        <div className="project-marquee-viewport" aria-label="Infinite continuous projects marquee">
          <div className="project-marquee-track">
            {PROJECTS.map((p) => (
              <ProjectCard key={`a-${p.name}`} p={p} />
            ))}
            {PROJECTS.map((p) => (
              <ProjectCard key={`b-${p.name}`} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
