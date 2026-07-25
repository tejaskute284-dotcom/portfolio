// Resume Lightbox / Viewer Modal Controller

export function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');
  const viewBtns = document.querySelectorAll('.js-open-resume-modal');

  if (!modal) return;

  // Open modal function
  window.openResumeModal = function() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
  };

  // Close modal function
  window.closeResumeModal = function() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Event Listeners for trigger buttons
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openResumeModal();
    });
  });

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.closeResumeModal();
    });
  }

  // Backdrop click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeResumeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      window.closeResumeModal();
    }
  });
}
