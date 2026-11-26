// render.js — data-driven card renderer with Classic Luxury Editorial styling
import { PROJECTS }       from './data/projects.js';
import { HACKATHONS }     from './data/hackathons.js';
import { CERTIFICATIONS } from './data/certifications.js';

// Shared SVG paths via <use> — defined once in index.html as <symbol>
const githubUse = `<svg class="w-4 h-4 fill-current" aria-hidden="true"><use href="#icon-github"/></svg>`;

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidHttpUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isSafeAssetPath(path) {
  if (typeof path !== 'string') return false;
  const trimmed = path.trim();
  return /^assets\/[a-zA-Z0-9_\-./]+$/.test(trimmed) && !trimmed.includes('..');
}

function tags(arr) {
  return (arr || []).map(t => `<span class="tech-tag text-[10px] px-2 py-0.5">${escapeHTML(t)}</span>`).join('');
}

function collaborators(list) {
  return (list || []).map(c => {
    const safeName = escapeHTML(c.name);
    const weightClass = c.owner ? 'text-textPrimary font-semibold' : 'text-textSecondary';
    if (isValidHttpUrl(c.url)) {
      return `
        <a href="${escapeHTML(c.url)}" target="_blank" rel="noopener noreferrer"
           class="text-[11px] px-2 py-0.5 rounded border border-border bg-bgTertiary ${weightClass} hover:border-accentGold hover:text-accentGoldDark transition inline-block">
          ${safeName}
        </a>`;
    }
    return `
      <span class="text-[11px] px-2 py-0.5 rounded border border-border bg-bgTertiary ${weightClass} inline-block">
        ${safeName}
      </span>`;
  }).join('');
}

function projectMarqueeCard(p) {
  const safeImg = isSafeAssetPath(p.img) ? escapeHTML(p.img) : '';
  const imgBlock = safeImg ? `
    <div class="mb-3.5 overflow-hidden rounded-lg border border-border aspect-video bg-bgTertiary shadow-sm">
      <img src="${safeImg}" alt="${escapeHTML(p.imgAlt || p.name)}" loading="lazy" decoding="async" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500">
    </div>` : '';

  const hasValidGithub = isValidHttpUrl(p.github);
  const hasValidDemo = isValidHttpUrl(p.demo);

  const footerLinks = p.internship
    ? `<span class="text-xs text-textSecondary italic">${escapeHTML(p.internship)}</span>`
    : p.private
      ? `<span class="flex items-center gap-1.5 text-xs text-textSecondary opacity-75">${githubUse} Private Repository</span>`
      : `${hasValidGithub ? `<a href="${escapeHTML(p.github)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-xs font-semibold text-textPrimary hover:text-accentGoldDark transition">${githubUse} GitHub</a>` : ''}
         ${hasValidDemo ? `<a href="${escapeHTML(p.demo)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-xs font-semibold text-accentGold hover:underline transition"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> Live Demo</a>` : ''}`;

  return `
  <div class="project-marquee-card">
    <div class="premium-card h-full flex flex-col justify-between">
      <div class="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-serif font-bold text-textPrimary tracking-tight">${escapeHTML(p.name)}</h3>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border border-accentGold/40 text-accentGold font-mono">${escapeHTML(p.badge?.label)}</span>
          </div>
          <p class="text-xs font-medium text-accentGold mb-3 line-clamp-1">${escapeHTML(p.tagline)}</p>
          ${imgBlock}
          <p class="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">${escapeHTML(p.desc)}</p>
          <div class="mb-4">
            <span class="text-[10px] font-mono text-textMuted block mb-1.5 uppercase tracking-wider">Collaborators</span>
            <div class="flex flex-wrap gap-1.5">${collaborators(p.collaborators)}</div>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-4">${tags(p.tags)}</div>
        </div>
        <div class="border-t border-border pt-4 flex items-center justify-between gap-3 mt-auto">
          <div class="flex items-center gap-4">${footerLinks}</div>
          <span class="text-[10px] text-textMuted font-mono block text-right">${escapeHTML(p.footer)}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function projectMarqueeShell(cardsHtml) {
  return `
  <div class="project-marquee-viewport" aria-label="Infinite continuous projects marquee">
    <div class="project-marquee-track">
      ${cardsHtml}
      ${cardsHtml}
    </div>
  </div>`;
}

function hackathonDeckCard(h, index) {
  const safeImg = isSafeAssetPath(h.img) ? escapeHTML(h.img) : '';
  return `
  <div class="hackathon-deck-card" data-deck-index="${index}">
    <div class="premium-card h-full flex flex-col justify-between group hov-card-border transition cursor-pointer"
         data-cert-img="${safeImg}"
         data-cert-title="${escapeHTML(h.certTitle)}"
         data-cert-subtitle="${escapeHTML(h.certSubtitle)}">
      <div class="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">${escapeHTML(h.org)}</span>
            <span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-accentGold/30 text-accentGold">${escapeHTML(h.badge?.label)}</span>
          </div>
          <h3 class="text-xl font-serif font-bold text-textPrimary mb-2 hov-card-title transition">${escapeHTML(h.title)}</h3>
          <p class="text-xs text-textSecondary mb-3.5 line-clamp-1">${escapeHTML(h.subtitle)}</p>
          ${safeImg ? `
          <div class="relative overflow-hidden rounded-lg border border-border aspect-video mb-3.5 bg-bgTertiary shadow-sm">
            <img src="${safeImg}" alt="${escapeHTML(h.imgAlt || h.title)}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-semibold">
              <i data-lucide="maximize-2" class="w-4 h-4 text-accentGold"></i> View Certificate
            </div>
          </div>` : ''}
          <p class="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">${escapeHTML(h.desc)}</p>
        </div>
        <div class="border-t border-border pt-4 flex items-center justify-between mt-auto">
          <span class="text-[11px] text-textMuted font-mono">${escapeHTML(h.footerLeft)}</span>
          <button type="button" class="text-xs font-medium text-accentGold flex items-center gap-1.5 group-hover:underline">
            View Certificate <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function hackathonDeckShell(cardsHtml, totalCount) {
  const dotsHtml = Array.from({ length: totalCount }, (_, i) => `
    <button type="button" class="hackathon-deck-dot" aria-label="Show achievement card ${i + 1}"></button>
  `).join('');

  return `
  <div id="hackathons-deck" class="hackathon-deck-wrapper" tabindex="0" role="region" aria-label="Hackathon and Workshop Credentials Card Deck">
    <div class="hackathon-deck-stage">
      ${cardsHtml}
    </div>
    <div class="hackathon-deck-controls">
      <button type="button" class="hackathon-deck-btn hackathon-deck-prev" aria-label="Previous Achievement Card">
        <i data-lucide="chevron-left" class="w-4 h-4"></i>
      </button>
      <div class="flex items-center gap-3">
        <span class="hackathon-deck-counter font-mono text-xs text-textSecondary">01 / ${String(totalCount).padStart(2, '0')}</span>
        <div class="hackathon-deck-dots">${dotsHtml}</div>
      </div>
      <button type="button" class="hackathon-deck-btn hackathon-deck-next" aria-label="Next Achievement Card">
        <i data-lucide="chevron-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>`;
}

function certMarqueeCard(c) {
  const safeUrl = isValidHttpUrl(c.url) ? escapeHTML(c.url) : '';
  return `
  <div class="cert-marquee-card">
    <div class="premium-card h-full flex flex-col justify-between">
      <div class="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">COURSERA ACADEMIC</span>
            <span class="text-accentGold text-xs font-mono flex items-center gap-1 font-semibold">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Verified
            </span>
          </div>
          <h3 class="text-base font-serif font-bold text-textPrimary leading-snug mb-2">${escapeHTML(c.title)}</h3>
          <p class="text-xs text-textSecondary font-sans mt-1">Domain: ${escapeHTML(c.domain)}</p>
        </div>
        <div class="border-t border-border pt-4 mt-6 flex justify-between items-center mt-auto">
          <span class="text-[10px] text-textMuted font-mono">ID: ${escapeHTML(c.id)}</span>
          ${safeUrl ? `
          <button type="button" class="text-xs font-semibold text-accentGold hover:text-accentGoldDark hover:underline flex items-center gap-1.5 transition js-verify-cert" data-cert-url="${safeUrl}" data-cert-id="${escapeHTML(c.id)}" data-cert-title="${escapeHTML(c.title)}">
            Verify Credential <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>` : '<span class="text-[10px] text-textMuted font-mono">Verified</span>'}
        </div>
      </div>
    </div>
  </div>`;
}

function certMarqueeShell(cardsHtml) {
  return `
  <div class="cert-marquee-viewport" aria-label="Infinite continuous certifications marquee">
    <div class="cert-marquee-track">
      ${cardsHtml}
      ${cardsHtml}
    </div>
  </div>`;
}

export function renderAll() {
  const projectsEl = document.getElementById('projects-carousel-mount');
  if (projectsEl) {
    const cardsHtml = PROJECTS.map(projectMarqueeCard).join('');
    projectsEl.innerHTML = projectMarqueeShell(cardsHtml);
  }

  const hackEl = document.getElementById('hackathons-carousel-mount');
  if (hackEl) {
    const cardsHtml = HACKATHONS.map((h, i) => hackathonDeckCard(h, i)).join('');
    hackEl.innerHTML = hackathonDeckShell(cardsHtml, HACKATHONS.length);
  }

  const certEl = document.getElementById('certifications-carousel-mount');
  if (certEl) {
    const cardsHtml = CERTIFICATIONS.map(certMarqueeCard).join('');
    certEl.innerHTML = certMarqueeShell(cardsHtml);
  }

  // Re-run lucide after dynamic DOM insertion
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
