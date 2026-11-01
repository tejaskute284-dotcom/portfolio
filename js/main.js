// Main Entry Point & Orchestrator

import { renderAll }           from './render.js';
import { renderGitHubGraph }   from './github-graph.js';
import { initGitHubSync }      from './github-api.js';
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
import { initAntiGravity }     from './antigravity.js';
import { initStepNavigation }  from './step-nav.js';

document.addEventListener('DOMContentLoaded', () => {
  renderAll();          // inject data-driven cards before anything else
  renderGitHubGraph();  // render vector contribution graph
  initGitHubSync();     // automate live GitHub sync with fallback
  initTheme();
  initScroll();
  initTypewriter();
  initCounter();
  initContact();
  initMobileNav();
  initCarousel();       // picks up newly-rendered carousels with smooth auto-play
  initCertificateModal();
  initResumeModal();
  initVerifyModal();
  initAntiGravity();    // physics tilt + repulsion on all .ag-card elements
  initStepNavigation(); // step-by-step navigation controller
});
