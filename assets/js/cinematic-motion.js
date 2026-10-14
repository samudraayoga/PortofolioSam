(() => {
  'use strict';
  if (!document.body.classList.contains('portfolio-page')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const motion = window.CelestialUI?.motion || {panel: 430, transition: 900, cinematic: 1400, staggerWide: 120};
  const motionBudget = window.CelestialMotionBudget;
  const body = document.body;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // A quiet, editorial reading indicator. It makes the long-form portfolio feel
  // intentional without competing with the scene-specific animations below.
  if (!reduced.matches) {
    const progress = document.createElement('div');
    progress.className = 'journey-progress-indicator';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<i></i>';
    body.prepend(progress);
  }

  const atmosphere = document.createElement('div');
  atmosphere.className = 'world-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  atmosphere.innerHTML = '<i class="world-glow"></i><i class="world-haze"></i><i class="world-stars"></i>';
  body.append(atmosphere);
  const progressFill = $('.journey-progress-indicator i');
  const worldGlow = $('.world-glow', atmosphere);
  const worldHaze = $('.world-haze', atmosphere);

  const vision = $('.vision');
  if (vision) {
    const awakening = document.createElement('span');
    awakening.className = 'hydro-awakening';
    awakening.setAttribute('aria-hidden', 'true');
    awakening.innerHTML = '<i></i><i></i><i></i><b></b><b></b><b></b>';
    vision.append(awakening);
  }

  // Character selection: the hero portrait becomes an interactive archive entry.
  const characterStage = $('.character-stage');
  const portraitCard = $('.portrait-card');
  const portraitImage = $('#portrait');
  if (characterStage && portraitCard && portraitImage) {
    const selection = document.createElement('div');
    selection.className = 'character-selection-ui';
    selection.innerHTML = `
      <div class="character-title-card" aria-hidden="true"><small>Hydro / System Weaver</small><strong>Samudra</strong><span>Character Selection</span></div>
      <div class="character-attribute-card" aria-hidden="true"><small>Element Profile</small><b>Hydro</b><span>Clarity · Adaptability</span></div>
      <div class="character-traits" aria-hidden="true"><span>Full-Stack</span><span>AI Engineering</span><span>System Design</span></div>
      <a class="character-constellation-link" href="#keahlian"><i aria-hidden="true">✦</i> Open Constellation <span aria-hidden="true">↓</span></a>`;
    characterStage.append(selection);

    const focus = value => characterStage.classList.toggle('character-selected', value);
    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.className = 'character-select-trigger';
    selectButton.setAttribute('aria-label', 'Focus Samudra character selection');
    portraitCard.append(selectButton);
    selectButton.addEventListener('click', () => {
      focus(true);
      characterStage.classList.add('character-select-flare');
      setTimeout(() => characterStage.classList.remove('character-select-flare'), motion.transition);
    });
    portraitCard.addEventListener('pointerenter', () => focus(true));
    portraitCard.addEventListener('pointerleave', () => focus(false));
    portraitCard.addEventListener('focusin', () => focus(true));
    portraitCard.addEventListener('focusout', event => {
      if (!portraitCard.contains(event.relatedTarget)) focus(false);
    });

    let outfitTimer;
    characterStage.addEventListener('portraitchange', event => {
      clearTimeout(outfitTimer);
      characterStage.dataset.outfit = event.detail?.outfit || 'formal';
      characterStage.classList.remove('outfit-shifting');
      if (event.detail?.automatic || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      void characterStage.offsetWidth;
      characterStage.classList.add('outfit-shifting');
      outfitTimer = setTimeout(() => characterStage.classList.remove('outfit-shifting'), motion.panel);
    });

    $('.character-constellation-link', selection)?.addEventListener('click', () => {
      characterStage.classList.add('constellation-departing');
      setTimeout(() => characterStage.classList.remove('constellation-departing'), motion.transition + 100);
    });
  }

  const chapterEffects = {
    profil: ['wind', 'Character Archive'],
    keahlian: ['stars', 'Celestial Constellation'],
    karya: ['domain', 'Domain of Creations'],
    perjalanan: ['leyline', 'Ley Line Journey'],
    kontak: ['wish', 'Final Wish']
  };
  Object.entries(chapterEffects).forEach(([id, [kind, label]]) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.dataset.cinematicChapter = kind;
    const signature = document.createElement('div');
    signature.className = `chapter-signature signature-${kind}`;
    signature.setAttribute('aria-hidden', 'true');
    signature.innerHTML = `<span>${label}</span><i></i><i></i><i></i>`;
    section.prepend(signature);
  });

  const journey = $('.journey-list');
  const journeyItems = journey ? $$('.journey-item', journey) : [];
  let journeyRoute = null;
  if (journey) {
    journey.classList.add('journey-ready');
    const route = document.createElement('span');
    route.className = 'journey-route';
    route.setAttribute('aria-hidden', 'true');
    journey.prepend(route);
    journeyRoute = route;
    const mapLabel = document.createElement('span');
    mapLabel.className = 'journey-map-label';
    mapLabel.setAttribute('aria-hidden', 'true');
    mapLabel.textContent = 'WAYPOINT ROUTE';
    journey.append(mapLabel);
    journeyItems.forEach((item, index) => {
      item.style.setProperty('--ley-index', index);
      item.style.setProperty('--ley-delay', `${index * motion.staggerWide}ms`);
      const waypoint = document.createElement('span');
      waypoint.className = 'journey-waypoint';
      waypoint.setAttribute('aria-hidden', 'true');
      waypoint.textContent = String(index + 1).padStart(2, '0');
      item.querySelector('.journey-node')?.append(waypoint);
    });
    const awakenJourney = () => {
      journey.classList.add('journey-awakened');
      journeyItems.forEach(item => item.classList.add('cinematic-seen'));
    };
    if (reduced.matches || !('IntersectionObserver' in window)) awakenJourney();
    else {
      const journeyObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        awakenJourney();
        journeyObserver.disconnect();
      }, {threshold:.16, rootMargin:'0px 0px -8%'});
      journeyObserver.observe(journey);
    }
  }

  const contact = $('#kontak');
  if (contact) {
    const finale = document.createElement('div');
    finale.className = 'wish-finale';
    finale.setAttribute('aria-hidden', 'true');
    finale.innerHTML = '<i class="wish-comet"></i><i></i><i></i><i></i><strong>✦</strong>';
    contact.prepend(finale);
    $('.copy-email', contact)?.addEventListener('click', () => {
      contact.classList.remove('wish-acquired');
      void contact.offsetWidth;
      contact.classList.add('wish-acquired');
      setTimeout(() => contact.classList.remove('wish-acquired'), motion.cinematic + motion.panel);
    });
  }

  const nav = $('.chapter-nav');
  if (nav) {
    const line = document.createElement('span');
    line.className = 'chapter-nav-line';
    line.setAttribute('aria-hidden', 'true');
    nav.prepend(line);
    const traveller = document.createElement('i');
    traveller.className = 'chapter-nav-traveller';
    traveller.setAttribute('aria-hidden', 'true');
    nav.append(traveller);
  }

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('cinematic-active', entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add('cinematic-seen');
  }), {threshold: .18, rootMargin: '-5% 0px -8%'});
  $$('[data-cinematic-chapter],.character-stage').forEach(element => revealObserver.observe(element));

  function layoutJourneyRoute() {
    if (!journey || !journeyRoute || !journeyItems.length) return;
    const listRect = journey.getBoundingClientRect();
    const nodePositions = journeyItems.map(item => {
      const nodeRect = $('.journey-node', item).getBoundingClientRect();
      return nodeRect.top + nodeRect.height / 2 - listRect.top;
    });
    const first = nodePositions[0];
    const last = nodePositions[nodePositions.length - 1];
    journeyRoute.style.top = `${first}px`;
    journeyRoute.style.bottom = `${Math.max(0, listRect.height - last)}px`;
  }

  const chapters = ['beranda', 'profil', 'keahlian', 'karya', 'perjalanan', 'kontak'];
  let chapterPositions = [];
  let maxScroll = 1;
  let metricsDirty = true;
  let fallbackScrollFrame = 0;

  function measureWorld() {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    chapterPositions = chapters.map(id => {
      const section = document.getElementById(id);
      return section ? [id, section.getBoundingClientRect().top + scrollY] : null;
    }).filter(Boolean);
    layoutJourneyRoute();
    metricsDirty = false;
  }

  function updateWorld(frameState) {
    fallbackScrollFrame = 0;
    if (metricsDirty) measureWorld();
    const y = frameState?.y ?? window.scrollY;
    const viewportHeight = frameState?.viewportHeight ?? window.innerHeight;
    const progress = Math.max(0, Math.min(1, y / maxScroll));
    if (progressFill) progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    if (worldGlow) worldGlow.style.transform = `translate3d(0,${(progress * -26).toFixed(2)}px,0)`;
    if (worldHaze) worldHaze.style.transform = `translate3d(0,${(progress * 34).toFixed(2)}px,0)`;
    if (nav) nav.style.setProperty('--chapter-progress', progress.toFixed(4));
    let current = 'beranda';
    const marker = y + viewportHeight * .54;
    chapterPositions.forEach(([id, top]) => { if (top < marker) current = id; });
    if (body.dataset.worldChapter !== current) body.dataset.worldChapter = current;
  }
  function requestWorldUpdate() {
    if (motionBudget) motionBudget.requestScrollFrame();
    else if (!fallbackScrollFrame) fallbackScrollFrame = requestAnimationFrame(updateWorld);
  }
  if (motionBudget) {
    motionBudget.onResize(() => { metricsDirty = true; });
    motionBudget.onScroll(updateWorld);
  } else {
    addEventListener('scroll', requestWorldUpdate, {passive: true});
    addEventListener('resize', () => { metricsDirty = true; requestWorldUpdate(); }, {passive: true});
  }
  if (journey && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      metricsDirty = true;
      requestWorldUpdate();
    }).observe(journey);
  }
  requestWorldUpdate();

  let pointerFrame = 0;
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let lastDropX = pointerX;
  let lastDropY = pointerY;
  const cursor = document.createElement('div');
  cursor.className = 'elemental-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<i></i>';
  if (finePointer.matches && !reduced.matches) body.append(cursor);

  function drop(x, y) {
    if (!finePointer.matches || reduced.matches || document.hidden || body.classList.contains('is-scrolling')) return;
    const particle = document.createElement('i');
    particle.className = 'hydro-cursor-drop';
    particle.style.cssText = `left:${x}px;top:${y}px;--drop-x:${(Math.random() - .5) * 22}px;--drop-y:${8 + Math.random() * 17}px`;
    body.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), {once: true});
  }
  addEventListener('pointermove', event => {
    if (document.hidden || body.classList.contains('is-scrolling')) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
      pointerFrame = 0;
    });
    if (Math.hypot(pointerX - lastDropX, pointerY - lastDropY) > 60) {
      drop(pointerX, pointerY);
      lastDropX = pointerX;
      lastDropY = pointerY;
    }
  }, {passive: true});
  addEventListener('pointerdown', event => {
    if (!finePointer.matches || reduced.matches || body.classList.contains('is-scrolling')) return;
    for (let index = 0; index < 6; index += 1) setTimeout(() => drop(event.clientX, event.clientY), index * 24);
  }, {passive: true});

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      cursor.remove();
      $$('.hydro-cursor-drop,.hydro-page-ripple').forEach(element => element.remove());
    } else if (finePointer.matches && !cursor.isConnected) body.append(cursor);
  });
})();
