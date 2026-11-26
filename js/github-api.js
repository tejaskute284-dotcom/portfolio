// github-api.js — Automated live sync for GitHub statistics
// Fetches real-time contributions, repositories, and calculates true consecutive calendar-day streaks.

import { GITHUB_STATS } from './data/github-stats.js';
import { renderGitHubGraph } from './github-graph.js';

const CACHE_KEY = 'tk_github_live_stats_v4';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function computeConsecutiveStreak(contributions) {
  if (!Array.isArray(contributions) || contributions.length === 0) return 0;

  // Sort chronologically by ISO date (YYYY-MM-DD)
  const sorted = [...contributions]
    .filter(c => c && typeof c.date === 'string' && typeof c.count === 'number')
    .sort((a, b) => a.date.localeCompare(b.date));

  let maxStreak = 0;
  let curStreak = 0;
  let prevTime = null;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (const entry of sorted) {
    const curTime = Date.parse(entry.date + 'T00:00:00Z');
    if (Number.isNaN(curTime)) continue;

    if (entry.count > 0) {
      if (prevTime !== null && Math.round((curTime - prevTime) / ONE_DAY_MS) === 1) {
        curStreak++;
      } else {
        curStreak = 1;
      }
      if (curStreak > maxStreak) maxStreak = curStreak;
    } else {
      curStreak = 0;
    }
    prevTime = curTime;
  }

  return maxStreak;
}

export async function initGitHubSync() {
  const commitEl = document.getElementById('github-stat-commits');
  const repoEl = document.getElementById('github-stat-repos');
  const streakEl = document.getElementById('github-stat-streak');
  const summaryHeading = document.getElementById('github-summary-count');

  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        typeof parsed.timestamp === 'number' &&
        Date.now() - parsed.timestamp < CACHE_DURATION_MS &&
        parsed.data &&
        Array.isArray(parsed.data.contributions)
      ) {
        applyStats(parsed.data, commitEl, repoEl, streakEl, summaryHeading);
        renderGitHubGraph(parsed.data.contributions);
        return;
      }
    }
  } catch {
    // Ignore invalid cache
  }

  const username = GITHUB_STATS.username || 'tejaskute284-dotcom';
  let totalContributions = null;
  let longestStreak = null;
  let liveContributions = null;
  let totalRepos = null;
  let statusError = null;

  try {
    const contribRes = await fetchWithTimeout(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
    );

    if (contribRes.status === 429) {
      statusError = 'GitHub contributions API rate limit reached. Try again shortly.';
    } else if (!contribRes.ok) {
      statusError = `Unable to load live contributions (HTTP ${contribRes.status}).`;
    } else {
      const contribData = await contribRes.json();
      if (contribData && contribData.total && typeof contribData.total.lastYear === 'number') {
        totalContributions = contribData.total.lastYear;
      }
      if (Array.isArray(contribData.contributions) && contribData.contributions.length > 0) {
        liveContributions = contribData.contributions;
        longestStreak = computeConsecutiveStreak(liveContributions);
      }
    }
  } catch {
    statusError = navigator.onLine
      ? 'GitHub contributions service timed out or is unreachable.'
      : 'Offline: live GitHub contributions cannot be loaded.';
  }

  try {
    const userRes = await fetchWithTimeout(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (userRes.ok) {
      const userData = await userRes.json();
      if (typeof userData.public_repos === 'number') {
        totalRepos = userData.public_repos;
      }
    }
  } catch {
    // Public repo count fallback handled below
  }

  if (liveContributions && totalContributions !== null) {
    const liveData = {
      totalContributions,
      totalRepos: totalRepos !== null ? totalRepos : GITHUB_STATS.totalRepos,
      longestStreak: longestStreak !== null ? longestStreak : GITHUB_STATS.longestStreak,
      contributions: liveContributions
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: liveData
      }));
    } catch {
      // Storage quota exceeded
    }

    applyStats(liveData, commitEl, repoEl, streakEl, summaryHeading);
    renderGitHubGraph(liveContributions);
  } else {
    // Do not fake contribution squares; render explicit unavailable message
    if (summaryHeading) {
      summaryHeading.textContent = 'Live contribution activity unavailable';
    }
    renderGitHubGraph(null, statusError);
  }
}

function applyStats(data, commitEl, repoEl, streakEl, summaryHeading) {
  if (commitEl && typeof data.totalContributions === 'number') {
    commitEl.setAttribute('data-target', data.totalContributions);
    commitEl.textContent = data.totalContributions;
  }
  if (repoEl && typeof data.totalRepos === 'number') {
    repoEl.setAttribute('data-target', data.totalRepos);
    repoEl.textContent = data.totalRepos;
  }
  if (streakEl && typeof data.longestStreak === 'number') {
    streakEl.setAttribute('data-target', data.longestStreak);
    streakEl.textContent = data.longestStreak;
  }
  if (summaryHeading && typeof data.totalContributions === 'number') {
    summaryHeading.textContent = `${data.totalContributions} contributions in the last year`;
  }
}
