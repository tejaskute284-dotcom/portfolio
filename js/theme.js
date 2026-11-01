// Theme Toggle & Persistence Module — Warm Ivory Editorial (Light) & Obsidian Noir (Dark)

export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Default to ivory editorial light theme for classic luxury, while respecting existing preference
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateToggleIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
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
