import React from 'react';
import { Award, GitBranch } from 'lucide-react';

export default function ResearchVision() {
  return (
    <section id="future-vision" className="section-navy reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            09 / Research &amp; Trajectory
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Research &amp; Strategic Trajectory</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vision-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3 py-1 rounded border border-border text-textMuted uppercase">
                  Trajectory
                </span>
                <GitBranch className="w-4 h-4 text-accentGold" />
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-3">Open Source Ecosystems</h4>
              <p className="text-textSecondary text-sm leading-relaxed font-sans">
                Expanding core system competencies toward large-scale open-source architectures, deep framework
                contributions, and community-driven tools.
              </p>
            </div>
          </div>

          <a href="#hackathons" className="vision-card flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3 py-1 rounded border border-border text-textMuted uppercase">
                  Credentials
                </span>
                <Award className="w-4 h-4 text-accentGold" />
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-3 group-hover:text-accentGold transition">
                Hackathon &amp; Prototypes
              </h4>
              <p className="text-textSecondary text-sm leading-relaxed font-sans">
                Continuous participation in national hackathons like Cyber Cypher 5.0, IEEE Techithon, and SPIT
                Hackathon to build rapid, real-world prototypes.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
