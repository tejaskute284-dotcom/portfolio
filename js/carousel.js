// Vanilla JS Infinite Loop Carousel Module with Continuous Auto-Play & Full Seamless Clones

export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');
  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  carousels.forEach(carousel => {
    // Clean up any existing listeners or timers attached to this carousel instance
    if (typeof carousel._carouselCleanup === 'function') {
      carousel._carouselCleanup();
      carousel._carouselCleanup = null;
    }

    const content = carousel.querySelector('.carousel-content');
    if (!content) return;

    // Clean up any previously created clones so we can calculate fresh
    content.querySelectorAll('.carousel-clone').forEach(el => el.remove());

    const originalItems = Array.from(content.children).filter(el => !el.classList.contains('carousel-clone'));
    const totalOriginals = originalItems.length;
    if (totalOriginals === 0) return;

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let isTransitioning = false;
    let transitionSafetyTimer = null;
    let autoplayTimer = null;
    const autoplayInterval = 3400; // 3.4s smooth continuous forward advance

    // Viewport-based items calculation
    const getItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        return parseInt(carousel.getAttribute('data-items-lg') || '3', 10);
      } else if (window.innerWidth >= 768) {
        return parseInt(carousel.getAttribute('data-items-md') || '2', 10);
      } else {
        return parseInt(carousel.getAttribute('data-items-sm') || '1', 10);
      }
    };

    let itemsPerView = getItemsPerView();
    const cloneCount = totalOriginals;

    // Clone full original set to prepend
    const prependFragment = document.createDocumentFragment();
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('carousel-clone');
      clone.setAttribute('aria-hidden', 'true');
      prependFragment.appendChild(clone);
    });
    content.insertBefore(prependFragment, content.firstChild);

    // Clone full original set to append
    const appendFragment = document.createDocumentFragment();
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('carousel-clone');
      clone.setAttribute('aria-hidden', 'true');
      appendFragment.appendChild(clone);
    });
    content.appendChild(appendFragment);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    let currentIndex = cloneCount;

    const setPosition = (index, animated = true) => {
      itemsPerView = getItemsPerView();
      const allItems = content.querySelectorAll('.carousel-item');
      const itemWidthPercent = 100 / itemsPerView;

      allItems.forEach(item => {
        item.style.flex = `0 0 ${itemWidthPercent}%`;
        item.style.maxWidth = `${itemWidthPercent}%`;
      });

      if (!animated || prefersReducedQuery.matches) {
        content.style.transition = 'none';
      } else {
        content.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      const translateValue = index * itemWidthPercent;
      content.style.transform = `translateX(-${translateValue}%)`;
    };

    if (prevBtn) {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
    }

    const checkBoundariesAndReset = () => {
      itemsPerView = getItemsPerView();
      if (currentIndex >= cloneCount + totalOriginals) {
        content.style.transition = 'none';
        currentIndex = currentIndex - totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight;
      } else if (currentIndex < cloneCount) {
        content.style.transition = 'none';
        currentIndex = currentIndex + totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight;
      }

      isTransitioning = false;
      if (transitionSafetyTimer) {
        clearTimeout(transitionSafetyTimer);
        transitionSafetyTimer = null;
      }
    };

    const goNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      setPosition(currentIndex, true);

      if (transitionSafetyTimer) clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(checkBoundariesAndReset, 600);
    };

    const goPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      setPosition(currentIndex, true);

      if (transitionSafetyTimer) clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(checkBoundariesAndReset, 600);
    };

    const onTransitionEnd = (e) => {
      if (e.target !== content) return;
      checkBoundariesAndReset();
    };
    content.addEventListener('transitionend', onTransitionEnd);

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (prefersReducedQuery.matches || document.hidden) return;
      autoplayTimer = setInterval(goNext, autoplayInterval);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const onPrevClick = (e) => {
      e.preventDefault();
      goPrev();
      resetAutoplay();
    };

    const onNextClick = (e) => {
      e.preventDefault();
      goNext();
      resetAutoplay();
    };

    if (prevBtn) prevBtn.addEventListener('click', onPrevClick);
    if (nextBtn) nextBtn.addEventListener('click', onNextClick);

    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        resetAutoplay();
      }
    };
    carousel.addEventListener('keydown', onKeyDown);

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    const onTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    };

    const onTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const threshold = 35;
      if (touchStartX - touchEndX > threshold) {
        goNext();
      } else if (touchEndX - touchStartX > threshold) {
        goPrev();
      }
      startAutoplay();
    };

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', onTouchStart, { passive: true });
    carousel.addEventListener('touchend', onTouchEnd, { passive: true });

    const onResize = () => {
      itemsPerView = getItemsPerView();
      setPosition(currentIndex, false);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    carousel._carouselCleanup = () => {
      stopAutoplay();
      if (transitionSafetyTimer) clearTimeout(transitionSafetyTimer);
      content.removeEventListener('transitionend', onTransitionEnd);
      if (prevBtn) prevBtn.removeEventListener('click', onPrevClick);
      if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
      carousel.removeEventListener('keydown', onKeyDown);
      carousel.removeEventListener('mouseenter', stopAutoplay);
      carousel.removeEventListener('mouseleave', startAutoplay);
      carousel.removeEventListener('touchstart', onTouchStart);
      carousel.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };

    setPosition(currentIndex, false);
    startAutoplay();
  });
}
