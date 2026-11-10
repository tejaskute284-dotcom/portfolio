// render.js — data-driven card renderer with Classic Luxury Editorial styling
import { PROJECTS }       from './data/projects.js';
import { HACKATHONS }     from './data/hackathons.js';
import { CERTIFICATIONS } from './data/certifications.js';

// Shared SVG paths via <use> — defined once in index.html as <symbol>
const githubUse  = `<svg class="w-4 h-4 fill-current" aria-hidden="true"><use href="#icon-github"/></svg>`;

function tags(arr) {
  return arr.map(t => `<span class="tech-tag text-[10px] px-2 py-0.5">${t}</span>`).join('');
}

function collaborators(list) {
  return list.map(c => `
    <a href="${c.url}" target="_blank" rel="noopener noreferrer"
       class="text-[11px] px-2 py-0.5 rounded border border-border bg-bgTertiary ${c.owner ? 'text-textPrimary font-semibold' : 'text-textSecondary'} hover:border-accentGold hover:text-accentGoldDark transition inline-block">
      ${c.name}
    </a>`).join('');
}

function projectCard(p) {
  const imgBlock = p.img ? `
    <div class="mb-3.5 overflow-hidden rounded-lg border border-border aspect-video bg-bgTertiary shadow-sm transform-gpu transition-all duration-500 hover:shadow-lg" style="transform: translateZ(16px);">
      <img src="${p.img}" alt="${p.imgAlt}" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500">
    </div>` : '';

  const footerLinks = p.internship
    ? `<span class="text-xs text-textSecondary italic">${p.internship}</span>`
    : p.private
      ? `<span class="flex items-center gap-1.5 text-xs text-textSecondary opacity-75">${githubUse} Private Repository</span>`
      : `<a href="${p.github}" target="_blank" class="flex items-center gap-1.5 text-xs font-semibold text-textPrimary hover:text-accentGoldDark transition">${githubUse} GitHub</a>
         ${p.demo ? `<a href="${p.demo}" class="flex items-center gap-1.5 text-xs font-semibold text-accentGold hover:underline transition"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> Live Demo</a>` : ''}`;

  return `
  <div class="carousel-item px-2">
    <div class="ag-card premium-card h-full" style="perspective: 1000px; transform-style: preserve-3d;">
      <div class="ag-inner p-5 sm:p-6 flex flex-col justify-between h-full" style="transform-style: preserve-3d;">
        <div style="transform-style: preserve-3d;">
          <div class="flex items-center justify-between mb-3" style="transform: translateZ(8px);">
            <h3 class="text-xl font-serif font-bold text-textPrimary tracking-tight">${p.name}</h3>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full border border-accentGold/40 text-accentGold font-mono">${p.badge.label}</span>
          </div>
          <p class="text-xs font-medium text-accentGold mb-3" style="transform: translateZ(10px);">${p.tagline}</p>
          ${imgBlock}
          <p class="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">${p.desc}</p>
          <div class="mb-4" style="transform: translateZ(12px);">
            <span class="text-[10px] font-mono text-textMuted block mb-1.5 uppercase tracking-wider">Collaborators</span>
            <div class="flex flex-wrap gap-1.5">${collaborators(p.collaborators)}</div>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-4" style="transform: translateZ(14px);">${tags(p.tags)}</div>
        </div>
        <div class="border-t border-border pt-4 flex items-center justify-between gap-3 mt-auto" style="transform: translateZ(8px);">
          <div class="flex items-center gap-4">${footerLinks}</div>
          <span class="text-[10px] text-textMuted font-mono block text-right">${p.footer}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function hackathonCard(h) {
  return `
  <div class="carousel-item px-2">
    <div class="ag-card premium-card h-full group hov-card-border transition cursor-pointer"
         data-cert-img="${h.img}"
         data-cert-title="${h.certTitle}"
         data-cert-subtitle="${h.certSubtitle}">
      <div class="ag-inner p-6 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">${h.org}</span>
            <span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-accentGold/30 text-accentGold">${h.badge.label}</span>
          </div>
          <h3 class="text-xl font-serif font-bold text-textPrimary mb-2 hov-card-title transition">${h.title}</h3>
          <p class="text-xs text-textSecondary mb-4">${h.subtitle}</p>
          <div class="relative overflow-hidden rounded-lg border border-border aspect-video mb-4 bg-bgTertiary">
            <img src="${h.img}" alt="${h.imgAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-semibold">
              <i data-lucide="maximize-2" class="w-4 h-4 text-accentGold"></i> View Certificate
            </div>
          </div>
          <p class="text-textSecondary text-xs leading-relaxed mb-4">${h.desc}</p>
        </div>
        <div class="border-t border-border pt-4 flex items-center justify-between mt-auto">
          <span class="text-[11px] text-textMuted font-mono">${h.footerLeft}</span>
          <button class="text-xs font-medium text-accentGold flex items-center gap-1.5 group-hover:underline">
            View Certificate <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function certCard(c) {
  return `
  <div class="carousel-item px-2">
    <div class="premium-card h-full">
      <div class="p-6 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">COURSERA ACADEMIC</span>
            <span class="text-accentGold text-xs font-mono flex items-center gap-1 font-semibold">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Verified
            </span>
          </div>
          <h3 class="text-base font-serif font-bold text-textPrimary leading-snug mb-2">${c.title}</h3>
          <p class="text-xs text-textSecondary font-sans mt-1">Domain: ${c.domain}</p>
        </div>
        <div class="border-t border-border pt-4 mt-6 flex justify-between items-center mt-auto">
          <span class="text-[10px] text-textMuted font-mono">ID: ${c.id}</span>
          <button class="text-xs font-semibold text-accentGold hover:text-accentGoldDark hover:underline flex items-center gap-1.5 transition js-verify-cert" data-cert-url="${c.url}" data-cert-id="${c.id}" data-cert-title="${c.title}">
            Verify Credential <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function carouselShell(id, itemsLg, itemsMd, inner) {
  return `
  <div class="carousel-container relative" data-items-lg="${itemsLg}" data-items-md="${itemsMd}" data-items-sm="1">
    <div class="carousel-viewport py-4">
      <div class="carousel-content flex transition-transform duration-500 ease-out">
        ${inner}
      </div>
    </div>
    <button class="carousel-control carousel-prev" aria-label="Previous Slide">
      <i data-lucide="chevron-left" class="w-5 h-5"></i>
    </button>
    <button class="carousel-control carousel-next" aria-label="Next Slide">
      <i data-lucide="chevron-right" class="w-5 h-5"></i>
    </button>
  </div>`;
}

export function renderAll() {
  const projectsEl = document.getElementById('projects-carousel-mount');
  if (projectsEl) {
    projectsEl.innerHTML = carouselShell('projects', 3, 2, PROJECTS.map(projectCard).join(''));
  }

  const hackEl = document.getElementById('hackathons-carousel-mount');
  if (hackEl) {
    hackEl.innerHTML = carouselShell('hackathons', 3, 2, HACKATHONS.map(hackathonCard).join(''));
  }

  const certEl = document.getElementById('certifications-carousel-mount');
  if (certEl) {
    certEl.innerHTML = carouselShell('certifications', 3, 2, CERTIFICATIONS.map(certCard).join(''));
  }

  // Re-run lucide after dynamic DOM insertion
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
