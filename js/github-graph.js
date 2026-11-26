// github-graph.js — High-End Tactile Vector GitHub Contribution Matrix
// Renders verified live contribution data or an honest unavailable state (never fabricated activity).

export function renderGitHubGraph(liveContributions = null, statusMessage = null) {
  const container = document.getElementById('github-graph-mount');
  if (!container) return;

  if (!Array.isArray(liveContributions) || liveContributions.length === 0) {
    const message = statusMessage || 'Live GitHub contribution graph is currently unavailable. Please check your connection or view directly on GitHub.';
    container.innerHTML = `
      <div class="py-10 px-4 text-center flex flex-col items-center justify-center gap-2">
        <p class="text-xs font-mono text-textSecondary">${escapeText(message)}</p>
        <a href="https://github.com/tejaskute284-dotcom" target="_blank" rel="noopener noreferrer"
           class="text-xs font-mono text-accentGold hover:underline mt-1">
          github.com/tejaskute284-dotcom &rarr;
        </a>
      </div>`;
    return;
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  const weeks = 53;
  const days = 7;
  const cellSize = 11;
  const cellGap = 3.5;
  const step = cellSize + cellGap;

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getCellStyles = (level) => {
    if (isDark) {
      switch (level) {
        case 1: return { fill: '#3B3427', stroke: 'rgba(185, 154, 94, 0.3)' };
        case 2: return { fill: '#665537', stroke: 'rgba(185, 154, 94, 0.5)' };
        case 3: return { fill: '#90784B', stroke: '#B99A5E' };
        case 4: return { fill: '#D1B77E', stroke: '#E9E7E1' };
        default: return { fill: '#070B12', stroke: 'rgba(146, 155, 170, 0.16)' };
      }
    } else {
      switch (level) {
        case 1: return { fill: '#E5DAC2', stroke: '#D1B77E' };
        case 2: return { fill: '#D1B77E', stroke: '#B99A5E' };
        case 3: return { fill: '#B99A5E', stroke: '#7E622E' };
        case 4: return { fill: '#7E622E', stroke: '#0B1424' };
        default: return { fill: '#EAE7DF', stroke: 'rgba(11, 20, 36, 0.1)' };
      }
    }
  };

  const grid = Array.from({ length: weeks }, () => new Array(7).fill(null));
  const monthHeaderMap = {};

  const firstDate = new Date(liveContributions[0].date + 'T00:00:00Z');
  let startDay = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getUTCDay();

  let currentWeek = 0;
  let currentDay = startDay;
  let lastMonth = -1;

  liveContributions.forEach((item) => {
    if (currentWeek >= weeks) return;
    if (!item || typeof item.count !== 'number') return;

    grid[currentWeek][currentDay] = item;

    const itemDate = new Date(item.date + 'T00:00:00Z');
    if (!Number.isNaN(itemDate.getTime())) {
      const m = itemDate.getUTCMonth();
      if (m !== lastMonth) {
        if (!monthHeaderMap[currentWeek]) {
          monthHeaderMap[currentWeek] = monthNames[m];
        }
        lastMonth = m;
      }
    }

    currentDay++;
    if (currentDay > 6) {
      currentDay = 0;
      currentWeek++;
    }
  });

  let svgContent = '';
  const labelColor = isDark ? '#929BAA' : '#475467';

  Object.keys(monthHeaderMap).forEach((wStr) => {
    const w = parseInt(wStr, 10);
    const x = 32 + w * step;
    svgContent += `<text x="${x}" y="12" fill="${labelColor}" font-family="var(--font-mono)" font-size="9.5" font-weight="600" letter-spacing="0.06em">${monthHeaderMap[w]}</text>`;
  });

  dayLabels.forEach((d, idx) => {
    if (d) {
      const y = idx * step + 32;
      svgContent += `<text x="6" y="${y}" fill="${labelColor}" font-family="var(--font-mono)" font-size="8.5" font-weight="500" letter-spacing="0.05em">${d}</text>`;
    }
  });

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const item = grid[w][d];
      if (!item) continue;

      const x = 32 + w * step;
      const y = 22 + d * step;
      const { fill, stroke } = getCellStyles(item.level);
      const safeDate = escapeText(item.date || '');
      const titleText = safeDate
        ? `${item.count} contribution${item.count === 1 ? '' : 's'} on ${safeDate}`
        : `${item.count} contributions`;

      svgContent += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${fill}" stroke="${stroke}" stroke-width="0.75" class="contrib-cell cursor-pointer" data-count="${item.count}">
          <title>${titleText}</title>
        </rect>`;
    }
  }

  const svgWidth = 32 + weeks * step + 16;
  const svgHeight = 22 + days * step + 16;

  container.innerHTML = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full min-w-[760px] select-none" role="img" aria-label="GitHub contribution activity matrix" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>`;
}

function escapeText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
