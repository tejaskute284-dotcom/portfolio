// Certificate Lightbox Modal Controller

let certModalInitialized = false;

export function initCertificateModal() {
  if (certModalInitialized) return;

  const modal = document.getElementById('certificate-modal');
  const modalImg = document.getElementById('modal-cert-image');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalSubtitle = document.getElementById('modal-cert-subtitle');
  const modalDownload = document.getElementById('modal-cert-download');
  const closeBtn = document.getElementById('close-cert-modal');

  if (!modal) return;
  certModalInitialized = true;

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  let lastFocusedElement = null;

  window.openCertificateModal = function(imageSrc, title, subtitle, triggerEl = null) {
    lastFocusedElement = triggerEl || document.activeElement;
    if (modalImg) {
      modalImg.src = imageSrc;
      modalImg.alt = title || 'Official Certificate';
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;
    if (modalDownload) modalDownload.href = imageSrc;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  };

  window.closeCertificateModal = function() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cert-img]');
    if (!trigger) return;
    e.preventDefault();
    const img = trigger.getAttribute('data-cert-img');
    const title = trigger.getAttribute('data-cert-title') || 'Certificate of Appreciation';
    const subtitle = trigger.getAttribute('data-cert-subtitle') || 'Official Credential';
    window.openCertificateModal(img, title, subtitle, trigger);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.closeCertificateModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.max-w-4xl')) {
      window.closeCertificateModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeCertificateModal();
    }
  });
}
