(() => {
  'use strict';

  if (!document.body.classList.contains('portfolio-page')) return;

  const chapters = new Set(['beranda', 'profil', 'keahlian', 'karya', 'perjalanan', 'kontak']);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 800px)');
  const atmosphere = document.querySelector('.world-atmosphere');
  const weather = atmosphere && document.createElement('span');

  // Two composited surfaces let the scene change without animating a gradient
  // or adding more work to the scroll frame.
  if (weather) {
    weather.className = 'chapter-weather';
    weather.setAttribute('aria-hidden', 'true');
    weather.innerHTML = '<i class="chapter-weather-layer is-current"></i><i class="chapter-weather-layer"></i>';
    atmosphere.append(weather);
  }

  const weatherLayers = weather ? [...weather.children] : [];
  let weatherIndex = 0;
  let weatherFrame = 0;
  let currentChapter = document.body.dataset.motionChapter || 'beranda';
  if (weatherLayers[0]) weatherLayers[0].dataset.chapter = currentChapter;

  function changeWeather(chapter) {
    if (!chapters.has(chapter) || chapter === currentChapter) return;
    currentChapter = chapter;
    if (!weatherLayers.length) return;
    cancelAnimationFrame(weatherFrame);
    const nextIndex = 1 - weatherIndex;
    const next = weatherLayers[nextIndex];
    next.dataset.chapter = chapter;
    next.classList.remove('is-current');
    // Let the initial state paint without forcing layout in the scroll frame.
    weatherFrame = requestAnimationFrame(() => {
      next.classList.add('is-current');
      weatherLayers[weatherIndex].classList.remove('is-current');
      weatherIndex = nextIndex;
      weatherFrame = 0;
    });
  }

  document.addEventListener('celestialmotionchapter', event => {
    const chapter = event.detail?.chapter;
    changeWeather(chapter);
    if (pendingChapter === chapter) arrive(chapter);
  });

  const handoff = document.createElement('div');
  handoff.className = 'chapter-handoff';
  handoff.setAttribute('aria-hidden', 'true');
  handoff.innerHTML = `
    <svg class="chapter-handoff-route" aria-hidden="true" preserveAspectRatio="none">
      <defs><linearGradient id="chapter-handoff-light" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#93dce5" stop-opacity=".1"/>
        <stop offset=".6" stop-color="#f1dda5"/>
        <stop offset="1" stop-color="#fff5c7" stop-opacity=".35"/>
      </linearGradient></defs>
      <path/>
    </svg>
    <i class="chapter-handoff-star"></i>`;
  document.body.append(handoff);

  const svg = handoff.querySelector('svg');
  const route = svg.querySelector('path');
  const star = handoff.querySelector('.chapter-handoff-star');
  let travelAnimation;
  let routeAnimation;
  let fadeTimer = 0;
  let travelTargetTimer = 0;
  let pendingChapter = '';
  let pendingUntil = 0;

  function arrive(chapter) {
    if (chapter !== pendingChapter || performance.now() > pendingUntil) return;
    pendingChapter = '';
    clearTimeout(travelTargetTimer);
    delete document.body.dataset.chapterTravelTarget;
    const section = document.getElementById(chapter);
    if (!section) return;
    const heading = section.querySelector('h1, h2');
    const bounds = heading?.getBoundingClientRect();
    if (!bounds || bounds.top < -40 || bounds.top > innerHeight + 40) return;
    const burst = document.createElement('i');
    burst.className = 'chapter-handoff-burst';
    burst.style.left = `${Math.max(22, Math.min(innerWidth - 22, bounds.left - 16))}px`;
    burst.style.top = `${Math.max(22, Math.min(innerHeight - 22, bounds.top + bounds.height / 2))}px`;
    document.body.append(burst);
    burst.addEventListener('animationend', () => burst.remove(), {once: true});
  }

  function playHandoff(source, chapter) {
    travelAnimation?.cancel();
    routeAnimation?.cancel();
    clearTimeout(fadeTimer);

    const bounds = source.getBoundingClientRect();
    const target = document.getElementById(chapter);
    const targetBounds = target.getBoundingClientRect();
    const downward = targetBounds.top > bounds.top;
    const width = innerWidth;
    const height = innerHeight;
    const startX = Math.max(18, Math.min(width - 18, bounds.left + bounds.width / 2));
    const startY = Math.max(18, Math.min(height - 18, bounds.top + bounds.height / 2));
    const endX = width * (compact.matches ? .5 : .48);
    const endY = height * (downward ? .72 : .28);
    const bendX = (startX + endX) / 2 + (startX > endX ? -42 : 42);
    const bendY = (startY + endY) / 2 + (downward ? -85 : 85);

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    route.setAttribute('d', `M ${startX} ${startY} Q ${bendX} ${bendY} ${endX} ${endY}`);
    const length = route.getTotalLength();
    route.style.strokeDasharray = String(length);
    route.style.strokeDashoffset = String(length);
    handoff.classList.add('is-travelling');

    const duration = compact.matches ? 430 : 650;
    if (typeof star.animate === 'function') {
      // Sample a short curve once; the browser composites the star's transform
      // while the page scrolls instead of running path geometry every frame.
      const keyframes = Array.from({length: 13}, (_, index) => {
        const t = index / 12;
        const eased = 1 - (1 - t) ** 3;
        const point = route.getPointAtLength(length * eased);
        return {offset: t, transform: `translate3d(${point.x}px,${point.y}px,0) rotate(45deg)`};
      });
      star.style.transform = keyframes[keyframes.length - 1].transform;
      travelAnimation = star.animate(keyframes, {duration, easing: 'linear', fill: 'forwards'});
      if (!compact.matches) {
        routeAnimation = route.animate([
          {strokeDashoffset: length},
          {strokeDashoffset: 0}
        ], {duration, easing: 'cubic-bezier(.22,.7,.18,1)', fill: 'forwards'});
      }
      const animation = travelAnimation;
      animation.finished.then(() => {
        if (animation === travelAnimation) fadeTimer = setTimeout(() => handoff.classList.remove('is-travelling'), 130);
      }, () => {});
    } else {
      star.style.transform = `translate3d(${endX}px,${endY}px,0) rotate(45deg)`;
      route.style.strokeDashoffset = '0';
      fadeTimer = setTimeout(() => handoff.classList.remove('is-travelling'), duration);
    }
    pendingChapter = chapter;
    pendingUntil = performance.now() + 1800;
    document.body.dataset.chapterTravelTarget = chapter;
    clearTimeout(travelTargetTimer);
    travelTargetTimer = setTimeout(() => {
      if (document.body.dataset.chapterTravelTarget === chapter) delete document.body.dataset.chapterTravelTarget;
    }, 1900);
  }

  document.addEventListener('click', event => {
    if (reduced.matches || document.hidden || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.matches('.skip-link') || link.hasAttribute('download')) return;
    const chapter = decodeURIComponent(link.hash.slice(1));
    if (!chapters.has(chapter) || !document.getElementById(chapter)) return;
    playHandoff(link, chapter);
  }, {capture: true});

  document.addEventListener('celestialscrollsettled', () => {
    if (document.body.dataset.motionChapter === pendingChapter) arrive(pendingChapter);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    travelAnimation?.cancel();
    routeAnimation?.cancel();
    clearTimeout(fadeTimer);
    clearTimeout(travelTargetTimer);
    handoff.classList.remove('is-travelling');
    pendingChapter = '';
    delete document.body.dataset.chapterTravelTarget;
  });
})();
