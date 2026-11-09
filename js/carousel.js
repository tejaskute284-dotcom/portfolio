// Vanilla JS Infinite Loop Carousel Module with Seamless Cloned Buffers & Touch Support

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

    // Clean up any previously created clones (e.g. if re-initialized)
    content.querySelectorAll('.carousel-clone').forEach(el => el.remove());

    let autoplayTimer = null;
    const autoplayInterval = 4200; // 4.2s smooth advance
    let isTransitioning = false;

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
    // Clones count buffer: clone itemsPerView from head and tail to guarantee infinite seamless wrap
    let cloneCount = itemsPerView;

    // Clone tail items to prepend
    const prependClones = [];
    for (let i = 0; i < cloneCount; i++) {
      const origIndex = (totalOriginals - cloneCount + i) % totalOriginals;
      const clone = originalItems[(origIndex + totalOriginals) % totalOriginals].cloneNode(true);
      clone.classList.add('carousel-clone');
      prependClones.push(clone);
    }
    prependClones.reverse().forEach(clone => {
      content.insertBefore(clone, content.firstChild);
    });

    // Clone head items to append
    for (let i = 0; i < cloneCount; i++) {
      const origIndex = i % totalOriginals;
      const clone = originalItems[origIndex].cloneNode(true);
      clone.classList.add('carousel-clone');
      content.appendChild(clone);
    }

    // Refresh icons inside clones
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Virtual index starts right after the prepended clones
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
        content.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      const translateValue = index * itemWidthPercent;
      content.style.transform = `translateX(-${translateValue}%)`;
    };

    // Keep navigation buttons always enabled for infinite looping
    if (prevBtn) {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
    }

    const goNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      setPosition(currentIndex, true);
    };

    const goPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      setPosition(currentIndex, true);
    };

    // Transition end listener to seamlessly teleport when passing boundaries
    content.addEventListener('transitionend', (e) => {
      if (e.target !== content) return;

      // Teleport when reaching or passing appended clones
      if (currentIndex >= cloneCount + totalOriginals) {
        content.style.transition = 'none';
        currentIndex = currentIndex - totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight; // force reflow
      } 
      // Teleport when reaching or passing prepended clones
      else if (currentIndex < cloneCount) {
        content.style.transition = 'none';
        currentIndex = currentIndex + totalOriginals;
        const itemWidthPercent = 100 / itemsPerView;
        content.style.transform = `translateX(-${currentIndex * itemWidthPercent}%)`;
        void content.offsetHeight; // force reflow
      }

      isTransitioning = false;
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        resetAutoplay();
      });
    }

    // Auto-Play: continuous infinite forward movement
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(goNext, autoplayInterval);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

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
      const threshold = 40;
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
    startAutoplay();
  });
}
