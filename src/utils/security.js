export function isValidHttpUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isSafeAssetPath(path) {
  if (typeof path !== 'string') return false;
  const trimmed = path.trim();
  return /^assets\/[a-zA-Z0-9_\-./]+$/.test(trimmed) && !trimmed.includes('..');
}
