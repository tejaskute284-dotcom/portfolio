// Certification Verify Modal Controller
export function initVerifyModal() {
  const modal = document.getElementById('verify-modal');
  const closeBtn = document.getElementById('close-verify-modal');
  const titleEl = document.getElementById('verify-modal-title');
  const idEl = document.getElementById('verify-modal-id');
  const linkEl = document.getElementById('verify-modal-link');

  if (!modal) return;

  function openModal(certTitle, certId, certUrl) {
    if (titleEl) titleEl.textContent = certTitle;
    if (idEl) idEl.textContent = certId;
    if (linkEl) linkEl.href = certUrl;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Delegate clicks on dynamically rendered Verify buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-verify-cert');
    if (!btn) return;
    openModal(
      btn.dataset.certTitle,
      btn.dataset.certId,
      btn.dataset.certUrl
    );
  });

  // Close button
  closeBtn?.addEventListener('click', closeModal);

  // Backdrop click — close when click lands outside the card panel
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.max-w-lg')) {
      closeModal();
    }
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
