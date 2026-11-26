// Main Entry Point & Orchestrator

import { renderAll }            from './render.js';
import { renderGitHubGraph }    from './github-graph.js';
import { initGitHubSync }       from './github-api.js';
import { initTheme }            from './theme.js';
import { initScroll }           from './scroll.js';
import { initTypewriter }       from './typewriter.js';
import { initCounter }          from './counter.js';
import { initContact }          from './contact.js';
import { initMobileNav }        from './mobile-nav.js';
import { initCarousel }         from './carousel.js';
import { initCardDeck }         from './card-deck.js';
import { initCertificateModal } from './certificate-modal.js';
import { initResumeModal }      from './resume-modal.js';
import { initVerifyModal }      from './verify-modal.js';
import { initAntiGravity }      from './antigravity.js';
import { initStepNavigation }   from './step-nav.js';
import { initNeural3D }         from './neural-3d.js';
import { initSkillsSphere }     from './skills-sphere.js';

let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
  if (initialized) return;
  initialized = true;

  renderAll();          // inject data-driven cards before anything else
  renderGitHubGraph();  // render vector contribution graph
  initGitHubSync();     // automate live GitHub sync with fallback
  initTheme();
  initScroll();
  initTypewriter();
  initCounter();
  initContact();
  initMobileNav();
  initCarousel();       // picks up any standard .carousel-container elements
  initCardDeck();       // interactive 3D stacked card deck for Hackathons & Achievements
  initCertificateModal();
  initResumeModal();
  initVerifyModal();
  initAntiGravity();
  initStepNavigation(); // step-by-step navigation controller
  initNeural3D();       // 3D neural constellation in hero (Three.js)
  initSkillsSphere();   // 3D interactive Fibonacci technology sphere in skills
});
