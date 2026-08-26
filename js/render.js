// render.js — data-driven card renderer (Ponytail: one template, not N copies)
import { PROJECTS }       from './data/projects.js';
import { HACKATHONS }     from './data/hackathons.js';
import { CERTIFICATIONS } from './data/certifications.js';

// Shared SVG paths via <use> — defined once in index.html as <symbol>
const githubUse  = `<svg class="w-4 h-4 fill-current" aria-hidden="true"><use href="#icon-github"/></svg>`;
const githubUseSm = `<svg class="w-5 h-5 fill-current" aria-hidden="true"><use href="#icon-github"/></svg>`;

function tags(arr) {
  return arr.map(t => `<span class="tech-tag">${t}</span>`).join('');
}

function collaborators(list, accentClass) {
  return list.map(c => `
    <a href="${c.url}" target="_blank" rel="noopener noreferrer"
       class="text-xs font-mono px-2.5 py-1 rounded bg-bgTertiary border border-white/5 ${c.owner ? 'text-textPrimary' : 'text-textSecondary'} hover:border-current hover:${accentClass} ${accentClass.replace('text-','hover:text-')} transition hover:scale-105 inline-block">
      ${c.name}
    </a>`).join('');
}

function projectCard(p) {
  const imgBlock = p.img ? `
    <div class="mb-4 overflow-hidden rounded-lg border border-white/10 aspect-video bg-bgTertiary">
      <img src="${p.img}" alt="${p.imgAlt}" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300">
    </div>` : '';

  const footerLinks = p.internship
    ? `<span class="text-xs text-textSecondary font-mono italic">${p.internship}</span>`
    : p.private
      ? `<a href="#" class="flex items-center gap-1.5 text-xs text-textSecondary cursor-not-allowed">${githubUse} Private</a>`
      : `<a href="${p.github}" target="_blank" class="flex items-center gap-1.5 text-xs text-textPrimary hover:${p.accentClass.replace('text-','text-')} transition">${githubUse} GitHub</a>
         ${p.demo ? `<a href="${p.demo}" class="flex items-center gap-1.5 text-xs text-textPrimary hover:${p.accentClass} transition"><i data-lucide="external-link" class="w-4 h-4"></i> Demo</a>` : ''}`;

  return `
  <div class="carousel-item">
    <div class="dev-code-card h-full">
      <div class="dev-code-card-inner flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold font-heading text-textPrimary">${p.name}</h3>
            <span class="text-xs font-mono px-2 py-0.5 rounded-full border ${p.badge.cls}">${p.badge.label}</span>
          </div>
          <p class="text-sm font-semibold ${p.accentClass} mb-4">${p.tagline}</p>
          ${imgBlock}
          <p class="text-textSecondary text-sm leading-relaxed mb-6">${p.desc}</p>
          <div class="mb-6">
            <span class="text-xs font-mono text-textSecondary block mb-2 font-bold uppercase tracking-wider">Collaborators</span>
            <div class="flex flex-wrap gap-2">${collaborators(p.collaborators, p.accentClass)}</div>
          </div>
          <div class="flex flex-wrap gap-2 mb-6">${tags(p.tags)}</div>
        </div>
        <div class="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
          <div class="flex items-center gap-4">${footerLinks}</div>
          <span class="text-[10px] text-textSecondary font-mono block text-right">${p.footer}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function hackathonCard(h) {
  return `
  <div class="carousel-item px-3">
    <div class="dev-code-card h-full group ${h.hoverBorder} transition cursor-pointer"
         data-cert-img="${h.img}"
         data-cert-title="${h.certTitle}"
         data-cert-subtitle="${h.certSubtitle}">
      <div class="dev-code-card-inner flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono ${h.orgColor} uppercase tracking-widest font-bold">${h.org}</span>
            <span class="text-xs font-mono px-2 py-0.5 rounded-full border font-semibold ${h.badge.cls}">${h.badge.label}</span>
          </div>
          <h3 class="text-xl font-bold text-textPrimary mb-2 ${h.hoverTitle} transition">${h.title}</h3>
          <p class="text-xs ${h.subtitleColor} font-mono mb-4">${h.subtitle}</p>
          <div class="relative overflow-hidden rounded-lg border border-white/10 aspect-video mb-4 bg-bgTertiary">
            <img src="${h.img}" alt="${h.imgAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-semibold">
              <i data-lucide="maximize-2" class="w-4 h-4"></i> View Certificate Photo
            </div>
          </div>
          <p class="text-textSecondary text-xs leading-relaxed mb-4">${h.desc}</p>
        </div>
        <div class="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
          <span class="text-[10px] text-textSecondary font-mono">${h.footerLeft}</span>
          <button class="text-xs font-mono ${h.btnColor} flex items-center gap-1 group-hover:underline">
            View Photo <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function certCard(c) {
  return `
  <div class="carousel-item">
    <div class="dev-code-card h-full">
      <div class="dev-code-card-inner flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-mono text-accentCyan uppercase tracking-widest">COURSERA</span>
            <span class="text-emerald-400 text-xs font-mono flex items-center gap-1 font-semibold">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Verified
            </span>
          </div>
          <h3 class="text-base font-bold text-textPrimary leading-tight mb-2">${c.title}</h3>
          <p class="text-xs text-textSecondary font-mono mt-1">Domain: ${c.domain}</p>
        </div>
        <div class="border-t border-white/5 pt-4 mt-6 flex justify-between items-center mt-auto">
          <span class="text-[9px] text-textSecondary font-mono block">ID: ${c.id}</span>
          <button class="text-[10px] font-mono text-accentCyan hover:text-textPrimary hover:underline flex items-center gap-1 transition js-verify-cert" data-cert-url="${c.url}" data-cert-id="${c.id}" data-cert-title="${c.title}">
            Verify <i data-lucide="external-link" class="w-3 h-3"></i>
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
    projectsEl.innerHTML = carouselShell('projects', 2, 1, PROJECTS.map(projectCard).join(''));
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
