# Personal Portfolio — Tejas Sharad Kute

A professional, high-performance personal portfolio website for **Tejas Sharad Kute**, B.Tech student specializing in Artificial Intelligence & Machine Learning and Full-Stack Software Developer.

![Tech Stack](https://img.shields.io/badge/Tech%20Stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript%20(ES6%2B)-blue?style=flat-square)
![Frameworks](https://img.shields.io/badge/Libraries-Tailwind%20%7C%20GSAP%20%7C%20Lenis-violet?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-emerald?style=flat-square)

---

## ⚡ Tech Stack

- **Core Technologies**: Pure HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS (Utility classes via CDN), Custom CSS variables (`main.css`, `components.css`, `animations.css`)
- **Animations & Effects**: 
  - [GSAP](https://greensock.com/gsap/) for smooth section entrance animations
  - [Lenis](https://lenis.darkroom.engineering/) for inertia smooth scrolling
  - [tsParticles](https://particles.js.org/) for subtle dynamic hero background
- **Icons & Typography**:
  - [Lucide Icons](https://lucide.dev/)
  - Google Fonts: *Inter* (Body), *Space Grotesk* (Headings), *JetBrains Mono* (Code & Tags)

---

## ✨ Features

- 🌓 **Dark / Light Theme Toggle**: Persistent theme state via `localStorage` with smooth transitions.
- 📱 **Fully Responsive Layout**: Frosted glass sticky navbar, collapsible mobile navigation drawer.
- 🚀 **Interactive Hero Section**: Live availability status badge (`Available for Internships`), typewriter text effects, and quick contact action buttons.
- 💼 **Single-Page Data Architecture**: Data-driven rendering for Projects, Hackathons/Certificates, and Coursera Credentials.
- 🖼️ **Interactive Modals & Lightbox**:
  - **Resume Viewer Modal**: Embedded PDF previewer with direct download options.
  - **Certificate Verification Modal**: Full-screen photo verification lightbox.
- 📋 **Click-to-Copy Utility**: One-click email copying with tooltip feedback.
- 📊 **Animated Statistics Counter**: IntersectionObserver-triggered smooth counter increments.

---

## 📂 Project Structure

```
portfolio/
├── index.html                  # Main entry page and layout
├── README.md                   # Project documentation
├── package.json                # Dependencies and npm scripts
├── assets/                     # Media & Document Assets
│   ├── Tejas_Kute_CV.pdf       # Resume document (PDF)
│   ├── cryonex.jpg             # Project preview images
│   ├── flowstate.jpg
│   ├── nexuschat.jpg
│   └── certificates/           # Hackathon & certificate verification photos
├── css/                        # Stylesheets
│   ├── main.css                # CSS Variables, resets, and core themes
│   ├── components.css          # Cards, buttons, tabs, and layout utility styles
│   └── animations.css          # Keyframes, hover physics, and pulse animations
└── js/                         # JavaScript ES6 Modules
    ├── main.js                 # Orchestrator & DOM initialization
    ├── render.js               # Dynamic component renderer
    ├── theme.js                # Dark/Light mode state controller
    ├── scroll.js               # Lenis smooth scroll & IntersectionObserver reveal
    ├── typewriter.js           # Hero typing text animations
    ├── counter.js              # Animated stat counters
    ├── contact.js              # Contact form & email copy handler
    ├── mobile-nav.js           # Mobile navigation drawer controller
    ├── carousel.js             # Projects & Hackathons carousel slider
    ├── certificate-modal.js    # Certificate photo lightbox modal
    ├── resume-modal.js         # Resume PDF viewer modal
    └── data/                   # Single source of truth data modules
        ├── projects.js         # Production & internship projects data
        ├── hackathons.js       # Hackathons & certificate credentials data
        └── certifications.js   # Coursera academic certifications data
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or npx

### Setup & Run

1. Clone or open the project directory:
   ```bash
   cd portfolio
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 👨‍💻 Author

**Tejas Sharad Kute**  
- **Email**: [tejaskute284@gmail.com](mailto:tejaskute284@gmail.com)
- **GitHub**: [@tejaskute284-dotcom](https://github.com/tejaskute284-dotcom)
- **LinkedIn**: [Tejas Kute](https://linkedin.com/in/tejas-kute-512aa2363)
- **Phone**: +91 8976550171
