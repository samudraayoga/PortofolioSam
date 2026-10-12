(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const body = document.body;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const ease = 'cubic-bezier(.2,.75,.2,1)';

  root.classList.add('unified-motion-ready');

  function buildArchiveController({buttonSelector, panelSelector, activeClass, onSelect, transition = 'archive', hostSelector}) {
    const buttons = $$(buttonSelector);
    const panels = $$(panelSelector);
    if (!buttons.length || !panels.length) return null;

    let current = Math.max(0, buttons.findIndex(button => button.getAttribute('aria-selected') === 'true'));
    let transitionToken = 0;
    let hostTimer = 0;
    const host = $(hostSelector) || panels[0].parentElement;

    if (host && !$('.archive-motion-trace', host)) {
      const trace = document.createElement('span');
      trace.className = 'archive-motion-trace';
      trace.setAttribute('aria-hidden', 'true');
      host.append(trace);
    }

    function stopPanelAnimation(panel) {
      panel.getAnimations({subtree: true}).filter(animation => animation.id?.startsWith('archive-')).forEach(animation => animation.cancel());
      panel.classList.remove('panel-entering');
    }

    function triggerHostMotion(index, direction) {
      if (!host || reduced.matches) return;
      clearTimeout(hostTimer);
      host.style.setProperty('--motion-direction', String(direction));
      host.style.setProperty('--motion-index', String(index));
      host.classList.remove(`${transition}-switching`);
      void host.offsetWidth;
      host.classList.add(`${transition}-switching`);
      hostTimer = setTimeout(() => host.classList.remove(`${transition}-switching`), transition === 'project' ? 920 : 780);
    }

    function playIncoming(panel, direction) {
      if (reduced.matches || !panel.animate) return;
      const project = transition === 'project';
      const offset = direction * (project ? 22 : 12);
      const frames = project ? [
        {opacity: 0, clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', transform: `translateX(${offset}px) scale(.992)`, filter: 'brightness(1.35) saturate(.72)'},
        {opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateX(0) scale(1)', filter: 'brightness(1) saturate(1)'}
      ] : [
        {opacity: 0, transform: `translateX(${offset}px)`, filter: 'brightness(1.45) blur(2px)'},
        {opacity: 1, transform: 'translateX(0)', filter: 'brightness(1) blur(0)'}
      ];
      panel.animate(frames, {id: 'archive-panel-transition', duration: project ? 540 : 430, easing: ease});
      panel.classList.remove('panel-entering');
      void panel.offsetWidth;
      panel.classList.add('panel-entering');
      setTimeout(() => panel.classList.remove('panel-entering'), project ? 920 : 760);
    }

    function finishSelection(index, focus = false, animated = true) {
      const nextButton = buttons[index];
      const nextPanel = document.getElementById(nextButton.getAttribute('aria-controls'));
      const oldPanel = panels[current];
      if (!nextPanel) return;
      const direction = index >= current ? 1 : -1;

      const token = ++transitionToken;
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => panel.classList.toggle(activeClass, panel === nextPanel));
      onSelect?.(index, nextButton, nextPanel);
      if (animated || focus) {
        nextButton.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth'});
      }
      if (focus) nextButton.focus({preventScroll: true});

      if (oldPanel === nextPanel) {
        nextPanel.hidden = false;
        current = index;
        return;
      }

      if (animated) triggerHostMotion(index, direction);

      const oldToggle = $('.journey-toggle[aria-expanded="true"]', oldPanel);
      if (oldToggle) {
        oldToggle.setAttribute('aria-expanded', 'false');
        oldPanel.classList.remove('journey-expanded');
        const detail = document.getElementById(oldToggle.getAttribute('aria-controls'));
        if (detail) detail.hidden = true;
      }

      stopPanelAnimation(oldPanel);
      stopPanelAnimation(nextPanel);
      const reveal = () => {
        if (token !== transitionToken) return;
        oldPanel.hidden = true;
        nextPanel.hidden = false;
        current = index;
        if (animated) playIncoming(nextPanel, direction);
      };

      if (!animated || reduced.matches || !oldPanel.animate) {
        reveal();
        return;
      }
      const outgoing = oldPanel.animate(transition === 'project' ? [
        {opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateX(0)'},
        {opacity: 0, clipPath: direction > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', transform: `translateX(${-direction * 10}px)`}
      ] : [
        {opacity: 1, transform: 'translateX(0)', filter: 'brightness(1)'},
        {opacity: 0, transform: `translateX(${-direction * 8}px)`, filter: 'brightness(1.25)'}
      ], {id: 'archive-panel-transition', duration: transition === 'project' ? 220 : 170, easing: 'ease-out'});
      outgoing.finished.then(reveal, reveal);
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => finishSelection(index));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        finishSelection(next, true);
      });
    });

    finishSelection(current, false, false);
    return {select: (index, focus = false) => finishSelection(index, focus)};
  }

  const projectController = buildArchiveController({
    buttonSelector: '[data-archive-project]',
    panelSelector: '.project-archive .work-card',
    activeClass: 'is-active',
    transition: 'project',
    hostSelector: '.project-archive',
    onSelect(index) {
      const counter = $('.project-stage-counter');
      if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    }
  });

  buildArchiveController({
    buttonSelector: '[data-journey-record]',
    panelSelector: '.quest-journal .journey-item',
    activeClass: 'is-active',
    transition: 'quest',
    hostSelector: '.quest-journal'
  });

  function selectHashProject() {
    const match = location.hash.match(/^#project-(erp|ai|chat|mlbb)$/);
    if (!match || !projectController) return;
    const order = ['erp', 'ai', 'chat', 'mlbb'];
    projectController.select(order.indexOf(match[1]));
  }
  selectHashProject();
  addEventListener('hashchange', selectHashProject);

  // One restrained ambience system shared by every chapter. It extends the
  // existing world layer instead of creating competing full-screen effects.
  let atmosphere = $('.world-atmosphere');
  if (!atmosphere) {
    atmosphere = document.createElement('div');
    atmosphere.className = 'world-atmosphere';
    atmosphere.setAttribute('aria-hidden', 'true');
    body.append(atmosphere);
  }
  if (!$('.world-mote-field', atmosphere)) {
    const fog = document.createElement('div');
    fog.className = 'world-fog-banks';
    fog.innerHTML = '<i></i><i></i>';
    const motes = document.createElement('div');
    motes.className = 'world-mote-field';
    for (let index = 0; index < 26; index += 1) {
      const mote = document.createElement('i');
      mote.style.cssText = `--mote-x:${(index * 37 + 11) % 100}%;--mote-y:${(index * 53 + 7) % 100}%;--mote-size:${index % 6 === 0 ? 3 : index % 3 === 0 ? 2 : 1}px;--mote-delay:${(index % 11) * -.73}s;--mote-duration:${12 + index % 9}s`;
      motes.append(mote);
    }
    atmosphere.append(fog, motes);
  }

  const ambientPanels = $$('.character-archive, .project-archive, .quest-journal, .education-ribbon');
  ambientPanels.forEach(panel => {
    if ($('.panel-shimmer', panel)) return;
    const shimmer = document.createElement('span');
    shimmer.className = 'panel-shimmer';
    shimmer.setAttribute('aria-hidden', 'true');
    panel.append(shimmer);
  });

  // Hero materializes once, then settles into an idle character-selection pose.
  const characterStage = $('.character-stage');
  if (characterStage) {
    const scan = document.createElement('span');
    scan.className = 'materialization-scan';
    scan.setAttribute('aria-hidden', 'true');
    const motes = document.createElement('span');
    motes.className = 'hero-idle-motes';
    motes.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 9; index += 1) {
      const mote = document.createElement('i');
      mote.style.cssText = `--hero-x:${12 + (index * 19) % 76}%;--hero-y:${18 + (index * 29) % 66}%;--hero-delay:${index * -.61}s;--hero-drift:${index % 2 ? 13 : -13}px`;
      motes.append(mote);
    }
    characterStage.append(scan, motes);

    const materialize = () => {
      characterStage.classList.add('hero-materializing');
      setTimeout(() => {
        characterStage.classList.remove('hero-materializing');
        characterStage.classList.add('hero-materialized');
      }, reduced.matches ? 0 : 1750);
    };
    setTimeout(materialize, body.classList.contains('codex-intro-running') ? 1700 : 90);

    let portraitShiftTimer = 0;
    characterStage.addEventListener('portraitchange', () => {
      if (reduced.matches) return;
      clearTimeout(portraitShiftTimer);
      characterStage.classList.remove('portrait-transmuting');
      void characterStage.offsetWidth;
      characterStage.classList.add('portrait-transmuting');
      portraitShiftTimer = setTimeout(() => characterStage.classList.remove('portrait-transmuting'), 900);
    });
  }

  // Run expensive idle effects only while their owning scene is visible.
  const ambientScenes = [characterStage, $('.character-archive'), $('.celestial-constellation'), $('.project-archive'), $('.quest-journal'), $('.education-ribbon')].filter(Boolean);
  if (reduced.matches || !('IntersectionObserver' in window)) ambientScenes.forEach(scene => scene.classList.add('ambient-active'));
  else {
    const ambientObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('ambient-active', entry.isIntersecting));
    }, {threshold: .08, rootMargin: '8% 0px 8%'});
    ambientScenes.forEach(scene => ambientObserver.observe(scene));
  }

  let ambientPointerFrame = 0;
  addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || ambientPointerFrame) return;
    ambientPointerFrame = requestAnimationFrame(() => {
      root.style.setProperty('--ambient-x', `${(event.clientX / innerWidth - .5).toFixed(3)}`);
      root.style.setProperty('--ambient-y', `${(event.clientY / innerHeight - .5).toFixed(3)}`);
      const ambientX = (event.clientX / innerWidth - .5) * 18;
      const ambientY = (event.clientY / innerHeight - .5) * 12;
      root.style.setProperty('--ambient-x-px', `${ambientX.toFixed(2)}px`);
      root.style.setProperty('--ambient-y-px', `${ambientY.toFixed(2)}px`);
      root.style.setProperty('--ambient-fog-x', `${(-ambientX * .55).toFixed(2)}px`);
      root.style.setProperty('--ambient-fog-y', `${(-ambientY * .42).toFixed(2)}px`);
      root.style.setProperty('--ambient-mote-x', `${(-ambientX * .24).toFixed(2)}px`);
      root.style.setProperty('--ambient-mote-y', `${(-ambientY * .18).toFixed(2)}px`);
      ambientPointerFrame = 0;
    });
  }, {passive: true});

  const arrivals = [
    $('#profil .about'),
    $('#keahlian .section-heading'),
    $('.celestial-constellation'),
    $('#karya .section-heading'),
    $('.project-archive'),
    $('#perjalanan .section-heading'),
    $('.quest-journal'),
    $('.education-ribbon'),
    $('#kontak')
  ].filter(Boolean);
  arrivals.forEach(element => element.classList.add('unified-arrival'));

  function revealAll() {
    arrivals.forEach(element => element.classList.add('is-arrived'));
  }

  if (reduced.matches || !('IntersectionObserver' in window)) revealAll();
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-arrived');
        observer.unobserve(entry.target);
      });
    }, {threshold: .08, rootMargin: '0px 0px -7%'});
    arrivals.forEach(element => observer.observe(element));
    reduced.addEventListener('change', () => {
      if (!reduced.matches) return;
      observer.disconnect();
      revealAll();
    });
  }
})();
