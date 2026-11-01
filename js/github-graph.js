// github-graph.js — Responsive Vector SVG Contribution Graph generator
// Supports live daily data array or resilient fallback distribution

export function renderGitHubGraph(liveContributions = null) {
  const container = document.getElementById('github-graph-mount');
  if (!container) return;

  const weeks = 52;
  const days = 7;
  const cellSize = 11;
  const cellGap = 3.5;
  const step = cellSize + cellGap;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  let svgContent = '';

  // Month Labels
  months.forEach((m, idx) => {
    const x = idx * (weeks / 12) * step + 32;
    svgContent += `<text x="${x}" y="12" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="9" letter-spacing="0.05em">${m}</text>`;
  });

  // Day Labels
  dayNames.forEach((d, idx) => {
    if (d) {
      const y = idx * step + 32;
      svgContent += `<text x="8" y="${y}" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="8" letter-spacing="0.05em">${d}</text>`;
    }
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'rgba(213, 178, 107, 0.32)';
      case 2: return 'rgba(213, 178, 107, 0.58)';
      case 3: return 'rgba(213, 178, 107, 0.82)';
      case 4: return 'var(--accent-gold-muted)';
      default: return 'var(--bg-tertiary)';
    }
  };

  // If live contributions exist, slice last 364 days (52 * 7)
  let cellData = [];
  if (Array.isArray(liveContributions) && liveContributions.length >= 364) {
    cellData = liveContributions.slice(-364);
  } else {
    // Seeded realistic fallback
    const fallbackLevels = [
      0, 0, 1, 0, 2, 0, 0, 1, 3, 0, 1, 2, 0, 1, 4, 2, 0, 1, 0, 2,
      1, 3, 0, 2, 1, 0, 3, 2, 4, 1, 0, 2, 3, 1, 0, 2, 1, 4, 2, 0,
      1, 3, 2, 0, 1, 2, 4, 1, 0, 3, 2, 1, 0, 2, 3, 1, 4, 2, 0, 1,
      2, 0, 3, 1, 2, 4, 0, 1, 2, 3, 1, 0, 2, 4, 1, 3, 0, 2, 1, 0
    ];
    for (let i = 0; i < 364; i++) {
      const lvl = fallbackLevels[i % fallbackLevels.length];
      const count = lvl === 0 ? 0 : lvl === 1 ? 1 : lvl === 2 ? 3 : lvl === 3 ? 6 : 9;
      cellData.push({ level: lvl, count, date: '' });
    }
  }

  let dataIdx = 0;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const x = 32 + w * step;
      const y = 22 + d * step;
      const item = cellData[dataIdx] || { level: 0, count: 0, date: '' };
      dataIdx++;

      const fill = getLevelColor(item.level);
      const titleText = item.date ? `${item.count} contributions on ${item.date}` : `${item.count} contributions`;

      svgContent += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${fill}" class="contrib-cell transition-all duration-200" data-count="${item.count}">
          <title>${titleText}</title>
        </rect>`;
    }
  }

  const svgWidth = 32 + weeks * step + 16;
  const svgHeight = 22 + days * step + 16;

  container.innerHTML = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full min-w-[720px] select-none" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>`;
}
