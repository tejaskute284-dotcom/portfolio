// Mobile Navigation Drawer Module

export function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const drawerLinks = document.querySelectorAll('#mobile-menu-drawer a');

  if (!menuBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
  };

  menuBtn.addEventListener('click', openDrawer);
  
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const drawerItems = document.querySelectorAll('#mobile-menu-drawer a, #mobile-menu-drawer button.js-open-resume-modal');

  drawerItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });
}
