import React, { useEffect, useState } from 'react';
import { FolderGit2 } from 'lucide-react';
import { GITHUB_STATS } from '../data/githubStats.js';
import { GitHubIcon } from './Icons.jsx';

function ContributionMatrix({ contributions, statusMessage }) {
  if (!Array.isArray(contributions) || contributions.length === 0) {
    return (
      <div className="py-10 px-4 text-center flex flex-col items-center justify-center gap-2">
        <p className="text-xs font-mono text-textSecondary">
          {statusMessage || 'Live GitHub contribution graph is currently unavailable.'}
        </p>
        <a
          href={GITHUB_STATS.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-accentGold hover:underline mt-1"
        >
          github.com/{GITHUB_STATS.username} &rarr;
        </a>
      </div>
    );
  }

  const weeks = 53;
  const days = 7;
  const cellSize = 11;
  const cellGap = 3.5;
  const step = cellSize + cellGap;

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getCellStyles = (level) => {
    switch (level) {
      case 1:
        return { fill: '#3B3427', stroke: 'rgba(185, 154, 94, 0.3)' };
      case 2:
        return { fill: '#665537', stroke: 'rgba(185, 154, 94, 0.5)' };
      case 3:
        return { fill: '#90784B', stroke: '#B99A5E' };
      case 4:
        return { fill: '#D1B77E', stroke: '#E9E7E1' };
      default:
        return { fill: '#070B12', stroke: 'rgba(146, 155, 170, 0.16)' };
    }
  };

  const grid = Array.from({ length: weeks }, () => new Array(7).fill(null));
  const monthHeaders = [];

  const firstDate = new Date(contributions[0].date + 'T00:00:00Z');
  let currentWeek = 0;
  let currentDay = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getUTCDay();
  let lastMonth = -1;

  contributions.forEach((item) => {
    if (currentWeek >= weeks || !item || typeof item.count !== 'number') return;
    grid[currentWeek][currentDay] = item;

    const itemDate = new Date(item.date + 'T00:00:00Z');
    if (!Number.isNaN(itemDate.getTime())) {
      const m = itemDate.getUTCMonth();
      if (m !== lastMonth) {
        if (!monthHeaders.some((mh) => mh.week === currentWeek)) {
          monthHeaders.push({ week: currentWeek, label: monthNames[m] });
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

  const svgWidth = 32 + weeks * step + 16;
  const svgHeight = 22 + days * step + 16;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full min-w-[760px] select-none"
      role="img"
      aria-label="GitHub contribution activity matrix"
    >
      {monthHeaders.map((mh) => (
        <text
          key={`${mh.week}-${mh.label}`}
          x={32 + mh.week * step}
          y={12}
          fill="#929BAA"
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.06em"
        >
          {mh.label}
        </text>
      ))}

      {dayLabels.map((label, idx) =>
        label ? (
          <text
            key={label}
            x={6}
            y={idx * step + 32}
            fill="#929BAA"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            {label}
          </text>
        ) : null
      )}

      {grid.map((col, w) =>
        col.map((item, d) => {
          if (!item) return null;
          const { fill, stroke } = getCellStyles(item.level);
          const titleText = item.date
            ? `${item.count} contribution${item.count === 1 ? '' : 's'} on ${item.date}`
            : `${item.count} contributions`;
          return (
            <rect
              key={`${w}-${d}`}
              x={32 + w * step}
              y={22 + d * step}
              width={cellSize}
              height={cellSize}
              rx={2.5}
              fill={fill}
              stroke={stroke}
              strokeWidth={0.75}
              className="contrib-cell cursor-pointer"
            >
              <title>{titleText}</title>
            </rect>
          );
        })
      )}
    </svg>
  );
}

export default function GitHubStats() {
  const [stats, setStats] = useState({
    totalContributions: GITHUB_STATS.totalCommits,
    totalRepos: GITHUB_STATS.totalRepos,
    longestStreak: GITHUB_STATS.longestStreak,
    contributions: null,
    summaryText: `${GITHUB_STATS.totalCommits} contributions in the last year`,
    statusMessage: 'Loading live GitHub contribution matrix...'
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadGitHub() {
      try {
        const res = await fetch('/api/github', { signal: controller.signal });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.available) {
          setStats({
            totalContributions: data.totalContributions,
            totalRepos: data.totalRepos,
            longestStreak: data.longestStreak,
            contributions: data.contributions,
            summaryText: `${data.totalContributions} contributions in the last year`,
            statusMessage: null
          });
        } else {
          setStats((prev) => ({
            ...prev,
            contributions: null,
            summaryText: 'Live contribution activity unavailable',
            statusMessage: data.message || 'Live GitHub contribution data temporarily unavailable.'
          }));
        }
      } catch {
        if (cancelled) return;
        setStats((prev) => ({
          ...prev,
          contributions: null,
          summaryText: 'Live contribution activity unavailable',
          statusMessage: 'Unable to reach GitHub API service.'
        }));
      }
    }

    loadGitHub();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const featuredRepos = [
    {
      name: 'CivicFix',
      desc: 'Urban issue reporting platform with PostGIS spatial clustering and automated complaint triage.',
      dotColor: 'bg-amber-400',
      lang: 'JavaScript',
      type: 'Full-Stack'
    },
    {
      name: 'MUMBAI-express',
      desc: 'High-throughput transit service architecture engineered with clean Express routing and data layers.',
      dotColor: 'bg-blue-400',
      lang: 'JavaScript',
      type: 'Backend'
    },
    {
      name: 'studentexpenses',
      desc: 'Personal finance tracking application built with strict TypeScript typing and transactional math.',
      dotColor: 'bg-indigo-400',
      lang: 'TypeScript',
      type: 'Production'
    }
  ];

  return (
    <section id="github-stats" className="section-navy reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono text-accentGoldMuted font-semibold uppercase tracking-widest mb-2 block">
            06 / Open Source Activity
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">
            GitHub <span className="gold-gradient-text">Contributions</span>
          </h2>
          <p className="section-intro-text">
            A year&apos;s worth of code — commits, projects, and consistent daily practice documented in the public record.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="premium-card text-center editorial-frame">
            <p className="text-[11px] font-mono text-accentGold uppercase tracking-widest mb-2">Total Contributions</p>
            <p className="font-display text-4xl font-bold text-textPrimary">{stats.totalContributions}</p>
            <p className="text-xs text-textMuted font-mono mt-1">last 12 months</p>
          </div>
          <div className="premium-card text-center editorial-frame">
            <p className="text-[11px] font-mono text-accentGold uppercase tracking-widest mb-2">Portfolio Projects</p>
            <p className="font-display text-4xl font-bold text-textPrimary">0{GITHUB_STATS.totalProjects}</p>
            <p className="text-xs text-textMuted font-mono mt-1">production builds</p>
          </div>
          <div className="premium-card text-center editorial-frame">
            <p className="text-[11px] font-mono text-accentGold uppercase tracking-widest mb-2">Public Repos</p>
            <p className="font-display text-4xl font-bold text-textPrimary">{stats.totalRepos}</p>
            <p className="text-xs text-textMuted font-mono mt-1">on GitHub</p>
          </div>
          <div className="premium-card text-center editorial-frame">
            <p className="text-[11px] font-mono text-accentGold uppercase tracking-widest mb-2">Longest Streak</p>
            <p className="font-display text-4xl font-bold text-textPrimary">{stats.longestStreak}</p>
            <p className="text-xs text-textMuted font-mono mt-1">consecutive days</p>
          </div>
        </div>

        {/* Contribution Graph & Featured Repos */}
        <div className="premium-card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-mono text-accentGold uppercase tracking-widest block mb-1">
                Verified Engineering Activity
              </span>
              <h3 className="text-xl font-bold text-textPrimary">{stats.summaryText}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-accentGoldMuted px-3 py-1 rounded-full border border-borderGold bg-bgTertiary">
                <span className="w-2 h-2 rounded-full bg-accentGoldMuted animate-pulse" />
                <span>Active Sprint: 260+ Commits</span>
              </span>
              <a
                href={GITHUB_STATS.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-secondary text-xs px-4 py-2 flex items-center gap-2 self-start sm:self-auto font-mono"
              >
                <GitHubIcon />
                <span>View GitHub Profile</span>
              </a>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg bg-bgTertiary p-5 border border-border shadow-inner">
            <ContributionMatrix contributions={stats.contributions} statusMessage={stats.statusMessage} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50 text-[11px] font-mono text-textMuted">
            <div className="flex items-center gap-2">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-bgSecondary border border-border" />
              <span className="w-2.5 h-2.5 rounded-sm bg-accentGold/20" />
              <span className="w-2.5 h-2.5 rounded-sm bg-accentGold/50" />
              <span className="w-2.5 h-2.5 rounded-sm bg-accentGold/80" />
              <span className="w-2.5 h-2.5 rounded-sm bg-accentGold" />
              <span>More</span>
            </div>
            <p>
              Verified public commits ·{' '}
              <a
                href={GITHUB_STATS.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accentGold hover:underline"
              >
                github.com/{GITHUB_STATS.username}
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-accentGold uppercase tracking-wider font-semibold">
                Featured Public Repositories
              </span>
              <span className="text-[11px] font-mono text-textMuted">Live Production &amp; Research</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={GITHUB_STATS.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg bg-bgTertiary border border-border hover:border-accentGoldMuted transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-textPrimary font-mono group-hover:text-accentGold transition flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-accentGold" />
                        <span>{repo.name}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-accentGold/30 text-accentGold">
                        Public
                      </span>
                    </div>
                    <p className="text-xs text-textSecondary leading-relaxed mb-3">{repo.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-textMuted">
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${repo.dotColor}`} />
                      {repo.lang}
                    </span>
                    <span>·</span>
                    <span>{repo.type}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
