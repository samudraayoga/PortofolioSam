(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const ease = 'cubic-bezier(.2,.75,.2,1)';

  document.documentElement.classList.add('motion-ready');
  function animate(element, frames, options = {}) {
    if (!element || reduced.matches) return null;
    return element.animate(frames, {duration: 520, easing: ease, fill: 'both', ...options});
  }
  function reveal(element, index = 0) {
    if (!element || element.classList.contains('motion-seen')) return;
    element.classList.add('motion-seen');
    animate(element, [
      {opacity: 0, transform: 'translateY(22px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 620, delay: Math.min(index * 70, 280)});
  }

  // Opening sequence: landscape, portrait frame, then the story and actions.
  if (!reduced.matches && scrollY < 80) {
    animate($('.landscape'), [
      {opacity: .45, transform: 'scale(1.075)'},
      {opacity: 1, transform: 'scale(1.025)'}
    ], {duration: 1200, easing: 'cubic-bezier(.16,.72,.2,1)'});
    $$('.orbit').forEach((element, index) => animate(element, [
      {opacity: 0, scale: .86},
      {opacity: 1, scale: 1}
    ], {duration: 850, delay: 180 + index * 100}));
    animate($('.portrait-card'), [
      {opacity: 0, transform: 'translateY(28px) scale(.94)'},
      {opacity: 1, transform: 'translateY(0) scale(1)'}
    ], {duration: 780, delay: 300});
    $$('.hero-copy > *').forEach((element, index) => animate(element, [
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 600, delay: 260 + Math.min(index * 80, 400)}));
    $$('.case-hero :is(.case-eyebrow,.case-product,h1,.case-lead,.case-hero-actions,.case-summary,.case-hero-foot)').forEach((element, index) => animate(element, [
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 600, delay: 90 + index * 75}));
  }

  // Each chapter reveals once. Siblings receive a restrained stagger.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const groups = [
      '.about > *', '.section-heading > *', '.talent-grid > *', '.works-grid > *',
      '.journey-list > *', '.case-section-heading > *', '.case-story > *',
      '.case-features > *', '.case-stack > *', '.mlbb-gallery > *',
      '.case-closing > .case-container > *'
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
  let parallaxFrame = 0;
  function resetParallax() {
    cancelAnimationFrame(parallaxFrame);
    parallaxFrame = 0;
    if (landscape) landscape.style.transform = '';
  }
  hero?.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || !landscape) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 12 - 6;
    const y = (event.clientY - bounds.top) / bounds.height * 10 - 5;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(() => {
      landscape.style.transform = `translate(${x}px, ${y}px) scale(1.035)`;
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

  // Pointer light follows interactive archive panels.
  $$('.work-card, .talent-card, .case-features article').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    });
  });

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
  $('[data-open-profile]')?.addEventListener('click', event => setDialogOrigin(event.currentTarget, $('#profile-dialog')), {capture: true});
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
    if (reduced.matches) return;
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

  finePointer.addEventListener('change', resetParallax);
  reduced.addEventListener('change', () => {
    resetParallax();
    if (reduced.matches) document.getAnimations().forEach(animation => animation.finish());
  });
})();
