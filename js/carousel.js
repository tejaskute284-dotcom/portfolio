// Vanilla JS Carousel Module with Smooth Auto-Play & Touch Swipe

export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const content = carousel.querySelector('.carousel-content');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!content || items.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const autoplayInterval = 4200; // 4.2s smooth advance

    // Calculate items visible based on viewport
    const getItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        return parseInt(carousel.getAttribute('data-items-lg') || '2', 10);
      } else if (window.innerWidth >= 768) {
        return parseInt(carousel.getAttribute('data-items-md') || '2', 10);
      } else {
        return parseInt(carousel.getAttribute('data-items-sm') || '1', 10);
      }
    };

    const updateCarousel = () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, items.length - itemsPerView);
      
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      // Calculate width of each item percentage
      const itemWidthPercent = 100 / itemsPerView;
      items.forEach(item => {
        item.style.flex = `0 0 ${itemWidthPercent}%`;
        item.style.maxWidth = `${itemWidthPercent}%`;
      });

      const translateValue = currentIndex * itemWidthPercent;
      content.style.transform = `translateX(-${translateValue}%)`;

      // Update button disabled states
      if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      }
      if (nextBtn) {
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.35' : '1';
        nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
      }
    };

    const goNext = () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, items.length - itemsPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // seamlessly loop back
      }
      updateCarousel();
    };

    const goPrev = () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, items.length - itemsPerView);
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateCarousel();
    };

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

    // Auto-Play: "slowly move for further project automatic way"
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

    // Handle viewport resizing
    window.addEventListener('resize', updateCarousel);
    
    // Initial render and start autoplay
    updateCarousel();
    startAutoplay();
  });
}
