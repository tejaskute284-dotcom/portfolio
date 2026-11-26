import React from 'react';

export default function Education() {
  return (
    <section id="education" className="section-obsidian reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            05 / Academics
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Academic Journey</h2>
        </div>

        <div className="timeline-container ml-6 pl-8 space-y-12 relative max-w-3xl mx-auto">
          <div className="timeline-item relative">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full border border-accentGold/40 text-accentGold bg-bgSecondary">
              2025 – 2029 (2nd Year)
            </span>
            <h3 className="text-2xl font-bold mt-3 text-textPrimary">
              B.Tech in Artificial Intelligence &amp; Machine Learning
            </h3>
            <p className="text-sm text-accentGold font-medium mt-1">
              Atharva University Mumbai (Atharva College of Engineering)
            </p>
            <p className="text-textSecondary text-sm mt-3 leading-relaxed font-sans">
              Core focus on Data Structures, Computer Architecture, Linear Algebra, Deep Learning Pipelines, and
              Enterprise Full-Stack Development.
            </p>
          </div>

          <div className="timeline-item relative">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full border border-border text-textMuted bg-bgSecondary">
              Year: 2025
            </span>
            <h3 className="text-xl font-bold mt-3 text-textPrimary">HSC (12th Grade — Science)</h3>
            <p className="text-sm text-textSecondary font-medium mt-1">R.P. Junior College</p>
            <p className="text-textSecondary text-sm mt-2 font-mono">
              Academic Score: <span className="text-accentGold font-bold">78.67%</span>
            </p>
          </div>

          <div className="timeline-item relative">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full border border-border text-textMuted bg-bgSecondary">
              Year: 2023
            </span>
            <h3 className="text-xl font-bold mt-3 text-textPrimary">SSC (10th Grade)</h3>
            <p className="text-sm text-textSecondary font-medium mt-1">St. Arnold High School</p>
            <p className="text-textSecondary text-sm mt-2 font-mono">
              Academic Score: <span className="text-accentGold font-bold">86%</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
