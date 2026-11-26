import React, { useState } from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons.jsx';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('tejaskute284@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2) {
      setStatus({ type: 'error', text: 'Please enter your name (at least 2 characters).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!message || message.length < 10) {
      setStatus({ type: 'error', text: 'Please enter a message (at least 10 characters).' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'loading', text: 'Sending message to Tejas...' });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ name, email, subject, message })
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: 'success', text: `✓ ${data.message}` });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          text: `✕ ${data.message || 'Delivery failed. Please email tejaskute284@gmail.com directly.'}`
        });
      }
    } catch {
      setStatus({
        type: 'error',
        text: '✕ Delivery failed due to a network or server error. Please email tejaskute284@gmail.com directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-midnight reveal revealed">
      <div className="layout-container">
        <div className="section-header">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accentGoldMuted font-semibold mb-2 block">
            10 / Correspondence
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3">Initiate a Conversation</h2>
          <p className="section-intro-text">
            Available for AI/ML internships, research initiatives, and scalable software architecture collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <a
              href="mailto:tejaskute284@gmail.com"
              onClick={handleCopyEmail}
              className="premium-card flex items-center gap-4 cursor-pointer relative block"
            >
              <div className="p-3.5 rounded-lg bg-bgTertiary text-accentGold border border-border">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-textMuted font-mono uppercase tracking-wider">Email Address</p>
                <p className="font-medium text-textPrimary text-sm break-all font-sans">tejaskute284@gmail.com</p>
              </div>
              <span
                className={`copy-tooltip absolute right-6 top-1/2 -translate-y-1/2 bg-accentGold text-[#070B12] text-xs px-2.5 py-1 rounded transition-opacity duration-300 pointer-events-none font-semibold ${
                  copied ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Copied!
              </span>
            </a>

            <a href="tel:+918976550171" className="premium-card flex items-center gap-4 relative block">
              <div className="p-3.5 rounded-lg bg-bgTertiary text-accentGold border border-border">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-textMuted font-mono uppercase tracking-wider">Direct Line / WhatsApp</p>
                <p className="font-medium text-textPrimary text-sm font-sans">+91 8976550171</p>
              </div>
            </a>

            <a
              href="https://linkedin.com/in/tejas-kute-512aa2363"
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card flex items-center gap-4 relative block"
            >
              <div className="p-3.5 rounded-lg bg-bgTertiary text-accentGold border border-border">
                <LinkedInIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[11px] text-textMuted font-mono uppercase tracking-wider">LinkedIn Network</p>
                <p className="font-medium text-textPrimary text-sm font-sans">tejas-kute-512aa2363</p>
              </div>
            </a>

            <a
              href="https://github.com/tejaskute284-dotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card flex items-center gap-4 relative block"
            >
              <div className="p-3.5 rounded-lg bg-bgTertiary text-accentGold border border-border">
                <GitHubIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[11px] text-textMuted font-mono uppercase tracking-wider">GitHub Repositories</p>
                <p className="font-medium text-textPrimary text-sm font-sans">tejaskute284-dotcom</p>
              </div>
            </a>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6 premium-card" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name-input" className="block text-[11px] font-mono text-textMuted uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="form-input w-full px-4 py-3 text-sm transition font-sans"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email-input" className="block text-[11px] font-mono text-textMuted uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="form-input w-full px-4 py-3 text-sm transition font-sans"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject-input" className="block text-[11px] font-mono text-textMuted uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  id="subject-input"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  className="form-input w-full px-4 py-3 text-sm transition font-sans"
                  placeholder="Internship Opportunity / Project Collaboration"
                />
              </div>

              <div>
                <label htmlFor="message-input" className="block text-[11px] font-mono text-textMuted uppercase tracking-wider mb-2">
                  Your Message
                </label>
                <textarea
                  id="message-input"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="form-input w-full px-4 py-3 text-sm transition resize-none font-sans"
                  placeholder="Write your message here..."
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-luxury-primary text-sm font-sans">
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
                {status.text && (
                  <span
                    className={`text-xs font-mono font-semibold ${
                      status.type === 'success'
                        ? 'status-success'
                        : status.type === 'error'
                          ? 'status-error'
                          : 'text-accentGold'
                    }`}
                  >
                    {status.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
