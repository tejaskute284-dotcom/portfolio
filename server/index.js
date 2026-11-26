import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PROJECTS } from '../src/data/projects.js';
import { HACKATHONS } from '../src/data/hackathons.js';
import { CERTIFICATIONS } from '../src/data/certifications.js';
import { GITHUB_STATS } from '../src/data/githubStats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FETCH_TIMEOUT_MS = 8000;
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// In-memory GitHub cache
let githubCache = {
  timestamp: 0,
  data: null
};

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

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Portfolio single-source-of-truth API
app.get('/api/portfolio', (_req, res) => {
  res.json({
    projects: PROJECTS,
    hackathons: HACKATHONS,
    certifications: CERTIFICATIONS,
    githubStats: GITHUB_STATS
  });
});

// GitHub live stats & contributions API (cached + validated)
app.get('/api/github', async (_req, res) => {
  if (githubCache.data && Date.now() - githubCache.timestamp < GITHUB_CACHE_TTL_MS) {
    return res.json(githubCache.data);
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
    statusError = 'GitHub contributions service timed out or is unreachable.';
  }

  try {
    const userRes = await fetchWithTimeout(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (userRes.ok) {
      const userData = await userRes.json();
      if (typeof userData.public_repos === 'number') {
        totalRepos = userData.public_repos;
      }
    }
  } catch {
    // Public repo fallback handled below
  }

  if (liveContributions && totalContributions !== null) {
    const payload = {
      available: true,
      totalContributions,
      totalRepos: totalRepos !== null ? totalRepos : GITHUB_STATS.totalRepos,
      longestStreak: longestStreak !== null ? longestStreak : GITHUB_STATS.longestStreak,
      contributions: liveContributions
    };
    githubCache = { timestamp: Date.now(), data: payload };
    return res.json(payload);
  }

  return res.status(503).json({
    available: false,
    message: statusError || 'Live GitHub contribution data is temporarily unavailable.',
    fallback: GITHUB_STATS
  });
});

// Contact form endpoint (server-side validation + Web3Forms relay)
app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || name.length < 2) {
    return res.status(400).json({ success: false, message: 'Please enter your name (at least 2 characters).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  if (!message || message.length < 10) {
    return res.status(400).json({ success: false, message: 'Please enter a message (at least 10 characters).' });
  }

  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '9b2c39fa-5b12-4217-a068-07e3a9fa05f4';
    const response = await fetchWithTimeout('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `[Portfolio Contact] ${subject || 'New Inquiry'}`,
        message,
        from_name: `${name} (Portfolio Website)`
      })
    });

    const result = await response.json();
    if (response.ok && result.success) {
      return res.json({
        success: true,
        message: 'Message sent successfully! Notification delivered to Tejas.'
      });
    }

    return res.status(502).json({
      success: false,
      message: result.message || 'Upstream mail service rejected the request.'
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: 'Delivery failed due to a network or API error. Please email tejaskute284@gmail.com directly.'
    });
  }
});

// Serve static assets & built React bundle in production
const distDir = path.join(ROOT_DIR, 'dist');
const assetsDir = path.join(ROOT_DIR, 'assets');

if (fs.existsSync(assetsDir)) {
  app.use('/assets', express.static(assetsDir));
}

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Portfolio Node.js server running on http://localhost:${PORT}`);
});
