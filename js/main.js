// Main Entry Point & Orchestrator

import { renderAll }           from './render.js?v=2.6.0';
import { renderGitHubGraph }   from './github-graph.js?v=2.6.0';
import { initGitHubSync }      from './github-api.js?v=2.6.0';
import { initTheme }           from './theme.js?v=2.6.0';
import { initScroll }          from './scroll.js?v=2.6.0';
import { initTypewriter }      from './typewriter.js?v=2.6.0';
import { initCounter }         from './counter.js?v=2.6.0';
import { initContact }         from './contact.js?v=2.6.0';
import { initMobileNav }       from './mobile-nav.js?v=2.6.0';
import { initCarousel }        from './carousel.js?v=2.6.0';
import { initCertificateModal }from './certificate-modal.js?v=2.6.0';
import { initResumeModal }      from './resume-modal.js?v=2.6.0';
import { initVerifyModal }      from './verify-modal.js?v=2.6.0';
import { initAntiGravity }     from './antigravity.js?v=2.6.0';
import { initStepNavigation }  from './step-nav.js?v=2.6.0';
import { initNeural3D }        from './neural-3d.js?v=2.6.0';
import { initSkillsSphere }    from './skills-sphere.js?v=2.6.0';

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
  initNeural3D();       // 3D neural constellation in hero (Three.js)
  initSkillsSphere();   // 3D interactive Fibonacci technology sphere in skills
});
