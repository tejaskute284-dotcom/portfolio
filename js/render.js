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

function projectGridCard(p) {
  const imgBlock = p.img ? `
    <div class="mb-3.5 overflow-hidden rounded-lg border border-border aspect-video bg-bgTertiary shadow-sm">
      <img src="${p.img}" alt="${p.imgAlt}" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500">
    </div>` : '';

  const footerLinks = p.internship
    ? `<span class="text-xs text-textSecondary italic">${p.internship}</span>`
    : p.private
      ? `<span class="flex items-center gap-1.5 text-xs text-textSecondary opacity-75">${githubUse} Private</span>`
      : `<a href="${p.github}" target="_blank" class="flex items-center gap-1.5 text-xs font-semibold text-textPrimary hover:text-accentGoldDark transition">${githubUse} Code</a>
         ${p.demo ? `<a href="${p.demo}" target="_blank" class="flex items-center gap-1.5 text-xs font-semibold text-accentGold hover:underline transition"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> Live Demo</a>` : ''}`;

  return `
  <div class="ag-card premium-card h-full flex flex-col justify-between">
    <div class="ag-inner p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-xl font-serif font-bold text-textPrimary tracking-tight">${p.name}</h3>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full border border-accentGold/40 text-accentGold font-mono">${p.badge.label}</span>
        </div>
        <p class="text-xs font-medium text-accentGold mb-3">${p.tagline}</p>
        ${imgBlock}
        <p class="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-3">${p.desc}</p>
        <div class="mb-4">
          <span class="text-[10px] font-mono text-textMuted block mb-1.5 uppercase tracking-wider">Collaborators</span>
          <div class="flex flex-wrap gap-1.5">${collaborators(p.collaborators)}</div>
        </div>
        <div class="flex flex-wrap gap-1.5 mb-4">${tags(p.tags)}</div>
      </div>
      <div class="border-t border-border pt-4 flex items-center justify-between gap-3 mt-auto">
        <div class="flex items-center gap-4">${footerLinks}</div>
        <span class="text-[10px] text-textMuted font-mono block text-right">${p.footer}</span>
      </div>
    </div>
  </div>`;
}

function hackathonGridCard(h) {
  return `
  <div class="ag-card premium-card h-full group hov-card-border transition cursor-pointer"
       data-cert-img="${h.img}"
       data-cert-title="${h.certTitle}"
       data-cert-subtitle="${h.certSubtitle}">
    <div class="ag-inner p-5 flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-[10px] font-mono text-accentGold uppercase tracking-wider font-semibold truncate max-w-[140px]">${h.org}</span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded border border-accentGold/30 text-accentGold">${h.badge.label}</span>
        </div>
        
        <div class="relative overflow-hidden rounded-lg border border-border aspect-video mb-3 bg-bgTertiary">
          <img src="${h.img}" alt="${h.imgAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-xs font-medium">
            <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-accentGold"></i> View Certificate
          </div>
        </div>

        <h3 class="text-base font-serif font-bold text-textPrimary leading-snug mb-1 hov-card-title transition">${h.title}</h3>
        <p class="text-xs text-textSecondary line-clamp-1 mb-3">${h.subtitle}</p>
        <p class="text-textSecondary text-xs leading-relaxed mb-4 line-clamp-2">${h.desc}</p>
      </div>

      <div class="border-t border-border/70 pt-3 flex items-center justify-between mt-auto">
        <span class="text-[11px] text-textMuted font-mono">${h.footerLeft}</span>
        <span class="text-xs font-medium text-accentGold flex items-center gap-1 group-hover:underline">
          View <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </span>
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
    projectsEl.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${PROJECTS.map(projectGridCard).join('')}
      </div>`;
  }

  const hackEl = document.getElementById('hackathons-carousel-mount');
  if (hackEl) {
    hackEl.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        ${HACKATHONS.map(hackathonGridCard).join('')}
      </div>`;
  }

  const certEl = document.getElementById('certifications-carousel-mount');
  if (certEl) {
    certEl.innerHTML = carouselShell('certifications', 3, 2, CERTIFICATIONS.map(certCard).join(''));
  }

  // Re-run lucide after dynamic DOM insertion
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
