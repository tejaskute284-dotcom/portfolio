import React, { useEffect, useRef } from 'react';
import { Download, ExternalLink, FileText, ShieldCheck, X } from 'lucide-react';
import { isValidHttpUrl } from '../utils/security.js';

export function ResumeModal({ isOpen, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 40);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="resume-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Resume Document Preview"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative max-w-4xl w-full h-[88vh] bg-bgSecondary border border-borderGold rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bgTertiary shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-accentGold" />
            <div>
              <h3 className="text-lg font-serif font-bold text-textPrimary">Tejas Sharad Kute — Curriculum Vitae</h3>
              <p className="text-[11px] font-mono text-textMuted">AI/ML Engineer · Full-Stack Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/assets/Tejas_Kute_CV.pdf"
              download="Tejas_Kute_CV.pdf"
              className="btn-luxury-primary text-xs px-4 py-2 font-mono flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="p-2 text-textSecondary hover:text-textPrimary transition rounded-lg bg-bgSecondary border border-border"
              aria-label="Close Resume Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-bgPrimary w-full h-full relative">
          <iframe src="/assets/Tejas_Kute_CV.pdf" className="w-full h-full border-0" title="Tejas Kute Resume PDF" />
        </div>
      </div>
    </div>
  );
}

export function CertificateModal({ data, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 40);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div
      id="certificate-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate Verification Lightbox"
      onClick={(e) => {
        if (!e.target.closest('.relative.max-w-4xl')) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative max-w-4xl w-full bg-bgSecondary border border-borderGold rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bgTertiary">
          <div>
            <h3 className="text-lg font-serif font-bold text-textPrimary">{data.title}</h3>
            <p className="text-xs font-mono text-textMuted">{data.subtitle}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-2 text-textSecondary hover:text-textPrimary transition rounded-lg bg-bgSecondary border border-border"
            aria-label="Close Certificate Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 bg-bgPrimary flex justify-center items-center max-h-[75vh] overflow-y-auto">
          <img
            src={data.img}
            alt={data.title}
            className="max-w-full max-h-[65vh] object-contain rounded-lg border border-border shadow-lg"
          />
        </div>
        <div className="px-6 py-3 border-t border-border bg-bgTertiary flex justify-between items-center text-xs font-mono text-textMuted">
          <span>Verified Credential · Tejas Sharad Kute</span>
          <a
            href={data.img}
            download
            className="text-accentGold hover:underline flex items-center gap-1.5 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Copy</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function VerifyModal({ data, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 40);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [data, onClose]);

  if (!data) return null;

  const hasValidUrl = isValidHttpUrl(data.url);

  return (
    <div
      id="verify-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Coursera Credential Verification"
      onClick={(e) => {
        if (!e.target.closest('.relative.max-w-lg')) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative max-w-lg w-full bg-bgSecondary border border-borderGold rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bgTertiary">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-accentGold" />
            <h3 className="text-lg font-serif font-bold text-textPrimary">Credential Verification</h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-2 text-textSecondary hover:text-textPrimary transition rounded-lg bg-bgSecondary border border-border"
            aria-label="Close Verify Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-[10px] font-mono text-textMuted uppercase tracking-widest mb-1">Course Title</p>
            <p className="text-base font-serif font-bold text-textPrimary">{data.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-bgTertiary border border-border">
            <div>
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-wider mb-1">Recipient</p>
              <p className="text-xs font-semibold text-textPrimary">Tejas Sharad Kute</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-wider mb-1">Credential ID</p>
              <p className="text-xs font-mono text-accentGold font-semibold">{data.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-textSecondary font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Issued by Coursera · Academic Credential Verified</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-bgTertiary flex justify-end gap-3">
          {hasValidUrl && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary text-xs px-5 py-2.5 flex items-center gap-2 font-mono"
            >
              <span>Open Official Coursera Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
