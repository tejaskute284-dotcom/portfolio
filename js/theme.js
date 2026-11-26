// Theme Controller — Enforces Ultra-Dark Cinematic Obsidian & Midnight Navy Theme

export function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('theme', 'dark');
  } catch {
    // Ignore storage access errors
  }
}
