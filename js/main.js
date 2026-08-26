// Main Entry Point & Orchestrator

import { renderAll }           from './render.js';
import { initTheme }           from './theme.js';
import { initScroll }          from './scroll.js';
import { initTypewriter }      from './typewriter.js';
import { initCounter }         from './counter.js';
import { initContact }         from './contact.js';
import { initMobileNav }       from './mobile-nav.js';
import { initCarousel }        from './carousel.js';
import { initCertificateModal }from './certificate-modal.js';
import { initResumeModal }      from './resume-modal.js';
import { initVerifyModal }      from './verify-modal.js';


document.addEventListener('DOMContentLoaded', () => {
  renderAll();          // inject data-driven cards before anything else
  initTheme();
  initScroll();
  initTypewriter();
  initCounter();
  initContact();
  initMobileNav();
  initCarousel();       // picks up newly-rendered carousels
  initCertificateModal();
  initResumeModal();
  initVerifyModal();
});


