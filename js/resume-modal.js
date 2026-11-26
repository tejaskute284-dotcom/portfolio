// Resume Lightbox / Viewer Modal Controller

let resumeModalInitialized = false;

export function initResumeModal() {
  if (resumeModalInitialized) return;

  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');
  const viewBtns = document.querySelectorAll('.js-open-resume-modal');

  if (!modal) return;
  resumeModalInitialized = true;

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  let lastFocusedElement = null;

  window.openResumeModal = function(triggerEl = null) {
    lastFocusedElement = triggerEl || document.activeElement;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  };

  window.closeResumeModal = function() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openResumeModal(btn);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.closeResumeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeResumeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeResumeModal();
    }
  });
}
