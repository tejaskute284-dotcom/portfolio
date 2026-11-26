import React from 'react';
import { Award } from 'lucide-react';

export default function Experience({ onOpenCertificate }) {
  return (
    <section id="experience" className="section-obsidian reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            03 / Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Professional Experience</h2>
        </div>

        <div className="premium-card max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <h3 className="text-2xl font-bold text-textPrimary">Web Development Intern</h3>
              <p className="text-accentGold font-medium text-sm mt-0.5">Aerus Infotech Solutions Pvt. Ltd.</p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-mono px-3 py-1 rounded-full border border-accentGold/30 text-accentGold bg-bgTertiary">
                Nov 2025 – Present
              </span>
              <p className="text-xs text-textMuted mt-1 font-mono">Navi Mumbai, India</p>
            </div>
          </div>

          <ul className="space-y-4 mb-8 text-sm text-textSecondary list-none pl-0 leading-relaxed font-sans">
            <li className="flex items-start gap-3">
              <span className="text-accentGold mt-1 font-serif text-lg leading-none">✦</span>
              <span>
                Led development of the Housing Society Maintenance Management System (HSMMS) covering 8 core modules:
                resident management, billing engine, complaint workflows, and security gate access.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accentGold mt-1 font-serif text-lg leading-none">✦</span>
              <span>
                Architected Role-Based Access Control (RBAC) security for 4 distinct personas (Admin, Resident, Staff,
                Security Guard) using Node.js, Express, and React.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accentGold mt-1 font-serif text-lg leading-none">✦</span>
              <span>
                Designed and integrated RESTful APIs linking MySQL relational persistence to React and vanilla JavaScript
                frontends, maintaining strict transactional consistency.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accentGold mt-1 font-serif text-lg leading-none">✦</span>
              <span>
                Compiled comprehensive engineering documentation — PRD, TRD, and architecture specifications — for
                cross-team development alignment.
              </span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border mt-2">
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Express.js', 'React', 'MySQL', 'REST APIs', 'RBAC Security', 'System Specs'].map((tag) => (
                <span key={tag} className="tech-tag">
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) =>
                onOpenCertificate(
                  '/assets/certificates/aerus_internship_completion.png',
                  'Aerus Infotech Solutions — Certificate of Completion',
                  'Web Development Internship · Aerus Infotech Solutions Pvt. Ltd.',
                  e.currentTarget
                )
              }
              className="btn-luxury-secondary text-xs px-3.5 py-1.5 flex items-center gap-2 shrink-0 font-mono"
            >
              <Award className="w-4 h-4 text-accentGold" />
              <span>View Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
