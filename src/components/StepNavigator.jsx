import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'Landing' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'hackathons', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'github-stats', label: 'GitHub' },
  { id: 'certifications', label: 'Credentials' },
  { id: 'skills', label: 'Skills' },
  { id: 'future-vision', label: 'Research' },
  { id: 'contact', label: 'Contact' }
];

export default function StepNavigator({ currentIndex }) {
  const scrollToIndex = (index) => {
    const target = document.getElementById(SECTIONS[index].id);
    if (!target) return;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-bgSecondary/90 backdrop-blur-md border border-borderGold px-4 py-2 rounded-full shadow-lg">
      <div className="flex items-center gap-2 pr-3 border-r border-border">
        <span className="text-[10px] font-mono text-textMuted uppercase tracking-wider">Step</span>
        <span className="text-xs font-mono font-bold text-accentGold">
          {String(currentIndex + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
        </span>
        <span className="text-xs font-sans font-medium text-textPrimary hidden sm:inline ml-1">
          {SECTIONS[currentIndex]?.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => currentIndex > 0 && scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
          className="p-1.5 rounded-full hover:bg-bgTertiary text-textSecondary hover:text-accentGold transition disabled:cursor-not-allowed"
          aria-label="Previous Section"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => currentIndex < SECTIONS.length - 1 && scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === SECTIONS.length - 1}
          style={{ opacity: currentIndex === SECTIONS.length - 1 ? 0.35 : 1 }}
          className="p-1.5 rounded-full hover:bg-bgTertiary text-textSecondary hover:text-accentGold transition disabled:cursor-not-allowed"
          aria-label="Next Section"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
