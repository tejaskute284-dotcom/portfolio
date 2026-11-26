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
        case 1: return { fill: '#6B5424', stroke: 'rgba(213, 178, 107, 0.4)' };
        case 2: return { fill: '#A37E32', stroke: 'rgba(213, 178, 107, 0.6)' };
        case 3: return { fill: '#D5B26B', stroke: '#E8C56E' };
        case 4: return { fill: '#F2D38B', stroke: '#FFF0B8' };
        default: return { fill: '#1A1A22', stroke: 'rgba(255, 255, 255, 0.05)' };
      }
    } else {
      switch (level) {
        case 1: return { fill: '#E8D4A8', stroke: '#D5B26B' };
        case 2: return { fill: '#D5B26B', stroke: '#B88E3E' };
        case 3: return { fill: '#BA8D36', stroke: '#966D20' };
        case 4: return { fill: '#8C6415', stroke: '#694705' };
        default: return { fill: '#E6E0D6', stroke: 'rgba(26, 26, 28, 0.08)' };
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
  const labelColor = isDark ? '#8E8A84' : '#6A655E';

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
