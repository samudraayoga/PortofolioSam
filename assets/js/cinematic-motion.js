(() => {
  'use strict';
  if (!document.body.classList.contains('portfolio-page')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const root = document.documentElement;
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
      setTimeout(() => characterStage.classList.remove('character-select-flare'), 900);
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
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      void characterStage.offsetWidth;
      characterStage.classList.add('outfit-shifting');
      outfitTimer = setTimeout(() => characterStage.classList.remove('outfit-shifting'), 450);
    });

    $('.character-constellation-link', selection)?.addEventListener('click', () => {
      characterStage.classList.add('constellation-departing');
      setTimeout(() => characterStage.classList.remove('constellation-departing'), 1000);
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

  $$('.work-card').forEach((card, index) => {
    const art = $('.work-art', card);
    if (art) {
      const gate = document.createElement('span');
      gate.className = 'domain-gate';
      gate.setAttribute('aria-hidden', 'true');
      gate.innerHTML = '<i></i><i></i><i></i>';
      art.append(gate);
      const flow = document.createElement('span');
      flow.className = 'project-data-flow';
      flow.setAttribute('aria-hidden', 'true');
      flow.innerHTML = '<i></i><i></i><i></i><i></i>';
      art.append(flow);
    }
    card.style.setProperty('--domain-delay', `${index * 90}ms`);
    $$('.work-tech span', card).forEach((tech, techIndex) => {
      tech.addEventListener('pointerenter', () => card.dataset.techFocus = String(techIndex + 1));
      tech.addEventListener('pointerleave', () => delete card.dataset.techFocus);
    });
    // Keep the illumination inside the artwork, so it reads as a gallery light
    // rather than a novelty cursor effect.
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
    });
    card.addEventListener('pointerleave', () => card.classList.remove('project-spotlit'));
    card.addEventListener('pointerenter', () => card.classList.add('project-spotlit'));
  });

  const journey = $('.journey-list');
  if (journey) {
    const route = document.createElement('span');
    route.className = 'journey-route';
    route.setAttribute('aria-hidden', 'true');
    journey.prepend(route);
    const mote = document.createElement('span');
    mote.className = 'ley-line-mote';
    mote.setAttribute('aria-hidden', 'true');
    journey.append(mote);
    const mapLabel = document.createElement('span');
    mapLabel.className = 'journey-map-label';
    mapLabel.setAttribute('aria-hidden', 'true');
    mapLabel.textContent = 'WAYPOINT ROUTE';
    journey.append(mapLabel);
    $$('.journey-item', journey).forEach((item, index) => {
      item.style.setProperty('--ley-index', index);
      const waypoint = document.createElement('span');
      waypoint.className = 'journey-waypoint';
      waypoint.setAttribute('aria-hidden', 'true');
      waypoint.textContent = String(index + 1).padStart(2, '0');
      item.querySelector('.journey-node')?.append(waypoint);
    });
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
      setTimeout(() => contact.classList.remove('wish-acquired'), 1800);
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
  $$('[data-cinematic-chapter],.work-card,.journey-item,.character-stage').forEach(element => revealObserver.observe(element));

  let scrollFrame = 0;
  function updateWorld() {
    scrollFrame = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / max));
    root.style.setProperty('--world-progress', progress.toFixed(4));
    root.style.setProperty('--world-pan', `${(progress * -34).toFixed(2)}px`);
    if (nav) nav.style.setProperty('--chapter-progress', progress.toFixed(4));
    if (journey) {
      const rect = journey.getBoundingClientRect();
      const span = Math.max(1, rect.height - innerHeight * .42);
      const journeyProgress = Math.max(0, Math.min(1, (innerHeight * .7 - rect.top) / span));
      journey.style.setProperty('--journey-progress', journeyProgress.toFixed(4));
    }
    const chapters = ['beranda', 'profil', 'keahlian', 'karya', 'perjalanan', 'kontak'];
    let current = 'beranda';
    chapters.forEach(id => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top < innerHeight * .54) current = id;
    });
    body.dataset.worldChapter = current;
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateWorld);
  }, {passive: true});
  updateWorld();

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
    if (!finePointer.matches || reduced.matches) return;
    const particle = document.createElement('i');
    particle.className = 'hydro-cursor-drop';
    particle.style.cssText = `left:${x}px;top:${y}px;--drop-x:${(Math.random() - .5) * 22}px;--drop-y:${8 + Math.random() * 17}px`;
    body.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), {once: true});
  }
  addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      root.style.setProperty('--light-x', `${pointerX}px`);
      root.style.setProperty('--light-y', `${pointerY}px`);
      cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
      pointerFrame = 0;
    });
    if (Math.hypot(pointerX - lastDropX, pointerY - lastDropY) > 34) {
      drop(pointerX, pointerY);
      lastDropX = pointerX;
      lastDropY = pointerY;
    }
  }, {passive: true});
  addEventListener('pointerdown', event => {
    if (!finePointer.matches || reduced.matches) return;
    for (let index = 0; index < 6; index += 1) setTimeout(() => drop(event.clientX, event.clientY), index * 24);
  }, {passive: true});

  $$('.work-link[href]').forEach(link => link.addEventListener('pointerdown', event => {
    if (reduced.matches) return;
    const ripple = document.createElement('span');
    ripple.className = 'hydro-page-ripple';
    ripple.style.cssText = `left:${event.clientX}px;top:${event.clientY}px`;
    body.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
  }));

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      cursor.remove();
      $$('.hydro-cursor-drop,.hydro-page-ripple').forEach(element => element.remove());
    } else if (finePointer.matches && !cursor.isConnected) body.append(cursor);
  });
})();
