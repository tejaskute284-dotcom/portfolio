# Personal Portfolio — Tejas Sharad Kute

A professional, full-stack **React + Node.js** personal portfolio website for **Tejas Sharad Kute**, B.Tech student specializing in Artificial Intelligence & Machine Learning and Full-Stack Software Developer.

![Tech Stack](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Three.js-blue?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-emerald?style=flat-square)

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Three.js (GLSL 3D Golden Particle Wave & Technical Skills Orbital Canvas), Lucide React Icons
- **Backend**: Node.js + Express (`server/index.js`) with REST endpoints (`/api/health`, `/api/portfolio`, `/api/github`, `/api/contact`)
- **Design System**: Deep Obsidian (`#070B12`) × Midnight Navy (`#0B1424` / `#121D30`) × Antique Gold (`#B99A5E`) × Warm White (`#E9E7E1`)

---

## ✨ Features

- 🌌 **3D Cinematic Golden Particle Wave**: Custom GLSL `ShaderMaterial` Three.js wave landscape in the Hero section.
- 🃏 **Interactive 3D Card Deck**: Stacked 3D card deck for Hackathons & Achievements with automatic cycling, drag/swipe, and keyboard navigation.
- 🪐 **Golden Orbit Technical Skills**: Deterministic Vogel-phyllotaxis + AABB collision-free floating technology badges with SVG brand icons and Three.js orbital paths.
- 💼 **Infinite Marquee Reels**: Smooth continuous marquee reels for Projects and Coursera Academic Credentials.
- 📊 **Node.js GitHub Sync API**: Server-cached `/api/github` endpoint with accurate consecutive calendar-day streak calculation and honest offline fallback.
- ✉️ **Validated Correspondence API**: Server-backed `/api/contact` endpoint with strict validation and Web3Forms delivery.
- 🖼️ **Accessible Modals**: Resume PDF Viewer, Certificate Lightbox, and Credential Verification dialogs with Escape-to-close and focus restoration.

---

## 📂 Project Structure

```
portfolio/
├── index.html                  # Vite React entry HTML
├── package.json                # Full-stack scripts & dependencies
├── vite.config.js              # Vite bundler & /api proxy configuration
├── server/
│   └── index.js                # Node.js Express server & REST APIs
├── public/assets/              # Static images, certificates, and CV PDF
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Page orchestrator & modal state
    ├── styles/                 # main.css, components.css, animations.css
    ├── data/                   # Single source of truth data modules
    ├── utils/                  # URL & asset path validation helpers
    └── components/             # Modular React UI & Three.js components
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both the Node.js API server (`:5000`) and Vite React dev server (`:3000`):
   ```bash
   npm run dev
   ```

3. Build and run the production bundle via Node.js:
   ```bash
   npm run build
   npm start
   ```

---

## 👨‍💻 Author

**Tejas Sharad Kute**  
- **Email**: [tejaskute284@gmail.com](mailto:tejaskute284@gmail.com)
- **GitHub**: [@tejaskute284-dotcom](https://github.com/tejaskute284-dotcom)
- **LinkedIn**: [Tejas Kute](https://linkedin.com/in/tejas-kute-512aa2363)
- **Phone**: +91 8976550171
