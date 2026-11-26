// Contact Form & Clipboard Copy Module

let contactInitialized = false;

export function initContact() {
  if (contactInitialized) return;
  contactInitialized = true;

  // 1. Copy-to-Clipboard (Email / Username)
  const copyElements = document.querySelectorAll('.copy-trigger');

  copyElements.forEach(el => {
    el.addEventListener('click', async () => {
      const textToCopy = el.getAttribute('data-copy');
      const tooltip = el.querySelector('.copy-tooltip');

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);

        if (tooltip) {
          const originalText = tooltip.textContent;
          tooltip.textContent = "Copied!";
          tooltip.classList.remove('opacity-0');
          tooltip.classList.add('opacity-100');

          setTimeout(() => {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
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

  // 2. Form Submission with Validation & Reliable Delivery Handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    let isSubmitting = false;
    let statusHideTimer = null;

    const showStatus = (message, classes, autoHideMs = 0) => {
      if (statusHideTimer) {
        clearTimeout(statusHideTimer);
        statusHideTimer = null;
      }
      formStatus.textContent = message;
      formStatus.className = classes;
      formStatus.classList.remove('hidden');

      if (autoHideMs > 0) {
        statusHideTimer = setTimeout(() => {
          formStatus.className = "hidden";
          formStatus.textContent = "";
        }, autoHideMs);
      }
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();

      // Client-side validation
      if (!name || name.length < 2) {
        showStatus("Please enter your name (at least 2 characters).", "text-xs font-mono status-error font-semibold");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        showStatus("Please enter a valid email address.", "text-xs font-mono status-error font-semibold");
        return;
      }

      if (!message || message.length < 10) {
        showStatus("Please enter a message (at least 10 characters).", "text-xs font-mono status-error font-semibold");
        return;
      }

      isSubmitting = true;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      showStatus("Sending message to Tejas...", "text-xs font-mono text-accentGold flex items-center gap-2");

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            access_key: '9b2c39fa-5b12-4217-a068-07e3a9fa05f4',
            name,
            email,
            subject: `[Portfolio Contact] ${subject || 'New Inquiry'}`,
            message,
            from_name: `${name} (Portfolio Website)`
          })
        });

        clearTimeout(timeoutId);
        const result = await response.json();

        if (response.ok && result.success) {
          showStatus(
            "✓ Message sent successfully! Notification delivered to Tejas.",
            "text-xs font-mono status-success font-semibold",
            8000
          );
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Server returned an unsuccessful response.');
        }
      } catch (error) {
        console.error('Contact form submission failed:', error);
        showStatus(
          "✕ Delivery failed due to a network or API error. Please email tejaskute284@gmail.com directly.",
          "text-xs font-mono status-error font-semibold"
        );
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
}
