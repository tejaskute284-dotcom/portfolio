// Project data — single source of truth
export const PROJECTS = [
  {
    name: 'FlowState',
    accent: 'accentViolet',
    accentClass: 'text-accentViolet',
    badge: { label: 'LIVE', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    tagline: '"Productivity OS that evolves with your work style."',
    img: 'assets/flowstate.jpg',
    imgAlt: 'FlowState UI Preview',
    desc: 'FlowState is a next-generation productivity dashboard that combines a Kanban task manager, a fully custom Pomodoro timer, rich-text note-taking, and a live habit tracker — all rendered with cinematic depth via custom CSS shadows and intentional micro-interactions.',
    collaborators: [
      { name: 'Tejas Kute', url: 'https://github.com/tejaskute284-dotcom', owner: true },
      { name: 'Miss Shreya Desai', url: 'https://github.com/shreyaaspires-cloud' },
      { name: 'Mr. Aaryan Raorane', url: 'https://github.com/WisdomKingAR' }
    ],
    tags: ['React 18', 'Vite 6', 'Tailwind CSS 4', 'Framer Motion 12', 'Lenis', 'Lucide React', 'Inter'],
    github: 'https://github.com/tejaskute284-dotcom/flowstate.git',
    footer: 'Intent OS · Cinematic Shadows'
  },
  {
    name: 'CivicFix',
    accent: 'accentCyan',
    accentClass: 'text-accentCyan',
    badge: { label: 'HACKATHON', cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    tagline: '"End-to-end intelligence platform bridging citizens and municipal workforces."',
    img: 'assets/civicfix.jpg',
    imgAlt: 'CivicFix Platform Preview',
    desc: 'CivicFix is a full-stack civic issue reporting platform where citizens photograph urban problems (potholes, broken streetlights, overflowing bins) and get a 60-second submission flow. The backend auto-deduplicates reports using PostGIS geospatial clustering (500 m radius), scores complaint priority 1–100 via a 4-factor model (Hazard Baseline 35 %, Volume Log-Curve 25 %, Proximity to Schools/Hospitals 25 %, SLA Breach Progression 15 %), and requires Gemini Vision before-after photo verification before marking an issue resolved. Includes an anti-spam engine and clustered GeoJSON map feeds.',
    collaborators: [
      { name: 'Tejas Kute',      url: 'https://github.com/tejaskute284-dotcom', owner: true },
      { name: 'Shreya Desai',    url: 'https://github.com/shreyaaspires-cloud' },
      { name: 'Aaryan Raorane',  url: 'https://github.com/WisdomKingAR' }
    ],
    tags: [
      'Node.js v20', 'TypeScript 5.5', 'Express 4.19',
      'PostgreSQL', 'Supabase', 'PostGIS', 'Prisma 5.22',
      'Gemini 2.0 Flash', 'Cloudinary', 'JWT', 'Zod', 'Helmet.js'
    ],
    github: 'https://github.com/WisdomKingAR/CivicFix',
    footer: 'PostGIS Deduplication · Gemini Vision · Priority Scoring'
  },
  {
    name: 'CryoNex',
    accent: 'accentCyan',
    accentClass: 'text-accentCyan',
    badge: { label: 'LIVE', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    tagline: '"Next-generation cold-chain logistics for pharma."',
    img: 'assets/cryonex.jpg',
    imgAlt: 'CryoNex UI Preview',
    desc: 'CryoNex is a full-featured cold-chain logistics platform for critical pharmaceutical shipments — Stem Cells, Gene Therapies, and Monoclonal Antibodies. It delivers real-time telemetry, an interactive global shipment map (Leaflet.js), a guided procurement wizard, and an automated risk management engine. Persists states via browser local storage.',
    collaborators: [
      { name: 'Tejas Kute', url: 'https://github.com/tejaskute284-dotcom', owner: true },
      { name: 'Miss Shreya Desai', url: 'https://github.com/shreyaaspires-cloud' },
      { name: 'Mr. Aaryan Raorane', url: 'https://github.com/WisdomKingAR' }
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript ES6', 'Tailwind CSS', 'Leaflet.js', 'Anime.js', 'Chart.js', 'Lenis'],
    github: 'https://github.com/WisdomKingAR/Cryonex',
    demo: '#',
    footer: 'Telemetry · Global map · Procurement Wizard'
  },
  {
    name: 'NexusChat',
    accent: 'accentViolet',
    accentClass: 'text-accentViolet',
    badge: { label: 'IN PROGRESS', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    tagline: '"Real-time chat with JWT auth and WebSocket messaging."',
    img: 'assets/nexuschat.jpg',
    imgAlt: 'NexusChat UI Preview',
    desc: 'NexusChat is a modern messaging app with a Python FastAPI backend and React frontend. It implements secure JWT authentication, Bcrypt password hashing, instant WebSocket messaging, and MongoDB for persistent storage.',
    collaborators: [
      { name: 'Tejas Kute', url: 'https://github.com/tejaskute284-dotcom', owner: true },
      { name: 'Miss Shreya Desai', url: 'https://github.com/shreyaaspires-cloud' },
      { name: 'Mr. Aaryan Raorane', url: 'https://github.com/WisdomKingAR' }
    ],
    tags: ['Python', 'FastAPI', 'MongoDB', 'WebSockets', 'React', 'Vite', 'Tailwind CSS', 'PyJWT', 'Bcrypt', 'Motor'],
    private: true,
    footer: 'JWT Security · Encrypted persistence'
  },
  {
    name: 'HSMMS',
    accent: 'accentBlue',
    accentClass: 'text-accentBlue',
    badge: { label: 'IN PROGRESS', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    tagline: '"Housing Society Maintenance Management System."',
    img: null,
    imgAlt: null,
    desc: 'Built during the internship at Aerus Infotech Solutions, HSMMS is a role-based society management platform covering 8 functional modules for Admin, Resident, Staff, and Security Guard personas. Integrates Express REST API and a MySQL database.',
    collaborators: [
      { name: 'Tejas Kute', url: 'https://github.com/tejaskute284-dotcom', owner: true },
      { name: 'Miss Shreya Desai', url: 'https://github.com/shreyaaspires-cloud' },
      { name: 'Mr. Aaryan Raorane', url: 'https://github.com/WisdomKingAR' }
    ],
    tags: ['Node.js', 'Express', 'MySQL', 'React', 'JavaScript', 'REST API', 'Technical Docs'],
    internship: 'Private (Internship Project @ Aerus Infotech Solutions)',
    footer: '8 Role Modules · MySQL Relations'
  }
];
