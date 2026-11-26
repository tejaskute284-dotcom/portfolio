import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import HackathonsDeck from './components/HackathonsDeck.jsx';
import Education from './components/Education.jsx';
import GitHubStats from './components/GitHubStats.jsx';
import Certifications from './components/Certifications.jsx';
import TechnicalSkills from './components/TechnicalSkills.jsx';
import ResearchVision from './components/ResearchVision.jsx';
import Contact from './components/Contact.jsx';
import { GitHubIcon, LinkedInIcon } from './components/Icons.jsx';
import { CertificateModal, ResumeModal, VerifyModal } from './components/Modals.jsx';

const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'experience',
  'hackathons',
  'education',
  'github-stats',
  'certifications',
  'skills',
  'future-vision',
  'contact'
];

export default function App() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [certModalData, setCertModalData] = useState(null);
  const [verifyModalData, setVerifyModalData] = useState(null);
  const lastTriggerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const onScroll = () => {
      const scrollY = window.scrollY + 200;
      let activeIdx = 0;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.offsetTop <= scrollY) {
          activeIdx = i;
          break;
        }
      }
      setCurrentSectionIndex(activeIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const restoreFocus = () => {
    const el = lastTriggerRef.current;
    lastTriggerRef.current = null;
    if (el && typeof el.focus === 'function') {
      setTimeout(() => el.focus(), 20);
    }
  };

  const handleOpenResume = (trigger) => {
    lastTriggerRef.current = trigger || document.activeElement;
    setResumeOpen(true);
  };

  const handleOpenCertificate = (img, title, subtitle, trigger) => {
    lastTriggerRef.current = trigger || document.activeElement;
    setCertModalData({ img, title, subtitle });
  };

  const handleOpenVerify = (title, id, url, trigger) => {
    lastTriggerRef.current = trigger || document.activeElement;
    setVerifyModalData({ title, id, url });
  };

  const anyModalOpen = resumeOpen || Boolean(certModalData) || Boolean(verifyModalData);

  return (
    <div className="bg-bgPrimary text-textSecondary selection:bg-accentGold selection:text-[#070B12]">
      <Navbar activeSection={SECTION_IDS[currentSectionIndex]} onOpenResume={handleOpenResume} />

      <Hero />

      <main id="portfolio-main-content">
        <About />
        <Projects />
        <Experience onOpenCertificate={handleOpenCertificate} />
        <HackathonsDeck onOpenCertificate={handleOpenCertificate} isModalOpen={anyModalOpen} />
        <Education />
        <GitHubStats />
        <Certifications onOpenVerify={handleOpenVerify} />
        <TechnicalSkills />
        <ResearchVision />
        <Contact />

        <footer className="border-t border-border py-12 bg-bgPrimary">
          <div className="layout-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border border-accentGold/60 flex items-center justify-center text-[10px] font-display font-bold text-accentGold">
                TK
              </span>
              <p className="text-xs text-textSecondary font-sans">
                Designed &amp; developed by <span className="text-textPrimary font-semibold">Tejas Sharad Kute</span> · &copy; 2026
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/tejaskute284-dotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-md bg-bgTertiary text-textSecondary hover:text-accentGold transition border border-border"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/tejas-kute-512aa2363"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-md bg-bgTertiary text-textSecondary hover:text-accentGold transition border border-border"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </footer>
      </main>

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => {
          setResumeOpen(false);
          restoreFocus();
        }}
      />
      <CertificateModal
        data={certModalData}
        onClose={() => {
          setCertModalData(null);
          restoreFocus();
        }}
      />
      <VerifyModal
        data={verifyModalData}
        onClose={() => {
          setVerifyModalData(null);
          restoreFocus();
        }}
      />
    </div>
  );
}
