import React from 'react';

export function GitHubIcon({ className = 'w-4 h-4 fill-current' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function LinkedInIcon({ className = 'w-4 h-4 fill-current' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function SkillIcon({ name }) {
  const cls = 'w-4 h-4';
  switch (name) {
    case 'react':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.6" className={cls}><circle cx="12" cy="12" r="2.1" fill="#61DAFB" /><ellipse cx="12" cy="12" rx="10" ry="4.2" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" /></svg>;
    case 'ts':
      return <svg viewBox="0 0 24 24" className={cls}><rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6" /><text x="12" y="16.5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="sans-serif">TS</text></svg>;
    case 'js':
      return <svg viewBox="0 0 24 24" className={cls}><rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" /><text x="12" y="16.5" textAnchor="middle" fill="#101A2C" fontSize="10" fontWeight="800" fontFamily="sans-serif">JS</text></svg>;
    case 'python':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M12 3c-4 0-3.8 1.8-3.8 1.8v2h3.9v.7H6.6S4 7.2 4 11.1c0 3.9 2.3 3.8 2.3 3.8h1.4v-1.8s-.1-2.3 2.2-2.3h3.9s2.2 0 2.2-2.1V5.1S16.3 3 12 3z" fill="#3776AB" /><path d="M12 21c4 0 3.8-1.8 3.8-1.8v-2h-3.9v-.7h5.5s2.6.3 2.6-3.6c0-3.9-2.3-3.8-2.3-3.8h-1.4v1.8s.1 2.3-2.2 2.3h-3.9s-2.2 0-2.2 2.1v3.6S7.7 21 12 21z" fill="#FFD43B" /></svg>;
    case 'node':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#68A063" strokeWidth="1.8" className={cls}><polygon points="12 2 20.5 7 20.5 17 12 22 3.5 17 3.5 7" /><path d="M9 14.5c0 1 1.2 1.8 3 1.8s3-.7 3-1.8c0-2-6-1-6-3 0-1 1.2-1.7 3-1.7s2.8.6 3 1.5" /></svg>;
    case 'fastapi':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><circle cx="12" cy="12" r="9.5" fill="#009688" /><path d="M13 6l-5 7h4l-1 5 5-7h-4l1-5z" fill="#FFFFFF" /></svg>;
    case 'pytorch':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M16.5 6.5a6.5 6.5 0 1 1-9 0l2-2 1.4 1.4-2 2a4.5 4.5 0 1 0 6.2 0z" fill="#EE4C2C" /><circle cx="15" cy="5.5" r="1.4" fill="#EE4C2C" /></svg>;
    case 'tf':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M12 3L4 7.5v4l4-2.2V19l4 2.2V11.5l3 1.7V9.5L12 7.8V3zm0 0l8 4.5v4l-4-2.2v3.2l-2-1.1V8.2L12 7V3z" fill="#FF6F00" /></svg>;
    case 'ai':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" fill="#D1B77E" /></svg>;
    case 'db':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" className={cls}><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" /><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" /></svg>;
    case 'leaf':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M12 2C7 7 6 12.5 12 21c6-8.5 5-14 0-19z" fill="#47A248" /><path d="M12 7v14" stroke="#E9E7E1" strokeWidth="1.2" /></svg>;
    case 'prism':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#E9E7E1" strokeWidth="1.8" className={cls}><polygon points="12 3 20 18 12 21 4 18" /><line x1="12" y1="3" x2="12" y2="21" /></svg>;
    case 'shield':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" strokeWidth="1.8" className={cls}><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path d="M9.5 12l1.8 1.8 3.5-3.6" /></svg>;
    case 'ml':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#F89939" strokeWidth="1.8" className={cls}><circle cx="7" cy="14" r="3.5" fill="#F89939" fillOpacity="0.25" /><circle cx="15.5" cy="9.5" r="4" fill="#3499CD" fillOpacity="0.3" stroke="#3499CD" /></svg>;
    case 'cube':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#4DABCF" strokeWidth="1.8" className={cls}><polygon points="12 2 20 6.5 20 17.5 12 22 4 17.5 4 6.5" /><polyline points="4 6.5 12 11 20 6.5" /><line x1="12" y1="11" x2="12" y2="22" /></svg>;
    case 'chart':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" className={cls}><line x1="6" y1="19" x2="6" y2="11" /><line x1="12" y1="19" x2="12" y2="5" /><line x1="18" y1="19" x2="18" y2="14" /></svg>;
    case 'wind':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.8" className={cls}><path d="M3 10c2-3 5-3 7 0s5 3 7 0" /><path d="M5 15c2-3 5-3 7 0s5 3 7 0" /></svg>;
    case 'bolt':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#3ECF8E" /></svg>;
    case 'git':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#F05032" strokeWidth="1.8" className={cls}><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="8" r="2.2" /><circle cx="6" cy="18" r="2.2" /><path d="M6 8.2v7.6M18 10.2C18 14 6 12 6 15.8" /></svg>;
    case 'rocket':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#FF6C37" strokeWidth="1.8" className={cls}><circle cx="12" cy="12" r="8" /><path d="M9 15l6-6M11 9h4v4" /></svg>;
    case 'vscode':
      return <svg viewBox="0 0 24 24" fill="none" className={cls}><path d="M16.5 3L7 11.5 3.5 9 2 10.5l3.8 2.5L2 15.5 3.5 17 7 14.5 16.5 21l4.5-2V5l-4.5-2z" fill="#007ACC" /></svg>;
    case 'terminal':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" strokeWidth="1.8" className={cls}><rect x="3" y="4" width="18" height="16" rx="2" /><polyline points="7 9 10 12 7 15" /><line x1="12" y1="15" x2="17" y2="15" /></svg>;
    case 'html':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#E34F26" strokeWidth="1.8" className={cls}><polyline points="8 7 3 12 8 17" /><polyline points="16 7 21 12 16 17" /><line x1="13" y1="5" x2="11" y2="19" /></svg>;
    case 'api':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#B99A5E" strokeWidth="1.8" className={cls}><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="7" r="2.2" /><circle cx="18" cy="17" r="2.2" /><line x1="8" y1="11" x2="16" y2="8" /><line x1="8" y1="13" x2="16" y2="16" /></svg>;
    case 'cloud':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" className={cls}><path d="M17.5 18H7a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-1.3A3.5 3.5 0 0 1 17.5 18z" /></svg>;
    case 'motion':
      return <svg viewBox="0 0 24 24" fill="none" stroke="#D1B77E" strokeWidth="1.8" className={cls}><path d="M5 5h14l-7 7h7l-7 7-7-7h7l-7-7z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" fill="none" stroke="#929BAA" strokeWidth="1.8" className={cls}><polyline points="8 7 3 12 8 17" /><polyline points="16 7 21 12 16 17" /></svg>;
  }
}
