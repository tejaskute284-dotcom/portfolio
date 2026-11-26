import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '../data/certifications.js';
import { isValidHttpUrl } from '../utils/security.js';

function CertCard({ c, onOpenVerify }) {
  const hasValidUrl = isValidHttpUrl(c.url);
  return (
    <div className="cert-marquee-card">
      <div className="premium-card h-full flex flex-col justify-between">
        <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-accentGold uppercase tracking-widest font-semibold">
                COURSERA ACADEMIC
              </span>
              <span className="text-accentGold text-xs font-mono flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-textPrimary leading-snug mb-2">{c.title}</h3>
            <p className="text-xs text-textSecondary font-sans mt-1">Domain: {c.domain}</p>
          </div>
          <div className="border-t border-border pt-4 mt-6 flex justify-between items-center mt-auto">
            <span className="text-[10px] text-textMuted font-mono">ID: {c.id}</span>
            {hasValidUrl ? (
              <button
                type="button"
                onClick={(e) => onOpenVerify(c.title, c.id, c.url, e.currentTarget)}
                className="text-xs font-semibold text-accentGold hover:text-accentGoldDark hover:underline flex items-center gap-1.5 transition"
              >
                Verify Credential <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[10px] text-textMuted font-mono">Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certifications({ onOpenVerify }) {
  return (
    <section id="certifications" className="section-midnight reveal revealed">
      <div className="layout-container-carousel">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            07 / Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Coursera Academic Credentials</h2>
        </div>

        <div className="cert-marquee-viewport" aria-label="Infinite continuous certifications marquee">
          <div className="cert-marquee-track">
            {CERTIFICATIONS.map((c) => (
              <CertCard key={`a-${c.id}`} c={c} onOpenVerify={onOpenVerify} />
            ))}
            {CERTIFICATIONS.map((c) => (
              <CertCard key={`b-${c.id}`} c={c} onOpenVerify={onOpenVerify} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
