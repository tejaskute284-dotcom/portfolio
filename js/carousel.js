// Vanilla JS Infinite Loop Carousel Module with Full-Buffer Seamless Clones & Failsafe Unlocks

export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const content = carousel.querySelector('.carousel-content');
    if (!content) return;

    const originalItems = Array.from(content.children).filter(el => !el.classList.contains('carousel-clone'));
    const totalOriginals = originalItems.length;
    if (totalOriginals === 0) return;

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    // Clean up any previously created clones
    content.querySelectorAll('.carousel-clone').forEach(el => el.remove());

    let isTransitioning = false;
    let transitionSafetyTimer = null;

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
    // Use an entire full copy buffer for seamless infinite runway
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
        content.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      const translateValue = index * itemWidthPercent;
      content.style.transform = `translateX(-${translateValue}%)`;
    };

    // Ensure buttons remain fully interactive
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

      // Failsafe unlock timer in case transitionend is delayed
      if (transitionSafetyTimer) clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(checkBoundariesAndReset, 500);
    };

    const goPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      setPosition(currentIndex, true);

      // Failsafe unlock timer in case transitionend is delayed
      if (transitionSafetyTimer) clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(checkBoundariesAndReset, 500);
    };

    // Transition end listener for boundary teleportation
    content.addEventListener('transitionend', (e) => {
      if (e.target !== content) return;
      checkBoundariesAndReset();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goPrev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goNext();
      });
    }

    // Touch Swipe Support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
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

    // Initial setup without animation
    setPosition(currentIndex, false);
  });
}
