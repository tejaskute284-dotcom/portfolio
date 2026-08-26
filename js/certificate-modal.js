// Certificate Lightbox Modal Controller

export function initCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  const modalImg = document.getElementById('modal-cert-image');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalSubtitle = document.getElementById('modal-cert-subtitle');
  const modalDownload = document.getElementById('modal-cert-download');
  const closeBtn = document.getElementById('close-cert-modal');

  if (!modal) return;

  // Open modal function
  window.openCertificateModal = function(imageSrc, title, subtitle) {
    if (modalImg) modalImg.src = imageSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;
    if (modalDownload) modalDownload.href = imageSrc;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  // Close modal function
  window.closeCertificateModal = function() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  // Attach event listeners to all certificate triggers
  document.querySelectorAll('[data-cert-img]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const img = trigger.getAttribute('data-cert-img');
      const title = trigger.getAttribute('data-cert-title') || 'Certificate of Appreciation';
      const subtitle = trigger.getAttribute('data-cert-subtitle') || 'Official Credential';
      window.openCertificateModal(img, title, subtitle);
    });
  });

  // Close button listener
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.closeCertificateModal();
    });
  }

  // Backdrop click listener — closes when click lands OUTSIDE the card panel
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.max-w-4xl')) {
      window.closeCertificateModal();
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      window.closeCertificateModal();
    }
  });
}
