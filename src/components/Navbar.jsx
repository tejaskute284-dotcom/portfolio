import React, { useEffect, useRef, useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons.jsx';

/* Smooth-scroll to section with 80 px navbar offset */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function Navbar({ activeSection, onOpenResume }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 50);
  };

  const closeDrawer = (restoreFocus = true) => {
    setDrawerOpen(false);
    document.body.style.overflow = '';
    if (restoreFocus) menuBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const navLinks = [
    { id: 'hero',       label: 'Home' },
    { id: 'about',      label: 'About' },
    { id: 'skills',     label: 'Skills' },
    { id: 'projects',   label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact',    label: 'Contact' }
  ];

  const drawerLinks = [
    { id: 'about',        label: 'About' },
    { id: 'projects',     label: 'Projects' },
    { id: 'experience',   label: 'Experience' },
    { id: 'hackathons',   label: 'Achievements' },
    { id: 'education',    label: 'Education' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'skills',       label: 'Skills' },
    { id: 'github-stats', label: 'GitHub' },
    { id: 'future-vision',label: 'Research' },
    { id: 'contact',      label: 'Contact' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 frosted-glass transition-colors duration-400">
        <div className="layout-container h-20 flex items-center justify-between gap-4">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            className="monogram-mark text-xl tracking-wider hover:opacity-90 transition shrink-0"
          >
            <span className="w-8 h-8 rounded-full border border-accentGoldMuted/70 flex items-center justify-center text-xs font-display font-bold text-accentGoldMuted">
              TK
            </span>
            <span className="font-display font-bold text-lg text-textPrimary tracking-widest uppercase">
              Tejas Kute
            </span>
          </a>

          <nav className="hidden xl:flex items-center gap-7 font-mono text-[11px] tracking-widest uppercase font-medium text-textSecondary shrink">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`nav-link hover:text-textPrimary transition whitespace-nowrap bg-transparent border-none cursor-pointer ${
                  activeSection === item.id ? 'active text-textPrimary' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={(e) => onOpenResume(e.currentTarget)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-accentGold text-[11px] font-mono tracking-wider uppercase font-semibold text-accentGold hover:bg-accentGold hover:text-[#070B12] transition duration-300"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <a
              href="https://github.com/tejaskute284-dotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-md bg-bgSecondary border border-border text-textSecondary hover:text-accentGold transition duration-300"
              aria-label="GitHub Profile"
            >
              <GitHubIcon />
            </a>

            <a
              href="https://linkedin.com/in/tejas-kute-512aa2363"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-md bg-bgSecondary border border-border text-textSecondary hover:text-accentGold transition duration-300"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon />
            </a>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={openDrawer}
              className="2xl:hidden p-2 text-textSecondary hover:text-textPrimary transition"
              aria-label="Open Navigation Menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu-drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Backdrop */}
      <div
        onClick={() => closeDrawer(true)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          drawerOpen ? 'block' : 'hidden'
        }`}
        aria-hidden={!drawerOpen}
      />

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        aria-hidden={!drawerOpen}
        className={`fixed top-0 right-0 h-full w-80 bg-bgSecondary border-l border-border z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col justify-between ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-accentGold flex items-center justify-center text-xs font-display font-bold text-accentGold">
                TK
              </span>
              <span className="font-display font-bold text-lg text-textPrimary tracking-widest uppercase">
                Tejas Kute
              </span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => closeDrawer(true)}
              className="p-2 text-textSecondary hover:text-textPrimary transition"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 mt-6 font-mono text-xs tracking-wider uppercase font-medium text-textSecondary">
            {drawerLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => { scrollToSection(link.id); closeDrawer(false); }}
                className="text-left hover:text-accentGold transition py-2 border-b border-border/50 bg-transparent border-t-0 border-x-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                closeDrawer(false);
                onOpenResume(menuBtnRef.current);
              }}
              className="text-left hover:text-accentGold transition py-2.5 border-b border-border/50 flex items-center justify-between font-medium"
            >
              <span>View Resume / CV</span>
              <FileText className="w-4 h-4 text-accentGold" />
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-around">
          <a
            href="https://github.com/tejaskute284-dotcom"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md bg-bgTertiary border border-border text-textSecondary hover:text-accentGold transition"
            aria-label="GitHub"
          >
            <GitHubIcon className="w-5 h-5 fill-current" />
          </a>
          <a
            href="https://linkedin.com/in/tejas-kute-512aa2363"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md bg-bgTertiary border border-border text-textSecondary hover:text-accentGold transition"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-5 h-5 fill-current" />
          </a>
        </div>
      </div>
    </>
  );
}
