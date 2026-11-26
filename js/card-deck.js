// card-deck.js — Interactive 3D Stacked Card Deck Controller for Hackathons & Achievements
// Supports click-to-focus peeking cards, prev/next buttons, dots, touch swipe, keyboard arrows, and calm auto-cycle.

let activeDeckCleanup = null;

export function initCardDeck() {
  if (typeof activeDeckCleanup === 'function') {
    activeDeckCleanup();
    activeDeckCleanup = null;
  }

  const deckRoot = document.getElementById('hackathons-deck');
  if (!deckRoot) return;

  const stage = deckRoot.querySelector('.hackathon-deck-stage');
  const cards = Array.from(deckRoot.querySelectorAll('.hackathon-deck-card'));
  const prevBtn = deckRoot.querySelector('.hackathon-deck-prev');
  const nextBtn = deckRoot.querySelector('.hackathon-deck-next');
  const counterEl = deckRoot.querySelector('.hackathon-deck-counter');
  const dots = Array.from(deckRoot.querySelectorAll('.hackathon-deck-dot'));

  if (!stage || cards.length === 0) return;

  const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const total = cards.length;
  let activeIndex = 0;
  let autoTimer = null;
  let isHovered = false;
  let isInView = true;

  const updateDeck = () => {
    const isCompact = window.innerWidth < 640;
    const offsetX1 = isCompact ? 18 : 42;
    const offsetX2 = isCompact ? 34 : 80;
    const offsetY1 = isCompact ? 8 : 10;
    const offsetY2 = isCompact ? 16 : 20;

    cards.forEach((card, idx) => {
      const forwardDiff = (idx - activeIndex + total) % total;
      const backwardDiff = (activeIndex - idx + total) % total;

      let state = 'hidden';
      let transform = `translate3d(0, 28px, -140px) scale(0.82)`;
      let opacity = '0';
      let zIndex = '1';
      let pointerEvents = 'none';

      if (forwardDiff === 0) {
        state = 'active';
        transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        opacity = '1';
        zIndex = '30';
        pointerEvents = 'auto';
      } else if (forwardDiff === 1) {
        state = 'next-1';
        transform = `translate3d(${offsetX1}px, ${offsetY1}px, -45px) scale(0.94) rotate(2.5deg)`;
        opacity = '0.88';
        zIndex = '20';
        pointerEvents = 'auto';
      } else if (forwardDiff === 2 && total > 3) {
        state = 'next-2';
        transform = `translate3d(${offsetX2}px, ${offsetY2}px, -90px) scale(0.88) rotate(5deg)`;
        opacity = '0.62';
        zIndex = '10';
        pointerEvents = 'auto';
      } else if (backwardDiff === 1) {
        state = 'prev-1';
        transform = `translate3d(-${offsetX1}px, ${offsetY1}px, -45px) scale(0.94) rotate(-2.5deg)`;
        opacity = '0.88';
        zIndex = '20';
        pointerEvents = 'auto';
      }

      card.setAttribute('data-deck-state', state);
      card.setAttribute('aria-hidden', state === 'hidden' ? 'true' : 'false');
      card.style.transform = transform;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.pointerEvents = pointerEvents;
    });

    if (counterEl) {
      counterEl.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    dots.forEach((dot, idx) => {
      const isCurrent = idx === activeIndex;
      dot.classList.toggle('is-active', isCurrent);
      dot.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  };

  const goTo = (index) => {
    activeIndex = ((index % total) + total) % total;
    updateDeck();
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    if (prefersReducedQuery.matches || document.hidden || isHovered || !isInView) return;
    autoTimer = setInterval(goNext, 4800);
  };

  const resetAuto = () => {
    stopAuto();
    startAuto();
  };

  // Clicking a peeking card brings it to the front without triggering the certificate modal
  const onStageClick = (e) => {
    const card = e.target.closest('.hackathon-deck-card');
    if (!card) return;
    const idx = cards.indexOf(card);
    if (idx !== -1 && idx !== activeIndex) {
      e.preventDefault();
      e.stopPropagation();
      goTo(idx);
      resetAuto();
    }
  };

  const onPrevClick = (e) => {
    e.preventDefault();
    goPrev();
    resetAuto();
  };

  const onNextClick = (e) => {
    e.preventDefault();
    goNext();
    resetAuto();
  };

  const dotHandlers = dots.map((dot, idx) => {
    const fn = (e) => {
      e.preventDefault();
      goTo(idx);
      resetAuto();
    };
    dot.addEventListener('click', fn);
    return { dot, fn };
  });

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
      resetAuto();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
      resetAuto();
    }
  };

  // Touch & pointer swipe support on the deck stage
  let startX = 0;
  let isPointerDown = false;

  const onTouchStart = (e) => {
    startX = e.changedTouches[0].screenX;
    stopAuto();
  };

  const onTouchEnd = (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) goNext();
      else goPrev();
    }
    startAuto();
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    isPointerDown = true;
    startX = e.clientX;
  };

  const onMouseUp = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 45) {
      // Suppress opening certificate modal when dragging to flip cards
      const suppressClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      stage.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(() => stage.removeEventListener('click', suppressClick, { capture: true }), 50);

      if (diff > 0) goNext();
      else goPrev();
      resetAuto();
    }
  };

  const onMouseEnter = () => {
    isHovered = true;
    stopAuto();
  };

  const onMouseLeave = () => {
    isHovered = false;
    isPointerDown = false;
    startAuto();
  };

  const onVisibilityChange = () => {
    if (document.hidden) stopAuto();
    else startAuto();
  };

  const onResize = () => updateDeck();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInView = entry.isIntersecting;
      if (isInView) startAuto();
      else stopAuto();
    });
  }, { threshold: 0.15 });
  observer.observe(deckRoot);

  stage.addEventListener('click', onStageClick);
  if (prevBtn) prevBtn.addEventListener('click', onPrevClick);
  if (nextBtn) nextBtn.addEventListener('click', onNextClick);
  deckRoot.addEventListener('keydown', onKeyDown);
  stage.addEventListener('touchstart', onTouchStart, { passive: true });
  stage.addEventListener('touchend', onTouchEnd, { passive: true });
  stage.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  deckRoot.addEventListener('mouseenter', onMouseEnter);
  deckRoot.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', onResize, { passive: true });

  updateDeck();
  startAuto();

  activeDeckCleanup = () => {
    stopAuto();
    observer.disconnect();
    stage.removeEventListener('click', onStageClick);
    if (prevBtn) prevBtn.removeEventListener('click', onPrevClick);
    if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
    dotHandlers.forEach(({ dot, fn }) => dot.removeEventListener('click', fn));
    deckRoot.removeEventListener('keydown', onKeyDown);
    stage.removeEventListener('touchstart', onTouchStart);
    stage.removeEventListener('touchend', onTouchEnd);
    stage.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    deckRoot.removeEventListener('mouseenter', onMouseEnter);
    deckRoot.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', onResize);
  };
}
