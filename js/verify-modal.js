// Certification Verify Modal Controller

let verifyModalInitialized = false;

export function initVerifyModal() {
  if (verifyModalInitialized) return;

  const modal = document.getElementById('verify-modal');
  const closeBtn = document.getElementById('close-verify-modal');
  const titleEl = document.getElementById('verify-modal-title');
  const idEl = document.getElementById('verify-modal-id');
  const linkEl = document.getElementById('verify-modal-link');

  if (!modal) return;
  verifyModalInitialized = true;

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  let lastFocusedElement = null;

  function openModal(certTitle, certId, certUrl, triggerEl = null) {
    lastFocusedElement = triggerEl || document.activeElement;
    if (titleEl) titleEl.textContent = certTitle;
    if (idEl) idEl.textContent = certId;
    if (linkEl) {
      const isValidHttp = certUrl && (certUrl.startsWith('https://') || certUrl.startsWith('http://'));
      linkEl.href = isValidHttp ? certUrl : '#';
      linkEl.style.display = isValidHttp ? '' : 'none';
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  }

  function closeModal() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-verify-cert');
    if (!btn) return;
    e.preventDefault();
    openModal(
      btn.dataset.certTitle,
      btn.dataset.certId,
      btn.dataset.certUrl,
      btn
    );
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.max-w-lg')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      closeModal();
    }
  });
}
