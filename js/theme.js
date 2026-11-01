// Theme Toggle & Persistence Module — Warm Ivory Editorial (Light) & Obsidian Noir (Dark)

export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Default to ivory editorial light theme for classic luxury, while respecting existing preference
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateToggleIcon(currentTheme);
  updateGraphColor(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.add('theme-transitioning');
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
    updateGraphColor(newTheme);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 450);
  });
}

function updateToggleIcon(theme) {
  const moonIcon = document.getElementById('theme-toggle-moon');
  const sunIcon = document.getElementById('theme-toggle-sun');
  
  if (!moonIcon || !sunIcon) return;

  if (theme === 'light') {
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  } else {
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

function updateGraphColor(theme) {
  const graph = document.getElementById('github-contrib-graph');
  if (graph) {
    const goldLight = 'C5A880';
    const goldDark  = 'D4AF37';
    graph.src = `https://ghchart.rshah.org/${theme === 'dark' ? goldDark : goldLight}/tejaskute284`;
  }
}
