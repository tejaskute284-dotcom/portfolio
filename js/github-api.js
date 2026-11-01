// github-api.js — Automated live sync for GitHub statistics
// Fetches real-time commits, repositories, and contribution matrix directly from live GitHub endpoints

import { GITHUB_STATS } from './data/github-stats.js';
import { renderGitHubGraph } from './github-graph.js';

const CACHE_KEY = 'tk_github_live_stats_v3';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minute freshness for rapid commit reflection

export async function initGitHubSync() {
  const commitEl = document.getElementById('github-stat-commits');
  const repoEl = document.getElementById('github-stat-repos');
  const streakEl = document.getElementById('github-stat-streak');
  const summaryHeading = document.getElementById('github-summary-count');

  // Check cache first for instant rendering
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        applyStats(parsed.data, commitEl, repoEl, streakEl, summaryHeading);
        if (parsed.data.contributions) {
          renderGitHubGraph(parsed.data.contributions);
        }
        return;
      }
    }
  } catch (err) {}

  // Fetch live stats from GitHub
  try {
    const username = GITHUB_STATS.username || 'tejaskute284-dotcom';

    // 1. Fetch live contribution matrix & annual total
    const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    let totalCommits = 295; // live verified baseline
    let longestStreak = GITHUB_STATS.longestStreak;
    let liveContributions = null;

    if (contribRes.ok) {
      const contribData = await contribRes.json();
      if (contribData && contribData.total && typeof contribData.total.lastYear === 'number') {
        totalCommits = contribData.total.lastYear;
      }
      if (Array.isArray(contribData.contributions)) {
        liveContributions = contribData.contributions;
        // Compute active consecutive day streak
        let maxStreak = 0;
        let curStreak = 0;
        contribData.contributions.forEach(c => {
          if (c.count > 0) {
            curStreak++;
            if (curStreak > maxStreak) maxStreak = curStreak;
          } else {
            curStreak = 0;
          }
        });
        if (maxStreak > 0) {
          longestStreak = Math.max(maxStreak, GITHUB_STATS.longestStreak);
        }
      }
    }

    // 2. Fetch live public repository count
    let totalRepos = GITHUB_STATS.totalRepos;
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        if (typeof userData.public_repos === 'number') {
          totalRepos = userData.public_repos;
        }
      }
    } catch {}

    const liveData = {
      totalCommits,
      totalRepos,
      longestStreak,
      contributions: liveContributions
    };

    // Cache the verified live results
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: liveData
      }));
    } catch {}

    // Apply live stats to UI
    applyStats(liveData, commitEl, repoEl, streakEl, summaryHeading);

    // Re-render SVG contribution graph with real activity squares & accurate rolling months
    if (liveContributions) {
      renderGitHubGraph(liveContributions);
    }

  } catch (error) {
    // Offline or network block: baseline numbers remain untouched
  }
}

function applyStats(data, commitEl, repoEl, streakEl, summaryHeading) {
  if (commitEl && data.totalCommits) {
    commitEl.setAttribute('data-target', data.totalCommits);
    commitEl.textContent = data.totalCommits;
  }
  if (repoEl && data.totalRepos) {
    repoEl.setAttribute('data-target', data.totalRepos);
    repoEl.textContent = data.totalRepos;
  }
  if (streakEl && data.longestStreak) {
    streakEl.setAttribute('data-target', data.longestStreak);
    streakEl.textContent = data.longestStreak;
  }
  if (summaryHeading && data.totalCommits) {
    summaryHeading.textContent = `${data.totalCommits} contributions in the last year`;
  }
}
