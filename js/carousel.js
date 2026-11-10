// Vanilla JS Infinite Loop Carousel Module with Continuous Auto-Play & Full Seamless Clones

export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    // If already running an autoplay timer on this carousel instance, clear it first
    if (carousel._carouselAutoplayTimer) {
      clearInterval(carousel._carouselAutoplayTimer);
      carousel._carouselAutoplayTimer = null;
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
    // Full copy buffer on both sides for infinite runway
    const cloneCount = totalOriginals;

    // Clone full original set to prepend
    const prependFragment = document.createDocumentFragment();
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('carousel-clone');
      prependFragment.appendChild(clone);
    });
    content.insertBefore(prependFragment, content.firstChild);

    // Clone full original set to append
    const appendFragment = document.createDocumentFragment();
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('carousel-clone');
      appendFragment.appendChild(clone);
    });
    content.appendChild(appendFragment);

    // Refresh icons inside clones
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Virtual index starts at the start of original cards
    let currentIndex = cloneCount;

    const setPosition = (index, animated = true) => {
      itemsPerView = getItemsPerView();
      const allItems = content.querySelectorAll('.carousel-item');
      const itemWidthPercent = 100 / itemsPerView;

      allItems.forEach(item => {
        item.style.flex = `0 0 ${itemWidthPercent}%`;
        item.style.maxWidth = `${itemWidthPercent}%`;
      });

      if (!animated) {
        content.style.transition = 'none';
      } else {
        content.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      const translateValue = index * itemWidthPercent;
      content.style.transform = `translateX(-${translateValue}%)`;
    };

    // Keep navigation buttons always enabled
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
      // Past the original set to the right
      if (currentIndex >= cloneCount + totalOriginals) {
        content.style.transition = 'none';
        currentIndex = currentIndex - totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight; // force reflow
      } 
      // Before the original set to the left
      else if (currentIndex < cloneCount) {
        content.style.transition = 'none';
        currentIndex = currentIndex + totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight; // force reflow
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

    // Transition end listener for boundary teleportation
    content.addEventListener('transitionend', (e) => {
      if (e.target !== content) return;
      checkBoundariesAndReset();
    });

    // Auto-Play: continuous infinite forward movement
    const startAutoplay = () => {
      stopAutoplay();
      carousel._carouselAutoplayTimer = setInterval(goNext, autoplayInterval);
    };

    const stopAutoplay = () => {
      if (carousel._carouselAutoplayTimer) {
        clearInterval(carousel._carouselAutoplayTimer);
        carousel._carouselAutoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause on hover so user can easily read or click cards
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        goPrev();
        resetAutoplay();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        goNext();
        resetAutoplay();
      };
    }

    // Touch Swipe Support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 35;
      if (touchStartX - touchEndX > threshold) {
        goNext();
      } else if (touchEndX - touchStartX > threshold) {
        goPrev();
      }
    };

    // Resize handler
    const onResize = () => {
      itemsPerView = getItemsPerView();
      setPosition(currentIndex, false);
    };
    window.addEventListener('resize', onResize);

    // Initial setup and start moving
    setPosition(currentIndex, false);
    startAutoplay();
  });
}
