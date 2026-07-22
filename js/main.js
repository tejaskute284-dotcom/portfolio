// Main Entry Point & Orchestrator

import { initTheme } from './theme.js';
import { initScroll } from './scroll.js';
import { initTypewriter } from './typewriter.js';
import { initCounter } from './counter.js';
import { initContact } from './contact.js';
import { initMobileNav } from './mobile-nav.js';
import { initCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initScroll();
  initTypewriter();
  initCounter();
  initContact();
  initMobileNav();
  initCarousel();
});


