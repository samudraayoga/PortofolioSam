(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapterIds = ['beranda', 'profil', 'keahlian', 'karya', 'perjalanan', 'kontak'];
  const chapters = chapterIds.map(id => document.getElementById(id)).filter(Boolean);
  const ratios = new Map(chapters.map(chapter => [chapter, 0]));
  const scrollSubscribers = new Set();
  const resizeSubscribers = new Set();
  const scrollState = Object.seal({
    y: window.scrollY,
    previousY: window.scrollY,
    delta: 0,
    direction: 0,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    timestamp: performance.now()
  });
  let activeChapter = chapters[0]?.id || '';
  let scrollFrame = 0;
  let scrollIdleTimer = 0;
  let resizePending = true;

  function flushScrollFrame(timestamp) {
    scrollFrame = 0;
    const nextY = window.scrollY;
    scrollState.previousY = scrollState.y;
    scrollState.y = nextY;
    scrollState.delta = nextY - scrollState.previousY;
    scrollState.direction = Math.sign(scrollState.delta);
    scrollState.viewportHeight = window.innerHeight;
    scrollState.viewportWidth = window.innerWidth;
    scrollState.timestamp = timestamp;

    if (resizePending) {
      resizePending = false;
      resizeSubscribers.forEach(callback => callback(scrollState));
    }
    scrollSubscribers.forEach(callback => callback(scrollState));
  }

  function requestScrollFrame() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(flushScrollFrame);
  }

  function finishScrolling() {
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = 0;
    if (!body.classList.contains('is-scrolling')) return;
    body.classList.remove('is-scrolling');
    document.dispatchEvent(new CustomEvent('celestialscrollsettled', {
      detail: {y: window.scrollY}
    }));
  }

  function handleScroll() {
    body.classList.add('is-scrolling');
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(finishScrolling, 150);
    requestScrollFrame();
  }

  addEventListener('scroll', handleScroll, {passive: true});
  addEventListener('resize', () => {
    resizePending = true;
    requestScrollFrame();
  }, {passive: true});
  if ('onscrollend' in window) addEventListener('scrollend', finishScrolling, {passive: true});

  function commitChapter(chapter) {
    if (!chapter) return;
    activeChapter = chapter.id;
    chapters.forEach(item => {
      const active = item === chapter;
      item.dataset.motionActive = String(active);
    });
    body.dataset.motionChapter = activeChapter;
    document.dispatchEvent(new CustomEvent('celestialmotionchapter', {
      detail: {chapter: activeChapter}
    }));
  }

  function chooseChapter() {
    const visible = chapters
      .map(chapter => ({chapter, ratio: ratios.get(chapter) || 0}))
      .filter(item => item.ratio > 0)
      .sort((a, b) => b.ratio - a.ratio);
    if (visible[0]?.chapter.id !== activeChapter) commitChapter(visible[0]?.chapter);
  }

  chapters.forEach(chapter => {
    chapter.dataset.motionBudget = 'chapter';
    chapter.dataset.motionActive = 'false';
  });
  if (chapters[0]) commitChapter(chapters[0]);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
      chooseChapter();
    }, {
      threshold: [0, .08, .18, .35, .55, .75],
      rootMargin: '-10% 0px -28%'
    });
    chapters.forEach(chapter => observer.observe(chapter));
  } else {
    chapters.forEach(chapter => { chapter.dataset.motionActive = 'true'; });
  }

  function syncVisibility() {
    root.classList.toggle('motion-suspended', document.hidden);
  }

  document.addEventListener('visibilitychange', syncVisibility);
  reduced.addEventListener('change', event => root.classList.toggle('motion-reduced', event.matches));
  root.classList.toggle('motion-reduced', reduced.matches);
  root.classList.add('motion-budget-ready');
  syncVisibility();

  window.CelestialMotionBudget = Object.freeze({
    onScroll(callback, {immediate = true} = {}) {
      if (typeof callback !== 'function') return () => {};
      scrollSubscribers.add(callback);
      if (immediate) requestScrollFrame();
      return () => scrollSubscribers.delete(callback);
    },
    onResize(callback, {immediate = false} = {}) {
      if (typeof callback !== 'function') return () => {};
      resizeSubscribers.add(callback);
      if (immediate) {
        resizePending = true;
        requestScrollFrame();
      }
      return () => resizeSubscribers.delete(callback);
    },
    requestScrollFrame,
    snapshot: () => Object.freeze({
      activeChapter,
      reducedMotion: reduced.matches,
      suspended: document.hidden,
      scrolling: body.classList.contains('is-scrolling'),
      scrollSubscribers: scrollSubscribers.size,
      scrollY: scrollState.y,
      activeAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length
    })
  });
})();
