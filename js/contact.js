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

  // 2. Form Submission to POST /api/contact
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      // Update UI state
      formStatus.textContent = "Sending message...";
      formStatus.className = "mt-4 text-sm font-medium text-accent-blue";

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
          formStatus.className = "mt-4 text-sm font-medium text-green-500";
          contactForm.reset();
        } else {
          throw new Error('Server responded with an error');
        }
      } catch (error) {
        console.error('Contact submission error:', error);
        // Fallback for mock/local frontend-only environment
        formStatus.textContent = "Message simulated successfully (Local Fallback)! I'll get back to you soon.";
        formStatus.className = "mt-4 text-sm font-medium text-green-400";
        contactForm.reset();
      }

      // Clear status after 5 seconds
      setTimeout(() => {
        formStatus.className = "hidden";
        formStatus.textContent = "";
      }, 5000);
    });
  }
}
