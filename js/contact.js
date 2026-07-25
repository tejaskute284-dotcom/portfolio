// Contact Form & Clipboard Copy Module

export function initContact() {
  // 1. Copy-to-Clipboard (Email / Username)
  const copyElements = document.querySelectorAll('.copy-trigger');
  
  copyElements.forEach(el => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy');
      const tooltip = el.querySelector('.copy-tooltip');

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Show success tooltip
        if (tooltip) {
          const originalText = tooltip.textContent;
          tooltip.textContent = "Copied!";
          tooltip.classList.remove('opacity-0');
          tooltip.classList.add('opacity-100');

          setTimeout(() => {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
            // Wait for transition to complete before resetting text
            setTimeout(() => {
              tooltip.textContent = originalText;
            }, 300);
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // 2. Form Submission with Email Notification to Admin (tejaskute284@gmail.com)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      // Add target recipient for email service
      payload.access_key = '9b2c39fa-5b12-4217-a068-07e3a9fa05f4'; // Public contact submission handler key
      payload.to_email = 'tejaskute284@gmail.com';
      payload.subject = `[Portfolio Contact] ${payload.subject || 'New Inquiry'}`;

      // Update UI status
      formStatus.classList.remove('hidden');
      formStatus.textContent = "Sending message to Tejas...";
      formStatus.className = "text-xs font-mono text-accentBlue flex items-center gap-2";

      try {
        // Send request to Web3Forms free contact API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '9b2c39fa-5b12-4217-a068-07e3a9fa05f4',
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            from_name: `${payload.name} (Portfolio Website)`
          })
        });

        const result = await response.json();

        if (response.ok || result.success) {
          formStatus.textContent = "✓ Message sent successfully! Notification delivered to Tejas.";
          formStatus.className = "text-xs font-mono text-emerald-400 font-semibold";
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Failed to dispatch email');
        }
      } catch (error) {
        console.warn('Form API attempt fallback:', error);
        // Fallback email link trigger if API endpoint blocked
        const mailtoUrl = `mailto:tejaskute284@gmail.com?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(`From: ${payload.name} (${payload.email})\n\nMessage:\n${payload.message}`)}`;
        window.open(mailtoUrl, '_blank');

        formStatus.textContent = "✓ Message formatted and opened in your email client to send to tejaskute284@gmail.com!";
        formStatus.className = "text-xs font-mono text-emerald-400 font-semibold";
        contactForm.reset();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        
        setTimeout(() => {
          formStatus.className = "hidden";
          formStatus.textContent = "";
        }, 8000);
      }
    });
  }
}
