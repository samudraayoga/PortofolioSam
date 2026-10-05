(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const ease = 'cubic-bezier(.2,.75,.2,1)';
  let firstVisit = true;

  try {
    firstVisit = sessionStorage.getItem('samudra-codex-opened') !== 'true';
    sessionStorage.setItem('samudra-codex-opened', 'true');
  } catch (_) { /* The full intro remains available when storage is blocked. */ }

  document.documentElement.classList.add('motion-ready');
  document.documentElement.classList.toggle('return-visit', !firstVisit);

  const portfolioPage = document.body.classList.contains('portfolio-page');
  const heroElement = $('.hero');
  const showGate = portfolioPage && firstVisit && !reduced.matches;
  const gateExitDuration = 1100;

  // Celestial Gate appears once per browsing session, with a direct skip control.
  if (showGate) {
    const intro = document.createElement('div');
    intro.className = 'celestial-gate';
    intro.style.setProperty('--gate-exit-duration', `${gateExitDuration}ms`);
    intro.setAttribute('aria-label', 'Opening Samudra’s portfolio');
    intro.innerHTML = '<div class="gate-sigil" aria-hidden="true"><i></i><i></i><i></i><span>✦</span></div><p class="gate-kicker">A DEVELOPER’S JOURNEY</p><strong>SAMUDRA</strong><button type="button">Skip intro</button>';
    document.body.prepend(intro);
    document.body.classList.add('codex-intro-running');
    let introTimer;
    let cleanupTimer;
    const removeIntro = () => {
      clearTimeout(introTimer);
      clearTimeout(cleanupTimer);
      intro.remove();
      document.body.classList.remove('codex-intro-running');
      reduced.removeEventListener('change', skipIntro);
    };
    const skipIntro = () => {
      if (!intro.classList.contains('intro-leaving')) startOpeningSequence(true);
      removeIntro();
    };
    const dismissIntro = () => {
      if (intro.classList.contains('intro-leaving')) return;
      clearTimeout(introTimer);
      // Let the outer ring pass the viewport edges on both phones and desktops.
      const sigil = $('.gate-sigil', intro).getBoundingClientRect();
      const centerX = sigil.left + sigil.width / 2;
      const centerY = sigil.top + sigil.height / 2;
      const radius = Math.hypot(Math.max(centerX, innerWidth - centerX), Math.max(centerY, innerHeight - centerY));
      intro.style.setProperty('--gate-zoom-scale', String(Math.max(5, radius * 2.2 / sigil.width)));
      intro.classList.add('intro-leaving');
      startOpeningSequence();
      cleanupTimer = setTimeout(removeIntro, gateExitDuration + 100);
    };
    intro.addEventListener('animationend', event => {
      if (event.target === intro && event.animationName === 'gate-departure') removeIntro();
    });
    $('button', intro).addEventListener('click', skipIntro);
    reduced.addEventListener('change', skipIntro);
    introTimer = setTimeout(dismissIntro, 1750);
  }

  // Duplicate scenic crops provide independent sky and foreground movement.
  if (portfolioPage && heroElement) {
    ['scene-sky', 'scene-foreground'].forEach(className => {
      const layer = document.createElement('div');
      layer.className = `scene-depth ${className}`;
      layer.setAttribute('aria-hidden', 'true');
      heroElement.prepend(layer);
    });
  }

  // Chapter navigator mirrors the structure of an official character microsite.
  if (portfolioPage) {
    const chapterNav = document.createElement('nav');
    chapterNav.className = 'chapter-nav';
    chapterNav.setAttribute('aria-label', 'Journey chapters');
    chapterNav.innerHTML = '<a href="#profil" data-chapter="profil"><span>Character</span></a><a href="#keahlian" data-chapter="keahlian"><span>Constellation</span></a><a href="#karya" data-chapter="karya"><span>Creations</span></a><a href="#perjalanan" data-chapter="perjalanan"><span>Journey</span></a><a href="#kontak" data-chapter="kontak"><span>Contact</span></a>';
    document.body.append(chapterNav);
    const chapterLinks = $$('a', chapterNav);
    const chapterObserver = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio).slice(0, 1).forEach(entry => {
        chapterLinks.forEach(link => link.classList.toggle('active', link.dataset.chapter === entry.target.id));
      });
    }, {threshold: [.2, .45, .7], rootMargin: '-20% 0px -35%'});
    chapterLinks.forEach(link => {
      const section = document.getElementById(link.dataset.chapter);
      if (section) chapterObserver.observe(section);
    });
  }

  // Optional synthesized ambience; it never starts without a user gesture.
  const headerActions = $('.header-actions');
  if (portfolioPage && headerActions) {
    const soundButton = document.createElement('button');
    soundButton.type = 'button';
    soundButton.className = 'sound-toggle';
    soundButton.setAttribute('aria-label', 'Enable ambient sound');
    soundButton.setAttribute('aria-pressed', 'false');
    soundButton.innerHTML = '<span aria-hidden="true">♪</span>';
    headerActions.prepend(soundButton);
    let audioContext, ambienceGain;
    soundButton.addEventListener('click', () => {
      const enabled = soundButton.getAttribute('aria-pressed') !== 'true';
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        ambienceGain = audioContext.createGain();
        ambienceGain.gain.value = 0;
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        oscillator.type = 'sine';
        oscillator.frequency.value = 86;
        filter.type = 'lowpass';
        filter.frequency.value = 240;
        oscillator.connect(filter).connect(ambienceGain).connect(audioContext.destination);
        oscillator.start();
      }
      audioContext.resume();
      ambienceGain.gain.cancelScheduledValues(audioContext.currentTime);
      ambienceGain.gain.linearRampToValueAtTime(enabled ? .018 : 0, audioContext.currentTime + .45);
      soundButton.setAttribute('aria-pressed', String(enabled));
      soundButton.setAttribute('aria-label', enabled ? 'Disable ambient sound' : 'Enable ambient sound');
    });
  }
  function animate(element, frames, options = {}) {
    if (!element || reduced.matches) return null;
    return element.animate(frames, {duration: 520, easing: ease, fill: 'both', ...options});
  }
  function reveal(element, index = 0) {
    if (!element || element.classList.contains('motion-seen')) return;
    element.classList.add('motion-seen');
    if (document.documentElement.classList.contains('portal-transitioning')) return;
    animate(element, [
      {opacity: 0, transform: 'translateY(22px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 620, delay: Math.min(index * 70, 280)});
  }

  // Opening sequence: the first visit opens the codex; return visits stay brief.
  function startOpeningSequence(skipped = false) {
    if (reduced.matches || scrollY >= 80) return;
    const introFactor = firstVisit ? 1 : .55;
    const introDelay = showGate && !skipped ? gateExitDuration * .35 : 0;
    animate($('.landscape'), [
      {opacity: .45, transform: 'scale(1.075)'},
      {opacity: 1, transform: 'scale(1.025)'}
    ], {duration: 1200 * introFactor, delay: introDelay, easing: 'cubic-bezier(.16,.72,.2,1)'});
    $$('.orbit').forEach((element, index) => animate(element, [
      {opacity: 0, scale: .86},
      {opacity: 1, scale: 1}
    ], {duration: 850 * introFactor, delay: introDelay + (firstVisit ? 180 + index * 100 : index * 45)}));
    animate($('.portrait-card'), [
      {opacity: 0, transform: 'translateY(28px) scale(.94)'},
      {opacity: 1, transform: 'translateY(0) scale(1)'}
    ], {duration: 780 * introFactor, delay: introDelay + (firstVisit ? 300 : 80)});
    $$('.hero-copy > *').forEach((element, index) => animate(element, [
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 600 * introFactor, delay: introDelay + (firstVisit ? 260 : 70) + Math.min(index * (firstVisit ? 80 : 35), firstVisit ? 400 : 175)}));
    $$('.case-hero :is(.case-eyebrow,.case-product,h1,.case-lead,.case-hero-actions,.case-summary,.case-hero-foot)').forEach((element, index) => animate(element, [
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 600, delay: 90 + index * 75}));
  }
  if (!showGate) startOpeningSequence();

  // Each chapter reveals once. Siblings receive a restrained stagger.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const groups = [
      '.about > *', '.section-heading > *', '.talent-grid > *', '.works-grid > *',
      '.journey-list > *', '.case-section-heading > *', '.case-story > *',
      '.case-gallery', '.case-features > *', '.case-stack > *', '.mlbb-gallery > *',
      '.case-closing > .case-container > *', '.about-tags .tag', '.signature',
      '.contact > :not(.contact-star)'
    ];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement ? [...entry.target.parentElement.children] : [];
        reveal(entry.target, Math.max(0, siblings.indexOf(entry.target)));
        observer.unobserve(entry.target);
      });
    }, {threshold: .1, rootMargin: '0px 0px -5%'});
    groups.flatMap(selector => $$(selector)).forEach(element => observer.observe(element));
  }

  // Desktop parallax stays intentionally shallow so the copy remains stable.
  const hero = $('.hero');
  const landscape = $('.landscape');
  const sceneSky = $('.scene-sky');
  const sceneForeground = $('.scene-foreground');
  const portraitCard = $('.portrait-card');
  const vision = $('.vision');
  let parallaxFrame = 0;
  function resetParallax() {
    cancelAnimationFrame(parallaxFrame);
    parallaxFrame = 0;
    if (landscape) landscape.style.transform = '';
    if (sceneSky) sceneSky.style.translate = '';
    if (sceneForeground) sceneForeground.style.translate = '';
    if (portraitCard) portraitCard.style.translate = '';
    if (vision) vision.style.translate = '';
  }
  hero?.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || !landscape) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 12 - 6;
    const y = (event.clientY - bounds.top) / bounds.height * 10 - 5;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(() => {
      landscape.style.transform = `translate(${x}px, ${y}px) scale(1.035)`;
      if (sceneSky) sceneSky.style.translate = `${x * .2}px ${y * .15}px`;
      if (sceneForeground) sceneForeground.style.translate = `${x * 1.15}px ${y * .75}px`;
      if (portraitCard) portraitCard.style.translate = `${x * -.32}px ${y * -.28}px`;
      if (vision) vision.style.translate = `${x * -.75}px ${y * -.65}px`;
      parallaxFrame = 0;
    });
  });
  hero?.addEventListener('pointerleave', resetParallax);

  // A single travelling star connects the active navigation chapter.
  const nav = $('.desktop-nav');
  if (nav) {
    const marker = document.createElement('span');
    marker.className = 'nav-guide';
    marker.setAttribute('aria-hidden', 'true');
    nav.append(marker);
    const placeMarker = () => {
      const active = $('.active', nav);
      if (!active) return;
      marker.style.setProperty('--guide-x', `${active.offsetLeft + active.offsetWidth / 2}px`);
      marker.style.opacity = '1';
    };
    new MutationObserver(placeMarker).observe(nav, {attributes: true, subtree: true, attributeFilter: ['class']});
    addEventListener('resize', placeMarker, {passive: true});
    requestAnimationFrame(placeMarker);
  }

  // Skill changes travel horizontally, like selecting a constellation node.
  const skillTabs = $$('[data-skill]');
  const skillPanel = $('#skill-items');
  let previousSkill = Math.max(0, skillTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
  if (skillPanel) new MutationObserver(() => {
    const current = Math.max(0, skillTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
    const direction = current >= previousSkill ? 1 : -1;
    previousSkill = current;
    skillPanel.getAnimations().forEach(animation => animation.cancel());
    animate(skillPanel, [
      {opacity: 0, transform: `translateX(${direction * 14}px)`},
      {opacity: 1, transform: 'translateX(0)'}
    ], {duration: 320});
  }).observe(skillPanel, {childList: true});

  // Character Archive keeps long-form profile material inside one focused panel.
  const archiveTabs = $$('.archive-tabs [role="tab"]');
  function selectArchive(tab, focus = false) {
    archiveTabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    animate(panel, [
      {opacity: 0, transform: 'translateX(18px)'},
      {opacity: 1, transform: 'translateX(0)'}
    ], {duration: 360});
    if (focus) tab.focus();
  }
  archiveTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectArchive(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % archiveTabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + archiveTabs.length) % archiveTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = archiveTabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectArchive(archiveTabs[next], true); }
    });
  });

  // Each creation becomes a numbered domain chapter instead of a small grid tile.
  $$('.work-card').forEach((card, index) => {
    card.style.setProperty('--chapter-index', index + 1);
    const number = document.createElement('span');
    number.className = 'work-chapter-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    card.append(number);
  });

  // Pointer light follows interactive archive panels.
  $$('.work-card, .talent-card, .case-features article').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      if (card.matches('.work-card')) {
        card.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - .5) * -2.2}deg`);
        card.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - .5) * 2.2}deg`);
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });

  // The final chapter gathers a few stars back toward the contact symbol.
  const contact = $('.contact');
  if (contact) {
    [[-42,-26],[38,-32],[-48,12],[44,18],[-24,38],[27,42]].forEach(([x, y], index) => {
      const star = document.createElement('span');
      star.className = 'contact-star';
      star.setAttribute('aria-hidden', 'true');
      star.style.setProperty('--star-x', `${x}vw`);
      star.style.setProperty('--star-y', `${y}vh`);
      star.style.setProperty('--star-delay', `${index * 80}ms`);
      contact.append(star);
    });
    if ('IntersectionObserver' in window) {
      const contactObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          contact.classList.add('contact-awake');
          contactObserver.disconnect();
        }
      }, {threshold: .35});
      contactObserver.observe(contact);
    }
  }

  // Timeline light fills according to reading progress.
  const journey = $('.journey-list');
  let scrollFrame = 0;
  function updateJourney() {
    if (!journey) return;
    const rect = journey.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .68 - rect.top) / Math.max(rect.height, 1)));
    journey.style.setProperty('--journey-progress', progress.toFixed(3));
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => {
      updateJourney();
      scrollFrame = 0;
    });
  }, {passive: true});
  updateJourney();

  // Keep the previous portrait visible until the new image has loaded.
  const portrait = $('#portrait');
  let portraitOverlay;
  $$('[data-portrait]').forEach(button => button.addEventListener('click', () => {
    if (reduced.matches || button.getAttribute('aria-pressed') === 'true' || !portrait) return;
    portraitOverlay?.remove();
    const old = portrait.cloneNode(false);
    old.removeAttribute('id');
    old.alt = '';
    old.setAttribute('aria-hidden', 'true');
    old.classList.add('portrait-crossfade');
    portrait.parentElement.append(old);
    portraitOverlay = old;
    const fade = () => {
      if (portraitOverlay !== old) return;
      const effect = animate(old, [{opacity: 1}, {opacity: 0}], {duration: 360});
      effect?.finished.finally(() => old.remove());
    };
    portrait.addEventListener('load', fade, {once: true});
    portrait.addEventListener('error', () => old.remove(), {once: true});
    setTimeout(() => { if (portrait.complete) fade(); }, 0);
  }, {capture: true}));

  // Dialog motion starts from the control that opened it.
  function setDialogOrigin(trigger, dialog) {
    if (!trigger || !dialog) return;
    const rect = trigger.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, (rect.left + rect.width / 2) / innerWidth * 100));
    const y = Math.max(0, Math.min(100, (rect.top + rect.height / 2) / innerHeight * 100));
    dialog.style.transformOrigin = `${x}% ${y}%`;
  }
  $$('[data-open-profile]').forEach(trigger => trigger.addEventListener('click', event => setDialogOrigin(event.currentTarget, $('#profile-dialog')), {capture: true}));
  $$('[data-project]').forEach(trigger => trigger.addEventListener('click', () => setDialogOrigin(trigger, $('#project-dialog')), {capture: true}));

  // Native dialogs get an exit motion before they close.
  function closeDialog(dialog) {
    if (!dialog?.open || reduced.matches || dialog.dataset.closing === 'true') {
      dialog?.close();
      return;
    }
    dialog.dataset.closing = 'true';
    const effect = animate(dialog, [
      {opacity: 1, transform: 'scale(1) translateY(0)'},
      {opacity: 0, transform: 'scale(.975) translateY(10px)'}
    ], {duration: 190, easing: 'ease-in'});
    effect?.finished.finally(() => {
      delete dialog.dataset.closing;
      dialog.close();
    });
  }
  $$('dialog').forEach(dialog => {
    if ((dialog.id === 'profile-dialog' && window.SamudraCharacterReveal) || (dialog.id === 'project-dialog' && window.SamudraProjectPortal)) return;
    $('.dialog-close', dialog)?.addEventListener('click', event => {
      if (reduced.matches) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog(dialog);
    }, {capture: true});
    dialog.addEventListener('cancel', event => {
      if (reduced.matches) return;
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', event => {
      if (reduced.matches || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (!outside) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog(dialog);
    }, {capture: true});
  });

  // Replays the conceptual ERP to OpenClaw flow.
  const flowButton = $('[data-replay-flow]');
  const flowFigure = $('.project-illustration');
  const flowCanvas = flowFigure?.querySelector('a');
  if (flowCanvas) {
    [[18,47],[50,47],[82,47],[50,82]].forEach(([x, y], index) => {
      const pulse = document.createElement('span');
      pulse.className = 'flow-pulse';
      pulse.setAttribute('aria-hidden', 'true');
      pulse.style.setProperty('--pulse-x', `${x}%`);
      pulse.style.setProperty('--pulse-y', `${y}%`);
      pulse.style.setProperty('--pulse-delay', `${420 + index * 310}ms`);
      flowCanvas.append(pulse);
    });
  }
  function playFlow() {
    if (!flowFigure || reduced.matches) return;
    flowFigure.classList.remove('flow-playing');
    void flowFigure.offsetWidth;
    flowFigure.classList.add('flow-playing');
    const dialogInner = flowFigure.closest('.dialog-inner');
    $$('.project-points li', dialogInner).forEach((item, index) => {
      item.getAnimations().forEach(animation => animation.cancel());
      animate(item, [
        {color: 'inherit', transform: 'translateX(0)'},
        {color: '#9a7437', transform: 'translateX(5px)', offset: .45},
        {color: 'inherit', transform: 'translateX(0)'}
      ], {duration: 720, delay: 420 + index * 310});
    });
  }
  flowButton?.addEventListener('click', playFlow);
  $('[data-project="ai"]')?.addEventListener('click', () => requestAnimationFrame(playFlow));

  // A short wash ties the day/night palette change together.
  $('.theme-toggle')?.addEventListener('click', () => {
    if (reduced.matches || window.SamudraCelestialTheme) return;
    const wash = document.createElement('span');
    wash.className = 'theme-wash';
    wash.setAttribute('aria-hidden', 'true');
    document.body.append(wash);
    const effect = animate(wash, [
      {opacity: 0, transform: 'scale(.2)'},
      {opacity: .16, transform: 'scale(1.2)', offset: .5},
      {opacity: 0, transform: 'scale(1.7)'}
    ], {duration: 650});
    effect?.finished.finally(() => wash.remove());
  });

  // Project chapters close like a codex page before same-origin navigation.
  $$('.work-card a[href], .case-back[href], .case-brand[href], .case-footer a[href]').forEach(link => {
    link.addEventListener('click', event => {
      if (link.dataset.projectPortal === 'true' || reduced.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      const destination = new URL(link.href, location.href);
      if (destination.origin !== location.origin) return;
      event.preventDefault();
      document.documentElement.classList.add('page-leaving');
      setTimeout(() => { location.href = destination.href; }, 220);
    });
  });

  window.addEventListener('pageshow', () => document.documentElement.classList.remove('page-leaving'));
  finePointer.addEventListener('change', resetParallax);
  reduced.addEventListener('change', () => {
    resetParallax();
    if (reduced.matches) document.getAnimations().forEach(animation => {
      if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
      else animation.cancel();
    });
  });
})();
