// Mobile Navigation Drawer Module — Accessible Drawer with Escape & Focus Restoration

let mobileNavInitialized = false;

export function initMobileNav() {
  if (mobileNavInitialized) return;

  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!menuBtn || !drawer) return;
  mobileNavInitialized = true;

  // Set initial ARIA attributes
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'mobile-menu-drawer');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Mobile Navigation Menu');

  let isOpen = false;

  const openDrawer = () => {
    if (isOpen) return;
    isOpen = true;
    drawer.classList.remove('translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  };

  const closeDrawer = (restoreFocus = true) => {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';

    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    if (restoreFocus && menuBtn) {
      menuBtn.focus();
    }
  };

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', () => closeDrawer(true));
  if (backdrop) backdrop.addEventListener('click', () => closeDrawer(true));

  const drawerItems = document.querySelectorAll('#mobile-menu-drawer a, #mobile-menu-drawer button.js-open-resume-modal');
  drawerItems.forEach(item => {
    item.addEventListener('click', () => closeDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closeDrawer(true);
    }
  });
}
