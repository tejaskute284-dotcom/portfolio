// Vanilla JS Carousel Module

export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const content = carousel.querySelector('.carousel-content');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!content || items.length === 0) return;

    let currentIndex = 0;

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
        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      }
      if (nextBtn) {
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.4' : '1';
        nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, items.length - itemsPerView);
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    // Handle viewport resizing
    window.addEventListener('resize', updateCarousel);
    
    // Initial render
    updateCarousel();
  });
}
