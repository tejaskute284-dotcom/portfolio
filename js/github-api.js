// github-api.js — Automated live sync for GitHub statistics
// Fetches real-time commits, repositories, and activity with smart caching and offline fallback

import { GITHUB_STATS } from './data/github-stats.js';

const CACHE_KEY = 'tk_github_live_stats';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache to respect rate limits

export async function initGitHubSync() {
  const commitEl = document.getElementById('github-stat-commits');
  const repoEl = document.getElementById('github-stat-repos');
  const summaryHeading = document.getElementById('github-summary-count');

  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        applyStats(parsed.data, commitEl, repoEl, summaryHeading);
        return;
      }
    }
  } catch (err) {
    // LocalStorage read error fallback
  }

  // Fetch live stats from GitHub Public API
  try {
    const username = GITHUB_STATS.username || 'tejaskute284-dotcom';
    
    // Fetch user profile for repo counts
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!userRes.ok) {
      return; // Gracefully stay on baseline numbers if rate limited
    }

    const userData = await userRes.json();
    const publicRepos = userData.public_repos || GITHUB_STATS.totalRepos;

    // Fetch public commit activity via GitHub Search API (commits authored by user)
    let totalCommits = GITHUB_STATS.totalCommits;
    try {
      const commitRes = await fetch(
        `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc`,
        { headers: { 'Accept': 'application/vnd.github.cloak-preview+json' } }
      );
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        if (typeof commitData.total_count === 'number' && commitData.total_count > 0) {
          totalCommits = Math.max(commitData.total_count, GITHUB_STATS.totalCommits);
        }
      }
    } catch {
      // Commit search query limit reached, use fallback commits
    }

    const liveData = {
      totalCommits,
      totalRepos: publicRepos,
      longestStreak: GITHUB_STATS.longestStreak
    };

    // Cache the verified results
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: liveData
      }));
    } catch {}

    // Apply stats to DOM
    applyStats(liveData, commitEl, repoEl, summaryHeading);

  } catch (error) {
    // Offline or network block: baseline numbers remain untouched
  }
}

function applyStats(data, commitEl, repoEl, summaryHeading) {
  if (commitEl && data.totalCommits) {
    commitEl.setAttribute('data-target', data.totalCommits);
    commitEl.textContent = data.totalCommits;
  }
  if (repoEl && data.totalRepos) {
    repoEl.setAttribute('data-target', data.totalRepos);
    repoEl.textContent = data.totalRepos;
  }
  if (summaryHeading && data.totalCommits) {
    summaryHeading.textContent = `${data.totalCommits} contributions in the last year`;
  }
}

